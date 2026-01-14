import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../GameStateManager';
import { Word } from '../../types/state';

describe('GameStateManager', () => {
  let manager: GameStateManager;

  beforeEach(() => {
    localStorage.clear();
    manager = new GameStateManager();
  });

  describe('getState', () => {
    it('should return immutable state', () => {
      const state = manager.getState();
      expect(() => {
        (state as any).currentTheme = 'scifi';
      }).toThrow();
    });

    it('should return state with correct initial values', () => {
      const state = manager.getState();
      expect(state.currentTheme).toBeNull();
      expect(state.currentLevel).toBe(1);
      expect(state.currentWordIndex).toBe(0);
      expect(state.sessionScore).toBe(0);
      expect(state.currentWord).toBeNull();
      expect(state.revealedLetters).toEqual([]);
      expect(state.helpUsed).toBe(false);
      expect(state.reshuffleQueue).toEqual([]);
      expect(state.inReshuffleMode).toBe(false);
    });
  });

  describe('setState', () => {
    it('should update state and notify listeners', () => {
      let notified = false;
      manager.subscribe(() => {
        notified = true;
      });

      manager.setState({ currentLevel: 2 });

      expect(notified).toBe(true);
      expect(manager.getState().currentLevel).toBe(2);
    });

    it('should merge partial updates', () => {
      manager.setState({ currentLevel: 2 });
      manager.setState({ sessionScore: 100 });

      const state = manager.getState();
      expect(state.currentLevel).toBe(2);
      expect(state.sessionScore).toBe(100);
    });
  });

  describe('subscribe', () => {
    it('should notify listener on state change', () => {
      let callCount = 0;
      manager.subscribe(() => {
        callCount++;
      });

      manager.setState({ sessionScore: 50 });
      manager.setState({ currentLevel: 2 });

      expect(callCount).toBe(2);
    });

    it('should return unsubscribe function', () => {
      let callCount = 0;
      const unsubscribe = manager.subscribe(() => {
        callCount++;
      });

      manager.setState({ sessionScore: 50 });
      expect(callCount).toBe(1);

      unsubscribe();
      manager.setState({ sessionScore: 100 });
      expect(callCount).toBe(1); // no change
    });

    it('should allow multiple listeners', () => {
      let count1 = 0;
      let count2 = 0;

      manager.subscribe(() => {
        count1++;
      });
      manager.subscribe(() => {
        count2++;
      });

      manager.setState({ sessionScore: 50 });

      expect(count1).toBe(1);
      expect(count2).toBe(1);
    });
  });

  describe('startGame', () => {
    it('should initialize game state for a theme and level', () => {
      manager.startGame('fantasy', 2);

      const state = manager.getState();
      expect(state.currentTheme).toBe('fantasy');
      expect(state.currentLevel).toBe(2);
      expect(state.currentWordIndex).toBe(0);
      expect(state.sessionScore).toBe(0);
      expect(state.reshuffleQueue).toEqual([]);
      expect(state.inReshuffleMode).toBe(false);
    });
  });

  describe('setCurrentWord', () => {
    it('should set current word and create revealed letters array', () => {
      const word: Word = { word: 'hello', sentence: 'Hello world' };
      manager.setCurrentWord(word);

      const state = manager.getState();
      expect(state.currentWord).toEqual(word);
      expect(state.revealedLetters).toHaveLength(5);
      expect(state.revealedLetters).toEqual([false, false, false, false, false]);
      expect(state.helpUsed).toBe(false);
    });
  });

  describe('markLetterRevealed', () => {
    it('should mark a letter as revealed', () => {
      const word: Word = { word: 'hello', sentence: 'Hello world' };
      manager.setCurrentWord(word);

      manager.markLetterRevealed(0);
      const state = manager.getState();
      expect(state.revealedLetters[0]).toBe(true);
      expect(state.revealedLetters[1]).toBe(false);
    });

    it('should mark multiple letters independently', () => {
      const word: Word = { word: 'hello', sentence: 'Hello world' };
      manager.setCurrentWord(word);

      manager.markLetterRevealed(0);
      manager.markLetterRevealed(2);
      manager.markLetterRevealed(4);

      const state = manager.getState();
      expect(state.revealedLetters).toEqual([true, false, true, false, true]);
    });
  });

  describe('useHelp', () => {
    it('should mark help as used and add word to reshuffle queue', () => {
      const word: Word = { word: 'hello', sentence: 'Hello world' };
      manager.setCurrentWord(word);

      manager.useHelp();

      const state = manager.getState();
      expect(state.helpUsed).toBe(true);
      expect(state.reshuffleQueue).toContain(word);
    });

    it('should not add word to queue if help already used', () => {
      const word: Word = { word: 'hello', sentence: 'Hello world' };
      manager.setCurrentWord(word);

      manager.useHelp();
      const firstQueueLength = manager.getState().reshuffleQueue.length;

      manager.useHelp(); // Try to use help again
      const secondQueueLength = manager.getState().reshuffleQueue.length;

      expect(firstQueueLength).toBe(secondQueueLength);
    });

    it('should not use help without current word', () => {
      manager.useHelp();
      const state = manager.getState();
      expect(state.helpUsed).toBe(false);
      expect(state.reshuffleQueue).toEqual([]);
    });
  });

  describe('completeWord', () => {
    it('should add points to session score', () => {
      manager.completeWord(100);
      expect(manager.getState().sessionScore).toBe(100);

      manager.completeWord(50);
      expect(manager.getState().sessionScore).toBe(150);
    });
  });
});
