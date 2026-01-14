import { describe, it, expect } from 'vitest';
import { calculatePoints, getLevelMultiplier, calculateStars, delay } from '../helpers';

describe('calculatePoints', () => {
  it('should calculate points without help', () => {
    const points = calculatePoints(1, 5, 0, false);
    expect(points).toBe(10); // 10 * 1.0 = 10
  });

  it('should apply level multiplier', () => {
    const level1 = calculatePoints(1, 5, 0, false);
    const level2 = calculatePoints(2, 5, 0, false);
    const level3 = calculatePoints(3, 5, 0, false);

    expect(level1).toBe(10); // 10 * 1.0
    expect(level2).toBe(15); // 10 * 1.5
    expect(level3).toBe(20); // 10 * 2.0
  });

  it('should reduce points when help is used', () => {
    const noHelp = calculatePoints(1, 5, 0, false);
    const withHelp = calculatePoints(1, 5, 2, true);

    expect(noHelp).toBe(10);
    expect(withHelp).toBe(4); // (2/5) * 10 = 4
  });

  it('should combine help penalty with level multiplier', () => {
    const points = calculatePoints(2, 5, 3, true);
    // (3/5) * 10 = 6, then 6 * 1.5 = 9
    expect(points).toBe(9);
  });

  it('should handle zero letters typed', () => {
    const points = calculatePoints(1, 5, 0, true);
    expect(points).toBe(0);
  });
});

describe('getLevelMultiplier', () => {
  it('should return 1.0 for level 1', () => {
    expect(getLevelMultiplier(1)).toBe(1.0);
  });

  it('should return 1.5 for level 2', () => {
    expect(getLevelMultiplier(2)).toBe(1.5);
  });

  it('should return 2.0 for level 3', () => {
    expect(getLevelMultiplier(3)).toBe(2.0);
  });

  it('should scale for levels 4+', () => {
    expect(getLevelMultiplier(4)).toBe(2.5); // 2.0 + (4-3)*0.5
    expect(getLevelMultiplier(5)).toBe(3.0); // 2.0 + (5-3)*0.5
    expect(getLevelMultiplier(10)).toBe(5.5); // 2.0 + (10-3)*0.5
  });
});

describe('calculateStars', () => {
  it('should return 3 stars for 90%+ performance', () => {
    expect(calculateStars(90, 100)).toBe(3);
    expect(calculateStars(100, 100)).toBe(3);
    expect(calculateStars(95, 100)).toBe(3);
  });

  it('should return 2 stars for 70-89% performance', () => {
    expect(calculateStars(70, 100)).toBe(2);
    expect(calculateStars(85, 100)).toBe(2);
    expect(calculateStars(89, 100)).toBe(2);
  });

  it('should return 1 star for 50-69% performance', () => {
    expect(calculateStars(50, 100)).toBe(1);
    expect(calculateStars(60, 100)).toBe(1);
    expect(calculateStars(69, 100)).toBe(1);
  });

  it('should return 0 stars for <50% performance', () => {
    expect(calculateStars(0, 100)).toBe(0);
    expect(calculateStars(25, 100)).toBe(0);
    expect(calculateStars(49, 100)).toBe(0);
  });

  it('should handle zero max score', () => {
    expect(calculateStars(0, 0)).toBe(0);
  });

  it('should calculate correctly with fractional scores', () => {
    expect(calculateStars(180, 200)).toBe(3); // 90%
    expect(calculateStars(140, 200)).toBe(2); // 70%
    expect(calculateStars(100, 200)).toBe(1); // 50%
  });
});

describe('delay', () => {
  it('should resolve after specified milliseconds', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
  });

  it('should return a promise', () => {
    const result = delay(10);
    expect(result instanceof Promise).toBe(true);
  });

  it('should resolve with undefined', async () => {
    const result = await delay(10);
    expect(result).toBeUndefined();
  });
});
