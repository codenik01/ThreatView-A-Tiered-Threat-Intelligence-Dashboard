import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Search, Bell, Crown, LogOut, ShieldAlert } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, proBadge }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '0.5rem',
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        transition: 'all 0.2s',
        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
      })}
    >
      <Icon size={20} style={{ marginRight: '1rem', color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
      <span style={{ flexGrow: 1, fontWeight: isActive ? 600 : 400 }}>{label}</span>
      {proBadge && <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>PRO</span>}
    </NavLink>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ 
        width: '260px', 
        padding: '1.5rem 1rem', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '0',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', padding: '0 1rem' }}>
          <ShieldAlert size={28} color="var(--accent-primary)" style={{ marginRight: '0.75rem' }} />
          <h2 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ThreatView</h2>
        </div>

        <nav style={{ flexGrow: 1 }}>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/search" icon={Search} label="IoC Search" proBadge={true} />
          <NavItem to="/alerts" icon={Bell} label="Alerts" />
          <NavItem to="/upgrade" icon={Crown} label="Upgrade" />
        </nav>

        <div style={{ padding: '1rem', borderTop: 'var(--glass-border)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Logged in as:</div>
            <div style={{ wordBreak: 'break-all', fontWeight: 500 }}>{user?.email}</div>
            <div style={{ marginTop: '0.25rem' }}>
              <span className={`badge ${user?.role === 'pro' ? 'badge-high' : 'badge-medium'}`}>
                {user?.role?.toUpperCase() || 'FREE'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, marginLeft: '260px' }}>
        {children}
      </main>
    </div>
  );
}
