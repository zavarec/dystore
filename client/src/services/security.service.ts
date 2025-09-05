export async function initCsrf() {
  try {
    await fetch('/api/csrf', { credentials: 'include' });
  } catch (e) {
    console.warn('CSRF init failed', e);
  }
}
