/**
 * GameScreen Component
 *
 * Main game screen where spelling happens.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render and start game
 * 4. Implement render() - create game screen template
 * 5. Implement startGame() - initialize level
 * 6. Implement loadWord() - loads current word
 * 7. Implement announceWord() - speaks word and sentence
 * 8. Handle letter input events
 * 9. Handle word completion
 * 10. Handle help button
 * 11. Handle hear again button
 * 12. Calculate points
 * 13. Check level completion
 * 14. Register custom element
 */

import { wordLoaderService } from '../services/WordLoaderService';
import { gameState } from '../services/GameStateManager';
import { storageService } from '../services/StorageService';
import { router } from '../services/Router';
import { speechService } from '../services/SpeechService';
import { audioService } from '../services/AudioService';
import { LetterBoxes } from './LetterBoxes';
import { calculatePoints, calculateStars } from '../utils/helpers';

export class GameScreen extends HTMLElement {
  private themeId: string = '';
  private levelNum: number = 1;
  private words: any[] = [];
  private currentWordIndex: number = 0;
  private letterBoxes: LetterBoxes | null = null;

  private wordLoaderService = wordLoaderService;
  private gameStateManager = gameState;
  private storageService = storageService;
  private router = router;
  private speechService = speechService;
  private audioService = audioService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.themeId = this.getAttribute('theme-id') || '';
    this.levelNum = parseInt(this.getAttribute('level') || '1');
    this.render();
    this.setupEventListeners();
    this.startGame();
  }

  private render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
        }

        .game-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        game-header {
          margin-bottom: 20px;
        }

        word-display {
          margin-bottom: 20px;
        }

        .letter-boxes-area {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .letter-boxes-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        hear-again-button,
        help-button {
          display: block;
        }
      </style>
      <div class="game-screen">
        <game-header></game-header>
        <word-display></word-display>
        <div class="letter-boxes-area"></div>
        <div class="action-buttons">
          <hear-again-button></hear-again-button>
          <help-button></help-button>
        </div>
        <celebration-modal></celebration-modal>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  private setupEventListeners() {
    // Listen for custom events
    this.addEventListener('word-complete', () => this.handleWordComplete());
    this.addEventListener('help-requested', () => this.handleHelp());
    this.addEventListener('hear-again', () => this.handleHearAgain());
    this.addEventListener('back', () => this.handleBack());
    this.addEventListener('continue', () => this.moveToNextWord());
  }

  private async startGame() {
    try {
      const theme = await this.wordLoaderService.loadTheme(this.themeId);
      this.words = theme.words || [];

      this.gameState.startGame(this.themeId, this.levelNum);

      const header = this.shadowRoot?.querySelector('game-header') as any;
      if (header) {
        header.updateProgress(1, this.words.length);
      }

      this.loadWord();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  }

  private loadWord() {
    if (this.currentWordIndex >= this.words.length) {
      this.completeLevel();
      return;
    }

    const word = this.words[this.currentWordIndex];
    this.gameState.setCurrentWord(word);

    const wordDisplay = this.shadowRoot?.querySelector('word-display') as any;
    if (wordDisplay) {
      wordDisplay.setWord(word.word);
      wordDisplay.setSentence(word.sentence);
    }

    const letterBoxesArea = this.shadowRoot?.querySelector('.letter-boxes-area');
    if (letterBoxesArea) {
      // Clear previous boxes
      const prevContainer = letterBoxesArea.querySelector('.letter-boxes-container');
      if (prevContainer) {
        prevContainer.remove();
      }

      const container = document.createElement('div');
      container.className = 'letter-boxes-container';
      letterBoxesArea.appendChild(container);

      this.letterBoxes = new LetterBoxes(word.word, container);
    }

    const header = this.shadowRoot?.querySelector('game-header') as any;
    if (header) {
      header.updateProgress(this.currentWordIndex + 1, this.words.length);
    }

    this.announceWord(word);
  }

  private async announceWord(word: any) {
    await this.speechService.speakWord(word.word);
    await this.speechService.speakSentence(word.sentence);
  }

  private handleWordComplete() {
    const points = this.calculatePoints();
    const state = this.gameState.getState();

    this.gameState.completeWord(points);

    const header = this.shadowRoot?.querySelector('game-header') as any;
    if (header) {
      header.updateScore(state.sessionScore + points);
    }

    const modal = this.shadowRoot?.querySelector('celebration-modal') as any;
    if (modal) {
      modal.show(points);
    }
  }

  private handleHelp() {
    this.gameState.useHelp();

    if (this.letterBoxes) {
      this.letterBoxes.revealAll().then(() => {
        this.moveToNextWord();
      });
    }

    const helpBtn = this.shadowRoot?.querySelector('help-button') as any;
    if (helpBtn) {
      helpBtn.setDisabled(true);
    }
  }

  private handleHearAgain() {
    const state = this.gameState.getState();
    if (state.currentWord) {
      this.announceWord(state.currentWord);
    }
  }

  private calculatePoints(): number {
    const state = this.gameState.getState();
    if (!state.currentWord) return 0;

    return calculatePoints(
      this.levelNum,
      state.currentWord.word.length,
      0, // lettersTypedBeforeHelp - would need to track this
      state.helpUsed
    );
  }

  private moveToNextWord() {
    this.currentWordIndex++;

    if (this.currentWordIndex < this.words.length) {
      this.loadWord();
    } else {
      this.completeLevel();
    }
  }

  private completeLevel() {
    const state = this.gameState.getState();
    const score = state.sessionScore;
    const maxScore = this.words.length * 100; // Rough max
    const stars = calculateStars(score, maxScore);

    this.storageService.updateLevelProgress(this.themeId, this.levelNum, {
      score,
      stars,
    });

    this.audioService.play('levelup');

    // Show completion message after a short delay
    setTimeout(() => {
      alert(`Level ${this.levelNum} Complete!\nScore: ${score}\nStars: ${'⭐'.repeat(stars)}`);
      this.router.navigate('levels', { theme: this.themeId });
    }, 500);
  }

  private handleBack() {
    this.storageService.updateLevelProgress(this.themeId, this.levelNum, {
      score: this.gameState.getState().sessionScore,
    });

    this.router.navigate('levels', { theme: this.themeId });
  }
}

customElements.define('game-screen', GameScreen);
