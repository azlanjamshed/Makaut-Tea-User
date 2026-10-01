import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce fast-changing values (e.g. search input keystrokes).
 * Waits for `delay` ms of silence after the user stops typing before emitting the updated value.
 *
 * @param {any} value - The input value to debounce (e.g. search string)
 * @param {number} delay - Inactivity threshold in milliseconds (default: 400ms, within the 300-500ms range)
 * @param {boolean} immediateOnEmpty - When true, clearing the input to empty string bypasses the delay to immediately restore the feed
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 400, immediateOnEmpty = true) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // If the input was cleared to empty, reset immediately to restore full feed without waiting
    if (immediateOnEmpty && (value === '' || value === null || value === undefined)) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, immediateOnEmpty]);

  return debouncedValue;
}

export default useDebounce;
