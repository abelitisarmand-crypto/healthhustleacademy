import { getCollectionByHandle, getProducts } from './shopify.js?v=2.5';

const urlParams = new URL(window.location.href).searchParams;
const handle = urlParams.get('handle');
let allProducts = [];
let displayedCount = 8;

async function initCollection() {
  const grid = document.getElementById('collection-grid');
  const titleEl = document.getElementById('collection-title');
  const countEl = document.getElementById('collection-count');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (!grid || !titleEl) return;
  grid.style.opacity = '0.5';

  try {
    let data;
    if (!handle || handle === 'all') {
      const resp = await getProducts(24);
      allProducts = resp?.products?.edges || [];
      titleEl.textContent = 'SHOP ALL';
      document.title = 'Shop All — HealthHustleAcademy';
    } else {
      const collection = await getCollectionByHandle(handle, 24);
      allProducts = collection?.products?.edges || [];
      titleEl.textContent = (collection?.title || handle).toUpperCase();
      document.title = `${collection?.title || 'Collection'} — HealthHustleAcademy`;
    }

    if (countEl) countEl.textContent = `Showing ${allProducts.length} products`;
    
    renderProducts();

    if (loadMoreBtn) {
      if (allProducts.length > displayedCount) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = () => {
          displayedCount += 8;
          renderProducts();
        };
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }

  } catch (e) {
    console.error('Collection init error:', e);
    titleEl.textContent = 'COLLECTION ERROR';
  } finally {
    grid.style.opacity = '1';
    document.getElementById('collection-page').classList.add('visible');
  }
}

function renderProducts() {
  const grid = document.getElementById('collection-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  grid.innerHTML = '';

  const subset = allProducts.slice(0, displayedCount);
  
  subset.forEach(({ node: product }, i) => {
    const card = createProductCard(product);
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 50);
  });

  if (loadMoreBtn && displayedCount >= allProducts.length) {
    loadMoreBtn.style.display = 'none';
  }
}

function createProductCard(product) {
  const price = product.priceRange.minVariantPrice.amount;
  const imgUrl = product.images.edges[0]?.node.url || '';
  const variantId = product.variants.edges[0]?.node.id;

  const card = document.createElement('div');
  card.className = 'product-card animate-in';
  card.innerHTML = `
    <a href="product.html?handle=${product.handle}" style="text-decoration:none; color:inherit;">
      <div style="aspect-ratio: 4/3; background: #21262D; overflow: hidden;">
        <img src="${imgUrl}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;">
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
    if (window.handleAddToCart) window.handleAddToCart(variantId, e.target);
  });

  return card;
}

initCollection();
