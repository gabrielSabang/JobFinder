import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${API_URLS.USERS}?q=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );
        setResults(data.users || []);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-ink font-playfair">Search Results for "{query}"</h1>
      {loading && <p className="text-ink">Loading...</p>}
      {error && <p className="text-accent">{error}</p>}
      {!loading && !error && results.length === 0 && query && (
        <p className="text-warm-gray">No users found.</p>
      )}
      <div className="grid gap-4">
        {results.map((user) => (
          <Link key={user._id} to={`/users/${user.userName}`} className="border border-border p-4 rounded bg-parchment hover:bg-cream block">
            <div className="text-xl font-semibold text-ink">{user.userName}</div>
            <p className="text-warm-gray">{user.email}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;