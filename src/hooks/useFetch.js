import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const { method = 'GET', body = null, skip = false } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip && !!url);
  const [error, setError] = useState(null);

  const fetchData = async (customUrl = url, customBody = body) => {
    if (!customUrl) return;

    setLoading(true);
    setError(null);

    try {
      const fetchOptions = {
        method: customBody ? 'POST' : method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (customBody) {
        fetchOptions.body = JSON.stringify(customBody);
      }

      const response = await fetch(customUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`خطا در درخواست: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'خطای نامشخصی رخ داد';
      setError(errorMessage);
      console.error('Fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch effect
  useEffect(() => {
    if (!skip && url) {
      fetchData();
    }
  }, [url, skip]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
    fetch: fetchData, // For manual fetch calls with custom parameters
  };
}
