import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fetchPlayerStats, checkLine } from '../../services/nbaPlayerStatsService';
import { PlayerStats, AverageStats, PlayerStatsResponse, LineCheckResponse } from '../../types/nbaPlayerStats';
import { supabase } from '../../lib/supabase/client';
import styles from './NBAPlayerPage.module.css';

interface StatOption {
  value: string;
  label: string;
}

const STAT_OPTIONS: StatOption[] = [
  { value: 'Points', label: 'Points' },
  { value: 'Assists', label: 'Assists' },
  { value: 'Rebounds', label: 'Rebounds' },
  { value: 'Steals', label: 'Steals' },
  { value: 'Blocks', label: 'Blocks' },
  { value: '3 Points', label: '3 Points' },
  { value: 'PTS_AST', label: 'Points + Assists' },
  { value: 'PTS_REB', label: 'Points + Rebounds' },
  { value: 'PTS_AST_REB', label: 'Points + Assists + Rebounds' },
  { value: 'DD', label: 'Double Double' },
  { value: 'TD', label: 'Triple Double' }
];

const isSpecialStat = (statType: string): boolean => ['DD', 'TD'].includes(statType);

const StatCard = ({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) => (
  <div className={styles.statCard}>
    <div className={styles.statTitle}>{label}</div>
    <div className={styles.value}>{value}{suffix}</div>
  </div>
);

const NBAPlayerPage = () => {
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('player');
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [averageStats, setAverageStats] = useState<AverageStats | null>(null);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('2024-25');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [statType, setStatType] = useState(STAT_OPTIONS[0].value);
  const [lineValue, setLineValue] = useState('');
  const [overUnder, setOverUnder] = useState('over');
  const [lineResult, setLineResult] = useState<LineCheckResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!playerName || !user) return;
      
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError('Authentication required');
          return;
        }

        const data = await fetchPlayerStats(playerName, selectedSeason, session.access_token);
        
        if (!data.stats || !Array.isArray(data.stats)) {
          throw new Error('Invalid response format');
        }

        setStats(data.stats);
        setPlayerId(data.player_id);
        calculateAverageStats(data.stats);
        setSeasons(data.seasons || ['2024-25']); // Fallback to current season
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load player stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerName, selectedSeason, user]);

  const calculateAverageStats = (gameStats: PlayerStats[]) => {
    const filteredStats = selectedTeam 
      ? gameStats.filter(game => game.MATCHUP.includes(selectedTeam))
      : gameStats;

    if (filteredStats.length === 0) {
      setAverageStats(null);
      return;
    }

    const totals = filteredStats.reduce((acc, game) => ({
      PTS: acc.PTS + game.PTS,
      AST: acc.AST + game.AST,
      REB: acc.REB + game.REB,
      STL: acc.STL + game.STL,
      BLK: acc.BLK + game.BLK,
      TOV: acc.TOV + game.TOV,
      FG3M: acc.FG3M + game.FG3M,
      PF: acc.PF + game.PF
    }), {
      PTS: 0, AST: 0, REB: 0, STL: 0, BLK: 0, TOV: 0, FG3M: 0, PF: 0
    });

    const averages = Object.entries(totals).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: Number((value / filteredStats.length).toFixed(2))
    }), {} as AverageStats);

    setAverageStats(averages);
  };

const handleLineCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Authentication required');
        return;
      }

      if (!lineValue || !playerName) {
        setLineResult({
          message: 'Please enter a valid value',
          success: false
        });
        return;
      }

      const result = await checkLine(
        playerName,
        selectedSeason,
        statType,
        parseFloat(lineValue),
        overUnder as 'over' | 'under',
        session.access_token
      );

      setLineResult(result);
    } catch (err) {
      console.error('Error checking line:', err);
      setLineResult({
        message: 'Failed to check line',
        success: false
      });
    }
  };

  if (!user) {
    return (
      <div className={styles.errorMessage}>
        Please log in to view player stats.
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.errorMessage}>
        Loading player stats...
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.playerImageDetails}>
          <h1 className={styles.playerName}>{playerName}</h1>
          <p className={styles.seasonInfo}>SEASON STATS {selectedSeason}</p>
          <img 
            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId || ''}.png`}
            alt={playerName || ''}
            className={styles.playerHeadshot}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://cdn.nba.com/logos/nba/fallback/fallback.png';
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      {averageStats && (
        <div className={styles.playerStats}>
          <StatCard label="POINTS" value={averageStats.PTS} />
          <StatCard label="ASSISTS" value={averageStats.AST} />
          <StatCard label="REBOUNDS" value={averageStats.REB} />
          <StatCard label="STEALS" value={averageStats.STL} />
          <StatCard label="BLOCKS" value={averageStats.BLK} />
          <StatCard label="3 POINTS" value={averageStats.FG3M} />
          <StatCard label="TURNOVERS" value={averageStats.TOV} />
          <StatCard label="FOULS" value={averageStats.PF} />
        </div>
      )}

      {/* Line Check Form */}
      <div className={styles.lineCheck}>
        <h3>Check Player Performance Lines</h3>
        <form onSubmit={handleLineCheck} className={styles.lineCheckContainer}>
          <div className={styles.lineOptions}>
            <select 
              name="stat_type"
              value={statType}
              onChange={(e) => {
                const newStatType = e.target.value;
                setStatType(newStatType);
                if (isSpecialStat(newStatType)) {
                  setLineValue('1'); // For DD/TD, we just check if they got one or not
                } else if (isSpecialStat(statType)) {
                  setLineValue(''); // Clear value when switching from DD/TD to regular stat
                }
              }}
              className={styles.select}
            >
              {STAT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!isSpecialStat(statType) && (
              <input
                type="number"
                name="stat_value"
                value={lineValue}
                onChange={(e) => setLineValue(e.target.value)}
                placeholder="Enter value"
                className={styles.input}
              />
            )}
            <select
              name="over_under"
              value={overUnder}
              onChange={(e) => setOverUnder(e.target.value)}
              className={styles.select}
            >
              <option value="over">Over</option>
              <option value="under">Under</option>
            </select>
          </div>
          <button type="submit" className={styles.checkLineButton}>
            CHECK LINE
          </button>
          {lineResult && (
            <div className={styles.lineResult}>
              {lineResult.message}
            </div>
          )}
        </form>
      </div>

      {/* Filter Games */}
      <div className={styles.controlPanel}>
        <h3>Filter Games</h3>
        <div className={styles.controls}>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className={styles.select}
          >
            <option value="">All Teams</option>
            <option value="ATL">Atlanta Hawks</option>
            <option value="BOS">Boston Celtics</option>
            <option value="BKN">Brooklyn Nets</option>
            <option value="CHA">Charlotte Hornets</option>
            <option value="CHI">Chicago Bulls</option>
            <option value="CLE">Cleveland Cavaliers</option>
            <option value="DAL">Dallas Mavericks</option>
            <option value="DEN">Denver Nuggets</option>
            <option value="DET">Detroit Pistons</option>
            <option value="GSW">Golden State Warriors</option>
            <option value="HOU">Houston Rockets</option>
            <option value="IND">Indiana Pacers</option>
            <option value="LAC">LA Clippers</option>
            <option value="LAL">Los Angeles Lakers</option>
            <option value="MEM">Memphis Grizzlies</option>
            <option value="MIA">Miami Heat</option>
            <option value="MIL">Milwaukee Bucks</option>
            <option value="MIN">Minnesota Timberwolves</option>
            <option value="NOP">New Orleans Pelicans</option>
            <option value="NYK">New York Knicks</option>
            <option value="OKC">Oklahoma City Thunder</option>
            <option value="ORL">Orlando Magic</option>
            <option value="PHI">Philadelphia 76ers</option>
            <option value="PHX">Phoenix Suns</option>
            <option value="POR">Portland Trail Blazers</option>
            <option value="SAC">Sacramento Kings</option>
            <option value="SAS">San Antonio Spurs</option>
            <option value="TOR">Toronto Raptors</option>
            <option value="UTA">Utah Jazz</option>
            <option value="WAS">Washington Wizards</option>
          </select>
          <button 
            onClick={() => setSelectedTeam('')}
            className={styles.button}
          >
            CLEAR FILTER
          </button>
        </div>
      </div>

      {/* Game Log */}
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>MATCH</th>
              <th>MIN</th>
              <th>PTS</th>
              <th>AST</th>
              <th>REB</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TOV</th>
              <th>3PM</th>
              <th>PF</th>
              <th>DD</th>
              <th>TD</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((game, index) => (
              <tr key={index}>
                <td>{game.GAME_DATE}</td>
                <td>{game.MATCHUP}</td>
                <td>{game.MIN}</td>
                <td>{game.PTS}</td>
                <td>{game.AST}</td>
                <td>{game.REB}</td>
                <td>{game.STL}</td>
                <td>{game.BLK}</td>
                <td>{game.TOV}</td>
                <td>{game.FG3M}</td>
                <td>{game.PF}</td>
                <td>{game.DD}</td>
                <td>{game.TD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NBAPlayerPage;
