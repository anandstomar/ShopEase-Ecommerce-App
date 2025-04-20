import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export default function useSearch(items, options = {}) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => new Fuse(items, options), [items, options]);
  const results = useMemo(() => {
    if (!query) return items;
    return fuse.search(query).map(({ item }) => item);
  }, [items, query]); 
  return { query, setQuery, results };
}
