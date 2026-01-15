/**
 * LevelSelect Component
 *
 * Shows available levels for a theme.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM, accept theme ID
 * 3. Implement connectedCallback() - render and load levels
 * 4. Implement render() - create level select template
 * 5. Implement loadLevels() - fetch levels for theme
 * 6. Implement createLevelCards() - create cards for each level
 * 7. Calculate locked/unlocked state based on stars
 * 8. Handle level selection
 * 9. Handle back button
 * 10. Display total score
 * 11. Register custom element
 */

import { wordLoaderService } from '../services/WordLoaderService';
import { storageService } from '../services/StorageService';
import { router } from '../services/Router';
import { audioService } from '../services/AudioService';

export class LevelSelect extends HTMLElement {
  private themeId: string = '';
  private wordLoaderService = wordLoaderService;
  private storageService = storageService;
  private router = router;
  private audioService = audioService;
  private levelProgressMap: Record<number, any> = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.themeId = this.getAttribute('theme-id') || '';
    this.render();
    this.loadLevels();
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

        .level-select {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #ffc9e3 0%, #bae6fd 50%, #fef08a 100%);
          padding: 24px 20px;
          overflow-y: auto;
          position: relative;
        }

        .level-select::before {
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

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .back-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 228, 240, 0.95) 100%);
          color: #ff3388;
          border: 3px solid white;
          padding: 12px 24px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 800;
          font-size: 16px;
          font-family: 'Nunito', sans-serif;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 6px 20px rgba(255, 51, 136, 0.15);
        }

        .back-button:hover {
          background: linear-gradient(135deg, #ffffff 0%, #ffe4f0 100%);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(255, 51, 136, 0.25);
        }

        .back-button:active {
          transform: translateY(0) scale(0.98);
        }

        .theme-name {
          font-size: 42px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(135deg, #ff3388 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          flex: 1;
        }

        .levels-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto 32px;
          position: relative;
          z-index: 1;
        }

        .level-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
          border-radius: 24px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          border: 4px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .level-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transition: left 0.5s;
        }

        .level-card:hover:not(.locked)::before {
          left: 100%;
        }

        .level-card:hover:not(.locked) {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.25);
          border-color: #0ea5e9;
        }

        .level-card:active:not(.locked) {
          transform: translateY(-4px) scale(1.01);
        }

        .level-card.locked {
          background: linear-gradient(135deg, rgba(203, 213, 225, 0.95) 0%, rgba(148, 163, 184, 0.85) 100%);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .level-number {
          font-size: 36px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(135deg, #ff3388 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px 0;
        }

        .level-card.locked .level-number {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .level-words {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
          font-family: 'Nunito', sans-serif;
        }

        .stars {
          font-size: 24px;
          margin-top: 12px;
          min-height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .lock-icon {
          font-size: 32px;
          margin-top: 12px;
          opacity: 0.6;
        }

        .total-score {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
          color: #1e293b;
          padding: 20px 32px;
          border-radius: 24px;
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          border: 4px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          max-width: 400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
      </style>
      <div class="level-select">
        <div class="header">
          <button class="back-button">← Back</button>
          <h1 class="theme-name">Theme</h1>
        </div>
        <div class="levels-container"></div>
        <div class="total-score">⭐ Total: 0 points</div>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const backBtn = this.shadowRoot.querySelector('.back-button');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.handleBack());
      }
    }
  }

  private async loadLevels() {
    try {
      await this.wordLoaderService.loadTheme(this.themeId);
      const themeProgress = this.storageService.getProgress()?.themes[this.themeId];

      // Update theme name
      const themeName = this.shadowRoot?.querySelector('.theme-name');
      if (themeName) {
        themeName.textContent = this.capitalize(this.themeId);
      }

      // Build level progress map
      if (themeProgress?.levels) {
        this.levelProgressMap = themeProgress.levels;
      }

      // Display levels (1-10)
      const levelsContainer = this.shadowRoot?.querySelector('.levels-container');
      if (!levelsContainer) return;

      const maxLevels = 10;
      for (let level = 1; level <= maxLevels; level++) {
        const unlocked = this.isLevelUnlocked(level);
        const levelData = this.levelProgressMap[level];

        const card = document.createElement('div');
        card.className = `level-card ${unlocked ? '' : 'locked'}`;

        const stars = levelData?.stars || 0;
        const starsDisplay = stars > 0 ? '⭐'.repeat(stars) : '';

        card.innerHTML = `
          <p class="level-number">Level ${level}</p>
          <p class="level-words">${Math.min(5 + level, 15)} words</p>
          ${unlocked ? `<div class="stars">${starsDisplay}</div>` : '<div class="lock-icon">🔒</div>'}
        `;

        if (unlocked) {
          card.addEventListener('click', () => this.handleLevelSelect(level));
        }

        levelsContainer.appendChild(card);
      }

      // Update total score
      const totalScoreEl = this.shadowRoot?.querySelector('.total-score');
      if (totalScoreEl) {
        const totalScore = themeProgress?.totalScore || 0;
        totalScoreEl.textContent = `⭐ Total: ${totalScore} points`;
      }
    } catch (error) {
      console.error('Failed to load levels:', error);
    }
  }

  private isLevelUnlocked(levelNum: number): boolean {
    if (levelNum === 1) {
      return true;
    }

    const prevLevelProgress = this.levelProgressMap[levelNum - 1];
    if (!prevLevelProgress) {
      return levelNum <= 2; // First two levels are free
    }

    const starsEarned = prevLevelProgress.stars || 0;
    return starsEarned >= 1; // At least 1 star required
  }

  private handleLevelSelect(levelNum: number) {
    if (!this.isLevelUnlocked(levelNum)) {
      return;
    }

    this.audioService.play('click');
    this.router.navigate('game', { theme: this.themeId, level: levelNum });
  }

  private handleBack() {
    this.audioService.play('click');
    this.router.navigate('title');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

customElements.define('level-select', LevelSelect);
