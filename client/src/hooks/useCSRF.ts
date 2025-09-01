import { useEffect, useState, useCallback } from 'react';

export function useCSRF() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/csrf', { credentials: 'include' });
      if (!res.ok) throw new Error('CSRF init failed');
      const data = (await res.json()) as { csrfToken?: string };
      setToken(data.csrfToken || null);
    } catch (e: any) {
      setError(e?.message || 'CSRF error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { token, loading, error, refresh };
}

export default useCSRF;
