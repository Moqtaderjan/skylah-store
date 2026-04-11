const FORM_SUBMIT_ENDPOINT =
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT || 'https://formsubmit.co/ajax/info@skylah.us';

const CONTACT_PROVIDER = (import.meta.env.VITE_CONTACT_PROVIDER || 'formsubmit').toLowerCase();
const BACKEND_CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_BACKEND_ENDPOINT || '/api/contact';

function assertResponseOk(response, payload) {
  if (response.ok && payload?.success === 'true') return;
  throw new Error('Unable to send message.');
}

async function sendViaFormSubmit(message) {
  const response = await fetch(FORM_SUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      _subject: `Skylah Store Contact: ${message.subject}`,
      _captcha: 'true',
      _template: 'table',
    }),
  });

  const payload = await response.json();
  assertResponseOk(response, payload);
}

async function sendViaBackend(message, userUid) {
  const response = await fetch(BACKEND_CONTACT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Security-Mode': 'frontend-stub',
    },
    body: JSON.stringify({
      ...message,
      userUid: userUid || null,
      source: 'web-contact-form',
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to send message.');
  }
}

export async function sendContactMessage(message, userUid) {
  if (CONTACT_PROVIDER === 'backend') {
    await sendViaBackend(message, userUid);
    return;
  }

  await sendViaFormSubmit(message);
}
