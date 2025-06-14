/**
 * Jest setup file for Thumbly plugin tests
 * Provides test utilities for the Thumbly plugin
 */
// Helper function to create mock thumbnail data
export const createMockThumbnailData = (overrides = {}) => ({
    title: 'Test Title',
    description: 'Test Description',
    emoji: '🚀',
    theme: 'light',
    customImage: null,
    ...overrides
});
// Helper function to create mock font style
export const createMockFontStyle = (overrides = {}) => ({
    family: 'Inter',
    style: 'Regular',
    ...overrides
});
// Helper function to create mock RGB color
export const createMockRGB = (overrides = {}) => ({
    r: 1,
    g: 1,
    b: 1,
    ...overrides
});
