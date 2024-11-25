import React from 'react';

interface TeamLogoProps {
  teamTricode: string;
  teamName: string;
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ teamTricode, teamName, className = "w-8 h-8" }) => {
  // Using public folder path
  const logoPath = `/assets/img/nba-logos/${teamTricode}.png`;
  const fallbackPath = '/assets/img/nba-logos/NBA.png';

  return (
    <img 
      src={logoPath}
      alt={teamName} 
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = fallbackPath;
      }}
    />
  );
};

export default TeamLogo;