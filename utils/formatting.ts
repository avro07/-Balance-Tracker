

export const formatCurrency = (amount: number, currency: 'BDT' | 'USD' = 'BDT', maximumFractionDigits = 2) => {
  if (currency === 'BDT') {
    const formattedString = amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `৳${formattedString}`;
  }
  
  // For USD, use standard en-US formatting
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: maximumFractionDigits,
  });
  return formatter.format(amount);
};


export const formatRate = (rate?: number, maximumFractionDigits = 6) => {
    if (rate === undefined || rate === null) return 'N/A';
    const formattedString = rate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    });
    return `৳${formattedString}`;
};


export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};