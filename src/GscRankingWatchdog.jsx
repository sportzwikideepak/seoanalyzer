import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscRankingWatchdog() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ranking-watchdog')
      .then(res => setAlerts(res.data.data || []))
      .catch(err => console.error('❌ Failed to fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 16, background: '#f9fafb' }}>
      <h1 style={{ fontSize: 28, textAlign: 'center', color: '#4f46e5', fontWeight: 'bold' }}>📉 Ranking Drop Alerts</h1>

      <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', padding: 20, borderRadius: 12 }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Keyword</th>
                <th>Last Pos</th>
                <th>Current Pos</th>
                <th>AI Insight</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr key={a.id} style={{ borderTop: '1px solid #eee' }}>
                  <td>{i + 1}</td>
                  <td>
                    <a href={a.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                      {a.url}
                    </a>
                  </td>
                  <td>{a.keyword}</td>
                  <td>{a.last_week_position.toFixed(2)}</td>
                  <td>{a.current_position.toFixed(2)}</td>
                  <td>
                    <div style={{ background: '#f3f4f6', padding: 10, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
                      {a.ai_output}
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

export default GscRankingWatchdog;
