import { Transaction, TransactionType } from '../types';

// A compact representation of a transaction for sharing.
type TransactionTuple = [
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
 * Serializes an array of transaction objects into a compact JSON string of tuples.
 * This significantly reduces the length of the string for sharing in a URL.
 * @param transactions The array of Transaction objects.
 * @returns A JSON string representing the transactions as an array of tuples.
 */
export const serializeTransactionsForSharing = (transactions: Transaction[]): string => {
  const tuples: TransactionTuple[] = transactions.map(tx => [
    tx.id,
    tx.date,
    tx.type,
    tx.paymentMethod,
    tx.usdAmount ?? null,
    tx.usdRate ?? null,
    tx.bdtCharge ?? null,
    tx.bdtAmount,
    tx.note ?? null
  ]);
  return JSON.stringify(tuples);
};

/**
 * Deserializes a JSON string of transaction tuples back into an array of transaction objects.
 * It includes a fallback mechanism to parse old links that used the full JSON object format.
 * @param jsonString The compact JSON string from the share link.
 * @returns An array of Transaction objects.
 */
export const deserializeTransactionsForSharing = (jsonString: string): Transaction[] => {
  const parsedData = JSON.parse(jsonString);

  // Check if it's the new tuple format (array of arrays)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || Array.isArray(parsedData[0]))) {
    const tuples = parsedData as TransactionTuple[];
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
  
  // Fallback for old links (array of objects)
  if (Array.isArray(parsedData) && (parsedData.length === 0 || typeof parsedData[0] === 'object')) {
    console.log("Parsing data from a legacy share link format.");
    return parsedData as Transaction[];
  }

  throw new Error("Invalid shared data format.");
};
