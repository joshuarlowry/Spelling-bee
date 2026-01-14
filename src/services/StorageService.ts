/**
 * Storage Service
 *
 * Handles saving and loading game progress from localStorage.
 *
 * IMPLEMENTATION TASKS:
 * 1. Import types from '../types/state'
 * 2. Define constants: STORAGE_KEY = 'spellingBee_saveState', STORAGE_VERSION = 1
 * 3. Implement getDefaultProgress() - returns a fresh SavedProgress object
 * 4. Implement getProgress() - loads from localStorage, handles errors
 * 5. Implement saveProgress() - saves to localStorage, updates lastPlayed
 * 6. Implement updateLevelProgress() - updates a specific level's progress
 * 7. Implement updateSettings() - updates user settings
 * 8. Implement clearProgress() - removes save data
 * 9. Implement migrateProgress() - handles version migrations
 * 10. Add try/catch blocks for localStorage errors
 */

import { SavedProgress, LevelProgress, UserSettings } from '../types/state';

const STORAGE_KEY = 'spellingBee_saveState';
const STORAGE_VERSION = 1;

export class StorageService {
  constructor() {
    // Constructor is empty for now
  }

  /**
   * TODO: Implement getDefaultProgress()
   *
   * Returns a fresh SavedProgress object with default values.
   *
   * Steps:
   * 1. Create a SavedProgress object
   * 2. Set version to STORAGE_VERSION
   * 3. Set lastPlayed to current ISO timestamp
   * 4. Initialize empty themes object
   * 5. Set default settings (soundEnabled: true, speechEnabled: true, speechRate: 0.85)
   * 6. Return the object
   */
  private getDefaultProgress(): SavedProgress {
    return {
      version: STORAGE_VERSION,
      lastPlayed: new Date().toISOString(),
      themes: {},
      settings: {
        soundEnabled: true,
        speechEnabled: true,
        speechRate: 0.85,
      },
    };
  }

  /**
   * TODO: Implement getProgress()
   *
   * Loads saved progress from localStorage.
   *
   * Steps:
   * 1. Wrap in try/catch
   * 2. Call localStorage.getItem(STORAGE_KEY)
   * 3. If null, return null
   * 4. Parse JSON string
   * 5. Check version number
   * 6. If version mismatch, call migrateProgress()
   * 7. Return parsed data
   * 8. On error, log to console and return null
   */
  getProgress(): SavedProgress | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return null;
      }

      const data: SavedProgress = JSON.parse(saved);

      if (data.version !== STORAGE_VERSION) {
        return this.migrateProgress(data);
      }

      return data;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }

  /**
   * TODO: Implement saveProgress()
   *
   * Saves progress to localStorage.
   *
   * Steps:
   * 1. Wrap in try/catch
   * 2. Update progress.lastPlayed to new Date().toISOString()
   * 3. Convert progress to JSON string
   * 4. Call localStorage.setItem(STORAGE_KEY, jsonString)
   * 5. On error, log to console
   */
  saveProgress(progress: SavedProgress): void {
    try {
      progress.lastPlayed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * TODO: Implement updateLevelProgress()
   *
   * Updates progress for a specific level.
   *
   * Steps:
   * 1. Get current progress (or create default)
   * 2. Check if theme exists in progress, create if not
   * 3. Check if level exists in theme, create if not
   * 4. Merge update object into existing level data
   * 5. Recalculate theme total score (sum all level scores)
   * 6. Call saveProgress()
   */
  updateLevelProgress(themeId: string, level: number, update: Partial<LevelProgress>): void {
    const progress = this.getProgress() || this.getDefaultProgress();

    if (!progress.themes[themeId]) {
      progress.themes[themeId] = {
        currentLevel: level,
        totalScore: 0,
        levels: {},
      };
    }

    if (!progress.themes[themeId].levels[level]) {
      progress.themes[themeId].levels[level] = {
        completed: false,
        score: 0,
        stars: 0,
        wordsHelped: [],
      };
    }

    progress.themes[themeId].levels[level] = {
      ...progress.themes[themeId].levels[level],
      ...update,
    };

    progress.themes[themeId].totalScore = Object.values(progress.themes[themeId].levels).reduce(
      (sum, lp) => sum + lp.score,
      0
    );

    this.saveProgress(progress);
  }

  /**
   * TODO: Implement updateSettings()
   *
   * Updates user settings.
   *
   * Steps:
   * 1. Get current progress (or create default)
   * 2. Merge settings update into progress.settings
   * 3. Call saveProgress()
   */
  updateSettings(settings: Partial<UserSettings>): void {
    const progress = this.getProgress() || this.getDefaultProgress();
    progress.settings = { ...progress.settings, ...settings };
    this.saveProgress(progress);
  }

  /**
   * TODO: Implement clearProgress()
   *
   * Removes all saved progress.
   *
   * Steps:
   * 1. Call localStorage.removeItem(STORAGE_KEY)
   */
  clearProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * TODO: Implement migrateProgress()
   *
   * Handles version migrations for saved data.
   *
   * Steps:
   * 1. For now, just merge old data with default data
   * 2. Update version to STORAGE_VERSION
   * 3. Return migrated data
   * 4. In future, add version-specific migration logic
   */
  private migrateProgress(old: any): SavedProgress {
    const defaults = this.getDefaultProgress();
    const migrated: SavedProgress = {
      ...defaults,
      ...old,
      version: STORAGE_VERSION,
    };
    return migrated;
  }
}

// Export singleton instance
export const storageService = new StorageService();
