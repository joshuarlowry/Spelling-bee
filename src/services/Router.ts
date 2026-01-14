/**
 * Router
 *
 * Simple hash-based router for navigation.
 *
 * IMPLEMENTATION TASKS:
 * 1. Import Route, RouteParams, RouteHandler from types
 * 2. Implement constructor - setup event listeners
 * 3. Implement register() - register route handlers
 * 4. Implement navigate() - navigate to a route
 * 5. Implement buildHash() - construct hash from route/params
 * 6. Implement parseHash() - parse hash into route/params
 * 7. Implement handleRoute() - call appropriate handler
 */

import { Route, RouteParams, RouteHandler } from '../types/router';

export class Router {
  private routes: Map<Route, RouteHandler> = new Map();
  private currentRoute: Route = 'title';

  constructor() {
    /**
     * Setup router
     *
     * Steps:
     * 1. Add 'hashchange' event listener that calls this.handleRoute()
     * 2. Add 'load' event listener that calls this.handleRoute()
     */
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Registers a route handler.
   *
   * Steps:
   * 1. Add to this.routes Map: this.routes.set(route, handler)
   */
  register(route: Route, handler: RouteHandler): void {
    this.routes.set(route, handler);
  }

  /**
   * Navigates to a route.
   *
   * Steps:
   * 1. Build hash string: const hash = this.buildHash(route, params)
   * 2. Set window.location.hash = hash
   */
  navigate(route: Route, params: RouteParams = {}): void {
    const hash = this.buildHash(route, params);
    window.location.hash = hash;
  }

  /**
   * Constructs hash string from route and params.
   *
   * Steps:
   * 1. Switch on route:
   *    - 'title': return '#/'
   *    - 'levels': return `#/theme/${params.theme}`
   *    - 'game': return `#/theme/${params.theme}/level/${params.level}`
   *    - default: return '#/'
   */
  private buildHash(route: Route, params: RouteParams): string {
    switch (route) {
      case 'title':
        return '#/';
      case 'levels':
        return `#/theme/${params.theme}`;
      case 'game':
        return `#/theme/${params.theme}/level/${params.level}`;
      default:
        return '#/';
    }
  }

  /**
   * Handles route changes.
   *
   * Steps:
   * 1. Get hash: const hash = window.location.hash || '#/'
   * 2. Parse hash: const { route, params } = this.parseHash(hash)
   * 3. Set this.currentRoute = route
   * 4. Get handler from this.routes Map
   * 5. If handler exists, call handler(params)
   */
  private handleRoute(): void {
    const hash = window.location.hash || '#/';
    const { route, params } = this.parseHash(hash);
    this.currentRoute = route;

    const handler = this.routes.get(route);
    if (handler) {
      handler(params);
    }
  }

  /**
   * Parses hash string into route and params.
   *
   * Steps:
   * 1. Use regex to match hash pattern: /^#\/(?:theme\/(\w+)(?:\/level\/(\d+))?)?$/
   * 2. If no match, return { route: 'title', params: {} }
   * 3. Extract theme and level from match groups
   * 4. If level exists: return { route: 'game', params: { theme, level: parseInt(level) } }
   * 5. If theme exists: return { route: 'levels', params: { theme } }
   * 6. Otherwise: return { route: 'title', params: {} }
   */
  private parseHash(hash: string): { route: Route; params: RouteParams } {
    const match = hash.match(/^#\/(?:theme\/(\w+)(?:\/level\/(\d+))?)?$/);

    if (!match) {
      return { route: 'title', params: {} };
    }

    const [, theme, level] = match;

    if (level) {
      return { route: 'game', params: { theme, level: parseInt(level, 10) } };
    }

    if (theme) {
      return { route: 'levels', params: { theme } };
    }

    return { route: 'title', params: {} };
  }

  /**
   * Returns current route.
   *
   * Steps:
   * 1. Return this.currentRoute
   */
  get current(): Route {
    return this.currentRoute;
  }
}

// Export singleton instance
export const router = new Router();
