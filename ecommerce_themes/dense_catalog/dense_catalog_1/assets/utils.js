export function initAOS() {
    if (window.AOS) {
        window.AOS.init({
            duration: 700,
            easing: 'ease-out-quart',
            once: true,
            offset: 80
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
                attrs: { 'stroke-width': 1.5 },
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

export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

export function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function showToast({ title, message, variant = 'success' }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const palette = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        info: 'bg-sky-50 text-sky-700 border-sky-200',
        danger: 'bg-rose-50 text-rose-700 border-rose-200'
    };

    const wrapper = document.createElement('div');
    wrapper.className = `rounded-2xl border px-4 py-3 shadow-glow flex items-start gap-3 ${palette[variant] || palette.success}`;
    wrapper.innerHTML = `
        <div class="flex-1">
            <p class="font-semibold">${title}</p>
            <p class="text-sm opacity-80">${message}</p>
        </div>
        <button aria-label="Close notification" class="opacity-60 hover:opacity-100 transition" data-lucide="x"></button>
    `;

    container.appendChild(wrapper);
    ensureIcons(wrapper);

    const remove = () => {
        wrapper.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => wrapper.remove(), 180);
    };

    const closeButton = wrapper.querySelector('button');
    if (closeButton) {
        closeButton.addEventListener('click', remove);
    }
    setTimeout(remove, 3500);
}
