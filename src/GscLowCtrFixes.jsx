import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscLowCtrFixes() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-low-ctr')
      .then(res => setReports(res.data.data || []))
      .catch(err => console.error('❌ Fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  const formatMarkdown = (text) => {
    return text?.replace(/\n/g, '<br />') || 'No data.';
  };

  return (
    <div style={{ padding: 16, background: '#f9fafb' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', textAlign: 'center' }}>🎯 Low CTR Fix Suggestions</h1>

      <div style={{ maxWidth: 1280, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 16 }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Keyword</th>
                <th>CTR</th>
                <th>Pos</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <React.Fragment key={r.id}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td>{i + 1}</td>
                    <td>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{r.url}</a>
                    </td>
                    <td>{r.keyword}</td>
                    <td>{(r.ctr * 100).toFixed(2)}%</td>
                    <td>{r.position.toFixed(2)}</td>
                    <td>
                      <button onClick={() => toggle(r.id)} style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}>
                        {openId === r.id ? '⬆️' : '⬇️'}
                      </button>
                    </td>
                  </tr>
                  {openId === r.id && (
                    <tr>
                      <td colSpan={6}>
                        <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
                          <strong>Current Title:</strong> {r.title}<br />
                          <strong>Current Meta:</strong> {r.meta_description}<br /><br />
                          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }} />
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
  );
}

export default GscLowCtrFixes;
