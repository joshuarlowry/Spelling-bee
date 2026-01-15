import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpeechService } from '../SpeechService';

// Mock the Web Speech API
const mockUtterance = {
  text: '',
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  onend: null as ((event: any) => void) | null,
  onerror: null as ((event: any) => void) | null,
  onboundary: null as ((event: any) => void) | null,
};

const mockSynth = {
  speak: vi.fn((utterance: any) => {
    // Trigger onend callback asynchronously to simulate real behavior
    setTimeout(() => {
      if (utterance.onend) {
        utterance.onend({} as any);
      }
    }, 0);
  }),
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

// Set up mocks before importing
globalThis.SpeechSynthesisUtterance = vi.fn((text: string) => {
  mockUtterance.text = text;
  return mockUtterance;
}) as any;

// Ensure window exists and has speechSynthesis
if (!globalThis.window) {
  (globalThis as any).window = {};
}

Object.defineProperty(globalThis.window, 'speechSynthesis', {
  writable: true,
  configurable: true,
  value: mockSynth,
});

describe('SpeechService', () => {
  let service: SpeechService;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset getVoices mock to return voices
    mockSynth.getVoices.mockReturnValue([
      {
        name: 'Google US English',
        lang: 'en-US',
        default: false,
        localService: false,
        voiceURI: 'Google US English',
      },
    ]);

    service = new SpeechService();
    // Wait for initVoice to complete
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  describe('isSupported', () => {
    it('should return true when speechSynthesis is available', () => {
      expect(service.isSupported).toBe(true);
    });
  });

  describe('speak', () => {
    it('should call speechSynthesis.speak', async () => {
      await service.speak('Hello');

      expect(mockSynth.speak).toHaveBeenCalled();
    });

    it('should cancel ongoing speech before speaking', async () => {
      await service.speak('Hello');

      expect(mockSynth.cancel).toHaveBeenCalled();
    });

    it('should use default rate and pitch', async () => {
      await service.speak('Hello');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.1);
    });

    it('should use custom rate and pitch from options', async () => {
      await service.speak('Hello', { rate: 1.0, pitch: 1.5 });

      expect(mockUtterance.rate).toBe(1.0);
      expect(mockUtterance.pitch).toBe(1.5);
    });

    it('should resolve on interrupted error', async () => {
      // Override speak to trigger interrupted error
      mockSynth.speak.mockImplementationOnce((utterance: any) => {
        setTimeout(() => {
          if (utterance.onerror) {
            utterance.onerror({ error: 'interrupted' } as any);
          }
        }, 0);
      });

      await expect(service.speak('Hello')).resolves.toBeUndefined();
    });

    it('should reject on other errors', async () => {
      // Override speak to trigger error
      mockSynth.speak.mockImplementationOnce((utterance: any) => {
        setTimeout(() => {
          if (utterance.onerror) {
            utterance.onerror({ error: 'network' } as any);
          }
        }, 0);
      });

      await expect(service.speak('Hello')).rejects.toThrow('Speech error: network');
    });
  });

  describe('speakWord', () => {
    it('should speak word with correct format', async () => {
      await service.speakWord('cat');

      // Check the utterance was created with correct text
      expect(mockUtterance.text).toBe('Spell the word: cat');
    });

    it('should use correct rate and pitch', async () => {
      await service.speakWord('dog');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.1);
    });
  });

  describe('speakSentence', () => {
    it('should speak sentence directly', async () => {
      const sentence = 'The cat is sleeping.';
      await service.speakSentence(sentence);

      expect(mockUtterance.text).toBe(sentence);
    });

    it('should use correct rate and pitch', async () => {
      await service.speakSentence('Test sentence');

      expect(mockUtterance.rate).toBe(0.85);
      expect(mockUtterance.pitch).toBe(1.0);
    });
  });

  describe('speakLetter', () => {
    it('should speak letter in lowercase', async () => {
      await service.speakLetter('C');

      // Should speak lowercase 'c', not uppercase 'C' which would say "Capital C"
      expect(mockUtterance.text).toBe('c');
    });

    it('should handle already lowercase letter', async () => {
      await service.speakLetter('a');

      expect(mockUtterance.text).toBe('a');
    });

    it('should use slower rate for clarity', async () => {
      await service.speakLetter('t');

      expect(mockUtterance.rate).toBe(0.7);
      expect(mockUtterance.pitch).toBe(1.0);
    });

    it('should not say "Capital" before letter', async () => {
      // This is the key test for our fix
      await service.speakLetter('Z');

      // Should speak 'z', not 'Z' (which would make speech API say "Capital Z")
      expect(mockUtterance.text).toBe('z');
      expect(mockUtterance.text).not.toBe('Z');
    });
  });

  describe('stop', () => {
    it('should cancel ongoing speech', () => {
      service.stop();

      expect(mockSynth.cancel).toHaveBeenCalled();
    });
  });
});
