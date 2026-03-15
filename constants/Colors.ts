// Pioneer Nurse Color System
// TWU Maroon (#500000) as primary accent

export const colors = {
  primary: {
    50: '#FFF0F0',
    100: '#FFD6D6',
    200: '#FFB3B3',
    300: '#E67373',
    400: '#CC4444',
    500: '#8B0000',
    600: '#700000',
    700: '#500000',
    800: '#3D0000',
    900: '#2A0000',
  },
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  white: '#FFFFFF',
  black: '#000000',
  background: '#FAFAF9',
  card: '#FFFFFF',
  border: '#E7E5E4',
  text: '#1C1917',
  textSecondary: '#78716C',
  textTertiary: '#A8A29E',
} as const;

// Theme for React Navigation
const tintColorLight = colors.primary[500];
const tintColorDark = '#FAFAF9';

const theme = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: tintColorLight,
    tabIconDefault: colors.neutral[400],
    tabIconSelected: tintColorLight,
    card: colors.card,
    border: colors.border,
  },
  dark: {
    text: '#FAFAF9',
    background: '#1C1917',
    tint: tintColorDark,
    tabIconDefault: '#78716C',
    tabIconSelected: tintColorDark,
    card: '#292524',
    border: '#44403C',
  },
} as { [key: string]: { text: string; background: string; tint: string; tabIconDefault: string; tabIconSelected: string; card: string; border: string } };

export default theme;
