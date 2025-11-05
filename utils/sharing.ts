import { Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS } from '../constants';

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


// v3: Compact tuple format with numeric codes and all fields
type TransactionTupleV3 = [
  string,         // 0: id
  string,         // 1: date
  number,         // 2: type code
  number,         // 3: paymentMethod code
  number,         // 4: bdtAmount
  number | null,  // 5: usdAmount
  number | null,  // 6: usdRate
  number | null,  // 7: bdtCharge
  string | null,  // 8: note
  string | null,  // 9: bankAccount
  number | null,  // 10: toPaymentMethod code
  string | null   // 11: toBankAccount
];


/**
 * Serializes an array of transaction objects into a compact JSON string of tuples.
 * This significantly reduces the length of the string for sharing in a URL.
 * @param transactions The array of Transaction objects.
 * @returns A JSON string representing the transactions as an array of tuples.
 */
export const serializeTransactionsForSharing = (transactions: Transaction[]): string => {
  const tuples: TransactionTupleV3[] = transactions.map(tx => [
    tx.id,
    tx.date,
    typeToCode[tx.type],
    methodToCode[tx.paymentMethod] ?? -1,
    tx.bdtAmount,
    tx.usdAmount ?? null,
    tx.usdRate ?? null,
    tx.bdtCharge ?? null,
    tx.note ?? null,
    tx.bankAccount ?? null,
    tx.toPaymentMethod ? methodToCode[tx.toPaymentMethod] : null,
    tx.toBankAccount ?? null
  ]);
  // Prepending a version marker to handle future format changes easily
  return JSON.stringify(['v3', tuples]);
};


// v2: Old compact tuple format
type TransactionTupleV2 = [
  string, // id
  string, // date
  TransactionType, // type
  string, // paymentMethod
  number | null, // usdAmount
  number | null, // usdRate
  number | null, // bdtCharge
  number, // bdtAmount
  string | null // note
];


/**
 * Deserializes a JSON string of transaction tuples back into an array of transaction objects.
 * It includes a fallback mechanism to parse old links that used the full JSON object format (v1)
 * or the previous tuple format (v2).
 * @param jsonString The compact JSON string from the share link.
 * @returns An array of Transaction objects.
 */
export const deserializeTransactionsForSharing = (jsonString: string): Transaction[] => {
  const parsedData = JSON.parse(jsonString);

  // Check for new versioned format (v3)
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

  // Check if it's the old tuple format (v2) (array of arrays, first element is not a version marker)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || Array.isArray(parsedData[0]))) {
    console.log("Parsing data from a v2 share link format.");
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
  
  // Fallback for old links (v1 - array of objects)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || typeof parsedData[0] === 'object')) {
    console.log("Parsing data from a legacy (v1) share link format.");
    return parsedData as Transaction[];
  }

  throw new Error("Invalid shared data format.");
};
