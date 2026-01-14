import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Router } from '../Router';

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  describe('register', () => {
    it('should register a route handler', () => {
      let handlerCalled = false;
      router.register('title', () => {
        handlerCalled = true;
      });

      window.location.hash = '#/';
      window.dispatchEvent(new Event('hashchange'));
      expect(handlerCalled).toBe(true);
    });
  });

  describe('navigate', () => {
    it('should navigate to title route', () => {
      router.navigate('title');
      expect(window.location.hash).toBe('#/');
    });

    it('should navigate to levels route with theme', () => {
      router.navigate('levels', { theme: 'fantasy' });
      expect(window.location.hash).toBe('#/theme/fantasy');
    });

    it('should navigate to game route with theme and level', () => {
      router.navigate('game', { theme: 'fantasy', level: 2 });
      expect(window.location.hash).toBe('#/theme/fantasy/level/2');
    });
  });

  describe('parseHash', () => {
    it('should parse title route (#/)', () => {
      const parseHash = (router as any).parseHash('#/');
      expect(parseHash.route).toBe('title');
      expect(parseHash.params).toEqual({});
    });

    it('should parse levels route with theme', () => {
      const parseHash = (router as any).parseHash('#/theme/fantasy');
      expect(parseHash.route).toBe('levels');
      expect(parseHash.params.theme).toBe('fantasy');
    });

    it('should parse game route with theme and level', () => {
      const parseHash = (router as any).parseHash('#/theme/scifi/level/3');
      expect(parseHash.route).toBe('game');
      expect(parseHash.params.theme).toBe('scifi');
      expect(parseHash.params.level).toBe(3);
    });

    it('should default to title for invalid hash', () => {
      const parseHash = (router as any).parseHash('#/invalid/path');
      expect(parseHash.route).toBe('title');
      expect(parseHash.params).toEqual({});
    });

    it('should handle empty hash', () => {
      const parseHash = (router as any).parseHash('');
      expect(parseHash.route).toBe('title');
      expect(parseHash.params).toEqual({});
    });
  });

  describe('current', () => {
    it('should return current route', () => {
      expect(router.current).toBe('title');

      router.navigate('levels', { theme: 'fantasy' });
      window.dispatchEvent(new Event('hashchange'));
      expect(router.current).toBe('levels');
    });
  });

  describe('route handling', () => {
    it('should call appropriate handler on route change', () => {
      let titleCalled = false;
      let levelsCalled = false;

      router.register('title', () => {
        titleCalled = true;
      });
      router.register('levels', () => {
        levelsCalled = true;
      });

      window.location.hash = '#/theme/fantasy';
      window.dispatchEvent(new Event('hashchange'));
      expect(titleCalled).toBe(false);
      expect(levelsCalled).toBe(true);
    });

    it('should pass params to handler', () => {
      let receivedTheme: string | undefined;

      router.register('levels', (params) => {
        receivedTheme = params.theme;
      });

      router.navigate('levels', { theme: 'scifi' });
      window.dispatchEvent(new Event('hashchange'));
      expect(receivedTheme).toBe('scifi');
    });
  });
});
