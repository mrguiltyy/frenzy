export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return new Response('Missing fields', { status: 400 });
    }

    const discordPayload = {
      embeds: [
        {
          title: 'New Contact Form Submission',
          color: 65535,
          fields: [
            { name: 'Name',    value: String(body.name).slice(0, 256)    },
            { name: 'Email',   value: String(body.email).slice(0, 256)   },
            { name: 'Message', value: String(body.message).slice(0, 1024) }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const webhookRes = await fetch(env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!webhookRes.ok) {
      return new Response('Webhook delivery failed', { status: 502 });
    }

    return new Response('OK', {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
};
