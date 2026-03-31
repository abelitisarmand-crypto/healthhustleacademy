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

  const data = await getProductByHandle(handle);
  const product = data?.product;
  if (!product) {
    document.getElementById('product-title').textContent = 'Product Not Found';
    return;
  }

  currentProduct = product;
  renderProduct(product);
}

function renderProduct(product) {
  // Title & Desc
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-description').innerHTML = product.description;
  document.title = `${product.title} — HealthHustleAcademy`;

  // Gallery
  const mainImg = document.getElementById('main-product-img');
  mainImg.src = product.images.edges[0]?.node.url;
  mainImg.alt = product.images.edges[0]?.node.altText;

  const thumbs = document.getElementById('product-thumbnails');
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

  // Variants
  const varBox = document.getElementById('variant-selector');
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

  // Add to Cart btn
  const atcBtn = document.getElementById('add-to-cart-btn');
  atcBtn.textContent = 'ADD TO CART →';
  atcBtn.addEventListener('click', () => {
    if (window.handleAddToCart) {
      window.handleAddToCart(selectedVariantId, atcBtn);
    }
  });

  // Transition in
  document.getElementById('product-page').classList.add('visible');
}

// Global handleAddToCart is now used from main.js

// Custom styles for active variant
const style = document.createElement('style');
style.innerHTML = `
  .variant-pill.active {
    border-color: var(--emerald) !important;
    background: var(--emerald-glow);
  }
`;
document.head.appendChild(style);

initPDP();
