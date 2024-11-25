import { createContext, useContext, ReactNode, useState } from 'react';
import { NBAInjury } from '../types/nbaInjuries';

interface InjuryContextType {
  injuries: NBAInjury[];
  setInjuries: (injuries: NBAInjury[]) => void;
}

const InjuryContext = createContext<InjuryContextType | undefined>(undefined);

export const useInjuries = () => {
  const context = useContext(InjuryContext);
  if (!context) {
    throw new Error('useInjuries must be used within an InjuryProvider');
  }
  return context;
};

interface InjuryProviderProps {
  children: ReactNode;
}

export const InjuryProvider = ({ children }: InjuryProviderProps) => {
  const [injuries, setInjuries] = useState<NBAInjury[]>([]);

  return (
    <InjuryContext.Provider value={{ injuries, setInjuries }}>
      {children}
    </InjuryContext.Provider>
  );
};
