/**
 * LetterBoxes Container Component
 *
 * Container for multiple LetterBox components.
 *
 * IMPLEMENTATION TASKS:
 * 1. Create class (not a Web Component, just a regular class)
 * 2. Implement constructor - accepts word and parent element
 * 3. Implement render() - creates letter boxes
 * 4. Implement setupEventListeners() - handles box events
 * 5. Implement handleLetterCorrect() - advances to next box
 * 6. Implement handleLetterIncorrect() - plays error sound
 * 7. Implement handleFocusPrevious() - focuses previous box
 * 8. Implement revealAll() - reveals all remaining letters
 * 9. Implement reset() - clears for new word
 * 10. Implement checkCompletion() - detects when word is complete
 * 11. Dispatch 'word-complete' event when done
 */

import { LetterBox } from './LetterBox';
import { audioService } from '../services/AudioService';
import { speechService } from '../services/SpeechService';

export class LetterBoxes {
  private word: string;
  private boxes: LetterBox[] = [];
  private container: HTMLElement;
  private audioService = audioService;
  private speechService = speechService;

  constructor(word: string, parent: HTMLElement) {
    this.word = word;
    this.container = document.createElement('div');
    this.container.className = 'letter-boxes-container';
    parent.appendChild(this.container);
    this.render();
    this.setupEventListeners();
  }

  private render() {
    this.boxes = [];
    this.container.innerHTML = '';

    for (let i = 0; i < this.word.length; i++) {
      const letterBox = document.createElement('letter-box') as LetterBox;
      letterBox.setAttribute('letter', this.word[i] || '');
      letterBox.setAttribute('index', i.toString());
      this.boxes.push(letterBox);
      this.container.appendChild(letterBox);
    }

    if (this.boxes.length > 0) {
      this.boxes[0]?.focus();
    }
  }

  private setupEventListeners() {
    this.container.addEventListener('letter-correct', (e) =>
      this.handleLetterCorrect(e as CustomEvent)
    );
    this.container.addEventListener('letter-incorrect', () =>
      this.handleLetterIncorrect()
    );
    this.container.addEventListener('focus-previous', (e) =>
      this.handleFocusPrevious(e as CustomEvent)
    );
  }

  private handleLetterCorrect(e: CustomEvent) {
    const { index } = e.detail;
    this.audioService.play('correct');
    this.speechService.speakLetter(this.word[index] || '');

    if (index < this.boxes.length - 1) {
      this.boxes[index + 1]?.focus();
    }

    this.checkCompletion();
  }

  private handleLetterIncorrect() {
    this.audioService.play('incorrect');
    this.speechService.speak('Try again').catch((error) => {
      console.error('Failed to speak:', error);
    });
  }

  private handleFocusPrevious(e: CustomEvent) {
    const { index } = e.detail;
    if (index > 0) {
      this.boxes[index - 1]?.focus();
    }
  }

  async revealAll() {
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      if (box) {
        // Check if box is not already revealed by checking if input is disabled
        const input = box.shadowRoot?.querySelector('input') as HTMLInputElement;
        if (!input?.disabled) {
          box.reveal();
          this.speechService.speakLetter(this.word[i] || '');
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }
    this.checkCompletion();
  }

  reset() {
    this.container.remove();
    this.boxes = [];
  }

  private checkCompletion() {
    const allRevealed = this.boxes.every((box) => {
      const input = box.shadowRoot?.querySelector('input') as HTMLInputElement;
      return input?.disabled === true;
    });

    if (allRevealed) {
      this.container.dispatchEvent(
        new CustomEvent('word-complete', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
