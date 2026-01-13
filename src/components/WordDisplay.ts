/**
 * WordDisplay Component
 *
 * Displays the word prompt and example sentence.
 *
 * IMPLEMENTATION TASKS:
 * 1. Extend HTMLElement class
 * 2. Implement constructor - attach shadow DOM
 * 3. Implement connectedCallback() - render and setup listeners
 * 4. Implement render() - create template with speaker icon and sentence
 * 5. Implement setWord() - updates displayed word
 * 6. Implement setSentence() - updates displayed sentence
 * 7. Handle speaker icon click - repeats word and sentence
 * 8. Register custom element
 */

export class WordDisplay extends HTMLElement {
  private word: string = '';
  private sentence: string = '';

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
   * Creates the component template.
   *
   * Steps:
   * 1. Set this.shadowRoot!.innerHTML to template:
   *    - <style> with:
   *      - .word-display container styles
   *      - .speaker-button styles
   *      - .word-text and .sentence-text styles
   *    - <div class="word-display">
   *      - <button class="speaker-button">🔊</button>
   *      - <div class="word-text"></div>
   *      - <div class="sentence-text"></div>
   * 2. Add click listener to speaker button
   */
  private render() {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement setWord()
   *
   * Updates the displayed word.
   *
   * Steps:
   * 1. Set this.word = word
   * 2. Update word-text element textContent
   */
  setWord(word: string) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement setSentence()
   *
   * Updates the displayed sentence.
   *
   * Steps:
   * 1. Set this.sentence = sentence
   * 2. Update sentence-text element textContent
   */
  setSentence(sentence: string) {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement handleSpeakerClick()
   *
   * Replays word and sentence.
   *
   * Steps:
   * 1. Call speechService.speakWord(this.word)
   * 2. Wait for completion
   * 3. Call speechService.speakSentence(this.sentence)
   * 4. Play 'click' sound via audioService
   */
  private async handleSpeakerClick() {
    throw new Error('Not implemented');
  }
}

// TODO: Register custom element
// customElements.define('word-display', WordDisplay);
