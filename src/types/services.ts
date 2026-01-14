/**
 * Service-related Types
 *
 * Types used by service classes.
 */

// TODO: Define SpeechOptions interface
// Options passed to speech synthesis
// Should include:
// - rate?: number (speaking rate, default 0.85)
// - pitch?: number (voice pitch, default 1.1)
// - onBoundary?: (charIndex: number) => void (callback for word boundaries)
export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  onBoundary?: (charIndex: number) => void;
}

// TODO: Define SoundName type
// Valid sound effect names
// Should be: 'correct' | 'incorrect' | 'complete' | 'levelup' | 'click'
export type SoundName = 'correct' | 'incorrect' | 'complete' | 'levelup' | 'click';
