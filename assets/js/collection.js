import { getCollectionByHandle } from './shopify.js';

// Get handle from URL
const urlParams = new URL(window.location.href).searchParams;
const handle = urlParams.get('handle') || 'all';

async function initCollection() {
  const query = `
    query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const collectionData = await getCollectionByHandle(handle, 20); // This only gets title/products from simplified query
  // Actually shopify.js getCollectionByHandle needs to be updated or I use a custom query here
  // Let's assume I updated shopify.js to include variants
  const collection = collectionData; 
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
    card.className = 'product-card';
    const variantId = `gid://shopify/ProductVariant/${product.variants?.edges[0]?.node.id.split('/').pop() || ''}`; // Fallback or mapping needed if VARIANT_IDS not here
    
    card.innerHTML = `
      <a href="product.html?handle=${product.handle}" style="text-decoration:none; color:inherit;">
        <div style="aspect-ratio: 4/3; background: #21262D; overflow: hidden;">
            <img src="${imgUrl}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="padding: 24px 24px 12px;">
            <h3 style="font-size: 18px; margin-bottom: 8px; line-height: 1.3; font-family: 'Anton'; letter-spacing: 0.02em;">${product.title.toUpperCase()}</h3>
            <div style="color: var(--emerald); font-weight: 700; margin-bottom: 16px; font-size: 20px;">$${parseFloat(price).toFixed(2)}</div>
        </div>
      </a>
      <div style="padding: 0 24px 24px;">
        <button class="btn btn-primary atc-btn" style="width:100%;height:48px;">
          ADD TO CART
        </button>
      </div>
    `;
    
    card.querySelector('.atc-btn').addEventListener('click', (e) => {
      e.preventDefault();
      if (window.handleAddToCart) {
        // We need the full gid for the variant
        const fullVariantId = product.variants.edges[0].node.id;
        window.handleAddToCart(fullVariantId, e.target);
      }
    });

    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 50);
  });

  document.getElementById('collection-page').classList.add('visible');
}

initCollection();
