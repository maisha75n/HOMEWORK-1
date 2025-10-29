// Mobile: hamburger toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
hamburger.addEventListener('click', () => {
const isOpen = nav.classList.toggle('show');
hamburger.setAttribute('aria-expanded', String(isOpen));
});
}


// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Simple slider (used on Home gallery)
const slider = document.querySelector('[data-slider]');
if (slider) {
const slides = slider.querySelector('[data-slides]');
const images = slides.querySelectorAll('img');
const prev = slider.querySelector('[data-prev]');
const next = slider.querySelector('[data-next]');
let index = 0;


function update() {
slides.style.transform = `translateX(-${index * 100}%)`;
}


// (Cart logic moved below to run on all pages that include the cart markup)
function go(step) {
index = (index + step + images.length) % images.length;
update();
}


prev.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));


// Auto-advance every 4 seconds
setInterval(() => go(1), 4000);
}


// Simple Cart (shared between Menu and Cart pages). Persists to localStorage.
(function initCart() {
function readCartFromStorage() {
  try { return JSON.parse(localStorage.getItem('cart') || '{}'); } catch { return {}; }
}
function writeCartToStorage(obj) { localStorage.setItem('cart', JSON.stringify(obj)); }

const cartList = document.getElementById('cart-items');
const clearBtn = document.getElementById('clear-cart');
const totalEl = document.getElementById('cart-total');

const cartObj = readCartFromStorage(); // { name: { price, quantity } }
const cart = new Map(Object.entries(cartObj));

function updateCartCountBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  let count = 0;
  for (const [, item] of cart.entries()) count += item.quantity;
  badge.textContent = String(count);
}

function format(n) { return n.toFixed(2); }

function render() {
  if (!cartList || !totalEl) { updateCartCountBadge(); return; }
  cartList.innerHTML = '';
  let total = 0;
  for (const [name, item] of cart.entries()) {
    const li = document.createElement('li');
    li.className = 'cart-item';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'name';
    title.textContent = name;
    const qty = document.createElement('div');
    qty.className = 'qty';
    qty.textContent = `Qty: ${item.quantity}  •  $${format(item.price)} each`;
    meta.appendChild(title);
    meta.appendChild(qty);

    const subtotal = document.createElement('div');
    subtotal.className = 'subtotal';
    const sub = item.price * item.quantity;
    subtotal.textContent = `$${format(sub)}`;
    total += sub;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      cart.delete(name);
      render();
    });

    li.appendChild(meta);
    li.appendChild(subtotal);
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  }
  totalEl.textContent = format(total);
  updateCartCountBadge();
}

function addToCart(name, price) {
  const existing = cart.get(name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(name, { price, quantity: 1 });
  }
  // persist
  const obj = Object.fromEntries(cart.entries());
  writeCartToStorage(obj);
  render();
}

document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.classList && target.classList.contains('add-to-cart')) {
    const name = target.getAttribute('data-name');
    const price = parseFloat(target.getAttribute('data-price')) || 0;
    addToCart(name, price);
  }
});

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    cart.clear();
    writeCartToStorage({});
    render();
  });
}

render();
updateCartCountBadge();
})();