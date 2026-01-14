/**
 * Main Entry Point
 *
 * Application entry point.
 *
 * TODO: Implement the following:
 * 1. Import styles
 * 2. Import App controller
 * 3. Initialize app on DOMContentLoaded
 */

import './styles/variables.css';
import './styles/main.css';
import './styles/animations.css';
import './styles/components.css';

import { App } from './app';

/**
 * Initialize app
 *
 * Steps:
 * 1. Wait for DOMContentLoaded event
 * 2. Create new App instance
 * 3. Log startup message to console
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🐝 Spelling Bee Game Starting...');
  new App();
});
