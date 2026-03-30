import { getProducts, getCollectionByHandle, createCart, addToCart } from './shopify.js';

// ─── CART STATE ───────────────────────────────────────────────────────────────
let cartId = localStorage.getItem('shopify_cart_id') || null;
let cartCount = parseInt(localStorage.getItem('shopify_cart_count') || '0');

function updateCartBadge(count) {
  cartCount = count;
  localStorage.setItem('shopify_cart_count', count);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
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
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  } catch (e) {
    btn.textContent = 'ERROR — RETRY';
    btn.disabled = false;
  }
}

// ─── PRODUCT CARD RENDERER ────────────────────────────────────────────────────
// Variant IDs hardcoded as fallback for direct Add to Cart on homepage
const VARIANT_IDS = {
  'recovery-massage-gun-deep-tissue-relief': '45114806665250',
  'foam-roller-pro-full-body-recovery': '45114804437026', // Black default
  'the-20-minute-home-gym-starter-kit': '45114801061922',
  'under-desk-walking-pad-move-more-burn-more': '45114785234978',
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
        ${imgUrl ? `<img src="${imgUrl}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8B949E;">No image</div>'}
      </div>
      <div style="padding: 20px 20px 8px;">
        <h3 style="font-size:17px;margin-bottom:4px;line-height:1.3;">${product.title}</h3>
        <div style="color:var(--text-primary);font-weight:700;margin-bottom:12px;">$${parseFloat(price).toFixed(2)}</div>
      </div>
    </a>
    <div style="padding: 0 20px 20px;">
      <button class="btn btn-primary atc-btn" style="width:100%;height:44px;font-size:12px;" data-variant="${variantId}">
        ADD TO CART →
      </button>
    </div>
  `;

  const img = card.querySelector('img');
  if (img) {
    card.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
  }

  const btn = card.querySelector('.atc-btn');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    handleAddToCart(variantId, btn);
  });

  return card;
}

// ─── PRODUCT LOADING ──────────────────────────────────────────────────────────
async function loadProducts(handle = null) {
  const container = document.getElementById('product-container');
  if (!container) return;

  container.style.opacity = '0.5';
  container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Loading...</div>';

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

  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No products found.</p>';
    return;
  }

  products.forEach(({ node: product }, i) => {
    const card = createProductCard(product);
    container.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 80);
  });
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const tabMap = {
  'LOSE WEIGHT': 'lose-weight',
  'BUILD STRENGTH': 'build-strength',
  'MOVE MORE': 'move-more',
  'RECOVER FASTER': 'recover-faster',
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(tabMap[btn.textContent.trim()]);
  });
});

// ─── HERO "GET MY STARTER KIT" BUTTON ─────────────────────────────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  if (btn.textContent.includes('STARTER KIT') && !btn.dataset.bound) {
    btn.dataset.bound = '1';
    btn.addEventListener('click', async (e) => {
      if (btn.tagName === 'BUTTON') {
        e.preventDefault();
        const variantId = `gid://shopify/ProductVariant/45114801061922`;
        await handleAddToCart(variantId, btn);
      }
    });
  }
});

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
const scrollProgress = document.createElement('div');
Object.assign(scrollProgress.style, {
  position: 'fixed', top: '0', left: '0',
  height: '2px', backgroundColor: '#10B981',
  zIndex: '10000', width: '0', transition: 'width 0.1s'
});
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = ((document.documentElement.scrollTop / h) * 100) + '%';
});

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
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