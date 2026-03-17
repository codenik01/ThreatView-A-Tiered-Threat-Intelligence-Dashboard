import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { Bell, Trash2, Plus } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conditionType, setConditionType] = useState('brand_domain');
  const [conditionValue, setConditionValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!conditionValue.trim()) return;
    setError('');

    try {
      await api.post('/alerts', { conditionType, conditionValue });
      setConditionValue('');
      fetchAlerts();
    } catch (err) {
      setError('Error creating alert.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error('Error deleting alert', err);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Custom Alerts</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Configure standing searches. If a new threat is ingested matching your conditions, you will be notified.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Create Alert Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Bell size={20} color="var(--accent-primary)" style={{ marginRight: '0.5rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Create New Alert</h3>
            </div>
            
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Match Type</label>
                <select 
                  className="input-field" 
                  value={conditionType} 
                  onChange={(e) => setConditionType(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="brand_domain">Brand Domain (e.g. yourcompany.com)</option>
                  <option value="specific_ip">Specific IP Address</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Target Value</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={conditionType === 'specific_ip' ? '192.168.1.1' : 'example.com'}
                  value={conditionValue} 
                  onChange={(e) => setConditionValue(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Plus size={18} /> Add Alert Condition
              </button>
            </form>
          </div>

          {/* Active Alerts List */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Active Alerts ({alerts.length})</h3>
            
            {loading ? (
              <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
            ) : alerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.map(alert => (
                  <div key={alert._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: 'var(--glass-border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {alert.conditionValue}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Type: {alert.conditionType === 'brand_domain' ? 'Domain Match' : 'IP Match'}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(alert._id)}
                      className="btn" 
                      style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                      title="Delete Alert"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                You have no active alerts configured.
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
