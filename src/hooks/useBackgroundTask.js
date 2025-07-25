import { useCallback } from 'react';

export default function useBackgroundTask() {
  const runInBackground = useCallback((task, options = { timeout: 1000 }) => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(task, options);
      return id;
    } else {
      // Fallback for browsers that don't support the API
      const id = setTimeout(task, 0);
      return id;
    }
  }, []);

  const cancelBackgroundTask = useCallback((id) => {
    if ('cancelIdleCallback' in window) {
      cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  }, []);

  return { runInBackground, cancelBackgroundTask };
}