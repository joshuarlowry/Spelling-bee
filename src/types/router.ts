/**
 * Router Types
 *
 * Types for the simple hash router.
 */

// TODO: Define Route type
// Valid routes in the app
// Should be: 'title' | 'levels' | 'game'
export type Route = 'title' | 'levels' | 'game';

// TODO: Define RouteParams interface
// Parameters passed with routes
// Should include:
// - theme?: string (theme id like "fantasy")
// - level?: number (level number)
export interface RouteParams {
  theme?: string;
  level?: number;
}

// TODO: Define RouteHandler type
// Function signature for route handlers
// Should be: (params: RouteParams) => void
export type RouteHandler = (params: RouteParams) => void;
