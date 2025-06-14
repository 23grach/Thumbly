/**
 * Thumbly - Figma plugin for creating thumbnail frames
 * Creates beautiful thumbnail frames with title, description, emoji and theme support
 */

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Show the HTML UI
figma.showUI(__html__, { width: 320, height: 520 });

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
 * Theme configuration
 */
const THEMES = {
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
 * Load fonts required for the thumbnail
 */
async function loadFonts(): Promise<void> {
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Rubik", style: "Bold" }),
      figma.loadFontAsync({ family: "Rubik", style: "Regular" }),
      figma.loadFontAsync({ family: "Archivo", style: "Bold" })
    ]);
  } catch (error) {
    // Fallback to system fonts if custom fonts are not available
    try {
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Regular" })
      ]);
    } catch (fallbackError) {
      // If Inter is also not available, load default fonts
      await Promise.all([
        figma.loadFontAsync({ family: "Roboto", style: "Bold" }),
        figma.loadFontAsync({ family: "Roboto", style: "Regular" })
      ]);
    }
  }
}

/**
 * Create a text node with specified properties
 */
function createTextNode(
  text: string,
  fontFamily: string,
  fontStyle: string,
  fontSize: number,
  color: RGB,
  letterSpacing?: number,
  opacity?: number
): TextNode {
  const textNode = figma.createText();
  
  // Set font first, then text
  try {
    textNode.fontName = { family: fontFamily, style: fontStyle };
  } catch (error) {
    // Fallback to Inter if font is not available
    try {
      textNode.fontName = { family: "Inter", style: fontStyle === "Bold" ? "Bold" : "Regular" };
    } catch (fallbackError) {
      // Final fallback to Roboto
      textNode.fontName = { family: "Roboto", style: fontStyle === "Bold" ? "Bold" : "Regular" };
    }
  }
  
  // Set text after font is set
  textNode.characters = text;
  
  textNode.fontSize = fontSize;
  textNode.fills = [{ type: 'SOLID', color }];
  textNode.textAlignVertical = 'BOTTOM';
  textNode.lineHeight = { unit: 'PERCENT', value: 100 };
  
  if (letterSpacing !== undefined) {
    textNode.letterSpacing = { unit: 'PERCENT', value: letterSpacing };
  }
  
  if (opacity !== undefined) {
    textNode.opacity = opacity;
  }
  
  // Set text auto resize by default (can be overridden later)
  textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
  
  return textNode;
}

/**
 * Create the main thumbnail frame
 */
async function createThumbnailFrame(data: ThumbnailData): Promise<void> {
  // Load required fonts
  await loadFonts();
  
  // Get theme colors
  const theme = THEMES[data.theme];
  
  // Create main frame
  const frame = figma.createFrame();
  frame.name = `Thumbnail - ${data.title}`;
  frame.resize(1920, 960);
  frame.fills = [{ type: 'SOLID', color: theme.background }];
  
  // Setup Auto Layout
  frame.layoutMode = 'VERTICAL';
  frame.paddingLeft = 240;
  frame.paddingTop = 100;
  frame.paddingRight = 240;
  frame.paddingBottom = 100;
  frame.primaryAxisAlignItems = 'SPACE_BETWEEN'; // Распределение по краям
  frame.counterAxisAlignItems = 'MIN';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'FIXED';
  
  // Create emoji text node directly
  const emojiNode = createTextNode(
    data.emoji,
    "Rubik",
    "Bold",
    224,
    theme.text
  );
  emojiNode.name = data.emoji;
  emojiNode.lineHeight = { unit: 'PERCENT', value: 118.5 };
  // Set fixed size 224x224
  emojiNode.textAutoResize = 'NONE';
  emojiNode.resize(224, 224);
  emojiNode.textAlignHorizontal = 'CENTER';
  emojiNode.textAlignVertical = 'CENTER';
  
  frame.appendChild(emojiNode);
  
  // Create Text Frame
  const textFrame = figma.createFrame();
  textFrame.name = "Text";
  textFrame.layoutMode = 'VERTICAL';
  textFrame.primaryAxisSizingMode = 'AUTO';
  textFrame.counterAxisSizingMode = 'AUTO';
  textFrame.itemSpacing = 24; // Gap between title and description
  textFrame.primaryAxisAlignItems = 'MIN';
  textFrame.counterAxisAlignItems = 'MIN';
  textFrame.fills = [];
  
  // Create title text node
  const titleNode = createTextNode(
    data.title,
    "Archivo",
    "Bold",
    145,
    theme.text,
    -5 // Letter spacing -5%
  );
  titleNode.name = data.title;
  titleNode.lineHeight = { unit: 'PERCENT', value: 117.2 };
  
  textFrame.appendChild(titleNode);
  
  // Create description text node (if provided)
  if (data.description.trim()) {
    const descriptionNode = createTextNode(
      data.description,
      "Rubik",
      "Regular",
      72,
      theme.text,
      -2, // Letter spacing -2%
      0.8 // Opacity 80%
    );
    descriptionNode.name = data.description;
    descriptionNode.lineHeight = { unit: 'PERCENT', value: 118.5 };
    
    textFrame.appendChild(descriptionNode);
  }
  
  frame.appendChild(textFrame);
  
  // Add frame to current page
  figma.currentPage.appendChild(frame);
  
  // Center the frame in viewport
  const viewportCenter = figma.viewport.center;
  frame.x = viewportCenter.x - frame.width / 2;
  frame.y = viewportCenter.y - frame.height / 2;
  
  // Select the frame
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}

/**
 * Handle messages from the UI
 */
figma.ui.onmessage = async (msg: { type: string; data?: ThumbnailData }) => {
  try {
    switch (msg.type) {
      case 'create-thumbnail':
        if (msg.data) {
          await createThumbnailFrame(msg.data);
          figma.notify('✅ Thumbnail создан успешно!');
        }
        break;
        
      case 'cancel':
        break;
        
      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    figma.notify('❌ Ошибка при создании thumbnail. Проверьте консоль для деталей.');
  }
  
  // Close the plugin
  figma.closePlugin();
};
