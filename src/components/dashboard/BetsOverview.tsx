import { useState, useMemo } from 'react';
import { Bet } from '../../types/betting';

interface BetsOverviewProps {
  bets: Bet[];
}

const BetsOverview = ({ bets }: BetsOverviewProps) => {
  console.log('Received bets:', bets); // Debug log

  if (!Array.isArray(bets)) {
    console.error('Bets is not an array:', bets);
    return (
      <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-8 text-center">
        <p className="text-[#8F9BB3]">Error loading bets</p>
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-8 text-center">
        <p className="text-[#8F9BB3]">No bets found</p>
      </div>
    );
  }

  const [sportFilter, setSportFilter] = useState<string>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { filteredBets, sports, leagues, statuses } = useMemo(() => {
    console.log('Processing bets in useMemo:', bets); // Debug log
    const sportsSet = new Set<string>();
    const leaguesSet = new Set<string>();
    const statusesSet = new Set<string>();

    bets.forEach(bet => {
      if (Array.isArray(bet.legs)) {
        bet.legs.forEach(leg => {
          if (leg.sport?.name) sportsSet.add(leg.sport.name);
          if (leg.league?.name) leaguesSet.add(leg.league.name);
          if (leg.bet_status?.name) statusesSet.add(leg.bet_status.name);
        });
      }
    });

    const filtered = bets.filter(bet => {
      const matchesSport = sportFilter === 'all' || 
        (Array.isArray(bet.legs) && bet.legs.some(leg => leg.sport?.name === sportFilter));
      const matchesLeague = leagueFilter === 'all' || 
        (Array.isArray(bet.legs) && bet.legs.some(leg => leg.league?.name === leagueFilter));
      const matchesStatus = statusFilter === 'all' || 
        (Array.isArray(bet.legs) && bet.legs.some(leg => leg.bet_status?.name === statusFilter));
      return matchesSport && matchesLeague && matchesStatus;
    });

    return {
      filteredBets: filtered,
      sports: Array.from(sportsSet).sort(),
      leagues: Array.from(leaguesSet).sort(),
      statuses: Array.from(statusesSet).sort()
    };
  }, [bets, sportFilter, leagueFilter, statusFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Won':
        return 'bg-[rgba(0,255,178,0.15)] text-[#00FFB2]';
      case 'Pending':
        return 'bg-[rgba(0,246,255,0.15)] text-[#00F6FF]';
      case 'Lost':
        return 'bg-[rgba(255,61,113,0.15)] text-[#FF3D71]';
      case 'Void':
        return 'bg-[rgba(255,212,38,0.15)] text-[#FFD426]';
      case 'Cashout':
        return 'bg-[rgba(149,149,255,0.15)] text-[#9595FF]';
      default:
        return 'bg-[rgba(0,246,255,0.15)] text-[#00F6FF]';
    }
  };

  console.log('Filtered bets:', filteredBets); // Debug log

  return (
    <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
        <h2 className="bg-gradient-to-r from-[#FFD426] to-[#00F6FF] bg-clip-text text-transparent font-semibold">
          BET HISTORY
        </h2>
        <div className="flex gap-2">
          <select 
            className="px-4 py-1.5 rounded-lg bg-[#13131A] text-[#8F9BB3] text-sm hover:text-white transition-colors"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="all" key="all">All Sports</option>
            {sports.map(sport => (
              <option key={`sport-${sport}`} value={sport}>{sport}</option>
            ))}
          </select>
          <select 
            className="px-4 py-1.5 rounded-lg bg-[#13131A] text-[#8F9BB3] text-sm hover:text-white transition-colors"
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
          >
            <option value="all" key="all">All Leagues</option>
            {leagues.map(league => (
              <option key={`league-${league}`} value={league}>{league}</option>
            ))}
          </select>
          <select 
            className="px-4 py-1.5 rounded-lg bg-[#13131A] text-[#8F9BB3] text-sm hover:text-white transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" key="all">All Statuses</option>
            {statuses.map(status => (
              <option key={`status-${status}`} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="text-left p-4 text-[#8F9BB3]">Date</th>
              <th className="text-left p-4 text-[#8F9BB3]">Sport</th>
              <th className="text-left p-4 text-[#8F9BB3]">League</th>
              <th className="text-left p-4 text-[#8F9BB3]">Event</th>
              <th className="text-left p-4 text-[#8F9BB3]">Selection</th>
              <th className="text-left p-4 text-[#8F9BB3]">Type</th>
              <th className="text-right p-4 text-[#8F9BB3]">Stake</th>
              <th className="text-right p-4 text-[#8F9BB3]">Odds</th>
              <th className="text-right p-4 text-[#8F9BB3]">P/L</th>
              <th className="text-center p-4 text-[#8F9BB3]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {filteredBets.map((bet) => (
              <tr key={bet.id} className="hover:bg-[#13131A] transition-all duration-200">
                <td className="p-4 text-[#8F9BB3]">
                  {new Date(bet.placed_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-[#8F9BB3]">
                  {bet.legs?.[0]?.sport?.name || 'N/A'}
                </td>
                <td className="p-4 text-[#8F9BB3]">
                  {bet.legs?.[0]?.league?.name || 'N/A'}
                </td>
                <td className="p-4 text-[#8F9BB3]">
                  {bet.legs?.[0]?.event_name || 'N/A'}
                </td>
                <td className="p-4 text-[#8F9BB3]">
                  {bet.legs?.[0]?.selection || 'N/A'}
                </td>
                <td className="p-4 text-[#8F9BB3]">
                  {bet.bet_type?.name || 'N/A'}
                </td>
                <td className="p-4 text-right text-[#8F9BB3]">
                  ${bet.stake.toFixed(2)}
                </td>
                <td className="p-4 text-right text-[#8F9BB3]">
                  {bet.odds}
                </td>
                <td className="p-4 text-right text-[#8F9BB3]">
                  ${(bet.legs?.[0]?.bet_status?.name === 'Won'
                    ? (bet.potential_payout - bet.stake) 
                    : -bet.stake).toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                    getStatusStyle(bet.legs?.[0]?.bet_status?.name || '')
                  }`}>
                    {bet.legs?.[0]?.bet_status?.name || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetsOverview;
