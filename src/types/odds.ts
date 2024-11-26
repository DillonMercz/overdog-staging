// types/odds.ts
export type OddsFormat = 'american' | 'decimal' | 'fractional';
export type ServiceOddsFormat = 'american' | 'european';

export interface OddsFormatConfig {
  format: OddsFormat;
  label: string;
  symbol: string;
}

// Utility functions for odds conversion
export const convertOdds = (americanOdds: number, format: OddsFormat): string => {
  switch (format) {
    case 'decimal':
      if (americanOdds > 0) {
        return ((americanOdds / 100) + 1).toFixed(2);
      }
      return ((-100 / americanOdds) + 1).toFixed(2);
      
    case 'fractional':
      // Common odds conversions
      switch (americanOdds) {
        case -110: return '10/11';
        case 100: return 'EVS';
        case -120: return '5/6';
        case 120: return '6/5';
        case -150: return '2/3';
        case 150: return '3/2';
        case -200: return '1/2';
        case 200: return '2/1';
      }
      
      if (americanOdds > 0) {
        const decimal = americanOdds / 100;
        let num = Math.round(decimal);
        return `${num}/1`;
      } else {
        const decimal = -100 / americanOdds;
        const num = 1;
        const den = Math.round(1/decimal);
        return `${num}/${den}`;
      }
      
    case 'american':
    default:
      return americanOdds.toString();
  }
};

export const getServiceOddsFormat = (format: OddsFormat): ServiceOddsFormat => {
  if (format === 'american') return 'american';
  return 'european'; // both decimal and fractional are treated as european
};

// Helper functions for odds validation and conversion
export const isValidOddsFormat = (format: string): format is OddsFormat => {
  return ['american', 'decimal', 'fractional'].includes(format);
};

export const getDefaultOddsFormat = (region: string): OddsFormat => {
  switch (region) {
    case 'UK':
      return 'fractional';
    case 'US':
      return 'american';
    case 'EU':
    case 'OTHER':
    default:
      return 'decimal';
  }
};