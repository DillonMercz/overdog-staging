// ParlayGenerator.tsx
import React, { useState } from 'react';

interface ExpectedValueColors {
  home_color: 'GREEN' | 'RED';
  away_color: 'GREEN' | 'RED';
}

interface Game {
  home_team: string;
  away_team: string;
  winner: 0 | 1;
  under_over: 'UNDER' | 'OVER';
  winner_confidence: number;
  un_confidence: number;
  total: number;
  expected_value_colors: ExpectedValueColors;
}

interface Bet {
  type: 'winner' | 'total';
  confidence: number;
  game: Game;
  description: string;
  expectedValue: 'GREEN' | 'RED' | 'NEUTRAL';
}

const ParlayGenerator: React.FC = () => {
  const games: Game[] = [
    { "home_team": "Indiana Pacers", "away_team": "Charlotte Hornets", "winner": 1, "under_over": "UNDER", "winner_confidence": 81, "un_confidence": 63.4, "total": 234.5, "expected_value_colors": { "home_color": "GREEN", "away_color": "RED" } },
    { "home_team": "Dallas Mavericks", "away_team": "Milwaukee Bucks", "winner": 0, "under_over": "OVER", "winner_confidence": 51.5, "un_confidence": 75, "total": 216.5, "expected_value_colors": { "home_color": "RED", "away_color": "GREEN" } },
    { "home_team": "Oklahoma City Thunder", "away_team": "Atlanta Hawks", "winner": 1, "under_over": "OVER", "winner_confidence": 76, "un_confidence": 59.9, "total": 222.5, "expected_value_colors": { "home_color": "RED", "away_color": "RED" } },
    { "home_team": "Houston Rockets", "away_team": "San Antonio Spurs", "winner": 1, "under_over": "OVER", "winner_confidence": 69.2, "un_confidence": 73, "total": 222.5, "expected_value_colors": { "home_color": "RED", "away_color": "GREEN" } },
    { "home_team": "Minnesota Timberwolves", "away_team": "Denver Nuggets", "winner": 1, "under_over": "UNDER", "winner_confidence": 63, "un_confidence": 77.5, "total": 221.5, "expected_value_colors": { "home_color": "GREEN", "away_color": "RED" } },
    { "home_team": "Phoenix Suns", "away_team": "Los Angeles Lakers", "winner": 1, "under_over": "OVER", "winner_confidence": 62.7, "un_confidence": 67.7, "total": 220.5, "expected_value_colors": { "home_color": "RED", "away_color": "GREEN" } },
    { "home_team": "LA Clippers", "away_team": "Sacramento Kings", "winner": 1, "under_over": "OVER", "winner_confidence": 68.6, "un_confidence": 75.9, "total": 217, "expected_value_colors": { "home_color": "GREEN", "away_color": "RED" } }
  ];

  const [parlay, setParlay] = useState<Bet[]>([]);

  const generateParlay = (): void => {
    const allBets: Bet[] = games.flatMap((game) => {
      const bets: Bet[] = [];
      
      // Winner bet
      bets.push({
        type: 'winner',
        confidence: game.winner_confidence,
        game: game,
        description: `${game.winner === 1 ? game.home_team : game.away_team} to win`,
        expectedValue: game.winner === 1 ? game.expected_value_colors.home_color : game.expected_value_colors.away_color
      });

      // Under/Over bet
      bets.push({
        type: 'total',
        confidence: game.un_confidence,
        game: game,
        description: `${game.under_over} ${game.total}`,
        expectedValue: 'NEUTRAL'
      });

      return bets;
    });

    // Sort bets by confidence and expected value
    const sortedBets = allBets.sort((a, b) => {
      if (a.expectedValue === 'GREEN' && b.expectedValue !== 'GREEN') return -1;
      if (b.expectedValue === 'GREEN' && a.expectedValue !== 'GREEN') return 1;
      return b.confidence - a.confidence;
    });

    setParlay(sortedBets.slice(0, 3));
  };

  return (
    <div>
      <h1>NBA Parlay Generator</h1>
      
      <button onClick={generateParlay}>
        Generate Best 3-Leg Parlay
      </button>

      {parlay.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Recommended Parlay:</h2>
          {parlay.map((bet, index) => (
            <div key={index} style={{ 
              margin: '10px 0',
              padding: '10px',
              border: '1px solid #ccc',
              backgroundColor: bet.expectedValue === 'GREEN' ? '#e6ffe6' : 
                             bet.expectedValue === 'RED' ? '#ffe6e6' : 
                             '#fff'
            }}>
              <div><strong>Leg {index + 1}:</strong> {bet.description}</div>
              <div>
                Confidence: {bet.confidence.toFixed(1)}%
                {bet.expectedValue !== 'NEUTRAL' && (
                  <span style={{ marginLeft: '10px' }}>
                    • Expected Value: {bet.expectedValue}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParlayGenerator;