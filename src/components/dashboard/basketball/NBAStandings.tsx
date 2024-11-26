import React, { useState, useEffect } from 'react';
import { StandingsAPIResponse, TeamStanding, Stat } from '../../../types/nba';

const NBAStandings: React.FC = () => {
  const [standingsData, setStandingsData] = useState<StandingsAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Eastern Conference');

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://site.api.espn.com/apis/v2/sports/basketball/nba/standings');
        if (!response.ok) {
          throw new Error('Failed to fetch standings');
        }
        const data: StandingsAPIResponse = await response.json();
        setStandingsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching standings');
        console.error('Error fetching standings data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  const getStatValue = (stats: Stat[], name: string): string => {
    const stat = stats.find(s => s.name === name || s.type === name);
    return stat?.displayValue || '-';
  };

  const getTeamStats = (entry: TeamStanding) => {
    return {
      wins: getStatValue(entry.stats, 'wins'),
      losses: getStatValue(entry.stats, 'losses'),
      winPct: getStatValue(entry.stats, 'winPercent'),
      gb: getStatValue(entry.stats, 'gamesBehind'),
      l10: getStatValue(entry.stats, 'lasttengames'),
      streak: getStatValue(entry.stats, 'streak'),
      confRecord: getStatValue(entry.stats, 'vsconf'),
      homeRecord: getStatValue(entry.stats, 'home'),
      awayRecord: getStatValue(entry.stats, 'road'),
    };
  };  
    return (
      <div className="font-[Montserrat]">
      {/* Conference Tabs */}
      <div className="flex gap-4 mb-4 px-4">
        {standingsData?.children.map(conf => (
          <button
            key={conf.name}
            onClick={() => setActiveTab(conf.name)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
              ${activeTab === conf.name 
                ? 'bg-[rgba(0,246,255,0.15)] text-[#00F6FF] border border-[#00F6FF]' 
                : 'text-[#8F9BB3] hover:text-white hover:bg-[#13131A]'}`}
          >
            {conf.name}
          </button>
        ))}
      </div>
  
        {/* Content */}
        <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00F6FF] border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[#8F9BB3]">
                <thead>
                  <tr className="text-xs uppercase border-b border-[rgba(255,255,255,0.05)]">
                    <th className="px-4 py-3 text-left font-medium">Team</th>
                    <th className="px-4 py-3 text-center font-medium">W</th>
                    <th className="px-4 py-3 text-center font-medium">L</th>
                    <th className="px-4 py-3 text-center font-medium">PCT</th>
                    <th className="px-4 py-3 text-center font-medium">GB</th>
                    <th className="px-4 py-3 text-center font-medium">L10</th>
                    <th className="px-4 py-3 text-center font-medium">STRK</th>
                    <th className="px-4 py-3 text-center font-medium">CONF</th>
                    <th className="px-4 py-3 text-center font-medium">HOME</th>
                    <th className="px-4 py-3 text-center font-medium">AWAY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                  {standingsData?.children
                    .find(conf => conf.name === activeTab)
                    ?.standings.entries
                    .sort((a, b) => {
                      const aWins = a.stats.find(s => s.name === 'wins')?.value || 0;
                      const bWins = b.stats.find(s => s.name === 'wins')?.value || 0;
                      return bWins - aWins;
                    })
                    .map((entry: TeamStanding, index: number) => {
                      const stats = getTeamStats(entry);
                      const isPlayoffSpot = index < 6;
                      const isPlayInSpot = index >= 6 && index < 10;
  
                      return (
                        <tr 
                          key={entry.team.id}
                          className={`
                            hover:bg-[#13131A] transition-all duration-200
                            ${isPlayoffSpot ? 'border-l-2 border-[#00FFB2]' : ''}
                            ${isPlayInSpot ? 'border-l-2 border-[#00F6FF]' : ''}
                          `}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[#8F9BB3] w-4">{index + 1}</span>
                              <img
                                src={entry.team.logos[0]?.href}
                                alt={entry.team.displayName}
                                className="w-6 h-6 object-contain"
                              />
                              <span className="font-medium text-white">
                                {entry.team.displayName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-white">{stats.wins}</td>
                          <td className="px-4 py-3 text-center">{stats.losses}</td>
                          <td className="px-4 py-3 text-center font-medium text-white">{stats.winPct}</td>
                          <td className="px-4 py-3 text-center">{stats.gb}</td>
                          <td className="px-4 py-3 text-center">{stats.l10}</td>
                          <td className={`px-4 py-3 text-center font-medium
                            ${stats.streak.startsWith('W') ? 'text-[#00FFB2]' : 'text-[#FF3D71]'}`}>
                            {stats.streak}
                          </td>
                          <td className="px-4 py-3 text-center">{stats.confRecord}</td>
                          <td className="px-4 py-3 text-center">{stats.homeRecord}</td>
                          <td className="px-4 py-3 text-center">{stats.awayRecord}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default NBAStandings;