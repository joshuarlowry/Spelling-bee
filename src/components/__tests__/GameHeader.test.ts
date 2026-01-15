import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameHeader } from '../GameHeader';
import '../GameHeader'; // Register custom element

// Mock the audio service
vi.mock('../../services/AudioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

describe('GameHeader', () => {
  let header: GameHeader;

  beforeEach(async () => {
    header = document.createElement('game-header') as GameHeader;
    document.body.appendChild(header);
    // Wait for connectedCallback and rendering - use double rAF for better browser compat
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(header);
  });

  describe('initialization', () => {
    it('should render with default values', () => {
      const shadowRoot = header.shadowRoot;
      expect(shadowRoot).toBeTruthy();

      const backBtn = shadowRoot?.querySelector('.back-btn');
      expect(backBtn).toBeTruthy();

      const progressText = shadowRoot?.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('0 / 0');

      const scoreText = shadowRoot?.querySelector('.score-text');
      expect(scoreText?.textContent).toContain('0');
    });
  });

  describe('updateProgress', () => {
    it('should update progress display', () => {
      header.updateProgress(3, 10);

      const progressText = header.shadowRoot?.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('3');
      expect(progressText?.textContent).toContain('10');
    });

    it('should handle first word', () => {
      header.updateProgress(1, 5);

      const progressText = header.shadowRoot?.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('1');
    });

    it('should handle last word', () => {
      header.updateProgress(10, 10);

      const progressText = header.shadowRoot?.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('10 / 10');
    });
  });

  describe('updateScore', () => {
    it('should update score display', () => {
      header.updateScore(150);

      const scoreText = header.shadowRoot?.querySelector('.score-text');
      expect(scoreText?.textContent).toContain('150');
    });

    it('should handle zero score', () => {
      header.updateScore(0);

      const scoreText = header.shadowRoot?.querySelector('.score-text');
      expect(scoreText?.textContent).toContain('0');
    });

    it('should handle large scores', () => {
      header.updateScore(9999);

      const scoreText = header.shadowRoot?.querySelector('.score-text');
      expect(scoreText?.textContent).toContain('9999');
    });
  });

  describe('back button', () => {
    it('should dispatch back event when clicked', async () => {
      const backSpy = vi.fn();
      header.addEventListener('back', backSpy);

      const backBtn = header.shadowRoot?.querySelector('.back-btn') as HTMLButtonElement;
      expect(backBtn).toBeTruthy(); // Ensure button exists
      backBtn?.click();

      expect(backSpy).toHaveBeenCalled();
    });

    it('should dispatch back event with composed: true', async () => {
      let eventComposed = false;
      header.addEventListener('back', (e) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const backBtn = header.shadowRoot?.querySelector('.back-btn') as HTMLButtonElement;
      expect(backBtn).toBeTruthy(); // Ensure button exists
      backBtn?.click();

      expect(eventComposed).toBe(true);
    });

    it('should play click sound when back button clicked', async () => {
      const { audioService } = await import('../../services/AudioService');

      const backBtn = header.shadowRoot?.querySelector('.back-btn') as HTMLButtonElement;
      expect(backBtn).toBeTruthy(); // Ensure button exists
      backBtn?.click();

      expect(audioService.play).toHaveBeenCalledWith('click');
    });

    it('should allow back event to cross shadow DOM boundaries', () => {
      // Create a parent element that will receive the event
      const parent = document.createElement('div');
      parent.appendChild(header);

      let eventReceived = false;
      parent.addEventListener('back', () => {
        eventReceived = true;
      });

      const backBtn = header.shadowRoot?.querySelector('.back-btn') as HTMLButtonElement;
      expect(backBtn).toBeTruthy(); // Ensure button exists
      backBtn?.click();

      // Event should bubble up and cross shadow DOM boundary
      expect(eventReceived).toBe(true);

      parent.removeChild(header);
    });
  });

  describe('integration', () => {
    it('should update both progress and score', () => {
      header.updateProgress(5, 10);
      header.updateScore(250);

      const progressText = header.shadowRoot?.querySelector('.progress-text');
      const scoreText = header.shadowRoot?.querySelector('.score-text');

      expect(progressText?.textContent).toContain('5');
      expect(progressText?.textContent).toContain('10');
      expect(scoreText?.textContent).toContain('250');
    });

    it('should maintain state across multiple updates', () => {
      header.updateProgress(1, 5);
      header.updateScore(50);

      header.updateProgress(2, 5);
      header.updateScore(100);

      header.updateProgress(3, 5);
      header.updateScore(150);

      const progressText = header.shadowRoot?.querySelector('.progress-text');
      const scoreText = header.shadowRoot?.querySelector('.score-text');

      expect(progressText?.textContent).toContain('3');
      expect(scoreText?.textContent).toContain('150');
    });
  });
});
