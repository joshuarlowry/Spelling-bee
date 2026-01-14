/**
 * App Controller
 *
 * Main application controller that ties everything together.
 *
 * TODO: Implement the following:
 * 1. Import all services
 * 2. Import all components
 * 3. Initialize router
 * 4. Register route handlers
 * 5. Initialize error handling
 * 6. Initialize feature detection
 * 7. Create app root element
 */

// Import services
import { router } from './services/Router';
import { audioService } from './services/AudioService';

// Import components
import './components/TitleScreen';
import './components/LevelSelect';
import './components/GameScreen';
import './components/LetterBox';
import './components/WordDisplay';
import './components/CelebrationModal';
import './components/GameHeader';
import './components/HelpButton';
import './components/HearAgainButton';

// Import utilities
import { initErrorHandling } from './utils/errorHandler';
import { features, showFeatureWarning } from './utils/featureDetection';

/**
 * Implement App class
 *
 * Main application controller.
 */
export class App {
  private root: HTMLElement;
  private router = router;
  private audioService = audioService;

  constructor() {
    this.root = document.getElementById('app') || document.body;
    this.init();
  }

  /**
   * Implement init()
   *
   * Initializes the application.
   *
   * Steps:
   * 1. Call initErrorHandling()
   * 2. Check feature support, show warnings if needed
   * 3. Register route handlers with router
   * 4. Initialize services
   */
  private init() {
    initErrorHandling();
    this.checkFeatures();
    this.registerRoutes();
    this.audioService.setEnabled(true);
    this.audioService.preloadSounds();

    // Navigate to title screen
    this.router.navigate('title');
  }

  /**
   * Implement registerRoutes()
   *
   * Registers route handlers.
   *
   * Steps:
   * 1. Register 'title' route -> showTitleScreen()
   * 2. Register 'levels' route -> showLevelSelect()
   * 3. Register 'game' route -> showGameScreen()
   */
  private registerRoutes() {
    this.router.register('title', () => this.showTitleScreen());
    this.router.register('levels', (params) => this.showLevelSelect(params));
    this.router.register('game', (params) => this.showGameScreen(params));
  }

  /**
   * Implement showTitleScreen()
   *
   * Shows the title screen.
   *
   * Steps:
   * 1. Clear root element
   * 2. Create <title-screen> element
   * 3. Append to root
   */
  private showTitleScreen() {
    this.root.innerHTML = '';
    const screen = document.createElement('title-screen');
    this.root.appendChild(screen);
  }

  /**
   * Implement showLevelSelect()
   *
   * Shows the level select screen.
   *
   * Steps:
   * 1. Clear root element
   * 2. Create <level-select> element
   * 3. Set theme-id attribute from params
   * 4. Append to root
   */
  private showLevelSelect(params: any) {
    this.root.innerHTML = '';
    const screen = document.createElement('level-select');
    screen.setAttribute('theme-id', params?.theme || 'fantasy');
    this.root.appendChild(screen);
  }

  /**
   * Implement showGameScreen()
   *
   * Shows the game screen.
   *
   * Steps:
   * 1. Clear root element
   * 2. Create <game-screen> element
   * 3. Set theme-id and level attributes from params
   * 4. Append to root
   */
  private showGameScreen(params: any) {
    this.root.innerHTML = '';
    const screen = document.createElement('game-screen');
    screen.setAttribute('theme-id', params?.theme || 'fantasy');
    screen.setAttribute('level', (params?.level || 1).toString());
    this.root.appendChild(screen);
  }

  /**
   * Implement checkFeatures()
   *
   * Checks browser feature support.
   *
   * Steps:
   * 1. Check features.speechSynthesis, show warning if not supported
   * 2. Check features.localStorage, show warning if not supported
   * 3. Log feature support to console
   */
  private checkFeatures() {
    if (!features.speechSynthesis) {
      showFeatureWarning('speechSynthesis');
    }

    if (!features.localStorage) {
      showFeatureWarning('localStorage');
    }

    console.log('Browser Features:', features);
  }
}
