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
          padding: 16px 32px;
          border-radius: 50px;
          background: linear-gradient(135deg, #fde047 0%, #facc15 100%);
          color: #854d0e;
          border: 3px solid rgba(255, 255, 255, 0.5);
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.3);
          font-family: 'Nunito', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        button:hover:not(:disabled) {
          background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(250, 204, 21, 0.4);
        }

        button:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.3);
        }

        button:disabled {
          background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
          color: #64748b;
          cursor: not-allowed;
          opacity: 0.5;
          transform: none;
        }
      </style>
      <button>✨ Help Me</button>
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
    this.dispatchEvent(new CustomEvent('help-requested', { bubbles: true, composed: true }));
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
