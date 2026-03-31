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

const PRODUCT_COPY = {
  'walking-pad-for-home-office-quiet-under-desk-treadmill': {
    subtitle: 'Burn 200–400 calories a day without leaving your desk.',
    description: 'The average remote worker sits 10+ hours a day. This ultra-quiet walking pad fits under any desk — start walking at 0.6 mph during calls, hit 5 mph when you close the laptop. No gym. No commute. Just results.',
    features: [
      { icon: '🔇', title: 'Near-Silent Motor', text: '40 dB. Use it on Zoom calls without anyone knowing' },
      { icon: '⚡', title: '0.6–5 MPH', text: 'Walk slowly while working, speed up when done' },
      { icon: '📊', title: 'LED Display', text: 'Tracks steps, distance, calories, time' },
      { icon: '🏠', title: 'Fits Any Space', text: 'Slides under desk or bed. No assembly required' },
    ],
    perfectFor: ['Remote workers', 'People with sedentary jobs', 'Anyone who wants to move more'],
    variantLabel: 'SELECT SIZE'
  },
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': {
    subtitle: 'Professional-grade recovery. Without the $400 price tag.',
    description: 'Theragun charges $400 for percussion therapy. We put the same deep-tissue relief in your hands for $79. 8 interchangeable heads, a powerful quiet motor, and 12mm amplitude — everything you need to recover faster and train harder tomorrow.',
    features: [
      { icon: '💪', title: '12mm Amplitude', text: 'Deep enough to reach real muscle tissue, not just the surface' },
      { icon: '🔇', title: 'Quiet Motor', text: 'Strong enough to feel it, quiet enough for the living room' },
      { icon: '🎯', title: '8 Attachment Heads', text: 'Targeting every muscle group from neck to calves' },
      { icon: '🔋', title: 'Long Battery Life', text: 'Hours of use per charge, USB-C charging' },
    ],
    perfectFor: ['Post-workout recovery', 'Desk workers with tight shoulders', 'Athletes', 'Chronic muscle tension']
  },
  'yoga-foam-roller': {
    subtitle: '5 minutes of rolling = 30 minutes of stretching.',
    description: 'Most people skip recovery because it takes too long. 5 minutes with this foam roller before bed increases blood flow, breaks up knots, and has you waking up actually ready to move. Used by physios. Priced for everyone.',
    features: [
      { icon: '🏋️', title: 'High-Density EVA', text: 'Firm enough to actually work on deep tissue' },
      { icon: '📐', title: 'Full-Length 33cm', text: 'Works back, legs, glutes, shoulders' },
      { icon: '🎨', title: '6 Colors', text: 'Pick what matches your space or your vibe' },
      { icon: '✈️', title: 'Portable', text: 'Take it to the gym, hotel, office' },
    ],
    perfectFor: ['Post-workout', 'Morning mobility', 'Office recovery', 'Travel athletes'],
    variantLabel: 'CHOOSE YOUR COLOR'
  },
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': {
    subtitle: 'Everything you need to train. Nothing you don\'t.',
    description: '5 resistance bands (10–50 lbs), door anchor, handles. Fits in a backpack. Works in 6 square feet. The entire kit costs less than one month at a gym — and comes with a 30-day program so you actually know what to do with it.',
    features: [
      { icon: '💪', title: '5 Resistance Levels', text: '10, 20, 30, 40, 50 lbs. Beginner to advanced' },
      { icon: '🚪', title: 'Door Anchor Included', text: 'Full upper body training without a rack' },
      { icon: '🎒', title: 'Fits in a Backpack', text: 'Train at home, hotel, or the park' },
      { icon: '📋', title: '30-Day Program Included', text: 'No guesswork. Just follow Day 1' },
    ],
    perfectFor: ['Home gym beginners', 'Travelers', 'People with no space for equipment']
  }
};

function renderProduct(product) {
  const copy = PRODUCT_COPY[product.handle];
  const { formatted } = parseDescription(product.description);

  // Title & Subtitle & Intro
  const titleEl = document.getElementById('product-title');
  const subtitleEl = document.getElementById('product-subtitle');
  const descEl = document.getElementById('product-description');
  
  if (titleEl) titleEl.textContent = product.title.toUpperCase();
  if (subtitleEl) subtitleEl.textContent = copy ? copy.subtitle : '';
  if (descEl) descEl.innerHTML = copy ? copy.description : product.description.split('•')[0];
  
  document.title = `${product.title} — HealthHustleAcademy`;

  // Feature Grid
  const featureGrid = document.getElementById('feature-grid');
  if (featureGrid) {
    const featuresToRender = copy ? copy.features : parseDescription(product.description).features;
    featureGrid.innerHTML = featuresToRender.map((f, i) => `
      <div class="feature-item animate-in" style="background: var(--bg-secondary); border: 1px solid var(--border); padding: 32px; border-radius: 4px;">
        <div style="font-size: 24px; margin-bottom: 20px;">${f.icon || '⚡'}</div>
        <div style="font-family: 'Barlow Condensed'; font-weight: 900; font-size: 14px; color: var(--emerald); margin-bottom: 12px;">0${i+1} / CORE FEATURE</div>
        <h3 style="font-family: 'Barlow Condensed'; font-weight: 800; font-size: 22px; margin-bottom: 12px; letter-spacing: 0.02em;">${f.title}</h3>
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">${f.text || f.desc}</p>
      </div>
    `).join('');
  }

  // Full Details (Filtered to remove redundancy if premium copy is used)
  const detailsEl = document.getElementById('formatted-description');
  if (detailsEl) {
    if (copy) {
      // If we have premium copy, just show the technical specs from the description
      // usually everything after the first set of bullets
      const specs = product.description.split(/[A-Z]{5,}:/);
      if (specs.length > 1) {
        detailsEl.innerHTML = '<h4 style="margin-bottom: 24px; font-family: \'Barlow Condensed\'; font-weight: 800; font-size: 20px; letter-spacing: 0.05em; color: var(--text-primary);">WHAT\'S IN THE BOX</h4>' + 
                             '<ul><li>' + specs.slice(1).join('</li><li>').replace(/•/g, '').trim() + '</li></ul>';
      } else {
        detailsEl.innerHTML = formatted;
      }
    } else {
      detailsEl.innerHTML = formatted;
    }
  }

  // Perfect For Section
  const perfectTags = document.getElementById('perfect-for-tags');
  if (perfectTags && copy && copy.perfectFor) {
    perfectTags.innerHTML = copy.perfectFor.map(tag => `
      <span style="background: #10B98115; color: var(--emerald); border: 1px solid #10B98130; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${tag}</span>
    `).join('');
  } else if (document.getElementById('perfect-for-section')) {
    document.getElementById('perfect-for-section').style.display = 'none';
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
      thumb.className = 'thumb-pill';
      thumb.style.aspectRatio = '1/1';
      thumb.style.background = '#21262D';
      thumb.style.borderRadius = '2px';
      thumb.style.cursor = 'pointer';
      thumb.style.overflow = 'hidden';
      thumb.style.border = '2px solid transparent';
      thumb.innerHTML = `<img src="${img.node.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
      
      thumb.addEventListener('click', () => {
        mainImg.src = img.node.url;
        mainImg.alt = img.node.altText;
        document.querySelectorAll('.thumb-pill').forEach(t => t.style.borderColor = 'transparent');
        thumb.style.borderColor = 'var(--emerald)';
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

  // Variants Label
  const varLabel = document.getElementById('variant-label');
  if (varLabel && copy && copy.variantLabel) {
    varLabel.textContent = copy.variantLabel;
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
        // Update price
        if (priceEl) priceEl.textContent = `$${parseFloat(variant.price?.amount || 0).toFixed(2)}`;
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

initPDP();
