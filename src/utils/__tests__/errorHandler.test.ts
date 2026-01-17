import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as errorHandler from '../errorHandler';

describe('errorHandler', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('showErrorToast', () => {
    it('renders a toast with message and styles, then removes it', () => {
      vi.useFakeTimers();

      errorHandler.showErrorToast('Something went wrong');

      const toast = document.querySelector<HTMLDivElement>('.error-toast');
      expect(toast).not.toBeNull();
      expect(toast?.textContent).toBe('Something went wrong');
      expect(toast?.style.position).toBe('fixed');
      expect(toast?.style.bottom).toBe('20px');
      expect(toast?.style.left).toBe('50%');
      expect(toast?.style.transform).toBe('translateX(-50%)');

      vi.advanceTimersByTime(5000);
      expect(document.querySelector('.error-toast')).toBeNull();
    });
  });

  describe('initErrorHandling', () => {
    it('handles window.onerror by logging and showing a toast', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      errorHandler.initErrorHandling();

      const handler = window.onerror;
      expect(handler).toBeInstanceOf(Function);

      const result = handler?.('boom', undefined, undefined, undefined, new Error('boom'));

      expect(consoleSpy).toHaveBeenCalledWith('Global error:', expect.any(Error));
      const toast = document.querySelector<HTMLDivElement>('.error-toast');
      expect(toast?.textContent).toBe('An error occurred. Please try again.');
      expect(result).toBe(true);
    });

    it('handles unhandledrejection by logging and preventing default', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const preventDefault = vi.fn();

      errorHandler.initErrorHandling();

      window.onunhandledrejection?.({
        reason: 'nope',
        preventDefault,
      } as PromiseRejectionEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled promise rejection:', 'nope');
      expect(preventDefault).toHaveBeenCalled();
    });
  });
});
