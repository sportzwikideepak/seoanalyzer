// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function GscTrendingKeywords() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-trending-keywords')
//       .then(res => setReports(res.data.data || []))
//       .catch(err => console.error('❌ Failed to fetch:', err))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div style={{ padding: 16, backgroundColor: '#f9fafb' }}>
//       <h1 style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#4f46e5' }}>
//         🚀 Trending Keyword Content Ideas
//       </h1>

//       <div style={{ maxWidth: 1000, margin: '32px auto', background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
//         {loading ? <p>Loading...</p> : (
//           <table style={{ width: '100%', fontSize: 14 }}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Keyword 1</th>
//                 <th>Keyword 2</th>
//                 <th>Keyword 3</th>
//                 <th>Generated Ideas</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reports.map((r, i) => (
//                 <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
//                   <td>{i + 1}</td>
//                   <td>{r.keyword_1}</td>
//                   <td>{r.keyword_2}</td>
//                   <td>{r.keyword_3}</td>
//                   <td>
//                     <div style={{ whiteSpace: 'pre-wrap', background: '#f3f4f6', padding: 10, borderRadius: 6 }}>
//                       {r.ai_output}
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

// export default GscTrendingKeywords;




import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscTrendingKeywords() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-trending-keywords')
      .then(res => setReports(res.data.data || []))
      .catch(err => console.error('❌ Failed to fetch:', err))
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
    <div style={{ padding: 16, backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#4f46e5', marginBottom: 32 }}>
        🚀 Trending Keyword Content Ideas
      </h1>

      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {loading ? <p style={{ fontStyle: 'italic', color: '#6b7280' }}>Loading...</p> : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Keyword 1</th>
                <th>Keyword 2</th>
                <th>Keyword 3</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <React.Fragment key={r.id || i}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td>{i + 1}</td>
                    <td>{r.keyword_1}</td>
                    <td>{r.keyword_2}</td>
                    <td>{r.keyword_3}</td>
                    <td>
                      <button onClick={() => toggleDropdown(r.id || i)} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                        Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
                      </button>
                    </td>
                  </tr>
                  {openDropdownId === (r.id || i) && (
                    <tr>
                      <td colSpan="5">
                        <div style={{ marginTop: 10, background: '#f9f9fc', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          <h3 style={{ fontWeight: 'bold', fontSize: 16, color: '#7c3aed', marginBottom: 8 }}>🧠 AI Suggestions</h3>
                          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }} style={{ color: '#374151' }} />
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

export default GscTrendingKeywords;
