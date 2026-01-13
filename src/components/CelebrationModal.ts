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

export class CelebrationModal extends HTMLElement {
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
   * 2. Hide by default: call this.hide()
   */
  connectedCallback() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement render()
   *
   * Creates the modal template.
   *
   * Steps:
   * 1. Set this.shadowRoot!.innerHTML to template:
   *    - <style> with:
   *      - .modal-overlay (full screen, centered)
   *      - .modal-content (card with animation)
   *      - .star-burst (particle container)
   *      - @keyframes celebrate (scale/rotate)
   *      - @keyframes starBurst (particles fly out)
   *      - .hidden { display: none; }
   *    - <div class="modal-overlay hidden">
   *      - <div class="modal-content">
   *        - <div class="star-burst"></div>
   *        - <h1>WONDERFUL!</h1>
   *        - <p class="points">+10 points</p>
   *        - <button class="continue-btn">Continue</button>
   * 2. Add click listener to continue button
   */
  private render() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement show()
   *
   * Shows the modal with points.
   *
   * Steps:
   * 1. Update points text
   * 2. Remove 'hidden' class from overlay
   * 3. Create star particles (8-12 particles)
   * 4. Play 'complete' sound via audioService
   * 5. Use requestAnimationFrame for smooth animation
   */
  show(points: number) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement hide()
   *
   * Hides the modal.
   *
   * Steps:
   * 1. Add 'hidden' class to overlay
   * 2. Clear star particles
   */
  hide() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleContinue()
   *
   * Handles continue button click.
   *
   * Steps:
   * 1. Call this.hide()
   * 2. Dispatch 'continue' CustomEvent
   * 3. Set bubbles: true
   * 4. Play 'click' sound via audioService
   */
  private handleContinue() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement createStarParticles()
   *
   * Creates animated star particles.
   *
   * Steps:
   * 1. Get star-burst container
   * 2. Create 10 particle divs
   * 3. For each particle:
   *    - Add 'star-particle' class
   *    - Set random --tx and --ty CSS variables
   *    - Append to container
   * 4. Remove particles after animation (1s)
   */
  private createStarParticles() {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('celebration-modal', CelebrationModal);
