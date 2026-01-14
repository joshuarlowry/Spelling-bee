/**
 * Word Loader Service
 *
 * Loads word lists from JSON files (compiled from YAML).
 *
 * IMPLEMENTATION TASKS:
 * 1. Import WordList, Theme from types
 * 2. Implement loadTheme() - fetches JSON file for a theme
 * 3. Implement getThemeList() - returns list of available themes
 * 4. Add caching to avoid redundant fetches
 * 5. Add error handling for network failures
 */

import { WordList } from '../types/data';

export class WordLoaderService {
  private cache: Map<string, WordList> = new Map();

  constructor() {
    // Constructor is empty for now
  }

  /**
   * TODO: Implement loadTheme()
   *
   * Loads a theme's word list from JSON.
   *
   * Steps:
   * 1. Check if theme is in cache, return cached if found
   * 2. Fetch JSON from `/words/${themeId}.json`
   * 3. Parse JSON response
   * 4. Validate structure (check that theme and levels exist)
   * 5. Store in cache
   * 6. Return WordList
   * 7. On error, throw descriptive error message
   */
  async loadTheme(themeId: string): Promise<WordList> {
    if (this.cache.has(themeId)) {
      return this.cache.get(themeId)!;
    }

    try {
      const response = await fetch(`/words/${themeId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }

      const data: WordList = await response.json();

      if (!data.theme || !Array.isArray(data.levels)) {
        throw new Error(`Invalid word list structure for theme: ${themeId}`);
      }

      this.cache.set(themeId, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load theme "${themeId}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * TODO: Implement getThemeList()
   *
   * Returns list of available themes.
   *
   * Steps:
   * 1. For now, return hardcoded array of theme IDs: ['fantasy', 'scifi']
   * 2. Future enhancement: fetch from themes.json
   */
  getThemeList(): string[] {
    return ['fantasy', 'scifi'];
  }

  /**
   * TODO: Implement clearCache()
   *
   * Clears the cached word lists.
   *
   * Steps:
   * 1. Call this.cache.clear()
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const wordLoaderService = new WordLoaderService();
