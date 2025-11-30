
export enum TransactionType {
  BUY = 'Buy',
  SELL = 'Sell',
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  TRANSFER = 'Transfer',
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  paymentMethod: string; // For Transfer, this is the 'from' method
  bankAccount?: string; // For Transfer, this is the 'from' bank account
  toPaymentMethod?: string;
  toBankAccount?: string;
  usdAmount?: number;
  usdRate?: number;
  bdtCharge?: number;
  bdtAmount: number;
  note?: string;
  screenshot?: string; // Base64 encoded string
  runningBdtBalance?: number;
  runningUsdBalance?: number;
}

export interface DailySummary {
  totalBuyUSD: number;
  totalBuyBDT: number;
  totalSellUSD: number;
  totalSellBDT: number;
  profit: number;
}

export interface GlobalSummaries {
    bdtBalance: number;
    usdBalance: number;
    totalBuy: number;
    totalSell: number;
    totalChargesBdt: number;
    totalTransactions: number;
    bdtBalanceByMethod: { [key: string]: number };
    bdtBalanceByBank: { [key: string]: number };
}