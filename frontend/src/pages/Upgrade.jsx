import { useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upgrade() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpgradeMock = () => {
    alert("In a real application, this would redirect to Stripe for payment processing.");
    // In this mock, we can't trivially upgrade their role from frontend alone without a backend endpoint.
    // The instructions don't strictly require a functional payment processor, just the tiered flow.
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Crown size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h1 className="page-title" style={{ marginBottom: '1rem' }}>Upgrade to ThreatView Pro</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Get complete visibility with historical data, unrestricted search, and automated executive reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', maxWidth: '900px', width: '100%', justifyContent: 'center' }}>
          
          {/* Free Tier */}
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, opacity: 0.7, transform: 'scale(0.95)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Free</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Check size={20} color="var(--success)" /> Live Global Threat Map
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Check size={20} color="var(--success)" /> 24-hour Data Window
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Check size={20} color="var(--success)" /> Custom Alerts
              </li>
            </ul>

            <button className="btn" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }} disabled>
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, border: '1px solid var(--warning)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--warning)', color: '#000', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
              RECOMMENDED
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>Pro</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>$199<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <Check size={20} color="var(--success)" /> <strong>Everything in Free</strong>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <Check size={20} color="var(--success)" /> Unlimited Historical Data Search
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <Check size={20} color="var(--success)" /> Automated PDF Reports
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <Check size={20} color="var(--success)" /> API Access
              </li>
            </ul>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handleUpgradeMock}>
              Upgrade Now
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
