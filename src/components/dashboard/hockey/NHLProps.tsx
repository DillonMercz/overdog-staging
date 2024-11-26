import { useEffect, useState } from 'react';
import { NHLPropsResponse, NHLPlayerStats } from '../../../types/nhlPredictions';
import { NHL_PLAYERS, NHL_TEAM_ABBREVIATIONS } from '../../../types/nhl';
import { fetchNHLProps } from '../../../services/nhlPredictionsService';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';

type ViewMode = 'card' | 'list';
type SortField = 'goals' | 'assists' | 'points' | 'shots';
type SortDirection = 'asc' | 'desc';

const NHLProps = () => {
  const [props, setProps] = useState<NHLPropsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [minStats, setMinStats] = useState({
    goals: 0,
    assists: 0,
    points: 0,
    shots: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const loadProps = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await fetchNHLProps(session.access_token);
          setProps(data);
        }
      } catch (err) {
        console.error('Error loading NHL props:', err);
        setError('Failed to load player props');
      }
    };

    if (user) {
      loadProps();
    }
  }, [user]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!props) {
    return (
      <div className="text-white p-4">
        Loading player props...
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredPlayers = Object.entries(props)
    .filter(([playerName, stats]) => {
      if (!stats) return false;
      
      const matchesSearch = playerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = selectedTeam === 'ALL' || NHL_PLAYERS[playerName]?.TeamAbbreviation === selectedTeam;
      const meetsMinStats = 
        stats.goals >= minStats.goals &&
        stats.assists >= minStats.assists &&
        stats.points >= minStats.points &&
        stats.shots >= minStats.shots;
      
      return matchesSearch && matchesTeam && meetsMinStats;
    })
    .sort(([nameA, statsA], [nameB, statsB]) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (statsA[sortField] - statsB[sortField]) * multiplier;
    });

  const renderCardView = ([playerName, stats]: [string, NHLPlayerStats]) => {
    const playerInfo = NHL_PLAYERS[playerName];
    const imageUrl = playerInfo 
      ? `https://assets.nhle.com/mugs/nhl/20232024/${playerInfo.TeamAbbreviation}/${playerInfo.PlayerID}.png`
      : 'https://assets.nhle.com/mugs/nhl/default.png';

    return (
      <div className="bg-gradient-to-br from-[#1A1A23] to-[#13131A] rounded-2xl overflow-hidden border border-[#2E3449] hover:border-[#00F6FF] transition-all duration-200 shadow-lg shadow-black/20 group">
        <div className="p-6 border-b border-[#2E3449] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <img 
                src={imageUrl}
                alt={playerName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2E3449] group-hover:border-[#00F6FF] transition-all duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://assets.nhle.com/mugs/nhl/default.png';
                }}
              />
              <div>
                <h4 className="font-bold text-xl text-white group-hover:text-[#00F6FF] transition-colors">{playerName}</h4>
                {playerInfo && (
                  <p className="text-[#8F9BB3] text-sm font-medium">{playerInfo.TeamAbbreviation}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1F2937]/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-[#8F9BB3] text-sm font-medium mb-1">Goals</p>
              <p className="text-2xl font-bold text-white group-hover:text-[#00F6FF] transition-colors">
                {stats.goals?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="bg-[#1F2937]/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-[#8F9BB3] text-sm font-medium mb-1">Assists</p>
              <p className="text-2xl font-bold text-white group-hover:text-[#00F6FF] transition-colors">
                {stats.assists?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="bg-[#1F2937]/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-[#8F9BB3] text-sm font-medium mb-1">Points</p>
              <p className="text-2xl font-bold text-white group-hover:text-[#00F6FF] transition-colors">
                {stats.points?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="bg-[#1F2937]/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-[#8F9BB3] text-sm font-medium mb-1">Shots</p>
              <p className="text-2xl font-bold text-white group-hover:text-[#00F6FF] transition-colors">
                {stats.shots?.toFixed(1) || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = ([playerName, stats]: [string, NHLPlayerStats]) => {
    const playerInfo = NHL_PLAYERS[playerName];
    const imageUrl = playerInfo 
      ? `https://assets.nhle.com/mugs/nhl/20232024/${playerInfo.TeamAbbreviation}/${playerInfo.PlayerID}.png`
      : 'https://assets.nhle.com/mugs/nhl/default.png';

    return (
      <div className="bg-gradient-to-r from-[#1A1A23] to-[#13131A] rounded-xl overflow-hidden p-4 flex items-center gap-4 border border-[#2E3449] hover:border-[#00F6FF] transition-all duration-200 group">
        <img 
          src={imageUrl}
          alt={playerName}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#2E3449] group-hover:border-[#00F6FF] transition-all duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://assets.nhle.com/mugs/nhl/default.png';
          }}
        />
        <div className="flex-1">
          <h4 className="font-bold text-white group-hover:text-[#00F6FF] transition-colors">{playerName}</h4>
          {playerInfo && (
            <p className="text-[#8F9BB3] text-sm">{playerInfo.TeamAbbreviation}</p>
          )}
        </div>
        <div className="flex gap-6 text-white">
          <div className="text-center">
            <p className="text-[#8F9BB3] text-sm font-medium mb-1">Goals</p>
            <p className="font-bold group-hover:text-[#00F6FF] transition-colors">{stats.goals?.toFixed(1) || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8F9BB3] text-sm font-medium mb-1">Assists</p>
            <p className="font-bold group-hover:text-[#00F6FF] transition-colors">{stats.assists?.toFixed(1) || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8F9BB3] text-sm font-medium mb-1">Points</p>
            <p className="font-bold group-hover:text-[#00F6FF] transition-colors">{stats.points?.toFixed(1) || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8F9BB3] text-sm font-medium mb-1">Shots</p>
            <p className="font-bold group-hover:text-[#00F6FF] transition-colors">{stats.shots?.toFixed(1) || '-'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white placeholder-[#8F9BB3] focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white focus:outline-none focus:border-[#00F6FF] transition-colors"
          >
            <option value="ALL">All Teams</option>
            {Object.values(NHL_TEAM_ABBREVIATIONS).map((abbrev) => (
              <option key={abbrev} value={abbrev}>{abbrev}</option>
            ))}
          </select>
          <div className="flex bg-[#1A1A23] border border-[#2E3449] rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-3 ${viewMode === 'card' ? 'bg-[#00F6FF] text-[#13131A]' : 'text-[#8F9BB3] hover:text-white'} transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 ${viewMode === 'list' ? 'bg-[#00F6FF] text-[#13131A]' : 'text-[#8F9BB3] hover:text-white'} transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-[#8F9BB3] text-sm font-medium mb-2 block">Min Goals</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={minStats.goals}
            onChange={(e) => setMinStats(prev => ({ ...prev, goals: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
        </div>
        <div>
          <label className="text-[#8F9BB3] text-sm font-medium mb-2 block">Min Assists</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={minStats.assists}
            onChange={(e) => setMinStats(prev => ({ ...prev, assists: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
        </div>
        <div>
          <label className="text-[#8F9BB3] text-sm font-medium mb-2 block">Min Points</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={minStats.points}
            onChange={(e) => setMinStats(prev => ({ ...prev, points: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
        </div>
        <div>
          <label className="text-[#8F9BB3] text-sm font-medium mb-2 block">Min Shots</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={minStats.shots}
            onChange={(e) => setMinStats(prev => ({ ...prev, shots: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-[#1A1A23] border border-[#2E3449] rounded-xl text-white focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
        </div>
      </div>

      <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredPlayers.map((player) => (
          <div key={player[0]}>
            {viewMode === 'card' ? renderCardView(player) : renderListView(player)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NHLProps;
