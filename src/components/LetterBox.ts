/**
 * LetterBox Component
 *
 * A single letter input box for spelling words.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render and setup listeners
 * 4. Implement render() - create template with styles and input
 * 5. Implement setupEventListeners() - attach input and keydown handlers
 * 6. Implement handleInput() - check if letter is correct
 * 7. Implement handleKeydown() - handle backspace navigation
 * 8. Implement markCorrect() - show green animation, disable input
 * 9. Implement markIncorrect() - show red animation, clear input
 * 10. Implement reveal() - show correct letter (for help feature)
 * 11. Implement focus() - focus the input
 * 12. Dispatch custom events: 'letter-correct', 'letter-incorrect', 'focus-previous'
 * 13. Register custom element with customElements.define()
 */

export class LetterBox extends HTMLElement {
  private input!: HTMLInputElement;
  private correctLetter!: string;

  static get observedAttributes() {
    return ['letter', 'index', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'letter' && newValue) {
      this.correctLetter = newValue.toLowerCase();
    }
  }

  private render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .letter-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border: 4px solid #ff3388;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #ffe4f0 100%);
          margin: 6px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          box-shadow: 0 4px 12px rgba(255, 51, 136, 0.15);
        }

        .letter-box:focus-within {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2), 0 6px 16px rgba(14, 165, 233, 0.25);
          transform: translateY(-2px);
        }

        .letter-box.correct {
          background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
          border-color: #16a34a;
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .letter-box.incorrect {
          background: linear-gradient(135deg, #fca5a5 0%, #ef4444 100%);
          border-color: #dc2626;
          animation: shake 0.4s ease-in-out;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          font-size: 36px;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
          color: #1e293b;
          outline: none;
          font-family: 'Fredoka One', cursive;
        }

        input:disabled {
          color: white;
        }

        @keyframes pop {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.2) rotate(-5deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          75% {
            transform: scale(1.15) rotate(-3deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-8px) rotate(-2deg);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(8px) rotate(2deg);
          }
        }
      </style>
      <div class="letter-box">
        <input type="text" maxlength="1" autocomplete="off" />
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.input = this.shadowRoot.querySelector('input')!;
    }
  }

  private setupEventListeners() {
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  private handleInput() {
    const value = this.input.value.toLowerCase();

    if (!value) {
      return;
    }

    if (value === this.correctLetter) {
      this.markCorrect();
      this.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: this.index, letter: value },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.markIncorrect();
      this.dispatchEvent(
        new CustomEvent('letter-incorrect', {
          detail: { index: this.index, letter: value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' && this.input.value === '') {
      this.dispatchEvent(
        new CustomEvent('focus-previous', {
          detail: { index: this.index },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private markCorrect() {
    const letterBox = this.shadowRoot?.querySelector('.letter-box');
    if (letterBox) {
      letterBox.classList.add('correct');
    }
    this.input.value = this.correctLetter.toUpperCase();
    this.input.disabled = true;
  }

  private markIncorrect() {
    const letterBox = this.shadowRoot?.querySelector('.letter-box');
    if (letterBox) {
      letterBox.classList.add('incorrect');
    }

    setTimeout(() => {
      if (letterBox) {
        letterBox.classList.remove('incorrect');
      }
      this.input.value = '';
      this.input.focus();
    }, 300);
  }

  reveal() {
    this.markCorrect();
  }

  focus() {
    this.input.focus();
  }

  get index(): number {
    return parseInt(this.getAttribute('index') || '0');
  }

  set letter(value: string) {
    this.correctLetter = value.toLowerCase();
  }
}

customElements.define('letter-box', LetterBox);
