import { getProducts, getCollectionByHandle, createCart, addToCart, getCart, updateCartLines, removeCartLines } from './shopify.js?v=2.4';

const SHOPIFY_CHECKOUT_DOMAIN = 'https://5e2bf2-59.myshopify.com';

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

// SECTION OBSERVER (Defined early to avoid hoisting issues)
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { 
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function getAbsoluteUrl(url) {
  if (!url) return '';
  
  // If it already contains our target shopify domain, it's good
  if (url.includes('5e2bf2-59.myshopify.com')) return url;
  
  // If it's absolute but on the WRONG domain (like healthhustleacademy.com), extract the path
  let path = url;
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname + urlObj.search;
    } catch (e) {
      // Fallback for weird formats
      const parts = url.split('.com');
      path = parts[1] || url;
    }
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SHOPIFY_CHECKOUT_DOMAIN}${cleanPath}`;
}

// SANITIZE ANY OLD RELATIVE URLS IMMEDIATELY
(function sanitize() {
  const url = localStorage.getItem('shopify_checkout_url');
  if (url && !url.startsWith('http') && url.includes('/cart/')) {
    localStorage.setItem('shopify_checkout_url', getAbsoluteUrl(url));
  }
})();

window.openCart = function(cartData = null) {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart(cartData);
}

window.closeCart = function() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

async function renderCart(cartData = null) {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;

  let cart = cartData;

  if (!cart) {
    if (!cartId || cartId === 'undefined') {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your cart is empty.</p>';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Updating cart...</p>';
    const data = await getCart(cartId);
    cart = data?.cart;
  }

  if (!cart || !cart.lines || cart.lines.edges.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '$0.00';
    // Still bind checkout if we have a URL from a previous successful add
    const savedUrl = localStorage.getItem('shopify_checkout_url');
    if (checkoutBtn && savedUrl) {
      checkoutBtn.style.display = 'block';
      checkoutBtn.onclick = () => window.location.href = savedUrl;
    } else if (checkoutBtn) {
      checkoutBtn.style.display = 'none';
    }
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = 'block';
  if (totalEl) totalEl.textContent = `$${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}`;
  
  if (cart.checkoutUrl) {
    const absUrl = getAbsoluteUrl(cart.checkoutUrl);
    localStorage.setItem('shopify_checkout_url', absUrl);
    if (checkoutBtn) {
      checkoutBtn.onclick = () => window.location.href = absUrl;
    }
  }

  container.innerHTML = cart.lines.edges.map(({ node }) => {
    const variant = node.merchandise;
    const product = variant.product;
    const imgUrl = product.images.edges[0]?.node.url || '';

    return `
      <div style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;" class="cart-item" data-line-id="${node.id}">
        <div style="width: 70px; height: 70px; background: #21262D; border-radius: 4px; overflow: hidden; flex-shrink: 0;">
          <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <h4 style="font-size: 13px; font-family: 'Barlow Condensed'; font-weight: 700; color: white;">${product.title.toUpperCase()}</h4>
            <button onclick="window.changeQuantity('${node.id}', ${node.quantity}, -${node.quantity})" style="background: none; border: none; color: var(--text-disabled); cursor: pointer; font-size: 10px;">REMOVE</button>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">${variant.title !== 'Default Title' ? variant.title : ''}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; color: var(--emerald); font-size: 14px;">$${parseFloat(variant.price.amount).toFixed(2)}</div>
            <div style="display: flex; align-items: center; gap: 12px; background: #0D1117; padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border);">
              <button onclick="window.changeQuantity('${node.id}', ${node.quantity}, -1)" style="background: none; border: none; color: white; cursor: pointer; padding: 0 4px;">–</button>
              <span style="font-size: 13px; font-weight: 700; min-width: 12px; text-align: center;">${node.quantity}</span>
              <button onclick="window.changeQuantity('${node.id}', ${node.quantity}, 1)" style="background: none; border: none; color: white; cursor: pointer; padding: 0 4px;">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Trigger Upsells
  renderUpsells(cart);
}

window.changeQuantity = async function(lineId, currentQuantity, delta) {
  const newQty = currentQuantity + delta;
  if (!cartId) return;

  if (newQty <= 0) {
    const result = await removeCartLines(cartId, [lineId]);
    if (result) {
      const cart = result.cartLinesRemove.cart;
      window.updateCartBadge(cart.totalQuantity);
      renderCart(cart);
    }
  } else {
    const result = await updateCartLines(cartId, [{ id: lineId, quantity: newQty }]);
    if (result) {
      const cart = result.cartLinesUpdate.cart;
      window.updateCartBadge(cart.totalQuantity);
      renderCart(cart);
    }
  }
}

async function renderUpsells(cart) {
  const upsellContainer = document.getElementById('cart-upsells');
  const upsellList = document.getElementById('upsell-list');
  if (!upsellContainer || !upsellList) return;

  // Fetch real products to get fresh images
  // Fetch more products to ensure we find the roller/gun
  const productsData = await getProducts(50);
  const allProducts = productsData?.products?.edges.map(e => e.node) || [];
  
  const currentProductIds = cart.lines.edges.map(e => e.node.merchandise.product.id);
  console.log('[DEBUG] Cart Product IDs:', currentProductIds);
  console.log('[DEBUG] All Product Handles in Store:', allProducts.map(p => p.handle));
  
  // Suggest these handles if not in cart
  const suggestHandles = ['yoga-foam-roller', 'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads'];
  
  let filteredProducts = allProducts.filter(p => suggestHandles.includes(p.handle) && !currentProductIds.includes(p.id));

  // HARD MODE FALLBACK: If suggested items not found, just take first 2 that aren't in cart
  if (filteredProducts.length === 0) {
    filteredProducts = allProducts.filter(p => !currentProductIds.includes(p.id)).slice(0, 2);
  }

  if (filteredProducts.length === 0) {
    console.warn('Upsells: No suitable products found after filtering.');
    upsellContainer.style.display = 'none';
    return;
  }

  upsellContainer.style.display = 'block';
  upsellList.innerHTML = filteredProducts.map(p => {
    const imgUrl = p.images.edges[0]?.node.url || '';
    const price = p.priceRange.minVariantPrice.amount;
    const variantId = p.variants.edges[0]?.node.id;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border-subtle);">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="width: 40px; height: 40px; background: #21262D; border-radius: 2px; overflow: hidden; flex-shrink: 0;">
            ${imgUrl ? `<img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
          </div>
          <div>
            <div style="font-size: 11px; font-weight: 700; font-family: 'Barlow Condensed';">${p.title.toUpperCase()}</div>
            <div style="font-size: 10px; color: var(--emerald);">$${parseFloat(price).toFixed(2)}</div>
          </div>
        </div>
        <button onclick="window.addUpsell('${variantId}', this)" style="background: var(--emerald); color: black; border: none; padding: 4px 12px; border-radius: 2px; font-size: 10px; font-weight: 800; cursor: pointer; transition: 0.2s;">
          ADD +
        </button>
      </div>
    `;
  }).join('');
}

window.addUpsell = async function(variantId, btn) {
  const original = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;
  
  if (!cartId) return;
  const result = await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  if (result) {
    const cart = result.cartLinesAdd.cart;
    window.updateCartBadge(cart.totalQuantity);
    renderCart(cart);
  }
}

async function ensureCart() {
  if (!cartId || cartId === 'undefined' || cartId === 'null') {
    const data = await createCart();
    const cart = data?.cartCreate?.cart;
    cartId = cart?.id;
    if (cart?.checkoutUrl) {
      localStorage.setItem('shopify_checkout_url', getAbsoluteUrl(cart.checkoutUrl));
    }
    localStorage.setItem('shopify_cart_id', cartId);
  }
  return cartId;
}

window.handleAddToCart = handleAddToCart;

async function handleAddToCart(variantId, btn) {
  const original = btn.textContent;
  btn.textContent = 'ADDING...';
  btn.disabled = true;

  try {
    const id = await ensureCart();
    if (!id) throw new Error("Failed to create cart");

    const result = await addToCart(id, [{ merchandiseId: variantId, quantity: 1 }]);
    const cart = result?.cartLinesAdd?.cart;
    
    if (!cart) {
      console.error("Shopify error details:", result);
      throw new Error("Product not added to Shopify cart");
    }

    if (cart.checkoutUrl) {
      localStorage.setItem('shopify_checkout_url', getAbsoluteUrl(cart.checkoutUrl));
    }
    window.updateCartBadge(cart.totalQuantity || 0);
    
    btn.textContent = 'ADDED!';
    
    setTimeout(() => {
      window.openCart(cart);
      btn.textContent = original;
      btn.disabled = false;
    }, 600);
  } catch (e) {
    console.error('Add to cart critical error:', e);
    // If it fails, maybe the cartId is stale? Try clearing it for next time.
    localStorage.removeItem('shopify_cart_id');
    cartId = null;
    btn.textContent = 'RETRY';
    btn.disabled = false;
  }
}

const interactiveElements = 'a, button, .faq-question, .tab-btn, .cart-icon, .product-card';

// HERO & PARALLAX
const heroHeadline = document.querySelector('.hero-headline');
const heroSection = document.querySelector('.hero');

// UTILITIES

// PRODUCT LOADING
const VARIANT_IDS = {
  'walking-pad-for-home-office-quiet-under-desk-treadmill': '45114785234978',
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': '45114801061922',
  'yoga-foam-roller': '45114804437026',
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': '45114806665250',
};

function createProductCard(product) {
  const price = product.priceRange.minVariantPrice.amount;
  const imgUrl = product.images.edges[0]?.node.url || '';
  const variantId = `gid://shopify/ProductVariant/${VARIANT_IDS[product.handle] || ''}`;

  const card = document.createElement('div');
  card.className = 'product-card animate-in';
  card.innerHTML = `
    <a href="product.html?handle=${product.handle}" style="text-decoration:none; color:inherit;">
      <div style="aspect-ratio: 4/3; background: #21262D; overflow: hidden;">
        ${imgUrl ? `<img src="${imgUrl}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8B949E;">No image</div>'}
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

// Global Add to Cart listener for static buttons
document.querySelectorAll('.atc-btn').forEach(btn => {
  if (!btn.dataset.bound) {
    btn.addEventListener('click', (e) => {
      const variantId = btn.dataset.variant;
      if (variantId) {
        e.preventDefault();
        window.handleAddToCart(variantId, btn);
      }
    });
    btn.dataset.bound = 'true';
  }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
    btn.querySelector('span').textContent = item.classList.contains('active') ? '-' : '+';
  });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Initial observe
document.querySelectorAll('.animate-in, .animate-stagger, .fade-up').forEach(el => sectionObserver.observe(el));

// GLOBAL CHECKOUT HIJACKER (Hard Mode)
document.addEventListener('click', (e) => {
  const target = e.target.closest('#checkout-btn, a[href*="/cart/c/"]');
  if (target) {
    e.preventDefault();
    e.stopPropagation();
    
    // Always trust the stored URL from localStorage and FORCE it to be absolute
    const storedUrl = localStorage.getItem('shopify_checkout_url');
    const finalUrl = getAbsoluteUrl(storedUrl);
    
    console.log('[HARD MODE] Checkout request intercepted. Forcing redirect to:', finalUrl);
    
    if (finalUrl && finalUrl.startsWith('http')) {
      window.top.location.href = finalUrl;
    } else {
      // Emergency fallback if storage is empty
      window.top.location.href = 'https://5e2bf2-59.myshopify.com';
    }
  }
}, true);

// Scroll events
window.addEventListener('scroll', () => {
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  const initialCount = localStorage.getItem('shopify_cart_count') || 0;
  updateCartBadge(initialCount);
  loadProducts();
});
