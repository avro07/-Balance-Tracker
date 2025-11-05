import { Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS, BANK_ACCOUNTS } from '../constants';

// EPOCH for date encoding to save characters in the URL
const EPOCH = new Date('2020-01-01T00:00:00Z').getTime();
const MS_IN_DAY = 1000 * 60 * 60 * 24;

// Mappings for compactness
const typeToCode: { [key in TransactionType]: number } = {
  [TransactionType.BUY]: 0,
  [TransactionType.SELL]: 1,
  [TransactionType.DEPOSIT]: 2,
  [TransactionType.WITHDRAW]: 3,
  [TransactionType.TRANSFER]: 4,
};
const codeToType = Object.values(TransactionType);

const methodToCode: { [key: string]: number } = PAYMENT_METHODS.reduce((acc, method, index) => {
  acc[method] = index;
  return acc;
}, {} as { [key: string]: number });
const codeToMethod = PAYMENT_METHODS;

const bankToCode: { [key: string]: number } = BANK_ACCOUNTS.reduce((acc, bank, index) => {
  acc[bank] = index;
  return acc;
}, {} as { [key: string]: number });
const codeToBank = BANK_ACCOUNTS;

// v4: Ultra-compact tuple format.
// Omits ID, encodes date as number, encodes enums/banks as numbers.
// Fields with `null` can be omitted from the end of the array to save space.
type TransactionTupleV4 = [
  number,         // 0: date (days since epoch)
  number,         // 1: type code
  number,         // 2: paymentMethod code
  number,         // 3: bdtAmount
  (number | null)?,  // 4: usdAmount
  (number | null)?,  // 5: usdRate
  (number | null)?,  // 6: bdtCharge
  (string | null)?,  // 7: note
  (number | null)?,  // 8: bankAccount code
  (number | null)?,  // 9: toPaymentMethod code
  (number | null)?   // 10: toBankAccount code
];

/**
 * Serializes an array of transaction objects into a highly compact JSON string of tuples.
 * This significantly reduces the length of the string for sharing in a URL.
 * @param transactions The array of Transaction objects.
 * @returns A JSON string representing the transactions as an array of tuples.
 */
export const serializeTransactionsForSharing = (transactions: Transaction[]): string => {
  const tuples: TransactionTupleV4[] = transactions.map(tx => {
    // Date to days since epoch
    const dateInMs = new Date(tx.date).getTime();
    const daysSinceEpoch = Math.round((dateInMs - EPOCH) / MS_IN_DAY);

    const tuple: TransactionTupleV4 = [
      daysSinceEpoch,
      typeToCode[tx.type],
      methodToCode[tx.paymentMethod] ?? -1,
      tx.bdtAmount,
      tx.usdAmount ?? null,
      tx.usdRate ?? null,
      tx.bdtCharge ?? null,
      tx.note || null,
      tx.bankAccount ? bankToCode[tx.bankAccount] : null,
      tx.toPaymentMethod ? methodToCode[tx.toPaymentMethod] : null,
      tx.toBankAccount ? bankToCode[tx.toBankAccount] : null,
    ];

    // To save space, remove any trailing null values from the tuple.
    while (tuple.length > 0 && tuple[tuple.length - 1] === null) {
      tuple.pop();
    }
    
    return tuple;
  });
  // Prepending a version marker to handle future format changes easily
  return JSON.stringify(['v4', tuples]);
};


// OLD FORMATS FOR DESERIALIZATION FALLBACK
type TransactionTupleV3 = [string, string, number, number, number, number | null, number | null, number | null, string | null, string | null, number | null, string | null];
type TransactionTupleV2 = [string, string, TransactionType, string, number | null, number | null, number | null, number, string | null];


/**
 * Deserializes a JSON string of transaction tuples back into an array of transaction objects.
 * It includes a fallback mechanism to parse old links that used other formats.
 * @param jsonString The compact JSON string from the share link.
 * @returns An array of Transaction objects.
 */
export const deserializeTransactionsForSharing = (jsonString: string): Transaction[] => {
  const parsedData = JSON.parse(jsonString);

  // Check for new versioned format (v4)
  if (Array.isArray(parsedData) && parsedData[0] === 'v4' && Array.isArray(parsedData[1])) {
    const tuples = parsedData[1] as TransactionTupleV4[];
    return tuples.map((tuple, index) => {
      // Days since epoch to date string
      const dateInMs = EPOCH + (tuple[0] * MS_IN_DAY);
      const date = new Date(dateInMs).toISOString().split('T')[0];

      const transaction: Transaction = {
        id: `s-${index}`, // Generate a simple, short ID
        date: date,
        type: codeToType[tuple[1]],
        paymentMethod: codeToMethod[tuple[2]],
        bdtAmount: tuple[3],
        usdAmount: tuple[4] ?? undefined,
        usdRate: tuple[5] ?? undefined,
        bdtCharge: tuple[6] ?? undefined,
        note: tuple[7] ?? undefined,
        bankAccount: (tuple[8] !== null && tuple[8] !== undefined) ? codeToBank[tuple[8]] : undefined,
        toPaymentMethod: (tuple[9] !== null && tuple[9] !== undefined) ? codeToMethod[tuple[9]] : undefined,
        toBankAccount: (tuple[10] !== null && tuple[10] !== undefined) ? codeToBank[tuple[10]] : undefined,
      };
      
      return transaction;
    });
  }

  // Fallback for v3
  if (Array.isArray(parsedData) && parsedData[0] === 'v3' && Array.isArray(parsedData[1])) {
    const tuples = parsedData[1] as TransactionTupleV3[];
    return tuples.map(tuple => {
      const transaction: Transaction = {
        id: tuple[0],
        date: tuple[1],
        type: codeToType[tuple[2]],
        paymentMethod: codeToMethod[tuple[3]],
        bdtAmount: tuple[4],
      };
      if (tuple[5] !== null) transaction.usdAmount = tuple[5];
      if (tuple[6] !== null) transaction.usdRate = tuple[6];
      if (tuple[7] !== null) transaction.bdtCharge = tuple[7];
      if (tuple[8] !== null) transaction.note = tuple[8];
      if (tuple[9] !== null) transaction.bankAccount = tuple[9];
      if (tuple[10] !== null) transaction.toPaymentMethod = codeToMethod[tuple[10]];
      if (tuple[11] !== null) transaction.toBankAccount = tuple[11];
      
      return transaction;
    });
  }

  // Fallback for v2 (array of arrays, first element is not a version marker)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || Array.isArray(parsedData[0]))) {
    const tuples = parsedData as TransactionTupleV2[];
    return tuples.map(tuple => {
      const transaction: Transaction = {
        id: tuple[0],
        date: tuple[1],
        type: tuple[2],
        paymentMethod: tuple[3],
        bdtAmount: tuple[7],
      };
      if (tuple[4] !== null) transaction.usdAmount = tuple[4];
      if (tuple[5] !== null) transaction.usdRate = tuple[5];
      if (tuple[6] !== null) transaction.bdtCharge = tuple[6];
      if (tuple[8] !== null) transaction.note = tuple[8];
      
      return transaction;
    });
  }
  
  // Fallback for v1 (array of objects)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || typeof parsedData[0] === 'object')) {
    return parsedData as Transaction[];
  }

  throw new Error("Invalid shared data format.");
};