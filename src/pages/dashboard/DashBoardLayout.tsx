// pages/dashboard/DashBoardLayout.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from '../../routes/protected/ProtectedRoutes';
import { RoleProtectedRoute } from '../../routes/protected/RoleProtectedRoute';
import DashboardPage from './DashBoardPage';
import NBAPage from './NBAPage';
import NBAPlayerPage from './NBAPlayerPage';
import ParlayGenerator from './ParlayPage';
import BetTrackerPage from './BetTrackerPage';
import SideBar from '../../components/dashboard/SideBar';
import NavBar from '../../components/dashboard/NavBar';
import NHLPage from './NHLPage';
import ProfilePage from './ProfilePage';
import BookmakersPage from './BookMakersPage';
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
                 {/* Dashboard - Royal only */}
                 <Route
                   index
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal']}>
                       <DashboardPage />
                     </RoleProtectedRoute>
                   }
                 />

                 {/* NBA Pages - Royal and Apprentice */}
                 <Route
                   path="nba"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal', 'Apprentice']}>
                       <NBAPage />
                     </RoleProtectedRoute>
                   }
                 />
                 <Route
                   path="nba/player"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal', 'Apprentice']}>
                       <NBAPlayerPage />
                     </RoleProtectedRoute>
                   }
                 />

                 {/* NHL Pages - Royal and Apprentice */}
                 <Route
                   path="nhl"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal', 'Apprentice']}>
                       <NHLPage />
                     </RoleProtectedRoute>
                   }
                 />

                 {/* Parlay - Royal only */}
                 <Route
                   path="parlay"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal']}>
                       <ParlayGenerator />
                     </RoleProtectedRoute>
                   }
                 />

                 {/* Bet Tracker - All users */}
                 <Route
                   path="bet-tracker"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal', 'Apprentice', 'Commoner']}>
                       <BetTrackerPage />
                     </RoleProtectedRoute>
                   }
                 />

                 {/* Profile - All users */}
                 <Route
                   path="profile"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal', 'Apprentice', 'Commoner']}>
                       <ProfilePage />
                     </RoleProtectedRoute>
                   }
                 />
                 <Route path="profile/discord/callback" element={<DiscordCallback />} />

                 {/* Bookmakers - Royal only */}
                 <Route
                   path="bookmakers"
                   element={
                     <RoleProtectedRoute allowedPlans={['Royal']}>
                       <BookmakersPage />
                     </RoleProtectedRoute>
                   }
                 />
               </Route>
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
