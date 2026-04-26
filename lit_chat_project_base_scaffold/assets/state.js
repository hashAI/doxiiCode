// App state: mock products and cart store with localStorage persistence

const cartStorageKey = 'lit_ecom_cart_v1';

export const products = [
  { id: 'p-1',  name: 'Aurora Leather Tote', price: 129.0, category: 'Bags',    rating: 4.7, badge: 'New',      image: 'https://picsum.photos/seed/tote/800/800',    description: 'Premium full-grain leather tote with magnetic closure and organizer pockets.' },
  { id: 'p-2',  name: 'Nimbus Running Shoes', price: 98.0,  category: 'Shoes',   rating: 4.5, badge: 'Popular',  image: 'https://picsum.photos/seed/shoes/800/800',   description: 'Lightweight cushioning with breathable mesh for everyday runs.' },
  { id: 'p-3',  name: 'Horizon Smart Watch', price: 199.0, category: 'Watches', rating: 4.6, badge: 'Sale',     image: 'https://picsum.photos/seed/watch/800/800',   description: 'AMOLED display, health tracking, and 7-day battery life.' },
  { id: 'p-4',  name: 'Lumen Desk Lamp',     price: 59.0,  category: 'Home',    rating: 4.3, badge: 'New',      image: 'https://picsum.photos/seed/lamp/800/800',    description: 'Dimmable LED lamp with adjustable arm and warm light mode.' },
  { id: 'p-5',  name: 'Echo Wireless Buds',  price: 79.0,  category: 'Audio',   rating: 4.4, badge: 'Popular',  image: 'https://picsum.photos/seed/buds/800/800',    description: 'Active noise cancelation and transparent mode in a compact design.' },
  { id: 'p-6',  name: 'Glide Office Chair',  price: 169.0, category: 'Home',    rating: 4.2, badge: 'Limited',  image: 'https://picsum.photos/seed/chair/800/800',   description: 'Ergonomic chair with lumbar support and breathable mesh back.' },
  { id: 'p-7',  name: 'Voyage Backpack',     price: 89.0,  category: 'Bags',    rating: 4.5, badge: 'Popular',  image: 'https://picsum.photos/seed/backpack/800/800',description: 'Water-resistant backpack with padded laptop sleeve and quick-access pockets.' },
  { id: 'p-8',  name: 'Canvas Sneakers',     price: 54.0,  category: 'Shoes',   rating: 4.1, badge: 'Classic',  image: 'https://picsum.photos/seed/sneakers/800/800',description: 'Timeless canvas sneakers with cushioned insoles for daily comfort.' },
  { id: 'p-9',  name: 'Serene Candle Set',   price: 36.0,  category: 'Home',    rating: 4.4, badge: 'New',      image: 'https://picsum.photos/seed/candles/800/800', description: 'Hand-poured soy candles with notes of cedar, amber, and citrus.' },
  { id: 'p-10', name: 'Orbit Bluetooth Speaker', price: 49.0, category: 'Audio', rating: 4.3, badge: 'Gift',   image: 'https://picsum.photos/seed/speaker/800/800', description: 'Portable speaker with deep bass and 12-hour playtime.' },
  { id: 'p-11', name: 'Summit Puffer Jacket', price: 139.0, category: 'Apparel', rating: 4.6, badge: 'Warm',  image: 'https://picsum.photos/seed/jacket/800/800',  description: 'Lightweight, packable jacket with premium insulation for cold days.' },
  { id: 'p-12', name: 'Cascade Water Bottle', price: 24.0,  category: 'Home',    rating: 4.5, badge: 'Eco',    image: 'https://picsum.photos/seed/bottle/800/800',  description: 'Insulated stainless steel bottle keeps drinks cold for 24 hours.' }
];

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

function loadCart() {
  try {
    const raw = localStorage.getItem(cartStorageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
  } catch (e) {}
}

const subscribers = new Set();

export const cartStore = {
  items: loadCart(),
  subscribe(fn) {
    subscribers.add(fn);
    fn(this);
    return () => subscribers.delete(fn);
  },
  _notify() {
    saveCart(this.items);
    subscribers.forEach((fn) => fn(this));
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: this }));
  },
  add(productId, qty = 1) {
    const existing = this.items.find((i) => i.productId === productId);
    if (existing) existing.qty += qty;
    else this.items.push({ productId, qty });
    this._notify();
  },
  setQty(productId, qty) {
    const it = this.items.find((i) => i.productId === productId);
    if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) this.remove(productId);
    else this._notify();
  },
  remove(productId) {
    this.items = this.items.filter((i) => i.productId !== productId);
    this._notify();
  },
  clear() {
    this.items = [];
    this._notify();
  },
  totalItems() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },
  totalPrice() {
    return this.items.reduce((sum, i) => {
      const p = getProductById(i.productId);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  }
};


