import { getCollectionByHandle } from './shopify.js';

// Get handle from URL
const urlParams = new URL(window.location.href).searchParams;
const handle = urlParams.get('handle') || 'all';

async function initCollection() {
  const collection = await getCollectionByHandle(handle, 20);
  if (!collection) {
    document.getElementById('collection-title').textContent = 'Collection Not Found';
    return;
  }

  renderCollection(collection);
}

function renderCollection(collection) {
  document.getElementById('collection-title').textContent = collection.title.toUpperCase();
  document.title = `${collection.title} — HealthHustleAcademy`;

  const grid = document.getElementById('collection-grid');
  grid.innerHTML = '';

  collection.products.edges.forEach(({ node: product }) => {
    const price = product.priceRange.minVariantPrice.amount;
    const imgUrl = product.images.edges[0]?.node.url || 'https://via.placeholder.com/400x300';
    
    const card = document.createElement('div');
    card.className = 'product-card animate-in';
    card.innerHTML = `
      <a href="product.html?handle=${product.handle}">
        <div style="aspect-ratio: 4/3; background: #21262D; overflow: hidden;">
            <img src="${imgUrl}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
        </div>
        <div style="padding: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 4px;">${product.title}</h3>
            <div style="color: var(--text-primary); font-weight: 700;">$${parseFloat(price).toFixed(2)}</div>
        </div>
      </a>
    `;
    
    const img = card.querySelector('img');
    card.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
    
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 50);
  });

  document.getElementById('collection-page').classList.add('visible');
}

initCollection();
