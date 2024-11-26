import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ResizableBox } from 'react-resizable';
import { NBAPropsResponse, NBAPlayerPrediction } from '../../../types/nbaPredictions';
import { fetchNBAProps } from '../../../services/nbaPredictionsService';
import { useAuth } from '../../../hooks/useAuth';
import { useInjuries } from '../../../contexts/InjuryContext';
import { supabase } from '../../../lib/supabase/client';
import styles from './NBAProps.module.css';
import 'react-resizable/css/styles.css';


type ViewMode = 'card' | 'list';
type Position = 'ALL' | 'G' | 'F' | 'C';
type SortField = 'PTS' | 'AST' | 'REB' | 'BLK' | 'STL';
type SortDirection = 'asc' | 'desc';

const HEADER_HEIGHT = 64;
const SCROLL_THRESHOLD = 100;

// Helper function to normalize player names for comparison
const normalizePlayerName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z]/g, ''); // Remove non-alphabetic characters
};

const NBAProps = () => {
  const [props, setProps] = useState<NBAPropsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Position>('ALL');
  const [sortField, setSortField] = useState<SortField>('PTS');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [height, setHeight] = useState(200);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { injuries } = useInjuries();

  // Filter out injured players from props data
  const filterOutInjuredPlayers = (data: NBAPropsResponse): NBAPropsResponse => {
    if (!data) return {};

    const injuredPlayerNames = injuries
      .filter(injury => injury.status === 'Out')
      .map(injury => normalizePlayerName(injury.player));

    return Object.entries(data).reduce((acc, [key, player]) => {
      if (!injuredPlayerNames.includes(normalizePlayerName(player.PLAYER))) {
        acc[key] = player;
      }
      return acc;
    }, {} as NBAPropsResponse);
  };

  // Handle scroll-to-top functionality
  const handleContentScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setShowBackToTop(target.scrollTop > SCROLL_THRESHOLD);
  }, []);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Handle window scroll for container scrollability
  const handleWindowScroll = useCallback((e: WheelEvent) => {
    if (!containerRef.current || !contentRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const shouldBeScrollable = rect.top <= HEADER_HEIGHT;
    
    if (isScrollable !== shouldBeScrollable) {
      setIsScrollable(shouldBeScrollable);
      
      // Reset scroll position when becoming scrollable
      if (shouldBeScrollable) {
        contentRef.current.scrollTop = 0;
        setShowBackToTop(false);
      }
    }

    // If we're scrollable and hovering
    if (shouldBeScrollable && isHovered) {
      const content = contentRef.current;
      const isAtTop = content.scrollTop === 0;
      const isAtBottom = Math.abs(content.scrollHeight - content.scrollTop - content.clientHeight) < 1;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      // Allow page scroll if:
      // 1. We're at the top and scrolling up
      // 2. We're at the bottom and scrolling down
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        return;
      }

      // Otherwise prevent page scroll and handle content scroll
      e.preventDefault();
      content.scrollTop += e.deltaY;
    }
  }, [isScrollable, isHovered]);

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Set up window scroll listener
  useEffect(() => {
    window.addEventListener('wheel', handleWindowScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleWindowScroll);
  }, [handleWindowScroll]);

  // Add scroll event listener to content
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    content.addEventListener('scroll', handleContentScroll);
    return () => content.removeEventListener('scroll', handleContentScroll);
  }, [handleContentScroll]);

  // Sync height with scoreboard
  useEffect(() => {
    const scoreboardContainer = document.querySelector('.rounded-2xl.bg-\\[\\#13131A\\].backdrop-blur-sm.border.border-\\[\\#2E3449\\].overflow-hidden') as HTMLElement;
    
    if (scoreboardContainer) {
      const updateHeight = () => {
        const newHeight = scoreboardContainer.offsetHeight;
        setHeight(newHeight);
      };

      updateHeight();
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(scoreboardContainer);

      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const loadProps = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await fetchNBAProps(session.access_token);
          // Filter out injured players before setting the state
          const filteredData = filterOutInjuredPlayers(data);
          setProps(filteredData);
        }
      } catch (err) {
        setError('Failed to load player props');
        console.error(err);
      }
    };

    if (user) {
      loadProps();
    }
  }, [user, injuries]); // Re-run when injuries change

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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const filteredPlayers = Object.values(props)
    .filter(player => {
      if (!player.predictions) return false;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        player.PLAYER.toLowerCase().includes(query) || 
        (player.TEAM?.toLowerCase().includes(query) ?? false);
      const matchesPosition = selectedPosition === 'ALL' || player.POSITION.includes(selectedPosition);
      
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      const valueA = a.predictions[sortField];
      const valueB = b.predictions[sortField];
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });

  const renderSortableHeader = (field: SortField, label: string) => (
    <th 
      className="px-2 py-1 cursor-pointer hover:text-[#00F6FF]"
      onClick={() => handleSort(field)}
    >
      {label} {getSortIcon(field)}
    </th>
  );

  const renderCardView = (player: NBAPlayerPrediction) => (
    <div className="bg-[#13131A] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="text-center">
          <Link 
            to={`/dashboard/nba/player?player=${encodeURIComponent(player.PLAYER)}`}
            className="text-white hover:text-[#00F6FF] transition-colors"
          >
            <h4 className="font-semibold mb-2">{player.PLAYER}</h4>
          </Link>
            <div className="flex justify-center mb-4">
              <img 
                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.PLAYER_ID}.png`}
                alt={player.PLAYER}
                className="w-20 h-20 rounded-full object-cover"
              />
          </div>
          <p className="text-[#8F9BB3] text-sm">{player.POSITION}</p>
          {player.TEAM && <p className="text-[#8F9BB3] text-sm">{player.TEAM}</p>}
        </div>
      </div>
      <div className="p-4">
        <div className="text-center">
          <p className="text-[#8F9BB3] text-sm mb-3">Predictions:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#8F9BB3]">
                  {renderSortableHeader('PTS', 'PTS')}
                  {renderSortableHeader('AST', 'AST')}
                  {renderSortableHeader('REB', 'REB')}
                  {renderSortableHeader('BLK', 'BLK')}
                  {renderSortableHeader('STL', 'STL')}
                </tr>
              </thead>
              <tbody>
                <tr className="text-white">
                  <td className="px-2 py-1">{Math.round(player.predictions.PTS)}</td>
                  <td className="px-2 py-1">{Math.round(player.predictions.AST)}</td>
                  <td className="px-2 py-1">{Math.round(player.predictions.REB)}</td>
                  <td className="px-2 py-1">{Math.round(player.predictions.BLK)}</td>
                  <td className="px-2 py-1">{Math.round(player.predictions.STL)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListView = (player: NBAPlayerPrediction) => (
    <div className="bg-[#13131A] rounded-xl overflow-hidden p-4 flex items-center gap-4">
      <img 
        src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.PLAYER_ID}.png`}
        alt={player.PLAYER}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <Link 
          to={`/dashboard/nba/player?player=${encodeURIComponent(player.PLAYER)}`}
          className="text-white hover:text-[#00F6FF] transition-colors"
        >
          <h4 className="font-semibold">{player.PLAYER}</h4>
        </Link>
        <p className="text-[#8F9BB3] text-sm">{player.POSITION}</p>
        {player.TEAM && <p className="text-[#8F9BB3] text-sm">{player.TEAM}</p>}
      </div>
      <div className="flex gap-4 text-white text-sm">
        <div className="text-center cursor-pointer" onClick={() => handleSort('PTS')}>
          <p className="text-[#8F9BB3]">PTS {getSortIcon('PTS')}</p>
          <p>{Math.round(player.predictions.PTS)}</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => handleSort('AST')}>
          <p className="text-[#8F9BB3]">AST {getSortIcon('AST')}</p>
          <p>{Math.round(player.predictions.AST)}</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => handleSort('REB')}>
          <p className="text-[#8F9BB3]">REB {getSortIcon('REB')}</p>
          <p>{Math.round(player.predictions.REB)}</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => handleSort('BLK')}>
          <p className="text-[#8F9BB3]">BLK {getSortIcon('BLK')}</p>
          <p>{Math.round(player.predictions.BLK)}</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => handleSort('STL')}>
          <p className="text-[#8F9BB3]">STL {getSortIcon('STL')}</p>
          <p>{Math.round(player.predictions.STL)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Fixed Controls */}
      <div className={styles.controls}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#13131A] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#8F9BB3] focus:outline-none focus:border-[#00F6FF]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as Position)}
              className="px-4 py-2 bg-[#13131A] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-[#00F6FF]"
            >
              <option value="ALL">All Positions</option>
              <option value="G">Guards</option>
              <option value="F">Forwards</option>
              <option value="C">Centers</option>
            </select>
            <div className="flex bg-[#13131A] border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 ${viewMode === 'card' ? 'bg-[#4263EB] text-white' : 'text-[#8F9BB3] hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-[#4263EB] text-white' : 'text-[#8F9BB3] hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Player List */}
      <ResizableBox
        width={Infinity}
        height={height}
        minConstraints={[Infinity, 200]}
        onResize={(e, { size }) => {
          setHeight(size.height);
        }}
        handle={<div className={styles.resizeHandle} />}
        className={styles.resizableContainer}
        axis="y"
      >
        <div 
          ref={contentRef}
          className={`${styles.content} ${isScrollable ? styles.scrollable : ''}`}
          style={{ overflowY: isScrollable ? 'auto' : 'hidden' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.contentWrapper}>
            <button
              onClick={scrollToTop}
              className={`${styles.backToTop} ${showBackToTop ? styles.visible : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Top
            </button>

            <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredPlayers.map((player, index) => (
                <div key={index}>
                  {viewMode === 'card' ? renderCardView(player) : renderListView(player)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default NBAProps;
