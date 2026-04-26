// Tiny hash router with :param support. No dependencies.

const compiledRoutes = [];

function compile(path, component) {
  const names = [];
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const regex = new RegExp(
    '^#' +
      normalized
        .replace(/\/$/, '')
        .replace(/:[^/]+/g, (m) => {
          names.push(m.slice(1));
          return '([^/]+)';
        }) +
      '$'
  );
  return { path: normalized, regex, names, component };
}

function getHash() {
  return window.location.hash || '#/';
}

function match() {
  const hash = getHash();
  for (const route of compiledRoutes) {
    const m = hash.match(route.regex);
    if (m) {
      const params = {};
      route.names.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1] || '')));
      return { route, params };
    }
  }
  return null;
}

export function setRoutes(routes) {
  compiledRoutes.length = 0;
  for (const r of routes) compiledRoutes.push(compile(r.path, r.component));
  render();
}

export function navigate(path) {
  const hashPath = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : '/' + path}`;
  if (getHash() === hashPath) {
    render();
  } else {
    window.location.hash = hashPath;
  }
}

export function render() {
  const res = match();
  const mount = document.querySelector('#app');
  if (!mount) return;
  mount.innerHTML = '';
  const tag = res ? res.route.component : 'page-home';
  const el = document.createElement(tag);
  if (res) el.setAttribute('data-params', JSON.stringify(res.params));
  mount.appendChild(el);
  document.dispatchEvent(new CustomEvent('route:changed', { detail: res }));
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);


