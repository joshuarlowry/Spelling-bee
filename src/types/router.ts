/**
 * Router Types
 *
 * Types for the simple hash router.
 */

// TODO: Define Route type
// Valid routes in the app
// Should be: 'title' | 'levels' | 'game'
export type Route = string; // Replace with proper union type

// TODO: Define RouteParams interface
// Parameters passed with routes
// Should include:
// - theme?: string (theme id like "fantasy")
// - level?: number (level number)
export interface RouteParams {
  // Add properties here
}

// TODO: Define RouteHandler type
// Function signature for route handlers
// Should be: (params: RouteParams) => void
export type RouteHandler = any; // Replace with proper function type
