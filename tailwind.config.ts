import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          primaryDark: '#4F46E5',
          primaryLight: '#EEF2F6',
          dark: '#0F172A',
          muted: '#4B5563',
          light: '#F8F9FA',
          border: '#E2E8F0',
          borderHover: '#CBD5E1',
          placeholder: '#9CA3AF',
          success: '#059669',
          successLight: '#DCFCE7',
          warning: '#D97706',
          warningLight: '#FEF3C7',
          danger: '#DC2626',
          dangerLight: '#FEE2E2',
          info: '#2563EB',
          purple: '#8B5CF6',
          pink: '#EC4899',
          teal: '#14B8A6',
          gray: '#94A3B8',
          bg: '#FAFAFA',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f1f5f9',
          3: '#e2e8f0',
        },
        sidebar: {
          bg: '#0f172a',
          text: '#94a3b8',
          active: '#ffffff',
          hover: 'rgba(255,255,255,0.05)',
          activeBg: 'rgba(255,255,255,0.1)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
