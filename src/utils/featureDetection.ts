/**
 * Feature Detection
 *
 * Detects browser feature support.
 *
 * TODO: Implement the following:
 * 1. features.speechSynthesis - check if Web Speech API is available
 * 2. features.localStorage - check if localStorage works
 * 3. features.webAudio - check if Web Audio API is available
 * 4. showFeatureWarning() - displays warning for missing features
 */

/**
 * Define features object
 *
 * Steps:
 * 1. speechSynthesis: check 'speechSynthesis' in window
 * 2. localStorage: try to set/get/remove test item, catch errors
 * 3. webAudio: check 'AudioContext' or 'webkitAudioContext' in window
 */
function detectFeatures() {
  const detected = {
    speechSynthesis: 'speechSynthesis' in window,
    localStorage: false,
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
  };

  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    detected.localStorage = true;
  } catch {
    detected.localStorage = false;
  }

  return detected;
}

export const features = detectFeatures();

/**
 * Shows a user-friendly warning when a feature is missing.
 *
 * Steps:
 * 1. Define warnings object:
 *    - speechSynthesis: 'Voice is not available. Words will be shown on screen.'
 *    - localStorage: 'Progress cannot be saved in this browser.'
 * 2. Get warning message for the feature
 * 3. Create a toast element (div with class 'feature-warning')
 * 4. Set textContent to warning message
 * 5. Append to document.body
 * 6. Remove after 5 seconds
 */
export function showFeatureWarning(feature: string): void {
  const warnings: { [key: string]: string } = {
    speechSynthesis: 'Voice is not available. Words will be shown on screen.',
    localStorage: 'Progress cannot be saved in this browser.',
  };

  const message = warnings[feature] || `Feature "${feature}" is not available.`;

  const toast = document.createElement('div');
  toast.className = 'feature-warning';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}
