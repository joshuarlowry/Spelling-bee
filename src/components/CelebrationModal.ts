/**
 * CelebrationModal Component
 *
 * Modal that shows when a word is completed correctly.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render
 * 4. Implement render() - create modal template with animations
 * 5. Implement show() - displays modal with points
 * 6. Implement hide() - closes modal
 * 7. Add star burst particle animation
 * 8. Handle continue button click
 * 9. Dispatch 'continue' event
 * 10. Register custom element
 */

import { audioService } from '../services/AudioService';

export class CelebrationModal extends HTMLElement {
  private audioService = audioService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.hide();
  }

  private render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          --tx: 0;
          --ty: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 0.3s;
        }

        .modal-overlay.hidden {
          display: none;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: celebrate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
        }

        .star-burst {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .star-particle {
          position: absolute;
          font-size: 32px;
          animation: starBurst 1s ease-out forwards;
          top: 50%;
          left: 50%;
        }

        h1 {
          font-size: 48px;
          color: #667eea;
          margin: 0;
          font-weight: bold;
        }

        .points {
          font-size: 28px;
          color: #2ecc71;
          font-weight: bold;
          margin: 16px 0;
        }

        .continue-btn {
          margin-top: 20px;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: bold;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .continue-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .continue-btn:active {
          transform: scale(0.95);
        }

        @keyframes celebrate {
          0% {
            transform: scale(0.5) rotateZ(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1) rotateZ(0);
            opacity: 1;
          }
        }

        @keyframes starBurst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      </style>
      <div class="modal-overlay hidden">
        <div class="modal-content">
          <div class="star-burst"></div>
          <h1>WONDERFUL!</h1>
          <p class="points">+0 points</p>
          <button class="continue-btn">Continue</button>
        </div>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const continueBtn = this.shadowRoot.querySelector('.continue-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => this.handleContinue());
      }
    }
  }

  show(points: number) {
    const pointsDisplay = this.shadowRoot?.querySelector('.points');
    if (pointsDisplay) {
      pointsDisplay.textContent = `+${points} points`;
    }

    const overlay = this.shadowRoot?.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }

    this.createStarParticles();
    this.audioService.play('complete');
  }

  hide() {
    const overlay = this.shadowRoot?.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }

    const starBurst = this.shadowRoot?.querySelector('.star-burst');
    if (starBurst) {
      starBurst.innerHTML = '';
    }
  }

  private handleContinue() {
    this.hide();
    this.audioService.play('click');
    this.dispatchEvent(
      new CustomEvent('continue', {
        bubbles: true,
      })
    );
  }

  private createStarParticles() {
    const starBurst = this.shadowRoot?.querySelector('.star-burst');
    if (!starBurst) return;

    starBurst.innerHTML = '';

    const particleCount = 10;
    const emojis = ['⭐', '✨', '🌟'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'star-particle';

      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      const emoji = emojis[Math.floor(Math.random() * emojis.length)] || '⭐';
      particle.textContent = emoji;

      starBurst.appendChild(particle);
    }

    // Clean up particles after animation
    setTimeout(() => {
      if (starBurst) {
        starBurst.innerHTML = '';
      }
    }, 1000);
  }
}

customElements.define('celebration-modal', CelebrationModal);
