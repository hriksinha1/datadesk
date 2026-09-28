export const marketingTokens = {
  color: {
    ink950: '#0E141B',
    ink800: '#1C2733',
    ink600: '#46525F',
    ink500: '#5F6B78',
    paper: '#F6F3EC',
    paperDeep: '#EDE8DC',
    white: '#FFFFFF',
    pine950: '#08241D',
    pine900: '#0C3A2E',
    pine700: '#0F5A45',
    brass500: '#C58B2A',
    brass700: '#8A5D12',
  },
  spacing: [4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128],
  breakpoint: { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, max: 1920 },
  motion: { fastMs: 160, baseMs: 240, revealMs: 480, maxDistancePx: 16 },
} as const;
