import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpeechService } from '../SpeechService';

// Mock the Web Speech API
const mockUtterance = {
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  onend: null as ((event: any) => void) | null,
  onerror: null as ((event: any) => void) | null,
  onboundary: null as ((event: any) => void) | null,
};

const mockSynth = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => [
    {
      name: 'Google US English',
      lang: 'en-US',
      default: false,
      localService: false,
      voiceURI: 'Google US English',
    },
  ]),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

global.SpeechSynthesisUtterance = vi.fn(() => mockUtterance) as any;
Object.defineProperty(global.window, 'speechSynthesis', {
  writable: true,
  value: mockSynth,
});

describe('SpeechService', () => {
  let service: SpeechService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SpeechService();
  });

  describe('isSupported', () => {
    it('should return true when speechSynthesis is available', () => {
      expect(service.isSupported).toBe(true);
    });
  });

  describe('speak', () => {
    it('should call speechSynthesis.speak', async () => {
      const promise = service.speak('Hello');

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;

      expect(mockSynth.speak).toHaveBeenCalled();
    });

    it('should cancel ongoing speech before speaking', async () => {
      const promise = service.speak('Hello');

      expect(mockSynth.cancel).toHaveBeenCalled();

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should use default rate and pitch', async () => {
      const promise = service.speak('Hello');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.1);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should use custom rate and pitch from options', async () => {
      const promise = service.speak('Hello', { rate: 1.0, pitch: 1.5 });

      expect(mockUtterance.rate).toBe(1.0);
      expect(mockUtterance.pitch).toBe(1.5);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should resolve on interrupted error', async () => {
      const promise = service.speak('Hello');

      // Simulate interrupted error (should resolve, not reject)
      if (mockUtterance.onerror) {
        mockUtterance.onerror({ error: 'interrupted' } as any);
      }

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject on other errors', async () => {
      const promise = service.speak('Hello');

      // Simulate other error
      if (mockUtterance.onerror) {
        mockUtterance.onerror({ error: 'network' } as any);
      }

      await expect(promise).rejects.toThrow('Speech error: network');
    });
  });

  describe('speakWord', () => {
    it('should speak word with correct format', async () => {
      const promise = service.speakWord('cat');

      // Check the utterance was created with correct text
      expect(SpeechSynthesisUtterance).toHaveBeenCalledWith('Spell the word: cat');

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should use correct rate and pitch', async () => {
      const promise = service.speakWord('dog');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.1);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });
  });

  describe('speakSentence', () => {
    it('should speak sentence directly', async () => {
      const sentence = 'The cat is sleeping.';
      const promise = service.speakSentence(sentence);

      expect(SpeechSynthesisUtterance).toHaveBeenCalledWith(sentence);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should use correct rate and pitch', async () => {
      const promise = service.speakSentence('Test sentence');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.0);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });
  });

  describe('speakLetter', () => {
    it('should speak letter in lowercase', async () => {
      const promise = service.speakLetter('C');

      // Should speak lowercase 'c', not uppercase 'C' which would say "Capital C"
      expect(SpeechSynthesisUtterance).toHaveBeenCalledWith('c');

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should handle already lowercase letter', async () => {
      const promise = service.speakLetter('a');

      expect(SpeechSynthesisUtterance).toHaveBeenCalledWith('a');

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should use slower rate for clarity', async () => {
      const promise = service.speakLetter('t');

      expect(mockUtterance.rate).toBe(0.7);
      expect(mockUtterance.pitch).toBe(1.0);

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });

    it('should not say "Capital" before letter', async () => {
      // This is the key test for our fix
      const promise = service.speakLetter('Z');

      // Should speak 'z', not 'Z' (which would make speech API say "Capital Z")
      const utteranceCall = (SpeechSynthesisUtterance as any).mock.calls[
        (SpeechSynthesisUtterance as any).mock.calls.length - 1
      ];
      expect(utteranceCall[0]).toBe('z');
      expect(utteranceCall[0]).not.toBe('Z');

      // Simulate successful speech
      if (mockUtterance.onend) {
        mockUtterance.onend({} as any);
      }

      await promise;
    });
  });

  describe('stop', () => {
    it('should cancel ongoing speech', () => {
      service.stop();

      expect(mockSynth.cancel).toHaveBeenCalled();
    });
  });
});
