/**
 * Thumbly - Figma plugin for creating thumbnail frames
 * Creates beautiful thumbnail frames with title, description, emoji and theme support
 */

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Show the HTML UI
figma.showUI(__html__, { width: 320, height: 440 });

/**
 * Interface for thumbnail data
 */
interface ThumbnailData {
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
type ThemeColors = {
  background: RGB;
  text: RGB;
};

/**
 * Font configuration type
 */
type FontStyle = { family: string; style: string };

/**
 * Theme configuration with proper color definitions
 */
const THEMES: Record<'light' | 'dark', ThemeColors> = {
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
const FONT_CONFIG = {
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
const FRAME_CONFIG = {
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
const TYPOGRAPHY = {
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
const ValidationUtils = {
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
const FontUtils = {
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
   * Loads fonts with fallback strategy
   */
  async loadFonts(): Promise<void> {
    const uniqueFonts = this.getAllUniqueFonts();

    try {
      await Promise.all(
        uniqueFonts.map(font => figma.loadFontAsync(font))
      );
    } catch (error) {
      console.warn('Some fonts could not be loaded:', error);
      await this.loadFallbackFonts();
    }
  },

  /**
   * Loads fallback fonts when primary fonts fail
   */
  async loadFallbackFonts(): Promise<void> {
    const fallbackFonts = [
      { family: "Inter", style: "Bold" },
      { family: "Inter", style: "Regular" },
      { family: "Roboto", style: "Bold" },
      { family: "Roboto", style: "Regular" }
    ];

    try {
      await Promise.all(
        fallbackFonts.map(font => figma.loadFontAsync(font))
      );
    } catch (fallbackError) {
      console.warn('All font loading failed, using system defaults');
    }
  },

  /**
   * Selects first available font from options
   */
  selectAvailableFont(fontOptions: readonly FontStyle[]): FontStyle {
    // In a real implementation, we would check font availability
    // For now, return the first option or fallback
    return fontOptions[0] || { family: "Roboto", style: "Regular" };
  }
};

/**
 * Text node creation utilities
 */
const TextNodeUtils = {
  /**
   * Creates a text node with comprehensive configuration options
   */
  createTextNode(
    text: string,
    fontOptions: readonly FontStyle[],
    fontSize: number,
    color: RGB,
    options: {
      letterSpacing?: number;
      opacity?: number;
      lineHeight?: number;
      textAlign?: 'LEFT' | 'CENTER' | 'RIGHT';
      textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
      autoResize?: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT';
      fixedSize?: { width: number; height: number };
    } = {}
  ): TextNode {
    const textNode = figma.createText();
    
    this.applyFont(textNode, fontOptions);
    this.applyTextContent(textNode, text, fontSize, color);
    this.applyTextOptions(textNode, options);
    
    return textNode;
  },

  /**
   * Applies font to text node with fallback handling
   */
  applyFont(textNode: TextNode, fontOptions: readonly FontStyle[]): void {
    const selectedFont = FontUtils.selectAvailableFont(fontOptions);
    
    try {
      textNode.fontName = selectedFont;
    } catch (error) {
      console.warn(`Could not load font ${selectedFont.family}, using default`);
      textNode.fontName = { family: "Roboto", style: "Regular" };
    }
  },

  /**
   * Applies basic text content and styling
   */
  applyTextContent(textNode: TextNode, text: string, fontSize: number, color: RGB): void {
    textNode.characters = text;
    textNode.fontSize = fontSize;
    textNode.fills = [{ type: 'SOLID', color }];
  },

  /**
   * Applies advanced text formatting options
   */
  applyTextOptions(textNode: TextNode, options: {
    letterSpacing?: number;
    opacity?: number;
    lineHeight?: number;
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT';
    textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
    autoResize?: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT';
    fixedSize?: { width: number; height: number };
  }): void {
    if (options.letterSpacing !== undefined) {
      textNode.letterSpacing = { unit: 'PERCENT', value: options.letterSpacing };
    }
    
    if (options.opacity !== undefined) {
      textNode.opacity = options.opacity;
    }
    
    if (options.lineHeight !== undefined) {
      textNode.lineHeight = { unit: 'PERCENT', value: options.lineHeight };
    }
    
    if (options.textAlign) {
      textNode.textAlignHorizontal = options.textAlign;
    }
    
    if (options.textAlignVertical) {
      textNode.textAlignVertical = options.textAlignVertical;
    }
    
    textNode.textAutoResize = options.autoResize || 'WIDTH_AND_HEIGHT';
    
    if (options.fixedSize && options.autoResize === 'NONE') {
      textNode.resize(options.fixedSize.width, options.fixedSize.height);
    }
  }
};

/**
 * Node creation factories for different element types
 */
const NodeFactories = {
  /**
   * Creates emoji text node with proper styling
   */
  createEmojiNode(emoji: string, theme: ThemeColors): TextNode {
    const emojiNode = TextNodeUtils.createTextNode(
      emoji,
      FONT_CONFIG.primary,
      TYPOGRAPHY.emoji.fontSize,
      theme.text,
      {
        lineHeight: TYPOGRAPHY.emoji.lineHeight,
        autoResize: 'NONE',
        fixedSize: { width: FRAME_CONFIG.emoji.size, height: FRAME_CONFIG.emoji.size },
        textAlign: 'CENTER',
        textAlignVertical: 'CENTER'
      }
    );
    
    emojiNode.name = `Emoji: ${emoji}`;
    return emojiNode;
  },

  /**
   * Creates title text node with proper styling
   */
  createTitleNode(title: string, theme: ThemeColors): TextNode {
    const titleNode = TextNodeUtils.createTextNode(
      title,
      FONT_CONFIG.title,
      TYPOGRAPHY.title.fontSize,
      theme.text,
      {
        lineHeight: TYPOGRAPHY.title.lineHeight,
        letterSpacing: TYPOGRAPHY.title.letterSpacing,
        textAlign: 'LEFT'
      }
    );
    
    titleNode.name = `Title: ${title}`;
    return titleNode;
  },

  /**
   * Creates description text node with proper styling
   */
  createDescriptionNode(description: string, theme: ThemeColors): TextNode {
    const descriptionNode = TextNodeUtils.createTextNode(
      description,
      FONT_CONFIG.secondary,
      TYPOGRAPHY.description.fontSize,
      theme.text,
      {
        lineHeight: TYPOGRAPHY.description.lineHeight,
        letterSpacing: TYPOGRAPHY.description.letterSpacing,
        opacity: TYPOGRAPHY.description.opacity,
        textAlign: 'LEFT'
      }
    );
    
    descriptionNode.name = `Description: ${description}`;
    return descriptionNode;
  },

  /**
   * Creates custom image node with fixed dimensions
   */
  async createCustomImageNode(imageData: Uint8Array, imageName: string): Promise<FrameNode> {
    const image = figma.createImage(imageData);
    const targetSize = FRAME_CONFIG.emoji.size;
    
    const imageFrame = figma.createFrame();
    imageFrame.name = `Custom Image: ${imageName}`;
    imageFrame.resize(targetSize, targetSize);
    imageFrame.fills = [{
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FILL'
    }];
    
    // Add rounded corners for custom images
    imageFrame.cornerRadius = 16;
    
    // Remove stroke and other styling
    imageFrame.strokes = [];
    imageFrame.strokeWeight = 0;
    
    return imageFrame;
  }
};

/**
 * Layout utilities for positioning and organizing elements
 */
const LayoutUtils = {
  /**
   * Creates text container frame with title and description
   */
  createTextFrame(title: string, description: string, theme: ThemeColors): FrameNode {
    const textFrame = figma.createFrame();
    textFrame.name = 'Text Content';
    textFrame.layoutMode = 'VERTICAL';
    textFrame.primaryAxisSizingMode = 'AUTO';
    textFrame.counterAxisSizingMode = 'AUTO';
    textFrame.itemSpacing = FRAME_CONFIG.spacing.textGap;
    textFrame.primaryAxisAlignItems = 'MIN';
    textFrame.counterAxisAlignItems = 'MIN';
    textFrame.fills = [];
    
    const titleNode = NodeFactories.createTitleNode(title, theme);
    const descriptionNode = NodeFactories.createDescriptionNode(description, theme);
    
    textFrame.appendChild(titleNode);
    textFrame.appendChild(descriptionNode);
    
    return textFrame;
  },

  /**
   * Positions frame in viewport and selects it
   */
  positionAndSelectFrame(frame: FrameNode): void {
    // Add frame to current page
    figma.currentPage.appendChild(frame);
    
    // Center the frame in viewport
    const viewportCenter = figma.viewport.center;
    frame.x = viewportCenter.x - frame.width / 2;
    frame.y = viewportCenter.y - frame.height / 2;
    
    // Select the frame and focus on it
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
  }
};

/**
 * Main thumbnail creation orchestrator
 */
const ThumbnailCreator = {
  /**
   * Creates emoji or custom image node based on data
   */
  async createEmojiOrImageNode(data: ThumbnailData, theme: ThemeColors): Promise<TextNode | FrameNode> {
    if (data.customImage?.data) {
      return await NodeFactories.createCustomImageNode(data.customImage.data, data.customImage.name);
    }
    return NodeFactories.createEmojiNode(data.emoji, theme);
  },

  /**
   * Creates complete thumbnail frame with all elements
   */
  async createThumbnailFrame(data: ThumbnailData): Promise<FrameNode> {
    ValidationUtils.validateThumbnailData(data);
    
    const theme = THEMES[data.theme];
    const mainFrame = figma.createFrame();
    
    this.configureMainFrame(mainFrame, theme);
    
    const emojiOrImageNode = await this.createEmojiOrImageNode(data, theme);
    const textFrame = LayoutUtils.createTextFrame(data.title, data.description, theme);
    
    this.layoutElements(mainFrame, emojiOrImageNode, textFrame);
    
    return mainFrame;
  },

  /**
   * Configures the main thumbnail frame properties
   */
  configureMainFrame(frame: FrameNode, theme: ThemeColors): void {
    frame.name = '.thumbnail';
    frame.resize(FRAME_CONFIG.width, FRAME_CONFIG.height);
    frame.fills = [{ type: 'SOLID', color: theme.background }];
    frame.layoutMode = 'VERTICAL';
    frame.paddingLeft = FRAME_CONFIG.padding.horizontal;
    frame.paddingTop = FRAME_CONFIG.padding.vertical;
    frame.paddingRight = FRAME_CONFIG.padding.horizontal;
    frame.paddingBottom = FRAME_CONFIG.padding.vertical;
    frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
    frame.counterAxisAlignItems = 'MIN';
    frame.primaryAxisSizingMode = 'FIXED';
    frame.counterAxisSizingMode = 'FIXED';
  },

  /**
   * Arranges emoji/image and text elements within the frame
   */
  layoutElements(mainFrame: FrameNode, emojiOrImageNode: TextNode | FrameNode, textFrame: FrameNode): void {
    mainFrame.appendChild(emojiOrImageNode);
    mainFrame.appendChild(textFrame);
  },

  /**
   * Handles the complete thumbnail creation process
   */
  async handleCreateThumbnail(data: ThumbnailData): Promise<void> {
    try {
      await FontUtils.loadFonts();
      const thumbnailFrame = await this.createThumbnailFrame(data);
      LayoutUtils.positionAndSelectFrame(thumbnailFrame);
      
      figma.notify('✅ Thumbnail created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error creating thumbnail:', error);
      figma.notify(`❌ Error: ${errorMessage}`);
    }
  }
};

/**
 * Message handler for UI communication
 */
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-thumbnail') {
    await ThumbnailCreator.handleCreateThumbnail(msg.data);
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
