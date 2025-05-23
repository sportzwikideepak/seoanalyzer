import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscContentQueryMatch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-content-query-match')
      .then(res => setData(res.data.data || []))
      .catch(err => console.error('❌ Fetch failed:', err))
      .finally(() => setLoading(false));
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
      .replace(/\n/g, '<br />');
  };

  return (
    <div style={{ background: '#f9fafb', padding: 16, minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', textAlign: 'center', marginBottom: 32 }}>
        🔍 Content-to-Query Matching
      </h1>

      <div style={{ maxWidth: 1200, margin: 'auto', background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Query 1</th>
                <th>Query 2</th>
                <th>Query 3</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <React.Fragment key={r.id || i}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td>{i + 1}</td>
                    <td>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                        {r.url}
                      </a>
                    </td>
                    <td>{r.keyword_1}</td>
                    <td>{r.keyword_2}</td>
                    <td>{r.keyword_3}</td>
                    <td>
                      <button
                        onClick={() => toggleDropdown(r.id || i)}
                        style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}
                      >
                        Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
                      </button>
                    </td>
                  </tr>
                  {openDropdownId === (r.id || i) && (
                    <tr>
                      <td colSpan="6">
                        <div style={{ marginTop: 10, background: '#f3f4f6', padding: 16, borderRadius: 8 }}>
                          <h3 style={{ fontWeight: 'bold', fontSize: 16, color: '#7c3aed', marginBottom: 8 }}>🧠 AI Suggestions</h3>
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

export default GscContentQueryMatch;
