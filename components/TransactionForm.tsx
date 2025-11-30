
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS, BANK_ACCOUNTS } from '../constants';
import { getTodayDateString } from '../utils/formatting';
import { CloseIcon, CameraIcon } from './Icons';

interface TransactionFormProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  transactionToEdit?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onAddTransaction, onUpdateTransaction, transactionToEdit }) => {
  const [date, setDate] = useState(getTodayDateString());
  const [type, setType] = useState<TransactionType>(TransactionType.BUY);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [bankAccount, setBankAccount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [usdRate, setUsdRate] = useState('');
  const [bdtCharge, setBdtCharge] = useState('0');
  const [bdtAmount, setBdtAmount] = useState('');
  const [note, setNote] = useState('');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Transfer type
  const [toPaymentMethod, setToPaymentMethod] = useState('Bank');
  const [toBankAccount, setToBankAccount] = useState('');
  
  const isEditing = !!transactionToEdit;
  const isUsdTransaction = type === TransactionType.BUY || type === TransactionType.SELL;
  const isBankTransaction = paymentMethod === 'Bank';
  const isTransfer = type === TransactionType.TRANSFER;

  useEffect(() => {
    if (isEditing && transactionToEdit) {
      const { type: txType } = transactionToEdit;
      setDate(transactionToEdit.date);
      setType(txType);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setBankAccount(transactionToEdit.bankAccount ?? '');
      setBdtAmount(transactionToEdit.bdtAmount.toString());
      setNote(transactionToEdit.note ?? '');
      setScreenshot(transactionToEdit.screenshot);
      
      if (txType === TransactionType.BUY || txType === TransactionType.SELL) {
          setUsdAmount(transactionToEdit.usdAmount?.toString() ?? '');
          setUsdRate(transactionToEdit.usdRate?.toString() ?? '');
          setBdtCharge(transactionToEdit.bdtCharge?.toString() ?? '0');
      } else if (txType === TransactionType.TRANSFER) {
          setToPaymentMethod(transactionToEdit.toPaymentMethod ?? 'Bank');
          setToBankAccount(transactionToEdit.toBankAccount ?? '');
      } else {
          setUsdAmount('');
          setUsdRate('');
          setBdtCharge('0');
      }
    }
  }, [transactionToEdit, isEditing]);

  const calculatedBdtAmount = useMemo(() => {
    if (!isUsdTransaction) return 0;
    const uAmount = parseFloat(usdAmount) || 0;
    const uRate = parseFloat(usdRate) || 0;
    const bCharge = parseFloat(bdtCharge) || 0;
    return (uAmount * uRate) + bCharge;
  }, [isUsdTransaction, usdAmount, usdRate, bdtCharge]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setErrors({}); // Clear errors on type change
    setNote(''); // Clear note on type change
    setScreenshot(undefined); // Clear screenshot on type change
    setBdtAmount('');
    const isNewTypeUsd = newType === TransactionType.BUY || newType === TransactionType.SELL;
    if (!isNewTypeUsd) {
      setUsdAmount('');
      setUsdRate('');
      setBdtCharge('0');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress image to JPEG with 0.6 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setScreenshot(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const clearScreenshot = () => {
    setScreenshot(undefined);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!date.trim()) newErrors.date = 'Date is required.';

    if (isTransfer) {
        if (!bankAccount) newErrors.bankAccount = 'Source bank is required.';
        if (toPaymentMethod === 'Bank' && !toBankAccount) {
            newErrors.toBankAccount = 'Destination bank is required.';
        }
        if (bankAccount && toPaymentMethod === 'Bank' && toBankAccount && bankAccount === toBankAccount) {
          newErrors.toBankAccount = 'Destination cannot be the same as the source.';
        }
        const bAmount = parseFloat(bdtAmount);
        if (!bdtAmount.trim()) newErrors.bdtAmount = 'Amount is required.';
        else if (isNaN(bAmount) || bAmount <= 0) newErrors.bdtAmount = 'Must be a positive number.';
    } else if (isUsdTransaction) {
        if (paymentMethod === 'Bank' && !bankAccount) {
            newErrors.bankAccount = 'Bank Account is required.';
        }
        const uAmount = parseFloat(usdAmount);
        const uRate = parseFloat(usdRate);
        const bCharge = parseFloat(bdtCharge);

        if (!usdAmount.trim()) newErrors.usdAmount = 'USD Amount is required.';
        else if (isNaN(uAmount) || uAmount <= 0) newErrors.usdAmount = 'Must be a positive number.';
        
        if (!usdRate.trim()) newErrors.usdRate = 'USD Rate is required.';
        else if (isNaN(uRate) || uRate <= 0) newErrors.usdRate = 'Must be a positive number.';
        
        if (!bdtCharge.trim()) newErrors.bdtCharge = 'BDT Charge is required.';
        else if (isNaN(bCharge) || bCharge < 0) newErrors.bdtCharge = 'Cannot be negative.';
    } else { // Deposit or Withdraw
        if (paymentMethod === 'Bank' && !bankAccount) {
            newErrors.bankAccount = 'Bank Account is required.';
        }
        const bAmount = parseFloat(bdtAmount);
        if (!bdtAmount.trim()) newErrors.bdtAmount = 'BDT Amount is required.';
        else if (isNaN(bAmount) || bAmount <= 0) newErrors.bdtAmount = 'Must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    let payload: Omit<Transaction, 'id' | 'runningBdtBalance' | 'runningUsdBalance'>;

    if (isTransfer) {
        payload = {
            date, type,
            paymentMethod: 'Bank', // 'from' is always Bank for transfers
            bankAccount, // 'from' bank account
            toPaymentMethod,
            toBankAccount: toPaymentMethod === 'Bank' ? toBankAccount : undefined,
            bdtAmount: parseFloat(bdtAmount),
            note: note.trim() ? note.trim() : undefined,
            screenshot: undefined, // Transfer doesn't support screenshot per requirement
        };
    } else if (isUsdTransaction) {
        payload = {
            date, type, paymentMethod,
            usdAmount: parseFloat(usdAmount),
            usdRate: parseFloat(usdRate),
            bdtCharge: parseFloat(bdtCharge) || 0,
            bdtAmount: calculatedBdtAmount,
            note: note.trim() ? note.trim() : undefined,
            ...(paymentMethod === 'Bank' && { bankAccount }),
            screenshot: undefined, // Buy/Sell doesn't support screenshot per requirement
        };
    } else { // Deposit or Withdraw
        payload = {
            date, type, paymentMethod,
            bdtAmount: parseFloat(bdtAmount),
            note: note.trim() ? note.trim() : undefined,
            ...(paymentMethod === 'Bank' && { bankAccount }),
            screenshot,
        };
    }
    
    if (isEditing) {
        onUpdateTransaction({ ...payload, id: transactionToEdit.id });
    } else {
        onAddTransaction(payload);
    }
    
    onClose();
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errors[field]) {
          setErrors(prev => ({...prev, [field]: ''}));
      }
  };

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setter(value);
      if (field === 'paymentMethod' && value !== 'Bank') {
          setBankAccount('');
          if(errors.bankAccount) setErrors(prev => ({...prev, bankAccount: ''}));
      }
       if (field === 'toPaymentMethod' && value !== 'Bank') {
          setToBankAccount('');
          if(errors.toBankAccount) setErrors(prev => ({...prev, toBankAccount: ''}));
      }
      if (errors[field]) {
          setErrors(prev => ({...prev, [field]: ''}));
      }
  };

  const getNotePlaceholder = () => {
    switch(type) {
        case TransactionType.DEPOSIT: return "e.g., Initial capital";
        case TransactionType.WITHDRAW: return "e.g., Office expenses";
        case TransactionType.TRANSFER: return "e.g., Monthly transfer";
        case TransactionType.BUY: return "e.g., Payment for USD";
        case TransactionType.SELL: return "e.g., Sold USD to Client";
        default: return "e.g., Description";
    }
  };

  const renderNoteAndScreenshot = () => {
    // Only allow screenshot for Deposit and Withdraw
    const supportsScreenshot = type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAW;

    return (
      <div className="flex gap-2">
          <div className="flex-grow">
          <TextAreaField
              label="Note (Optional)"
              placeholder={getNotePlaceholder()}
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
          />
          </div>
          {supportsScreenshot && (
            <div className="flex flex-col justify-end pb-1">
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
            />
            <div className="relative">
                {screenshot ? (
                    <div className="relative group">
                        <img src={screenshot} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-slate-300 dark:border-slate-600" />
                        <button 
                            type="button" 
                            onClick={clearScreenshot}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                        >
                            <CloseIcon className="w-3 h-3 text-white" />
                        </button>
                    </div>
                ) : (
                        <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Upload Screenshot"
                    >
                        <CameraIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">Proof</span>
                    </button>
                )}
            </div>
            </div>
          )}
      </div>
    );
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200/60 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-rose-200/60 dark:border-rose-500/20 flex justify-between items-center sticky top-0 bg-inherit z-10 rounded-t-lg">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{isEditing ? 'Edit' : 'New'} {isTransfer ? 'Transfer' : 'Transaction'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" type="date" value={date} onChange={handleInputChange(setDate, 'date')} required error={errors.date} />
            <SelectField label="Type" value={type} onChange={e => handleTypeChange(e.target.value as TransactionType)}>
              {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </div>
          
          {isTransfer ? (
            <>
              <InputField label="Amount (BDT)" type="number" placeholder="e.g., 5000" value={bdtAmount} onChange={handleInputChange(setBdtAmount, 'bdtAmount')} required error={errors.bdtAmount}/>
              <SelectField label="From Bank Account" value={bankAccount} onChange={handleSelectChange(setBankAccount, 'bankAccount')} error={errors.bankAccount}>
                <option value="" disabled>Select a source bank</option>
                {BANK_ACCOUNTS.map(b => <option key={b} value={b}>{b}</option>)}
              </SelectField>
              <div className="flex items-start gap-4">
                <div className={toPaymentMethod === 'Bank' ? 'w-1/2' : 'w-full'}>
                  <SelectField label="To Destination" value={toPaymentMethod} onChange={handleSelectChange(setToPaymentMethod, 'toPaymentMethod')}>
                    <option value="Bank">Bank</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </SelectField>
                </div>
                {toPaymentMethod === 'Bank' && (
                  <div className="w-1/2">
                    <SelectField label="To Bank Account" value={toBankAccount} onChange={handleSelectChange(setToBankAccount, 'toBankAccount')} error={errors.toBankAccount}>
                      <option value="" disabled>Select a destination bank</option>
                      {BANK_ACCOUNTS.map(b => <option key={b} value={b}>{b}</option>)}
                    </SelectField>
                  </div>
                )}
              </div>
              
              {renderNoteAndScreenshot()}
            </>
          ) : isUsdTransaction ? (
            <>
              <div className="flex items-start gap-4">
                <div className={isBankTransaction ? 'w-1/2' : 'w-full'}>
                  <SelectField label="Payment Method" value={paymentMethod} onChange={handleSelectChange(setPaymentMethod, 'paymentMethod')}>
                    {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                  </SelectField>
                </div>
                {isBankTransaction && (
                  <div className="w-1/2">
                    <SelectField label="Bank Account" value={bankAccount} onChange={handleSelectChange(setBankAccount, 'bankAccount')} error={errors.bankAccount}>
                      <option value="" disabled>Select a bank</option>
                      {BANK_ACCOUNTS.map(b => <option key={b} value={b}>{b}</option>)}
                    </SelectField>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="USD Amount" type="number" placeholder="e.g., 100" value={usdAmount} onChange={handleInputChange(setUsdAmount, 'usdAmount')} required error={errors.usdAmount}/>
                <InputField label="USD Rate" type="number" placeholder="e.g., 115.50" value={usdRate} onChange={handleInputChange(setUsdRate, 'usdRate')} required step="any" error={errors.usdRate} />
              </div>
               <InputField label="BDT Charge" type="number" placeholder="e.g., 250" value={bdtCharge} onChange={handleInputChange(setBdtCharge, 'bdtCharge')} step="any" error={errors.bdtCharge} />
              <div className="bg-gradient-to-br from-sky-50 to-white dark:from-slate-700/50 dark:to-slate-800/50 p-3 rounded-lg text-center border border-slate-200/60 dark:border-slate-600 shadow-sm">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Calculated BDT Amount</p>
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{calculatedBdtAmount.toLocaleString('en-IN', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 })}</p>
              </div>

              {renderNoteAndScreenshot()}
            </>
          ) : ( // Deposit or Withdraw
            <>
               <div className="flex items-start gap-4">
                <div className={isBankTransaction ? 'w-1/2' : 'w-full'}>
                  <SelectField label="Payment Method" value={paymentMethod} onChange={handleSelectChange(setPaymentMethod, 'paymentMethod')}>
                    {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                  </SelectField>
                </div>
                {isBankTransaction && (
                  <div className="w-1/2">
                    <SelectField label="Bank Account" value={bankAccount} onChange={handleSelectChange(setBankAccount, 'bankAccount')} error={errors.bankAccount}>
                      <option value="" disabled>Select a bank</option>
                      {BANK_ACCOUNTS.map(b => <option key={b} value={b}>{b}</option>)}
                    </SelectField>
                  </div>
                )}
              </div>
              <InputField label="BDT Amount" type="number" placeholder="e.g., 50000" value={bdtAmount} onChange={handleInputChange(setBdtAmount, 'bdtAmount')} required error={errors.bdtAmount} />
              
              {renderNoteAndScreenshot()}
            </>
          )}

          <div className="flex justify-end pt-4">
            <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                {isEditing ? 'Update' : 'Add'} {isTransfer ? 'Transfer' : 'Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <input {...props} className={`w-full px-3 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <textarea {...props} className={`w-full px-3 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string }> = ({ label, children, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <select {...props} className={`w-full px-3 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

export default TransactionForm;
