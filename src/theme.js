// src/theme.js

export const colors = {
  // Marca — paleta premium verde
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryMid: '#388E3C',
  primaryLight: '#F0F9F0',
  primaryBorder: '#A5D6A7',
  primaryGlass: 'rgba(46,125,50,0.08)',

  // Gradiente (usado como referência)
  gradientStart: '#2E7D32',
  gradientEnd: '#43A047',

  // Texto
  text: '#1F2D1F',
  textSecondary: '#4A6741',
  textLight: '#8AAD87',
  textInverse: '#ffffff',
  textMuted: '#9E9E9E',

  // Fundos
  bg: '#FFFFFF',
  bgLight: '#F6FBF6',
  bgSubtle: '#EEF6EE',
  bgCard: '#FFFFFF',

  // Bordas
  border: '#E3EDE3',
  borderStrong: '#C8DFC8',

  // Semânticas
  success: '#2E7D32',
  warning: '#F59E0B',
  danger: '#E53935',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
}

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 28,
}

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

export const fontFamily = {
  regular:  'Sora_400Regular',
  medium:   'Sora_500Medium',
  semibold: 'Sora_600SemiBold',
  bold:     'Sora_700Bold',
}

export const shadow = {
  xs: {
    shadowColor: '#1F2D1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1F2D1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#1F2D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1F2D1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
}

export const touchTarget = {
  min: 44,
}