import { Transaction } from '../types';

export const downloadCSV = (data: Transaction[], filename: string) => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Payment Method', 'USD Amount', 'USD Rate', 'BDT Charge', 'BDT Amount', 'Note', 'Available BDT Balance', 'Available USD Balance'];
  const csvRows = [headers.join(',')];

  // The data is passed in descending order, for export it might be better to show it chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id));


  sortedData.forEach(tx => {
    const row = [
      tx.id,
      tx.date,
      tx.type,
      tx.paymentMethod,
      tx.usdAmount?.toFixed(2) ?? 'N/A',
      tx.usdRate?.toFixed(2) ?? 'N/A',
      tx.bdtCharge?.toFixed(2) ?? 'N/A',
      tx.bdtAmount.toFixed(2),
      // Use " " to ensure the value is treated as a string, especially if it contains commas
      `"${tx.note ?? ''}"`,
      tx.runningBdtBalance?.toFixed(2) ?? 'N/A',
      tx.runningUsdBalance?.toFixed(2) ?? 'N/A'
    ].join(',');
    csvRows.push(row);
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
