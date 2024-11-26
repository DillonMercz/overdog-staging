import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTableCells,
  faBasketball,
  faFootball,
  faHockeyPuck,
  faBaseball,
  faUsers,
  faGraduationCap,
  faStore,
  faFutbol,
  faMoneyBillTrendUp,
  faThumbtack,
  faUser
} from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  submenu?: Array<{
    name: string;
    path: string;
  }>;
  disabled?: boolean;
  badge?: string;
  allowedPlans?: string[];
}

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const navigate = useNavigate();
  const { profile } = useUser();

  const menuItems: MenuItem[] = [
    { 
      icon: faTableCells, 
      label: 'Dashboard',
      path: '/dashboard',
      allowedPlans: ['Royal']
    },
    { 
      icon: faMoneyBillTrendUp,
      label: 'Bet Tracker',
      path: '/dashboard/bet-tracker',
      allowedPlans: ['Royal', 'Apprentice', 'Commoner']
    },
    { 
      icon: faBasketball, 
      label: 'Basketball', 
      submenu: [
        { name: 'NBA', path: '/dashboard/nba' }
      ],
      allowedPlans: ['Royal', 'Apprentice']
    },
    { 
      icon: faHockeyPuck, 
      label: 'Hockey', 
      submenu: [
        { name: 'NHL', path: '/dashboard/nhl' }
      ],
      allowedPlans: ['Royal', 'Apprentice']
    }
  ];

  // Filter menu items based on user's plan
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.allowedPlans || !profile) return false;
    return item.allowedPlans.includes(profile.plan);
  });

  const handleNavigation = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen
        ${isPinned ? 'w-64' : 'w-20'} 
        bg-[rgba(255,255,255,0.03)] 
        backdrop-blur-sm 
        border-r 
        border-[rgba(255,255,255,0.05)] 
        transition-all 
        duration-300 
        flex 
        flex-col 
        flex-shrink-0 
        ${!isPinned ? 'group hover:w-64' : ''}
        z-50
      `}
      data-expanded={isPinned}
    >
      {/* Logo Header */}
      <div className="h-16 flex items-center border-b border-[rgba(255,255,255,0.05)] relative px-5">
        <div className="flex items-center gap-3">
          <div className={`${!isPinned ? 'w-10 flex justify-center' : 'w-8'}`}>
            <img 
              src="https://i.imgur.com/83gZyXE.png" 
              alt="Overdog" 
              className={`${!isPinned ? 'w-10 h-10' : 'w-8 h-8'} transition-all duration-300`} 
            />
          </div>
          <span className={`font-semibold text-xl bg-gradient-to-r from-[#FFD426] to-[#00F6FF] bg-clip-text text-transparent whitespace-nowrap ${!isPinned ? 'hidden group-hover:block' : ''} transition-all duration-300`}>
            OVERDOG
          </span>
        </div>
        <button 
          onClick={() => setIsPinned(!isPinned)}
          className={`text-[#8F9BB3] hover:text-[#00F6FF] transition-colors absolute right-5 ${!isPinned ? 'hidden group-hover:block' : ''}`}
          title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          <FontAwesomeIcon 
            icon={faThumbtack} 
            className={`w-4 h-4 transition-transform ${isPinned ? 'rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {filteredMenuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => {
                if (!item.disabled) {
                  setActiveMenu(activeMenu === item.label ? null : item.label);
                  if (item.path) handleNavigation(item.path);
                }
              }}
              disabled={item.disabled}
              className={`
                w-full flex items-center text-[#8F9BB3] hover:bg-[#13131A] transition-all duration-200
                ${activeMenu === item.label ? 'bg-[#13131A] text-[#00F6FF]' : ''}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-white'}
                py-3 px-5
              `}
            >
              <div className={`
                ${!isPinned ? 'w-10 flex justify-center pl-1.5' : 'w-8'}
              `}>
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`${!isPinned ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-200`} 
                />
              </div>
              <span className={`ml-3 whitespace-nowrap ${!isPinned ? 'hidden group-hover:block' : ''} transition-all duration-200`}>
                {item.label}
              </span>
              {item.badge && (
                <span className={`ml-auto ${!isPinned ? 'hidden group-hover:block' : ''} px-2 py-0.5 text-xs bg-[rgba(0,246,255,0.15)] text-[#00F6FF] rounded-lg transition-all duration-200`}>
                  {item.badge}
                </span>
              )}
            </button>
            
            {item.submenu && activeMenu === item.label && (
              <div className={`${!isPinned ? 'hidden group-hover:block' : 'block'} bg-[#13131A]/50 backdrop-blur-sm`}>
                {item.submenu.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => handleNavigation(subItem.path)}
                    className="w-full py-2.5 px-[4.5rem] text-left text-[#8F9BB3] hover:text-[#00F6FF] hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200"
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
