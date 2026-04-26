/**
 * Utility Functions for DOXII E-commerce Store
 * - AOS animation management
 * - Lucide icon initialization
 * - Currency formatting
 * - Toast notifications
 * - Theme management
 */

// ============================================================================
// Animation Utilities (AOS)
// ============================================================================

export function initAOS() {
    if (window.AOS) {
        window.AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0,
        });
    }
}

export function refreshAOS() {
    if (window.AOS) {
        window.AOS.refresh();
    }
}

// ============================================================================
// Icon Utilities (Lucide)
// ============================================================================

export function ensureIcons(root = document) {
    queueMicrotask(() => {
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons({
                attrs: {
                    class: 'lucide-icon',
                    width: '20',
                    height: '20'
                },
                nameAttr: 'data-lucide'
            });
        }
    });
}

// ============================================================================
// Currency Formatting
// ============================================================================

export function currency(amount, locale = 'en-US', currencyCode = 'USD') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// ============================================================================
// Toast Notifications
// ============================================================================

export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `
        toast animate-slide-up
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        max-w-sm backdrop-blur-support
        ${type === 'success' ? 'bg-green-500/90 text-white' : ''}
        ${type === 'error' ? 'bg-red-500/90 text-white' : ''}
        ${type === 'warning' ? 'bg-yellow-500/90 text-white' : ''}
        ${type === 'info' ? 'bg-blue-500/90 text-white' : ''}
    `;

    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    toast.innerHTML = `
        <i data-lucide="${icons[type]}"></i>
        <span class="flex-1 text-sm font-medium">${message}</span>
        <button class="hover:opacity-75 transition-opacity" onclick="this.parentElement.remove()">
            <i data-lucide="x" width="16" height="16"></i>
        </button>
    `;

    container.appendChild(toast);
    ensureIcons(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================================================
// Theme Management (Dark/Light Mode)
// ============================================================================

export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('theme:changed', {
        detail: { theme: isDark ? 'dark' : 'light' }
    }));

    return isDark;
}

export function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// ============================================================================
// Drawer Management
// ============================================================================

export function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
        drawer.classList.add('open');
        document.body.classList.add('drawer-open');
    }
}

export function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
        drawer.classList.remove('open');
        document.body.classList.remove('drawer-open');
    }
}

export function toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
        if (drawer.classList.contains('open')) {
            closeDrawer(drawerId);
        } else {
            openDrawer(drawerId);
        }
    }
}

// ============================================================================
// URL/Query Utilities
// ============================================================================

export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

export function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// ============================================================================
// Debounce Utility
// ============================================================================

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// Local Storage Utilities
// ============================================================================

export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

export function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
}

// ============================================================================
// Image Utilities
// ============================================================================

export function generatePlaceholderImage(width = 400, height = 400, text = 'Product') {
    return `https://placehold.co/${width}x${height}/e2e8f0/64748b?text=${encodeURIComponent(text)}`;
}

// ============================================================================
// Validation Utilities
// ============================================================================

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ============================================================================
// Format Utilities
// ============================================================================

export function formatDate(date, locale = 'en-US') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

export function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

export function truncateText(text, maxLength = 100, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length).trim() + suffix;
}

// ============================================================================
// DOM Utilities
// ============================================================================

export function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

export function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}
