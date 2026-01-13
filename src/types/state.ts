/**
 * State Management Types for Spelling Bee Game
 *
 * These types represent the application state and saved progress.
 *
 * TODO: Define the following interfaces:
 * 1. GameState - current session state (what word, which letter, etc.)
 * 2. SavedProgress - persistent state saved to localStorage
 * 3. ThemeProgress - progress for a specific theme
 * 4. LevelProgress - progress for a specific level
 * 5. UserSettings - user preferences (sound, speech rate, etc.)
 */

import { Word } from './data';

// TODO: Define GameState interface
// This tracks the current game session (in-memory only)
// Should include:
// - currentTheme: 'fantasy' | 'scifi' | null (which theme is active)
// - currentLevel: number (which level is being played)
// - currentWordIndex: number (which word in the level)
// - sessionScore: number (points earned in current level)
// - currentWord: Word | null (the word being spelled right now)
// - revealedLetters: boolean[] (which letters have been revealed via help)
// - helpUsed: boolean (was help used for current word)
// - reshuffleQueue: Word[] (words that need to be repeated)
// - inReshuffleMode: boolean (currently playing reshuffle words)
export interface GameState {
  // Add properties here
}

// TODO: Define SavedProgress interface
// This is saved to localStorage
// Should include:
// - version: number (for future migrations)
// - lastPlayed: string (ISO timestamp)
// - themes: { [themeId: string]: ThemeProgress } (progress per theme)
// - settings: UserSettings (user preferences)
export interface SavedProgress {
  // Add properties here
}

// TODO: Define ThemeProgress interface
// Tracks progress within a single theme
// Should include:
// - currentLevel: number (highest level reached)
// - totalScore: number (sum of all level scores)
// - levels: { [levelNum: number]: LevelProgress } (per-level data)
export interface ThemeProgress {
  // Add properties here
}

// TODO: Define LevelProgress interface
// Tracks progress for a single level
// Should include:
// - completed: boolean (has the level been finished)
// - score: number (points earned in this level)
// - stars: 0 | 1 | 2 | 3 (star rating: 3=perfect, 2=good, 1=completed)
// - wordsHelped: string[] (words where help was used)
export interface LevelProgress {
  // Add properties here
}

// TODO: Define UserSettings interface
// User preferences
// Should include:
// - soundEnabled: boolean (sound effects on/off)
// - speechEnabled: boolean (text-to-speech on/off)
// - speechRate: number (TTS speed, default 0.85)
export interface UserSettings {
  // Add properties here
}
