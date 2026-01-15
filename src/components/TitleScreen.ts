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
          min-height: 100vh;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title-screen {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #ffc9e3 0%, #bae6fd 50%, #fef08a 100%);
          padding: 40px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .title-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.15) 0%, transparent 40%);
          pointer-events: none;
        }

        .title {
          font-size: 64px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(135deg, #ff3388 0%, #0ea5e9 50%, #facc15 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin: 40px 0 12px 0;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
          animation: titleBounce 2s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        @keyframes titleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .subtitle {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 48px;
          font-family: 'Nunito', sans-serif;
          position: relative;
          z-index: 1;
        }

        .themes-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          width: 100%;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .theme-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
          border-radius: 24px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          text-align: center;
          border: 4px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .theme-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transition: left 0.5s;
        }

        .theme-card:hover::before {
          left: 100%;
        }

        .theme-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 16px 40px rgba(255, 51, 136, 0.25);
          border-color: #ff3388;
        }

        .theme-card:active {
          transform: translateY(-8px) scale(0.98);
        }

        .theme-icon {
          font-size: 72px;
          margin-bottom: 16px;
          animation: iconFloat 3s ease-in-out infinite;
          display: block;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }

        .theme-name {
          font-size: 28px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .theme-description {
          font-size: 16px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
          font-family: 'Nunito', sans-serif;
        }

        .continue-button {
          margin-top: 20px;
          padding: 18px 40px;
          font-size: 20px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.5);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
          position: relative;
          z-index: 1;
        }

        .continue-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 32px rgba(34, 197, 94, 0.4);
        }

        .continue-button:active {
          transform: translateY(-2px) scale(1.02);
        }

        .continue-button.hidden {
          display: none;
        }
      </style>
      <div class="title-screen">
        <h1 class="title">🐝 SPELLING BEE 🐝</h1>
        <p class="subtitle">✨ Choose Your Adventure ✨</p>
        <div class="themes-container"></div>
        <button class="continue-button hidden">🎮 Continue Game</button>
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
