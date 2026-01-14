import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HearAgainButton } from '../HearAgainButton';
import '../HearAgainButton'; // Register custom element

// Mock the audio service
vi.mock('../../services/AudioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

describe('HearAgainButton', () => {
  let button: HearAgainButton;

  beforeEach(() => {
    button = document.createElement('hear-again-button') as HearAgainButton;
    document.body.appendChild(button);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(button);
  });

  describe('initialization', () => {
    it('should render button', () => {
      const btn = button.shadowRoot?.querySelector('button');
      expect(btn).toBeTruthy();
      expect(btn?.textContent).toContain('Hear Again');
    });
  });

  describe('hear-again event', () => {
    it('should dispatch hear-again event when clicked', () => {
      const hearAgainSpy = vi.fn();
      button.addEventListener('hear-again', hearAgainSpy);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(hearAgainSpy).toHaveBeenCalled();
    });

    it('should dispatch event with composed: true', () => {
      let eventComposed = false;
      button.addEventListener('hear-again', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(eventComposed).toBe(true);
    });

    it('should allow event to cross shadow DOM boundaries', () => {
      const parent = document.createElement('div');
      parent.appendChild(button);

      let eventReceived = false;
      parent.addEventListener('hear-again', () => {
        eventReceived = true;
      });

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(eventReceived).toBe(true);

      parent.removeChild(button);
    });

    it('should play click sound when clicked', async () => {
      const { audioService } = await import('../../services/AudioService');

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(audioService.play).toHaveBeenCalledWith('click');
    });
  });

  describe('multiple clicks', () => {
    it('should dispatch event on each click', () => {
      const hearAgainSpy = vi.fn();
      button.addEventListener('hear-again', hearAgainSpy);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;

      btn.click();
      btn.click();
      btn.click();

      expect(hearAgainSpy).toHaveBeenCalledTimes(3);
    });
  });
});
