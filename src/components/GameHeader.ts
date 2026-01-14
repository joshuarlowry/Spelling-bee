/**
 * GameHeader Component
 *
 * Header bar showing level info, score, and progress.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render
 * 4. Implement render() - create header template
 * 5. Implement updateScore() - updates score display
 * 6. Implement updateProgress() - updates word progress (e.g., "Word 3 of 10")
 * 7. Handle back button click
 * 8. Register custom element
 */

import { audioService } from '../services/AudioService';

export class GameHeader extends HTMLElement {
  private audioService = audioService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(135deg, #ff3388 0%, #ff61a8 100%);
          color: white;
          border-radius: 20px;
          margin-bottom: 24px;
          box-shadow: 0 6px 20px rgba(255, 51, 136, 0.25);
          border: 3px solid rgba(255, 255, 255, 0.3);
          font-family: 'Nunito', sans-serif;
        }

        .back-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 228, 240, 0.95) 100%);
          color: #ff3388;
          border: 3px solid white;
          padding: 10px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 800;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .back-button:hover {
          background: linear-gradient(135deg, #ffffff 0%, #ffe4f0 100%);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .back-button:active {
          transform: translateY(0) scale(0.98);
        }

        .center-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .level-info {
          font-size: 22px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-indicator {
          font-size: 14px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: 50px;
        }

        .score-display {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
          padding: 10px 20px;
          border-radius: 50px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
      </style>
      <div class="header">
        <button class="back-button">← Back</button>
        <div class="center-info">
          <div class="level-info">Level 1</div>
          <div class="progress-indicator">Word 1 of 10</div>
        </div>
        <div class="score-display">⭐ 0</div>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const backButton = this.shadowRoot.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', () => this.handleBackClick());
      }
    }
  }

  updateScore(score: number) {
    const scoreDisplay = this.shadowRoot?.querySelector('.score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = `⭐ ${score}`;
    }
  }

  updateProgress(current: number, total: number) {
    const progressIndicator = this.shadowRoot?.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.textContent = `Word ${current} of ${total}`;
    }
  }

  private handleBackClick() {
    this.audioService.play('click');
    this.dispatchEvent(new CustomEvent('back', { bubbles: true }));
  }
}

customElements.define('game-header', GameHeader);
