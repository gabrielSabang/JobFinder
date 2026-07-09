import { useSearchParams, Link } from 'react-router-dom';
import { useSearchUsers } from '../hooks';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, error } = useSearchUsers(query);
  const results = data?.users || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-ink font-playfair">Search Results for "{query}"</h1>
      {isLoading && <p className="text-ink">Loading...</p>}
      {error && <p className="text-accent">Failed to fetch search results</p>}
      {!isLoading && !error && results.length === 0 && query && (
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
