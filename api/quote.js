'use strict';
// Configure RESEND_API_KEY and QUOTE_FROM (a verified sender) before launch.
// Never put credentials in front-end code. The recipient is fixed, not user supplied.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({accepted:false}); }
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return res.status(400).json({accepted:false});
  const fields = {name:120, organization:180, email:200, phone:40, needs:100, quantity:120, timeline:120, notes:4000};
  for (const [key,max] of Object.entries(fields)) if (b[key] != null && (typeof b[key] !== 'string' || b[key].length > max)) return res.status(400).json({accepted:false});
  if (!b.name?.trim() || !b.organization?.trim() || !b.needs?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '')) return res.status(400).json({accepted:false});
  let attachment;
  if (b.attachment) {
    const a = b.attachment;
    if (typeof a.filename !== 'string' || a.filename.length > 240 || /[\r\n/\\]/.test(a.filename) || !/\.(pdf|xlsx?|csv|docx?|txt|jpe?g|png)$/i.test(a.filename) || typeof a.content !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(a.content) || a.content.length > 2796204) return res.status(400).json({accepted:false});
    const size = Buffer.from(a.content, 'base64').length;
    if (!size || size > 2097152) return res.status(400).json({accepted:false});
    attachment = {filename:a.filename, content:a.content};
  }
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_FROM) return res.status(503).json({accepted:false, code:'NOT_CONFIGURED'});
  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method:'POST', headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json'}, signal:AbortSignal.timeout(15000),
      body:JSON.stringify({from:process.env.QUOTE_FROM,to:['quotes@schoolsolutions360.com'],reply_to:b.email,
        subject:'School Resource Partners: new quote request',
        text:Object.keys(fields).map(k => `${k}: ${b[k] || '(not provided)'}`).join('\n\n'),
        ...(attachment ? {attachments:[attachment]} : {})})
    });
    const result = await upstream.json();
    if (!upstream.ok || !result.id) return res.status(502).json({accepted:false,code:'DELIVERY_UNCONFIRMED'});
    return res.status(200).json({accepted:true});
  } catch { return res.status(502).json({accepted:false,code:'DELIVERY_UNCONFIRMED'}); }
};
