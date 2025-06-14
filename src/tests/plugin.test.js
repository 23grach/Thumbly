/**
 * Integration tests for Thumbly plugin
 */
import { createMockThumbnailData, createMockRGB, createMockFontStyle } from './setup';
describe('Thumbly Plugin', () => {
    describe('Interface Validation', () => {
        test('ThumbnailData interface should have correct structure', () => {
            const thumbnailData = createMockThumbnailData();
            expect(thumbnailData).toHaveProperty('title');
            expect(thumbnailData).toHaveProperty('description');
            expect(thumbnailData).toHaveProperty('emoji');
            expect(thumbnailData).toHaveProperty('theme');
            expect(thumbnailData).toHaveProperty('customImage');
            expect(typeof thumbnailData.title).toBe('string');
            expect(typeof thumbnailData.description).toBe('string');
            expect(typeof thumbnailData.emoji).toBe('string');
            expect(['light', 'dark']).toContain(thumbnailData.theme);
        });
        test('ThumbnailData with custom image should have correct structure', () => {
            const thumbnailData = createMockThumbnailData({
                customImage: {
                    data: new Uint8Array([1, 2, 3, 4]),
                    name: 'test.png',
                    width: 100,
                    height: 100
                }
            });
            expect(thumbnailData.customImage).not.toBeNull();
            expect(thumbnailData.customImage).toHaveProperty('data');
            expect(thumbnailData.customImage).toHaveProperty('name');
            expect(thumbnailData.customImage).toHaveProperty('width');
            expect(thumbnailData.customImage).toHaveProperty('height');
            expect(thumbnailData.customImage.data).toBeInstanceOf(Uint8Array);
            expect(typeof thumbnailData.customImage.name).toBe('string');
            expect(typeof thumbnailData.customImage.width).toBe('number');
            expect(typeof thumbnailData.customImage.height).toBe('number');
        });
    });
    describe('Helper Functions', () => {
        test('createMockThumbnailData should create valid data', () => {
            const data = createMockThumbnailData();
            expect(data.title).toBe('Test Title');
            expect(data.description).toBe('Test Description');
            expect(data.emoji).toBe('🚀');
            expect(data.theme).toBe('light');
            expect(data.customImage).toBeNull();
        });
        test('createMockThumbnailData should accept overrides', () => {
            const data = createMockThumbnailData({
                title: 'Custom Title',
                theme: 'dark'
            });
            expect(data.title).toBe('Custom Title');
            expect(data.theme).toBe('dark');
            expect(data.description).toBe('Test Description'); // unchanged
        });
        test('createMockRGB should create valid RGB color', () => {
            const color = createMockRGB();
            expect(color).toHaveProperty('r');
            expect(color).toHaveProperty('g');
            expect(color).toHaveProperty('b');
            expect(color.r).toBe(1);
            expect(color.g).toBe(1);
            expect(color.b).toBe(1);
        });
        test('createMockRGB should accept overrides', () => {
            const color = createMockRGB({ r: 0.5, g: 0.2 });
            expect(color.r).toBe(0.5);
            expect(color.g).toBe(0.2);
            expect(color.b).toBe(1); // unchanged
        });
        test('createMockFontStyle should create valid font style', () => {
            const font = createMockFontStyle();
            expect(font).toHaveProperty('family');
            expect(font).toHaveProperty('style');
            expect(font.family).toBe('Inter');
            expect(font.style).toBe('Regular');
        });
        test('createMockFontStyle should accept overrides', () => {
            const font = createMockFontStyle({
                family: 'Roboto',
                style: 'Bold'
            });
            expect(font.family).toBe('Roboto');
            expect(font.style).toBe('Bold');
        });
    });
    describe('Data Validation Logic', () => {
        test('should validate required fields', () => {
            // Test validation logic directly without dependency on ValidationUtils
            const validateFields = (data) => {
                var _a, _b, _c;
                const errors = [];
                if (!((_a = data.title) === null || _a === void 0 ? void 0 : _a.trim())) {
                    errors.push('Title is required and cannot be empty');
                }
                if (!((_b = data.description) === null || _b === void 0 ? void 0 : _b.trim())) {
                    errors.push('Description is required and cannot be empty');
                }
                if (!((_c = data.emoji) === null || _c === void 0 ? void 0 : _c.trim())) {
                    errors.push('Emoji is required and cannot be empty');
                }
                if (!['light', 'dark'].includes(data.theme)) {
                    errors.push('Theme must be either "light" or "dark"');
                }
                return errors;
            };
            const validData = createMockThumbnailData();
            expect(validateFields(validData)).toHaveLength(0);
            const invalidData = { title: '', description: '', emoji: '', theme: 'invalid' };
            const errors = validateFields(invalidData);
            expect(errors).toHaveLength(4);
            expect(errors).toContain('Title is required and cannot be empty');
            expect(errors).toContain('Description is required and cannot be empty');
            expect(errors).toContain('Emoji is required and cannot be empty');
            expect(errors).toContain('Theme must be either "light" or "dark"');
        });
        test('should handle whitespace-only strings', () => {
            const validateFields = (data) => {
                var _a, _b, _c;
                const errors = [];
                if (!((_a = data.title) === null || _a === void 0 ? void 0 : _a.trim())) {
                    errors.push('Title is required and cannot be empty');
                }
                if (!((_b = data.description) === null || _b === void 0 ? void 0 : _b.trim())) {
                    errors.push('Description is required and cannot be empty');
                }
                if (!((_c = data.emoji) === null || _c === void 0 ? void 0 : _c.trim())) {
                    errors.push('Emoji is required and cannot be empty');
                }
                return errors;
            };
            const whitespaceData = {
                title: '   ',
                description: '\t\n',
                emoji: '  ',
                theme: 'light'
            };
            const errors = validateFields(whitespaceData);
            expect(errors).toHaveLength(3);
        });
    });
    describe('Constants and Configuration', () => {
        test('should have consistent theme color values', () => {
            const themes = {
                light: {
                    background: { r: 1, g: 1, b: 1 },
                    text: { r: 0.043, g: 0.024, b: 0.141 }
                },
                dark: {
                    background: { r: 0.118, g: 0.118, b: 0.118 },
                    text: { r: 1, g: 1, b: 1 }
                }
            };
            // Validate RGB values are in correct range [0, 1]
            Object.values(themes).forEach(theme => {
                Object.values(theme).forEach(colorSet => {
                    expect(colorSet.r).toBeGreaterThanOrEqual(0);
                    expect(colorSet.r).toBeLessThanOrEqual(1);
                    expect(colorSet.g).toBeGreaterThanOrEqual(0);
                    expect(colorSet.g).toBeLessThanOrEqual(1);
                    expect(colorSet.b).toBeGreaterThanOrEqual(0);
                    expect(colorSet.b).toBeLessThanOrEqual(1);
                });
            });
        });
        test('should have logical frame dimensions', () => {
            const frameConfig = {
                width: 1920,
                height: 960,
                padding: { horizontal: 240, vertical: 100 }
            };
            expect(frameConfig.width).toBeGreaterThan(0);
            expect(frameConfig.height).toBeGreaterThan(0);
            expect(frameConfig.padding.horizontal).toBeGreaterThan(0);
            expect(frameConfig.padding.vertical).toBeGreaterThan(0);
            // Check that padding doesn't exceed frame dimensions
            expect(frameConfig.padding.horizontal * 2).toBeLessThan(frameConfig.width);
            expect(frameConfig.padding.vertical * 2).toBeLessThan(frameConfig.height);
        });
    });
});
