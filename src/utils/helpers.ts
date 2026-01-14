/**
 * Helper Functions
 *
 * Utility functions used throughout the app.
 *
 * TODO: Implement the following:
 * 1. calculatePoints() - calculates points for a word
 * 2. getLevelMultiplier() - gets score multiplier for level
 * 3. calculateStars() - calculates star rating for level completion
 */

/**
 * Calculates points earned for a word.
 *
 * Steps:
 * 1. Base points = 10
 * 2. Get level multiplier: getLevelMultiplier(level)
 * 3. If help was used:
 *    - Count letters typed before help
 *    - Partial points = (lettersTyped / totalLetters) * basePoints
 * 4. Apply multiplier
 * 5. Return rounded points
 *
 * Example:
 * - Level 1, no help: 10 * 1.0 = 10 points
 * - Level 2, no help: 10 * 1.5 = 15 points
 * - Level 1, help after 2/5 letters: (2/5) * 10 * 1.0 = 4 points
 */
export function calculatePoints(
  level: number,
  wordLength: number,
  lettersTypedBeforeHelp: number,
  helpUsed: boolean
): number {
  const basePoints = 10;
  const multiplier = getLevelMultiplier(level);

  let earnedPoints = basePoints;
  if (helpUsed) {
    const percentage = lettersTypedBeforeHelp / wordLength;
    earnedPoints = basePoints * percentage;
  }

  return Math.round(earnedPoints * multiplier);
}

/**
 * Returns score multiplier for a level.
 *
 * Steps:
 * 1. Level 1: 1.0x
 * 2. Level 2: 1.5x
 * 3. Level 3: 2.0x
 * 4. Level 4+: 2.0x + (level - 3) * 0.5x
 *
 * Example:
 * - Level 1: 1.0
 * - Level 2: 1.5
 * - Level 3: 2.0
 * - Level 4: 2.5
 * - Level 5: 3.0
 */
export function getLevelMultiplier(level: number): number {
  if (level === 1) return 1.0;
  if (level === 2) return 1.5;
  if (level === 3) return 2.0;
  return 2.0 + (level - 3) * 0.5;
}

/**
 * Calculates star rating (0-3) for level completion.
 *
 * Steps:
 * 1. Get max possible score for level
 * 2. Calculate percentage: (earnedScore / maxScore) * 100
 * 3. Return stars:
 *    - 3 stars: 90%+ (nearly perfect)
 *    - 2 stars: 70%+ (good)
 *    - 1 star: 50%+ (completed)
 *    - 0 stars: <50% (incomplete)
 */
export function calculateStars(earnedScore: number, maxScore: number): 0 | 1 | 2 | 3 {
  if (maxScore === 0) return 0;

  const percentage = (earnedScore / maxScore) * 100;

  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
}

/**
 * Promise-based delay utility.
 *
 * Steps:
 * 1. Return new Promise
 * 2. Resolve after ms milliseconds using setTimeout
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
