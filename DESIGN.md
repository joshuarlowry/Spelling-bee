# Spelling Bee Game - Design Document

## Overview

This document outlines the technical architecture and implementation strategy for the Spelling Bee game, a browser-based educational spelling application for children. The application will be deployed on Vercel as a static site with client-side rendering.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Static Assets (CDN)                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │  HTML   │  │   JS    │  │   CSS   │  │  Audio  │    │   │
│  │  │         │  │ Bundle  │  │ Bundle  │  │  Files  │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Word Data (YAML → JSON)                │   │
│  │           /api/words/fantasy.json                        │   │
│  │           /api/words/scifi.json                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   Application    │  │   Browser APIs   │                    │
│  │   ┌──────────┐   │  │  ┌────────────┐  │                    │
│  │   │  State   │   │  │  │   Speech   │  │                    │
│  │   │ Manager  │   │  │  │ Synthesis  │  │                    │
│  │   └──────────┘   │  │  └────────────┘  │                    │
│  │   ┌──────────┐   │  │  ┌────────────┐  │                    │
│  │   │  Router  │   │  │  │   Audio    │  │                    │
│  │   │          │   │  │  │  Context   │  │                    │
│  │   └──────────┘   │  │  └────────────┘  │                    │
│  │   ┌──────────┐   │  │  ┌────────────┐  │                    │
│  │   │   View   │   │  │  │   Local    │  │                    │
│  │   │  Layer   │   │  │  │  Storage   │  │                    │
│  │   └──────────┘   │  │  └────────────┘  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Static-First**: No server-side logic required; fully static deployment
2. **Offline-Capable**: Service worker for offline play after initial load
3. **Zero Dependencies on External APIs**: All functionality runs client-side
4. **Progressive Enhancement**: Core functionality works without JavaScript features like Speech API

---

## Technology Stack

### Core Technologies

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Build Tool | **Vite** | Fast builds, native ES modules, excellent DX |
| Language | **TypeScript** | Type safety, better IDE support, fewer runtime errors |
| UI | **Vanilla JS + Web Components** | No framework overhead, fast load times, native browser APIs |
| Styling | **CSS Modules** | Scoped styles, no runtime cost, works with Vite |
| Data | **YAML → JSON** | Human-readable source, optimized delivery |
| Audio | **Web Speech API + Howler.js** | Native TTS + reliable sound effects |

### Why No Framework?

For a simple, performance-critical kids' game:
- Smaller bundle size (~50KB vs 100KB+ with React/Vue)
- Faster initial load (critical for impatient young users)
- No hydration overhead
- Web Components provide encapsulation without framework lock-in
- Simpler mental model for future maintainers

### Alternative Consideration

If team preference or future complexity warrants a framework:
- **Preact** (3KB) would be the choice - React API compatibility with minimal overhead

---

## Vercel Deployment Configuration

### Project Structure for Vercel

```
spelling-bee/
├── public/                    # Static assets (copied directly)
│   ├── audio/
│   │   ├── correct.mp3
│   │   ├── incorrect.mp3
│   │   ├── complete.mp3
│   │   └── click.mp3
│   ├── fonts/
│   │   ├── fredoka-one.woff2
│   │   └── nunito.woff2
│   ├── images/
│   │   ├── fantasy-bg.svg
│   │   └── scifi-bg.svg
│   └── favicon.ico
├── src/
│   ├── index.html             # Entry HTML
│   ├── main.ts                # Entry TypeScript
│   ├── app.ts                 # Main application
│   ├── styles/
│   ├── components/
│   ├── services/
│   └── types/
├── words/                     # Source YAML files
│   ├── fantasy.yaml
│   └── scifi.yaml
├── scripts/
│   └── build-words.js         # YAML → JSON converter
├── vercel.json                # Vercel configuration
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/audio/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/words/(.*).json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, stale-while-revalidate=86400"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!assets|audio|words|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
    // Optimize for kids' devices (tablets, older computers)
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
});
```

### package.json Scripts

```json
{
  "name": "spelling-bee",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "npm run build:words && vite",
    "build": "npm run build:words && vite build",
    "build:words": "node scripts/build-words.js",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "terser": "^5.26.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "js-yaml": "^4.1.0"
  },
  "dependencies": {
    "howler": "^2.2.4"
  }
}
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── TitleScreen
│   │   ├── ThemeCard (Fantasy)
│   │   └── ThemeCard (Sci-Fi)
│   │
│   ├── LevelSelect
│   │   ├── LevelCard[]
│   │   └── BackButton
│   │
│   └── GameScreen
│       ├── GameHeader
│       │   ├── BackButton
│       │   ├── LevelInfo
│       │   └── ScoreDisplay
│       │
│       ├── WordDisplay
│       │   ├── SpeakerButton
│       │   └── SentenceText
│       │
│       ├── LetterBoxes
│       │   └── LetterBox[]
│       │
│       ├── ActionButtons
│       │   ├── HearAgainButton
│       │   └── HelpButton
│       │
│       └── CelebrationModal
│
└── Services (singleton instances)
    ├── SpeechService
    ├── AudioService
    ├── StorageService
    └── GameStateManager
```

### Web Component Example

```typescript
// src/components/LetterBox.ts

export class LetterBox extends HTMLElement {
  private input: HTMLInputElement;
  private correctLetter: string;
  private isRevealed: boolean = false;

  static get observedAttributes() {
    return ['letter', 'index', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .letter-box {
          width: 3rem;
          height: 3.5rem;
          border: 3px solid var(--color-border, #e0e0e0);
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .letter-box:focus-within {
          border-color: var(--color-primary, #6C63FF);
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
        }

        .letter-box.correct {
          background: linear-gradient(135deg, #4CAF50, #81C784);
          border-color: #4CAF50;
          animation: pop 0.3s ease-out;
        }

        .letter-box.incorrect {
          animation: shake 0.3s ease-out;
          background: #FFEBEE;
          border-color: #FF6B6B;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          text-align: center;
          font-family: 'Fredoka One', cursive;
          font-size: 1.5rem;
          text-transform: uppercase;
          color: var(--color-text, #2D3436);
          outline: none;
        }

        .correct input {
          color: white;
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      </style>

      <div class="letter-box">
        <input
          type="text"
          maxlength="1"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
    `;

    this.input = this.shadowRoot!.querySelector('input')!;
  }

  private setupEventListeners() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    if (!value) return;

    if (value === this.correctLetter) {
      this.markCorrect();
      this.dispatchEvent(new CustomEvent('letter-correct', {
        bubbles: true,
        detail: { index: this.index, letter: value }
      }));
    } else {
      this.markIncorrect();
      this.dispatchEvent(new CustomEvent('letter-incorrect', {
        bubbles: true,
        detail: { index: this.index, letter: value }
      }));
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' && !this.input.value) {
      this.dispatchEvent(new CustomEvent('focus-previous', {
        bubbles: true,
        detail: { index: this.index }
      }));
    }
  }

  private markCorrect() {
    const box = this.shadowRoot!.querySelector('.letter-box')!;
    box.classList.add('correct');
    this.input.value = this.correctLetter.toUpperCase();
    this.input.disabled = true;
    this.isRevealed = true;
  }

  private markIncorrect() {
    const box = this.shadowRoot!.querySelector('.letter-box')!;
    box.classList.add('incorrect');

    setTimeout(() => {
      box.classList.remove('incorrect');
      this.input.value = '';
      this.input.focus();
    }, 300);
  }

  reveal() {
    this.markCorrect();
  }

  focus() {
    this.input.focus();
  }

  get index(): number {
    return parseInt(this.getAttribute('index') || '0');
  }

  set letter(value: string) {
    this.correctLetter = value.toLowerCase();
  }
}

customElements.define('letter-box', LetterBox);
```

---

## State Management

### Application State

```typescript
// src/types/state.ts

interface GameState {
  // Current session
  currentTheme: 'fantasy' | 'scifi' | null;
  currentLevel: number;
  currentWordIndex: number;
  sessionScore: number;

  // Current word state
  currentWord: Word | null;
  revealedLetters: boolean[];
  helpUsed: boolean;

  // Queue management
  reshuffleQueue: Word[];
  inReshuffleMode: boolean;
}

interface SavedProgress {
  version: number;
  lastPlayed: string;
  themes: {
    [themeId: string]: ThemeProgress;
  };
  settings: UserSettings;
}

interface ThemeProgress {
  currentLevel: number;
  totalScore: number;
  levels: {
    [levelNum: number]: LevelProgress;
  };
}

interface LevelProgress {
  completed: boolean;
  score: number;
  stars: 0 | 1 | 2 | 3;
  wordsHelped: string[];
}

interface UserSettings {
  soundEnabled: boolean;
  speechEnabled: boolean;
  speechRate: number;
}
```

### State Manager

```typescript
// src/services/GameStateManager.ts

import { StorageService } from './StorageService';

type StateListener = (state: GameState) => void;

class GameStateManager {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
    this.state = this.getInitialState();
  }

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

  getState(): Readonly<GameState> {
    return Object.freeze({ ...this.state });
  }

  setState(partial: Partial<GameState>) {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Game actions
  startGame(themeId: string, level: number) {
    const savedProgress = this.storage.getProgress();
    this.setState({
      currentTheme: themeId as 'fantasy' | 'scifi',
      currentLevel: level,
      currentWordIndex: 0,
      sessionScore: savedProgress?.themes[themeId]?.levels[level]?.score || 0,
      reshuffleQueue: [],
      inReshuffleMode: false,
    });
  }

  setCurrentWord(word: Word) {
    this.setState({
      currentWord: word,
      revealedLetters: new Array(word.word.length).fill(false),
      helpUsed: false,
    });
  }

  markLetterRevealed(index: number) {
    const revealed = [...this.state.revealedLetters];
    revealed[index] = true;
    this.setState({ revealedLetters: revealed });
  }

  useHelp() {
    if (this.state.currentWord && !this.state.helpUsed) {
      this.setState({ helpUsed: true });
      // Add to reshuffle queue
      this.setState({
        reshuffleQueue: [...this.state.reshuffleQueue, this.state.currentWord]
      });
    }
  }

  completeWord(pointsEarned: number) {
    const newScore = this.state.sessionScore + pointsEarned;
    this.setState({ sessionScore: newScore });
    this.saveProgress();
  }

  private saveProgress() {
    const { currentTheme, currentLevel, sessionScore } = this.state;
    if (!currentTheme) return;

    this.storage.updateLevelProgress(currentTheme, currentLevel, {
      score: sessionScore,
    });
  }
}

export const gameState = new GameStateManager();
```

---

## Services

### Speech Service

```typescript
// src/services/SpeechService.ts

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  onBoundary?: (charIndex: number) => void;
}

class SpeechService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private ready: Promise<void>;

  constructor() {
    this.synth = window.speechSynthesis;
    this.ready = this.initVoice();
  }

  private async initVoice(): Promise<void> {
    // Wait for voices to load (Chrome loads async)
    await new Promise<void>(resolve => {
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }
      this.synth.onvoiceschanged = () => resolve();
    });

    const voices = this.synth.getVoices();

    // Priority list of natural-sounding voices
    const preferred = [
      'Google UK English Female',
      'Google US English',
      'Samantha',                    // macOS
      'Microsoft Aria Online',       // Edge
      'Microsoft Jenny Online',      // Edge
      'Karen',                       // macOS
      'Moira',                       // macOS (Irish)
      'Tessa',                       // macOS (South African)
    ];

    for (const name of preferred) {
      const found = voices.find(v => v.name.includes(name));
      if (found) {
        this.voice = found;
        console.log(`Selected voice: ${found.name}`);
        break;
      }
    }

    // Fallback: any female English voice, then any English voice
    if (!this.voice) {
      this.voice = voices.find(v =>
        v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    await this.ready;

    // Cancel any ongoing speech
    this.synth.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.rate = options.rate ?? 0.85;
      utterance.pitch = options.pitch ?? 1.1;
      utterance.volume = 1.0;

      if (options.onBoundary) {
        utterance.onboundary = (event) => {
          options.onBoundary!(event.charIndex);
        };
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        // Don't reject on interruption (user clicked something)
        if (e.error === 'interrupted') {
          resolve();
        } else {
          reject(e);
        }
      };

      this.synth.speak(utterance);
    });
  }

  async speakWord(word: string): Promise<void> {
    await this.speak(`Spell the word: ${word}`, { rate: 0.85, pitch: 1.1 });
  }

  async speakSentence(sentence: string): Promise<void> {
    await this.speak(sentence, { rate: 0.85, pitch: 1.0 });
  }

  async speakLetter(letter: string): Promise<void> {
    // Speak the letter name clearly
    const phonetic = this.getPhoneticLetter(letter);
    await this.speak(phonetic, { rate: 0.7, pitch: 1.0 });
  }

  private getPhoneticLetter(letter: string): string {
    // Help distinguish similar-sounding letters
    const phonetics: Record<string, string> = {
      'a': 'A',
      'b': 'B',
      'c': 'C',
      'd': 'D',
      'e': 'E',
      'f': 'F',
      'g': 'G',
      'h': 'H',
      'i': 'I',
      'j': 'J',
      'k': 'K',
      'l': 'L',
      'm': 'M',
      'n': 'N',
      'o': 'O',
      'p': 'P',
      'q': 'Q',
      'r': 'R',
      's': 'S',
      't': 'T',
      'u': 'U',
      'v': 'V',
      'w': 'W',
      'x': 'X',
      'y': 'Y',
      'z': 'Z',
    };
    return phonetics[letter.toLowerCase()] || letter;
  }

  stop() {
    this.synth.cancel();
  }

  get isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();
```

### Audio Service

```typescript
// src/services/AudioService.ts

import { Howl, Howler } from 'howler';

type SoundName = 'correct' | 'incorrect' | 'complete' | 'levelup' | 'click';

class AudioService {
  private sounds: Map<SoundName, Howl> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds() {
    const soundFiles: Record<SoundName, string> = {
      correct: '/audio/correct.mp3',
      incorrect: '/audio/incorrect.mp3',
      complete: '/audio/complete.mp3',
      levelup: '/audio/levelup.mp3',
      click: '/audio/click.mp3',
    };

    for (const [name, src] of Object.entries(soundFiles)) {
      this.sounds.set(name as SoundName, new Howl({
        src: [src],
        preload: true,
        volume: name === 'incorrect' ? 0.5 : 0.7, // Softer error sound
      }));
    }
  }

  play(sound: SoundName) {
    if (!this.enabled) return;

    const howl = this.sounds.get(sound);
    if (howl) {
      howl.play();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    Howler.mute(!enabled);
  }

  get isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioService = new AudioService();
```

### Storage Service

```typescript
// src/services/StorageService.ts

const STORAGE_KEY = 'spellingBee_saveState';
const STORAGE_VERSION = 1;

class StorageService {
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

  getProgress(): SavedProgress | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data) as SavedProgress;

      // Handle version migrations
      if (parsed.version !== STORAGE_VERSION) {
        return this.migrateProgress(parsed);
      }

      return parsed;
    } catch (e) {
      console.error('Failed to load progress:', e);
      return null;
    }
  }

  saveProgress(progress: SavedProgress) {
    try {
      progress.lastPlayed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  updateLevelProgress(
    themeId: string,
    level: number,
    update: Partial<LevelProgress>
  ) {
    const progress = this.getProgress() || this.getDefaultProgress();

    if (!progress.themes[themeId]) {
      progress.themes[themeId] = {
        currentLevel: 1,
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

    Object.assign(progress.themes[themeId].levels[level], update);

    // Recalculate total score
    progress.themes[themeId].totalScore = Object.values(
      progress.themes[themeId].levels
    ).reduce((sum, lvl) => sum + lvl.score, 0);

    this.saveProgress(progress);
  }

  updateSettings(settings: Partial<UserSettings>) {
    const progress = this.getProgress() || this.getDefaultProgress();
    Object.assign(progress.settings, settings);
    this.saveProgress(progress);
  }

  clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  private migrateProgress(old: SavedProgress): SavedProgress {
    // Handle future version migrations here
    return { ...this.getDefaultProgress(), ...old, version: STORAGE_VERSION };
  }
}

export const storageService = new StorageService();
```

---

## Routing

### Simple Hash Router

```typescript
// src/services/Router.ts

type Route = 'title' | 'levels' | 'game';

interface RouteParams {
  theme?: string;
  level?: number;
}

type RouteHandler = (params: RouteParams) => void;

class Router {
  private routes: Map<Route, RouteHandler> = new Map();
  private currentRoute: Route = 'title';

  constructor() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  register(route: Route, handler: RouteHandler) {
    this.routes.set(route, handler);
  }

  navigate(route: Route, params: RouteParams = {}) {
    const hash = this.buildHash(route, params);
    window.location.hash = hash;
  }

  private buildHash(route: Route, params: RouteParams): string {
    switch (route) {
      case 'title':
        return '#/';
      case 'levels':
        return `#/theme/${params.theme}`;
      case 'game':
        return `#/theme/${params.theme}/level/${params.level}`;
      default:
        return '#/';
    }
  }

  private handleRoute() {
    const hash = window.location.hash || '#/';
    const { route, params } = this.parseHash(hash);

    this.currentRoute = route;
    const handler = this.routes.get(route);
    if (handler) {
      handler(params);
    }
  }

  private parseHash(hash: string): { route: Route; params: RouteParams } {
    // #/theme/fantasy/level/2
    const match = hash.match(/^#\/(?:theme\/(\w+)(?:\/level\/(\d+))?)?$/);

    if (!match) {
      return { route: 'title', params: {} };
    }

    const [, theme, level] = match;

    if (level) {
      return {
        route: 'game',
        params: { theme, level: parseInt(level) }
      };
    }

    if (theme) {
      return { route: 'levels', params: { theme } };
    }

    return { route: 'title', params: {} };
  }

  get current(): Route {
    return this.currentRoute;
  }
}

export const router = new Router();
```

---

## Build Pipeline

### Word List Compilation

```javascript
// scripts/build-words.js

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wordsDir = path.join(__dirname, '../words');
const outputDir = path.join(__dirname, '../public/words');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process each YAML file
const yamlFiles = fs.readdirSync(wordsDir).filter(f => f.endsWith('.yaml'));

for (const file of yamlFiles) {
  const inputPath = path.join(wordsDir, file);
  const outputPath = path.join(outputDir, file.replace('.yaml', '.json'));

  const content = fs.readFileSync(inputPath, 'utf8');
  const data = yaml.load(content);

  // Validate structure
  if (!data.theme || !data.levels) {
    console.error(`Invalid structure in ${file}`);
    process.exit(1);
  }

  // Validate words
  for (const level of data.levels) {
    for (const wordEntry of level.words) {
      if (!wordEntry.word || !wordEntry.sentence) {
        console.error(`Missing word/sentence in ${file}, level ${level.level}`);
        process.exit(1);
      }
      // Ensure sentence contains the word
      if (!wordEntry.sentence.toLowerCase().includes(wordEntry.word.toLowerCase())) {
        console.warn(`Warning: Sentence doesn't contain word "${wordEntry.word}" in ${file}`);
      }
    }
  }

  // Write optimized JSON
  fs.writeFileSync(outputPath, JSON.stringify(data));
  console.log(`Built: ${file} → ${path.basename(outputPath)}`);
}

console.log('Word lists compiled successfully!');
```

### CI/CD with Vercel

```yaml
# .github/workflows/ci.yml (optional, Vercel auto-deploys)

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
```

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| First Contentful Paint | < 1.5s | Inline critical CSS, preload fonts |
| Largest Contentful Paint | < 2.5s | Optimize hero images, lazy load non-critical |
| Time to Interactive | < 3.0s | Minimal JS, code split by route |
| Total Bundle Size | < 100KB (gzipped) | No framework, tree-shake Howler |
| Lighthouse Performance | > 90 | Follow all Core Web Vitals best practices |

### Optimization Strategies

1. **Critical CSS Inlining**: Title screen styles inlined in HTML
2. **Font Loading**: Use `font-display: swap`, preload primary font
3. **Audio Lazy Loading**: Load sounds after initial render
4. **Word Data Caching**: Cache JSON files in service worker
5. **Image Optimization**: SVG backgrounds, WebP with PNG fallback

---

## Error Handling

### Graceful Degradation

```typescript
// src/utils/featureDetection.ts

export const features = {
  speechSynthesis: 'speechSynthesis' in window,
  localStorage: (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  })(),
  webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
};

// Fallback messages
export function showFeatureWarning(feature: string) {
  const warnings: Record<string, string> = {
    speechSynthesis: 'Voice is not available. Words will be shown on screen.',
    localStorage: 'Progress cannot be saved in this browser.',
  };

  // Show non-intrusive toast notification
  console.warn(warnings[feature]);
}
```

### Error Boundary Pattern

```typescript
// src/utils/errorHandler.ts

export function initErrorHandling() {
  window.onerror = (msg, url, line, col, error) => {
    console.error('Global error:', { msg, url, line, col, error });
    // Don't crash the game - show friendly message
    showErrorToast('Oops! Something went wrong. Try refreshing the page.');
    return true; // Prevent default handling
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't crash on async errors
    event.preventDefault();
  };
}

function showErrorToast(message: string) {
  // Non-intrusive error notification
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// src/services/__tests__/StorageService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../StorageService';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  it('returns null when no progress exists', () => {
    expect(service.getProgress()).toBeNull();
  });

  it('saves and retrieves progress', () => {
    service.updateLevelProgress('fantasy', 1, { score: 100 });
    const progress = service.getProgress();

    expect(progress?.themes.fantasy.levels[1].score).toBe(100);
  });

  it('calculates total score correctly', () => {
    service.updateLevelProgress('fantasy', 1, { score: 100 });
    service.updateLevelProgress('fantasy', 2, { score: 150 });

    const progress = service.getProgress();
    expect(progress?.themes.fantasy.totalScore).toBe(250);
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/game.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Spelling Bee Game', () => {
  test('completes a word successfully', async ({ page }) => {
    await page.goto('/');

    // Select Fantasy theme
    await page.click('text=Fantasy Kingdom');

    // Start Level 1
    await page.click('text=The Enchanted Forest');

    // Wait for word to be announced
    await page.waitForSelector('.letter-box');

    // Type correct letters (assuming first word is "cat")
    const letterBoxes = page.locator('letter-box');
    await letterBoxes.nth(0).locator('input').fill('c');
    await letterBoxes.nth(1).locator('input').fill('a');
    await letterBoxes.nth(2).locator('input').fill('t');

    // Check for celebration
    await expect(page.locator('.celebration-modal')).toBeVisible();
  });

  test('help button reveals letters', async ({ page }) => {
    await page.goto('/#/theme/fantasy/level/1');

    // Click help button
    await page.click('text=Help Me');

    // All letters should be revealed
    const letterBoxes = page.locator('letter-box.correct');
    await expect(letterBoxes).toHaveCount(3); // "cat" = 3 letters
  });
});
```

---

## Security Considerations

1. **No sensitive data**: Game stores only scores locally
2. **Content Security Policy**: Strict CSP headers via Vercel config
3. **Input sanitization**: Letter inputs restricted to single characters
4. **No external API calls**: Fully static, no data exfiltration risk

### CSP Header (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'"
        }
      ]
    }
  ]
}
```

---

## Monitoring (Post-Launch)

- **Vercel Analytics**: Built-in performance monitoring (free tier)
- **Error Tracking**: Consider Sentry free tier if issues arise
- **Usage Patterns**: Simple analytics via Vercel Web Analytics

---

## Summary

This design prioritizes:
- **Speed**: Static deployment, minimal JS, optimized assets
- **Reliability**: Graceful degradation, offline capability
- **Simplicity**: No framework overhead, standard web APIs
- **Maintainability**: TypeScript, clear architecture, comprehensive tests

The Vercel deployment provides automatic HTTPS, global CDN, and zero-config deploys from Git pushes.
