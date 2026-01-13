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
  private isRevealed: boolean = false;

  /**
   * TODO: Define observed attributes
   *
   * Steps:
   * 1. Return array: ['letter', 'index', 'disabled']
   */
  static get observedAttributes() {
    throw new Error('Not implemented');
  }

  constructor() {
    super();
    /**
     * TODO: Initialize component
     *
     * Steps:
     * 1. Call this.attachShadow({ mode: 'open' })
     */
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement connectedCallback()
   *
   * Called when element is added to DOM.
   *
   * Steps:
   * 1. Call this.render()
   * 2. Call this.setupEventListeners()
   */
  connectedCallback() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement render()
   *
   * Creates the component template.
   *
   * Steps:
   * 1. Set this.shadowRoot!.innerHTML to template string:
   *    - Include <style> tag with:
   *      - :host { display: inline-block; }
   *      - .letter-box styles (border, padding, background, etc.)
   *      - .letter-box:focus-within (border color, box shadow)
   *      - .letter-box.correct (green background, animation)
   *      - .letter-box.incorrect (red background, shake animation)
   *      - input styles (no border, transparent background, centered text)
   *      - @keyframes pop (scale animation)
   *      - @keyframes shake (translateX animation)
   *    - Include <div class="letter-box"> with <input> inside
   *    - Input attributes: type="text", maxlength="1", autocomplete="off", etc.
   * 2. Query and store input element: this.input = this.shadowRoot!.querySelector('input')!
   */
  private render() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement setupEventListeners()
   *
   * Attaches event listeners.
   *
   * Steps:
   * 1. Add 'input' listener to this.input that calls this.handleInput()
   * 2. Add 'keydown' listener to this.input that calls this.handleKeydown()
   */
  private setupEventListeners() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleInput()
   *
   * Handles letter input.
   *
   * Steps:
   * 1. Get input value and convert to lowercase
   * 2. If value is empty, return early
   * 3. If value === this.correctLetter:
   *    - Call this.markCorrect()
   *    - Dispatch 'letter-correct' CustomEvent with detail: { index, letter: value }
   * 4. Else:
   *    - Call this.markIncorrect()
   *    - Dispatch 'letter-incorrect' CustomEvent with detail: { index, letter: value }
   * 5. Set bubbles: true on events
   */
  private handleInput(e: Event) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleKeydown()
   *
   * Handles keyboard navigation.
   *
   * Steps:
   * 1. If key is 'Backspace' AND input is empty:
   *    - Dispatch 'focus-previous' CustomEvent with detail: { index }
   *    - Set bubbles: true
   */
  private handleKeydown(e: KeyboardEvent) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement markCorrect()
   *
   * Shows success state.
   *
   * Steps:
   * 1. Get letter box element from shadow DOM
   * 2. Add 'correct' class
   * 3. Set input value to correctLetter.toUpperCase()
   * 4. Set input.disabled = true
   * 5. Set this.isRevealed = true
   */
  private markCorrect() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement markIncorrect()
   *
   * Shows error state briefly.
   *
   * Steps:
   * 1. Get letter box element from shadow DOM
   * 2. Add 'incorrect' class
   * 3. After 300ms:
   *    - Remove 'incorrect' class
   *    - Clear input value
   *    - Focus input
   * 4. Use setTimeout() for delay
   */
  private markIncorrect() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement reveal()
   *
   * Reveals the correct letter (help feature).
   *
   * Steps:
   * 1. Call this.markCorrect()
   */
  reveal() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement focus()
   *
   * Focuses the input.
   *
   * Steps:
   * 1. Call this.input.focus()
   */
  focus() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement index getter
   *
   * Gets the box index from attribute.
   *
   * Steps:
   * 1. Return parseInt(this.getAttribute('index') || '0')
   */
  get index(): number {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement letter setter
   *
   * Sets the correct letter.
   *
   * Steps:
   * 1. Set this.correctLetter = value.toLowerCase()
   */
  set letter(value: string) {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('letter-box', LetterBox);
