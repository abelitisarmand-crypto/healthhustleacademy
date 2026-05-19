export const config = { runtime: 'edge' };

const PIXEL_ID     = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

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

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'CAPI not configured — add META_PIXEL_ID and META_ACCESS_TOKEN to Vercel env vars' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { event_name, event_id, event_source_url, user_data = {}, custom_data = {} } = body;

  if (!event_name || !event_id) {
    return new Response(JSON.stringify({ error: 'Missing event_name or event_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           || req.headers.get('x-real-ip')
           || '';
  const ua = req.headers.get('user-agent') || '';

  const em = await sha256hex(user_data.email);
  const ph = await sha256hex(user_data.phone);

  const payload = {
    data: [
      {
        event_name,
        event_time:       Math.floor(Date.now() / 1000),
        event_id,
        event_source_url: event_source_url || 'https://www.healthhustleacademy.com',
        action_source:    'website',
        user_data: {
          client_ip_address: ip,
          client_user_agent: ua,
          ...(em              && { em:  [em] }),
          ...(ph              && { ph:  [ph] }),
          ...(user_data.fbp   && { fbp: user_data.fbp }),
          ...(user_data.fbc   && { fbc: user_data.fbc }),
        },
        custom_data,
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      }
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status:  res.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status:  500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
