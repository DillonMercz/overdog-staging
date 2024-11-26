import { useEffect, useState } from 'react';
import { NBAPrediction, NBAPredictionsResponse } from '../../../types/nbaPredictions';
import { fetchNBAPredictions } from '../../../services/nbaPredictionsService';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';

const getTeamName = (teamName: string): string => {
  const areas = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit', 'Golden State', 'Houston', 'Indiana', 'Los Angeles', 'LA', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Sacramento', 'San Antonio', 'Toronto', 'Utah', 'Washington'];
  let strippedName = teamName;
  
  for (let area of areas) {
    if (teamName.includes(area)) {
      strippedName = teamName.replace(area + ' ', '');
      if (strippedName === 'Timberwolves') {
        strippedName = 'Timber Wolves';
      }
      break;
    }
  }
  
  if (teamName === 'Timberwolves') {
    strippedName = 'Timber Wolves';
  }
  
  return strippedName.trim().toLowerCase();
};

const NBASingles = () => {
  const [predictions, setPredictions] = useState<NBAPredictionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await fetchNBAPredictions(session.access_token);
          setPredictions(data);
        }
      } catch (err) {
        setError('Failed to load predictions');
        console.error(err);
      }
    };

    if (user) {
      loadPredictions();
    }
  }, [user]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!predictions) {
    return (
      <div className="text-white p-4">
        Loading predictions...
      </div>
    );
  }

  const getWinningTeam = (game: NBAPrediction): string => {
    const { home_color, away_color } = game.expected_value_colors;
    if (home_color === "RED" && away_color === "RED") {
      return "AI UNSURE";
    } else if (home_color === "RED" && away_color === "GREEN") {
      return game.home_team;
    } else {
      return game.away_team;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(predictions).map((game, index) => {
        const winningTeam = getWinningTeam(game);
        return (
          <div key={index} className="bg-[#13131A] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
              <div className="text-center">
                <h4 className="text-white font-semibold mb-2">{winningTeam}</h4>
                <p className="text-[#00F6FF] text-sm">To Win</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={`/assets/img/nba-logos/${getTeamName(game.away_team)}.png`}
                    alt={game.away_team}
                    className="w-8 h-8"
                  />
                  <span className="text-white text-sm">{getTeamName(game.away_team)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{getTeamName(game.home_team)}</span>
                  <img 
                    src={`/assets/img/nba-logos/${getTeamName(game.home_team)}.png`}
                    alt={game.home_team}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[#8F9BB3] text-sm mb-1">Game Total:</p>
                <h4 className="text-white font-semibold">
                  {game.under_over} {game.total}
                </h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NBASingles;
