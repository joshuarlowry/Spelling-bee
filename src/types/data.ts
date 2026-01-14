/**
 * Data Types for Spelling Bee Game
 *
 * These types represent the structure of word data loaded from YAML files.
 *
 * TODO: Define the following interfaces:
 * 1. Word - represents a single word with its sentence
 * 2. Level - represents a level with multiple words
 * 3. Theme - represents theme metadata (id, name, icon, description)
 * 4. WordList - represents the complete data structure loaded from YAML
 */

// TODO: Define Word interface
// Should include:
// - word: string (the word to spell)
// - sentence: string (example sentence using the word)
export interface Word {
  word: string;
  sentence: string;
}

// TODO: Define Level interface
// Should include:
// - level: number (level number, starting from 1)
// - name: string (level name like "The Enchanted Forest")
// - description: string (short description)
// - stars_required: number (stars needed to unlock this level)
// - words: Word[] (array of words in this level)
export interface Level {
  level: number;
  name: string;
  description: string;
  stars_required: number;
  words: Word[];
}

// TODO: Define Theme interface
// Should include:
// - id: string (theme identifier like "fantasy" or "scifi")
// - name: string (display name like "Fantasy Kingdom")
// - icon: string (icon name or path)
// - description: string (theme description)
export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// TODO: Define WordList interface
// This is the root structure of the YAML/JSON files
// Should include:
// - theme: Theme (theme metadata)
// - levels: Level[] (array of levels)
export interface WordList {
  theme: Theme;
  levels: Level[];
}
