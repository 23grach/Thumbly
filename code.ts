/**
 * Thumbly - Figma plugin for creating thumbnail frames
 * Creates beautiful thumbnail frames with title, description, emoji and theme support
 */

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Show the HTML UI
figma.showUI(__html__, { width: 320, height: 400 });

/**
 * Interface for thumbnail data
 */
interface ThumbnailData {
  title: string;
  description: string;
  emoji: string;
  theme: 'light' | 'dark';
}

/**
 * Theme type definition
 */
type ThemeColors = {
  background: RGB;
  text: RGB;
};

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
 * Load fonts with fallback chain
 */
async function loadFonts(): Promise<void> {
  const fontsToLoad = [
    ...FONT_CONFIG.primary,
    ...FONT_CONFIG.secondary,
    ...FONT_CONFIG.title
  ];

  // Remove duplicates
  const uniqueFonts = fontsToLoad.reduce((acc, font) => {
    const key = `${font.family}-${font.style}`;
    if (!acc.some(f => `${f.family}-${f.style}` === key)) {
      acc.push(font);
    }
    return acc;
  }, [] as typeof fontsToLoad);

  try {
    await Promise.all(
      uniqueFonts.map(font => figma.loadFontAsync(font))
    );
  } catch (error) {
    console.warn('Some fonts could not be loaded:', error);
    // Load fallback fonts
    try {
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Regular" })
      ]);
    } catch (fallbackError) {
      console.warn('Fallback fonts not available, using system fonts');
      await Promise.all([
        figma.loadFontAsync({ family: "Roboto", style: "Bold" }),
        figma.loadFontAsync({ family: "Roboto", style: "Regular" })
      ]);
    }
  }
}

/**
 * Try to load a font with fallback options
 */
function tryLoadFont(fontOptions: readonly { family: string; style: string }[]): { family: string; style: string } {
  for (const font of fontOptions) {
    try {
      return font;
    } catch (error) {
      continue;
    }
  }
  // Final fallback
  return { family: "Roboto", style: "Regular" };
}

/**
 * Create a text node with specified properties and improved error handling
 */
function createTextNode(
  text: string,
  fontOptions: readonly { family: string; style: string }[],
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
  
  // Set font with fallback
  const selectedFont = tryLoadFont(fontOptions);
  try {
    textNode.fontName = selectedFont;
  } catch (error) {
    console.warn(`Could not load font ${selectedFont.family}, using default`);
    textNode.fontName = { family: "Roboto", style: "Regular" };
  }
  
  // Set text content
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fills = [{ type: 'SOLID', color }];
  
  // Apply options
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
  
  // Set text auto resize
  textNode.textAutoResize = options.autoResize || 'WIDTH_AND_HEIGHT';
  
  // Apply fixed size if specified
  if (options.fixedSize && options.autoResize === 'NONE') {
    textNode.resize(options.fixedSize.width, options.fixedSize.height);
  }
  
  return textNode;
}

/**
 * Create the emoji node with proper styling
 */
function createEmojiNode(emoji: string, theme: ThemeColors): TextNode {
  const emojiNode = createTextNode(
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
}

/**
 * Create the title text node
 */
function createTitleNode(title: string, theme: ThemeColors): TextNode {
  const titleNode = createTextNode(
    title,
    FONT_CONFIG.title,
    TYPOGRAPHY.title.fontSize,
    theme.text,
    {
      letterSpacing: TYPOGRAPHY.title.letterSpacing,
      lineHeight: TYPOGRAPHY.title.lineHeight
    }
  );
  
  titleNode.name = `Title: ${title}`;
  return titleNode;
}

/**
 * Create the description text node
 */
function createDescriptionNode(description: string, theme: ThemeColors): TextNode {
  const descriptionNode = createTextNode(
    description,
    FONT_CONFIG.secondary,
    TYPOGRAPHY.description.fontSize,
    theme.text,
    {
      letterSpacing: TYPOGRAPHY.description.letterSpacing,
      lineHeight: TYPOGRAPHY.description.lineHeight,
      opacity: TYPOGRAPHY.description.opacity
    }
  );
  
  descriptionNode.name = `Description: ${description}`;
  return descriptionNode;
}

/**
 * Create the text container frame
 */
function createTextFrame(title: string, description: string, theme: ThemeColors): FrameNode {
  const textFrame = figma.createFrame();
  textFrame.name = "Text Content";
  textFrame.layoutMode = 'VERTICAL';
  textFrame.primaryAxisSizingMode = 'AUTO';
  textFrame.counterAxisSizingMode = 'AUTO';
  textFrame.itemSpacing = FRAME_CONFIG.spacing.textGap;
  textFrame.primaryAxisAlignItems = 'MIN';
  textFrame.counterAxisAlignItems = 'MIN';
  textFrame.fills = [];
  
  // Add title
  const titleNode = createTitleNode(title, theme);
  textFrame.appendChild(titleNode);
  
  // Add description if provided
  if (description.trim()) {
    const descriptionNode = createDescriptionNode(description, theme);
    textFrame.appendChild(descriptionNode);
  }
  
  return textFrame;
}

/**
 * Create the main thumbnail frame with improved structure
 */
async function createThumbnailFrame(data: ThumbnailData): Promise<FrameNode> {
  // Load required fonts
  await loadFonts();
  
  // Get theme colors
  const theme = THEMES[data.theme];
  
  // Create main frame
  const frame = figma.createFrame();
  frame.name = `.thumbnail`;
  frame.resize(FRAME_CONFIG.width, FRAME_CONFIG.height);
  frame.fills = [{ type: 'SOLID', color: theme.background }];
  
  // Setup Auto Layout
  frame.layoutMode = 'VERTICAL';
  frame.paddingLeft = FRAME_CONFIG.padding.horizontal;
  frame.paddingTop = FRAME_CONFIG.padding.vertical;
  frame.paddingRight = FRAME_CONFIG.padding.horizontal;
  frame.paddingBottom = FRAME_CONFIG.padding.vertical;
  frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
  frame.counterAxisAlignItems = 'MIN';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'FIXED';
  
  // Create and add emoji node
  const emojiNode = createEmojiNode(data.emoji, theme);
  frame.appendChild(emojiNode);
  
  // Create and add text frame
  const textFrame = createTextFrame(data.title, data.description, theme);
  frame.appendChild(textFrame);
  
  return frame;
}

/**
 * Position frame in viewport and select it
 */
function positionAndSelectFrame(frame: FrameNode): void {
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

/**
 * Handle thumbnail creation with proper error handling
 */
async function handleCreateThumbnail(data: ThumbnailData): Promise<void> {
  try {
    const frame = await createThumbnailFrame(data);
    positionAndSelectFrame(frame);
    figma.notify('✅ Thumbnail created successfully!');
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    figma.notify('❌ Failed to create thumbnail. Check console for details.');
    throw error;
  }
}

/**
 * Handle messages from the UI with improved error handling
 */
figma.ui.onmessage = async (msg: { type: string; data?: ThumbnailData }) => {
  try {
    switch (msg.type) {
      case 'create-thumbnail':
        if (!msg.data) {
          figma.notify('❌ No thumbnail data provided');
          return;
        }
        await handleCreateThumbnail(msg.data);
        break;
        
      case 'cancel':
        figma.notify('Thumbnail creation cancelled');
        figma.closePlugin();
        break;
        
      default:
        console.warn('Unknown message type:', msg.type);
        figma.notify('❌ Unknown action requested');
    }
  } catch (error) {
    console.error('Plugin error:', error);
    figma.notify('❌ An unexpected error occurred. Check console for details.');
  }
};
