import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Search as SearchIcon, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Search() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      const res = await api.get(`/threats/search?query=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      setError('Error searching indicators. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const map = {
      'Critical': 'badge-critical',
      'High': 'badge-high',
      'Medium': 'badge-medium',
      'Low': 'badge-low',
    };
    return `badge ${map[severity] || 'badge-low'}`;
  };

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Indicator Search</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Search for IP addresses, domain names, URLs, or file hashes.
          {user?.role !== 'pro' && ' Free tier is limited to the last 24 hours.'}
        </p>

        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <SearchIcon size={20} />
              </div>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter IP, domain, URL..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '3rem', fontSize: '1rem', padding: '1rem 1rem 1rem 3rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <div style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</div>}
        </div>

        {hasSearched && !loading && (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Search Results ({results.length})</h3>
            
            {results.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Indicator</th>
                    <th>Type</th>
                    <th>Source</th>
                    <th>Severity</th>
                    <th>Tags</th>
                    <th>Ingested</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((ioc) => (
                    <tr key={ioc._id}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ioc.indicator}</td>
                      <td>{ioc.type}</td>
                      <td>{ioc.source}</td>
                      <td><span className={getSeverityBadge(ioc.severity)}>{ioc.severity}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {ioc.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatDistanceToNow(new Date(ioc.ingestedAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <ShieldAlert size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No indicators found for "{query}".</p>
                {user?.role !== 'pro' && <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Note: Free tier only searches data from the last 24 hours.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
