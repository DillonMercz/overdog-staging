import { useState } from 'react';
import NHLSingles from '../../components/dashboard/hockey/NHLSingles';
import NHLProps from '../../components/dashboard/hockey/NHLProps';
import NHLScoreboardContainer from '../../components/dashboard/hockey/NHLScoreboardContainer';
import NHLStandings from '../../components/dashboard/hockey/NHLStandings';

const NHLPage = () => {
  const [activeTab, setActiveTab] = useState('singles');

  return (
    <div className="space-y-4 font-[Montserrat] max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <span className="text-[#8F9BB3]">Dashboard / Hockey /</span>
        <span className="text-white font-medium">NHL</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Scoreboard */}
        <div className="w-full lg:w-[400px]">
          <NHLScoreboardContainer />
        </div>

        {/* Right Column - Overdog Picks and Standings */}
        <div className="flex-1 space-y-4">
          {/* Overdog Picks */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
              <h2 className="bg-gradient-to-r from-[#FFD426] to-[#00F6FF] bg-clip-text text-transparent font-semibold">
                OVERDOG PICKS
              </h2>
              <div className="flex items-center gap-3">
                <button className="px-4 py-1.5 rounded-lg bg-[#13131A] text-[#8F9BB3] text-sm hover:text-white transition-colors">
                  European
                </button>
                <button className="px-4 py-1.5 rounded-lg bg-[#4263EB] text-white text-sm font-medium hover:bg-[#3451C6] transition-colors">
                  Auto Bet ⚡
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex gap-6 border-b border-[rgba(255,255,255,0.05)] px-4 pb-3">
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'singles' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('singles')}
                >
                  Singles
                </button>
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'parlays' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('parlays')}
                >
                  Parlays
                </button>
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'props' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('props')}
                >
                  Props
                </button>
              </div>
              <div className="p-4" id="picks">
                {activeTab === 'singles' && <NHLSingles />}
                {activeTab === 'parlays' && <div className="text-white text-center">Parlays Coming Soon</div>}
                {activeTab === 'props' && <NHLProps />}
              </div>
            </div>
          </div>

          {/* Standings */}
          <NHLStandings />
        </div>
      </div>
    </div>
  );
};

export default NHLPage;
