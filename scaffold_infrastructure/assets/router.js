/* eslint-disable no-undef */
/* global queueMicrotask */
/**
 * Hash-Based SPA Router with Parameter Support
 *
 * Features:
 * - Hash-based routing (#/path)
 * - Dynamic parameters (:id, :slug, etc.)
 * - Route change events
 * - Programmatic navigation
 * - 404 handling
 */

let routes = [];
let currentRoute = null;

// ============================================================================
// Router Configuration
// ============================================================================

export function setRoutes(routeConfig) {
    routes = routeConfig;

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);

    // Handle initial route - wait for DOM and custom elements to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a microtask to ensure all custom elements are defined
            queueMicrotask(() => {
                handleRouteChange();
            });
        });
    } else {
        // DOM already loaded, wait for custom elements
        queueMicrotask(() => {
            handleRouteChange();
        });
    }
}

// ============================================================================
// Route Matching & Rendering
// ============================================================================

function handleRouteChange() {
    let hash = window.location.hash.slice(1) || '/';
    // Remove query string from hash for route matching
    const questionMarkIndex = hash.indexOf('?');
    if (questionMarkIndex !== -1) {
        hash = hash.slice(0, questionMarkIndex);
    }
    const route = matchRoute(hash);

    if (route) {
        currentRoute = route;
        render(route);
    } else {
        render404();
    }
}

function matchRoute(path) {
    for (const route of routes) {
        const match = matchPath(route.path, path);
        if (match) {
            return {
                ...route,
                params: match.params,
                query: parseQuery()
            };
        }
    }
    return null;
}

function matchPath(pattern, path) {
    // Convert pattern to regex
    const paramNames = [];
    const regexPattern = pattern.replace(/:([^/]+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);

    if (match) {
        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });
        return { params };
    }

    return null;
}

function parseQuery() {
    // Get the hash including query string
    const hash = window.location.hash;
    const questionMarkIndex = hash.indexOf('?');

    if (questionMarkIndex === -1) {
        return {};
    }

    const queryString = hash.slice(questionMarkIndex + 1);
    const params = new URLSearchParams(queryString);
    const query = {};

    for (const [key, value] of params) {
        query[key] = value;
    }

    return query;
}

// ============================================================================
// Render Functions
// ============================================================================

function render(route) {
    const app = document.getElementById('app');
    if (!app) return;

    // Clear previous content
    app.innerHTML = '';

    // Create page component
    const pageElement = document.createElement(route.component);

    // Pass params and query as data attributes
    if (route.params) {
        pageElement.setAttribute('data-params', JSON.stringify(route.params));
    }

    if (route.query) {
        pageElement.setAttribute('data-query', JSON.stringify(route.query));
    }

    // Append to app
    app.appendChild(pageElement);

    // Dispatch route change event
    window.dispatchEvent(new CustomEvent('route:changed', {
        detail: route
    }));
}

function render404() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <h1 class="text-9xl font-bold text-primary-500 mb-4">404</h1>
                <h2 class="text-3xl font-bold mb-4">Page Not Found</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                    href="#/"
                    class="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Go Home
                </a>
            </div>
        </div>
    `;

    window.dispatchEvent(new CustomEvent('route:changed', {
        detail: { component: '404' }
    }));
}

// ============================================================================
// Navigation Functions
// ============================================================================

export function navigate(path, query = {}) {
    let url = `#${path}`;

    // Add query parameters
    const queryString = new URLSearchParams(query).toString();
    if (queryString) {
        url += `?${queryString}`;
    }

    window.location.hash = url;
}

export function goBack() {
    window.history.back();
}

export function goForward() {
    window.history.forward();
}

// ============================================================================
// Router Utilities
// ============================================================================

export function getCurrentRoute() {
    return currentRoute;
}

export function getParams() {
    return currentRoute?.params || {};
}

export function getQuery() {
    return currentRoute?.query || {};
}

export function isActive(path) {
    const currentPath = window.location.hash.slice(1) || '/';
    return currentPath === path || currentPath.startsWith(path + '/');
}

// ============================================================================
// Link Component Helper
// ============================================================================

export function createLink(path, text, className = '') {
    const a = document.createElement('a');
    a.href = `#${path}`;
    a.textContent = text;
    a.className = className;

    // Add active class if current route
    if (isActive(path)) {
        a.classList.add('active');
    }

    return a;
}
