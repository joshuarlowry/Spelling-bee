import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WordDisplay } from '../WordDisplay';
import '../WordDisplay'; // Register custom element

describe('WordDisplay', () => {
  let wordDisplay: WordDisplay;

  beforeEach(() => {
    wordDisplay = document.createElement('word-display') as WordDisplay;
    document.body.appendChild(wordDisplay);
  });

  afterEach(() => {
    document.body.removeChild(wordDisplay);
  });

  describe('setWord', () => {
    it('should store the word', () => {
      wordDisplay.setWord('cat');

      // Word should be stored internally for sentence replacement
      wordDisplay.setSentence('The cat is sleeping.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toContain('___');
    });

    it('should not display the word directly', () => {
      wordDisplay.setWord('wizard');

      const shadowContent = wordDisplay.shadowRoot?.textContent || '';

      // The word itself should not appear in the display
      // (We're checking that setWord alone doesn't reveal it)
      expect(shadowContent.toLowerCase()).not.toMatch(/spell.*wizard/);
    });
  });

  describe('setSentence', () => {
    it('should hide word in sentence with underscores', () => {
      wordDisplay.setWord('cat');
      wordDisplay.setSentence('The cat is sleeping.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The ___ is sleeping.');
    });

    it('should handle word at beginning of sentence', () => {
      wordDisplay.setWord('wizard');
      wordDisplay.setSentence('Wizard cast a spell.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('______ cast a spell.');
    });

    it('should handle word at end of sentence', () => {
      wordDisplay.setWord('spell');
      wordDisplay.setSentence('The wizard cast a spell.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The wizard cast a _____.');
    });

    it('should be case insensitive when hiding word', () => {
      wordDisplay.setWord('Cat');
      wordDisplay.setSentence('The CAT is sleeping.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The ___ is sleeping.');
    });

    it('should handle multiple occurrences of word', () => {
      wordDisplay.setWord('the');
      wordDisplay.setSentence('The cat saw the dog.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      // Both "The" and "the" should be replaced
      expect(sentenceText?.textContent).toBe('___ cat saw ___ dog.');
    });

    it('should only replace whole words', () => {
      wordDisplay.setWord('cat');
      wordDisplay.setSentence('The cat is in the category.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      // "cat" should be replaced but "category" should not
      expect(sentenceText?.textContent).toBe('The ___ is in the category.');
    });

    it('should match underscore length to word length', () => {
      wordDisplay.setWord('wizard');
      wordDisplay.setSentence('The wizard is powerful.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      // "wizard" has 6 letters, so should be 6 underscores
      expect(sentenceText?.textContent).toBe('The ______ is powerful.');
      expect(sentenceText?.textContent?.match(/_+/)?.[0].length).toBe(6);
    });

    it('should handle possessive forms', () => {
      wordDisplay.setWord('cat');
      wordDisplay.setSentence("The wizard's cat had orange fur.");

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      // Should replace "cat" but not affect "wizard's"
      expect(sentenceText?.textContent).toBe("The wizard's ___ had orange fur.");
    });

    it('should display sentence normally if no word set', () => {
      wordDisplay.setSentence('The cat is sleeping.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The cat is sleeping.');
    });

    it('should update sentence when called multiple times', () => {
      wordDisplay.setWord('dog');
      wordDisplay.setSentence('The dog is barking.');

      let sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The ___ is barking.');

      wordDisplay.setSentence('The dog ran away.');
      sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The ___ ran away.');
    });
  });

  describe('integration', () => {
    it('should work with typical game scenario', () => {
      // Simulate a typical game flow
      wordDisplay.setWord('crystal');
      wordDisplay.setSentence('The wizard found a crystal in the cave.');

      const sentenceText = wordDisplay.shadowRoot?.querySelector('.sentence-text');
      expect(sentenceText?.textContent).toBe('The wizard found a _______ in the cave.');

      // Verify word is hidden
      expect(sentenceText?.textContent?.toLowerCase()).not.toContain('crystal');

      // Verify sentence structure is maintained
      expect(sentenceText?.textContent).toContain('The wizard found a');
      expect(sentenceText?.textContent).toContain('in the cave.');
    });
  });
});
