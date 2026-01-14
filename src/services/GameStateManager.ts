/**
 * Game State Manager
 *
 * Manages application state and notifies listeners of changes.
 *
 * IMPLEMENTATION TASKS:
 * 1. Import GameState, Word from types
 * 2. Import StorageService
 * 3. Implement constructor - initialize state and storage
 * 4. Implement getState() - returns immutable state copy
 * 5. Implement setState() - updates state and notifies listeners
 * 6. Implement subscribe() - registers a listener, returns unsubscribe function
 * 7. Implement notifyListeners() - calls all listeners with current state
 * 8. Implement action methods:
 *    - startGame() - initializes a new game session
 *    - setCurrentWord() - sets the word being spelled
 *    - markLetterRevealed() - marks a letter as revealed
 *    - useHelp() - marks help as used, adds word to reshuffle queue
 *    - completeWord() - awards points, saves progress
 * 9. Implement saveProgress() - persists state to storage
 */

import { GameState, Word } from '../types/state';
import { storageService } from './StorageService';

type StateListener = (state: GameState) => void;

export class GameStateManager {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();
  private storage = storageService;

  constructor() {
    /**
     * Initialize game state manager
     *
     * Steps:
     * 1. Set this.storage = storageService
     * 2. Set this.state = this.getInitialState()
     */
    this.state = this.getInitialState();
  }

  /**
   * Returns initial state object.
   *
   * Steps:
   * 1. Return a GameState object with default values:
   *    - currentTheme: null
   *    - currentLevel: 1
   *    - currentWordIndex: 0
   *    - sessionScore: 0
   *    - currentWord: null
   *    - revealedLetters: []
   *    - helpUsed: false
   *    - reshuffleQueue: []
   *    - inReshuffleMode: false
   */
  private getInitialState(): GameState {
    return {
      currentTheme: null,
      currentLevel: 1,
      currentWordIndex: 0,
      sessionScore: 0,
      currentWord: null,
      revealedLetters: [],
      helpUsed: false,
      reshuffleQueue: [],
      inReshuffleMode: false,
    };
  }

  /**
   * Returns immutable copy of current state.
   *
   * Steps:
   * 1. Return Object.freeze({ ...this.state })
   */
  getState(): GameState {
    return Object.freeze({ ...this.state });
  }

  /**
   * Updates state with partial object.
   *
   * Steps:
   * 1. Merge partial into this.state: this.state = { ...this.state, ...partial }
   * 2. Call this.notifyListeners()
   */
  setState(partial: Partial<GameState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  /**
   * Registers a state change listener.
   *
   * Steps:
   * 1. Add listener to this.listeners Set
   * 2. Return unsubscribe function: () => this.listeners.delete(listener)
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Calls all registered listeners.
   *
   * Steps:
   * 1. Get immutable state: const state = this.getState()
   * 2. Loop through this.listeners
   * 3. Call each listener with state
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  /**
   * Initializes a game session.
   *
   * Steps:
   * 1. Get saved progress from storage
   * 2. Get level progress for this theme/level
   * 3. Call setState() with:
   *    - currentTheme: themeId
   *    - currentLevel: level
   *    - currentWordIndex: 0
   *    - sessionScore: saved score or 0
   *    - reshuffleQueue: []
   *    - inReshuffleMode: false
   */
  startGame(themeId: string, level: number): void {
    const progress = this.storage.getProgress();
    let sessionScore = 0;

    if (progress?.themes[themeId]?.levels[level]) {
      sessionScore = progress.themes[themeId].levels[level].score || 0;
    }

    this.setState({
      currentTheme: themeId as 'fantasy' | 'scifi',
      currentLevel: level,
      currentWordIndex: 0,
      sessionScore,
      reshuffleQueue: [],
      inReshuffleMode: false,
    });
  }

  /**
   * Sets the word being spelled.
   *
   * Steps:
   * 1. Create revealedLetters array: new Array(word.word.length).fill(false)
   * 2. Call setState() with:
   *    - currentWord: word
   *    - revealedLetters: array
   *    - helpUsed: false
   */
  setCurrentWord(word: Word): void {
    const revealedLetters = new Array(word.word.length).fill(false);
    this.setState({
      currentWord: word,
      revealedLetters,
      helpUsed: false,
    });
  }

  /**
   * Marks a letter as revealed.
   *
   * Steps:
   * 1. Copy revealedLetters array
   * 2. Set revealed[index] = true
   * 3. Call setState() with new array
   */
  markLetterRevealed(index: number): void {
    const revealed = [...this.state.revealedLetters];
    revealed[index] = true;
    this.setState({ revealedLetters: revealed });
  }

  /**
   * Marks help as used for current word.
   *
   * Steps:
   * 1. Check if currentWord exists and helpUsed is false
   * 2. Call setState() with:
   *    - helpUsed: true
   * 3. Add currentWord to reshuffleQueue
   */
  useHelp(): void {
    if (this.state.currentWord && !this.state.helpUsed) {
      const queue = [...this.state.reshuffleQueue, this.state.currentWord];
      this.setState({
        helpUsed: true,
        reshuffleQueue: queue,
      });
    }
  }

  /**
   * Awards points and saves progress.
   *
   * Steps:
   * 1. Add pointsEarned to sessionScore
   * 2. Call setState() with new sessionScore
   * 3. Call this.saveProgress()
   */
  completeWord(pointsEarned: number): void {
    const newScore = this.state.sessionScore + pointsEarned;
    this.setState({ sessionScore: newScore });
    this.saveProgress();
  }

  /**
   * Persists current state to storage.
   *
   * Steps:
   * 1. Get currentTheme, currentLevel, sessionScore from state
   * 2. If no theme, return early
   * 3. Call storage.updateLevelProgress() with:
   *    - themeId: currentTheme
   *    - level: currentLevel
   *    - update: { score: sessionScore }
   */
  private saveProgress(): void {
    const { currentTheme, currentLevel, sessionScore } = this.state;

    if (!currentTheme) {
      return;
    }

    this.storage.updateLevelProgress(currentTheme, currentLevel, {
      score: sessionScore,
    });
  }
}

// Export singleton instance
export const gameState = new GameStateManager();
