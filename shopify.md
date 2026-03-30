# shopify.md
# HealthHustleAcademy — Shopify Integration Context
# Этот файл кладётся в корень проекта в Antigravity
# Antigravity читает его как единый источник правды для всей коммерческой логики

---

# ═══════════════════════════════════════════
# БЛОК 1 — STOREFRONT API ТОКЕН
# ═══════════════════════════════════════════

## Как получить Storefront API токен:

# 1. Зайди в Shopify Admin: https://admin.shopify.com
# 2. Слева: Settings → Apps and sales channels
# 3. Вверху справа: "Develop apps" → "Create an app"
# 4. Название: "HeadlessFrontend" (любое)
# 5. Вкладка "API credentials" → "Storefront API access token"
# 6. Нажми "Generate token"
# 7. Скопируй токен — он показывается ОДИН РАЗ
#
# ⚠️ ВАЖНО: Это НЕ Admin API key — это Storefront API
# Admin API — только для бэкенда, никогда не светить на фронте
# Storefront API — безопасен для публичного фронтенда

SHOPIFY_STOREFRONT_TOKEN=ВСТАВИТЬ_СЮДА
# Пример: shpat_a1b2c3d4e5f6g7h8i9j0...

SHOPIFY_STORE_DOMAIN=healthhustleacademy.myshopify.com
# Это домен магазина в формате: название.myshopify.com
# Найти: Settings → Domains → внизу "myshopify.com domain"

SHOPIFY_STOREFRONT_API_URL=https://healthhustleacademy.myshopify.com/api/2024-01/graphql.json
# Формат: https://[ДОМЕН]/api/[ВЕРСИЯ]/graphql.json
# Актуальная версия API: 2024-01 (или проверь в Shopify Partners)

---

# ═══════════════════════════════════════════
# БЛОК 2 — ПОДКЛЮЧЕНИЕ HEADLESS КАНАЛА
# ═══════════════════════════════════════════

## Как включить Headless канал продаж:

# 1. Shopify Admin → Settings → Apps and sales channels
# 2. "Headless" канал должен быть активирован
#    Если нет: Add sales channel → Headless
# 3. Каждый товар должен быть опубликован в этом канале:
#    Products → выбрать товар → Sales channels → поставить галочку "Headless"
#
# ⚠️ ОШИБКА: Если товар не опубликован в Headless канале —
#    Storefront API вернёт пустой результат, товар не появится на сайте
#
# ⚠️ ОШИБКА: Если Inventory = 0 и "Track quantity" включён —
#    API не отдаст товар. Поставь Inventory = 99 для теста

HEADLESS_CHANNEL_STATUS=активировать_до_запуска

---

# ═══════════════════════════════════════════
# БЛОК 3 — ТОВАРЫ И КОЛЛЕКЦИИ
# ═══════════════════════════════════════════

## Как найти Product ID и Collection Handle:

# Product ID:
# 1. Shopify Admin → Products → выбрать товар
# 2. Смотри URL: admin.shopify.com/products/[ЧИСЛО]
#    Это и есть ID. Для Storefront API формат: gid://shopify/Product/[ЧИСЛО]
#
# Collection Handle:
# 1. Products → Collections → выбрать коллекцию
# 2. Смотри поле "Search engine listing" → URL handle
#    Или в URL: /collections/[handle]
#
# Variant ID (для кнопки Add to Cart):
# 1. Products → выбрать товар → Variants
# 2. URL варианта: /variants/[ЧИСЛО]
#    Формат для API: gid://shopify/ProductVariant/[ЧИСЛО]

## ТОВАРЫ (заполнить после создания в Shopify):

PRODUCT_1_HANDLE=resistance-band-starter-kit
PRODUCT_1_TITLE=The 20-Minute Home Gym Starter Kit
PRODUCT_1_PRICE=79
PRODUCT_1_COMPARE_PRICE=109
PRODUCT_1_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ
# gid://shopify/Product/XXXXXXXXXX

PRODUCT_1_VARIANT_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ
# gid://shopify/ProductVariant/XXXXXXXXXX
# Этот ID вставляется в кнопку Add to Cart

PRODUCT_2_HANDLE=stackable-resistance-bands
PRODUCT_2_TITLE=Stackable Band System
PRODUCT_2_PRICE=89
PRODUCT_2_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ

PRODUCT_3_HANDLE=under-desk-walking-pad
PRODUCT_3_TITLE=Under-Desk Walking Pad
PRODUCT_3_PRICE=299
PRODUCT_3_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ

PRODUCT_4_HANDLE=percussion-massage-gun
PRODUCT_4_TITLE=Percussion Massage Gun
PRODUCT_4_PRICE=79
PRODUCT_4_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ

PRODUCT_5_HANDLE=foam-roller-pro
PRODUCT_5_TITLE=Foam Roller Pro
PRODUCT_5_PRICE=35
PRODUCT_5_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ

PRODUCT_6_HANDLE=ankle-weights-set
PRODUCT_6_TITLE=Ankle Weights Set
PRODUCT_6_PRICE=32
PRODUCT_6_ID=ВСТАВИТЬ_ПОСЛЕ_СОЗДАНИЯ

## КОЛЛЕКЦИИ:

COLLECTION_ALL_HANDLE=all
COLLECTION_LOSE_WEIGHT_HANDLE=lose-weight
COLLECTION_BUILD_STRENGTH_HANDLE=build-strength
COLLECTION_MOVE_MORE_HANDLE=move-more
COLLECTION_RECOVER_HANDLE=recover-faster
COLLECTION_BEST_SELLERS_HANDLE=best-sellers

---

# ═══════════════════════════════════════════
# БЛОК 4 — ГОТОВЫЕ GRAPHQL ЗАПРОСЫ
# ═══════════════════════════════════════════
# Antigravity использует эти запросы для получения данных из Shopify
# Копируй их напрямую в код — не переписывай

## Получить один товар по handle:

QUERY_GET_PRODUCT="""
query GetProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 6) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
          }
          availableForSale
        }
      }
    }
  }
}
"""

## Получить коллекцию товаров:

QUERY_GET_COLLECTION="""
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
        }
      }
    }
  }
}
"""

## Создать корзину (Cart):

MUTATION_CREATE_CART="""
mutation CreateCart($lines: [CartLineInput!]!) {
  cartCreate(input: { lines: $lines }) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                }
                price {
                  amount
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
"""

## Добавить товар в корзину:

MUTATION_ADD_TO_CART="""
mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
  }
}
"""

---

# ═══════════════════════════════════════════
# БЛОК 5 — КОД КНОПКИ "ADD TO CART"
# ═══════════════════════════════════════════
# Вставить в компонент кнопки в Antigravity
# variantId берётся из PRODUCT_X_VARIANT_ID выше

ADD_TO_CART_JS="""
async function addToCart(variantId) {
  const storeDomain = 'healthhustleacademy.myshopify.com';
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  
  // Шаг 1: Создаём корзину если нет
  let cartId = localStorage.getItem('shopify_cart_id');
  
  if (!cartId) {
    const createResponse = await fetch(
      `https://${storeDomain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token
        },
        body: JSON.stringify({
          query: `mutation {
            cartCreate(input: {
              lines: [{ merchandiseId: "${variantId}", quantity: 1 }]
            }) {
              cart { id checkoutUrl totalQuantity }
            }
          }`
        })
      }
    );
    const createData = await createResponse.json();
    cartId = createData.data.cartCreate.cart.id;
    localStorage.setItem('shopify_cart_id', cartId);
    
    // Редирект на Shopify Checkout
    window.location.href = createData.data.cartCreate.cart.checkoutUrl;
    
  } else {
    // Шаг 2: Добавляем в существующую корзину
    const addResponse = await fetch(
      `https://${storeDomain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token
        },
        body: JSON.stringify({
          query: `mutation {
            cartLinesAdd(
              cartId: "${cartId}",
              lines: [{ merchandiseId: "${variantId}", quantity: 1 }]
            ) {
              cart { id checkoutUrl totalQuantity }
            }
          }`
        })
      }
    );
    const addData = await addResponse.json();
    // Обновить счётчик корзины в шапке
    updateCartCount(addData.data.cartLinesAdd.cart.totalQuantity);
  }
}

// Обновить счётчик в навигации
function updateCartCount(count) {
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = count;
}
"""

---

# ═══════════════════════════════════════════
# БЛОК 6 — МЕТАФИЛДЫ ТОВАРОВ
# ═══════════════════════════════════════════

## Как создать метафилды в Shopify:
# Settings → Custom data → Products → Add definition
#
# Эти поля используются для кастомного контента карточек

METAFIELD_RESULT_TAG=custom.result_tag
# Пример значения: "−18 lbs · 5 months"
# Отображается как зелёный бейдж на карточке отзыва

METAFIELD_KIT_BADGE=custom.kit_badge
# Пример: "BEST SELLER" / "NEW" / "BUNDLE DEAL"
# Отображается на карточке товара

METAFIELD_PROGRAM_DAYS=custom.program_days
# Пример: "30"
# "30-Day Program Included"

METAFIELD_SHORT_DESC=custom.short_description
# Короткое описание для карточки товара в каталоге (1-2 предложения)

---

# ═══════════════════════════════════════════
# БЛОК 7 — VERCEL ДЕПЛОЙ
# ═══════════════════════════════════════════

## Как задеплоить через Vercel:

# 1. Antigravity → коммит кода в GitHub репозиторий
# 2. Зайти на vercel.com → New Project → Import from GitHub
# 3. Выбрать репозиторий
# 4. В настройках проекта → Environment Variables добавить:
#    SHOPIFY_STOREFRONT_TOKEN = [токен из блока 1]
#    SHOPIFY_STORE_DOMAIN = healthhustleacademy.myshopify.com
# 5. Deploy → Vercel даёт временный URL вида: project.vercel.app
# 6. После проверки → добавить кастомный домен: healthhustleacademy.com
#
# ⚠️ НИКОГДА не хранить токены в коде напрямую
# Только через Environment Variables в Vercel
# В коде всегда: process.env.SHOPIFY_STOREFRONT_TOKEN

VERCEL_PROJECT_NAME=healthhustleacademy
VERCEL_DOMAIN=healthhustleacademy.com
GITHUB_REPO=СОЗДАТЬ_И_ВСТАВИТЬ_ССЫЛКУ

---

# ═══════════════════════════════════════════
# БЛОК 8 — ИНСТРУКЦИЯ ДЛЯ ANTIGRAVITY
# ═══════════════════════════════════════════
# Это промпт для агента Antigravity при старте проекта

ANTIGRAVITY_SYSTEM_PROMPT="""
You are a senior frontend developer building a headless Shopify storefront.

Context files in this project:
- shopify.md  → API tokens, product IDs, GraphQL queries (THIS FILE)
- stitch_final.md → All page content, exact copy, section structure
- firstil.md  → Brand colors, fonts, design system

Your task:
1. Take the HTML/CSS design exported from Google Stitch
2. Replace all static text with content from stitch_final.md (word for word)
3. Replace all static product data with live Shopify Storefront API calls
   using the GraphQL queries in shopify.md
4. Implement Add to Cart using the addToCart() function in shopify.md
5. Apply brand colors from firstil.md — PRIMARY ACCENT: #10B981 (emerald)
6. Ensure mobile-first responsive design
7. Push to GitHub when complete

NEVER:
- Invent product names or copy
- Use Admin API (only Storefront API)
- Hardcode tokens in source files (use env variables)
- Process payments yourself (always redirect to Shopify checkout)

ALWAYS:
- Use exact text from stitch_final.md
- Accent color: #10B981 (NOT #22FF7A)
- Test Add to Cart before committing
"""

---

# ═══════════════════════════════════════════
# БЛОК 9 — ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ
# ═══════════════════════════════════════════

LAUNCH_CHECKLIST="""
[ ] Shopify Admin: все 6 товаров созданы и опубликованы
[ ] Shopify Admin: Headless канал продаж включён для каждого товара
[ ] Shopify Admin: Inventory > 0 для каждого товара (или "Don't track quantity")
[ ] Shopify Admin: Storefront API токен сгенерирован и скопирован
[ ] Antigravity: токен добавлен в .env файл
[ ] Antigravity: все Product IDs заполнены в этом файле (блок 3)
[ ] Antigravity: Add to Cart протестирована (реальный заказ)
[ ] Antigravity: редирект на Shopify Checkout работает
[ ] Vercel: Environment Variables добавлены (не в коде!)
[ ] Vercel: кастомный домен подключён
[ ] Vercel: SSL сертификат активен (автоматически)
[ ] Meta Pixel: проверить Events Manager → Test Events
[ ] GA4: проверить Real-time отчёт
[ ] Мобайл: проверить на iPhone (Safari) и Android (Chrome)
[ ] Корзина: счётчик в шапке обновляется после Add to Cart
[ ] Цены: отображаются динамически из Shopify (не хардкод)
"""

---

# ═══════════════════════════════════════════
# БЛОК 10 — ФАЙЛОВАЯ СТРУКТУРА ПРОЕКТА
# ═══════════════════════════════════════════

PROJECT_STRUCTURE="""
healthhustleacademy/
│
├── .env                    ← токены (НЕ коммитить в GitHub!)
├── .gitignore              ← добавить .env в список
│
├── shopify.md              ← ЭТОТ ФАЙЛ (контекст для Antigravity)
├── stitch_final.md         ← все тексты сайта
├── firstil.md              ← брендбук и дизайн-система
│
├── index.html              ← Homepage (из Stitch)
├── product.html            ← PDP страница (из Stitch)
├── collection.html         ← Страница коллекции
│
├── assets/
│   ├── css/
│   │   └── style.css       ← стили из Stitch + правки цвета
│   ├── js/
│   │   ├── shopify.js      ← Add to Cart, Cart API
│   │   ├── animations.js   ← Scroll animations, kinetic text
│   │   └── main.js         ← Инициализация
│   └── images/             ← Все фото и иконки
│
└── vercel.json             ← Конфигурация деплоя
"""

---

# ═══════════════════════════════════════════
# БЛОК 11 — vercel.json
# ═══════════════════════════════════════════
# Создать этот файл в корне проекта

VERCEL_CONFIG="""
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/products/(.*)",
      "dest": "/product.html"
    },
    {
      "src": "/collections/(.*)",
      "dest": "/collection.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "SHOPIFY_STOREFRONT_TOKEN": "@shopify-storefront-token",
    "SHOPIFY_STORE_DOMAIN": "@shopify-store-domain"
  }
}
"""

---

*Файл: shopify.md*
*Проект: HealthHustleAcademy Headless*
*Последнее обновление: Март 2026*
*Prodigy LAB · prodigylab.studio*