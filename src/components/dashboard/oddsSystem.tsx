import { useState, useEffect } from 'react';
import { 
  OddsFormat, 
  OddsFormatConfig
} from '../../types/odds';

type RegionCode = 'UK' | 'EU' | 'US' | 'OTHER';

interface OddsSystemProps {
  onChange: (format: OddsFormat) => void;
}

const OddsSystem: React.FC<OddsSystemProps> = ({ onChange }) => {
  const [selectedFormat, setSelectedFormat] = useState<OddsFormat>('decimal');
  const [detectedRegion, setDetectedRegion] = useState<RegionCode>('EU');

  const formatConfigs: OddsFormatConfig[] = [
    { format: 'decimal', label: 'Decimal', symbol: '1.91' },
    { format: 'fractional', label: 'Fractional', symbol: '10/11' },
    { format: 'american', label: 'American', symbol: '-110' }
  ];

  const detectRegion = (): RegionCode => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // European Detection first - based on timezone
    if (timezone.startsWith('Europe/')) {
      // Special case for UK
      if (timezone === 'Europe/London') {
        return 'UK';
      }
      // All other European timezones
      return 'EU';
    }
  
    // Secondary timezone checks
    if (timezone === 'CET' || timezone === 'CEST') {
      return 'EU';
    }
  
    // US Detection
    if (timezone.includes('America/')) {
      return 'US';
    }
  
    // Fallback to language only if timezone is inconclusive
    const language = navigator.language.toLowerCase();
    if (language === 'en-gb') {
      return 'UK';
    }
    if (language === 'en-us') {
      return 'US';
    }
  
    return 'OTHER';
  };

  useEffect(() => {
    const savedFormat = localStorage.getItem('oddsFormat') as OddsFormat;
    
    if (savedFormat) {
      setSelectedFormat(savedFormat);
      onChange(savedFormat);
    } else {
      const region = detectRegion();
      setDetectedRegion(region);
      
      const formatByRegion: { [key in RegionCode]: OddsFormat } = {
        'UK': 'fractional',
        'EU': 'decimal',
        'US': 'american',
        'OTHER': 'decimal'
      };
      
      const newFormat = formatByRegion[region];
      setSelectedFormat(newFormat);
      onChange(newFormat);
      localStorage.setItem('oddsFormat', newFormat);
    }
  }, [onChange]);

  const handleFormatChange = (format: OddsFormat) => {
    setSelectedFormat(format);
    onChange(format);
    localStorage.setItem('oddsFormat', format);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {formatConfigs.map(config => (
          <button
            key={config.format}
            onClick={() => handleFormatChange(config.format)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedFormat === config.format
                ? 'bg-[#4263EB] text-white shadow-lg'
                : 'bg-[#13131A] text-[#8F9BB3] hover:text-white hover:bg-[#2a2a3a]'
              }
            `}
          >
            <span className="mr-2">{config.label}</span>
            <span className="text-xs opacity-60">({config.symbol})</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-[#8F9BB3]">
        Region detected: {detectedRegion} 
        {detectedRegion !== 'OTHER' && ' - Using default format for your region'}
      </div>
    </div>
  );
};

export default OddsSystem;