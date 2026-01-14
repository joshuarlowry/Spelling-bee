/**
 * Error Handler
 *
 * Global error handling setup.
 *
 * TODO: Implement the following:
 * 1. initErrorHandling() - sets up global error handlers
 * 2. showErrorToast() - displays error toast to user
 */

/**
 * Sets up global error handlers.
 *
 * Steps:
 * 1. Set window.onerror handler:
 *    - Log error to console
 *    - Call showErrorToast() with friendly message
 *    - Return true to prevent default handling
 * 2. Set window.onunhandledrejection handler:
 *    - Log promise rejection to console
 *    - Call event.preventDefault()
 */
export function initErrorHandling(): void {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', error || message);
    showErrorToast('An error occurred. Please try again.');
    return true;
  };

  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  };
}

/**
 * Displays a non-intrusive error message.
 *
 * Steps:
 * 1. Create div element with class 'error-toast'
 * 2. Set textContent to message
 * 3. Style: position fixed, bottom 20px, left 50%, transform translateX(-50%)
 * 4. Append to document.body
 * 5. Remove after 5 seconds
 */
export function showErrorToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}
