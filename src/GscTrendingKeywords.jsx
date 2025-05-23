import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscTrendingKeywords() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-trending-keywords')
      .then(res => setReports(res.data.data || []))
      .catch(err => console.error('❌ Failed to fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 16, backgroundColor: '#f9fafb' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#4f46e5' }}>
        🚀 Trending Keyword Content Ideas
      </h1>

      <div style={{ maxWidth: 1000, margin: '32px auto', background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Keyword 1</th>
                <th>Keyword 2</th>
                <th>Keyword 3</th>
                <th>Generated Ideas</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                  <td>{i + 1}</td>
                  <td>{r.keyword_1}</td>
                  <td>{r.keyword_2}</td>
                  <td>{r.keyword_3}</td>
                  <td>
                    <div style={{ whiteSpace: 'pre-wrap', background: '#f3f4f6', padding: 10, borderRadius: 6 }}>
                      {r.ai_output}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GscTrendingKeywords;
