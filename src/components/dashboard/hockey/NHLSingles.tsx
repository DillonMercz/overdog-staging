import { useEffect, useState } from 'react';
import { NHLPrediction, NHLPredictionsResponse } from '../../../types/nhlPredictions';
import { fetchNHLPredictions, getTeamAbbreviation, getTeamName } from '../../../services/nhlPredictionsService';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';

const NHLSingles = () => {
  const [predictions, setPredictions] = useState<NHLPredictionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const { user } = useAuth();

  const calculateTimeUntilNoon = () => {
    const now = new Date();
    const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const noon = new Date(est);
    noon.setHours(12, 0, 0, 0);

    if (est.getHours() >= 12) {
      // If it's past noon, target next day
      noon.setDate(noon.getDate() + 1);
    }

    const diff = noon.getTime() - est.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateTimeUntilNoon());
    };

    updateCountdown(); // Initial calculation
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await fetchNHLPredictions(session.access_token);
          setPredictions(data);
        }
      } catch (err) {
        const now = new Date();
        const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        if (est.getHours() < 12) {
          setError('before-noon');
        } else {
          setError('Failed to load predictions');
        }
        console.error(err);
      }
    };

    if (user) {
      loadPredictions();
    }
  }, [user]);

  if (error === 'before-noon') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-[#1A1A23] rounded-2xl border border-[#2E3449]">
        <h3 className="text-xl font-bold text-white mb-3">Next Predictions Update In</h3>
        <div className="text-3xl font-mono text-[#00F6FF] mb-3">{countdown}</div>
        <p className="text-[#8F9BB3] text-center text-sm">
          NHL predictions are generated daily at 12:00 PM EST.<br/>
          Check back soon for today's predictions!
        </p>
      </div>
    );
  }

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

  const getPredictedWinner = (game: NHLPrediction): string => {
    const homeProb = parseFloat(game['Pre-Game Home Win Probability']);
    const awayProb = parseFloat(game['Pre-Game Away Win Probability']);

    if (homeProb > 50 && !(awayProb >= 45)) {
      return game['Home Team'];
    } else if (awayProb > 50 && !(homeProb >= 45)) {
      return game['Away Team'];
    } else if (
      homeProb >= 45 && awayProb >= 45 ||
      homeProb <= 50 && awayProb <= 50 ||
      homeProb >= 45 && awayProb <= 50 ||
      awayProb >= 45 && homeProb <= 50
    ) {
      return 'AI Unsure';
    }
    return 'AI Unsure';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1400px] mx-auto">
      {Object.values(predictions).map((game, index) => {
        const predictedWinner = getPredictedWinner(game);
        const homeAbbr = getTeamAbbreviation(game['Home Team']);
        const awayAbbr = getTeamAbbreviation(game['Away Team']);
        const homeProb = Math.round(parseFloat(game['Pre-Game Home Win Probability']));
        const awayProb = Math.round(parseFloat(game['Pre-Game Away Win Probability']));

        return (
          <div key={index} className="bg-[#1A1A23] rounded-xl overflow-hidden border border-[#2E3449] hover:border-[#00F6FF] transition-all duration-200 group">
            <div className="p-4 border-b border-[#2E3449]">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-1 text-white">
                  {predictedWinner === 'AI Unsure' ? 'AI Unsure' : `${predictedWinner} Win`}
                </h4>
                <p className="text-[#00F6FF] text-sm">Prediction</p>
              </div>
            </div>

            <div className="p-4">
              {/* Teams */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#13131A] p-2 flex items-center justify-center">
                  <img 
                    src={`https://assets.nhle.com/logos/nhl/svg/${awayAbbr}_light.svg`}
                    alt={game['Away Team']}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-[#8F9BB3] text-lg font-medium mx-2">VS</span>
                <div className="w-14 h-14 rounded-full bg-[#13131A] p-2 flex items-center justify-center">
                  <img 
                    src={`https://assets.nhle.com/logos/nhl/svg/${homeAbbr}_light.svg`}
                    alt={game['Home Team']}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>

              {/* Win Probabilities */}
              <div>
                <h5 className="text-[#8F9BB3] text-sm mb-4 text-center">Win Probabilities</h5>
                
                {/* Away Team */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#8F9BB3] text-sm">{getTeamName(game['Away Team'])}</span>
                    <span className="text-white text-sm">{awayProb}%</span>
                  </div>
                  <div className="h-1.5 bg-[#2E3449] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00F6FF]"
                      style={{ width: `${awayProb}%` }}
                    ></div>
                  </div>
                </div>

                {/* Home Team */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#8F9BB3] text-sm">{getTeamName(game['Home Team'])}</span>
                    <span className="text-white text-sm">{homeProb}%</span>
                  </div>
                  <div className="h-1.5 bg-[#2E3449] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00F6FF]"
                      style={{ width: `${homeProb}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NHLSingles;
