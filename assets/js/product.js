import { getProductByHandle, addToCart } from './shopify.js?v=1.1';
import { ICONS } from '../icons/icons.js';

// Configuration & Data
const PRODUCT_COPY = {
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': {
    h1: "YOUR BACK CALLED. IT'S DONE WAITING.",
    subtitle: 'Professional deep-tissue recovery — at home, in 10 minutes, for $79.',
    problemHeadline: 'YOU SIT FOR 8 HOURS AND WONDER WHY YOUR NECK IS WRECKED.',
    problemText: 'Ibuprofen. Stretching. Ignoring it. None of it sticks. This does.',
    finalCta: 'FEEL BETTER TOMORROW.',
    features: [
      { icon: 'muscle', title: 'FEEL IT IN 60 SECONDS', text: '12mm amplitude hits real muscle tissue, not just the surface' },
      { icon: 'quiet', title: 'USE IT ANYWHERE', text: 'Quieter than your TV. Use it during Netflix. Your partner won\'t notice.' },
      { icon: 'heads', title: 'FULL BODY COVERAGE', text: '8 heads for neck, shoulders, back, legs, feet. One device.' },
      { icon: 'battery', title: 'HOURS PER CHARGE', text: 'USB-C. Long battery life. Never dies mid-session.' },
    ],
    reviews: [
      { name: 'Maria K.', city: 'Texas', quote: 'I used to spend $80/month on massage therapy. Now I do it myself every night. My neck hasn\'t felt this good in years.', badge: 'PAIN-FREE · 3 MONTHS' },
      { name: 'James L.', city: 'California', quote: 'Legitimately the same quality as the $400 one my gym has. I use it after every workout and my recovery is completely different.', badge: 'DAILY USER · 5 MONTHS' },
      { name: 'Sandra P.', city: 'Florida', quote: 'At 51, I thought this level of recovery was only for athletes. It\'s not. My back pain is gone.', badge: 'PAIN-FREE AT 51' },
    ],
    bundleProductHandle: 'yoga-foam-roller',
    bundleTitle: 'RECOVERY BUNDLE',
    bundleSavings: 15,
    urgencyText: 'left at this price',
    faq: [
      { q: 'Is this as good as a Theragun?', a: 'Same percussion technology. Theragun charges $400 for the brand name. You\'re paying $79 for the device that does the same job.' },
      { q: 'Will I actually use it?', a: '10 minutes before bed. That\'s the habit. Most customers reach for it 4–5x per week after the first week — because it works.' },
      { q: 'What if it doesn\'t work for me?', a: '60-day guarantee. Use it every day for 2 months. If you don\'t feel the difference — full refund. No forms, no questions.' },
      { q: 'How long does the battery last?', a: 'Several hours of use per charge via USB-C. Most people charge it once a week.' },
    ],
  },
  'walking-pad-for-home-office-quiet-under-desk-treadmill': {
    h1: 'BURN 300 CALORIES WITHOUT LEAVING YOUR DESK.',
    subtitle: 'The quietest way to move more — during Zoom calls, Netflix, or lunch breaks.',
    problemHeadline: 'REMOTE WORK IS MAKING YOU HEAVIER. YOU KNOW IT.',
    problemText: 'The gym is 20 minutes away. Parking is a nightmare. By 6pm you\'re done. This fits under your desk. And under your budget.',
    finalCta: 'START MOVING TODAY.',
    features: [
      { icon: 'steps', title: 'BURN WHILE YOU WORK', text: '0.6 mph during calls. 5 mph when you\'re done. You decide.' },
      { icon: 'quiet', title: '40 DECIBELS', text: 'Quieter than your keyboard. Your mic won\'t pick it up on calls.' },
      { icon: 'display', title: 'TRACK EVERYTHING', text: 'Steps, calories, distance, time — LED display, always visible.' },
      { icon: 'compact', title: 'SLIDES UNDER ANY DESK', text: '4.7 inches tall. No assembly. In use in under 60 seconds.' },
    ],
    reviews: [
      { name: 'David R.', city: 'New York', quote: 'I walk 8,000 steps a day without changing anything about my routine. I just put it under my desk and walk during meetings.', badge: '8K STEPS DAILY' },
      { name: 'Lisa M.', city: 'Texas', quote: 'Down 14 lbs in 3 months. I didn\'t change my diet. I just started walking during work hours. This thing is insane.', badge: '−14 LBS · 3 MONTHS' },
      { name: 'Tom H.', city: 'California', quote: 'My doctor told me to move more. Couldn\'t make the gym work with my schedule. This was the answer. Blood pressure is down.', badge: 'DOCTOR RECOMMENDED' },
    ],
    bundleProductHandle: 'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads',
    bundleTitle: 'MOVE + RECOVER BUNDLE',
    bundleSavings: 20,
    urgencyText: 'left at this price',
    faq: [
      { q: 'Will this fit under my desk?', a: 'Yes. It\'s 4.7 inches tall. Fits under any standard desk with at least 5 inches of clearance.' },
      { q: 'Is it loud on Zoom calls?', a: '40dB at walking speed. That\'s quieter than a normal conversation. Your mic won\'t pick it up.' },
      { q: 'What if I never use it?', a: '60-day guarantee. Walk on it daily for 2 months. If it\'s collecting dust — full refund. We\'ve never had that happen, but the offer stands.' },
      { q: 'How fast does it go?', a: '0.6 to 5 mph. Walking mode for desk use, faster speeds for actual workouts.' },
    ],
  },
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': {
    h1: 'YOUR ENTIRE HOME GYM. FITS IN A BACKPACK.',
    subtitle: '5 resistance bands + door anchor + 30-day program. Start Day 1 today.',
    problemHeadline: 'YOU\'VE BOUGHT EQUIPMENT THAT BECAME A CLOTHES RACK.',
    problemText: 'The commute killed your gym streak. The dumbbells collect dust. This is different — because it comes with a system. Open the PDF and follow Day 1.',
    finalCta: 'BUILD YOUR HOME GYM TODAY.',
    features: [
      { icon: 'resistance', title: '10 TO 50 LBS RESISTANCE', text: 'Beginner to advanced. Five bands, five levels, one kit.' },
      { icon: 'anchor', title: 'DOOR ANCHOR INCLUDED', text: 'Full upper body training without a rack or a gym.' },
      { icon: 'backpack', title: 'TRAIN ANYWHERE', text: 'Home, hotel, park. Fits in the bag your laptop goes in.' },
      { icon: 'program', title: '30-DAY PROGRAM INCLUDED', text: 'No guesswork. Open Day 1 and follow along. That\'s it.' },
    ],
    reviews: [
      { name: 'Ashley T.', city: 'Florida', quote: 'I\'ve tried 3 home workout setups. This is the first one I\'ve actually stuck with. The program made the difference.', badge: 'CONSISTENT · 4 MONTHS' },
      { name: 'Marcus B.', city: 'Georgia', quote: 'Lost 22 lbs using only this kit. No gym. No expensive equipment. Just these bands and the program.', badge: '−22 LBS · 5 MONTHS' },
      { name: 'Priya S.', city: 'Illinois', quote: 'As a busy mom, I have 20 minutes max. This kit was designed for exactly that. I use it every morning before the kids wake up.', badge: 'BUSY MOM · DAILY USER' },
    ],
    bundleProductHandle: 'yoga-foam-roller',
    bundleTitle: 'TRAIN + RECOVER BUNDLE',
    bundleSavings: 10,
    urgencyText: 'left',
    faq: [
      { q: 'Will this actually work if I\'m a beginner?', a: 'The 10lb band is genuinely beginner level. The 30-day program starts at Day 1 — not "Day 1 if you already know what you\'re doing."' },
      { q: 'How long are the workouts?', a: '20 minutes. Designed specifically for people who don\'t have more time than that.' },
      { q: 'Does it work for strength building, not just cardio?', a: 'Yes. Resistance training builds muscle the same way weights do. The program covers legs, arms, core, and back.' },
      { q: 'What if the bands snap?', a: '60-day guarantee covers everything. We\'ll replace or refund, no questions.' },
    ],
  },
  'yoga-foam-roller': {
    h1: '5 MINUTES OF ROLLING = 30 MINUTES OF STRETCHING.',
    subtitle: 'High-density foam roller used by physios. Priced for everyone.',
    problemHeadline: 'YOU SKIP RECOVERY BECAUSE IT TAKES TOO LONG.',
    problemText: 'Foam rolling used to feel like a chore. High-density EVA changes that — 5 minutes and you feel the difference. Used by physios on $200/hr clients.',
    finalCta: 'FEEL BETTER TOMORROW MORNING.',
    features: [
      { icon: 'bloodflow', title: 'INCREASE BLOOD FLOW', text: 'Wake up actually ready to move. Not stiff. Not sore.' },
      { icon: 'knots', title: 'BREAK UP KNOTS', text: 'Works back, legs, glutes, IT band — wherever you\'re tight.' },
      { icon: 'colors', title: '6 COLORS', text: 'Pick what matches your space, your kit, or your vibe.' },
      { icon: 'portable', title: 'TAKE IT ANYWHERE', text: 'Gym, hotel, office. It goes where you go.' },
    ],
    reviews: [
      { name: 'Jennifer K.', city: 'Arizona', quote: 'My physical therapist recommended foam rolling. I bought the expensive one first — same result with this.', badge: 'PT RECOMMENDED' },
      { name: 'Carlos M.', city: 'Texas', quote: 'I use this every night before bed. My legs feel completely different in the morning. Worth 10x the price.', badge: 'DAILY USER' },
      { name: 'Rachel H.', city: 'New York', quote: 'I\'m a runner. This is non-negotiable for my recovery. IT band issues gone after 2 weeks of consistent rolling.', badge: 'IT BAND FIXED' },
    ],
    bundleProductHandle: 'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads',
    bundleTitle: 'FULL RECOVERY BUNDLE',
    bundleSavings: 15,
    urgencyText: 'left at this price',
    faq: [
      { q: 'Is this firm enough to actually work?', a: 'High-density EVA — the same material physios use. Firm enough to reach real muscle tissue, not soft enough to be useless.' },
      { q: 'What size is it?', a: '33cm x 14cm. Full-length for back and legs. Long enough to actually work.' },
      { q: 'Does color affect quality?', a: 'No. Same material, same density, same quality. Pick what you like.' },
      { q: 'Can I use it if I\'m new to foam rolling?', a: 'Yes. Start with 60 seconds per muscle group. It might be intense at first — that\'s normal and it passes within a week.' },
    ],
  },
};

// State
let currentProduct = null;
let selectedVariantId = null;

// Initialization
const handle = new URLSearchParams(window.location.search).get('handle');

async function init() {
  if (!handle) { window.location.href = 'index.html'; return; }
  const data = await getProductByHandle(handle);
  const product = data?.product || data;
  if (!product) { console.error('Product not found'); return; }
  currentProduct = product;
  renderProduct(product);
  setupStickyHeader();
}

function renderProduct(product) {
  const copy = PRODUCT_COPY[product.handle] || PRODUCT_COPY[Object.keys(PRODUCT_COPY).find(k => product.handle.includes(k))];
  if (!copy) { console.warn('Missing premium copy for handle:', product.handle); }

  // 1. HERO BLOCK
  document.getElementById('product-h1').textContent = copy?.h1 || product.title;
  document.getElementById('product-subtitle-p').textContent = copy?.subtitle || '';
  document.title = `${product.title} — HealthHustleAcademy`;

  // Gallery
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) mainImg.src = product.images.edges[0]?.node.url;
  
  const thumbs = document.getElementById('thumbnails');
  if (thumbs) {
    thumbs.innerHTML = product.images.edges.map((edge, i) => `
      <img src="${edge.node.url}" class="thumb ${i === 0 ? 'active' : ''}" onclick="window.updateGallery('${edge.node.url}', this)" style="width:80px; height:80px; object-fit:cover; border-radius:2px; cursor:pointer; border:1px solid var(--border); ${i === 0 ? 'border-color:var(--emerald)' : ''}">
    `).join('');
  }

  // Stars
  document.getElementById('pdp-stars').innerHTML = Array(5).fill(ICONS.star).join('');

  // Variants & Price
  const variantBox = document.getElementById('variant-selector-pdp');
  const priceEl = document.getElementById('product-price');
  const splitEl = document.getElementById('payment-split');
  
  if (product.variants.edges.length > 0) {
    selectedVariantId = product.variants.edges[0].node.id;
    const updatePrice = (variant) => {
      priceEl.textContent = `$${parseFloat(variant.price.amount).toFixed(2)}`;
      splitEl.textContent = `$${(parseFloat(variant.price.amount) / 4).toFixed(2)}`;
      document.getElementById('sticky-price').textContent = priceEl.textContent;
      
      // Urgency Logic
      const urgencyEl = document.getElementById('urgency-badge');
      const qty = variant.quantityAvailable || 0;
      if (qty > 0 && qty < 100) {
        urgencyEl.textContent = `⚡ Only ${qty} ${copy?.urgencyText || 'left'}`;
        urgencyEl.style.display = 'block';
      } else {
        urgencyEl.style.display = 'none';
      }
    };
    
    updatePrice(product.variants.edges[0].node);

    variantBox.innerHTML = product.variants.edges.map((edge, i) => `
      <button class="variant-btn ${i === 0 ? 'active' : ''}" 
              onclick="window.selectVariant('${edge.node.id}', this, '${edge.node.price.amount}', ${edge.node.quantityAvailable || 0})"
              style="width:100%; text-align:left; padding:12px 20px; background:transparent; border:1px solid var(--border); color:white; font-family:'Barlow Condensed'; font-weight:700; margin-bottom:8px; cursor:pointer; display:flex; justify-content:space-between;">
        <span>${edge.node.title}</span>
        <span style="color:var(--emerald);">$${edge.node.price.amount}</span>
      </button>
    `).join('');
  }

  // Trust Row
  document.getElementById('trust-row-pdp').innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-secondary);"><span style="color:var(--emerald);">${ICONS.check}</span> FREE WORLDWIDE SHIPPING</div>
    <div style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-secondary);"><span style="color:var(--emerald);">${ICONS.check}</span> 60-DAY RISK-FREE GUARANTEE</div>
    <div style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-secondary);"><span style="color:var(--emerald);">${ICONS.check}</span> SHIPS IN 24-48 HOURS</div>
  `;

  // 2. TRUST BAR (Icons)
  document.getElementById('tb-shipping').innerHTML = `${ICONS.shipping} FREE SHIPPING`;
  document.getElementById('tb-guarantee').innerHTML = `${ICONS.guarantee} 60-DAY GUARANTEE`;
  document.getElementById('tb-rating').innerHTML = `${ICONS.star} 4.9/5 RATING`;
  document.getElementById('tb-support').innerHTML = `${ICONS.support} US SUPPORT`;

  // 3. PROBLEM BLOCK
  document.getElementById('problem-headline').textContent = copy?.problemHeadline || '';
  document.getElementById('problem-text').textContent = copy?.problemText || '';

  // 4. BENEFITS GRID
  const benefitsGrid = document.getElementById('benefits-grid');
  if (benefitsGrid && copy?.features) {
    benefitsGrid.innerHTML = copy.features.map(f => `
      <div class="benefit-card">
        <div class="benefit-icon">${ICONS[f.icon] || ''}</div>
        <div class="benefit-title">${f.title}</div>
        <div class="benefit-text">${f.text}</div>
      </div>
    `).join('');
  }

  // 5. HOW IT WORKS
  const hiw = document.getElementById('hiw-steps');
  if (hiw) {
    hiw.innerHTML = [
      { t: "ORDER YOUR KIT", d: "Choose your professional tools and start your recovery journey." },
      { t: "OPEN DAY 1", d: "Follow our elite integration program for maximum results." },
      { t: "FEEL THE GAINS", d: "Recovery, mobility, and strength like you've never felt before." }
    ].map((s, i) => `
      <div class="hiw-step">
        <span class="hiw-number">STEP 0${i+1}</span>
        <h3 style="font-family:'Anton'; font-size:24px; margin-bottom:16px;">${s.t}</h3>
        <p style="font-size:14px; color:var(--text-secondary); line-height:1.6;">${s.d}</p>
      </div>
    `).join('');
  }

  // 6. SOCIAL PROOF
  const reviewsGrid = document.getElementById('reviews-grid');
  if (reviewsGrid && copy?.reviews) {
    reviewsGrid.innerHTML = copy.reviews.map(r => `
      <div class="review-card">
         <div style="color:var(--emerald); font-size:12px; margin-bottom:12px;">★★★★★</div>
         <p style="font-size:16px; color:var(--text-primary); font-style:italic; line-height:1.6; margin-bottom:20px;">"${r.quote}"</p>
         <div style="font-family:'Barlow Condensed'; font-size:13px; color:var(--text-muted); opacity:0.8; letter-spacing:0.05em;">${r.name} · ${r.city} · Verified</div>
         <div class="review-badge">${r.badge}</div>
      </div>
    `).join('');
  }

  // 7. BUNDLE UPSELL
  const bundleSect = document.getElementById('bundle-section');
  if (bundleSect && copy?.bundleProductHandle) {
    loadBundle(copy);
  }

  // 8. FAQ
  const faqGrid = document.getElementById('pdp-faq');
  if (faqGrid && copy?.faq) {
    faqGrid.innerHTML = copy.faq.map((f, i) => `
      <div class="faq-item">
        <button class="faq-question" onclick="window.toggleFAQ(this)">
          ${f.q}
          <span class="faq-icon">${ICONS.arrow}</span>
        </button>
        <div class="faq-answer">
          <div style="padding-top:12px;">${f.a}</div>
        </div>
      </div>
    `).join('');
  }

  // 9. FINAL CTA
  document.getElementById('final-cta-headline').textContent = copy?.finalCta || '';
  
  // Sticky ATC Title
  document.getElementById('sticky-title').textContent = product.title;
  
  // Global helpers
  window.updateGallery = (url, thumb) => {
    mainImg.src = url;
    document.querySelectorAll('.pdp-gallery .thumb').forEach(t => t.style.borderColor = 'var(--border)');
    thumb.style.borderColor = 'var(--emerald)';
  };
  
  window.selectVariant = (id, btn, price, qty) => {
    selectedVariantId = id;
    document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    priceEl.textContent = `$${parseFloat(price).toFixed(2)}`;
    splitEl.textContent = `$${(parseFloat(price) / 4).toFixed(2)}`;
    document.getElementById('sticky-price').textContent = priceEl.textContent;
    
    // Update urgency
    const urgencyEl = document.getElementById('urgency-badge');
    if (qty > 0 && qty < 100) {
      urgencyEl.textContent = `⚡ Only ${qty} ${copy?.urgencyText || 'left'}`;
      urgencyEl.style.display = 'block';
    } else {
      urgencyEl.style.display = 'none';
    }
  };
}

async function loadBundle(copy) {
  const bundleData = await getProductByHandle(copy.bundleProductHandle);
  const bundleProduct = bundleData?.product || bundleData;
  if (!bundleProduct) return;
  
  const bundleSect = document.getElementById('bundle-section');
  const currentImg = currentProduct.images.edges[0]?.node.url;
  const bundleImg = bundleProduct.images.edges[0]?.node.url;
  const totalPrice = parseFloat(currentProduct.variants.edges[0].node.price.amount) + parseFloat(bundleProduct.variants.edges[0].node.price.amount) - copy.bundleSavings;

  bundleSect.innerHTML = `
    <div class="container">
      <p style="font-family:'Barlow Condensed'; color:var(--emerald); font-size:12px; letter-spacing:0.2em; text-transform:uppercase; margin-bottom:40px;">FREQUENTLY BOUGHT TOGETHER</p>
      <div style="display:flex; align-items:center; gap:48px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:20px;">
          <img src="${currentImg}" style="width:120px; height:120px; object-fit:cover; border-radius:4px; border:1px solid var(--border);">
          <span style="font-size:32px; color:var(--text-muted);">+</span>
          <img src="${bundleImg}" style="width:120px; height:120px; object-fit:cover; border-radius:4px; border:1px solid var(--border);">
        </div>
        <div>
          <h3 style="font-family:'Anton'; font-size:32px; margin-bottom:12px;">${copy.bundleTitle}</h3>
          <p style="font-size:18px; font-weight:700; color:var(--emerald); margin-bottom:24px;">$${totalPrice.toFixed(2)} <span style="font-size:14px; text-decoration:line-through; opacity:0.5; margin-left:8px;">$${(totalPrice + copy.bundleSavings).toFixed(2)}</span></p>
          <button class="btn btn-primary bundle-btn" onclick="window.addBundle('${selectedVariantId}', '${bundleProduct.variants.edges[0].node.id}')">ADD BUNDLE & SAVE $${copy.bundleSavings} →</button>
        </div>
      </div>
    </div>
  `;
}

window.addBundle = async (vid1, vid2) => {
  const btn = event.target;
  btn.textContent = 'ADDING...';
  await addToCart(vid1, 1);
  await addToCart(vid2, 1);
  btn.textContent = 'BUNDLE ADDED!';
  if (window.handleAddToCart) window.handleAddToCart(null, null, true); // Trigger cart refresh
  if (window.openCart) window.openCart();
};

window.toggleFAQ = (btn) => {
  btn.parentElement.classList.toggle('active');
};

window.scrollToATC = () => {
  document.getElementById('pdp-hero').scrollIntoView({ behavior: 'smooth' });
};

function setupStickyHeader() {
  const atc = document.getElementById('add-to-cart-btn');
  const sticky = document.getElementById('sticky-atc');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        sticky.style.display = 'flex';
        setTimeout(() => sticky.classList.add('visible'), 10);
      } else {
        sticky.classList.remove('visible');
        setTimeout(() => sticky.style.display = 'none', 400);
      }
    });
  }, { threshold: 0 });
  
  if (atc) observer.observe(atc);
}

// ATC Handling
document.getElementById('add-to-cart-btn').addEventListener('click', async (e) => {
  const btn = e.target;
  if (!selectedVariantId) return;
  btn.textContent = 'ADDING...';
  if (window.handleAddToCart) {
    await window.handleAddToCart(selectedVariantId, btn);
  }
  btn.textContent = 'ADD TO CART';
});

// Cart Count Fix
document.addEventListener('cartUpdated', (e) => {
  const count = e.detail?.totalQuantity || 0;
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
});

init();
