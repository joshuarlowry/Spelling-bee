/**
 * GameHeader Component
 *
 * Header bar showing level info, score, and progress.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render
 * 4. Implement render() - create header template
 * 5. Implement updateScore() - updates score display
 * 6. Implement updateProgress() - updates word progress (e.g., "Word 3 of 10")
 * 7. Handle back button click
 * 8. Register custom element
 */

export class GameHeader extends HTMLElement {
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
   * Creates the header template.
   *
   * Steps:
   * 1. Set this.shadowRoot!.innerHTML to template:
   *    - <style> with:
   *      - .header container (flex, space-between)
   *      - .back-button styles
   *      - .level-info styles
   *      - .score-display styles
   *      - .progress-indicator styles
   *    - <div class="header">
   *      - <button class="back-button">← Back</button>
   *      - <div class="center-info">
   *        - <div class="level-info">Level X</div>
   *        - <div class="progress-indicator">Word X of Y</div>
   *      - <div class="score-display">Score: 0</div>
   * 2. Add click listener to back button
   */
  private render() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement updateScore()
   *
   * Updates the score display.
   *
   * Steps:
   * 1. Query score-display element
   * 2. Set textContent to `Score: ${score}`
   */
  updateScore(score: number) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement updateProgress()
   *
   * Updates word progress indicator.
   *
   * Steps:
   * 1. Query progress-indicator element
   * 2. Set textContent to `Word ${current} of ${total}`
   */
  updateProgress(current: number, total: number) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleBackClick()
   *
   * Handles back button click.
   *
   * Steps:
   * 1. Dispatch 'back' CustomEvent
   * 2. Set bubbles: true
   * 3. Play 'click' sound via audioService
   */
  private handleBackClick() {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('game-header', GameHeader);
