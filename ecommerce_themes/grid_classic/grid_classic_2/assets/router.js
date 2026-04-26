/* eslint-disable no-undef */
/**
 * Hash-based SPA router with parameter + query support
 */

let routes = [];
let currentRoute = null;

export function setRoutes(routeConfig) {
    routes = routeConfig;
    window.addEventListener('hashchange', handleRouteChange);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => queueMicrotask(handleRouteChange));
    } else {
        queueMicrotask(handleRouteChange);
    }
}

function handleRouteChange() {
    let hash = window.location.hash.slice(1) || '/';
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
    const paramNames = [];
    const regexPattern = pattern.replace(/:([^/]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);

    if (!match) return null;

    const params = {};
    paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
    });

    return { params };
}

function parseQuery() {
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

function render(route) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '';
    const pageElement = document.createElement(route.component);

    if (route.params) {
        pageElement.setAttribute('data-params', JSON.stringify(route.params));
    }
    if (route.query) {
        pageElement.setAttribute('data-query', JSON.stringify(route.query));
    }

    app.appendChild(pageElement);
    emitRouteChanged(route);
}

function render404() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-6">
            <h1 class="text-6xl font-bold text-gray-900">404</h1>
            <p class="text-gray-500 max-w-md">
                Oops! This page doesn't exist. Let's get you back to shopping.
            </p>
            <a href="#/" class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors touch-feedback">
                Go home
            </a>
        </div>
    `;
    emitRouteChanged({ component: 'route-404' });
}

function emitRouteChanged(detail) {
    const event = new CustomEvent('route:changed', { detail });
    window.dispatchEvent(event);
    document.dispatchEvent(event);
}

export function navigate(path, query = {}) {
    let url = `#${path}`;
    const queryString = new URLSearchParams(query).toString();
    if (queryString) {
        url += `?${queryString}`;
    }
    window.location.hash = url;
}

export function getCurrentRoute() {
    return currentRoute;
}

export function isActive(path) {
    const currentPath = window.location.hash.slice(1) || '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
}
