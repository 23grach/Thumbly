/**
 * Thumbly Plugin Utilities
 * Модульные функции для тестирования
 */

/**
 * Interface for thumbnail data
 */
export interface ThumbnailData {
  title: string;
  description: string;
  emoji: string;
  theme: 'light' | 'dark';
  customImage?: {
    data: Uint8Array;
    name: string;
    width: number;
    height: number;
  } | null;
}

/**
 * Theme type definition
 */
export type ThemeColors = {
  background: RGB;
  text: RGB;
};

/**
 * Font configuration type
 */
export type FontStyle = { family: string; style: string };

/**
 * RGB color type from Figma API
 */
export type RGB = { r: number; g: number; b: number };

/**
 * Theme configuration with proper color definitions
 */
export const THEMES: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: { r: 1, g: 1, b: 1 }, // #FFFFFF
    text: { r: 0.043, g: 0.024, b: 0.141 } // #0B0624
  },
  dark: {
    background: { r: 0.118, g: 0.118, b: 0.118 }, // #1E1E1E
    text: { r: 1, g: 1, b: 1 } // #FFFFFF
  }
};

/**
 * Font configuration with fallback chains
 */
export const FONT_CONFIG = {
  primary: [
    { family: "Rubik", style: "Bold" },
    { family: "Inter", style: "Bold" },
    { family: "Roboto", style: "Bold" }
  ],
  secondary: [
    { family: "Rubik", style: "Regular" },
    { family: "Inter", style: "Regular" },
    { family: "Roboto", style: "Regular" }
  ],
  title: [
    { family: "Archivo", style: "Bold" },
    { family: "Inter", style: "Bold" },
    { family: "Roboto", style: "Bold" }
  ]
} as const;

/**
 * Frame dimensions and layout configuration
 */
export const FRAME_CONFIG = {
  width: 1920,
  height: 960,
  padding: {
    horizontal: 240,
    vertical: 100
  },
  emoji: {
    size: 224
  },
  spacing: {
    textGap: 24
  }
} as const;

/**
 * Typography configuration
 */
export const TYPOGRAPHY = {
  emoji: {
    fontSize: 224,
    lineHeight: 118.5
  },
  title: {
    fontSize: 145,
    lineHeight: 117.2,
    letterSpacing: -5
  },
  description: {
    fontSize: 72,
    lineHeight: 118.5,
    letterSpacing: -2,
    opacity: 0.8
  }
} as const;

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validates thumbnail data input
   */
  validateThumbnailData(data: ThumbnailData): void {
    if (!data.title?.trim()) {
      throw new Error('Title is required and cannot be empty');
    }
    if (!data.description?.trim()) {
      throw new Error('Description is required and cannot be empty');  
    }
    if (!data.emoji?.trim()) {
      throw new Error('Emoji is required and cannot be empty');
    }
    if (!['light', 'dark'].includes(data.theme)) {
      throw new Error('Theme must be either "light" or "dark"');
    }
  }
};

/**
 * Font utilities for loading and managing fonts
 */
export const FontUtils = {
  /**
   * Gets all unique fonts from configuration
   */
  getAllUniqueFonts(): FontStyle[] {
    const allFonts = [
      ...FONT_CONFIG.primary,
      ...FONT_CONFIG.secondary,
      ...FONT_CONFIG.title
    ];

    return allFonts.reduce((acc, font) => {
      const key = `${font.family}-${font.style}`;
      if (!acc.some(f => `${f.family}-${f.style}` === key)) {
        acc.push(font);
      }
      return acc;
    }, [] as FontStyle[]);
  },

  /**
   * Selects first available font from options
   */
  selectAvailableFont(fontOptions: readonly FontStyle[]): FontStyle {
    return fontOptions[0] || { family: "Roboto", style: "Regular" };
  }
};

/**
 * Color utilities for theme management
 */
export const ColorUtils = {
  /**
   * Calculates luminance for accessibility checking
   */
  getLuminance(color: RGB): number {
    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  },

  /**
   * Calculates contrast ratio between two colors
   */
  getContrastRatio(color1: RGB, color2: RGB): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Validates if RGB values are in valid range [0, 1]
   */
  isValidRGB(color: RGB): boolean {
    return color.r >= 0 && color.r <= 1 &&
           color.g >= 0 && color.g <= 1 &&
           color.b >= 0 && color.b <= 1;
  }
};

/**
 * Layout calculation utilities
 */
export const LayoutUtils = {
  /**
   * Calculates frame position for centering in viewport
   */
  calculateFramePosition(
    frameSize: { width: number; height: number },
    viewportCenter: { x: number; y: number }
  ): { x: number; y: number } {
    return {
      x: viewportCenter.x - frameSize.width / 2,
      y: viewportCenter.y - frameSize.height / 2
    };
  },

  /**
   * Calculates content area after padding
   */
  calculateContentArea(
    frameSize: { width: number; height: number },
    padding: { horizontal: number; vertical: number }
  ): { width: number; height: number } {
    return {
      width: frameSize.width - (padding.horizontal * 2),
      height: frameSize.height - (padding.vertical * 2)
    };
  },

  /**
   * Validates aspect ratio
   */
  validateAspectRatio(width: number, height: number): number {
    return width / height;
  }
};

/**
 * Typography utilities
 */
export const TypographyUtils = {
  /**
   * Validates font size hierarchy
   */
  validateFontSizeHierarchy(sizes: { large: number; medium: number; small: number }): boolean {
    return sizes.large > sizes.medium && sizes.medium > sizes.small;
  },

  /**
   * Calculates optimal line height as percentage of font size
   */
  calculateLineHeight(fontSize: number, ratio: number = 1.4): number {
    return fontSize * ratio;
  },

  /**
   * Validates letter spacing range
   */
  isValidLetterSpacing(letterSpacing: number): boolean {
    return letterSpacing >= -10 && letterSpacing <= 10;
  }
};

/**
 * Message utilities for plugin communication
 */
export const MessageUtils = {
  /**
   * Creates a create-thumbnail message
   */
  createThumbnailMessage(data: ThumbnailData): { type: string; data: ThumbnailData } {
    return {
      type: 'create-thumbnail',
      data
    };
  },

  /**
   * Creates a cancel message
   */
  createCancelMessage(): { type: string } {
    return { type: 'cancel' };
  },

  /**
   * Validates message structure
   */
  isValidMessage(message: unknown): boolean {
    return !!(message && 
           typeof (message as any).type === 'string' && 
           ['create-thumbnail', 'cancel'].includes((message as any).type));
  }
}; 