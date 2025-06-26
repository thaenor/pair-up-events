
// Design Token System
// Centralized design tokens for consistent UI across the application

export const tokens = {
  // Size tokens - used for icons, components, etc.
  size: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    xxl: 'h-16 w-16',
    xxxl: 'h-24 w-24',
    hero: 'h-64 w-64 md:h-80 md:w-80'
  },

  // Text size tokens
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    xxl: 'text-2xl',
    xxxl: 'text-3xl',
    hero: 'text-4xl md:text-5xl lg:text-6xl'
  },

  // Spacing tokens for padding, margin, gaps
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
    xxl: 'p-16'
  },

  // Gap tokens for flex/grid layouts
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    xxl: 'gap-8'
  },

  // Border radius tokens
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  },

  // Animation durations
  duration: {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500'
  },

  // Brand colors (already defined in Tailwind config)
  colors: {
    primary: 'text-pairup-cyan',
    secondary: 'text-pairup-yellow',
    tertiary: 'text-pairup-cream',
    dark: 'text-pairup-darkBlue',
    darkAlt: 'text-pairup-darkBlueAlt'
  },

  // Background colors
  bg: {
    primary: 'bg-pairup-cyan',
    secondary: 'bg-pairup-yellow',
    tertiary: 'bg-pairup-cream',
    dark: 'bg-pairup-darkBlue',
    darkAlt: 'bg-pairup-darkBlueAlt'
  }
} as const;

// Type definitions for better TypeScript support
export type SizeToken = keyof typeof tokens.size;
export type TextToken = keyof typeof tokens.text;
export type SpacingToken = keyof typeof tokens.spacing;
export type GapToken = keyof typeof tokens.gap;
export type RadiusToken = keyof typeof tokens.radius;
export type DurationToken = keyof typeof tokens.duration;
export type ColorToken = keyof typeof tokens.colors;
export type BgToken = keyof typeof tokens.bg;

// Helper function to get token values
export const getToken = {
  size: (size: SizeToken) => tokens.size[size],
  text: (size: TextToken) => tokens.text[size],
  spacing: (size: SpacingToken) => tokens.spacing[size],
  gap: (size: GapToken) => tokens.gap[size],
  radius: (size: RadiusToken) => tokens.radius[size],
  duration: (duration: DurationToken) => tokens.duration[duration],
  color: (color: ColorToken) => tokens.colors[color],
  bg: (bg: BgToken) => tokens.bg[bg]
};
