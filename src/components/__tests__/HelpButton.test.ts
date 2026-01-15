import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HelpButton } from '../HelpButton';
import '../HelpButton'; // Register custom element

// Mock the audio service
vi.mock('../../services/AudioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

describe('HelpButton', () => {
  let button: HelpButton;

  beforeEach(() => {
    button = document.createElement('help-button') as HelpButton;
    document.body.appendChild(button);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(button);
  });

  describe('initialization', () => {
    it('should render with default enabled state', () => {
      const btn = button.shadowRoot?.querySelector('button');
      expect(btn?.disabled).toBe(false);
      expect(btn?.classList.contains('disabled')).toBe(false);
    });
  });

  describe('help-requested event', () => {
    it('should dispatch help-requested event when clicked', () => {
      const helpSpy = vi.fn();
      button.addEventListener('help-requested', helpSpy);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(helpSpy).toHaveBeenCalled();
    });

    it('should dispatch event with composed: true', () => {
      let eventComposed = false;
      button.addEventListener('help-requested', (e) => {
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
      parent.addEventListener('help-requested', () => {
        eventReceived = true;
      });

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(eventReceived).toBe(true);

      // Move button back to document.body for afterEach cleanup
      document.body.appendChild(button);
    });

    it('should play click sound when clicked', async () => {
      const { audioService } = await import('../../services/AudioService');

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(audioService.play).toHaveBeenCalledWith('click');
    });
  });

  describe('setDisabled', () => {
    it('should disable button', () => {
      button.setDisabled(true);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('should enable button', () => {
      button.setDisabled(true);
      button.setDisabled(false);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });

    it('should not dispatch event when disabled', () => {
      const helpSpy = vi.fn();
      button.addEventListener('help-requested', helpSpy);

      button.setDisabled(true);

      const btn = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(helpSpy).not.toHaveBeenCalled();
    });
  });
});
