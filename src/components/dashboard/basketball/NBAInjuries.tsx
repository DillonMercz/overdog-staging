import { useEffect, useState, useRef } from 'react';
import { NBAInjury } from '../../../types/nbaInjuries';
import { useInjuries } from '../../../contexts/InjuryContext';

const NBAInjuries = () => {
  const [loading, setLoading] = useState(true);
  const [timeUntilReport, setTimeUntilReport] = useState<string>('');
  const [isBeforeReportTime, setIsBeforeReportTime] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { injuries, setInjuries } = useInjuries();

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const checkTimeAndFetchInjuries = async () => {
      const now = new Date();
      const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const reportTime = new Date(est);
      reportTime.setHours(11, 15, 0, 0);

      if (est < reportTime) {
        setIsBeforeReportTime(true);
        const updateTimer = () => {
          const currentEst = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
          const timeDiff = reportTime.getTime() - currentEst.getTime();
          
          if (timeDiff <= 0) {
            setIsBeforeReportTime(false);
            return;
          }

          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
          setTimeUntilReport(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          );
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://cdn.overdogbets.com/injuries/nba/${today}`);
        const data = await response.json();
        const activeInjuries = Array.isArray(data) ? data : [];
        setInjuries(activeInjuries);
      } catch (error) {
        console.error('Error fetching NBA injuries:', error);
        setInjuries([]);
      } finally {
        setLoading(false);
      }
    };

    checkTimeAndFetchInjuries();
  }, [setInjuries]);

  // Set initial selected team when injuries are loaded
  useEffect(() => {
    if (!loading && injuries.length > 0 && !selectedTeam) {
      const teams = [...new Set(injuries.map(injury => injury.team))];
      setSelectedTeam(teams[0]);
    }
  }, [loading, injuries, selectedTeam]);

  if (isBeforeReportTime) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-[#13131A] rounded-lg">
        <div className="text-[#00F6FF] text-3xl font-bold font-mono">
          {timeUntilReport}
        </div>
        <p className="text-center text-[#8F9BB3] max-w-md">
          The NBA releases its first injury report of the day at 11:15 AM EST. Check back in {timeUntilReport} for today's injury updates.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00F6FF]"></div>
      </div>
    );
  }

  // Group injuries by team
  const injuriesByTeam = injuries.reduce((acc, injury) => {
    if (!acc[injury.team]) {
      acc[injury.team] = [];
    }
    acc[injury.team].push(injury);
    return acc;
  }, {} as Record<string, NBAInjury[]>);

  // Get teams that have active injuries
  const teamsWithInjuries = Object.keys(injuriesByTeam);

  if (teamsWithInjuries.length === 0) {
    return (
      <div className="text-center text-[#8F9BB3] py-8">
        No injuries reported today
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Out':
        return 'bg-[#1F1F1F] text-[#FF3B3B]';
      case 'Questionable':
        return 'bg-[#1F1F1F] text-[#FFB547]';
      case 'Probable':
        return 'bg-[#1F1F1F] text-[#00F6FF]';
      default:
        return 'bg-[#1F1F1F] text-[#FF8A00]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Team chips slider */}
      <div className="relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 p-2 text-white hover:text-[#00F6FF] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div 
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide mx-8 py-2 scroll-smooth"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {teamsWithInjuries.map((team) => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`px-4 py-1.5 rounded-full text-white border border-white/20 whitespace-nowrap transition-all duration-200 ${
                selectedTeam === team
                  ? 'border-white bg-white/10'
                  : 'hover:border-white hover:bg-white/5'
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 p-2 text-white hover:text-[#00F6FF] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Injuries list */}
      {selectedTeam && (
        <div className="space-y-2">
          {injuriesByTeam[selectedTeam].map((injury, index) => (
            <div
              key={`${injury.player}-${index}`}
              className="flex items-center justify-between bg-[#13131A] rounded-lg p-3"
            >
              <div>
                <p className="text-white font-medium">{injury.player}</p>
                <p className="text-[#8F9BB3] text-sm">{injury.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(injury.status)}`}>
                  {injury.status}
                </span>
                <span className="text-xs text-[#8F9BB3]">{injury.reportTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NBAInjuries;
