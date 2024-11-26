import { useEffect, useState } from 'react';
import Scoreboard from '../basketball/ScoreBoard';
import { ScoreboardData } from '../../../types/nba';

const ScoreboardContainer = () => {
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScoreboardData = async () => {
    try {
      // Always set loading to true to show the spinner in header
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("https://script.google.com/macros/s/AKfycbxnVesww5OenWTsUN6C7iwICF3aHSnszBkRjV50l-wgr31-ajeof8npw1D19muM7Rpd/exec");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      // Transform the data to match our ScoreboardData type
      const transformedData: ScoreboardData = {
        gameDate: jsonData.scoreboard.gameDate,
        games: jsonData.scoreboard.games.map((game: any) => ({
          gameId: game.gameId,
          gameStatusText: game.gameStatusText,
          period: game.period,
          gameClock: game.gameClock,
          gameTimeUTC: game.gameTimeUTC,
          homeTeam: {
            teamId: game.homeTeam.teamId,
            teamName: game.homeTeam.teamName,
            teamCity: game.homeTeam.teamCity,
            teamTricode: game.homeTeam.teamTricode,
            score: game.homeTeam.score,
            wins: game.homeTeam.wins,
            losses: game.homeTeam.losses,
            periods: game.homeTeam.periods.map((period: any) => ({
              period: period.period,
              periodType: period.periodType,
              score: period.score
            }))
          },
          awayTeam: {
            teamId: game.awayTeam.teamId,
            teamName: game.awayTeam.teamName,
            teamCity: game.awayTeam.teamCity,
            teamTricode: game.awayTeam.teamTricode,
            score: game.awayTeam.score,
            wins: game.awayTeam.wins,
            losses: game.awayTeam.losses,
            periods: game.awayTeam.periods.map((period: any) => ({
              period: period.period,
              periodType: period.periodType,
              score: period.score
            }))
          }
        }))
      };
      
      setScoreboardData(transformedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching NBA scores');
      console.error('Error fetching NBA scoreboard data:', err);
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
      <Scoreboard 
        data={scoreboardData} 
        isLoading={!scoreboardData} // Only pass true if we have no data yet
      />
      {error && (
        <div className="text-red-500 mt-2 text-center p-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default ScoreboardContainer;
