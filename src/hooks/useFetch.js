import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('fetch failed');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  async function postData(postBody) {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody),
      });
      if (!response.ok) throw new Error('post failed');
      const result = await response.json();
      setData(prev => (Array.isArray(prev) ? [...prev, result] : [result]));
      setError(null);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function putData(id, putBody) {
    setLoading(true);
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(putBody),
      });
      if (!response.ok) throw new Error('put failed');
      const result = await response.json();
      setData(prev => {
        if (!Array.isArray(prev)) return [result];
        return prev.map(item => (item.id === result.id ? result : item));
      });
      setError(null);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteData(id) {
    setLoading(true);
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('delete failed');
      setData(prev =>
        Array.isArray(prev) ? prev.filter(item => item.id !== id) : prev
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, postData, putData, deleteData };
}
