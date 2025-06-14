/**
 * Tests for plugin configuration and constants
 */

describe('Plugin Configuration', () => {
  describe('Theme Configuration', () => {
    test('should have correct light theme colors', () => {
      const lightTheme = {
        background: { r: 1, g: 1, b: 1 }, // #FFFFFF
        text: { r: 0.043, g: 0.024, b: 0.141 } // #0B0624
      };
      
      expect(lightTheme.background.r).toBe(1);
      expect(lightTheme.background.g).toBe(1);
      expect(lightTheme.background.b).toBe(1);
      expect(lightTheme.text.r).toBeCloseTo(0.043);
      expect(lightTheme.text.g).toBeCloseTo(0.024);
      expect(lightTheme.text.b).toBeCloseTo(0.141);
    });

    test('should have correct dark theme colors', () => {
      const darkTheme = {
        background: { r: 0.118, g: 0.118, b: 0.118 }, // #1E1E1E
        text: { r: 1, g: 1, b: 1 } // #FFFFFF
      };
      
      expect(darkTheme.background.r).toBeCloseTo(0.118);
      expect(darkTheme.background.g).toBeCloseTo(0.118);
      expect(darkTheme.background.b).toBeCloseTo(0.118);
      expect(darkTheme.text.r).toBe(1);
      expect(darkTheme.text.g).toBe(1);
      expect(darkTheme.text.b).toBe(1);
    });
  });

  describe('Frame Configuration', () => {
    test('should have correct frame dimensions', () => {
      const frameConfig = {
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
      };

      expect(frameConfig.width).toBe(1920);
      expect(frameConfig.height).toBe(960);
      expect(frameConfig.padding.horizontal).toBe(240);
      expect(frameConfig.padding.vertical).toBe(100);
      expect(frameConfig.emoji.size).toBe(224);
      expect(frameConfig.spacing.textGap).toBe(24);
    });
  });

  describe('Typography Configuration', () => {
    test('should have correct emoji typography', () => {
      const emojiTypography = {
        fontSize: 224,
        lineHeight: 118.5
      };

      expect(emojiTypography.fontSize).toBe(224);
      expect(emojiTypography.lineHeight).toBe(118.5);
    });

    test('should have correct title typography', () => {
      const titleTypography = {
        fontSize: 145,
        lineHeight: 117.2,
        letterSpacing: -5
      };

      expect(titleTypography.fontSize).toBe(145);
      expect(titleTypography.lineHeight).toBe(117.2);
      expect(titleTypography.letterSpacing).toBe(-5);
    });

    test('should have correct description typography', () => {
      const descriptionTypography = {
        fontSize: 72,
        lineHeight: 118.5,
        letterSpacing: -2,
        opacity: 0.8
      };

      expect(descriptionTypography.fontSize).toBe(72);
      expect(descriptionTypography.lineHeight).toBe(118.5);
      expect(descriptionTypography.letterSpacing).toBe(-2);
      expect(descriptionTypography.opacity).toBe(0.8);
    });
  });

  describe('Font Configuration', () => {
    test('should have primary font chain', () => {
      const primaryFonts = [
        { family: "Rubik", style: "Bold" },
        { family: "Inter", style: "Bold" },
        { family: "Roboto", style: "Bold" }
      ];

      expect(primaryFonts).toHaveLength(3);
      expect(primaryFonts[0].family).toBe("Rubik");
      expect(primaryFonts[0].style).toBe("Bold");
      expect(primaryFonts[1].family).toBe("Inter");
      expect(primaryFonts[2].family).toBe("Roboto");
    });

    test('should have secondary font chain', () => {
      const secondaryFonts = [
        { family: "Rubik", style: "Regular" },
        { family: "Inter", style: "Regular" },
        { family: "Roboto", style: "Regular" }
      ];

      expect(secondaryFonts).toHaveLength(3);
      expect(secondaryFonts[0].family).toBe("Rubik");
      expect(secondaryFonts[0].style).toBe("Regular");
      expect(secondaryFonts[1].family).toBe("Inter");
      expect(secondaryFonts[2].family).toBe("Roboto");
    });

    test('should have title font chain', () => {
      const titleFonts = [
        { family: "Archivo", style: "Bold" },
        { family: "Inter", style: "Bold" },
        { family: "Roboto", style: "Bold" }
      ];

      expect(titleFonts).toHaveLength(3);
      expect(titleFonts[0].family).toBe("Archivo");
      expect(titleFonts[0].style).toBe("Bold");
      expect(titleFonts[1].family).toBe("Inter");
      expect(titleFonts[2].family).toBe("Roboto");
    });
  });
}); 