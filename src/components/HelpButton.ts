/**
 * HelpButton Component
 *
 * Button that reveals letters when clicked.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render
 * 4. Implement render() - create button template
 * 5. Handle button click
 * 6. Dispatch 'help-requested' event
 * 7. Implement disabled state
 * 8. Register custom element
 */

import { audioService } from '../services/AudioService';

export class HelpButton extends HTMLElement {
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
          padding: 10px 16px;
          border-radius: 6px;
          background: #ff9f43;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover:not(:disabled) {
          background: #ff8c42;
          transform: scale(1.05);
        }

        button:active:not(:disabled) {
          transform: scale(0.95);
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
      </style>
      <button>Help Me 🆘</button>
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
    this.dispatchEvent(new CustomEvent('help-requested', { bubbles: true }));
    this.setDisabled(true);
  }

  setDisabled(disabled: boolean) {
    const button = this.shadowRoot?.querySelector('button') as HTMLButtonElement;
    if (button) {
      button.disabled = disabled;
    }
  }
}

customElements.define('help-button', HelpButton);
