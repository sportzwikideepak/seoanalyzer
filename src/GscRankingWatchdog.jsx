// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function GscRankingWatchdog() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ranking-watchdog')
//       .then(res => setAlerts(res.data.data || []))
//       .catch(err => console.error('❌ Failed to fetch:', err))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div style={{ padding: 16, background: '#f9fafb' }}>
//       <h1 style={{ fontSize: 28, textAlign: 'center', color: '#4f46e5', fontWeight: 'bold' }}>📉 Ranking Drop Alerts</h1>

//       <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', padding: 20, borderRadius: 12 }}>
//         {loading ? <p>Loading...</p> : (
//           <table style={{ width: '100%', fontSize: 14 }}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>URL</th>
//                 <th>Keyword</th>
//                 <th>Last Pos</th>
//                 <th>Current Pos</th>
//                 <th>AI Insight</th>
//               </tr>
//             </thead>
//             <tbody>
//               {alerts.map((a, i) => (
//                 <tr key={a.id} style={{ borderTop: '1px solid #eee' }}>
//                   <td>{i + 1}</td>
//                   <td>
//                     <a href={a.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
//                       {a.url}
//                     </a>
//                   </td>
//                   <td>{a.keyword}</td>
//                   <td>{a.last_week_position.toFixed(2)}</td>
//                   <td>{a.current_position.toFixed(2)}</td>
//                   <td>
//                     <div style={{ background: '#f3f4f6', padding: 10, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
//                       {a.ai_output}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default GscRankingWatchdog;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscRankingWatchdog() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ranking-watchdog');
        setReports(res.data.data || []);
      } catch (err) {
        console.error('❌ Failed to fetch ranking watchdog:', err);
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
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>📉 Ranking Drop Watchdog</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Recent ranking drops with AI recommendations to recover</p>
      </div>

      <div className="container" style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px', marginTop: '4px' }}>Pages With Drops</h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading...</p>
          ) : (
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th>Keyword</th>
                  <th>Last Pos</th>
                  <th>Current Pos</th>
                  <th>Date</th>
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <React.Fragment key={r.id || i}>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td>{i + 1}</td>
                      <td>
                        <a href={r.url} style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer">
                          {r.url}
                        </a>
                      </td>
                      <td>{r.keyword}</td>
                      <td>{r.last_week_position.toFixed(2)}</td>
                      <td>{r.current_position.toFixed(2)}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => toggleDropdown(r.id || i)} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                          Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
                        </button>
                      </td>
                    </tr>
                    {openDropdownId === (r.id || i) && (
                      <tr>
                        <td colSpan="7">
                          <div className="dropdown-box" style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '12px' }}>🔍 AI Drop Insight</h2>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                              <strong>URL:</strong>{' '}
                              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{r.url}</a>
                            </p>
                            <div className="suggestions" style={{ fontSize: '14px', color: '#374151' }} dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }} />
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

export default GscRankingWatchdog;
