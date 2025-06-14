/**
 * Real code tests for Thumbly plugin utilities
 */
import { ValidationUtils, FontUtils, ColorUtils, LayoutUtils, TypographyUtils, MessageUtils, THEMES, FONT_CONFIG, FRAME_CONFIG, TYPOGRAPHY } from '../utils';
describe('🚀 Real Code Tests - ValidationUtils', () => {
    describe('validateThumbnailData', () => {
        test('should pass validation for valid data', () => {
            const validData = {
                title: 'Valid Title',
                description: 'Valid Description',
                emoji: '🚀',
                theme: 'light',
                customImage: null
            };
            expect(() => {
                ValidationUtils.validateThumbnailData(validData);
            }).not.toThrow();
        });
        test('should throw error for empty title', () => {
            const invalidData = {
                title: '',
                description: 'Valid Description',
                emoji: '🚀',
                theme: 'light',
                customImage: null
            };
            expect(() => {
                ValidationUtils.validateThumbnailData(invalidData);
            }).toThrow('Title is required and cannot be empty');
        });
        test('should throw error for whitespace-only description', () => {
            const invalidData = {
                title: 'Valid Title',
                description: '   ',
                emoji: '🚀',
                theme: 'light',
                customImage: null
            };
            expect(() => {
                ValidationUtils.validateThumbnailData(invalidData);
            }).toThrow('Description is required and cannot be empty');
        });
        test('should throw error for invalid theme', () => {
            const invalidData = {
                title: 'Valid Title',
                description: 'Valid Description',
                emoji: '🚀',
                theme: 'purple',
                customImage: null
            };
            expect(() => {
                ValidationUtils.validateThumbnailData(invalidData);
            }).toThrow('Theme must be either "light" or "dark"');
        });
    });
});
describe('🎨 Real Code Tests - FontUtils', () => {
    describe('getAllUniqueFonts', () => {
        test('should return unique fonts from all configs', () => {
            const uniqueFonts = FontUtils.getAllUniqueFonts();
            expect(uniqueFonts.length).toBeGreaterThan(0);
            expect(uniqueFonts).toContainEqual({ family: "Rubik", style: "Bold" });
            expect(uniqueFonts).toContainEqual({ family: "Archivo", style: "Bold" });
            expect(uniqueFonts).toContainEqual({ family: "Inter", style: "Regular" });
        });
        test('should not contain duplicate fonts', () => {
            const uniqueFonts = FontUtils.getAllUniqueFonts();
            const fontKeys = uniqueFonts.map(f => `${f.family}-${f.style}`);
            const uniqueKeys = [...new Set(fontKeys)];
            expect(fontKeys.length).toBe(uniqueKeys.length);
        });
    });
    describe('selectAvailableFont', () => {
        test('should return first font from options', () => {
            const fontOptions = [
                { family: "Rubik", style: "Bold" },
                { family: "Inter", style: "Bold" }
            ];
            const selected = FontUtils.selectAvailableFont(fontOptions);
            expect(selected).toEqual({ family: "Rubik", style: "Bold" });
        });
        test('should return fallback for empty options', () => {
            const selected = FontUtils.selectAvailableFont([]);
            expect(selected).toEqual({ family: "Roboto", style: "Regular" });
        });
    });
});
describe('🌈 Real Code Tests - ColorUtils', () => {
    describe('getLuminance', () => {
        test('should calculate luminance for white', () => {
            const white = { r: 1, g: 1, b: 1 };
            const luminance = ColorUtils.getLuminance(white);
            expect(luminance).toBeCloseTo(1, 5);
        });
        test('should calculate luminance for black', () => {
            const black = { r: 0, g: 0, b: 0 };
            const luminance = ColorUtils.getLuminance(black);
            expect(luminance).toBe(0);
        });
        test('should calculate luminance for gray', () => {
            const gray = { r: 0.5, g: 0.5, b: 0.5 };
            const luminance = ColorUtils.getLuminance(gray);
            expect(luminance).toBeCloseTo(0.5);
        });
    });
    describe('getContrastRatio', () => {
        test('should calculate contrast between black and white', () => {
            const black = { r: 0, g: 0, b: 0 };
            const white = { r: 1, g: 1, b: 1 };
            const contrast = ColorUtils.getContrastRatio(black, white);
            expect(contrast).toBeCloseTo(21, 1); // Perfect contrast
        });
        test('should calculate contrast for theme colors', () => {
            const lightBg = THEMES.light.background;
            const lightText = THEMES.light.text;
            const contrast = ColorUtils.getContrastRatio(lightBg, lightText);
            expect(contrast).toBeGreaterThan(4.5); // WCAG AA standard
        });
    });
    describe('isValidRGB', () => {
        test('should validate correct RGB values', () => {
            const validColor = { r: 0.5, g: 0.8, b: 0.2 };
            expect(ColorUtils.isValidRGB(validColor)).toBe(true);
        });
        test('should reject RGB values outside range', () => {
            const invalidColor = { r: 1.5, g: -0.2, b: 0.5 };
            expect(ColorUtils.isValidRGB(invalidColor)).toBe(false);
        });
    });
});
describe('📐 Real Code Tests - LayoutUtils', () => {
    describe('calculateFramePosition', () => {
        test('should center frame in viewport', () => {
            const frameSize = { width: 1920, height: 960 };
            const viewportCenter = { x: 960, y: 480 };
            const position = LayoutUtils.calculateFramePosition(frameSize, viewportCenter);
            expect(position.x).toBe(0); // 960 - 1920/2
            expect(position.y).toBe(0); // 480 - 960/2
        });
        test('should handle different viewport sizes', () => {
            const frameSize = { width: 400, height: 300 };
            const viewportCenter = { x: 500, y: 400 };
            const position = LayoutUtils.calculateFramePosition(frameSize, viewportCenter);
            expect(position.x).toBe(300); // 500 - 200
            expect(position.y).toBe(250); // 400 - 150
        });
    });
    describe('calculateContentArea', () => {
        test('should calculate content area with padding', () => {
            const frameSize = { width: 1920, height: 960 };
            const padding = { horizontal: 240, vertical: 100 };
            const contentArea = LayoutUtils.calculateContentArea(frameSize, padding);
            expect(contentArea.width).toBe(1440); // 1920 - 480
            expect(contentArea.height).toBe(760); // 960 - 200
        });
        test('should handle zero padding', () => {
            const frameSize = { width: 800, height: 600 };
            const padding = { horizontal: 0, vertical: 0 };
            const contentArea = LayoutUtils.calculateContentArea(frameSize, padding);
            expect(contentArea.width).toBe(800);
            expect(contentArea.height).toBe(600);
        });
    });
    describe('validateAspectRatio', () => {
        test('should calculate 16:9 aspect ratio', () => {
            const ratio = LayoutUtils.validateAspectRatio(1920, 960);
            expect(ratio).toBe(2); // 16:9 = 2:1
        });
        test('should calculate square aspect ratio', () => {
            const ratio = LayoutUtils.validateAspectRatio(500, 500);
            expect(ratio).toBe(1);
        });
    });
});
describe('📝 Real Code Tests - TypographyUtils', () => {
    describe('validateFontSizeHierarchy', () => {
        test('should validate correct hierarchy', () => {
            const sizes = { large: 24, medium: 18, small: 14 };
            expect(TypographyUtils.validateFontSizeHierarchy(sizes)).toBe(true);
        });
        test('should reject invalid hierarchy', () => {
            const sizes = { large: 14, medium: 18, small: 24 };
            expect(TypographyUtils.validateFontSizeHierarchy(sizes)).toBe(false);
        });
    });
    describe('calculateLineHeight', () => {
        test('should calculate line height with default ratio', () => {
            const lineHeight = TypographyUtils.calculateLineHeight(16);
            expect(lineHeight).toBe(22.4); // 16 * 1.4
        });
        test('should calculate line height with custom ratio', () => {
            const lineHeight = TypographyUtils.calculateLineHeight(20, 1.2);
            expect(lineHeight).toBe(24); // 20 * 1.2
        });
    });
    describe('isValidLetterSpacing', () => {
        test('should validate normal letter spacing', () => {
            expect(TypographyUtils.isValidLetterSpacing(0)).toBe(true);
            expect(TypographyUtils.isValidLetterSpacing(-2)).toBe(true);
            expect(TypographyUtils.isValidLetterSpacing(5)).toBe(true);
        });
        test('should reject extreme letter spacing', () => {
            expect(TypographyUtils.isValidLetterSpacing(-15)).toBe(false);
            expect(TypographyUtils.isValidLetterSpacing(25)).toBe(false);
        });
    });
});
describe('💬 Real Code Tests - MessageUtils', () => {
    describe('createThumbnailMessage', () => {
        test('should create valid thumbnail message', () => {
            const data = {
                title: 'Test',
                description: 'Test Desc',
                emoji: '🚀',
                theme: 'light',
                customImage: null
            };
            const message = MessageUtils.createThumbnailMessage(data);
            expect(message.type).toBe('create-thumbnail');
            expect(message.data).toEqual(data);
        });
    });
    describe('createCancelMessage', () => {
        test('should create valid cancel message', () => {
            const message = MessageUtils.createCancelMessage();
            expect(message.type).toBe('cancel');
            expect(Object.keys(message)).toHaveLength(1);
        });
    });
    describe('isValidMessage', () => {
        test('should validate correct messages', () => {
            const validMessages = [
                { type: 'create-thumbnail', data: {} },
                { type: 'cancel' }
            ];
            validMessages.forEach(msg => {
                expect(MessageUtils.isValidMessage(msg)).toBe(true);
            });
        });
        test('should reject invalid messages', () => {
            const invalidMessages = [
                null,
                undefined,
                {},
                { type: 'invalid' },
                { notType: 'cancel' }
            ];
            invalidMessages.forEach(msg => {
                expect(MessageUtils.isValidMessage(msg)).toBe(false);
            });
        });
    });
});
describe('⚙️ Real Code Tests - Configuration Constants', () => {
    describe('THEMES', () => {
        test('should have valid theme colors', () => {
            expect(THEMES.light).toBeDefined();
            expect(THEMES.dark).toBeDefined();
            expect(ColorUtils.isValidRGB(THEMES.light.background)).toBe(true);
            expect(ColorUtils.isValidRGB(THEMES.light.text)).toBe(true);
            expect(ColorUtils.isValidRGB(THEMES.dark.background)).toBe(true);
            expect(ColorUtils.isValidRGB(THEMES.dark.text)).toBe(true);
        });
        test('should have sufficient contrast', () => {
            const lightContrast = ColorUtils.getContrastRatio(THEMES.light.background, THEMES.light.text);
            const darkContrast = ColorUtils.getContrastRatio(THEMES.dark.background, THEMES.dark.text);
            expect(lightContrast).toBeGreaterThan(4.5);
            expect(darkContrast).toBeGreaterThan(4.5);
        });
    });
    describe('FRAME_CONFIG', () => {
        test('should have valid dimensions', () => {
            expect(FRAME_CONFIG.width).toBe(1920);
            expect(FRAME_CONFIG.height).toBe(960);
            const aspectRatio = LayoutUtils.validateAspectRatio(FRAME_CONFIG.width, FRAME_CONFIG.height);
            expect(aspectRatio).toBe(2); // 16:9
        });
        test('should have reasonable padding', () => {
            const contentArea = LayoutUtils.calculateContentArea({ width: FRAME_CONFIG.width, height: FRAME_CONFIG.height }, FRAME_CONFIG.padding);
            expect(contentArea.width).toBeGreaterThan(0);
            expect(contentArea.height).toBeGreaterThan(0);
        });
    });
    describe('TYPOGRAPHY', () => {
        test('should have valid font size hierarchy', () => {
            const isValid = TypographyUtils.validateFontSizeHierarchy({
                large: TYPOGRAPHY.emoji.fontSize,
                medium: TYPOGRAPHY.title.fontSize,
                small: TYPOGRAPHY.description.fontSize
            });
            expect(isValid).toBe(true);
        });
        test('should have valid letter spacing', () => {
            expect(TypographyUtils.isValidLetterSpacing(TYPOGRAPHY.title.letterSpacing)).toBe(true);
            expect(TypographyUtils.isValidLetterSpacing(TYPOGRAPHY.description.letterSpacing)).toBe(true);
        });
    });
    describe('FONT_CONFIG', () => {
        test('should have valid font chains', () => {
            Object.values(FONT_CONFIG).forEach(chain => {
                expect(chain.length).toBeGreaterThanOrEqual(2);
                chain.forEach(font => {
                    expect(typeof font.family).toBe('string');
                    expect(typeof font.style).toBe('string');
                    expect(font.family.length).toBeGreaterThan(0);
                });
            });
        });
        test('should have Inter as fallback in all chains', () => {
            Object.values(FONT_CONFIG).forEach(chain => {
                const hasInter = chain.some(font => font.family === 'Inter');
                expect(hasInter).toBe(true);
            });
        });
    });
});
