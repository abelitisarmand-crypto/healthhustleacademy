export const config = { runtime: 'edge' };

const ACCESS_TOKEN    = process.env.META_ACCESS_TOKEN;
const PIXEL_ID        = process.env.META_PIXEL_ID;
const WEBHOOK_SECRET  = process.env.SHOPIFY_WEBHOOK_SECRET;

async function sha256hex(str) {
  if (!str) return null;
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str.toLowerCase().trim())
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifySignature(req, rawBody) {
  if (!WEBHOOK_SECRET) return true; // skip if not configured
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  if (!hmac) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return computed === hmac;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const rawBody = await req.text();

  const valid = await verifySignature(req, rawBody);
  if (!valid) {
    console.log('[WEBHOOK] Invalid signature');
    return new Response('Unauthorized', { status: 401 });
  }

  let order;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  console.log('[WEBHOOK] Order received:', order.order_number, '| total:', order.total_price);

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log('[WEBHOOK] CAPI not configured');
    return new Response('OK', { status: 200 });
  }

  const em = await sha256hex(order.email);
  const ph = await sha256hex(order.phone);

  const contentIds = (order.line_items || []).map(li => String(li.product_id));
  const value      = parseFloat(order.total_price || 0);
  const currency   = order.currency || 'USD';
  const eventId    = `order_${order.id}`;

  const payload = {
    data: [
      {
        event_name:       'Purchase',
        event_time:       Math.floor(new Date(order.created_at || Date.now()).getTime() / 1000),
        event_id:         eventId,
        event_source_url: 'https://www.healthhustleacademy.com/',
        action_source:    'website',
        user_data: {
          ...(em && { em: [em] }),
          ...(ph && { ph: [ph] }),
        },
        custom_data: {
          value,
          currency,
          content_ids:  contentIds,
          content_type: 'product',
          order_id:     String(order.order_number),
        },
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  console.log('[WEBHOOK] Sending to CAPI:', JSON.stringify({ ...payload, access_token: '[REDACTED]' }));

  try {
    const res  = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('[WEBHOOK] CAPI response:', JSON.stringify(data));
  } catch (err) {
    console.log('[WEBHOOK] CAPI error:', err.message);
  }

  return new Response('OK', { status: 200 });
}
