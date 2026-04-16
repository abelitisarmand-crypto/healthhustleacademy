import { getProductByHandle, addToCart } from './shopify.js?v=3.0';
import { ICONS } from '../icons/icons.js';

// Phase 7: Bulletproof Fallbacks & Conversion Data
const MOCK_PRODUCTS = {
  'massage-gun-deep-tissue-percussion-massager-for-athletes-handheld-body-back-muscle-massager-gun-with-8-massage-heads': {
    title: "Deep Tissue Massage Gun",
    price: "79.00",
    image: "https://vignette.wikia.nocookie.net/gear-for-sport/images/d/d4/Massage_Gun.jpg/revision/latest?cb=20200521151445", 
    quantity: 10
  },
  'walking-pad-for-home-office-quiet-under-desk-treadmill': {
    title: "Under-Desk Walking Pad",
    price: "299.00",
    image: "https://m.media-amazon.com/images/I/71z7XmK-j7L._AC_SL1500_.jpg",
    quantity: 37
  },
  '5-pc-set-resistance-band-resistance-bands-exercise-bands-exercise-resistance-bands-exercise': {
    title: "Home Gym Starter Kit",
    price: "79.00",
    image: "https://m.media-amazon.com/images/I/81+Xp+T8YkL._AC_SL1500_.jpg",
    quantity: 230
  },
  'yoga-foam-roller': {
    title: "Foam Roller Pro",
    price: "35.00",
    image: "https://m.media-amazon.com/images/I/71Y+z6kL0OL._AC_SL1500_.jpg",
    quantity: null
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
    bundlePrice: 99,
    box: [
      '1x Pro-Grade Percussion Massager',
      '8x Interchangeable Massage Heads',
      '1x Premium Protective Carry Case',
      '1x Rapid-Charge USB-C Cable'
    ],
    faq: [
      { q: "Is this as good as a Theragun?", a: "Same percussion tech. Theragun charges $400 for the brand. You pay $79 for the device." },
      { q: "Will I actually use it?", a: "10 minutes before bed. Most customers use it 4-5x per week after the first week." },
      { q: "What if it doesn't work for me?", a: "60-day guarantee. Full refund. No questions asked." },
      { q: "How long does the battery last?", a: "Several hours per charge via USB-C. Most people charge it once a week." }
    ],
    objections: [
      { q: "IS IT BETTER THAN THE CHEAP ONES?", a: "We use a brushless high-torque motor. It won't stall even when you press hard." },
      { q: "CAN I USE IT ON MY NECK?", a: "Yes. Use the 'U-shape' or 'Ball' head on the lowest setting for neck and traps." }
    ]
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
    bundlePrice: 349,
    box: [
      '1x Ultra-Slim Walking Pad',
      '1x Remote Control (Battery Included)',
      '1x Safety Magnet Clip',
      '1x Silicone Lubricant Oil',
      'User Manual & 30-Day Program PDF'
    ],
    faq: [
      { q: "Will this fit under my desk?", a: "4.7 inches tall. Fits under any standard desk with 5+ inches of clearance." },
      { q: "Is it loud on Zoom calls?", a: "40dB at walking speed. Quieter than normal conversation. Mic won't pick it up." },
      { q: "What if I never use it?", a: "60-day guarantee. Full refund if it collects dust." },
      { q: "How fast does it go?", a: "0.6 to 5 mph. Walking mode for desk use, faster for workouts." }
    ],
    objections: [
      { q: "IS IT DIFFICULT TO SET UP?", a: "Zero setup. Open the box, plug it in, and start walking." },
      { q: "DO I NEED A STANDING DESK?", a: "It works best with one, but many users use it while watching TV or during phone calls." }
    ],
    detailedReviews: {
      title: "REAL RESULTS FROM REAL CUSTOMERS",
      avg: "4.9",
      count: "8 REVIEWS",
      items: [
        {
          name: "Sarah M.",
          location: "New York, NY",
          stars: 5,
          headline: "Perfect for my home office",
          body: "I was skeptical about a walking pad at this price point, but wow. Set it up in under 10 minutes. I use it during Zoom calls and easily hit 8,000 steps before lunch. Super quiet — my coworkers have no idea I'm walking.",
          photos: ["review-01.jpg", "review-02.jpg", "review-03.jpg"]
        },
        {
          name: "Jason K.",
          location: "Chicago, IL",
          stars: 5,
          headline: "Solid build, compact design",
          body: "Shipping was fast. The box was heavy but well-packed — no damage at all. Slides right under my standing desk. The speed control is smooth and the belt feels sturdy. Already recommended it to two friends.",
          photos: ["review-04.jpg", "review-05.jpg", "review-06.jpg", "review-07.jpg"]
        },
        {
          name: "Maria L.",
          location: "Austin, TX",
          stars: 5,
          headline: "Game changer for WFH life",
          body: "I work from home and was gaining weight from sitting all day. This walking pad literally changed my routine. I walk 2-3 hours a day now while working. Assembly was straightforward — just unbox and go.",
          photos: ["review-08.jpg", "review-09.jpg", "review-10.jpg"]
        },
        {
          name: "David R.",
          location: "Seattle, WA",
          stars: 4,
          headline: "Great value, minor learning curve",
          body: "Took a day to get used to walking and typing at the same time, but now it feels natural. Build quality is legit — metal frame, not cheap plastic. The remote control is a nice touch. Only wish it had a slightly wider belt.",
          photos: ["review-11.jpg", "review-12.jpg", "review-13.jpg", "review-14.jpg"]
        },
        {
          name: "Amanda T.",
          location: "Denver, CO",
          stars: 5,
          headline: "Unboxing was exciting!",
          body: "Everything came double-boxed and protected. Plugged it in and started walking within 5 minutes. It's whisper quiet — I use it while watching TV at night. Best health purchase I've made this year.",
          photos: ["review-15.jpg", "review-16.jpg", "review-17.jpg"]
        },
        {
          name: "Chris W.",
          location: "Boston, MA",
          stars: 5,
          headline: "Fits perfectly under my desk",
          body: "Measured my desk clearance before ordering and it fits with room to spare. The LED display shows speed, time, and calories. I've been averaging 12,000 steps a day since I got it. My Apple Watch is thrilled.",
          photos: ["review-18.jpg", "review-19.jpg", "review-20.jpg"]
        },
        {
          name: "Nicole P.",
          location: "Miami, FL",
          stars: 5,
          headline: "Surprised by the quality",
          body: "For under $300 I expected flimsy. This thing is solid. The motor is quiet, the surface has good grip, and it stores vertically when I need floor space. Packing was professional — every piece wrapped separately.",
          photos: ["review-21.jpg", "review-22.jpg", "review-23.jpg", "review-24.jpg"]
        },
        {
          name: "Tyler B.",
          location: "Portland, OR",
          stars: 4,
          headline: "Does exactly what it promises",
          body: "No fancy features, no app — just a reliable walking pad that works. Speed goes up to 6 km/h which is plenty for desk walking. Power cord is long enough to reach my outlet. Solid purchase.",
          photos: ["review-25.jpg", "review-26.jpg", "review-27.jpg", "review-28.jpg", "review-29.jpg", "review-30.jpg"]
        }
      ]
    }
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
    bundlePrice: 99,
    box: [
      '5x Color-Coded Resistance Bands (10-50 lbs)',
      '1x Heavy-Duty Door Anchor',
      '2x Cushioned Soft-Grip Handles',
      '2x Ankle Straps',
      '1x Waterproof Carrying Bag',
      'Digital 30-Day Training Program'
    ],
    faq: [
      { q: "Will this work if I'm a beginner?", a: "The 10lb band is genuinely beginner level. Day 1 of the program requires zero experience." },
      { q: "How long are the workouts?", a: "20 minutes. Built specifically for people who don't have more time than that." },
      { q: "Does it build real muscle?", a: "Yes. Resistance training builds muscle the same way weights do." },
      { q: "What if the bands snap?", a: "60-day guarantee covers everything. Replace or full refund, no questions." }
    ],
    objections: [
      { q: "ARE THEY DURABLE?", a: "Made from 100% natural latex. They won't snap or lose elasticity even after years of use." },
      { q: "I'M A TOTAL BEGINNER?", a: "Perfect. Start with the yellow (10lb) band and follow the Day 1 video guide." }
    ],
    detailedReviews: {
      title: "REAL RESULTS FROM REAL CUSTOMERS",
      avg: "4.9",
      count: "4 REVIEWS",
      items: [
        {
          name: "Karen M.",
          location: "Phoenix, AZ",
          stars: 5,
          headline: "Finally something that fits in my closet AND actually works",
          body: "I've tried dumbbells, a yoga mat, even a stationary bike — all collecting dust within a month. These bands are different. I use them every single morning. The handles are comfortable, the resistance levels are real, and the whole kit fits in the little bag it came with. My arms and shoulders are noticeably stronger after 6 weeks.",
          photos: ["bands-review-01-1.jpg", "bands-review-01-2.jpg", "bands-review-01-3.jpg"]
        },
        {
          name: "David R.",
          location: "Austin, TX",
          stars: 5,
          headline: "Better quality than I expected at this price point",
          body: "My physical therapist recommended resistance bands for my shoulder recovery and I'm glad I went with this set. The rubber is thick, the carabiners are solid, and the door anchor hasn't slipped once. I do rows and lat pulldowns every day with the door setup — no gym membership needed.",
          photos: ["bands-review-02-1.jpg", "bands-review-02-2.jpg", "bands-review-02-3.jpg"]
        },
        {
          name: "James W.",
          location: "Portland, OR",
          stars: 5,
          headline: "My entire home gym in one bag",
          body: "I travel constantly for work and these go in my suitcase every trip. The door anchor setup takes literally 10 seconds — just loop it over the top of any door and you're ready. I've done full upper body workouts in hotel rooms. At home I use the full rack setup.",
          photos: ["bands-review-03-1.jpg", "bands-review-03-2.jpg", "bands-review-03-3.jpg"]
        },
        {
          name: "Michael S.",
          location: "Sacramento, CA",
          stars: 5,
          headline: "Perfect for staying active without leaving the house",
          body: "Bought this after my gym closed early on weekends. Now I don't even miss it. The bands are durable — I use them 5 days a week and zero signs of wear after 3 months. The variety of resistance levels means I can actually progress, not just maintain.",
          photos: ["bands-review-04-1.jpg", "bands-review-04-2.jpg", "bands-review-04-3.jpg"]
        }
      ]
    }
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
    bundlePrice: 99,
    box: [
      '1x Pro-Density Foam Roller',
      '1x Travel Carry Bag',
      'Free Recovery Guide PDF'
    ],
    faq: [
      { q: "Is this firm enough to actually work?", a: "High-density EVA — same material physios use. Firm enough to reach real muscle tissue." },
      { q: "What size is it?", a: "33cm x 14cm. Full-length — works back, legs, glutes, IT band." },
      { q: "Can I use it as a beginner?", a: "Yes. Start 60 seconds per muscle group. The intensity passes within a week." }
    ],
    objections: [
      { q: "I'VE NEVER USED ONE BEFORE?", a: "We include a 5-minute video guide. It's as simple as lying down and breathing." },
      { q: "IS IT DURABLE?", a: "Won't lose its shape. Tested for up to 300 lbs of pressure." }
    ]
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

  // Dynamic SEO/Social Meta Tags
  try {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogImg = document.querySelector('meta[property="og:image"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twImg = document.querySelector('meta[name="twitter:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.content = product.title + ' — HealthHustleAcademy';
    if (twTitle) twTitle.content = product.title + ' — HealthHustleAcademy';
    if (ogImg) ogImg.content = product.images.edges[0]?.node.url || '';
    if (twImg) twImg.content = product.images.edges[0]?.node.url || '';
    if (ogDesc) ogDesc.content = copy?.subtitle || product.description?.substring(0,150) || '';
    if (ogUrl) ogUrl.content = window.location.href;
  } catch (e) {
    console.warn('Failed to update meta tags:', e);
  }

  // Gallery
  const mainImg = document.getElementById('main-product-image');
  const stickyImg = document.getElementById('sticky-img');
  const fallbackImg = product.images?.edges[0]?.node?.url || 'assets/images/placeholder.jpg';
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
      if (!v || !v.price) return;
      const p = parseFloat(v.price.amount) || 0;
      if (priceEl) priceEl.textContent = `$${p.toFixed(2)}`;
      if (stickyPrice) stickyPrice.textContent = `$${p.toFixed(2)}`;
      if (splitEl) splitEl.textContent = `$${(p / 4).toFixed(2)}`;
      
      // Offer block
      const nowPriceEl = document.getElementById('offer-price-now');
      const wasPriceEl = document.getElementById('offer-price-was');
      if (nowPriceEl) nowPriceEl.textContent = `$${p.toFixed(2)}`;
      const prevPrice = copy?.wasPrice || (p > 0 ? p + 30 : 0);
      if (wasPriceEl) wasPriceEl.textContent = `$${parseFloat(prevPrice).toFixed(2)}`;
    };
    updatePrices(first);

    // Urgency
    const stockEl = document.getElementById('urgency-stock');
    const qty = (first.quantityAvailable !== null && first.quantityAvailable !== undefined)
      ? first.quantityAvailable
      : MOCK_PRODUCTS[product.handle]?.quantity ?? null;

    if (stockEl) {
      if (qty !== null && qty !== undefined) {
        stockEl.textContent = `⚡ ONLY ${qty} LEFT IN STOCK`;
        stockEl.style.display = 'block';
      } else {
        stockEl.style.display = 'none';
      }
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

  const boxList = document.getElementById('box-list');
  if (boxList && copy?.box) {
    boxList.innerHTML = copy.box.map(item => `
      <div style="display:flex; align-items:center; gap:12px; padding:12px; background:var(--bg-secondary); border-radius:4px; font-size:14px; border:1px solid var(--border);">
        <span style="color:var(--emerald);">✓</span>
        <span>${item}</span>
      </div>
    `).join('');
  } else if (boxList) {
    document.getElementById('box-section').style.display = 'none';
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
      <div class="objection-item" onclick="this.classList.toggle('active')">
        <div class="objection-q">
          ${o.q}
        </div>
        <div class="objection-a"><div class="objection-a-inner">${o.a}</div></div>
      </div>
    `).join('');
  }

  // FAQ
  const faqList = document.getElementById('pdp-faq');
  if (faqList && copy?.faq) {
    faqList.innerHTML = copy.faq.map(f => `
      <div class="faq-item" onclick="this.classList.toggle('active')">
        <div class="faq-question">
          ${f.q}
        </div>
        <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
      </div>
    `).join('');
  }

  if (copy?.bundleHandle) loadBundle(copy);

  // Phase 57: Customer Reviews & Lightbox
  if (copy?.detailedReviews) {
    renderDetailedReviews(copy.detailedReviews, product.handle);
  }

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

function renderDetailedReviews(data, handle) {
  const container = document.getElementById('reviews-customer');
  const grid = document.getElementById('reviews-customer-grid');
  if (!container || !grid) return;

  // Update Stats
  const titleEl = document.getElementById('reviews-customer-title');
  const avgEl = document.getElementById('reviews-avg-rating');
  const starsEl = document.getElementById('reviews-avg-stars');
  const countEl = document.getElementById('reviews-total-count');

  if (titleEl) titleEl.textContent = data.title;
  if (avgEl) avgEl.textContent = data.avg;
  if (starsEl) starsEl.textContent = '★'.repeat(Math.round(parseFloat(data.avg)));
  if (countEl) countEl.textContent = data.count;

  const folder = handle.includes('walking-pad') ? 'walking-pad' : 'resistance-bands';
  const prefix = handle.includes('walking-pad') ? 'walkingpad' : 'bands';

  grid.innerHTML = data.items.map((r, i) => {
    const group = `${prefix}-review-${(i+1).toString().padStart(2, '0')}`;
    const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    
    return `
      <div class="review-card-customer">
        <div class="review-card-header">
          <div class="reviewer-info">
            <h4>${r.name}</h4>
            <div class="verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Verified Purchase
            </div>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <div class="review-content">
          <h5>"${r.headline}"</h5>
          <p>"${r.body}"</p>
        </div>
        <div class="review-photos-container">
          ${r.photos.map(p => `
            <img src="/images/reviews/${folder}/${p}" 
                 class="review-photo-thumb" 
                 alt="Review Photo" 
                 loading="lazy"
                 data-lightbox="${group}"
                 data-src="/images/reviews/${folder}/${p}">
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.style.display = 'block';
  initLightbox();
}

/** 
 * LIGHTBOX IMPLEMENTATION
 * Provided by User Request Step 4308
 */
function initLightbox() {
  const lbxGroups = {};
  document.querySelectorAll('[data-lightbox]').forEach(thumb => {
    const group = thumb.dataset.lightbox;
    if (!lbxGroups[group]) lbxGroups[group] = [];
    lbxGroups[group].push(thumb.dataset.src || thumb.src);
  });

  let lbxCurrent = { group: null, index: 0 };
  const overlay = document.getElementById('lbx-overlay');
  const lbxImg = document.getElementById('lbx-img');
  if (!overlay || !lbxImg) return;

  function lbxOpen(group, index) {
    lbxCurrent = { group, index };
    lbxImg.src = lbxGroups[group][index];
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function lbxClose() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  function lbxNav(dir) {
    const arr = lbxGroups[lbxCurrent.group];
    lbxCurrent.index = (lbxCurrent.index + dir + arr.length) % arr.length;
    lbxImg.src = arr[lbxCurrent.index];
  }

  document.querySelectorAll('[data-lightbox]').forEach(thumb => {
    thumb.style.cursor = 'pointer';
    // Remove existing listeners if any
    const newThumb = thumb.cloneNode(true);
    thumb.parentNode.replaceChild(newThumb, thumb);
    
    newThumb.addEventListener('click', () => {
      const group = newThumb.dataset.lightbox;
      const src = newThumb.dataset.src || newThumb.src;
      const index = lbxGroups[group].indexOf(src);
      lbxOpen(group, index);
    });
  });

  document.getElementById('lbx-close').addEventListener('click', lbxClose);
  document.getElementById('lbx-prev').addEventListener('click', (e) => { e.stopPropagation(); lbxNav(-1); });
  document.getElementById('lbx-next').addEventListener('click', (e) => { e.stopPropagation(); lbxNav(1); });
  
  overlay.addEventListener('click', e => { 
    if (e.target === overlay) lbxClose(); 
  });
  
  document.addEventListener('keydown', e => {
    if (overlay.style.display === 'flex') {
      if (e.key === 'Escape') lbxClose();
      if (e.key === 'ArrowRight') lbxNav(1);
      if (e.key === 'ArrowLeft') lbxNav(-1);
    }
  });

  // Mobile swipe
  let touchStartX = 0;
  overlay.addEventListener('touchstart', e => { 
    touchStartX = e.touches[0].clientX; 
  }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lbxNav(diff > 0 ? 1 : -1);
  });
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
