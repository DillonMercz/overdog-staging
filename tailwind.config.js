// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          primary: '#0A0A0F',
          secondary: '#13131A',
          glass: 'rgba(255, 255, 255, 0.03)',
          accent: '#00F6FF',
          'accent-glow': 'rgba(0, 246, 255, 0.15)',
          green: '#00FFB2',
          red: '#FF3D71',
          yellow: '#FFD426',
          text: {
            primary: '#FFFFFF',
            secondary: '#8F9BB3'
          },
          border: 'rgba(255, 255, 255, 0.05)'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      backdropBlur: {
        xs: '10px',
      },
      boxShadow: {
        'glow': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'accent': '0 0 20px rgba(0, 246, 255, 0.15)',
      }
    }
  }
};