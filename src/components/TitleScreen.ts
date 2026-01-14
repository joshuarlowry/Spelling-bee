/**
 * TitleScreen Component
 *
 * Main menu showing available themes.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render and load themes
 * 4. Implement render() - create title screen template
 * 5. Implement loadThemes() - fetch available themes
 * 6. Implement createThemeCards() - create cards for each theme
 * 7. Handle theme selection
 * 8. Show "Continue Game" button if save exists
 * 9. Register custom element
 */

import { wordLoaderService } from '../services/WordLoaderService';
import { storageService } from '../services/StorageService';
import { router } from '../services/Router';
import { audioService } from '../services/AudioService';

export class TitleScreen extends HTMLElement {
  private wordLoaderService = wordLoaderService;
  private storageService = storageService;
  private router = router;
  private audioService = audioService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.loadThemes();
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

        .title-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          font-size: 48px;
          font-weight: bold;
          color: white;
          text-align: center;
          margin: 40px 0 20px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .subtitle {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          margin-bottom: 40px;
        }

        .themes-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          max-width: 1200px;
          width: 100%;
          margin-bottom: 40px;
        }

        .theme-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .theme-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .theme-card:active {
          transform: translateY(-4px);
        }

        .theme-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .theme-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        .theme-description {
          font-size: 14px;
          color: #666;
          margin: 8px 0 0 0;
        }

        .continue-button {
          margin-top: 20px;
          padding: 14px 32px;
          font-size: 18px;
          font-weight: bold;
          background: white;
          color: #667eea;
          border: 3px solid white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .continue-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .continue-button:active {
          transform: scale(0.95);
        }

        .continue-button.hidden {
          display: none;
        }
      </style>
      <div class="title-screen">
        <h1 class="title">🐝 SPELLING BEE ADVENTURE 🐝</h1>
        <p class="subtitle">Choose Your Adventure</p>
        <div class="themes-container"></div>
        <button class="continue-button hidden">Continue Game</button>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  private async loadThemes() {
    const themesContainer = this.shadowRoot?.querySelector('.themes-container');
    if (!themesContainer) return;

    try {
      const themeIds = this.wordLoaderService.getThemeList();

      for (const themeId of themeIds) {
        const wordList = await this.wordLoaderService.loadTheme(themeId);
        const totalWords = wordList.levels.reduce((sum, level) => sum + (level.words?.length || 0), 0);

        const card = document.createElement('div');
        card.className = 'theme-card';
        card.innerHTML = `
          <div class="theme-icon">${this.getThemeIcon(themeId)}</div>
          <h2 class="theme-name">${this.capitalize(themeId)}</h2>
          <p class="theme-description">${wordList.theme.description || `${totalWords} words`}</p>
        `;

        card.addEventListener('click', () => this.handleThemeSelect(themeId));
        themesContainer.appendChild(card);
      }

      // Check for saved game
      const progress = this.storageService.getProgress();
      if (progress && Object.keys(progress.themes).length > 0) {
        const continueBtn = this.shadowRoot?.querySelector('.continue-button');
        if (continueBtn) {
          continueBtn.classList.remove('hidden');
          continueBtn.addEventListener('click', () => this.handleContinue());
        }
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  }

  private handleThemeSelect(themeId: string) {
    this.audioService.play('click');
    this.router.navigate('levels', { theme: themeId });
  }

  private handleContinue() {
    const progress = this.storageService.getProgress();
    if (!progress) return;

    const themeKeys = Object.keys(progress.themes);
    if (themeKeys.length === 0) return;

    const lastTheme = themeKeys[themeKeys.length - 1] || '';
    if (!lastTheme) return;
    const themeProgress = progress.themes[lastTheme];
    if (!themeProgress) return;
    const level = themeProgress.currentLevel || 1;

    this.audioService.play('click');
    this.router.navigate('game', { theme: lastTheme, level });
  }

  private getThemeIcon(themeId: string): string {
    const icons: Record<string, string> = {
      fantasy: '🧙‍♂️',
      scifi: '🚀',
      animals: '🦁',
      food: '🍕',
      nature: '🌲',
      sports: '⚽',
    };
    return icons[themeId] || '✨';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

customElements.define('title-screen', TitleScreen);
