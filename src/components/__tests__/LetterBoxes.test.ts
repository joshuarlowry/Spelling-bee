import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LetterBoxes } from '../LetterBoxes';
import '../LetterBox'; // Register custom element

// Mock the audio and speech services
vi.mock('../../services/AudioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

vi.mock('../../services/SpeechService', () => ({
  speechService: {
    speak: vi.fn().mockResolvedValue(undefined),
    speakLetter: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('LetterBoxes', () => {
  let container: HTMLElement;
  let letterBoxes: LetterBoxes;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (letterBoxes) {
      letterBoxes.reset();
    }
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create letter boxes for each letter in word', () => {
      letterBoxes = new LetterBoxes('cat', container);

      const boxes = container.querySelectorAll('letter-box');
      expect(boxes.length).toBe(3);
    });

    it('should set correct letter attribute on each box', () => {
      letterBoxes = new LetterBoxes('dog', container);

      const boxes = container.querySelectorAll('letter-box');
      expect(boxes[0]?.getAttribute('letter')).toBe('d');
      expect(boxes[1]?.getAttribute('letter')).toBe('o');
      expect(boxes[2]?.getAttribute('letter')).toBe('g');
    });

    it('should set index attribute on each box', () => {
      letterBoxes = new LetterBoxes('cat', container);

      const boxes = container.querySelectorAll('letter-box');
      expect(boxes[0]?.getAttribute('index')).toBe('0');
      expect(boxes[1]?.getAttribute('index')).toBe('1');
      expect(boxes[2]?.getAttribute('index')).toBe('2');
    });
  });

  describe('event handling', () => {
    it('should play audio on correct letter', async () => {
      const { audioService } = await import('../../services/AudioService');
      letterBoxes = new LetterBoxes('cat', container);

      const firstBox = container.querySelector('letter-box');
      firstBox?.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: 0 },
          bubbles: true,
          composed: true,
        })
      );

      expect(audioService.play).toHaveBeenCalledWith('correct');
    });

    it('should speak letter on correct input', async () => {
      const { speechService } = await import('../../services/SpeechService');
      letterBoxes = new LetterBoxes('cat', container);

      const firstBox = container.querySelector('letter-box');
      firstBox?.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: 0 },
          bubbles: true,
          composed: true,
        })
      );

      expect(speechService.speakLetter).toHaveBeenCalledWith('c');
    });

    it('should play audio on incorrect letter', async () => {
      const { audioService } = await import('../../services/AudioService');
      letterBoxes = new LetterBoxes('cat', container);

      const firstBox = container.querySelector('letter-box');
      firstBox?.dispatchEvent(
        new CustomEvent('letter-incorrect', {
          bubbles: true,
          composed: true,
        })
      );

      expect(audioService.play).toHaveBeenCalledWith('incorrect');
    });

    it('should speak "Try again" on incorrect letter', async () => {
      const { speechService } = await import('../../services/SpeechService');
      letterBoxes = new LetterBoxes('cat', container);

      const firstBox = container.querySelector('letter-box');
      firstBox?.dispatchEvent(
        new CustomEvent('letter-incorrect', {
          bubbles: true,
          composed: true,
        })
      );

      expect(speechService.speak).toHaveBeenCalledWith('Try again');
    });
  });

  describe('word completion', () => {
    it('should dispatch word-complete event when all letters revealed', () => {
      letterBoxes = new LetterBoxes('cat', container);

      const wordCompleteSpy = vi.fn();
      container.addEventListener('word-complete', wordCompleteSpy);

      // Simulate all boxes being revealed
      const boxes = container.querySelectorAll('letter-box');
      boxes.forEach((box, index) => {
        const input = box.shadowRoot?.querySelector('input') as HTMLInputElement;
        if (input) {
          input.value = 'cat'[index] || '';
          input.disabled = true;
        }
      });

      // Trigger completion check
      boxes[boxes.length - 1]?.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: boxes.length - 1 },
          bubbles: true,
          composed: true,
        })
      );

      expect(wordCompleteSpy).toHaveBeenCalled();
    });

    it('should dispatch word-complete with composed: true', () => {
      letterBoxes = new LetterBoxes('at', container);

      let eventComposed = false;
      container.addEventListener('word-complete', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      // Simulate all boxes being revealed
      const boxes = container.querySelectorAll('letter-box');
      boxes.forEach((box, index) => {
        const input = box.shadowRoot?.querySelector('input') as HTMLInputElement;
        if (input) {
          input.value = 'at'[index] || '';
          input.disabled = true;
        }
      });

      // Trigger completion check
      boxes[boxes.length - 1]?.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: boxes.length - 1 },
          bubbles: true,
          composed: true,
        })
      );

      expect(eventComposed).toBe(true);
    });

    it('should not dispatch word-complete if not all letters revealed', () => {
      letterBoxes = new LetterBoxes('cat', container);

      const wordCompleteSpy = vi.fn();
      container.addEventListener('word-complete', wordCompleteSpy);

      // Only reveal first box
      const firstBox = container.querySelector('letter-box');
      firstBox?.dispatchEvent(
        new CustomEvent('letter-correct', {
          detail: { index: 0 },
          bubbles: true,
          composed: true,
        })
      );

      expect(wordCompleteSpy).not.toHaveBeenCalled();
    });
  });

  describe('revealAll', () => {
    it('should reveal all letters in sequence', async () => {
      const { speechService } = await import('../../services/SpeechService');
      letterBoxes = new LetterBoxes('cat', container);

      await letterBoxes.revealAll();

      const boxes = container.querySelectorAll('letter-box');
      boxes.forEach((box) => {
        const input = box.shadowRoot?.querySelector('input') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(input.value).toBeTruthy();
      });

      expect(speechService.speakLetter).toHaveBeenCalledTimes(3);
    });

    it('should dispatch word-complete after revealing all', async () => {
      letterBoxes = new LetterBoxes('cat', container);

      const wordCompleteSpy = vi.fn();
      container.addEventListener('word-complete', wordCompleteSpy);

      await letterBoxes.revealAll();

      expect(wordCompleteSpy).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should remove container from DOM', () => {
      letterBoxes = new LetterBoxes('cat', container);

      const boxesContainer = container.querySelector('.letter-boxes-container');
      expect(boxesContainer).toBeTruthy();

      letterBoxes.reset();

      const boxesContainerAfter = container.querySelector('.letter-boxes-container');
      expect(boxesContainerAfter).toBeNull();
    });
  });
});
