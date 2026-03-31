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

const ICONS = {
  MOTOR: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  SPEED: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z"/></svg>`,
  DISPLAY: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  COMPACT: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  MUSCLE: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM12 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM20 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/></svg>`,
  ATTACH: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  BATTERY: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="15"/></svg>`,
  ROLL: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  RULER: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3 3 11l8 8M14 3l8 8-8 8M17 11H3"/></svg>`,
  PALETTE: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.688-1.688h1.954c3.106 0 5.586-2.513 5.586-5.625 0-4.814-4.48-8.75-10-8.75Z"/></svg>`,
  PROGRAM: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M9 14h6M9 18h6M9 10h6"/></svg>`,
  BACKPACK: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10Z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5M8 10h8M8 18h8"/></svg>`,
  DOOR: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`
};

const PRODUCT_COPY = [
  {
    match: ['walking-pad', 'treadmill'],
    subtitle: 'Burn 200–400 calories a day without leaving your desk.',
    description: 'The average remote worker sits 10+ hours a day. This ultra-quiet walking pad fits under any desk — start walking at 0.6 mph during calls, hit 5 mph when you close the laptop. No gym. No commute. Just results.',
    features: [
      { icon: ICONS.MOTOR, title: 'Near-Silent Motor', text: '40 dB. Use it on Zoom calls without anyone knowing' },
      { icon: ICONS.SPEED, title: '0.6–5 MPH', text: 'Walk slowly while working, speed up when done' },
      { icon: ICONS.DISPLAY, title: 'LED Display', text: 'Tracks steps, distance, calories, time' },
      { icon: ICONS.COMPACT, title: 'Fits Any Space', text: 'Slides under desk or bed. No assembly required' },
    ],
    perfectFor: ['Remote workers', 'People with sedentary jobs', 'Anyone who wants to move more'],
    variantLabel: 'SELECT SIZE'
  },
  {
    match: ['massage-gun', 'percussion'],
    subtitle: 'Professional-grade recovery. Without the $400 price tag.',
    description: 'Theragun charges $400 for percussion therapy. We put the same deep-tissue relief in your hands for $79. 8 interchangeable heads, a powerful quiet motor, and 12mm amplitude — everything you need to recover faster and train harder tomorrow.',
    features: [
      { icon: ICONS.MUSCLE, title: '12mm Amplitude', text: 'Deep enough to reach real muscle tissue, not just the surface' },
      { icon: ICONS.MOTOR, title: 'Quiet Motor', text: 'Strong enough to feel it, quiet enough for the living room' },
      { icon: ICONS.ATTACH, title: '8 Attachment Heads', text: 'Targeting every muscle group from neck to calves' },
      { icon: ICONS.BATTERY, title: 'Long Battery Life', text: 'Hours of use per charge, USB-C charging' },
    ],
    perfectFor: ['Post-workout recovery', 'Desk workers with tight shoulders', 'Athletes', 'Chronic muscle tension']
  },
  {
    match: ['foam-roller'],
    subtitle: '5 minutes of rolling = 30 minutes of stretching.',
    description: 'Most people skip recovery because it takes too long. 5 minutes with this foam roller before bed increases blood flow, breaks up knots, and has you waking up actually ready to move. Used by physios. Priced for everyone.',
    features: [
      { icon: ICONS.MUSCLE, title: 'High-Density EVA', text: 'Firm enough to actually work on deep tissue' },
      { icon: ICONS.RULER, title: 'Full-Length 33cm', text: 'Works back, legs, glutes, shoulders' },
      { icon: ICONS.PALETTE, title: '6 Colors', text: 'Pick what matches your space or your vibe' },
      { icon: ICONS.COMPACT, title: 'Portable', text: 'Take it to the gym, hotel, office' },
    ],
    perfectFor: ['Post-workout', 'Morning mobility', 'Office recovery', 'Travel athletes'],
    variantLabel: 'CHOOSE YOUR COLOR'
  },
  {
    match: ['resistance-band', 'starter-kit'],
    subtitle: 'Everything you need to train. Nothing you don\'t.',
    description: '5 resistance bands (10–50 lbs), door anchor, handles. Fits in a backpack. Works in 6 square feet. The entire kit costs less than one month at a gym — and comes with a 30-day program so you actually know what to do with it.',
    features: [
      { icon: ICONS.MUSCLE, title: '5 Resistance Levels', text: '10, 20, 30, 40, 50 lbs. Beginner to advanced' },
      { icon: ICONS.DOOR, title: 'Door Anchor Included', text: 'Full upper body training without a rack' },
      { icon: ICONS.BACKPACK, title: 'Fits in a Backpack', text: 'Train at home, hotel, or the park' },
      { icon: ICONS.PROGRAM, title: '30-Day Program Included', text: 'No guesswork. Just follow Day 1' },
    ],
    perfectFor: ['Home gym beginners', 'Travelers', 'People with no space for equipment']
  }
];

function getPremiumCopy(product) {
  const handle = product.handle.toLowerCase();
  const title = product.title.toLowerCase();
  return PRODUCT_COPY.find(copy => 
    copy.match.some(keyword => handle.includes(keyword) || title.includes(keyword))
  );
}

function renderProduct(product) {
  const copy = getPremiumCopy(product);
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
        <div class="icon-box">${f.icon || '⚡'}</div>
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
