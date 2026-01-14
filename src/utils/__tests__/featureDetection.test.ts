import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { features, showFeatureWarning } from '../featureDetection';

describe('Feature Detection', () => {
  describe('features object', () => {
    it('should have a speechSynthesis property', () => {
      expect(features).toHaveProperty('speechSynthesis');
      expect(typeof features.speechSynthesis).toBe('boolean');
    });

    it('should have a localStorage property', () => {
      expect(features).toHaveProperty('localStorage');
      expect(typeof features.localStorage).toBe('boolean');
    });

    it('should have a webAudio property', () => {
      expect(features).toHaveProperty('webAudio');
      expect(typeof features.webAudio).toBe('boolean');
    });
  });

  describe('showFeatureWarning', () => {
    beforeEach(() => {
      // Clean up any existing toasts
      document.querySelectorAll('.feature-warning').forEach(el => el.remove());
    });

    afterEach(() => {
      // Clean up
      document.querySelectorAll('.feature-warning').forEach(el => el.remove());
    });

    it('should create a toast element with correct class', (done) => {
      showFeatureWarning('speechSynthesis');

      const toast = document.querySelector('.feature-warning');
      expect(toast).toBeTruthy();
      expect(toast?.className).toBe('feature-warning');

      // Clean up before assertion timeout
      setTimeout(() => {
        expect(document.querySelector('.feature-warning')).toBeFalsy();
        done();
      }, 5100);
    });

    it('should display correct message for speechSynthesis', () => {
      showFeatureWarning('speechSynthesis');

      const toast = document.querySelector('.feature-warning');
      expect(toast?.textContent).toBe('Voice is not available. Words will be shown on screen.');
    });

    it('should display correct message for localStorage', () => {
      showFeatureWarning('localStorage');

      const toast = document.querySelector('.feature-warning');
      expect(toast?.textContent).toBe('Progress cannot be saved in this browser.');
    });

    it('should display generic message for unknown feature', () => {
      showFeatureWarning('unknownFeature');

      const toast = document.querySelector('.feature-warning');
      expect(toast?.textContent).toBe('Feature "unknownFeature" is not available.');
    });

    it('should remove toast after 5 seconds', (done) => {
      showFeatureWarning('speechSynthesis');

      expect(document.querySelector('.feature-warning')).toBeTruthy();

      setTimeout(() => {
        expect(document.querySelector('.feature-warning')).toBeFalsy();
        done();
      }, 5100);
    });

    it('should append toast to document.body', () => {
      showFeatureWarning('speechSynthesis');

      const toast = document.querySelector('.feature-warning');
      expect(toast?.parentElement).toBe(document.body);
    });
  });
});
