import { useEffect, useState } from 'react';
import NHLScoreboard from './NHLScoreboard';
import { NHLScoresResponse } from '../../../types/nhlPredictions';
import { usePinnedGames } from '../../../contexts/PinnedGamesContext';

const NHLScoreboardContainer = () => {
  const [scoreboardData, setScoreboardData] = useState<NHLScoresResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScoreboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("https://script.google.com/macros/s/AKfycbzN_GLEk7OO6Jb37utk5yZzVPrmu3O6hfS6grg2BAo6ntpQlgBuPdS30ZQ9-df2G2_qAA/exec");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setScoreboardData(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching NHL scores');
      console.error('Error fetching NHL scoreboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboardData();
    const intervalId = setInterval(fetchScoreboardData, 20000); // Poll every 20 seconds
    return () => clearInterval(intervalId);
  }, []);

  const today = new Date();
  const month = today.toLocaleString('en-US', { month: 'short' });
  const day = today.getDate();

  return (
    <div className="rounded-2xl bg-[#13131A] backdrop-blur-sm border border-[#2E3449] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2E3449] flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center custom-header">
          <span className="text-[#8F9BB3]">
            SCOREBOARD
          </span>
          <span className="text-[#8F9BB3] ml-2">
            - {month} {day}
          </span>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#00F6FF] border-t-transparent ml-3"></div>
          )}
        </h2>
      </div>

      <NHLScoreboard 
        data={scoreboardData} 
        isLoading={!scoreboardData}
      />
      
      {error && (
        <div className="text-red-500 mt-2 text-center p-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default NHLScoreboardContainer;
