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
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 32px;
          background: linear-gradient(135deg, #ff3388 0%, #ff61a8 50%, #ff9dca 100%);
          border-radius: 24px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(255, 51, 136, 0.3);
          border: 4px solid rgba(255, 255, 255, 0.5);
        }

        .speaker-button {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff 0%, #ffe4f0 100%);
          border: 4px solid rgba(255, 255, 255, 0.8);
          font-size: 36px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 51, 136, 0.3);
          }
        }

        .speaker-button:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 30px rgba(255, 51, 136, 0.4);
          background: linear-gradient(135deg, #ffe4f0 0%, #fff 100%);
        }

        .speaker-button:active {
          transform: scale(0.95);
        }

        .sentence-text {
          font-size: 20px;
          font-weight: 600;
          color: white;
          font-style: italic;
          text-align: center;
          line-height: 1.6;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          max-width: 600px;
        }

        .instruction-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 12px;
        }
      </style>
      <div class="word-display">
        <div class="instruction-text">🎧 Listen carefully and spell the word!</div>
        <button class="speaker-button" title="Click to hear the word again">🔊</button>
        <div class="sentence-text"></div>
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
    // DON'T display the word - this is a spelling game!
    // The word is only stored for the speaker button functionality
  }

  setSentence(sentence: string) {
    this.sentence = sentence;
    const sentenceText = this.shadowRoot?.querySelector('.sentence-text');
    if (sentenceText && this.word) {
      // Replace the word in the sentence with blanks
      // Use case-insensitive regex to find the word
      const regex = new RegExp(`\\b${this.word}\\b`, 'gi');
      const wordLength = this.word.length;
      const blanks = '_'.repeat(wordLength);
      const hiddenSentence = sentence.replace(regex, blanks);
      sentenceText.textContent = hiddenSentence;
    } else if (sentenceText) {
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
