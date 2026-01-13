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

export class HearAgainButton extends HTMLElement {
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
   * Steps:
   * 1. Call this.render()
   */
  connectedCallback() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement render()
   *
   * Creates the button template.
   *
   * Steps:
   * 1. Set this.shadowRoot!.innerHTML to template:
   *    - <style> with button styles
   *    - <button>🔊 Hear Again</button>
   * 2. Add click listener to button
   */
  private render() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleClick()
   *
   * Handles button click.
   *
   * Steps:
   * 1. Dispatch 'hear-again' CustomEvent
   * 2. Set bubbles: true
   * 3. Play 'click' sound via audioService
   */
  private handleClick() {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('hear-again-button', HearAgainButton);
