import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LetterBox } from '../LetterBox';
import '../LetterBox'; // Register custom element

describe('LetterBox', () => {
  let letterBox: LetterBox;

  beforeEach(() => {
    // Create a new letter box for each test
    letterBox = document.createElement('letter-box') as LetterBox;
    document.body.appendChild(letterBox);
  });

  afterEach(() => {
    document.body.removeChild(letterBox);
  });

  describe('attributeChangedCallback', () => {
    it('should update correctLetter when letter attribute changes', () => {
      letterBox.setAttribute('letter', 'c');

      // Get the private correctLetter property by testing behavior
      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'c';
      input.dispatchEvent(new Event('input'));

      // Should not trigger incorrect event if letter is correct
      const incorrectSpy = vi.fn();
      letterBox.addEventListener('letter-incorrect', incorrectSpy);

      input.dispatchEvent(new Event('input'));

      // The correct letter should be 'c', not undefined
      expect(incorrectSpy).not.toHaveBeenCalled();
    });

    it('should handle letter attribute set after creation', () => {
      // Set letter attribute after element is created
      letterBox.setAttribute('letter', 'a');
      letterBox.setAttribute('index', '0');

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'a';

      // Dispatch input event
      const correctSpy = vi.fn();
      letterBox.addEventListener('letter-correct', correctSpy);

      input.dispatchEvent(new Event('input'));

      // Should trigger correct event
      expect(correctSpy).toHaveBeenCalled();
    });

    it('should be case insensitive', () => {
      letterBox.setAttribute('letter', 'C');

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'c';

      const correctSpy = vi.fn();
      letterBox.addEventListener('letter-correct', correctSpy);

      input.dispatchEvent(new Event('input'));

      expect(correctSpy).toHaveBeenCalled();
    });
  });

  describe('event propagation', () => {
    it('should dispatch letter-correct event with composed: true', async () => {
      letterBox.setAttribute('letter', 't');
      letterBox.setAttribute('index', '0');

      let eventComposed = false;
      letterBox.addEventListener('letter-correct', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 't';
      input.dispatchEvent(new Event('input'));

      expect(eventComposed).toBe(true);
    });

    it('should dispatch letter-incorrect event with composed: true', async () => {
      letterBox.setAttribute('letter', 't');
      letterBox.setAttribute('index', '0');

      let eventComposed = false;
      letterBox.addEventListener('letter-incorrect', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'x'; // wrong letter
      input.dispatchEvent(new Event('input'));

      expect(eventComposed).toBe(true);
    });

    it('should dispatch focus-previous event with composed: true', async () => {
      letterBox.setAttribute('letter', 't');
      letterBox.setAttribute('index', '1');

      let eventComposed = false;
      letterBox.addEventListener('focus-previous', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      expect(eventComposed).toBe(true);
    });
  });

  describe('input handling', () => {
    it('should accept correct letter', () => {
      letterBox.setAttribute('letter', 'a');
      letterBox.setAttribute('index', '0');

      const correctSpy = vi.fn();
      letterBox.addEventListener('letter-correct', correctSpy);

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'a';
      input.dispatchEvent(new Event('input'));

      expect(correctSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ index: 0 })
        })
      );
    });

    it('should reject incorrect letter', () => {
      letterBox.setAttribute('letter', 'a');
      letterBox.setAttribute('index', '0');

      const incorrectSpy = vi.fn();
      letterBox.addEventListener('letter-incorrect', incorrectSpy);

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'b';
      input.dispatchEvent(new Event('input'));

      expect(incorrectSpy).toHaveBeenCalled();
      expect(input.value).toBe(''); // Should clear incorrect input
    });

    it('should reveal letter when reveal() is called', () => {
      letterBox.setAttribute('letter', 'z');

      letterBox.reveal();

      const input = letterBox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('z');
      expect(input.disabled).toBe(true);
    });
  });
});
