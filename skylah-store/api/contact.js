const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS || 5);
const CONTACT_FORM_ENDPOINT =
  process.env.CONTACT_FORM_ENDPOINT || process.env.VITE_CONTACT_FORM_ENDPOINT;

const requestBuckets = new Map();

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }

  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  return null;
}

function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return 'unknown';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.VERCEL_URL) {
    configuredOrigins.push(`https://${process.env.VERCEL_URL}`);
  }

  return new Set(configuredOrigins);
}

function isAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin || typeof origin !== 'string') {
    return true;
  }

  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.size === 0 || allowedOrigins.has(origin);
}

function isRateLimited(ipAddress) {
  const now = Date.now();
  const record = requestBuckets.get(ipAddress);

  if (!record || record.expiresAt <= now) {
    requestBuckets.set(ipAddress, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

async function forwardToFormSubmit(payload) {
  if (!CONTACT_FORM_ENDPOINT) {
    throw new Error('Contact destination is not configured.');
  }

  const response = await fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      _subject: `Skylah Store Contact: ${payload.subject}`,
      _captcha: 'true',
      _template: 'table',
    }),
  });

  const text = await response.text();
  let parsed = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok || parsed?.success !== 'true') {
    throw new Error('Upstream contact delivery failed.');
  }
}

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!isAllowedOrigin(request)) {
    sendJson(response, 403, { error: 'Origin not allowed.' });
    return;
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    sendJson(response, 429, { error: 'Too many requests. Please try again later.' });
    return;
  }

  const body = readBody(request);
  if (!body) {
    sendJson(response, 400, { error: 'Invalid request body.' });
    return;
  }

  const payload = {
    name: cleanText(body.name, 120),
    email: cleanText(body.email, 160),
    subject: cleanText(body.subject, 200),
    message: cleanText(body.message, 4000),
    website: cleanText(body.website, 120),
  };

  if (payload.website) {
    sendJson(response, 200, { success: true });
    return;
  }

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    sendJson(response, 400, { error: 'Missing required fields.' });
    return;
  }

  if (!isValidEmail(payload.email)) {
    sendJson(response, 400, { error: 'Invalid email address.' });
    return;
  }

  try {
    await forwardToFormSubmit(payload);
    sendJson(response, 200, { success: true });
  } catch {
    sendJson(response, 502, { error: 'Unable to send message.' });
  }
}