import React, { useEffect, useState } from 'react';
import Scoreboard from './ScoreBoard';
import { ScoreboardData, NHLGame, Team } from '../../../types/nhl';

interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  status: {
    type: {
      state: string;
      completed: boolean;
      description: string;
    };
    period: number;
    displayClock: string;
  };
  competitions: Array<{
    id: string;
    competitors: Array<{
      id: string;
      team: {
        id: string;
        name: string;
        abbreviation: string;
        displayName: string;
        logo: string;
      };
      score: string;
      homeAway: string;
      records?: Array<{
        type: string;
        summary: string;
      }>;
      statistics?: Array<{
        name: string;
        value: number;
      }>;
      linescores?: Array<{
        value: number;
      }>;
    }>;
  }>;
}

// Define the competitor type
type Competitor = ESPNEvent['competitions'][0]['competitors'][0];

interface ESPNAPIResponse {
  events: ESPNEvent[];
}

const ScoreboardContainer: React.FC = () => {
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const findRecord = (teamData: Competitor) => {
    // First try to find total record (pre-game)
    const totalRecord = teamData.records?.find(r => r.type === 'total');
    if (totalRecord?.summary) {
      return totalRecord.summary;
    }

    // Then try to find ytd record (post-game)
    const ytdRecord = teamData.records?.find(r => r.type === 'ytd');
    if (ytdRecord?.summary) {
      return ytdRecord.summary;
    }

    // If no record found, log warning and return undefined
    console.warn('No record found for team:', teamData.team.name);
    return undefined;
  };

  const transformESPNData = (espnData: ESPNAPIResponse): ScoreboardData => {
    const games: NHLGame[] = espnData.events.map(event => {
      const homeTeamData = event.competitions[0].competitors.find(c => c.homeAway === 'home');
      const awayTeamData = event.competitions[0].competitors.find(c => c.homeAway === 'away');

      if (!homeTeamData || !awayTeamData) {
        throw new Error('Missing team data');
      }

      const getGameStatus = (state: string): 'pre' | 'in' | 'final' => {
        switch (state) {
          case 'pre':
            return 'pre';
          case 'in':
            return 'in';
          case 'post':
            return 'final';
          default:
            return 'pre';
        }
      };

      const homeTeam: Team = {
        teamId: homeTeamData.team.id,
        teamName: homeTeamData.team.name,
        score: parseInt(homeTeamData.score) || 0,
        record: findRecord(homeTeamData),
        linescores: homeTeamData.linescores || []
      };

      const awayTeam: Team = {
        teamId: awayTeamData.team.id,
        teamName: awayTeamData.team.name,
        score: parseInt(awayTeamData.score) || 0,
        record: findRecord(awayTeamData),
        linescores: awayTeamData.linescores || []
      };

      const game: NHLGame = {
        gameId: event.id,
        gameStatusText: event.status.type.description,
        period: event.status.period || 0,
        periodTimeRemaining: event.status.displayClock,
        gameTimeUTC: event.date,
        homeTeam,
        awayTeam,
        gameStatus: getGameStatus(event.status.type.state),
        startTime: event.date,
      };

      return game;
    });

    return {
      gameDate: new Date().toISOString(),
      games,
    };
  };

  const fetchScoreboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const espnData: ESPNAPIResponse = await response.json();
      const transformedData = transformESPNData(espnData);
      setScoreboardData(transformedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching NHL scoreboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchScoreboardData, 30000);
    fetchScoreboardData();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Scoreboard 
        data={scoreboardData} 
        isLoading={isLoading} 
      />
      {error && (
        <div className="p-4 text-[#FF3D71] text-center text-sm">
          {error}
        </div>
      )}
    </>
  );
};

export default ScoreboardContainer;