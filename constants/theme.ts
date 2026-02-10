/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#818CF8';

export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#0B0F1A',
    tint: tintColorLight,
    icon: '#A0AEC0',
    tabIconDefault: '#4A5568',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0B0F1A',
    tint: tintColorDark,
    icon: '#A0AEC0',
    tabIconDefault: '#4A5568',
    tabIconSelected: tintColorDark,
  },
};

export const SpaceTheme = {
  background: '#0B0F1A',
  card: '#141926',
  border: '#1E2636',
  accent: '#818CF8',
  accentLight: '#A5B4FC',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#4A5568',
  success: '#22C55E',
  warning: '#F59E0B',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
