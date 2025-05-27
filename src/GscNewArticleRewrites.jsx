import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscNewArticleRewrites() {
  const [data, setData] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-new-article-rewrites');
        setData(res.data.data || []);
      } catch (err) {
        console.error('❌ Failed to fetch GSC New Article Rewrites:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const formatOutput = (text) => {
    if (!text) return 'No suggestions available.';
    return text
      .replace(/^(\d+\.\s+.*)/gm, '<h3 style="font-weight: 700; color: #374151; margin-bottom: 6px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)/gm, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/[\*#]+/g, '')
      .replace(/\n/g, '<br />');
  };

  return (
    <div style={{ backgroundColor: '#fefce8', minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ca8a04', marginBottom: '4px' }}>📰 New Article SEO Suggestions</h1>
        <p style={{ fontSize: '14px', color: '#92400e' }}>GSC + AI Insights for recently published content</p>
      </div>

      <div className="container" style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Recently Indexed URLs</h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading...</p>
          ) : (
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th>Keyword</th>
                  <th>Impr.</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Pos</th>
                  <th>Date</th>
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <React.Fragment key={item.id || i}>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td>{i + 1}</td>
                      <td>
                        <a href={item.url} style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer">
                          {item.url}
                        </a>
                      </td>
                      <td>{item.keyword}</td>
                      <td>{item.impressions}</td>
                      <td>{item.clicks}</td>
                      <td>{(item.ctr * 100).toFixed(2)}%</td>
                      <td>{item.position.toFixed(2)}</td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => toggleOpen(item.id || i)} style={{ color: '#d97706', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                          {openId === (item.id || i) ? 'Hide ⬆️' : 'View ⬇️'}
                        </button>
                      </td>
                    </tr>
                    {openId === (item.id || i) && (
                      <tr>
                        <td colSpan="9">
                          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>🔍 AI Output</h3>
                            <div dangerouslySetInnerHTML={{ __html: formatOutput(item.ai_output) }} />
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

export default GscNewArticleRewrites;
