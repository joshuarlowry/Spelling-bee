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
          padding: 16px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

        .center-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .level-info {
          font-size: 18px;
          font-weight: bold;
        }

        .progress-indicator {
          font-size: 12px;
          opacity: 0.9;
        }

        .score-display {
          font-size: 18px;
          font-weight: bold;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 6px;
        }
      </style>
      <div class="header">
        <button class="back-button">← Back</button>
        <div class="center-info">
          <div class="level-info">Level 1</div>
          <div class="progress-indicator">Word 1 of 10</div>
        </div>
        <div class="score-display">Score: 0</div>
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
      scoreDisplay.textContent = `Score: ${score}`;
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
