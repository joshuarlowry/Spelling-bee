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
          width: 60px;
          height: 60px;
          border: 3px solid #667eea;
          border-radius: 8px;
          background: white;
          margin: 8px;
          transition: all 0.2s;
          position: relative;
        }

        .letter-box:focus-within {
          border-color: #764ba2;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .letter-box.correct {
          background: #2ecc71;
          border-color: #27ae60;
          animation: pop 0.4s ease-out;
        }

        .letter-box.incorrect {
          background: #e74c3c;
          border-color: #c0392b;
          animation: shake 0.3s ease-in-out;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          color: #333;
          outline: none;
          font-family: 'Arial', sans-serif;
        }

        input:disabled {
          color: white;
        }

        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
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
        })
      );
    } else {
      this.markIncorrect();
      this.dispatchEvent(
        new CustomEvent('letter-incorrect', {
          detail: { index: this.index, letter: value },
          bubbles: true,
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
