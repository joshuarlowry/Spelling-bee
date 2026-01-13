# Spelling Bee Game - Detailed Implementation Tasks with Test Requirements

This document provides **comprehensive, testable tasks** with detailed prompts, test requirements, and success criteria. Each task is designed to be implemented independently with clear verification steps.

## How to Use This Document

For each task:
1. **Read the Implementation Prompt** - This is what you need to build
2. **Follow the Step-by-Step Instructions** - Detailed implementation guide
3. **Check Test Requirements** - What must work when you're done
4. **Verify Success** - Run the verification steps
5. **Mark Complete** - Only when all tests pass

---

## PHASE 1: Project Setup

### Task 1.1.1: Create package.json with dependencies

**Status:** ✅ COMPLETED

**Implementation Prompt:**
The package.json file already exists with all required dependencies including TypeScript, Vite, Howler.js, and development tools.

**Test Requirements:**
- ✅ File exists at `/package.json`
- ✅ Contains all dependencies
- ✅ Has build, dev, and typecheck scripts

---

### Task 1.1.2: Create tsconfig.json for TypeScript

**Status:** ✅ COMPLETED

**Test Requirements:**
- ✅ File exists at `/tsconfig.json`
- ✅ Targets ES2020 or higher
- ✅ Module resolution is set to "bundler"

---

### Task 1.2.1: Complete build-words.js script

**Status:** ⏳ TODO

**Implementation Prompt:**
Complete the `scripts/build-words.js` file to convert YAML word lists to JSON format and validate that each word appears in its sentence.

**Step-by-Step Instructions:**

1. Open `scripts/build-words.js`
2. Import required modules:
   ```javascript
   const fs = require('fs');
   const path = require('path');
   const yaml = require('yaml');
   ```

3. Read all YAML files from `words/` directory:
   ```javascript
   const wordsDir = path.join(__dirname, '../words');
   const files = fs.readdirSync(wordsDir).filter(f => f.endsWith('.yaml'));
   ```

4. For each YAML file:
   - Parse YAML content
   - Validate structure (must have `id`, `name`, `description`, `levels` array)
   - For each level, validate `name`, `description`, `words` array
   - For each word, check:
     - Has `word` and `sentence` properties
     - The `word` (case-insensitive) appears in the `sentence`
     - If not, throw error with details

5. Save validated data as JSON to `public/words/${filename}.json`

6. Log success message for each file

**Test Requirements:**

```bash
# Test 1: Script runs without errors
node scripts/build-words.js
# Expected output: ✅ Converted words/fantasy.yaml → public/words/fantasy.json
# Expected output: ✅ Converted words/scifi.yaml → public/words/scifi.json

# Test 2: JSON files are created
ls public/words/
# Expected output: fantasy.json scifi.json

# Test 3: JSON is valid and parseable
node -e "const data = require('./public/words/fantasy.json'); console.log(data.id)"
# Expected output: fantasy

# Test 4: Validation works - create a test with invalid word
# Add a word to fantasy.yaml that doesn't appear in sentence
# Run script again
# Expected output: ❌ Error: Word "xyz" not found in sentence "..."
```

**Expected Behavior:**
- Creates `public/words/` directory if it doesn't exist
- Converts each YAML file to JSON with identical structure
- Validates word appears in sentence (case-insensitive)
- Provides clear error messages with file and word details
- Exits with code 0 on success, code 1 on error

**How to Verify:**
1. Run `node scripts/build-words.js`
2. Check that `public/words/fantasy.json` exists and contains valid JSON
3. Verify that the JSON structure matches the YAML structure
4. Manually check that a word from the JSON appears in its sentence
5. Try adding an invalid word to test validation

---

## PHASE 2: TypeScript Types

### Task 2.1.1: Define Word interface

**Status:** ⏳ TODO

**Implementation Prompt:**
In `src/types/data.ts`, define the `Word` interface that represents a single spelling word with its context sentence.

**Step-by-Step Instructions:**

1. Open `src/types/data.ts`
2. Find the TODO comment for the Word interface
3. Replace the placeholder with:
   ```typescript
   export interface Word {
     word: string;        // The word to spell (e.g., "dragon")
     sentence: string;    // Example sentence (e.g., "The dragon flew over the castle")
   }
   ```

**Test Requirements:**

```bash
# Test 1: TypeScript compiles without errors
npm run typecheck
# Expected output: No errors

# Test 2: Can create Word objects
# Create a test file: test-word.ts
cat > test-word.ts << 'EOF'
import { Word } from './src/types/data';

const testWord: Word = {
  word: 'dragon',
  sentence: 'The dragon flew over the castle'
};

console.log('✅ Word interface works:', testWord.word);
EOF

npx tsx test-word.ts
# Expected output: ✅ Word interface works: dragon

# Test 3: Type checking works (should fail)
cat > test-word-invalid.ts << 'EOF'
import { Word } from './src/types/data';

const invalid: Word = {
  word: 'dragon'
  // Missing sentence - should cause type error
};
EOF

npx tsc --noEmit test-word-invalid.ts
# Expected output: Error: Property 'sentence' is missing
```

**Expected Behavior:**
- Interface has exactly 2 properties: `word` and `sentence`, both strings
- TypeScript enforces both properties are required
- No optional properties
- Can be imported and used in other files

**How to Verify:**
1. Run `npm run typecheck` - should pass
2. Create a test file that uses the Word interface
3. Try creating an invalid Word object - should show type error
4. Check that autocomplete works in your editor

---

### Task 2.1.2: Define Level interface

**Status:** ⏳ TODO

**Implementation Prompt:**
Define the `Level` interface that represents a difficulty level within a theme, containing multiple words.

**Step-by-Step Instructions:**

1. In `src/types/data.ts`, add after the Word interface:
   ```typescript
   export interface Level {
     name: string;           // Level name (e.g., "Beginner")
     description: string;    // Description (e.g., "Start your adventure")
     words: Word[];          // Array of words for this level
   }
   ```

**Test Requirements:**

```typescript
// Test file: test-level.ts
import { Level, Word } from './src/types/data';

const testLevel: Level = {
  name: 'Beginner',
  description: 'Start your adventure',
  words: [
    { word: 'dragon', sentence: 'The dragon flew high' },
    { word: 'knight', sentence: 'The knight was brave' }
  ]
};

// Test 1: Should compile
console.log('✅ Level has', testLevel.words.length, 'words');

// Test 2: Can access nested Word properties
console.log('✅ First word:', testLevel.words[0].word);

// Test 3: Type checking for words array
const invalidLevel: Level = {
  name: 'Test',
  description: 'Test',
  words: ['not', 'a', 'Word', 'object'] // Should error
};
```

**Expected Behavior:**
- Interface has 3 properties: name, description, words
- `words` is an array of `Word` objects
- TypeScript enforces Word[] type (can't put strings or other types)
- All properties are required

**How to Verify:**
```bash
# Should pass
npm run typecheck

# Should show correct type in editor
# Open src/types/data.ts
# Hover over Level - should show full interface definition
```

---

### Task 2.1.3: Define Theme interface

**Status:** ⏳ TODO

**Implementation Prompt:**
Define the `Theme` interface that represents a complete theme with metadata and multiple levels.

**Step-by-Step Instructions:**

```typescript
export interface Theme {
  id: string;             // Unique identifier (e.g., "fantasy")
  name: string;           // Display name (e.g., "Fantasy Kingdom")
  description: string;    // Theme description
  icon: string;           // Icon/emoji (e.g., "🏰")
  levels: Level[];        // Array of difficulty levels
}
```

**Test Requirements:**

```typescript
// Test complete theme structure
const testTheme: Theme = {
  id: 'fantasy',
  name: 'Fantasy Kingdom',
  description: 'Magical words from a fantasy world',
  icon: '🏰',
  levels: [
    {
      name: 'Beginner',
      description: 'Start here',
      words: [
        { word: 'dragon', sentence: 'The dragon flew' }
      ]
    }
  ]
};

console.log('✅ Theme:', testTheme.name, testTheme.icon);
console.log('✅ Has', testTheme.levels.length, 'levels');
console.log('✅ First level:', testTheme.levels[0].name);
```

**Expected Behavior:**
- Complete nested type structure: Theme → Level[] → Word[]
- Can access deeply nested properties with full type safety
- All properties are required

**How to Verify:**
```bash
npm run typecheck  # No errors

# Editor test: Type theme. and see autocomplete
# Should show: id, name, description, icon, levels
```

---

### Task 2.1.4: Define WordList interface

**Status:** ⏳ TODO

**Implementation Prompt:**
Define `WordList` as an alias for Theme (they're the same structure).

```typescript
export type WordList = Theme;
```

**Test Requirements:**

```typescript
// Should work identically to Theme
const list1: Theme = { /* ... */ };
const list2: WordList = list1;  // Should work
const list3: Theme = list2;      // Should work
```

**Expected Behavior:**
- `WordList` and `Theme` are interchangeable
- Type alias, not a new interface

---

### Task 2.2.1: Define GameState interface

**Status:** ⏳ TODO

**Implementation Prompt:**
Create the main game state interface in `src/types/state.ts`. This represents the entire application state during gameplay.

**Step-by-Step Instructions:**

```typescript
// src/types/state.ts
import { Word } from './data';

export interface GameState {
  // Current game session
  currentTheme: string | null;      // Theme ID (e.g., "fantasy") or null
  currentLevel: number | null;      // Level number (1-5) or null
  currentWord: Word | null;         // Current word being spelled
  currentWordIndex: number;         // Index in words array

  // Progress tracking
  score: number;                    // Current score
  wordsCompleted: number;           // Words completed this level
  totalWords: number;               // Total words in level
  helpUsed: boolean;                // Whether help was used for current word
  revealedLetters: number[];        // Indices of revealed letters

  // Session data
  isPlaying: boolean;               // Whether game is active
  isPaused: boolean;                // Whether game is paused
}
```

**Test Requirements:**

```typescript
// Test 1: Can create initial state
const initialState: GameState = {
  currentTheme: null,
  currentLevel: null,
  currentWord: null,
  currentWordIndex: 0,
  score: 0,
  wordsCompleted: 0,
  totalWords: 0,
  helpUsed: false,
  revealedLetters: [],
  isPlaying: false,
  isPaused: false
};

console.log('✅ Initial state created');

// Test 2: Can create active game state
const activeState: GameState = {
  currentTheme: 'fantasy',
  currentLevel: 1,
  currentWord: { word: 'dragon', sentence: 'The dragon flew' },
  currentWordIndex: 0,
  score: 50,
  wordsCompleted: 5,
  totalWords: 10,
  helpUsed: false,
  revealedLetters: [],
  isPlaying: true,
  isPaused: false
};

console.log('✅ Active state created');

// Test 3: Type checking works
const invalid: GameState = {
  currentTheme: 'fantasy',
  currentLevel: '1',  // Should error - must be number
  // ... missing required fields - should error
};
```

**Expected Behavior:**
- All 11 properties are required
- Proper types for each property
- Arrays for revealedLetters (number[])
- Nullable types where appropriate (string | null)

**How to Verify:**
```bash
npm run typecheck  # Pass
# Create test state objects
# Try invalid types - should show errors
```

---

### Task 2.2.2: Define SavedProgress interface

**Status:** ⏳ TODO

**Implementation Prompt:**
Define the structure for saved progress data in localStorage.

```typescript
export interface LevelProgress {
  completed: boolean;       // Whether level is completed
  stars: 0 | 1 | 2 | 3;    // Star rating (0-3)
  highScore: number;        // Best score for this level
  attempts: number;         // Number of times played
}

export interface ThemeProgress {
  [levelNumber: number]: LevelProgress;  // Key is level number (1, 2, 3...)
}

export interface SavedProgress {
  version: number;                        // Save format version
  themes: {
    [themeId: string]: ThemeProgress;     // Key is theme ID ('fantasy', 'scifi')
  };
  settings: {
    soundEnabled: boolean;
    speechEnabled: boolean;
  };
  lastPlayed: string;                     // ISO timestamp
}
```

**Test Requirements:**

```typescript
// Test: Create save data structure
const saveData: SavedProgress = {
  version: 1,
  themes: {
    fantasy: {
      1: { completed: true, stars: 3, highScore: 150, attempts: 2 },
      2: { completed: true, stars: 2, highScore: 120, attempts: 3 },
      3: { completed: false, stars: 0, highScore: 0, attempts: 0 }
    },
    scifi: {
      1: { completed: true, stars: 3, highScore: 140, attempts: 1 }
    }
  },
  settings: {
    soundEnabled: true,
    speechEnabled: true
  },
  lastPlayed: new Date().toISOString()
};

// Test access patterns
console.log('Fantasy Level 1 stars:', saveData.themes.fantasy[1].stars);
console.log('Sound enabled:', saveData.settings.soundEnabled);

// Test type safety
const level: LevelProgress = saveData.themes.fantasy[1];
const invalidStars: LevelProgress = {
  completed: true,
  stars: 5,  // Error: Must be 0, 1, 2, or 3
  highScore: 100,
  attempts: 1
};
```

**Expected Behavior:**
- Can represent complete save file
- Nested structure: SavedProgress → themes → ThemeProgress → LevelProgress
- Stars constrained to 0 | 1 | 2 | 3
- Flexible theme and level keys

**How to Verify:**
```bash
npm run typecheck  # Pass

# Test in code:
# - Create SavedProgress object
# - Access nested properties
# - Try invalid stars value (should error)
```

---

### Task 2.3.1: Define Service Types

**Status:** ⏳ TODO

**Implementation Prompt:**
Define types for service interfaces in `src/types/services.ts`.

```typescript
// Speech service options
export interface SpeechOptions {
  rate?: number;      // Speech rate (0.1 to 10, default 1)
  pitch?: number;     // Voice pitch (0 to 2, default 1)
  volume?: number;    // Volume (0 to 1, default 1)
  voice?: string;     // Voice name (optional)
}

// Sound effect names
export type SoundName =
  | 'correct'         // Letter typed correctly
  | 'incorrect'       // Letter typed incorrectly
  | 'complete'        // Word completed
  | 'celebrate'       // Level completed
  | 'click'           // Button click
  | 'reveal';         // Letter revealed with help

// Event listener type
export type StateListener = (state: GameState) => void;
```

**Test Requirements:**

```typescript
import { SpeechOptions, SoundName, StateListener } from './src/types/services';

// Test 1: SpeechOptions (all optional)
const opts1: SpeechOptions = {};
const opts2: SpeechOptions = { rate: 1.5, pitch: 1.2 };
const opts3: SpeechOptions = { rate: 0.5, pitch: 1, volume: 0.8, voice: 'Google US English' };

// Test 2: SoundName (must be one of the allowed strings)
const sound1: SoundName = 'correct';
const sound2: SoundName = 'celebrate';
const invalid: SoundName = 'explosion';  // Error

// Test 3: StateListener function type
const listener: StateListener = (state) => {
  console.log('Score:', state.score);
  console.log('Playing:', state.isPlaying);
};

// Test 4: Function signature matching
function subscribe(callback: StateListener) {
  // Should accept any function matching StateListener signature
}

subscribe((state) => console.log(state.score));  // OK
subscribe(() => console.log('test'));            // Error: wrong signature
```

**Expected Behavior:**
- SpeechOptions all properties optional
- SoundName restricted to exact strings
- StateListener is a function type
- Type errors for invalid values

**How to Verify:**
```bash
npm run typecheck

# Try each invalid case - should show errors
# Valid cases should compile
```

---

### Task 2.3.2: Define Router Types

**Status:** ⏳ TODO

**Implementation Prompt:**
Complete the router types in `src/types/router.ts`.

```typescript
// Route names
export type Route = 'title' | 'levels' | 'game';

// Route parameters
export interface RouteParams {
  theme?: string;    // Theme ID (required for 'levels' and 'game' routes)
  level?: number;    // Level number (required for 'game' route)
}

// Route handler function type
export type RouteHandler = (params: RouteParams) => void;
```

**Test Requirements:**

```typescript
import { Route, RouteParams, RouteHandler } from './src/types/router';

// Test 1: Route type (must be one of three values)
const route1: Route = 'title';
const route2: Route = 'levels';
const route3: Route = 'game';
const invalid: Route = 'settings';  // Error

// Test 2: RouteParams (all optional)
const params1: RouteParams = {};
const params2: RouteParams = { theme: 'fantasy' };
const params3: RouteParams = { theme: 'fantasy', level: 1 };

// Test 3: RouteHandler function type
const handler: RouteHandler = (params) => {
  if (params.theme) {
    console.log('Theme:', params.theme);
  }
  if (params.level) {
    console.log('Level:', params.level);
  }
};

// Test 4: Handler registration
const routes = new Map<Route, RouteHandler>();
routes.set('title', (params) => console.log('Title screen'));
routes.set('game', (params) => console.log(`Game: ${params.theme} ${params.level}`));
```

**Expected Behavior:**
- Route restricted to 3 strings
- RouteParams properties optional
- RouteHandler takes params, returns void
- Can use in Map with Route as key

**How to Verify:**
```bash
npm run typecheck

# Test in editor:
# - Type a route: should autocomplete 'title', 'levels', 'game'
# - Create handler: params should have theme? and level?
```

---

## PHASE 3: Services (Core Logic)

### Task 3.1.1: Implement StorageService.getProgress()

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the `getProgress()` method in `src/services/StorageService.ts` to load saved game progress from localStorage.

**Step-by-Step Instructions:**

1. Open `src/services/StorageService.ts`
2. Find the `getProgress()` method
3. Implement:

```typescript
getProgress(): SavedProgress {
  try {
    // Try to get data from localStorage
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      // No save data exists, return default
      return this.getDefaultProgress();
    }

    // Parse JSON
    const parsed = JSON.parse(data) as SavedProgress;

    // Migrate if needed (handle old versions)
    const migrated = this.migrateProgress(parsed);

    return migrated;
  } catch (error) {
    // If any error (parse error, etc.), return default
    console.error('Error loading progress:', error);
    return this.getDefaultProgress();
  }
}

private getDefaultProgress(): SavedProgress {
  return {
    version: 1,
    themes: {},
    settings: {
      soundEnabled: true,
      speechEnabled: true
    },
    lastPlayed: new Date().toISOString()
  };
}
```

**Test Requirements:**

```typescript
// Manual test in browser console
import { StorageService } from './src/services/StorageService';

const storage = new StorageService();

// Test 1: No data exists (first time)
localStorage.clear();
const progress1 = storage.getProgress();
console.assert(progress1.version === 1, 'Should have version 1');
console.assert(Object.keys(progress1.themes).length === 0, 'Should have no themes');
console.assert(progress1.settings.soundEnabled === true, 'Sound should be enabled');
console.log('✅ Test 1 passed: Default progress');

// Test 2: Data exists
const mockData = {
  version: 1,
  themes: {
    fantasy: {
      1: { completed: true, stars: 3, highScore: 150, attempts: 1 }
    }
  },
  settings: { soundEnabled: false, speechEnabled: true },
  lastPlayed: '2024-01-01T00:00:00.000Z'
};
localStorage.setItem('spelling-bee-progress', JSON.stringify(mockData));

const progress2 = storage.getProgress();
console.assert(progress2.themes.fantasy[1].stars === 3, 'Should load saved stars');
console.assert(progress2.settings.soundEnabled === false, 'Should load saved settings');
console.log('✅ Test 2 passed: Existing progress loaded');

// Test 3: Corrupted data
localStorage.setItem('spelling-bee-progress', 'invalid json{]');
const progress3 = storage.getProgress();
console.assert(progress3.version === 1, 'Should return default on error');
console.log('✅ Test 3 passed: Handles corrupted data');

// Test 4: Missing fields
localStorage.setItem('spelling-bee-progress', '{"version":1}');
const progress4 = storage.getProgress();
console.assert(typeof progress4.themes === 'object', 'Should have themes object');
console.log('✅ Test 4 passed: Handles incomplete data');
```

**Expected Behavior:**
- Returns SavedProgress object
- If no data exists, returns default progress
- If data is corrupted, logs error and returns default
- Never throws errors (catches all errors)
- Defaults: soundEnabled=true, speechEnabled=true, version=1

**How to Verify:**

```bash
# 1. Build the project
npm run build

# 2. Start dev server
npm run dev

# 3. Open browser console (http://localhost:3000)
# 4. Test with:
localStorage.clear();
const storage = new StorageService();
console.log(storage.getProgress());
// Should show default progress

# 5. Add some data:
localStorage.setItem('spelling-bee-progress', JSON.stringify({
  version: 1,
  themes: { fantasy: { 1: { completed: true, stars: 3, highScore: 100, attempts: 1 } } },
  settings: { soundEnabled: true, speechEnabled: true },
  lastPlayed: new Date().toISOString()
}));
console.log(storage.getProgress());
// Should show saved data

# 6. Test error handling:
localStorage.setItem('spelling-bee-progress', 'bad data');
console.log(storage.getProgress());
// Should show default progress, not crash
```

---

### Task 3.1.2: Implement StorageService.saveProgress()

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the `saveProgress()` method to save game progress to localStorage.

```typescript
saveProgress(progress: SavedProgress): boolean {
  try {
    // Update lastPlayed timestamp
    progress.lastPlayed = new Date().toISOString();

    // Convert to JSON
    const json = JSON.stringify(progress);

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, json);

    return true;
  } catch (error) {
    // localStorage might be full or disabled
    console.error('Error saving progress:', error);
    return false;
  }
}
```

**Test Requirements:**

```typescript
// Test 1: Save new progress
const storage = new StorageService();
const newProgress: SavedProgress = {
  version: 1,
  themes: {
    fantasy: {
      1: { completed: true, stars: 3, highScore: 150, attempts: 1 }
    }
  },
  settings: { soundEnabled: true, speechEnabled: true },
  lastPlayed: new Date().toISOString()
};

const saved = storage.saveProgress(newProgress);
console.assert(saved === true, 'Should return true on success');

// Test 2: Verify data was saved
const loaded = storage.getProgress();
console.assert(loaded.themes.fantasy[1].stars === 3, 'Data should persist');
console.log('✅ Save and load works');

// Test 3: lastPlayed is updated
const oldTimestamp = '2020-01-01T00:00:00.000Z';
const progress = storage.getProgress();
progress.lastPlayed = oldTimestamp;
storage.saveProgress(progress);
const reloaded = storage.getProgress();
console.assert(reloaded.lastPlayed !== oldTimestamp, 'Timestamp should be updated');
console.log('✅ Timestamp updated automatically');

// Test 4: Returns false on error (simulate full storage)
// This is hard to test automatically, but method should handle it
```

**Expected Behavior:**
- Saves progress to localStorage under key 'spelling-bee-progress'
- Automatically updates lastPlayed timestamp to current time
- Returns true on success
- Returns false on error (doesn't throw)
- Data persists across page reloads

**How to Verify:**

```bash
# Browser console:

const storage = new StorageService();

// Save some data
storage.saveProgress({
  version: 1,
  themes: { fantasy: { 1: { completed: true, stars: 3, highScore: 100, attempts: 1 } } },
  settings: { soundEnabled: false, speechEnabled: true },
  lastPlayed: new Date().toISOString()
});

// Check localStorage directly
console.log(localStorage.getItem('spelling-bee-progress'));
// Should see JSON string

// Reload page and check data persists
location.reload();
// Then:
console.log(new StorageService().getProgress());
// Should have same data
```

---

### Task 3.2.1: Implement SpeechService.speak() method

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the core `speak()` method in `src/services/SpeechService.ts` using the Web Speech API.

**Step-by-Step Instructions:**

```typescript
speak(text: string, options: SpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available');
      resolve(); // Don't fail, just skip speech
      return;
    }

    // Stop any currently speaking utterance
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply options
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Select voice if specified
    if (options.voice && this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Set up event handlers
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      resolve(); // Resolve anyway, don't block game
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  });
}
```

**Test Requirements:**

```typescript
// Browser console test (requires user interaction first)

import { SpeechService } from './src/services/SpeechService';

const speech = new SpeechService();

// Test 1: Basic speech
await speech.speak('Hello world');
// Expected: Should hear "Hello world" spoken aloud
console.log('✅ Basic speech works');

// Test 2: Custom rate
await speech.speak('This is fast', { rate: 1.5 });
// Expected: Should hear text spoken quickly
console.log('✅ Custom rate works');

// Test 3: Custom pitch
await speech.speak('This is high pitched', { pitch: 1.5 });
// Expected: Should hear higher pitched voice
console.log('✅ Custom pitch works');

// Test 4: Promise resolves when speech ends
const start = Date.now();
await speech.speak('Test text');
const duration = Date.now() - start;
console.log('Speech took', duration, 'ms');
console.log('✅ Promise resolution works');

// Test 5: Interruption
speech.speak('This is a long sentence that should be interrupted');
setTimeout(() => speech.stop(), 500);
// Expected: Speech should stop mid-sentence

// Test 6: Error handling (browser without speech)
// Mock speechSynthesis as undefined
const originalSpeech = window.speechSynthesis;
delete window.speechSynthesis;
await speech.speak('test');  // Should not throw error
window.speechSynthesis = originalSpeech;
console.log('✅ Handles missing API gracefully');
```

**Expected Behavior:**
- Returns Promise that resolves when speech ends
- Stops any currently playing speech before starting new
- Uses default rate=0.9, pitch=1.0, volume=1.0
- Allows custom options
- Never throws errors (resolves even on error)
- Works in browsers with Web Speech API
- Silently skips in browsers without API

**How to Verify:**

```bash
# 1. Start dev server
npm run dev

# 2. Open browser console
# 3. Click anywhere on page first (user interaction required)

# 4. Test basic speech:
const speech = new SpeechService();
await speech.speak('Testing speech');
// Listen: should hear "Testing speech"

# 5. Test rate:
await speech.speak('Fast speech', { rate: 2.0 });
// Listen: should be faster

# 6. Test interruption:
speech.speak('This is a very long sentence that goes on and on');
setTimeout(() => speech.stop(), 1000);
// Listen: should stop after 1 second

# 7. Check console for errors - should be none
```

---

### Task 3.2.2: Implement SpeechService.speakWord()

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the `speakWord()` wrapper method that speaks a single word with appropriate pacing.

```typescript
async speakWord(word: string): Promise<void> {
  // Spell out the word clearly with slight emphasis
  return this.speak(word, {
    rate: 0.8,   // Slightly slower for clarity
    pitch: 1.1,  // Slightly higher to grab attention
    volume: 1.0
  });
}
```

**Test Requirements:**

```typescript
// Browser console test
const speech = new SpeechService();

// Test 1: Speak a word
await speech.speakWord('dragon');
// Expected: Hear "dragon" spoken clearly and slowly
console.log('✅ Word spoken');

// Test 2: Multiple words in sequence
for (const word of ['knight', 'castle', 'sword']) {
  await speech.speakWord(word);
  await new Promise(r => setTimeout(r, 500)); // Pause between words
}
console.log('✅ Multiple words spoken');

// Test 3: Rate should be 0.8
// Listen: should be noticeably slower than normal speech
```

**Expected Behavior:**
- Uses rate=0.8 (slower than normal)
- Uses pitch=1.1 (slightly higher)
- Returns promise that resolves when done
- Word is spoken clearly and distinctly

**How to Verify:**

```bash
# Browser console:
const speech = new SpeechService();
await speech.speakWord('fantastic');
// Listen: should be slow and clear

# Compare with normal speech:
await speech.speak('fantastic');
// Should be faster/different
```

---

### Task 3.2.3: Implement SpeechService.speakSentence()

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the `speakSentence()` method for speaking example sentences naturally.

```typescript
async speakSentence(sentence: string): Promise<void> {
  // Speak sentence at normal conversational pace
  return this.speak(sentence, {
    rate: 1.0,   // Normal speed
    pitch: 1.0,  // Normal pitch
    volume: 1.0
  });
}
```

**Test Requirements:**

```typescript
const speech = new SpeechService();

// Test 1: Speak a sentence
await speech.speakSentence('The dragon flew over the castle');
// Expected: Natural speech at normal pace

// Test 2: Compare with word
await speech.speakWord('dragon');
await new Promise(r => setTimeout(r, 500));
await speech.speakSentence('The dragon flew over the castle');
// Word should be slower/more emphasized

// Test 3: Long sentence
await speech.speakSentence('The brave knight rode through the dark forest to find the hidden treasure that was guarded by a fierce dragon');
// Should speak entire sentence naturally
```

**Expected Behavior:**
- Uses normal rate (1.0)
- Uses normal pitch (1.0)
- Speaks full sentence naturally
- Different from speakWord (faster, more natural)

---

### Task 3.2.4: Implement SpeechService.speakLetter()

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement the `speakLetter()` method with phonetic clarity for single letters.

```typescript
async speakLetter(letter: string): Promise<void> {
  // Map confusing letters to phonetic equivalents
  const phoneticMap: { [key: string]: string } = {
    'a': 'ay',
    'b': 'bee',
    'c': 'see',
    'd': 'dee',
    'e': 'ee',
    'f': 'eff',
    'g': 'jee',
    'h': 'aych',
    'i': 'eye',
    'j': 'jay',
    'k': 'kay',
    'l': 'ell',
    'm': 'em',
    'n': 'en',
    'o': 'oh',
    'p': 'pee',
    'q': 'queue',
    'r': 'are',
    's': 'ess',
    't': 'tee',
    'u': 'you',
    'v': 'vee',
    'w': 'double you',
    'x': 'ex',
    'y': 'why',
    'z': 'zee'
  };

  const letterLower = letter.toLowerCase();
  const textToSpeak = phoneticMap[letterLower] || letter;

  return this.speak(textToSpeak, {
    rate: 0.7,   // Very slow for clarity
    pitch: 1.2,  // Higher pitch to differentiate
    volume: 1.0
  });
}
```

**Test Requirements:**

```typescript
const speech = new SpeechService();

// Test 1: Speak individual letters
for (const letter of 'dragon'.split('')) {
  await speech.speakLetter(letter);
  await new Promise(r => setTimeout(r, 300));
}
// Expected: Hear "dee, are, ay, jee, oh, en" phonetically

// Test 2: Confusing letters
await speech.speakLetter('b');
await new Promise(r => setTimeout(r, 500));
await speech.speakLetter('d');
// Should be clearly different

await speech.speakLetter('m');
await new Promise(r => setTimeout(r, 500));
await speech.speakLetter('n');
// Should be clearly different

// Test 3: Case insensitive
await speech.speakLetter('A');
await speech.speakLetter('a');
// Should sound the same
```

**Expected Behavior:**
- Maps letters to phonetic pronunciations
- Very slow rate (0.7) for maximum clarity
- Case-insensitive
- Helps distinguish confusing letters (b/d, m/n)

**How to Verify:**

```bash
# Test confusing letters:
const speech = new SpeechService();

await speech.speakLetter('b');  # Hear "bee"
await speech.speakLetter('d');  # Hear "dee" - clearly different

await speech.speakLetter('m');  # Hear "em"
await speech.speakLetter('n');  # Hear "en" - clearly different
```

---

## PHASE 4: Utilities

### Task 4.3.1: Implement calculatePoints() function

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement point calculation logic in `src/utils/helpers.ts`.

```typescript
export function calculatePoints(
  level: number,
  wordLength: number,
  lettersTypedBeforeHelp: number,
  helpUsed: boolean
): number {
  // Base points
  const basePoints = 10;

  // Level multiplier
  const multiplier = getLevelMultiplier(level);

  // Calculate points
  let points = basePoints * multiplier;

  // If help was used, reduce points based on how many letters were typed
  if (helpUsed) {
    const percentageTyped = lettersTypedBeforeHelp / wordLength;
    points = points * percentageTyped;
  }

  // Round to nearest integer
  return Math.round(points);
}
```

**Test Requirements:**

```typescript
import { calculatePoints } from './src/utils/helpers';

// Test 1: Level 1, no help
const points1 = calculatePoints(1, 5, 5, false);
console.assert(points1 === 10, 'Level 1 no help should be 10 points');

// Test 2: Level 2, no help (1.5x multiplier)
const points2 = calculatePoints(2, 5, 5, false);
console.assert(points2 === 15, 'Level 2 should be 15 points');

// Test 3: Level 3, no help (2.0x multiplier)
const points3 = calculatePoints(3, 5, 5, false);
console.assert(points3 === 20, 'Level 3 should be 20 points');

// Test 4: Level 1, help after 2/5 letters
const points4 = calculatePoints(1, 5, 2, true);
console.assert(points4 === 4, 'Should be (2/5) * 10 = 4 points');

// Test 5: Level 2, help after 3/6 letters
const points5 = calculatePoints(2, 6, 3, true);
console.assert(points5 === 8, 'Should be (3/6) * 15 = 7.5 ≈ 8 points');

// Test 6: Help after 0 letters (revealed immediately)
const points6 = calculatePoints(1, 5, 0, true);
console.assert(points6 === 0, 'No points if help used immediately');

// Test 7: Edge case - level 5
const points7 = calculatePoints(5, 5, 5, false);
console.assert(points7 === 30, 'Level 5 should have high multiplier');

console.log('✅ All calculatePoints tests passed');
```

**Expected Behavior:**
- Base points = 10
- Multiplied by level multiplier (1x, 1.5x, 2x, etc.)
- If help used, multiply by (lettersTyped / totalLetters)
- Returns rounded integer
- 0 points if help used before any letters typed

**How to Verify:**

```bash
# Create test file: test-calculate-points.ts
npm run typecheck  # Should pass

# Run tests:
npx tsx test-calculate-points.ts
# All assertions should pass
```

---

### Task 4.3.2: Implement getLevelMultiplier() function

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement level multiplier calculation.

```typescript
export function getLevelMultiplier(level: number): number {
  if (level === 1) return 1.0;
  if (level === 2) return 1.5;
  if (level === 3) return 2.0;

  // Level 4+: 2.0 + (level - 3) * 0.5
  return 2.0 + (level - 3) * 0.5;
}
```

**Test Requirements:**

```typescript
import { getLevelMultiplier } from './src/utils/helpers';

console.assert(getLevelMultiplier(1) === 1.0, 'Level 1: 1.0x');
console.assert(getLevelMultiplier(2) === 1.5, 'Level 2: 1.5x');
console.assert(getLevelMultiplier(3) === 2.0, 'Level 3: 2.0x');
console.assert(getLevelMultiplier(4) === 2.5, 'Level 4: 2.5x');
console.assert(getLevelMultiplier(5) === 3.0, 'Level 5: 3.0x');
console.assert(getLevelMultiplier(6) === 3.5, 'Level 6: 3.5x');
console.assert(getLevelMultiplier(10) === 5.5, 'Level 10: 5.5x');

console.log('✅ All multiplier tests passed');
```

**Expected Behavior:**
- Returns exact multiplier values
- Level 1: 1.0
- Level 2: 1.5
- Level 3: 2.0
- Level 4+: increases by 0.5 per level

---

### Task 4.3.3: Implement calculateStars() function

**Status:** ⏳ TODO

**Implementation Prompt:**
Implement star rating calculation based on score percentage.

```typescript
export function calculateStars(earnedScore: number, maxScore: number): 0 | 1 | 2 | 3 {
  if (maxScore === 0) return 0;

  const percentage = (earnedScore / maxScore) * 100;

  if (percentage >= 90) return 3;  // Nearly perfect
  if (percentage >= 70) return 2;  // Good
  if (percentage >= 50) return 1;  // Completed
  return 0;                        // Incomplete
}
```

**Test Requirements:**

```typescript
import { calculateStars } from './src/utils/helpers';

// Test 1: Perfect score (100%)
console.assert(calculateStars(100, 100) === 3, '100% = 3 stars');

// Test 2: 90% (3 stars threshold)
console.assert(calculateStars(90, 100) === 3, '90% = 3 stars');
console.assert(calculateStars(89, 100) === 2, '89% = 2 stars');

// Test 3: 70% (2 stars threshold)
console.assert(calculateStars(70, 100) === 2, '70% = 2 stars');
console.assert(calculateStars(69, 100) === 1, '69% = 1 star');

// Test 4: 50% (1 star threshold)
console.assert(calculateStars(50, 100) === 1, '50% = 1 star');
console.assert(calculateStars(49, 100) === 0, '49% = 0 stars');

// Test 5: Edge cases
console.assert(calculateStars(0, 100) === 0, '0% = 0 stars');
console.assert(calculateStars(100, 0) === 0, 'Max 0 = 0 stars');
console.assert(calculateStars(45, 50) === 3, '90% with different max');

console.log('✅ All star calculation tests passed');
```

**Expected Behavior:**
- Returns 0, 1, 2, or 3 stars
- 3 stars: 90%+ of max score
- 2 stars: 70-89%
- 1 star: 50-69%
- 0 stars: <50%
- Handles edge case of maxScore = 0

---

## Component Testing Requirements (PHASE 5)

Components require browser testing. For each component task:

### Task 5.1.1: Implement LetterBox Component

**Status:** ⏳ TODO

**Implementation Prompt:**
Complete the LetterBox Web Component in `src/components/LetterBox.ts`. This is a single-letter input box with visual feedback.

**Step-by-Step Instructions:**

(See detailed implementation in LetterBox.ts file with TODOs)

**Test Requirements:**

```javascript
// Browser console test - after implementing component

// Test 1: Component registers
console.assert(customElements.get('letter-box') !== undefined, 'letter-box should be registered');

// Test 2: Can create element
const box = document.createElement('letter-box');
document.body.appendChild(box);
console.assert(box.shadowRoot !== null, 'Should have shadow root');

// Test 3: Set correct letter
box.setAttribute('letter', 'D');
box.setAttribute('position', '0');

// Type 'd' - should mark correct
const input = box.shadowRoot.querySelector('input');
input.value = 'd';
input.dispatchEvent(new Event('input'));
// Expected: Box turns green, shows animation

// Test 4: Incorrect letter
box.setAttribute('letter', 'R');
input.value = 'x';
input.dispatchEvent(new Event('input'));
// Expected: Box shakes, turns red briefly

// Test 5: Reveal method
box.reveal();
// Expected: Letter 'R' appears, box is disabled

// Test 6: Custom events
box.addEventListener('letter-correct', (e) => {
  console.log('✅ Correct event fired:', e.detail);
});
box.addEventListener('letter-incorrect', () => {
  console.log('❌ Incorrect event fired');
});

// Test 7: Keyboard navigation
// Set up 3 boxes
const container = document.createElement('div');
['D', 'R', 'A'].forEach((letter, i) => {
  const b = document.createElement('letter-box');
  b.setAttribute('letter', letter);
  b.setAttribute('position', i.toString());
  container.appendChild(b);
});
document.body.appendChild(container);

// Type in first box - should auto-focus next
const firstBox = container.children[0];
const firstInput = firstBox.shadowRoot.querySelector('input');
firstInput.value = 'd';
firstInput.dispatchEvent(new Event('input'));
// Expected: Second box should gain focus

// Test 8: Backspace navigation
const secondBox = container.children[1];
const secondInput = secondBox.shadowRoot.querySelector('input');
secondInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
// Expected: Focus should go back to first box
```

**Visual Testing:**

1. Open browser dev tools
2. Create test page:

```html
<!DOCTYPE html>
<html>
<body>
  <script type="module">
    import './src/components/LetterBox.ts';

    // Create a word "CAT"
    const word = ['C', 'A', 'T'];
    word.forEach((letter, i) => {
      const box = document.createElement('letter-box');
      box.setAttribute('letter', letter);
      box.setAttribute('position', i.toString());
      document.body.appendChild(box);
    });
  </script>
</body>
</html>
```

3. Test interactions:
   - Type correct letters - should turn green
   - Type incorrect letters - should shake and turn red
   - Use backspace - should navigate backwards
   - Press reveal on first box - should show letter

**Expected Behavior:**

- ✅ Renders as input box
- ✅ Single character input only
- ✅ Correct letter: green border, animation, disabled, custom event
- ✅ Incorrect letter: red flash, shake animation, stays enabled
- ✅ Reveal: shows letter, disables input, yellow/gold color
- ✅ Tab/Enter/Arrow keys navigate between boxes
- ✅ Backspace on empty navigates to previous
- ✅ Auto-uppercase input
- ✅ Custom events: letter-correct, letter-incorrect, focus-previous

---

## Integration Testing (PHASE 8)

### Task 8.3: Test Complete Application Flow

**Status:** ⏳ TODO

**Test Requirements:**

```bash
# 1. Build project
npm run build

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000

# Manual Test Flow:
```

**Test Case 1: First Launch**
```
1. Open app for first time
Expected: Title screen appears with theme cards

2. Click "Fantasy Kingdom" theme
Expected: Navigate to level select screen

3. Verify levels shown
Expected: Level 1 unlocked, Level 2-5 locked

4. Click Level 1
Expected: Navigate to game screen
```

**Test Case 2: Gameplay**
```
1. On game screen, wait for word announcement
Expected: Hear word spoken, then sentence

2. Type correct letters
Expected: Each letter turns green, advances automatically

3. Complete word
Expected: Celebration modal shows points earned

4. Click Continue
Expected: Next word loads

5. Click Help button
Expected: All letters revealed, auto-advance after delay
```

**Test Case 3: Progress Saving**
```
1. Complete 3 words in Level 1
2. Close browser tab
3. Reopen app
Expected: "Continue Game" button appears

4. Click Continue
Expected: Resume at Level 1, Word 4
```

**Test Case 4: Level Completion**
```
1. Complete all words in a level
Expected: Level complete modal with star rating

2. Return to level select
Expected: Level shows completed with stars, Level 2 is now unlocked
```

**Test Case 5: Error Handling**
```
1. Disable JavaScript in browser
Expected: "JavaScript Required" message appears

2. Re-enable JavaScript
3. Block localStorage
Expected: Game works, just doesn't save progress

4. Disable audio
Expected: No sounds, but game still playable
```

**Test Case 6: Keyboard Navigation**
```
1. On title screen, press Tab
Expected: Focus visible on theme cards

2. Press Enter on focused card
Expected: Navigate to level select

3. In game, use arrow keys
Expected: Navigate between letter boxes

4. Press Backspace on first letter (empty)
Expected: Nothing happens (can't go back further)
```

**Test Case 7: Mobile**
```
1. Open on mobile device or use mobile emulation
Expected: Layout adjusts for small screen

2. Tap letter boxes
Expected: Virtual keyboard appears

3. Type letters
Expected: Same functionality as desktop
```

---

## Test Checklist Summary

For the implementer to mark off as they complete tasks:

### Types (All must compile with `npm run typecheck`)
- [ ] Word interface defined
- [ ] Level interface defined
- [ ] Theme interface defined
- [ ] GameState interface defined
- [ ] SavedProgress interfaces defined
- [ ] Service types defined
- [ ] Router types defined

### Services (Test in browser console)
- [ ] StorageService.getProgress() returns default when empty
- [ ] StorageService.getProgress() loads existing data
- [ ] StorageService.saveProgress() persists data
- [ ] SpeechService.speak() works with audio
- [ ] SpeechService.speakWord() sounds different from speak()
- [ ] SpeechService.speakLetter() uses phonetic names
- [ ] AudioService.play() plays sounds
- [ ] GameStateManager.setState() updates state
- [ ] GameStateManager.subscribe() notifies listeners
- [ ] Router.navigate() changes URL hash
- [ ] Router parses hash correctly

### Utilities (Unit test with console.assert)
- [ ] calculatePoints() returns correct values
- [ ] getLevelMultiplier() has correct multipliers
- [ ] calculateStars() gives right star ratings

### Components (Visual browser testing)
- [ ] LetterBox renders and accepts input
- [ ] LetterBox marks correct/incorrect
- [ ] LetterBox reveals letter on help
- [ ] LetterBoxes creates multiple boxes
- [ ] LetterBoxes handles focus navigation
- [ ] WordDisplay shows word prompt
- [ ] CelebrationModal shows and animates
- [ ] GameHeader displays score
- [ ] TitleScreen shows themes
- [ ] LevelSelect shows levels
- [ ] GameScreen coordinates gameplay

### Integration (End-to-end flow)
- [ ] Can select theme from title screen
- [ ] Can select level from level select
- [ ] Game starts and announces word
- [ ] Typing letters gives feedback
- [ ] Word completion shows celebration
- [ ] Progress saves and loads
- [ ] Level completion unlocks next level
- [ ] Navigation (back button) works
- [ ] Works on mobile/tablet
- [ ] Keyboard navigation works

---

## Quick Testing Commands Reference

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Test build
npm run preview

# Build word lists
node scripts/build-words.js

# Run specific test file
npx tsx test-file.ts

# Check bundle size
npm run build && ls -lh dist/assets/
```

---

## Debugging Tips

### TypeScript Errors
```bash
# See all type errors
npm run typecheck

# See errors for specific file
npx tsc --noEmit src/services/SpeechService.ts
```

### Runtime Errors
```javascript
// In browser console, see all errors
// Enable verbose logging
localStorage.setItem('debug', 'true');

// Clear all data
localStorage.clear();
```

### Component Not Rendering
```javascript
// Check if registered
console.log(customElements.get('letter-box'));

// Check shadow root
const el = document.querySelector('letter-box');
console.log(el.shadowRoot);

// Check for errors in console
```

### Speech Not Working
```javascript
// Check API availability
console.log('speechSynthesis' in window);

// List available voices
speechSynthesis.getVoices().forEach(v => console.log(v.name));

// Test directly
const utterance = new SpeechSynthesisUtterance('test');
speechSynthesis.speak(utterance);
```

---

## Success Criteria for "Done"

A task is complete when:

1. ✅ Code compiles without TypeScript errors
2. ✅ All test cases pass
3. ✅ No console errors in browser
4. ✅ Expected behavior matches specification
5. ✅ Visual appearance is correct (for UI components)
6. ✅ Accessibility works (keyboard navigation, screen readers)
7. ✅ Mobile responsive (for UI components)
8. ✅ Code follows patterns in stub files

---

**This detailed task list ensures every piece has clear success criteria. Use it as a checklist and reference guide throughout implementation!**
