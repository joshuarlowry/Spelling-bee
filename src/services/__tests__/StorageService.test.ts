import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from '../StorageService';
import { SavedProgress } from '../../types/state';

describe('StorageService', () => {
  let service: StorageService;
  const STORAGE_KEY = 'spellingBee_saveState';

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getDefaultProgress', () => {
    it('should return a default progress object with correct structure', () => {
      const defaultProgress = (service as any).getDefaultProgress();

      expect(defaultProgress.version).toBe(1);
      expect(defaultProgress.lastPlayed).toBeDefined();
      expect(defaultProgress.themes).toEqual({});
      expect(defaultProgress.settings.soundEnabled).toBe(true);
      expect(defaultProgress.settings.speechEnabled).toBe(true);
      expect(defaultProgress.settings.speechRate).toBe(0.85);
    });
  });

  describe('getProgress', () => {
    it('should return null when no progress is saved', () => {
      const progress = service.getProgress();
      expect(progress).toBeNull();
    });

    it('should load saved progress from localStorage', () => {
      const testProgress: SavedProgress = {
        version: 1,
        lastPlayed: '2024-01-14T00:00:00Z',
        themes: { fantasy: { currentLevel: 2, totalScore: 50, levels: {} } },
        settings: { soundEnabled: true, speechEnabled: true, speechRate: 0.85 },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(testProgress));
      const loaded = service.getProgress();

      expect(loaded).toEqual(testProgress);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json {[}');
      const progress = service.getProgress();
      expect(progress).toBeNull();
    });
  });

  describe('saveProgress', () => {
    it('should save progress to localStorage', () => {
      const progress: SavedProgress = {
        version: 1,
        lastPlayed: '2024-01-14T00:00:00Z',
        themes: {},
        settings: { soundEnabled: true, speechEnabled: true, speechRate: 0.85 },
      };

      service.saveProgress(progress);
      const saved = localStorage.getItem(STORAGE_KEY);

      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.version).toBe(1);
      expect(parsed.themes).toEqual({});
    });

    it('should update lastPlayed timestamp', () => {
      const progress: SavedProgress = {
        version: 1,
        lastPlayed: '2024-01-01T00:00:00Z',
        themes: {},
        settings: { soundEnabled: true, speechEnabled: true, speechRate: 0.85 },
      };

      const before = new Date().getTime();
      service.saveProgress(progress);
      const after = new Date().getTime();

      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      const savedTime = new Date(parsed.lastPlayed).getTime();
      expect(savedTime).toBeGreaterThanOrEqual(before);
      expect(savedTime).toBeLessThanOrEqual(after);
    });
  });

  describe('updateLevelProgress', () => {
    it('should create theme if it does not exist', () => {
      service.updateLevelProgress('fantasy', 1, { score: 100 });

      const progress = service.getProgress();
      expect(progress?.themes['fantasy']).toBeDefined();
      expect(progress?.themes['fantasy']?.currentLevel).toBe(1);
    });

    it('should create level if it does not exist', () => {
      service.updateLevelProgress('fantasy', 1, { score: 100, stars: 3 });

      const progress = service.getProgress();
      expect(progress?.themes['fantasy']?.levels[1]).toBeDefined();
      expect(progress?.themes['fantasy']?.levels[1]?.score).toBe(100);
      expect(progress?.themes['fantasy']?.levels[1]?.stars).toBe(3);
    });

    it('should update existing level progress', () => {
      service.updateLevelProgress('fantasy', 1, { score: 50, stars: 1 });
      service.updateLevelProgress('fantasy', 1, { score: 100, stars: 3 });

      const progress = service.getProgress();
      expect(progress?.themes['fantasy']?.levels[1]?.score).toBe(100);
      expect(progress?.themes['fantasy']?.levels[1]?.stars).toBe(3);
    });

    it('should recalculate total score for theme', () => {
      service.updateLevelProgress('fantasy', 1, { score: 100 });
      service.updateLevelProgress('fantasy', 2, { score: 150 });

      const progress = service.getProgress();
      expect(progress?.themes['fantasy']?.totalScore).toBe(250);
    });
  });

  describe('updateSettings', () => {
    it('should update individual settings', () => {
      service.updateSettings({ soundEnabled: false });

      const progress = service.getProgress();
      expect(progress?.settings.soundEnabled).toBe(false);
      expect(progress?.settings.speechEnabled).toBe(true); // unchanged
    });

    it('should merge settings correctly', () => {
      service.updateSettings({ soundEnabled: false, speechRate: 1.0 });

      const progress = service.getProgress();
      expect(progress?.settings.soundEnabled).toBe(false);
      expect(progress?.settings.speechRate).toBe(1.0);
      expect(progress?.settings.speechEnabled).toBe(true); // unchanged
    });
  });

  describe('clearProgress', () => {
    it('should remove progress from localStorage', () => {
      const progress: SavedProgress = {
        version: 1,
        lastPlayed: '2024-01-14T00:00:00Z',
        themes: {},
        settings: { soundEnabled: true, speechEnabled: true, speechRate: 0.85 },
      };

      service.saveProgress(progress);
      expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();

      service.clearProgress();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
