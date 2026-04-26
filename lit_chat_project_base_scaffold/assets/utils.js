// Small utilities used across components and pages

export function currency(amount) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  } catch (e) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }
}

export function ensureIcons(root = document) {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
}

export function initAOS() {
  if (window.AOS && typeof window.AOS.init === 'function') {
    window.AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 40 });
  }
}

export function refreshAOS() {
  if (window.AOS && typeof window.AOS.refreshHard === 'function') {
    window.AOS.refreshHard();
  }
}

export function on(event, handler) {
  document.addEventListener(event, handler);
  return () => document.removeEventListener(event, handler);
}

export function emit(event, detail) {
  document.dispatchEvent(new CustomEvent(event, { detail }));
}


