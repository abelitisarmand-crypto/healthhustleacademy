# HEALTHHUSTLEACADEMY.COM
## Brand & Design System — Финальная версия
### Версия 1.0 · Март 2026

---

# 1. ИДЕНТИЧНОСТЬ

**Название:** HealthHustleAcademy
**Домен:** healthhustleacademy.com
**Tagline:** "The gym you'll actually use."
**Тип:** Fitness DTC dropshipping store (Shopify Headless)
**Позиционирование:** Единственный фитнес-бренд который говорит напрямую
с людьми которые уже пробовали заниматься и бросили.
Не «стань атлетом» — а «мы знаем что ты уже пробовал. Вот почему сейчас будет иначе.»

**Целевая аудитория:**
- Возраст: 35–52 года
- Пол: 68% женщины, 32% мужчины
- Доход: $65K+ / год
- Ситуация: WFH, дети, нет времени на зал
- Психография: уже бросали тренировки 3+ раза
- Покупают: импульсно, вечером, с телефона, после Instagram/TikTok Reels

---

# 2. ЛОГОТИП

## Написание

```
HEALTH  HUSTLE  ACADEMY
──────  ──────  ───────
300wt   900wt   300wt (65% размера)
white   emerald white/gray
```

**Вариант A — Полный (хедер):**
```html
<div class="logo">
  <span style="font-weight:300; color:#F0F6FC; letter-spacing:0.12em">HEALTH</span>
  <span style="font-weight:900; color:#10B981; letter-spacing:0.04em">HUSTLE</span>
  <span style="display:block; font-weight:300; color:#8B949E;
               font-size:0.65em; letter-spacing:0.2em">ACADEMY</span>
</div>
```

**Вариант B — Сокращённый (мобайл шапка):**
HEALTH **HUSTLE** — без ACADEMY

**Вариант C — Монограмма (favicon, аватар соцсетей):**
HHA — изумрудный квадрат, буквы белые, Barlow Condensed 900

## Правила

- Шрифт: Barlow Condensed для всех трёх слов
- Минимальный размер: 80px по ширине
- Запрещено: менять цвета, добавлять тени, растягивать, менять веса
- На светлом фоне: HUSTLE меняется на #059669

---

# 3. ЦВЕТОВАЯ СИСТЕМА

## ⚠️ Важно
Акцент — изумрудный #10B981, НЕ неоновый.
#22FF7A и #22C55E — запрещены, режут глаза на мобильных экранах.

## Тёмная тема (основная)

```css
/* ── ФОНЫ ── */
--bg-primary:    #0D1117;   /* основной фон всех страниц */
--bg-secondary:  #161B22;   /* карточки, nav, панели */
--bg-tertiary:   #21262D;   /* hover состояния, alt строки */
--bg-overlay:    #0A0C10;   /* оверлеи, модальные окна */
--bg-deep-green: #052E16;   /* email capture секция — единственный цветной bg */

/* ── ИЗУМРУДНЫЙ АКЦЕНТ ── */
--emerald:        #10B981;  /* PRIMARY: CTA кнопки, иконки, акценты */
--emerald-hover:  #059669;  /* hover состояние */
--emerald-light:  #34D399;  /* лейблы, тонкие акценты */
--emerald-muted:  #064E3B;  /* фон для badges */
--emerald-glow:   rgba(16,185,129,0.15);  /* свечения, тени */

/* ── ТЕКСТ ── */
--text-primary:   #F0F6FC;  /* основной — тёплый белый */
--text-secondary: #C9D1D9;  /* body text, описания */
--text-muted:     #8B949E;  /* подписи, метки, muted */
--text-disabled:  #484F58;  /* неактивные элементы */

/* ── ГРАНИЦЫ ── */
--border:         #30363D;  /* стандартная граница, 0.5px */
--border-subtle:  #21262D;  /* очень тонкая, разделители */
--border-accent:  #10B981;  /* акцентная зелёная */

/* ── СЕМАНТИЧЕСКИЕ ── */
--color-price:    #F0F6FC;  /* цены — чистый белый */
--color-sale:     #F85149;  /* скидочные бейджи */
--color-stars:    #F0B429;  /* звёзды рейтинга */
--color-warning:  #F59E0B;  /* предупреждения */
--color-error:    #EF4444;  /* ошибки */
```

## Шпаргалка по применению

| Элемент | Цвет |
|---------|------|
| Кнопка PRIMARY фон | `#10B981` |
| Кнопка PRIMARY текст | `#000000` |
| Кнопка hover | `#059669` |
| Announcement bar | `#10B981` фон, `#000` текст |
| Hero line 1–2 | `#F0F6FC` / `#8B949E` (мuted) |
| Hero line 3 (payoff) | `#10B981` |
| Номера секций 01/02/03 | `#10B981`, opacity 0.4 |
| Цена текущая | `#F0F6FC` жирная |
| Цена зачёркнутая | `#484F58` |
| Бейдж SAVE / BEST SELLER | `#10B981` фон, `#000` текст |
| Звёзды отзывов | `#F0B429` |
| Результат-бейдж | `#10B981` border + text |
| Левый accent bar | `#10B981`, 4px |
| Ссылки ghost | `#10B981` |
| Иконки trust strip | `#10B981`, 28px |
| FAQ + / − | `#10B981` |
| SVG connector line (steps) | `#10B981` |
| Scroll progress bar | `#10B981`, 2px |
| Active tab | `#10B981` фон, `#000` текст |
| Inactive tab border | `#30363D` |
| Footer top border | `rgba(16,185,129,0.3)` |

## Запрещённые цвета

```
✗ #22FF7A  — слишком яркий неон
✗ #00FF87  — слишком яркий неон
✗ #22C55E  — прежняя версия, заменена
✗ белые фоны на карточках — только #161B22
✗ светлые фоны на секциях — только тёмные
```

---

# 4. ТИПОГРАФИКА

## Шрифты

```
Anton             — Google Fonts, один вес (ultra-black by design)
                    ТОЛЬКО Hero заголовки страниц и гигантские цифры
                    Примеры: "START TODAY." / "TRIED THE GYM." / "4.9"

Barlow Condensed  — Google Fonts, weights: 300 / 400 / 700 / 900
                    Секционные заголовки, навигация, кнопки, логотип
                    300 и 900 вместе = иерархия без смены шрифта

Inter             — Google Fonts, weights: 400 / 500 / 600
                    Всё остальное: body text, цены, описания, FAQ, отзывы
```

## Размерная шкала

```css
/* Hero */
--size-hero:    clamp(52px, 9vw, 120px);    /* Anton — главные заголовки */
--size-display: clamp(36px, 5vw, 72px);     /* Anton — числа, акценты */

/* Заголовки */
--size-h1:      clamp(28px, 3.5vw, 48px);   /* Barlow Condensed 900 */
--size-h2:      clamp(22px, 2.5vw, 36px);   /* Barlow Condensed 700 */
--size-h3:      clamp(18px, 2vw, 24px);     /* Barlow Condensed 700 */

/* Текст */
--size-body-lg: 18px;   /* Inter 400 — вводные тексты */
--size-body:    16px;   /* Inter 400 — основной */
--size-small:   13px;   /* Inter 400 */
--size-micro:   11px;   /* Inter 500, caps */

/* UI */
--size-nav:     12px;   /* Barlow Condensed 500, ALL CAPS, ls 0.1em */
--size-label:   9px;    /* Inter 700, caps, ls 0.2em */
--size-badge:   10px;   /* Inter 600, caps */
--size-btn:     15px;   /* Barlow Condensed 700, caps, ls 0.08em */
```

## Обязательные правила

```
✓ font-style: normal — на Anton и Barlow Condensed ВСЕГДА
✓ -webkit-font-smoothing: antialiased — глобально на body
✓ text-rendering: optimizeLegibility — на всех заголовках
✓ letter-spacing: hero 0.01em / nav 0.1em / labels 0.2em

✗ Bebas Neue — буквы сливаются на тёмном фоне, запрещён
✗ italic на display шрифтах выше 20px
✗ центрировать body text — только заголовки по центру
✗ font-weight 600–800 в Inter
```

---

# 5. КНОПКИ

```css
/* ── PRIMARY ── */
.btn-primary {
  background:     #10B981;
  color:          #000000;
  font-family:    'Barlow Condensed', sans-serif;
  font-weight:    700;
  font-size:      15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding:        14px 32px;
  border-radius:  2px;      /* почти острые — Nike стиль */
  border:         none;
  cursor:         pointer;
  transition:     background 0.2s ease, transform 0.15s ease;
}
.btn-primary::after { content: " →"; }
.btn-primary:hover  { background: #059669; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

/* Large вариант (Hero, финальный CTA) */
.btn-primary.large { padding: 18px 48px; font-size: 17px; min-height: 60px; }

/* ── SECONDARY (outline) ── */
.btn-secondary {
  background:    transparent;
  color:         #F0F6FC;
  border:        1.5px solid #F0F6FC;
  border-radius: 2px;
  padding:       13px 32px;
  font-family:   'Barlow Condensed', sans-serif;
  font-weight:   700;
  font-size:     15px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  cursor:        pointer;
  transition:    background 0.2s, color 0.2s;
}
.btn-secondary:hover { background: #F0F6FC; color: #0D1117; }

/* ── GHOST (текстовая) ── */
.btn-ghost {
  background:    transparent;
  color:         #10B981;
  border:        none;
  font-family:   'Barlow Condensed', sans-serif;
  font-weight:   500;
  font-size:     14px;
  cursor:        pointer;
  padding:       8px 0;
}
.btn-ghost:hover { opacity: 0.8; text-decoration: underline; }

/* Мобайл */
@media (max-width: 768px) {
  .btn-primary, .btn-secondary { width: 100%; text-align: center; }
}
```

---

# 6. КОМПОНЕНТЫ

## Announcement Bar
```css
.announcement-bar {
  background: #10B981; color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 600; letter-spacing: 0.05em;
  height: 44px; display: flex; align-items: center; justify-content: center;
}
.announcement-bar .arrow { animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
/* Mobile: text marquee scroll */
```

## Navigation
```css
.nav {
  background: rgba(13,17,23,0.95); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(48,54,61,0.8);
  position: sticky; top: 0; z-index: 100; height: 64px;
}
.nav.scrolled { border-bottom: 1px solid rgba(16,185,129,0.3); }
.nav-link {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px; font-weight: 500;
  color: rgba(240,246,252,0.75); letter-spacing: 0.1em;
  text-transform: uppercase; transition: color 0.2s;
}
.nav-link:hover, .nav-link.active { color: #10B981; }
```

## Карточки товаров
```css
.product-card {
  background: #161B22; border: 0.5px solid #30363D;
  border-radius: 4px; overflow: hidden; position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.product-card:hover { transform: translateY(-4px); border-color: #10B981; }
.product-card .card-img { aspect-ratio: 4/3; object-fit: cover; width: 100%; }

/* ATC кнопка выезжает снизу при hover */
.card-atc {
  position: absolute; bottom: 0; left: 0; width: 100%;
  transform: translateY(100%); transition: transform 0.25s ease;
}
.product-card:hover .card-atc { transform: translateY(0); }
```

## Карточки отзывов
```css
.review-card {
  background: #161B22; border: 0.5px solid #30363D;
  border-radius: 4px; padding: 24px;
}
.review-quote {
  font-family: 'Inter', sans-serif; font-size: 15px;
  color: #C9D1D9; font-style: italic; line-height: 1.7;
  border-left: 3px solid #10B981; padding-left: 16px;
}
.review-result {
  display: inline-block; margin-top: 12px;
  background: rgba(16,185,129,0.1); border: 1px solid #10B981;
  color: #10B981; font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 2px;
}
```

## Badges / Labels
```css
.label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #10B981; margin-bottom: 8px;
}
.badge-solid   { background: #10B981; color: #000;
                 font-size: 10px; font-weight: 600; padding: 3px 10px;
                 border-radius: 2px; letter-spacing: 0.08em; text-transform: uppercase; }
.badge-outline { background: rgba(16,185,129,0.1); color: #10B981;
                 border: 1px solid rgba(16,185,129,0.4);
                 font-size: 10px; padding: 3px 10px; border-radius: 2px; }
.badge-sale    { background: rgba(248,81,73,0.12); color: #F85149;
                 border: 1px solid rgba(248,81,73,0.4); }
```

## Accordion (FAQ)
```css
.accordion-item { border-bottom: 1px solid #21262D; }
.accordion-question {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px; font-weight: 700; color: #F0F6FC;
}
.accordion-question .toggle { color: #10B981; font-size: 20px; }
.accordion-answer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  font-family: 'Inter', sans-serif; font-size: 15px;
  color: #8B949E; line-height: 1.7;
  border-left: 2px solid #10B981; padding-left: 16px; margin-left: 16px;
}
.accordion-answer.open { max-height: 300px; padding-bottom: 20px; }
```

## Trust Strip
```css
.trust-strip {
  background: #161B22;
  border-top: 1px solid #21262D; border-bottom: 1px solid #21262D;
  display: grid; grid-template-columns: repeat(4, 1fr);
  padding: 20px 0;
}
.trust-item { text-align: center; padding: 0 16px; }
.trust-icon { color: #10B981; width: 28px; height: 28px; margin: 0 auto 8px; }
.trust-label { font-family: 'Barlow Condensed', sans-serif;
               font-weight: 700; font-size: 14px; color: #F0F6FC;
               text-transform: uppercase; letter-spacing: 0.05em; }
.trust-sub   { font-family: 'Inter', sans-serif; font-size: 12px; color: #8B949E; }

@media (max-width: 768px) {
  .trust-strip { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
```

---

# 7. АНИМАЦИИ

```css
/* ── SECTION ENTRANCE (scroll-triggered) ── */
.animate-in {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-in.visible { opacity: 1; transform: translateY(0); }

/* Stagger delays */
.stagger-1 { transition-delay: 0ms;   }
.stagger-2 { transition-delay: 80ms;  }
.stagger-3 { transition-delay: 160ms; }
.stagger-4 { transition-delay: 240ms; }

/* ── KINETIC TEXT HERO ── */
.kinetic-word {
  display: inline-block; opacity: 0;
  transform: translateY(40px); filter: blur(8px);
  animation: word-in 0.5s ease forwards;
}
@keyframes word-in { to { opacity: 1; transform: translateY(0); filter: blur(0); } }
/* JS: el.style.animationDelay = (index * 100) + 'ms' */

/* ── SCROLL PROGRESS ── */
.scroll-progress {
  position: fixed; top: 0; left: 0; height: 2px;
  width: 0%; background: #10B981; z-index: 9999;
  transition: width 0.1s linear;
}

/* ── IMAGE REVEAL (clip-path wipe) ── */
.img-reveal { clip-path: inset(0 100% 0 0); transition: clip-path 0.8s ease-out; }
.img-reveal.visible { clip-path: inset(0 0% 0 0); }

/* ── SVG LINE DRAW (steps connector) ── */
.connector-line { stroke-dasharray: 1000; stroke-dashoffset: 1000;
                  transition: stroke-dashoffset 1.2s ease; }
.connector-line.visible { stroke-dashoffset: 0; }

/* ── CARD HOVER LIFT ── */
.hover-lift { transition: transform 0.25s ease; }
.hover-lift:hover { transform: translateY(-6px); }

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:  0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```javascript
// ── INTERSECTION OBSERVER ──
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.animate-in, .img-reveal, .connector-line')
  .forEach(el => io.observe(el));

// ── SCROLL PROGRESS ──
window.addEventListener('scroll', () => {
  const pct = (window.scrollY /
    (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.querySelector('.scroll-progress').style.width = pct + '%';
});

// ── COUNTER ANIMATION ──
// <span class="counter" data-target="2000"></span>
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const start  = performance.now();
  const tick   = t => {
    const p = Math.min((t - start) / 1500, 1);
    el.textContent = Math.floor(p * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
```

---

# 8. СЕТКА И SPACING

```css
.container {
  max-width: 1200px;
  margin:    0 auto;
  padding:   0 clamp(20px, 4vw, 80px);
}

/* Spacing scale */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-6: 24px;  --space-8: 32px;
--space-12:48px;  --space-16:64px;  --space-24:96px;

/* Секции */
.section { padding: clamp(64px, 8vw, 120px) 0; }

/* Мобайл */
@media (max-width: 768px) {
  .container { padding: 0 24px; }
  .section   { padding: 64px 0; }
  body       { font-size: 15px; }           /* минимум на мобайл */
  button, a  { min-height: 44px; }          /* tap target */
}
```

---

# 9. ИЗОБРАЖЕНИЯ

```
Стиль:         тёмные, контрастные, реальные люди — не студийные модели
Возраст людей: 35–52, diverse, authentic
Обстановка:    квартира, гостиная, домашний офис — не зал
Обработка:     чёрно-белые или тёмно-тонированные, контраст выше нормы
Overlay:       изумрудный оверлей 10–15% на hero фото (#10B981)
Плейсхолдер:   linear-gradient(135deg, #0D1117, #052E16, #0D1117)

Форматы:
  Hero bg desktop: 1440×900px, WebP, max 400KB
  Hero bg mobile:  390×700px,  WebP, max 200KB
  Kit flat lay:    800×600px,  WebP
  Портреты:        400×400px,  WebP, круглый кроп
  Goal categories: 400×533px,  WebP
  PDP gallery:     800×800px,  WebP (6 штук на товар)
```

---

# 10. ФОТОГРАФИИ ДЛЯ САЙТА (22 изображения)

| # | Название | Секция | Размер |
|---|---------|--------|--------|
| 01 | Hero bg desktop | Hero | 1440×900 |
| 02 | Hero bg mobile | Hero | 390×700 |
| 03 | Starter Kit flat lay | Offer | 800×600 |
| 04 | Starter Kit lifestyle | Offer | 800×600 |
| 05 | PDF program preview | Offer | 800×600 |
| 06 | Maria K. portrait | Reviews | 400×400 |
| 07 | James L. portrait | Reviews | 400×400 |
| 08 | Sandra P. portrait | Reviews | 400×400 |
| 09 | Lose Weight | Goal catalog | 400×533 |
| 10 | Build Strength | Goal catalog | 400×533 |
| 11 | Move More | Goal catalog | 400×533 |
| 12 | Recover Faster | Goal catalog | 400×533 |
| 13–18 | PDP Gallery ×6 | Product page | 800×800 |
| 19 | Walking Pad lifestyle | PDP | 800×800 |
| 20 | Massage Gun lifestyle | PDP | 800×800 |
| 21 | Foam Roller lifestyle | PDP | 800×800 |
| 22 | Ankle Weights lifestyle | PDP | 800×800 |

**Midjourney ключевые слова:**
```
resistance band workout home dark moody --ar 16:9 --style raw --v 6.1
home gym apartment fitness real person --ar 1:1 --style raw
fitness lifestyle dark cinematic --ar 3:4 --style raw
```

**Unsplash поиск (бесплатно):**
```
resistance band workout dark
home gym apartment fitness
fitness portrait authentic
walking pad office workout
```

---

# 11. ТЕКСТЫ САЙТА (locked copy)

## Hero
```
Line 1: "TRIED THE GYM."          ← белый
Line 2: "QUIT TWICE."             ← #8B949E (muted)
Line 3: "FINALLY FIGURED IT OUT AT HOME."  ← #10B981
Sub:    "20-minute home workouts. Fits in a backpack. Actually works."
CTA 1:  "BUILD MY HOME GYM KIT →"
CTA 2:  "See real results ↓"
Trust:  "Free shipping · 30-day returns · ⭐ 4.9 · 2,000+ customers"
```

## Продукт
```
Название:    "The 20-Minute Home Gym Starter Kit"
Цена:        $79 (было $109)
Описание:    "Everything you need to rebuild your body from the comfort
              of your living room. No commute. No crowds. No excuses."
Состав:
  ✓ 5x Pro-Grip Resistance Bands (10–50 lbs)
  ✓ Anodized Aluminum Door Anchor
  ✓ Free 33-Day Training App Access
  ✓ 30-Day Workout Program PDF — FREE
```

## Финальный CTA
```
Headline:  "START TODAY."
Sub:       "Or reschedule it to next Monday like last time."
Button:    "GET MY STARTER KIT →"
Trust row: "✓ Free shipping · ✓ 60-day guarantee · ✓ Program included"
```

---

# 12. БЫСТРАЯ ШПАРГАЛКА ЦВЕТОВ

```
#0D1117  ← фон страниц
#161B22  ← фон карточек / nav
#21262D  ← hover / alt строки
#0A0C10  ← оверлеи, самый тёмный фон
#052E16  ← email секция фон

#10B981  ← ГЛАВНЫЙ АКЦЕНТ — изумруд ★
#059669  ← hover акцента
#34D399  ← светлый акцент / лейблы
#064E3B  ← muted зелёный фон

#F0F6FC  ← основной текст
#C9D1D9  ← body text
#8B949E  ← muted text
#484F58  ← disabled
#30363D  ← border

#F0B429  ← gold — звёзды
#F59E0B  ← amber — предупреждения
#EF4444  ← red — ошибки / скидки
#F85149  ← sale badge
```

---

*firstil.md — HealthHustleAcademy Brand & Design System*
*Версия 1.0 · Март 2026*
*Подготовлен: Prodigy LAB · prodigylab.studio*
