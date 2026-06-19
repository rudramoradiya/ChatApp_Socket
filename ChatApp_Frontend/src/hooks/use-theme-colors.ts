import { useTheme } from '../contexts/ThemeContext';

export interface ThemeColors {
  // Background colors
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    sidebar: string;
    modal: string;
  };
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  // Border colors
  border: {
    primary: string;
    secondary: string;
    accent: string;
  };
  // Interactive colors
  interactive: {
    primary: string;
    secondary: string;
    hover: string;
    active: string;
    disabled: string;
  };
  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const useThemeColors = (): ThemeColors => {
  const { isDark } = useTheme();

  if (isDark) {
    return {
      bg: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        tertiary: 'bg-gray-700',
        card: 'bg-gray-800',
        sidebar: 'bg-gray-800',
        modal: 'bg-gray-800',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
        muted: 'text-gray-500',
        inverse: 'text-gray-900',
      },
      border: {
        primary: 'border-gray-700',
        secondary: 'border-gray-600',
        accent: 'border-gray-500',
      },
      interactive: {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-gray-700 hover:bg-gray-600',
        hover: 'hover:bg-gray-700',
        active: 'bg-gray-600',
        disabled: 'bg-gray-800 text-gray-500',
      },
      status: {
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400',
        info: 'text-blue-400',
      },
    };
  }

  return {
    bg: {
      primary: 'bg-gray-50',
      secondary: 'bg-white',
      tertiary: 'bg-gray-100',
      card: 'bg-white',
      sidebar: 'bg-white',
      modal: 'bg-white',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
      muted: 'text-gray-500',
      inverse: 'text-white',
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
      accent: 'border-gray-400',
    },
    interactive: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-gray-100 hover:bg-gray-200',
      hover: 'hover:bg-gray-100',
      active: 'bg-gray-200',
      disabled: 'bg-gray-100 text-gray-400',
    },
    status: {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    },
  };
};

// Utility functions for common theme patterns
export const useThemeUtils = () => {
  const { isDark } = useTheme();
  const colors = useThemeColors();

  return {
    isDark,
    colors,
    // Common class combinations
    inputClasses: `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      isDark
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`,
    buttonClasses: {
      primary: `px-4 py-2 rounded-lg font-medium transition-colors ${colors.interactive.primary} text-white`,
      secondary: `px-4 py-2 rounded-lg font-medium transition-colors ${colors.interactive.secondary} ${colors.text.primary}`,
      ghost: `px-4 py-2 rounded-lg font-medium transition-colors ${colors.interactive.hover} ${colors.text.primary}`,
    },
    cardClasses: `rounded-lg border shadow-sm ${colors.bg.card} ${colors.border.primary}`,
    // Animation classes
    transitionClasses: 'transition-all duration-200 ease-in-out',
  };
};