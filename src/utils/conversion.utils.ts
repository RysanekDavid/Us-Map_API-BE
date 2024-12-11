export const stringToNumber = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^\d.-]/g, ''));
};

export const numberToString = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0';
  return value.toString();
};

export const calculatePercentage = (value: string, total: string): number => {
  const numValue = stringToNumber(value);
  const numTotal = stringToNumber(total);
  if (numTotal === 0) return 0;
  return (numValue / numTotal) * 100;
};
