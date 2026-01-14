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

import { speechService } from '../services/SpeechService';
import { audioService } from '../services/AudioService';

export class WordDisplay extends HTMLElement {
  private word: string = '';
  private sentence: string = '';
  private speechService = speechService;
  private audioService = audioService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .word-display {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .speaker-button {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .speaker-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .speaker-button:active {
          transform: scale(0.95);
        }

        .word-text {
          font-size: 32px;
          font-weight: bold;
          color: white;
          font-family: 'Arial', sans-serif;
          letter-spacing: 2px;
        }

        .sentence-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
          width: 100%;
          text-align: center;
          margin-top: 8px;
        }

        .text-container {
          flex: 1;
        }
      </style>
      <div class="word-display">
        <button class="speaker-button">🔊</button>
        <div class="text-container">
          <div class="word-text"></div>
          <div class="sentence-text"></div>
        </div>
      </div>
    `;

    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const speakerButton = this.shadowRoot.querySelector('.speaker-button');
      if (speakerButton) {
        speakerButton.addEventListener('click', () => this.handleSpeakerClick());
      }
    }
  }

  setWord(word: string) {
    this.word = word;
    const wordText = this.shadowRoot?.querySelector('.word-text');
    if (wordText) {
      wordText.textContent = word;
    }
  }

  setSentence(sentence: string) {
    this.sentence = sentence;
    const sentenceText = this.shadowRoot?.querySelector('.sentence-text');
    if (sentenceText) {
      sentenceText.textContent = sentence;
    }
  }

  private async handleSpeakerClick() {
    this.audioService.play('click');
    await this.speechService.speakWord(this.word);
    await this.speechService.speakSentence(this.sentence);
  }
}

customElements.define('word-display', WordDisplay);
