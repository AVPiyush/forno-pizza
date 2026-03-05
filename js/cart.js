// ─── CART MANAGER ───────────────────────────────────────────────
const Cart = {
  items: [],

  load() {
    const saved = localStorage.getItem('fornoCart');
    this.items = saved ? JSON.parse(saved) : [];
    this.updateBadge();
  },

  save() {
    localStorage.setItem('fornoCart', JSON.stringify(this.items));
    this.updateBadge();
  },

  add(pizza) {
    const key = pizza.cartId || pizza.id;
    const existing = this.items.find(i => (i.cartId || i.id) === key);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...pizza, cartId: key, qty: 1 });
    }
    this.save();
    this.showToast(pizza.cartLabel || pizza.name);
  },

  remove(cartId) {
    this.items = this.items.filter(i => (i.cartId || i.id) !== cartId);
    this.save();
  },

  updateQty(cartId, delta) {
    const item = this.items.find(i => (i.cartId || i.id) === cartId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.remove(cartId);
    else this.save();
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.count();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showToast(name) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = `🍕 ${name} added to cart`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
  },

  clear() {
    this.items = [];
    this.save();
  }
};

// Init on load
document.addEventListener('DOMContentLoaded', () => Cart.load());
