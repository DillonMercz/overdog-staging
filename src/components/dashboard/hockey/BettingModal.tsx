import { useState } from 'react';
import { NHLPrediction } from '../../../types/nhlPredictions';
import { NHLGame } from '../../../types/nhl';
import { OddsFormat } from '../../../types/odds';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: NHLPrediction | NHLGame;
  oddsFormat?: OddsFormat;
}

const BettingModal = ({ isOpen, onClose, game, oddsFormat = 'american' }: BettingModalProps) => {
  const [stake, setStake] = useState('');
  const [odds, setOdds] = useState('');

  if (!isOpen) return null;

  // Helper function to handle both types
  const getPredictedWinner = () => {
    if ('Predicted Winner' in game && game['Predicted Winner']) {
      return game['Predicted Winner'];
    }
    return null;
  };

  const predictedWinner = getPredictedWinner();

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setStake(value);
    }
  };

  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation based on odds format
    switch (oddsFormat) {
      case 'american':
        // Allow positive and negative numbers
        if (/^-?\d*$/.test(value)) {
          setOdds(value);
        }
        break;
      case 'decimal':
        // Allow positive numbers with up to 2 decimal places
        if (/^\d*\.?\d{0,2}$/.test(value)) {
          setOdds(value);
        }
        break;
      case 'fractional':
        // Allow format like "5/1", "10/1", etc.
        if (/^\d*\/?\.?\d*$/.test(value)) {
          setOdds(value);
        }
        break;
    }
  };

  const getOddsPlaceholder = () => {
    switch (oddsFormat) {
      case 'american':
        return 'Enter odds (e.g. -110, +150)';
      case 'decimal':
        return 'Enter odds (e.g. 1.91, 2.50)';
      case 'fractional':
        return 'Enter odds (e.g. 10/1, 5/2)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A23] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">Place Your Bet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-white">
            <p className="mb-2">Game:</p>
            <p className="text-lg font-medium">{game['Away Team']} @ {game['Home Team']}</p>
          </div>

          {predictedWinner && (
            <div className="text-white">
              <p className="mb-2">Prediction:</p>
              <p className="text-lg font-medium text-[#4263EB]">{predictedWinner} to Win</p>
            </div>
          )}

          {'Game State' in game && (
            <div className="text-white">
              <p className="mb-2">Game Status:</p>
              <p className="text-lg font-medium">{game['Game State']}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-white">
              <label htmlFor="stake" className="block mb-2">Stake ($)</label>
              <input
                id="stake"
                type="text"
                value={stake}
                onChange={handleStakeChange}
                placeholder="Enter stake amount"
                className="w-full bg-[#2A2A35] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4263EB]"
              />
            </div>

            <div className="text-white">
              <label htmlFor="odds" className="block mb-2">
                Odds ({oddsFormat.charAt(0).toUpperCase() + oddsFormat.slice(1)})
              </label>
              <input
                id="odds"
                type="text"
                value={odds}
                onChange={handleOddsChange}
                placeholder={getOddsPlaceholder()}
                className="w-full bg-[#2A2A35] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4263EB]"
              />
            </div>
          </div>

          <button
            className="w-full bg-[#4263EB] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#3651C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // TODO: Implement bet placement logic with stake and odds
              console.log('Placing bet with stake:', stake, 'and odds:', odds);
              onClose();
            }}
            disabled={!stake || !odds}
          >
            Place Bet
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;
