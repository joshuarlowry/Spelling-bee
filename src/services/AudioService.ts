/**
 * Audio Service
 *
 * Handles sound effects using Howler.js.
 *
 * IMPLEMENTATION TASKS:
 * 1. Import Howl and Howler from 'howler'
 * 2. Import SoundName from types
 * 3. Implement constructor - call preloadSounds()
 * 4. Implement preloadSounds() - create Howl instances for all sounds
 * 5. Implement play() - plays a sound effect
 * 6. Implement setEnabled() - toggle sounds on/off
 * 7. Add isEnabled getter
 */

// TODO: Import { Howl, Howler } from 'howler'
// TODO: Import SoundName from '../types/services'

export class AudioService {
  private sounds: Map<string, any> = new Map(); // Replace 'any' with Howl
  private enabled: boolean = true;

  constructor() {
    /**
     * TODO: Initialize audio service
     *
     * Steps:
     * 1. Call this.preloadSounds()
     */
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement preloadSounds()
   *
   * Preloads all sound effects.
   *
   * Steps:
   * 1. Define soundFiles object with SoundName keys:
   *    - correct: '/audio/correct.mp3'
   *    - incorrect: '/audio/incorrect.mp3'
   *    - complete: '/audio/complete.mp3'
   *    - levelup: '/audio/levelup.mp3'
   *    - click: '/audio/click.mp3'
   * 2. Loop through soundFiles entries
   * 3. For each sound, create new Howl({
   *      src: [src],
   *      preload: true,
   *      volume: (name === 'incorrect' ? 0.5 : 0.7)
   *    })
   * 4. Store in this.sounds Map with name as key
   */
  private preloadSounds(): void {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement play()
   *
   * Plays a sound effect.
   *
   * Steps:
   * 1. Check if this.enabled, return early if not
   * 2. Get Howl from this.sounds Map
   * 3. If found, call howl.play()
   */
  play(sound: string): void {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement setEnabled()
   *
   * Enables or disables sound effects.
   *
   * Steps:
   * 1. Set this.enabled to enabled parameter
   * 2. Call Howler.mute(!enabled) to mute all sounds
   */
  setEnabled(enabled: boolean): void {
    throw new Error('Not implemented');
  }

  /**
   * TODO: Implement isEnabled getter
   *
   * Returns whether sounds are enabled.
   *
   * Steps:
   * 1. Return this.enabled
   */
  get isEnabled(): boolean {
    throw new Error('Not implemented');
  }
}

// Export singleton instance
export const audioService = new AudioService();
