// pages/dashboard/DashBoardPage.tsx

import { useUser } from '../../contexts/UserContext';

const DashboardPage = () => {
  const { profile, updateProfile } = useUser();
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome to your dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <h1>Welcome, {profile?.username}</h1>
          {/* Rest of your component */}
      </div>
    </div>
  );
};

export default DashboardPage;