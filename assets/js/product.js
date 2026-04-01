import { getProductByHandle, addToCart } from './shopify.js?v=3.0';
import { ICONS } from '../icons/icons.js';

// Phase 7: Bulletproof Fallbacks & Conversion Data
const MOCK_PRODUCTS = {
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': {
    title: "Deep Tissue Massage Gun",
    price: "79.00",
    image: "https://vignette.wikia.nocookie.net/gear-for-sport/images/d/d4/Massage_Gun.jpg/revision/latest?cb=20200521151445", // Fallback URL placeholder
    quantity: 44
  },
  'walking-pad-for-home-office-quiet-under-desk-treadmill': {
    title: "Under-Desk Walking Pad",
    price: "299.00",
    image: "https://m.media-amazon.com/images/I/71z7XmK-j7L._AC_SL1500_.jpg",
    quantity: 237
  },
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': {
    title: "Home Gym Starter Kit",
    price: "79.00",
    image: "https://m.media-amazon.com/images/I/81+Xp+T8YkL._AC_SL1500_.jpg",
    quantity: 56
  },
  'yoga-foam-roller': {
    title: "Foam Roller Pro",
    price: "35.00",
    image: "https://m.media-amazon.com/images/I/71Y+z6kL0OL._AC_SL1500_.jpg",
    quantity: 88
  }
};

const PRODUCT_COPY = {
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': {
    h1: "YOUR BACK CALLED. IT'S DONE WAITING.",
    subtitle: 'Professional deep-tissue recovery — at home, in 10 minutes, for $79.',
    problemHeadline: "EVERY QUESTION YOU'RE AFRAID TO ASK",
    problemText: 'You sit for 8 hours. Your neck locks up. Your shoulders ache by 3pm. You\'ve tried stretching, ibuprofen, and just ignoring it. None of it sticks.\nThis does.',
    transformations: [
      { icon: 'muscle', text: 'Stiff to Supple' },
      { icon: 'heads', text: 'Locked to Loose' },
      { icon: 'quiet', text: 'Tense to Tranquil' },
      { icon: 'battery', text: 'Sore to Strong' }
    ],
    hiw: [
      { t: "ATTACH & POWER", d: "Choose one of 8 heads for your specific muscle group." },
      { t: "GLIDE OVER SORENESS", d: "10 minutes. 12mm deep. Feel the tension melt away." },
      { t: "WAKE UP RECOVERED", d: "Ready to train or work without the morning stiffness." }
    ],
    benefits: [
      { icon: 'muscle', title: 'Feel it in 60 seconds', text: '12mm amplitude hits real muscle tissue, not just the surface' },
      { icon: 'quiet', title: 'Use it during Netflix', text: 'Quieter than your TV. Your partner won\'t even notice.' },
      { icon: 'heads', title: 'Hit every muscle', text: 'Neck, back, legs, arms — without a second device' },
      { icon: 'battery', title: 'Recovery that fits your schedule', text: '10 minutes before bed beats skipping it forever' }
    ],
    reviews: [
      { name: 'Maria K.', city: 'Texas', quote: 'Down 2 dress sizes in 8 weeks. I use this every single day.', badge: 'SAVED $400/MO' },
      { name: 'James L.', city: 'California', quote: 'Legitimately the same quality as the $400 one my gym has. I use it after every workout.', badge: 'DAILY USER · 5 MONTHS' },
      { name: 'Sandra P.', city: 'Florida', quote: 'At 51, I thought this level of recovery was only for athletes. It\'s not. My back pain is gone.', badge: 'PAIN-FREE AT 51' }
    ],
    wasPrice: 109,
    savingsText: 'YOU SAVE $30 TODAY',
    bundleHandle: 'yoga-foam-roller',
    bundleTitle: 'Recovery Bundle',
    bundlePrice: 99
  },
  'walking-pad-for-home-office-quiet-under-desk-treadmill': {
    h1: 'BURN 300 CALORIES WITHOUT LEAVING YOUR DESK.',
    subtitle: 'The quietest way to get your steps in — during Zoom calls, Netflix, or lunch breaks.',
    problemHeadline: 'YOU KNOW THE FEELING.',
    problemText: 'Remote work is making you heavier. You know it. You\'ve known it for a while. But the gym is 20 minutes away, parking is a nightmare, and by 6pm you\'re done.\nThis fits under your desk. And under your budget.',
    transformations: [
      { icon: 'steps', text: 'Sedentary to Active' },
      { icon: 'quiet', text: 'Noisy to Silent' },
      { icon: 'display', text: 'Unseen to Tracked' },
      { icon: 'compact', text: 'Bulky to Hidden' }
    ],
    hiw: [
      { t: "SLIDE UNDER DESK", d: "4.7 inches tall. Fits under any standard workspace." },
      { t: "WALK & WORK", d: "0.6 mph for calls, 5 mph for your lunch break." },
      { t: "FOLD & STORE", d: "No tools. No mess. Done in 3 seconds." }
    ],
    benefits: [
      { icon: 'steps', title: 'Move while you work', text: '0.6 mph during calls. 5 mph when you\'re done.' },
      { icon: 'quiet', title: '40dB silent motor', text: 'Quieter than your keyboard. Your mic won\'t pick it up.' },
      { icon: 'display', title: 'See the numbers', text: 'Steps, calories, distance on LED display.' },
      { icon: 'compact', title: 'No dedicated space needed', text: 'Slides under your desk or bed in 3 seconds.' }
    ],
    reviews: [
      { name: 'David R.', city: 'New York', quote: 'I walk 8,000 steps a day and haven\'t missed a meeting. Down 5 lbs already.', badge: '8K STEPS DAILY' },
      { name: 'Lisa M.', city: 'Texas', quote: 'Down 14 lbs in 3 months. I didn\'t change my diet. I just started walking during work.', badge: '−14 LBS · 3 MONTHS' },
      { name: 'Tom H.', city: 'California', quote: 'My doctor told me to move more. This was the answer. Blood pressure is down.', badge: 'DOCTOR RECOMMENDED' }
    ],
    wasPrice: 399,
    savingsText: 'YOU SAVE $100 TODAY',
    bundleHandle: 'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads',
    bundleTitle: 'Move & Recover Bundle',
    bundlePrice: 349
  },
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': {
    h1: 'YOUR ENTIRE HOME GYM. FITS IN A BACKPACK.',
    subtitle: '5 resistance bands + door anchor + 30-day program. Start Day 1 today.',
    problemHeadline: 'YOU KNOW THE FEELING.',
    problemText: 'You\'ve tried the gym. Maybe twice. The commute, the crowd, the parking. You bought equipment that became a clothes rack. This is different — because it comes with a system.',
    transformations: [
      { icon: 'resistance', text: 'Weak to Powerful' },
      { icon: 'anchor', text: 'Limited to Total' },
      { icon: 'backpack', text: 'Static to Mobile' },
      { icon: 'program', text: 'Clueless to Guided' }
    ],
    hiw: [
      { t: "PICK YOUR WEIGHT", d: "Combine bands to reach up to 150 lbs of resistance." },
      { t: "ANCHOR & TRAIN", d: "Use the door anchor for rows, chest press, and more." },
      { t: "FOLLOW DAY 1", d: "Open the 30-day program and just do the work." }
    ],
    benefits: [
      { icon: 'backpack', title: 'Train in 6 square feet', text: 'Living room, hotel, backyard. Doesn\'t matter.' },
      { icon: 'program', title: '30-day program included', text: 'No guesswork. Open it and follow Day 1. That\'s it.' },
      { icon: 'resistance', title: '10 to 50 lbs resistance', text: 'Works for beginners and advanced. Stack them for more.' },
      { icon: 'money', title: 'Less than one gym month', text: 'One-time cost. Lasts for years.' }
    ],
    reviews: [
      { name: 'Ashley T.', city: 'Florida', quote: 'Lost 22 lbs using only this kit. No gym needed.', badge: '−22 LBS · 5 MONTHS' },
      { name: 'Marcus B.', city: 'Georgia', quote: 'The program made the difference. I actually know what to do on Tuesday.', badge: 'PROGRAM DRIVEN' },
      { name: 'Priya S.', city: 'Illinois', quote: 'As a busy mom, I have 20 minutes max. This was designed for me.', badge: 'DAILY 20M ROUTINE' }
    ],
    wasPrice: 129,
    savingsText: 'YOU SAVE $50 TODAY',
    bundleHandle: 'yoga-foam-roller',
    bundleTitle: 'Train & Recover Bundle',
    bundlePrice: 99
  },
  'yoga-foam-roller': {
    h1: '5 MINUTES OF ROLLING = 30 MINUTES OF STRETCHING.',
    subtitle: 'High-density foam roller that actually works. Used by physios. Priced for everyone.',
    problemHeadline: 'YOU KNOW THE FEELING.',
    problemText: 'You skip recovery because it takes too long. Foam rolling used to feel like a chore. This changes that — because you feel the blood flow in minutes.',
    transformations: [
      { icon: 'bloodflow', text: 'Stiff to Supple' },
      { icon: 'knots', text: 'Tense to Loose' },
      { icon: 'colors', text: 'Basic to Vibe' },
      { icon: 'portable', text: 'Home to Gym' }
    ],
    hiw: [
      { t: "IDENTIFY THE KNOT", d: "Find the tension in your back, legs, or shoulders." },
      { t: "ROLL & RELEASE", d: "Use your weight to break up knots and increase flow." },
      { t: "MOVE BETTER", d: "Instant improvement in mobility and range." }
    ],
    benefits: [
      { icon: 'bloodflow', title: 'Increase blood flow', text: 'Wake up ready to move, not stiff or sore.' },
      { icon: 'knots', title: 'Break up knots', text: 'Works back, legs, glutes, IT band — wherever you\'re tight.' },
      { icon: 'colors', title: '6 distinct colors', text: 'Pick what fits your space, your kit, or your vibe.' },
      { icon: 'portable', title: 'Take it anywhere', text: 'Gym, hotel, office. It goes where you go.' }
    ],
    reviews: [
      { name: 'Jennifer K.', city: 'Arizona', quote: 'My PT recommended this for my back. Best $35 I\'ve spent.', badge: 'PT RECOMMENDED' },
      { name: 'Carlos M.', city: 'Texas', quote: 'I use this every night. My legs feel completely different.', badge: 'DAILY USER' }
    ],
    wasPrice: 45,
    savingsText: 'YOU SAVE $10 TODAY',
    bundleHandle: 'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads',
    bundleTitle: 'Relaxation Bundle',
    bundlePrice: 99
  }
};

// Global State
let selectedVariantId = null;
let currentProduct = null;

// Init
const urlParams = new URL(window.location.href).searchParams;
const handle = urlParams.get('handle');

async function init() {
  if (!handle) { window.location.href = 'index.html'; return; }
  
  let product = null;
  try {
    const data = await getProductByHandle(handle);
    product = data?.product || data;
    if (product && !product.handle) product.handle = handle;
  } catch (e) {
    console.warn('Shopify API failed, using mock fallbacks.');
  }

  // Fallback to Mock if API fails or handles don't match
  if (!product || !product.title) {
    const mock = MOCK_PRODUCTS[handle];
    if (mock) {
      product = {
        handle: handle,
        title: mock.title,
        images: { edges: [{ node: { url: mock.image } }] },
        variants: { edges: [{ node: { id: 'mock-variant', title: 'Standard', quantityAvailable: mock.quantity, price: { amount: mock.price } } }] }
      };
    }
  }

  if (!product) return;
  currentProduct = product;
  renderProduct(product);
  setupStickyHeader();
  startShipTimer();
}

function renderProduct(product) {
  const copy = PRODUCT_COPY[product.handle] || PRODUCT_COPY[Object.keys(PRODUCT_COPY).find(k => product.handle.includes(k))];
  
  // 1. HERO
  const titleEl = document.getElementById('product-h1');
  const subEl = document.getElementById('product-subtitle-p');
  if (titleEl) titleEl.textContent = copy?.h1 || product.title;
  if (subEl) subEl.textContent = copy?.subtitle || '';
  document.title = `${product.title} — HealthHustleAcademy`;

  // Gallery
  const mainImg = document.getElementById('main-product-image');
  const stickyImg = document.getElementById('sticky-img');
  const fallbackImg = product.images.edges[0]?.node.url;
  if (mainImg) mainImg.src = fallbackImg;
  if (stickyImg) stickyImg.src = fallbackImg;

  const thumbs = document.getElementById('thumbnails');
  if (thumbs && product.images.edges.length > 1) {
    thumbs.innerHTML = product.images.edges.map((e, i) => `
      <img src="${e.node.url}" onclick="window.updateGallery('${e.node.url}')" style="width:60px; height:60px; object-fit:cover; border:1px solid var(--border); cursor:pointer;">
    `).join('');
  }

  // Pricing
  const priceEl = document.getElementById('product-price');
  const stickyPrice = document.getElementById('sticky-price');
  const splitEl = document.getElementById('payment-split');
  const variantBox = document.getElementById('variant-selector-pdp');

  if (product.variants.edges.length > 0) {
    const first = product.variants.edges[0].node;
    selectedVariantId = first.id;
    
    // Initial Price Update
    const updatePrices = (v) => {
      const p = parseFloat(v.price.amount);
      priceEl.textContent = `$${p.toFixed(2)}`;
      if (stickyPrice) stickyPrice.textContent = `$${p.toFixed(2)}`;
      if (splitEl) splitEl.textContent = `$${(p / 4).toFixed(2)}`;
      
      // Offer block
      const nowPriceEl = document.getElementById('offer-price-now');
      const wasPriceEl = document.getElementById('offer-price-was');
      if (nowPriceEl) nowPriceEl.textContent = `$${p.toFixed(2)}`;
      if (wasPriceEl) wasPriceEl.textContent = `$${(copy?.wasPrice || p + 30).toFixed(2)}`;
    };
    updatePrices(first);

    // Urgency
    const stockEl = document.getElementById('urgency-stock');
    if (stockEl && first.quantityAvailable < 50) {
       stockEl.textContent = `⚡ ONLY ${first.quantityAvailable} LEFT IN STOCK`;
       stockEl.style.display = 'block';
    } else if (stockEl && MOCK_PRODUCTS[product.handle]?.quantity) {
       stockEl.textContent = `⚡ ONLY ${MOCK_PRODUCTS[product.handle].quantity} LEFT IN STOCK`;
       stockEl.style.display = 'block';
    }

    variantBox.innerHTML = product.variants.edges.map((edge, i) => `
      <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="window.selectVariant('${edge.node.id}', this, '${edge.node.price.amount}')" style="width:100%; text-align:left; padding:12px; margin-bottom:8px; background:transparent; border:1px solid var(--border); color:white; cursor:pointer; display:flex; justify-content:space-between;">
        <span>${edge.node.title}</span>
        <span style="color:var(--emerald);">$${edge.node.price.amount}</span>
      </button>
    `).join('');
  }

  // 2. PROBLEM & TRANFORMATIONS
  const probHead = document.getElementById('problem-headline');
  const probText = document.getElementById('problem-text');
  if (probHead) probHead.textContent = copy?.problemHeadline || '';
  if (probText) probText.innerHTML = (copy?.problemText || '').replace('\n', '<br><br>');

  const transGrid = document.getElementById('transformation-grid');
  if (transGrid && copy?.transformations) {
    transGrid.innerHTML = copy.transformations.map(t => `
      <div style="text-align:center;">
        <div style="width:40px; height:40px; margin:0 auto 12px; color:var(--emerald);">${ICONS[t.icon] || ''}</div>
        <div style="font-family:'Barlow Condensed'; font-weight:900; font-size:11px; text-transform:uppercase;">${t.text}</div>
      </div>
    `).join('');
  }

  // 3. HIW & 4. BENEFITS & 5. REVIEWS
  // (... similar injection as before, but ensure it uses the copy object properly)
  const hiw = document.getElementById('hiw-steps');
  if (hiw && copy?.hiw) {
    hiw.innerHTML = copy.hiw.map((s, i) => `
      <div style="flex:1; text-align:center;">
        <span style="font-family:'Barlow Condensed'; color:var(--emerald); font-weight:900;">STEP 0${i+1}</span>
        <h4 style="font-family:'Anton'; font-size:20px; margin:8px 0;">${s.t}</h4>
        <p style="font-size:13px; color:var(--text-secondary);">${s.d}</p>
      </div>
    `).join('');
  }

  const benefits = document.getElementById('benefits-grid');
  if (benefits && copy?.benefits) {
    benefits.innerHTML = copy.benefits.map(b => `
      <div class="benefit-card">
        <div class="benefit-icon">${ICONS[b.icon] || ''}</div>
        <div class="benefit-title">${b.title}</div>
        <div class="benefit-text">${b.text}</div>
      </div>
    `).join('');
  }

  const reviews = document.getElementById('reviews-grid');
  if (reviews && copy?.reviews) {
    reviews.innerHTML = copy.reviews.map(r => `
      <div class="review-card">
        <div style="color:var(--emerald); margin-bottom:8px;">★★★★★</div>
        <p style="font-style:italic; font-size:14px; margin-bottom:16px;">"${r.quote}"</p>
        <div style="font-size:12px; color:var(--text-muted);">${r.name} · ${r.city}</div>
        <div class="review-badge">${r.badge}</div>
      </div>
    `).join('');
  }

  // 6. OFFER & OBJECTIONS
  const savingsEl = document.getElementById('offer-savings-text');
  if (savingsEl) savingsEl.textContent = copy?.savingsText || '';
  
  const objGrid = document.getElementById('objection-grid');
  if (objGrid && copy?.objections) {
    objGrid.innerHTML = copy.objections.map(o => `
      <div style="margin-bottom:32px;">
        <div style="font-family:'Barlow Condensed'; font-weight:900; color:var(--emerald); text-transform:uppercase;">${o.q}</div>
        <div style="font-size:14px; color:var(--text-secondary); line-height:1.6;">${o.a}</div>
      </div>
    `).join('');
  }

  // FAQ
  const faqList = document.getElementById('pdp-faq');
  if (faqList && copy?.faq) {
    faqList.innerHTML = copy.faq.map(f => `
      <div class="faq-item">
        <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
          ${f.q}
          <span>+</span>
        </button>
        <div class="faq-answer"><div style="padding:12px 0;">${f.a}</div></div>
      </div>
    `).join('');
  }

  if (copy?.bundleHandle) loadBundle(copy);

  // Global Helpers for this Page
  window.updateGallery = (url) => mainImg.src = url;
  window.selectVariant = (id, btn, price) => {
    selectedVariantId = id;
    document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    priceEl.textContent = `$${parseFloat(price).toFixed(2)}`;
    stickyPrice.textContent = priceEl.textContent;
  };
}

async function loadBundle(copy) {
  const bundleSect = document.getElementById('bundle-section');
  if (!bundleSect) return;

  bundleSect.innerHTML = `
    <div style="background:rgba(16,185,129,0.05); border:1px dashed var(--emerald); padding:32px; border-radius:4px; text-align:center;">
       <h3 style="font-family:'Anton'; font-size:24px; margin-bottom:8px;">FREQUENTLY BOUGHT TOGETHER</h3>
       <p style="font-size:14px; color:var(--text-secondary); margin-bottom:24px;">Upgrade to the ${copy.bundleTitle} and Save.</p>
       <div style="font-size:32px; font-weight:900; color:white; margin-bottom:24px;">$${copy.bundlePrice} <span style="font-size:14px; color:var(--emerald); text-decoration:line-through; opacity:0.5;">$${copy.bundlePrice + 15}</span></div>
       <button class="btn btn-primary" style="width:100%; height:60px;" id="add-bundle-btn">ADD BUNDLE & SAVE</button>
    </div>
  `;

  document.getElementById('add-bundle-btn').addEventListener('click', async () => {
    const btn = document.getElementById('add-bundle-btn');
    btn.textContent = 'ADDING...';
    // Logic for bundle (simple implementation)
    const bundleProduct = await getProductByHandle(copy.bundleHandle);
    const bundleVid = bundleProduct?.variants?.edges[0]?.node?.id || 'mock-vid';
    await addToCart(null, [{ merchandiseId: selectedVariantId, quantity: 1 }, { merchandiseId: bundleVid, quantity: 1 }]);
    btn.textContent = 'BUNDLE ADDED!';
    if (window.handleAddToCart) window.handleAddToCart(null, null);
    if (window.openCart) window.openCart();
  });
}

function startShipTimer() {
  const timerEl = document.getElementById('countdown-timer');
  const wrapper = document.getElementById('ship-timer');
  if (!timerEl) return;
  wrapper.style.display = 'block';

  function update() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timerEl.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
  setInterval(update, 1000);
  update();
}

function setupStickyHeader() {
  const trigger = document.getElementById('add-to-cart-btn');
  const sticky = document.getElementById('sticky-atc');
  const title = document.getElementById('sticky-title');
  if (!trigger || !sticky) return;

  title.textContent = document.getElementById('product-h1').textContent;

  const observer = new IntersectionObserver(([entry]) => {
    sticky.style.display = entry.isIntersecting ? 'none' : 'flex';
  }, { threshold: 0 });
  observer.observe(trigger);
}

document.getElementById('add-to-cart-btn').addEventListener('click', (e) => {
  if (window.handleAddToCart) window.handleAddToCart(selectedVariantId, e.target);
});

init();
