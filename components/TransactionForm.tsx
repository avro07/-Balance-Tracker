import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { getTodayDateString } from '../utils/formatting';
import { CloseIcon } from './Icons';

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
  const [usdAmount, setUsdAmount] = useState('');
  const [usdRate, setUsdRate] = useState('');
  const [bdtCharge, setBdtCharge] = useState('0');
  const [bdtAmount, setBdtAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const isEditing = !!transactionToEdit;
  const isUsdTransaction = type === TransactionType.BUY || type === TransactionType.SELL;

  useEffect(() => {
    if (isEditing && transactionToEdit) {
      setDate(transactionToEdit.date);
      setType(transactionToEdit.type);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setBdtAmount(transactionToEdit.bdtAmount.toString());
      setNote(transactionToEdit.note ?? '');
      
      const isInitialTypeUsd = transactionToEdit.type === TransactionType.BUY || transactionToEdit.type === TransactionType.SELL;
      if (isInitialTypeUsd) {
          setUsdAmount(transactionToEdit.usdAmount?.toString() ?? '');
          setUsdRate(transactionToEdit.usdRate?.toString() ?? '');
          setBdtCharge(transactionToEdit.bdtCharge?.toString() ?? '0');
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
    const isNewTypeUsd = newType === TransactionType.BUY || newType === TransactionType.SELL;
    if (!isNewTypeUsd) {
      setUsdAmount('');
      setUsdRate('');
      setBdtCharge('0');
    } else {
      setBdtAmount('');
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!date.trim()) newErrors.date = 'Date is required.';

    if (isUsdTransaction) {
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
        const bAmount = parseFloat(bdtAmount);
        if (!bdtAmount.trim()) newErrors.bdtAmount = 'BDT Amount is required.';
        else if (isNaN(bAmount) || bAmount <= 0) newErrors.bdtAmount = 'Must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (isUsdTransaction) {
        const payload = {
            date, type, paymentMethod,
            usdAmount: parseFloat(usdAmount),
            usdRate: parseFloat(usdRate),
            bdtCharge: parseFloat(bdtCharge) || 0,
            bdtAmount: calculatedBdtAmount,
        };
        if (isEditing) {
            onUpdateTransaction({ ...payload, id: transactionToEdit.id });
        } else {
            onAddTransaction(payload);
        }
    } else {
        const payload: Omit<Transaction, 'id' | 'runningBdtBalance' | 'runningUsdBalance'> = {
            date, type, paymentMethod,
            bdtAmount: parseFloat(bdtAmount),
            note: (type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAW) && note.trim() ? note.trim() : undefined,
        };
        if (isEditing) {
            onUpdateTransaction({ ...payload, id: transactionToEdit.id });
        } else {
            onAddTransaction(payload);
        }
    }
    
    onClose();
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errors[field]) {
          setErrors(prev => ({...prev, [field]: ''}));
      }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" type="date" value={date} onChange={handleInputChange(setDate, 'date')} required error={errors.date} />
            <SelectField label="Type" value={type} onChange={e => handleTypeChange(e.target.value as TransactionType)}>
              {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </div>
          <SelectField label="Payment Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
          </SelectField>
          
          {isUsdTransaction ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="USD Amount" type="number" placeholder="e.g., 100" value={usdAmount} onChange={handleInputChange(setUsdAmount, 'usdAmount')} required error={errors.usdAmount}/>
                <InputField label="USD Rate" type="number" placeholder="e.g., 115.50" value={usdRate} onChange={handleInputChange(setUsdRate, 'usdRate')} required step="any" error={errors.usdRate} />
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <InputField label="BDT Charge" type="number" placeholder="e.g., 250" value={bdtCharge} onChange={handleInputChange(setBdtCharge, 'bdtCharge')} step="any" error={errors.bdtCharge} />
                <div>
                  <button type="submit" className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 w-full">
                    {isEditing ? 'Update Transaction' : 'Add Transaction'}
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                  <p className="text-sm text-slate-500">Calculated BDT Amount</p>
                  <p className="font-bold text-lg text-slate-800">{calculatedBdtAmount.toLocaleString('en-IN', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 })}</p>
              </div>
            </>
          ) : (
            <>
              <InputField label="BDT Amount" type="number" placeholder="e.g., 50000" value={bdtAmount} onChange={handleInputChange(setBdtAmount, 'bdtAmount')} required error={errors.bdtAmount} />
              {(type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAW) && (
                <TextAreaField
                  label="Note (Optional)"
                  placeholder={type === TransactionType.DEPOSIT ? "e.g., Initial capital" : "e.g., Office expenses"}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                />
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Cancel</button>
            {!isUsdTransaction && (
                <button type="submit" className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{isEditing ? 'Update Transaction' : 'Add Transaction'}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className={`w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <textarea {...props} className={`w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {children}
        </select>
    </div>
);

export default TransactionForm;