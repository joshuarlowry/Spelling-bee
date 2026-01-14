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
          min-height: 100vh;
        }

        .game-screen {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #ffc9e3 0%, #bae6fd 50%, #fef08a 100%);
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Decorative elements */
        .game-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        game-header {
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        word-display {
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .letter-boxes-area {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
          border-radius: 24px;
          padding: 40px 24px;
          margin-bottom: 32px;
          min-height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 4px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 1;
        }

        .letter-boxes-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding-top: 24px;
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
      const wordList = await this.wordLoaderService.loadTheme(this.themeId);
      // Get words from the selected level
      const level = wordList.levels[this.levelNum - 1];
      this.words = level?.words || [];

      this.gameStateManager.startGame(this.themeId, this.levelNum);

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
    this.gameStateManager.setCurrentWord(word);

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
    const state = this.gameStateManager.getState();

    this.gameStateManager.completeWord(points);

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
    this.gameStateManager.useHelp();

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
    const state = this.gameStateManager.getState();
    if (state.currentWord) {
      this.announceWord(state.currentWord);
    }
  }

  private calculatePoints(): number {
    const state = this.gameStateManager.getState();
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
    const state = this.gameStateManager.getState();
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
      score: this.gameStateManager.getState().sessionScore,
    });

    this.router.navigate('levels', { theme: this.themeId });
  }
}

customElements.define('game-screen', GameScreen);
