export function initAOS() {
    if (window.AOS) {
        window.AOS.init({
            duration: 500,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
}

export function refreshAOS() {
    if (window.AOS) {
        window.AOS.refreshHard();
    }
}

export function ensureIcons(scope = document) {
    if (window.lucide?.createIcons && window.lucide?.icons) {
        window.lucide.createIcons(
            {
                icons: window.lucide.icons,
                attrs: { 'stroke-width': 2 },
                nameAttr: 'data-lucide'
            },
            scope.querySelectorAll('[data-lucide]')
        );
    }
}

export function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Unable to persist to storage', error);
    }
}

export function loadFromStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn('Unable to read from storage', error);
        return fallback;
    }
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export function formatPrice(amount) {
    if (amount == null) return '$0.00';
    return `$${amount.toFixed(2)}`;
}

export function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function showToast({ title, message, variant = 'success' }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const palette = {
        success: 'bg-emerald-900 text-emerald-100 border-emerald-700',
        info: 'bg-gray-800 text-gray-100 border-gray-600',
        danger: 'bg-red-900 text-red-100 border-red-700',
        error: 'bg-red-900 text-red-100 border-red-700'
    };

    const wrapper = document.createElement('div');
    wrapper.className = `rounded-xl border px-4 py-3 shadow-card flex items-start gap-3 ${palette[variant] || palette.success} slide-up`;
    wrapper.innerHTML = `
        <div class="flex-1">
            <p class="font-semibold text-sm">${title}</p>
            ${message ? `<p class="text-xs opacity-80 mt-0.5">${message}</p>` : ''}
        </div>
        <button aria-label="Close notification" class="opacity-60 hover:opacity-100 transition" data-lucide="x"></button>
    `;

    container.appendChild(wrapper);
    ensureIcons(wrapper);

    const remove = () => {
        wrapper.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => wrapper.remove(), 200);
    };

    const closeButton = wrapper.querySelector('button');
    if (closeButton) {
        closeButton.addEventListener('click', remove);
    }
    setTimeout(remove, 3000);
}

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

export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function getImageUrl(query, size = 720, index = 0) {
    return `http://194.238.23.194/epicsum/media/image/${encodeURIComponent(query)}?size=${size}&index=${index}`;
}

export function getVideoUrl(query, size = 720, index = 0) {
    return `http://194.238.23.194/epicsum/media/video/${encodeURIComponent(query)}?size=${size}&index=${index}`;
}

export function setupBottomSheet(sheetElement, handleElement) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    handleElement.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        sheetElement.style.transition = 'none';
    });

    handleElement.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (deltaY > 0) {
            sheetElement.style.transform = `translateY(${deltaY}px)`;
        }
    });

    handleElement.addEventListener('touchend', () => {
        isDragging = false;
        sheetElement.style.transition = '';
        const deltaY = currentY - startY;

        if (deltaY > 100) {
            sheetElement.classList.remove('open');
        } else {
            sheetElement.style.transform = '';
        }
    });
}
