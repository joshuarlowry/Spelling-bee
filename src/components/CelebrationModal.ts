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
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 0.4s ease-out;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-overlay.hidden {
          display: none;
        }

        .modal-content {
          background: linear-gradient(135deg, #ffffff 0%, #ffe4f0 50%, #ffffff 100%);
          border-radius: 32px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(255, 51, 136, 0.4);
          animation: celebrate 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          border: 6px solid rgba(255, 255, 255, 0.8);
          max-width: 400px;
          margin: 20px;
        }

        .modal-content::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(135deg, #ff3388 0%, #0ea5e9 50%, #facc15 100%);
          border-radius: 32px;
          z-index: -1;
          animation: rainbowRotate 3s linear infinite;
        }

        @keyframes rainbowRotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
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
          font-size: 40px;
          animation: starBurst 1.2s ease-out forwards;
          top: 50%;
          left: 50%;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        h1 {
          font-size: 56px;
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(135deg, #ff3388 0%, #0ea5e9 50%, #facc15 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
          animation: titlePulse 0.8s ease-in-out;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .points {
          font-size: 36px;
          font-weight: 800;
          font-family: 'Fredoka One', cursive;
          color: #22c55e;
          margin: 16px 0 24px 0;
          text-shadow: 2px 2px 4px rgba(34, 197, 94, 0.3);
          animation: pointsBounce 0.6s ease-out 0.3s backwards;
        }

        @keyframes pointsBounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .continue-btn {
          margin-top: 8px;
          padding: 16px 48px;
          font-size: 20px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(135deg, #ff3388 0%, #ff61a8 100%);
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.8);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(255, 51, 136, 0.3);
          animation: buttonSlideUp 0.5s ease-out 0.5s backwards;
        }

        @keyframes buttonSlideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .continue-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 32px rgba(255, 51, 136, 0.4);
        }

        .continue-btn:active {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 51, 136, 0.3);
        }

        @keyframes celebrate {
          0% {
            transform: scale(0.3) rotateZ(-15deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotateZ(5deg);
          }
          70% {
            transform: scale(0.95) rotateZ(-3deg);
          }
          100% {
            transform: scale(1) rotateZ(0);
            opacity: 1;
          }
        }

        @keyframes starBurst {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
      </style>
      <div class="modal-overlay hidden">
        <div class="modal-content">
          <div class="star-burst"></div>
          <h1>🎉 AMAZING! 🎉</h1>
          <p class="points">+0 points</p>
          <button class="continue-btn">Continue →</button>
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
        composed: true,
      })
    );
  }

  private createStarParticles() {
    const starBurst = this.shadowRoot?.querySelector('.star-burst');
    if (!starBurst) return;

    starBurst.innerHTML = '';

    const particleCount = 16;
    const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎊'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'star-particle';

      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 120 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.animationDelay = `${Math.random() * 0.2}s`;

      const emoji = emojis[Math.floor(Math.random() * emojis.length)] || '⭐';
      particle.textContent = emoji;

      starBurst.appendChild(particle);
    }

    // Clean up particles after animation
    setTimeout(() => {
      if (starBurst) {
        starBurst.innerHTML = '';
      }
    }, 1400);
  }
}

customElements.define('celebration-modal', CelebrationModal);
