
export const formatCurrency = (amount: number, currency: 'BDT' | 'USD' = 'BDT', maximumFractionDigits = 2) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: maximumFractionDigits,
  });

  if (currency === 'BDT') {
      return `৳${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  // For USD, Intl.NumberFormat will produce '$' symbol.
  return formatter.format(amount);
};

export const formatRate = (rate?: number, maximumFractionDigits = 6) => {
    if (rate === undefined || rate === null) return 'N/A';
    return `৳${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits })}`;
};


export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};