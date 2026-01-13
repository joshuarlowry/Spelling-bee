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

export class HelpButton extends HTMLElement {
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
   *    - <style> with:
   *      - button styles (padding, border-radius, background, hover)
   *      - :disabled styles (gray, no pointer)
   *    - <button>Help Me 🆘</button>
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
   * 1. Dispatch 'help-requested' CustomEvent
   * 2. Set bubbles: true
   * 3. Disable button after click
   * 4. Play 'click' sound via audioService
   */
  private handleClick() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement setDisabled()
   *
   * Enables/disables the button.
   *
   * Steps:
   * 1. Query button element
   * 2. Set disabled property
   */
  setDisabled(disabled: boolean) {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('help-button', HelpButton);
