import { useMemo } from 'react';
import { LineChart } from 'recharts/es6/chart/LineChart';
import { Line } from 'recharts/es6/cartesian/Line';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { Bet } from '../../types/betting';

interface BetTrackerAnalyticsProps {
  bets: Bet[];
}

interface ChartDataPoint {
  date: string;
  profit: number;
}

const BetTrackerAnalytics = ({ bets }: BetTrackerAnalyticsProps) => {
  const stats = useMemo(() => {
    const totalBets = bets.length;
    const wonBets = bets.filter(bet => bet.legs[0]?.bet_status?.name === 'Won').length;
    const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalProfit = bets.reduce((sum, bet) => {
      if (bet.legs[0]?.bet_status?.name === 'Won') {
        return sum + (bet.potential_payout - bet.stake);
      }
      return sum - bet.stake;
    }, 0);

    return {
      totalBets,
      winRate: totalBets ? `${((wonBets / totalBets) * 100).toFixed(1)}%` : '0%',
      profitLoss: `${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`,
      avgStake: `$${totalBets ? (totalStake / totalBets).toFixed(2) : '0.00'}`
    };
  }, [bets]);

  const chartData = useMemo(() => {
    const profitByDay = bets.reduce<Record<string, { profit: number }>>((acc, bet) => {
      const date = new Date(bet.placed_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { profit: 0 };
      }
      
      const profit = bet.legs[0]?.bet_status?.name === 'Won'
        ? bet.potential_payout - bet.stake
        : -bet.stake;
        
      acc[date].profit += profit;
      return acc;
    }, {});

    return Object.entries(profitByDay).map(([date, data]): ChartDataPoint => ({
      date,
      profit: Number(data.profit.toFixed(2))
    }));
  }, [bets]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-6">
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-[#8F9BB3] mt-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        ))}
      </div>
      
      <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="bg-gradient-to-r from-[#FFD426] to-[#00F6FF] bg-clip-text text-transparent font-semibold">
            PROFIT/LOSS TRACKER
          </h2>
        </div>
        <div className="p-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#8F9BB3" />
              <YAxis stroke="#8F9BB3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#00F6FF" 
                strokeWidth={2}
                dot={{ fill: '#00F6FF', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BetTrackerAnalytics;
