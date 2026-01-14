/**
 * HearAgainButton Component
 *
 * Button that replays the word and sentence.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render
 * 4. Implement render() - create button with speaker icon
 * 5. Handle button click
 * 6. Dispatch 'hear-again' event
 * 7. Register custom element
 */

import { audioService } from '../services/AudioService';

export class HearAgainButton extends HTMLElement {
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
        button {
          padding: 8px 14px;
          border-radius: 6px;
          background: #3498db;
          color: white;
          border: none;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          background: #2980b9;
          transform: scale(1.05);
        }

        button:active {
          transform: scale(0.95);
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
      </style>
      <button>🔊 Hear Again</button>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const button = this.shadowRoot.querySelector('button');
      if (button) {
        button.addEventListener('click', () => this.handleClick());
      }
    }
  }

  private handleClick() {
    this.audioService.play('click');
    this.dispatchEvent(new CustomEvent('hear-again', { bubbles: true }));
  }
}

customElements.define('hear-again-button', HearAgainButton);
