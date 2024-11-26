import React, { useEffect, useState } from 'react';
import { getTeamAbbreviation } from '../../../utils/nhlUtils';

interface TeamStanding {
    Team: string;
    'W-L': string;
    PCT: string;
    GB: string;
    CONF: string;
    DIV: string;
    STRK: string;
}

interface StandingsData {
    eastern: TeamStanding[];
    western: TeamStanding[];
}

const NHLStandings: React.FC = () => {
    const [standings, setStandings] = useState<StandingsData>({
        eastern: [],
        western: []
    });
    const [activeTab, setActiveTab] = useState('Eastern Conference');

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbxlk7fTnjEnSxPaj9Cuj1bWv9f2B7Ioo0qldmQLXem62n8pq0-eWELgDxrGY02RAXfxeA/exec");
                const text = await response.text();
                
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(text, 'text/html');
                const tables = htmlDoc.getElementsByTagName('table');

                if (tables.length < 2) {
                    console.error('Expected 2 tables but found:', tables.length);
                    return;
                }

                // Process Eastern Conference
                const easternData: TeamStanding[] = [];
                const easternRows = tables[0].querySelectorAll('.bsp_row_item');
                easternRows.forEach((row) => {
                    const columns = Array.from(row.children);
                    if (columns.length >= 8) {
                        const team = columns[0]?.textContent?.trim() || '';
                        const wL = columns[2]?.textContent?.trim() || '';
                        const pct = columns[3]?.textContent?.trim() || '';
                        const gb = columns[4]?.textContent?.trim() || '';
                        const conf = columns[5]?.textContent?.trim() || '';
                        const div = columns[6]?.textContent?.trim() || '';
                        const strk = columns[7]?.textContent?.trim() || '';

                        easternData.push({
                            Team: team.replace(/^\d+\.\s+/, ''),
                            'W-L': wL,
                            PCT: pct,
                            GB: gb,
                            CONF: conf,
                            DIV: div,
                            STRK: strk,
                        });
                    }
                });

                // Process Western Conference
                const westernData: TeamStanding[] = [];
                const westernRows = tables[1].querySelectorAll('.bsp_row_item');
                westernRows.forEach((row) => {
                    const columns = Array.from(row.children);
                    if (columns.length >= 8) {
                        const team = columns[0]?.textContent?.trim() || '';
                        const wL = columns[2]?.textContent?.trim() || '';
                        const pct = columns[3]?.textContent?.trim() || '';
                        const gb = columns[4]?.textContent?.trim() || '';
                        const conf = columns[5]?.textContent?.trim() || '';
                        const div = columns[6]?.textContent?.trim() || '';
                        const strk = columns[7]?.textContent?.trim() || '';

                        westernData.push({
                            Team: team.replace(/^\d+\.\s+/, ''),
                            'W-L': wL,
                            PCT: pct,
                            GB: gb,
                            CONF: conf,
                            DIV: div,
                            STRK: strk,
                        });
                    }
                });

                setStandings({
                    eastern: easternData,
                    western: westernData
                });
            } catch (error) {
                console.error('Error fetching standings:', error);
            }
        };

        fetchStandings();

        // Fetch standings every 5 minutes
        const interval = setInterval(fetchStandings, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getStreakColor = (streak: string) => {
        if (streak.startsWith('W')) return 'text-[#00FFB2]';
        if (streak.startsWith('L')) return 'text-[#FF3D71]';
        return 'text-white';
    };

    const getTeamLogo = (teamName: string) => {
        const abbrev = getTeamAbbreviation(teamName);
        return `/assets/img/nhl-logos/${abbrev}.png`;
    };

    const currentData = activeTab === 'Eastern Conference' ? standings.eastern : standings.western;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#13131A] to-[#0C0C10]">
            {/* Title */}
            <div className="p-4">
                <h2 className="text-[#FFD426] font-bold">
                    STANDINGS - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h2>
            </div>

            {/* Conference Tabs */}
            <div className="px-4 pb-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('Eastern Conference')}
                        className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
                            ${activeTab === 'Eastern Conference'
                                ? 'bg-[rgba(0,246,255,0.1)] text-[#00F6FF] border border-[#00F6FF]'
                                : 'text-[#8F9BB3] hover:text-white'}`}
                    >
                        Eastern Conference
                    </button>
                    <button
                        onClick={() => setActiveTab('Western Conference')}
                        className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
                            ${activeTab === 'Western Conference'
                                ? 'bg-[rgba(0,246,255,0.1)] text-[#00F6FF] border border-[#00F6FF]'
                                : 'text-[#8F9BB3] hover:text-white'}`}
                    >
                        Western Conference
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="px-4 pb-4">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs uppercase border-b border-[rgba(255,255,255,0.05)]">
                            <th className="text-left py-3 text-[#8F9BB3] font-medium">TEAM</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">W</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">L</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">PCT</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">GB</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">L10</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">STRK</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">CONF</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">HOME</th>
                            <th className="text-center py-3 text-[#8F9BB3] font-medium">AWAY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((team, index) => {
                            const [wins, losses] = team['W-L'].split('-');
                            const isPlayoffSpot = index < 6;
                            const isPlayInSpot = index >= 6 && index < 10;

                            return (
                                <tr
                                    key={team.Team}
                                    className={`
                                        border-t border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors
                                        ${isPlayoffSpot ? 'border-l border-[#00FFB2]/30' : ''}
                                        ${isPlayInSpot ? 'border-l border-[#00F6FF]/30' : ''}
                                    `}
                                >
                                    <td className="py-3">
                                        <div className="flex items-center">
                                            <span className="text-[#8F9BB3] w-8 text-right pr-3 text-sm">{index + 1}</span>
                                            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.03)] p-1 flex items-center justify-center">
                                                <img
                                                    src={getTeamLogo(team.Team)}
                                                    alt={team.Team}
                                                    className="w-6 h-6 object-contain"
                                                />
                                            </div>
                                            <span className="text-white font-semibold ml-3">
                                                {team.Team}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center py-3 text-white">{wins}</td>
                                    <td className="text-center py-3 text-[#8F9BB3]">{losses}</td>
                                    <td className="text-center py-3 text-white">{team.PCT}</td>
                                    <td className="text-center py-3 text-[#8F9BB3]">{team.GB}</td>
                                    <td className="text-center py-3 text-[#8F9BB3]">-</td>
                                    <td className={`text-center py-3 ${getStreakColor(team.STRK)}`}>
                                        {team.STRK}
                                    </td>
                                    <td className="text-center py-3 text-[#8F9BB3]">{team.CONF}</td>
                                    <td className="text-center py-3 text-[#8F9BB3]">-</td>
                                    <td className="text-center py-3 text-[#8F9BB3]">-</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NHLStandings;
