import { getProducts, getCollectionByHandle, createCart, addToCart } from './shopify.js';

// ─── CART & DRAWER STATE ──────────────────────────────────────────────────────
let cartId = localStorage.getItem('shopify_cart_id') || null;
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');

function updateCartBadge(count) {
  localStorage.setItem('shopify_cart_count', count);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

async function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (!cartId) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your cart is empty.</p>';
    return;
  }

  // Simplified for MVP: In a real app, you'd fetch the full cart object here.
  // For now, we'll tell the user we're loading.
  container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Updating cart...</p>';
  
  // Note: Actual cart fetching logic would go here using shopifyQuery
}

async function ensureCart() {
  if (!cartId) {
    const data = await createCart();
    cartId = data?.cartCreate?.cart?.id;
    localStorage.setItem('shopify_cart_id', cartId);
  }
  return cartId;
}

async function handleAddToCart(variantId, btn) {
  const original = btn.textContent;
  btn.textContent = 'ADDING...';
  btn.disabled = true;

  try {
    const id = await ensureCart();
    const result = await addToCart(id, [{ merchandiseId: variantId, quantity: 1 }]);
    const lines = result?.cartLinesAdd?.cart?.lines?.edges || [];
    const total = lines.reduce((sum, { node }) => sum + node.quantity, 0);
    updateCartBadge(total);
    
    btn.textContent = '✓ ADDED!';
    btn.style.background = '#10B981';
    
    // Auto-open drawer
    setTimeout(() => {
      openCart();
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 800);
  } catch (e) {
    btn.textContent = 'ERROR — RETRY';
    btn.disabled = false;
  }
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  let dx = mouseX - cursorX;
  let dy = mouseY - cursorY;
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  if (cursor) {
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = 'a, button, .faq-question, .tab-btn, .cart-icon';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveElements)) cursor?.classList.add('active');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveElements)) cursor?.classList.remove('active');
});

// ─── HERO & PARALLAX ──────────────────────────────────────────────────────────
const heroHeadline = document.querySelector('.hero-headline');
const heroImage = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  if (heroImage) {
    heroImage.style.backgroundPositionY = `${scrolled * 0.5}px`;
  }
});

// ─── NUMBER COUNTERS ──────────────────────────────────────────────────────────
const animateNumbers = (el) => {
  const target = parseInt(el.textContent);
  let count = 0;
  const duration = 2000;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(progress * target);
    el.textContent = current.toString().padStart(2, '0');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      animateNumbers(entry.target);
      entry.target.dataset.animated = 'true';
    }
  });
}, { threshold: 1 });

document.querySelectorAll('.problem-number').forEach(n => numberObserver.observe(n));

// ─── PRODUCT LOADING ──────────────────────────────────────────────────────────
const VARIANT_IDS = {
  'recovery-massage-gun-deep-tissue-relief': '45114806665250',
  'foam-roller-pro-full-body-recovery': '45114804437026',
  'the-20-minute-home-gym-starter-kit': '45114801061922',
  'under-desk-walking-pad-move-more-burn-more': '45114785234978',
};

function createProductCard(product) {
  const price = product.priceRange.minVariantPrice.amount;
  const imgUrl = product.images.edges[0]?.node.url || '';
  const variantId = `gid://shopify/ProductVariant/${VARIANT_IDS[product.handle] || ''}`;

  const card = document.createElement('div');
  card.className = 'product-card glass-card animate-in';
  card.innerHTML = `
    <a href="product.html?handle=${product.handle}" style="text-decoration:none; color:inherit;">
      <div style="aspect-ratio: 4/3; background: #21262D; overflow: hidden;">
        ${imgUrl ? `<img src="${imgUrl}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8B949E;">No image</div>'}
      </div>
      <div style="padding: 24px 24px 12px;">
        <h3 style="font-size:18px;margin-bottom:8px;line-height:1.3; font-family: 'Anton'; letter-spacing: 0.02em;">${product.title.toUpperCase()}</h3>
        <div style="color:var(--emerald);font-weight:700;margin-bottom:16px; font-size: 20px;">$${parseFloat(price).toFixed(2)}</div>
      </div>
    </a>
    <div style="padding: 0 24px 24px;">
      <button class="btn btn-primary atc-btn" style="width:100%;height:48px;" data-variant="${variantId}">
        ADD TO CART →
      </button>
    </div>
  `;

  card.querySelector('.atc-btn').addEventListener('click', (e) => {
    e.preventDefault();
    handleAddToCart(variantId, e.target);
  });

  return card;
}

async function loadProducts(handle = null) {
  const container = document.getElementById('product-container');
  if (!container) return;
  container.style.opacity = '0.5';
  
  let products = [];
  if (handle) {
    const collection = await getCollectionByHandle(handle, 4);
    products = collection?.products?.edges || [];
  } else {
    const data = await getProducts(4);
    products = data?.products?.edges || [];
  }

  container.innerHTML = '';
  container.style.opacity = '1';

  products.forEach(({ node: product }, i) => {
    const card = createProductCard(product);
    container.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 100);
  });
}

// ─── INIT & EVENTS ────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabMap = { 'LOSE WEIGHT': 'lose-weight', 'BUILD STRENGTH': 'build-strength', 'MOVE MORE': 'move-more', 'RECOVER FASTER': 'recover-faster' };
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(tabMap[btn.textContent.trim()]);
  });
});

document.querySelector('.cart-icon')?.addEventListener('click', openCart);
document.getElementById('close-cart')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

// FAQ Accordion Fix (for dynamic interaction)
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
    btn.querySelector('span').textContent = item.classList.contains('active') ? '−' : '+';
  });
});

// Section Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge(localStorage.getItem('shopify_cart_count') || 0);
  loadProducts();
  
  // Stagger reveal hero
  setTimeout(() => {
    if (heroHeadline) heroHeadline.classList.add('visible');
  }, 300);
});
�─────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
    btn.querySelector('span').textContent = item.classList.contains('active') ? '−' : '+';
  });
});

// ─── INTERSECTION OBSERVER ────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge(cartCount);
  loadProducts();
});