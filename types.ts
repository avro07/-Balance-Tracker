export enum TransactionType {
  BUY = 'Buy',
  SELL = 'Sell',
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  paymentMethod: string;
  usdAmount?: number;
  usdRate?: number;
  bdtCharge?: number;
  bdtAmount: number;
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
}