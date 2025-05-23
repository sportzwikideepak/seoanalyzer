import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscContentRefreshReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-content-refresh');
        setReports(res.data.data || []);
      } catch (err) {
        console.error('❌ Failed to fetch content refresh reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const formatMarkdown = (text) => {
    if (!text) return 'No suggestions available.';

    return text
      .replace(/^(\d+\.\s+.*)/gm, '<h3 style="font-weight: 700; color: #374151; margin-bottom: 6px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)/gm, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/---/g, '<hr style="margin: 16px 0; border-color: #e5e7eb;" />')
      .replace(/[\*#]+/g, '')
      .replace(/\n/g, '<br />');
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>📉 Content Refresh Suggestions</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Based on ranking drops in GSC + AI recommendations</p>
      </div>

      <div className="container" style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Dropped URLs</h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th>Keyword</th>
                  <th>Old Pos</th>
                  <th>New Pos</th>
                  <th>Old Clicks</th>
                  <th>New Clicks</th>
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <React.Fragment key={r.id || i}>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td>{i + 1}</td>
                      <td>
                        <a href={r.url} style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-word' }} target="_blank" rel="noopener noreferrer">
                          {r.url}
                        </a>
                      </td>
                      <td>{r.keyword}</td>
                      <td>{r.old_position.toFixed(2)}</td>
                      <td>{r.new_position.toFixed(2)}</td>
                      <td>{r.old_clicks}</td>
                      <td>{r.new_clicks}</td>
                      <td>
                        <button onClick={() => toggleDropdown(r.id || i)} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                          Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
                        </button>
                      </td>
                    </tr>
                    {openDropdownId === (r.id || i) && (
                      <tr>
                        <td colSpan="8">
                          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '12px' }}>🔍 AI Recommendations</h2>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                              <strong>URL:</strong>{' '}
                              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{r.url}</a>
                            </p>
                            <div style={{ fontSize: '14px', color: '#374151' }} dangerouslySetInnerHTML={{ __html: formatMarkdown(r.deepseek_output) }} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default GscContentRefreshReports;
