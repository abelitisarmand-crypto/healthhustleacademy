import { getProducts, getCollectionByHandle, createCart, addToCart, getCart } from './shopify.js';

// CART & DRAWER STATE
let cartId = localStorage.getItem('shopify_cart_id') || null;
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const checkoutBtn = document.getElementById('checkout-btn');

window.updateCartBadge = function(count) {
  localStorage.setItem('shopify_cart_count', count);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.transform = 'scale(1.2)';
    setTimeout(() => { if (el) el.style.transform = 'scale(1)'; }, 200);
  });
}

window.openCart = function() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

window.closeCart = function() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

async function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;

  if (!cartId || cartId === 'undefined') {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Updating cart...</p>';
  
  const data = await getCart(cartId);
  const cart = data?.cart;

  if (!cart || !cart.lines || cart.lines.edges.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  if (totalEl) totalEl.textContent = `$${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}`;
  
  if (cart.checkoutUrl) {
    localStorage.setItem('shopify_checkout_url', cart.checkoutUrl);
  }

  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      const url = localStorage.getItem('shopify_checkout_url');
      if (url) window.location.href = url;
    };
  }

  container.innerHTML = cart.lines.edges.map(({ node }) => {
    const variant = node.merchandise;
    const product = variant.product;
    const imgUrl = product.images.edges[0]?.node.url || '';

    return `
      <div style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;">
        <div style="width: 80px; height: 80px; background: #21262D; border-radius: 4px; overflow: hidden; flex-shrink: 0;">
          <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 14px; margin-bottom: 4px; font-family: 'Barlow Condensed'; font-weight: 700;">${product.title.toUpperCase()}</h4>
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">${variant.title !== 'Default Title' ? variant.title : ''}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; color: var(--emerald);">$${parseFloat(variant.price.amount).toFixed(2)}</div>
            <div style="font-size: 13px;">QTY: ${node.quantity}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function ensureCart() {
  if (!cartId || cartId === 'undefined' || cartId === 'null') {
    const data = await createCart();
    const cart = data?.cartCreate?.cart;
    cartId = cart?.id;
    if (cart?.checkoutUrl) {
      localStorage.setItem('shopify_checkout_url', cart.checkoutUrl);
    }
    localStorage.setItem('shopify_cart_id', cartId);
  }
  return cartId;
}

window.handleAddToCart = async function(variantId, btn) {
  const original = btn.textContent;
  btn.textContent = 'ADDING...';
  btn.disabled = true;

  try {
    const id = await ensureCart();
    const result = await addToCart(id, [{ merchandiseId: variantId, quantity: 1 }]);
    const cart = result?.cartLinesAdd?.cart;
    if (cart?.checkoutUrl) {
      localStorage.setItem('shopify_checkout_url', cart.checkoutUrl);
    }
    window.updateCartBadge(cart?.totalQuantity || 0);
    
    btn.textContent = 'ADDED!';
    
    setTimeout(() => {
      window.openCart();
      btn.textContent = original;
      btn.disabled = false;
    }, 600);
  } catch (e) {
    console.error('Add to cart error:', e);
    btn.textContent = 'ERROR';
    btn.disabled = false;
  }
}

// CUSTOM CURSOR
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
  cursorX += dx * 0.12; 
  cursorY += dy * 0.12;
  
  if (cursor) {
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = 'a, button, .faq-question, .tab-btn, .cart-icon, .product-card';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveElements)) cursor?.classList.add('active');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveElements)) cursor?.classList.remove('active');
});

// HERO & PARALLAX
const heroHeadline = document.querySelector('.hero-headline');
const heroSection = document.querySelector('.hero');

if (heroHeadline && heroHeadline.classList.contains('animate-stagger')) {
  const lines = heroHeadline.querySelectorAll('span');
  lines.forEach((line, lineIdx) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((word, wordIdx) => {
      const span = document.createElement('span');
      span.textContent = word + (wordIdx === words.length - 1 ? '' : ' ');
      span.style.transitionDelay = `${(lineIdx * 0.3) + (wordIdx * 0.05)}s`;
      line.appendChild(span);
    });
  });
}

function updateParallax() {
  const scrolled = window.scrollY;
  if (heroSection) {
    heroSection.style.backgroundPositionY = `${scrolled * 0.4}px`;
  }
}

// NUMBER COUNTERS
const animateNumbers = (el) => {
  const target = parseInt(el.textContent);
  if (isNaN(target)) return;
  const duration = 2000;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(easedProgress * target);
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

// PRODUCT LOADING
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
        ${imgUrl ? `<img src="${imgUrl}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8B949E;">No image</div>'}
      </div>
      <div style="padding: 24px 24px 12px;">
        <h3 style="font-size:18px;margin-bottom:8px;line-height:1.3; font-family: 'Anton'; letter-spacing: 0.02em;">${product.title.toUpperCase()}</h3>
        <div style="color:var(--emerald);font-weight:700;margin-bottom:16px; font-size: 20px;">$${parseFloat(price).toFixed(2)}</div>
      </div>
    </a>
    <div style="padding: 0 24px 24px;">
      <button class="btn btn-primary atc-btn" style="width:100%;height:48px;" data-variant="${variantId}">
        ADD TO CART
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
    setTimeout(() => {
      card.classList.add('visible');
      sectionObserver.observe(card);
    }, i * 100);
  });
}

// INIT & EVENTS
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabMap = { 'LOSE WEIGHT': 'lose-weight', 'BUILD STRENGTH': 'build-strength', 'MOVE MORE': 'move-more', 'RECOVER FASTER': 'recover-faster' };
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(tabMap[btn.textContent.trim()]);
  });
});

document.querySelectorAll('.cart-icon').forEach(icon => {
  icon.addEventListener('click', (e) => {
    e.preventDefault();
    window.openCart();
  });
});
document.getElementById('close-cart')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
    btn.querySelector('span').textContent = item.classList.contains('active') ? '-' : '+';
  });
});

// Section Observer
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => sectionObserver.observe(el));

// Scroll events
window.addEventListener('scroll', () => {
  updateParallax();
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  const initialCount = localStorage.getItem('shopify_cart_count') || 0;
  updateCartBadge(initialCount);
  loadProducts();
  
  setTimeout(() => {
    if (heroHeadline) heroHeadline.classList.add('visible');
  }, 400);
});
