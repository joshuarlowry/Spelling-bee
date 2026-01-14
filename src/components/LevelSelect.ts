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
          height: 100vh;
        }

        .level-select {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          overflow-y: auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          color: white;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .back-button:active {
          transform: scale(0.95);
        }

        .theme-name {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
          flex: 1;
        }

        .levels-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin-bottom: 40px;
        }

        .level-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .level-card:hover:not(.locked) {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .level-card.locked {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .level-number {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin: 0;
        }

        .level-card.locked .level-number {
          color: #999;
        }

        .level-words {
          font-size: 12px;
          color: #666;
          margin: 8px 0 0 0;
        }

        .stars {
          font-size: 20px;
          margin-top: 8px;
        }

        .lock-icon {
          font-size: 28px;
          margin-top: 8px;
        }

        .total-score {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
      <div class="level-select">
        <div class="header">
          <button class="back-button">← Back</button>
          <h1 class="theme-name">Theme</h1>
        </div>
        <div class="levels-container"></div>
        <div class="total-score">Total Score: 0 points</div>
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
        const unlocked = this.isLevelUnlocked(level, themeProgress);
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
        totalScoreEl.textContent = `Total Score: ${totalScore} points`;
      }
    } catch (error) {
      console.error('Failed to load levels:', error);
    }
  }

  private isLevelUnlocked(levelNum: number, progress: any): boolean {
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
    if (!this.isLevelUnlocked(levelNum, null)) {
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
