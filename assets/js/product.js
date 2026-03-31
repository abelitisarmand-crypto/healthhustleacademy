import { getProductByHandle, createCart, addToCart } from './shopify.js?v=1.1';

// Get handle from URL
const urlParams = new URL(window.location.href).searchParams;
const handle = urlParams.get('handle');

// State
let currentProduct = null;
let selectedVariantId = null;

async function initPDP() {
  if (!handle) {
    window.location.href = 'index.html';
    return;
  }

  console.log('Fetching handle:', handle);
  const data = await getProductByHandle(handle);
  console.log('Shopify data:', data);

  // Handle both { product: {...} } and direct product object responses
  const product = data?.product || (data?.id ? data : null);

  if (!product || !product.title) {
    console.error('Product not found or invalid data structure:', data);
    document.getElementById('product-title').textContent = 'Product Not Found';
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) mainImg.style.display = 'none';
    return;
  }

  currentProduct = product;
  renderProduct(product);
}

function parseDescription(raw) {
  if (!raw) return { intro: '', features: [], fullText: '' };
  
  // Clean raw text (remove multiple spaces/lines)
  const clean = raw.replace(/\s+/g, ' ').trim();
  
  // Split by bullets •
  const parts = raw.split('•').map(p => p.trim()).filter(p => p.length > 5);
  
  // First part is usually the intro
  const intro = parts[0]?.split(/[A-Z]{5,}:/)[0] || '';
  
  // Features are parts that look like bullets
  const features = parts.slice(0, 4).map(f => {
    // Try to extract a title (Uppercase words at the start)
    const match = f.match(/^([A-Z\s]{3,}:?)/);
    const title = match ? match[1].replace(':', '').trim() : 'FEATURE';
    const desc = f.replace(match ? match[0] : '', '').trim();
    return { title, desc };
  });

  // Formatted full text
  const formatted = raw
    .replace(/•\s*/g, '</li><li>')
    .replace(/([A-Z\s]{5,}:?)/g, '</ul><h4 style="margin: 32px 0 16px; font-family: \'Barlow Condensed\'; font-weight: 800; font-size: 18px; letter-spacing: 0.05em; color: var(--text-primary);">$1</h4><ul><li>')
    .replace(/^<\/ul>/, '') + '</li></ul>';

  return { intro, features, formatted };
}

function renderProduct(product) {
  const { intro, features, formatted } = parseDescription(product.description);

  // Title & Intro
  const titleEl = document.getElementById('product-title');
  const descEl = document.getElementById('product-description');
  if (titleEl) titleEl.textContent = product.title.toUpperCase();
  if (descEl) descEl.innerHTML = intro;
  
  document.title = `${product.title} — HealthHustleAcademy`;

  // Feature Grid (Why You'll Love It)
  const featureGrid = document.getElementById('feature-grid');
  if (featureGrid && features.length > 0) {
    featureGrid.innerHTML = features.map((f, i) => `
      <div class="feature-item animate-in" style="background: var(--bg-secondary); border: 1px solid var(--border); padding: 32px; border-radius: 4px;">
        <div style="font-family: 'Barlow Condensed'; font-weight: 900; font-size: 14px; color: var(--emerald); margin-bottom: 16px;">0${i+1}</div>
        <h3 style="font-family: 'Barlow Condensed'; font-weight: 800; font-size: 20px; margin-bottom: 12px; letter-spacing: 0.02em;">${f.title}</h3>
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">${f.desc}</p>
      </div>
    `).join('');
  }

  // Full Details
  const detailsEl = document.getElementById('formatted-description');
  if (detailsEl) {
    detailsEl.innerHTML = formatted;
  }

  // Gallery
  const mainImg = document.getElementById('main-product-img');
  if (mainImg && product.images?.edges?.length > 0) {
    mainImg.src = product.images.edges[0].node.url;
    mainImg.alt = product.images.edges[0].node.altText || product.title;
  }

  const thumbs = document.getElementById('product-thumbnails');
  if (thumbs) {
    thumbs.innerHTML = '';
    product.images.edges.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.style.aspectRatio = '1/1';
      thumb.style.background = '#21262D';
      thumb.style.borderRadius = '2px';
      thumb.style.cursor = 'pointer';
      thumb.style.overflow = 'hidden';
      thumb.innerHTML = `<img src="${img.node.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
      
      thumb.addEventListener('click', () => {
        mainImg.src = img.node.url;
        mainImg.alt = img.node.altText;
      });
      thumbs.appendChild(thumb);
    });
  }

  // Price
  const priceEl = document.getElementById('price-current');
  if (priceEl && product.variants?.edges?.length > 0) {
    const firstPrice = product.variants.edges[0].node.price?.amount || 0;
    priceEl.textContent = `$${parseFloat(firstPrice).toFixed(2)}`;
  }

  // Variants
  const varBox = document.getElementById('variant-selector');
  if (varBox) {
    varBox.innerHTML = '';
    product.variants.edges.forEach((v, idx) => {
      const variant = v.node;
      const btn = document.createElement('div');
      btn.className = `variant-pill ${idx === 0 ? 'active' : ''}`;
      btn.style.padding = '16px';
      btn.style.border = '1px solid var(--border)';
      btn.style.borderRadius = '2px';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.justifyContent = 'space-between';
      btn.style.alignItems = 'center';
      btn.innerHTML = `
        <span style="font-weight: 600;">${variant.title}</span>
        <span style="font-family: 'Barlow Condensed'; font-weight: 700;">$${parseFloat(variant.price?.amount || 0).toFixed(2)}</span>
      `;

      if (idx === 0) selectedVariantId = variant.id;

      btn.addEventListener('click', () => {
        selectedVariantId = variant.id;
        document.querySelectorAll('.variant-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      varBox.appendChild(btn);
    });
  }

  // Add to Cart btn
  const atcBtn = document.getElementById('add-to-cart-btn');
  if (atcBtn) {
    atcBtn.textContent = 'ADD TO CART →';
    atcBtn.onclick = () => {
      if (window.handleAddToCart) {
        window.handleAddToCart(selectedVariantId, atcBtn);
      }
    };
  }

  // Cart Icon Fix
  document.querySelectorAll('.cart-icon').forEach(icon => {
    icon.onclick = (e) => {
      e.preventDefault();
      if (window.openCart) window.openCart();
    };
  });

  // Transition in
  document.getElementById('product-page').classList.add('visible');
  
  // Re-run observer for new elements
  if (window.sectionObserver) {
    document.querySelectorAll('.animate-in').forEach(el => window.sectionObserver.observe(el));
  }
}

// Custom styles for active variant
if (!document.getElementById('pdp-custom-styles')) {
  const style = document.createElement('style');
  style.id = 'pdp-custom-styles';
  style.innerHTML = `
    .variant-pill.active {
      border-color: var(--emerald) !important;
      background: var(--emerald-glow);
    }
    #formatted-description ul {
      margin-left: 20px;
      margin-bottom: 24px;
      list-style: disc;
    }
    #formatted-description li {
      margin-bottom: 8px;
    }
    .feature-item {
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .feature-item:hover {
      transform: translateY(-5px);
      border-color: var(--emerald) !important;
    }
  `;
  document.head.appendChild(style);
}

initPDP();
