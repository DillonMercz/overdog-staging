import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faBell, 
  faUser,
  faRightFromBracket,
  faUserPen,
  faMoneyBill,
  faBasketball,
  faBaseballBall,
  faHockeyPuck,
  faFootballBall,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { SearchResult, SearchCategory, Player, Team, League, NBAPlayer } from '../../types/search';
import { SportsDataResponse, SportPlayer, SportTeam } from '../../types/sports';
import sportsData from '../../data/sports_data.json';
import { createPortal } from 'react-dom';

const NavBar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { signOut, user } = useAuthContext();
  const { profile } = useUser();
  const navigate = useNavigate();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const searchData = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    let allResults: SearchResult[] = [];
    
    // Search all leagues
    Object.entries(sportsData as SportsDataResponse).forEach(([league, data]) => {
      // Search players
      const playerResults = (data.players as SportPlayer[])
        .filter(player => player.full_name.toLowerCase().includes(searchTerm))
        .map(player => ({
          id: player.id,
          text: player.full_name,
          category: 'Players' as SearchCategory,
          data: { ...player, league }
        }));

      // Search teams
      const teamResults = (data.teams as SportTeam[])
        .filter(team => team.full_name.toLowerCase().includes(searchTerm))
        .map(team => ({
          id: team.id,
          text: team.full_name,
          category: 'Teams' as SearchCategory,
          data: { ...team, league }
        }));

      allResults = [...allResults, ...playerResults, ...teamResults];
    });

    // Add events
    const eventResults: SearchResult[] = searchTerm.length > 2 ? [
      {
        id: 'upcoming-games',
        text: 'Upcoming Games',
        category: 'Events' as SearchCategory,
        data: { type: 'upcoming' }
      },
      {
        id: 'live-games',
        text: 'Live Games',
        category: 'Events' as SearchCategory,
        data: { type: 'live' }
      }
    ].filter(event => event.text.toLowerCase().includes(searchTerm)) : [];

    setSearchResults([...allResults, ...eventResults]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchData(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
        setSearchResults([]);
        setSearchQuery('');
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (result: SearchResult) => {
    console.log('Selected:', result);
    setIsSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    
    const data = result.data as (Player | Team | { type: string });
    if ('league' in data) {
      const league = data.league.toLowerCase();
      switch (result.category) {
        case 'Players':
          if (league === 'nba') {
            navigate(`/dashboard/nba/player?player=${encodeURIComponent(result.text)}`);
          } else {
            navigate(`/dashboard/${league}`, { state: { selectedPlayer: data } });
          }
          break;
        case 'Teams':
          navigate(`/dashboard/${league}`, { state: { selectedTeam: data } });
          break;
      }
    } else if (result.category === 'Events') {
      navigate('/dashboard/nba', { state: { selectedEvent: data } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSearchSelect(searchResults[selectedIndex]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to render profile image or fallback
  const renderProfileImage = () => {
    if (profile?.avatar) {
      return (
        <div className="h-9 w-9 rounded-xl overflow-hidden bg-[#13131A]">
          <img
            src={`${supabaseUrl}/storage/v1/object/public/avatars/${profile.avatar}`}
            alt="Profile"
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              target.parentElement?.appendChild(
                (() => {
                  const icon = document.createElement('span');
                  icon.innerHTML = '<i class="fas fa-user text-[#8F9BB3]"></i>';
                  return icon;
                })()
              );
            }}
          />
        </div>
      );
    }

    return (
      <div className="h-9 w-9 rounded-xl bg-[#13131A] flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-[#8F9BB3] hover:text-white" />
      </div>
    );
  };

  // Group results by category
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<SearchCategory, SearchResult[]>);

  const renderSearchResults = () => {
    if (!searchResults.length) return null;

    const searchRect = searchRef.current?.getBoundingClientRect();
    if (!searchRect) return null;

    const dropdownStyle = {
      position: 'fixed' as const,
      top: `${searchRect.bottom + 4}px`,
      left: `${searchRect.left}px`,
      width: `${searchRect.width}px`,
      maxHeight: '80vh',
      overflowY: 'auto' as const,
    };

    const getTagStyles = (league: League) => {
      switch (league) {
        case 'NBA':
          return {
            bg: 'bg-[rgba(66,99,235,0.1)]',
            text: 'text-[#4263EB]',
            icon: faBasketball
          };
        case 'MLB':
          return {
            bg: 'bg-[rgba(255,59,48,0.1)]',
            text: 'text-[#FF3B30]',
            icon: faBaseballBall
          };
        case 'NHL':
          return {
            bg: 'bg-[rgba(0,122,255,0.1)]',
            text: 'text-[#007AFF]',
            icon: faHockeyPuck
          };
        case 'NFL':
          return {
            bg: 'bg-[rgba(0,229,199,0.1)]',
            text: 'text-[#00E5C7]',
            icon: faFootballBall
          };
        default:
          return {
            bg: 'bg-[rgba(0,246,255,0.1)]',
            text: 'text-[#00F6FF]',
            icon: faShieldHalved
          };
      }
    };

    const renderTag = (result: SearchResult) => {
      if (result.category === 'Events') return null;
      
      const data = result.data as (Player | Team);
      if (!('league' in data)) return null;

      const styles = getTagStyles(data.league as League);
      const isTeam = 'type' in data && data.type === 'team';
      const text = `${data.league} ${isTeam ? 'Team' : 'Player'}`;

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${styles.bg} ${styles.text}`}>
          <FontAwesomeIcon icon={isTeam ? faShieldHalved : styles.icon} className="w-3 h-3 mr-1" />
          {text}
        </span>
      );
    };

    const content = (
      <div style={dropdownStyle} className="bg-[#13131A] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-lg overflow-hidden z-[999999]">
        {Object.entries(groupedResults).map(([category, results]) => (
          <div key={category}>
            <div className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-xs font-medium text-[#8F9BB3] uppercase">{category}</span>
            </div>
            {results.map((result, index) => {
              const isSelected = searchResults.indexOf(result) === selectedIndex;
              return (
                <div
                  key={`${result.category}-${result.id}`}
                  className={`p-3 cursor-pointer ${
                    isSelected 
                      ? 'bg-[rgba(255,255,255,0.05)] text-[#00F6FF]' 
                      : 'text-[#8F9BB3] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                  }`}
                  onClick={() => handleSearchSelect(result)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{result.text}</span>
                    {renderTag(result)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );

    return createPortal(content, document.body);
  };

  return (
    <div className="fixed top-0 right-0 left-20 [aside[data-expanded=true]_&]:left-64 transition-all duration-300 h-16 flex items-center justify-between px-4 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm z-40">
      <div className="flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative bg-[#13131A] rounded-xl">
          {isSearchActive ? (
            <div className="relative animate-fadeIn">
              <FontAwesomeIcon 
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9BB3] w-5 h-5"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Games, Teams, or Players"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white rounded-xl outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                autoFocus
              />
              {renderSearchResults()}
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchActive(true)}
              className="w-full flex items-center space-x-2 text-[#8F9BB3] hover:text-white transition-colors px-3 py-2.5"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
              <span className="text-sm">Search Games, Teams, or Players</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[#8F9BB3] hover:text-white transition-colors">
          <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        </button>
        <div className="relative" ref={profileRef}>
          <button
            className="transition-all duration-200 hover:ring-2 hover:ring-[#00F6FF]/15 rounded-xl"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {renderProfileImage()}
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-[#13131A] ring-1 ring-[rgba(255,255,255,0.05)] py-1 z-50">
              <div className="px-4 py-2 text-sm text-[#8F9BB3] border-b border-[rgba(255,255,255,0.05)]">
                {profile?.username || user?.email}
              </div>
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="w-full flex items-center px-4 py-2 text-sm text-[#8F9BB3] hover:text-[#00F6FF] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
              >
                <FontAwesomeIcon icon={faUserPen} className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/dashboard/bookmakers')}
                className="w-full flex items-center px-4 py-2 text-sm text-[#8F9BB3] hover:text-[#00F6FF] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
              >
                <FontAwesomeIcon icon={faMoneyBill} className="w-4 h-4 mr-2" />
                Bookmakers
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-[#8F9BB3] hover:text-[#00F6FF] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
