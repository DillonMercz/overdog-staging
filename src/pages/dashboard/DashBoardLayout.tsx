// pages/dashboard/DashBoardLayout.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from '../../routes/protected/ProtectedRoutes';
import DashboardPage from './DashBoardPage';
import NBAPage from './NBAPage';
import NBAPlayerPage from './NBAPlayerPage';
import ParlayGenerator from './ParlayPage';
import BetTrackerPage from './BetTrackerPage';
import SideBar from '../../components/dashboard/SideBar';
import NavBar from '../../components/dashboard/NavBar';
import NHLPage from './NHLPage';
import ProfilePage from './ProfilePage';
import BookmakersPage from './BookmakersPage.tsx';
import { DiscordCallback } from '../../components/dashboard/DiscordCallback';
import { PinnedGamesProvider } from '../../contexts/PinnedGamesContext';
import PinnedGamesBar from '../../components/dashboard/PinnedGamesBar';

export const DashboardLayout = () => {
 return (
   <PinnedGamesProvider>
     <div className="font-[Montserrat] min-h-screen bg-[#0A0A0F] relative">
       {/* Background gradient effects */}
       <div className="fixed inset-0 pointer-events-none">
         <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-[rgba(0,246,255,0.15)] opacity-25 blur-3xl" />
         <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-[rgba(0,246,255,0.15)] opacity-25 blur-3xl" />
       </div>

       {/* Main content */}
       <div className="relative flex min-h-screen">
         <SideBar />
         <div className="flex-1 flex flex-col min-w-0 pl-20 [aside[data-expanded=true]_&]:pl-64 transition-all duration-300">
           <NavBar />
           <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full mt-16">
             <Routes>
               <Route element={<ProtectedRoutes />}>
                 <Route index element={<DashboardPage />} />
                 <Route path="nba" element={<NBAPage />} />
                 <Route path="nba/player" element={<NBAPlayerPage />} />
                 <Route path="nhl" element={<NHLPage />} />
                 <Route path="parlay" element={<ParlayGenerator />} />
                 <Route path="bet-tracker" element={<BetTrackerPage />} />
                 <Route path="profile" element={<ProfilePage />} />
                 <Route path="bookmakers" element={<BookmakersPage />} />
               </Route>
               {/* Discord callback route outside of protected routes */}
               <Route path="profile/discord/callback" element={<DiscordCallback />} />
             </Routes>
           </div>
         </div>
       </div>

       {/* Pinned Games Bar - Outside of Routes */}
       <PinnedGamesBar />
     </div>
   </PinnedGamesProvider>
 );
};

export default DashboardLayout;
