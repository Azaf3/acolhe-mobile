// src/theme.js
// Equivalente às CSS variables do App.css web
// Importe este arquivo em qualquer componente que precise de estilos

export const colors = {
  // Marca
  primary: '#2e7d32',
  primaryDark: '#1b5e20',
  primaryLight: '#e8f5e9',
  primaryBorder: '#a5d6a7',

  // Texto
  text: '#1b2e1b',
  textSecondary: '#4e6e4e',
  textLight: '#7a937a',
  textInverse: '#ffffff',

  // Fundos
  bg: '#ffffff',
  bgLight: '#f9fafb',
  bgSubtle: '#f3f4f6',

  // Bordas
  border: '#e5e7eb',
  borderStrong: '#d1d5db',

  // Semânticas
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',

  // Overlay
  overlay: 'rgba(0,0,0,0.45)',
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
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
}

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
}

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

// Sombras para iOS e Android
export const shadow = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
}

// Tamanhos de toque mínimos (acessibilidade)
export const touchTarget = {
  min: 44, // px mínimo recomendado pela Apple/Google
}
