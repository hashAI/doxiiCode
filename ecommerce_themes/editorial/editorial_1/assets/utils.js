export function initAOS() {
    if (window.AOS) {
        window.AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
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
        maximumFractionDigits: 0
    }).format(amount);
}

export function showToast({ title, message, variant = 'success' }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const palette = {
        success: 'bg-green-50 text-green-700 border-green-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        danger: 'bg-red-50 text-red-700 border-red-200'
    };

    const wrapper = document.createElement('div');
    wrapper.className = `rounded-xl border px-4 py-3 shadow-lg flex items-start gap-3 ${palette[variant] || palette.success} fade-in`;
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
    setTimeout(remove, 4000);
}

export function getImageUrl(query, size = 720, index = 0) {
    return `http://194.238.23.194/epicsum/media/image/${encodeURIComponent(query)}?size=${size}&index=${index}`;
}

export function getVideoUrl(query, size = 720, index = 0) {
    return `http://194.238.23.194/epicsum/media/video/${encodeURIComponent(query)}?size=${size}&index=${index}`;
}

export function initGSAP() {
    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
    }
}
