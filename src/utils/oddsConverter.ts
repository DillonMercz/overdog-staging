// utils/oddsConverter.ts
export const convertOdds = (americanOdds: number, format: 'american' | 'european'): string => {
  if (format === 'american') return americanOdds.toString();
  
  // Convert American to Decimal (European)
  if (americanOdds > 0) {
    return ((americanOdds / 100) + 1).toFixed(2);
  } else {
    return ((-100 / americanOdds) + 1).toFixed(2);
  }
};