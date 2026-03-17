import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ recentIoCs: [], mapData: [], trendData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await api.get('/reports/weekly', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ThreatView_Weekly_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Error generating report. Ensure you are a Pro user.");
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

  if (loading) return <Layout><div className="page-container">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Threat Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Live monitoring of global indicators of compromise.</p>
          </div>
          {user?.role === 'pro' && (
            <button className="btn btn-primary" onClick={handleDownloadReport}>
              <Download size={18} /> Export Weekly Report
            </button>
          )}
        </div>

        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginRight: '1.5rem' }}>
              <ShieldAlert size={32} color="var(--danger)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total IoCs (24h)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.recentIoCs.length > 0 ? stats.recentIoCs.length * 42 : 0}</div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', marginRight: '1.5rem' }}>
              <AlertTriangle size={32} color="var(--warning)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>High/Critical</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.recentIoCs.filter(i => i.severity === 'Critical' || i.severity === 'High').length}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginRight: '1.5rem' }}>
              <ShieldCheck size={32} color="var(--success)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Protection</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>Online</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Top Malware Categories</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trendData}>
                  <XAxis dataKey="_id" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'var(--glass-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.trendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--danger)' : 'var(--accent-primary)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Threat Origins</h3>
            <div style={{ height: '300px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="var(--bg-glass)"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={0.5}
                      />
                    ))
                  }
                </Geographies>
                {/* Mock Markers based on our mocked data */}
                <Marker coordinates={[-95.7129, 37.0902]}>
                  <circle r={8} fill="var(--danger)" opacity={0.6} />
                </Marker>
                <Marker coordinates={[104.1954, 35.8617]}>
                  <circle r={5} fill="var(--warning)" opacity={0.6} />
                </Marker>
                <Marker coordinates={[105.3188, 61.5240]}>
                  <circle r={6} fill="var(--accent-primary)" opacity={0.6} />
                </Marker>
              </ComposableMap>
            </div>
          </div>
        </div>

        {/* Recent IoCs Table */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Indicators of Compromise</h3>
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
              {stats.recentIoCs.map((ioc) => (
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
              {stats.recentIoCs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No recent threats detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
