import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CelebrationModal } from '../CelebrationModal';
import '../CelebrationModal'; // Register custom element

// Mock the audio service
vi.mock('../../services/AudioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

describe('CelebrationModal', () => {
  let modal: CelebrationModal;

  beforeEach(() => {
    modal = document.createElement('celebration-modal') as CelebrationModal;
    document.body.appendChild(modal);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(modal);
  });

  describe('show', () => {
    it('should display modal with correct points', () => {
      modal.show(50);

      const overlay = modal.shadowRoot?.querySelector('.modal-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(false);

      const pointsDisplay = modal.shadowRoot?.querySelector('.points');
      expect(pointsDisplay?.textContent).toBe('+50 points');
    });

    it('should play complete sound', async () => {
      const { audioService } = await import('../../services/AudioService');

      modal.show(100);

      expect(audioService.play).toHaveBeenCalledWith('complete');
    });

    it('should create star particles', () => {
      modal.show(75);

      const particles = modal.shadowRoot?.querySelectorAll('.star-particle');
      expect(particles?.length).toBeGreaterThan(0);
    });

    it('should handle different point values', () => {
      modal.show(0);
      let pointsDisplay = modal.shadowRoot?.querySelector('.points');
      expect(pointsDisplay?.textContent).toBe('+0 points');

      modal.show(999);
      pointsDisplay = modal.shadowRoot?.querySelector('.points');
      expect(pointsDisplay?.textContent).toBe('+999 points');
    });
  });

  describe('hide', () => {
    it('should hide modal', () => {
      modal.show(50);

      const overlay = modal.shadowRoot?.querySelector('.modal-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(false);

      modal.hide();

      expect(overlay?.classList.contains('hidden')).toBe(true);
    });

    it('should clear star particles', () => {
      modal.show(50);

      const particles = modal.shadowRoot?.querySelectorAll('.star-particle');
      expect(particles?.length).toBeGreaterThan(0);

      modal.hide();

      const starBurst = modal.shadowRoot?.querySelector('.star-burst');
      expect(starBurst?.innerHTML).toBe('');
    });
  });

  describe('continue button', () => {
    it('should dispatch continue event when clicked', async () => {
      const continueSpy = vi.fn();
      modal.addEventListener('continue', continueSpy);

      modal.show(50);

      const continueBtn = modal.shadowRoot?.querySelector('.continue-btn') as HTMLButtonElement;
      continueBtn.click();

      expect(continueSpy).toHaveBeenCalled();
    });

    it('should dispatch continue event with composed: true', async () => {
      let eventComposed = false;
      modal.addEventListener('continue', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      modal.show(50);

      const continueBtn = modal.shadowRoot?.querySelector('.continue-btn') as HTMLButtonElement;
      continueBtn.click();

      expect(eventComposed).toBe(true);
    });

    it('should hide modal when continue clicked', async () => {
      modal.show(50);

      const continueBtn = modal.shadowRoot?.querySelector('.continue-btn') as HTMLButtonElement;
      continueBtn.click();

      const overlay = modal.shadowRoot?.querySelector('.modal-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(true);
    });

    it('should play click sound when continue clicked', async () => {
      const { audioService } = await import('../../services/AudioService');

      modal.show(50);

      const continueBtn = modal.shadowRoot?.querySelector('.continue-btn') as HTMLButtonElement;
      continueBtn.click();

      expect(audioService.play).toHaveBeenCalledWith('click');
    });
  });

  describe('event propagation', () => {
    it('should allow continue event to cross shadow DOM boundaries', () => {
      // Create a parent element that will receive the event
      const parent = document.createElement('div');
      parent.appendChild(modal);

      let eventReceived = false;
      parent.addEventListener('continue', () => {
        eventReceived = true;
      });

      modal.show(50);

      const continueBtn = modal.shadowRoot?.querySelector('.continue-btn') as HTMLButtonElement;
      continueBtn.click();

      // Event should bubble up and cross shadow DOM boundary
      expect(eventReceived).toBe(true);

      // Move modal back to document.body for afterEach cleanup
      document.body.appendChild(modal);
    });
  });

  describe('animations', () => {
    it.skip('should have animated modal content', () => {
      // Skipped: CSS animations don't work properly in jsdom
      modal.show(50);

      const modalContent = modal.shadowRoot?.querySelector('.modal-content');
      const styles = window.getComputedStyle(modalContent as Element);

      // Check that animation is defined (it has the celebrate animation)
      expect(styles.animationName).toBeTruthy();
    });

    it.skip('should animate star particles', () => {
      // Skipped: CSS animations don't work properly in jsdom
      modal.show(50);

      const particles = modal.shadowRoot?.querySelectorAll('.star-particle');
      expect(particles?.length).toBeGreaterThan(0);

      particles?.forEach((particle) => {
        const styles = window.getComputedStyle(particle as Element);
        expect(styles.animationName).toBeTruthy();
      });
    });
  });
});
