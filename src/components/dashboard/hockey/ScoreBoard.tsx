import { ScoreboardData, NHLGame } from '../../../types/nhl';

interface Props {
  data: ScoreboardData | null;
  isLoading: boolean;
}

const Scoreboard = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00F6FF] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.games || data.games.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-[#8F9BB3] py-8">
          No games scheduled for today
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {data.games.map((game) => (
        <div 
          key={game.gameId}
          className="border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 
                   hover:bg-[#13131A] hover:border-[#00F6FF] 
                   transition-all duration-200 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm"
        >
          {/* Game Status */}
          <div className="flex justify-end mb-3">
            <span className="text-green-500 text-sm font-medium">
              {game.gameStatus === 'final' && game.period > 3 ? 'FINAL/OT' : 'FINAL' }
            </span>
          </div>

          {/* Period Headers */}
          <div className="flex justify-end mb-2 space-x-2">
            {game.awayTeam.linescores?.map((_, index) => (
              <span key={index} className="text-[#8F9BB3] text-sm w-8 text-center">
                {index + 1}
              </span>
            ))}
            <span className="text-[#8F9BB3] text-sm w-8 text-center">
              T
            </span>
          </div>

          {/* Away Team */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <img 
                src={`https://a.espncdn.com/i/teamlogos/nhl/500/${game.awayTeam.teamId}.png`}
                alt={game.awayTeam.teamName}
                className="w-6 h-6 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {game.awayTeam.teamName}
                </span>
                <span className="text-[#8F9BB3] text-sm">
                  ({game.awayTeam.record})
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {game.awayTeam.linescores?.map((score, index) => (
                <span key={index} className="text-[#8F9BB3] w-8 text-center">
                  {score.value}
                </span>
              ))}
              <span className="text-white font-bold w-8 text-center">
                {game.awayTeam.score}
              </span>
            </div>
          </div>

          {/* Home Team */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src={`https://a.espncdn.com/i/teamlogos/nhl/500/${game.homeTeam.teamId}.png`}
                alt={game.homeTeam.teamName}
                className="w-6 h-6 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {game.homeTeam.teamName}
                </span>
                <span className="text-[#8F9BB3] text-sm">
                  ({game.homeTeam.record})
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {game.homeTeam.linescores?.map((score, index) => (
                <span key={index} className="text-[#8F9BB3] w-8 text-center">
                  {score.value}
                </span>
              ))}
              <span className="text-white font-bold w-8 text-center">
                {game.homeTeam.score}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;