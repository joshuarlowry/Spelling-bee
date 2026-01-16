/**
 * Speech Service
 *
 * Handles text-to-speech using Web Speech API.
 *
 * IMPLEMENTATION TASKS:
 * 1. Import SpeechOptions from types
 * 2. Implement constructor - initialize synth, call initVoice()
 * 3. Implement initVoice() - wait for voices to load, select best voice
 * 4. Implement speak() - speak text with options, return promise
 * 5. Implement speakWord() - wrapper for announcing word
 * 6. Implement speakSentence() - wrapper for reading sentence
 * 7. Implement speakLetter() - wrapper for reading single letter
 * 8. Implement getPhoneticLetter() - return clear letter pronunciation
 * 9. Implement stop() - cancel ongoing speech
 * 10. Add isSupported getter - check if speech API available
 */

import { SpeechOptions } from '../types/services';

export class SpeechService {
  private synth: SpeechSynthesis | null;
  private voice: SpeechSynthesisVoice | null = null;
  private ready: Promise<void>;

  constructor() {
    /**
     * Initialize speech service
     *
     * Steps:
     * 1. Set this.synth = window.speechSynthesis
     * 2. Set this.ready = this.initVoice()
     */
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.ready = this.initVoice();
    } else {
      this.synth = null;
      this.ready = Promise.resolve();
    }
  }

  /**
   * Waits for voices to load and selects the best available voice.
   *
   * Steps:
   * 1. Return a Promise<void>
   * 2. Check if voices are already loaded (synth.getVoices().length > 0)
   * 3. If not, wait for 'voiceschanged' event
   * 4. Get all voices
   * 5. Define preferred voices array:
   *    - 'Google UK English Female'
   *    - 'Google US English'
   *    - 'Samantha'
   *    - 'Microsoft Aria Online'
   *    - 'Microsoft Jenny Online'
   *    - 'Karen'
   * 6. Loop through preferred names, find first match
   * 7. If no match, find any English voice (v.lang.startsWith('en'))
   * 8. Set this.voice to selected voice
   * 9. Log selected voice name to console
   */
  private async initVoice(): Promise<void> {
    if (!this.synth) {
      return;
    }

    if (this.synth.getVoices().length === 0) {
      await new Promise<void>(resolve => {
        const onVoicesChanged = () => {
          this.synth.removeEventListener('voiceschanged', onVoicesChanged);
          resolve();
        };
        this.synth.addEventListener('voiceschanged', onVoicesChanged);
      });
    }

    const voices = this.synth.getVoices();
    const preferredNames = [
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Microsoft Aria Online',
      'Microsoft Jenny Online',
      'Karen',
    ];

    for (const name of preferredNames) {
      const found = voices.find(v => v.name === name);
      if (found) {
        this.voice = found;
        console.log(`✓ Selected voice: ${this.voice.name}`);
        return;
      }
    }

    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      this.voice = englishVoice;
      console.log(`✓ Selected voice: ${this.voice.name}`);
    }
  }

  /**
   * Speaks text with given options.
   *
   * Steps:
   * 1. Wait for this.ready
   * 2. Cancel any ongoing speech (this.synth.cancel())
   * 3. Create new SpeechSynthesisUtterance(text)
   * 4. Set utterance.voice to this.voice
   * 5. Set utterance.rate from options (default 0.85)
   * 6. Set utterance.pitch from options (default 1.1)
   * 7. Set utterance.volume to 1.0
   * 8. If options.onBoundary, attach to utterance.onboundary
   * 9. Return promise that resolves on utterance.onend
   * 10. Handle utterance.onerror (resolve if interrupted, reject otherwise)
   * 11. Call this.synth.speak(utterance)
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    await this.ready;

    if (!this.synth) {
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.1;
    utterance.volume = 1.0;

    if (options.onBoundary) {
      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        options.onBoundary!(event.charIndex);
      };
    }

    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        if (event.error === 'interrupted') {
          resolve();
        } else {
          reject(new Error(`Speech error: ${event.error}`));
        }
      };
      this.synth.speak(utterance);
    });
  }

  /**
   * Announces a word to spell.
   *
   * Steps:
   * 1. Call this.speak() with text: `Spell the word: ${word}`
   * 2. Use rate: 0.85, pitch: 1.1
   * 3. Return the promise
   */
  async speakWord(word: string): Promise<void> {
    return this.speak(`Spell the word: ${word}`, { rate: 0.85, pitch: 1.1 });
  }

  /**
   * Reads the example sentence.
   *
   * Steps:
   * 1. Call this.speak() with the sentence
   * 2. Use rate: 0.85, pitch: 1.0
   * 3. Return the promise
   */
  async speakSentence(sentence: string): Promise<void> {
    return this.speak(sentence, { rate: 0.85, pitch: 1.0 });
  }

  /**
   * Speaks a single letter clearly.
   *
   * Steps:
   * 1. Get phonetic version: this.getPhoneticLetter(letter)
   * 2. Call this.speak() with phonetic letter
   * 3. Use rate: 0.7, pitch: 1.0
   * 4. Return the promise
   */
  async speakLetter(letter: string): Promise<void> {
    const phonetic = this.getPhoneticLetter(letter);
    return this.speak(phonetic, { rate: 0.7, pitch: 1.0 });
  }

  /**
   * Returns a clear pronunciation for the letter.
   *
   * Steps:
   * 1. Create a phonetics map: { 'a': 'A', 'b': 'B', ... }
   * 2. Convert letter to lowercase
   * 3. Return phonetics[letter] or letter if not found
   * 4. For now, just return uppercase letter
   * 5. Future enhancement: use phonetic alphabet (Alpha, Bravo, etc.)
   */
  private getPhoneticLetter(letter: string): string {
    return letter.toLowerCase();
  }

  /**
   * Cancels any ongoing speech.
   *
   * Steps:
   * 1. Call this.synth.cancel()
   */
  stop(): void {
    this.synth?.cancel();
  }

  /**
   * Checks if speech API is available.
   *
   * Steps:
   * 1. Return ('speechSynthesis' in window)
   */
  get isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

// Export singleton instance
export const speechService = new SpeechService();
