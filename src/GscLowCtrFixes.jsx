// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function GscLowCtrFixes() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openId, setOpenId] = useState(null);

//   useEffect(() => {
//     axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-low-ctr')
//       .then(res => setReports(res.data.data || []))
//       .catch(err => console.error('❌ Fetch failed:', err))
//       .finally(() => setLoading(false));
//   }, []);

//   const toggle = (id) => setOpenId(openId === id ? null : id);

//   const formatMarkdown = (text) => {
//     return text?.replace(/\n/g, '<br />') || 'No data.';
//   };

//   return (
//     <div style={{ padding: 16, background: '#f9fafb' }}>
//       <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', textAlign: 'center' }}>🎯 Low CTR Fix Suggestions</h1>

//       <div style={{ maxWidth: 1280, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 16 }}>
//         {loading ? <p>Loading...</p> : (
//           <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>URL</th>
//                 <th>Keyword</th>
//                 <th>CTR</th>
//                 <th>Pos</th>
//                 <th>More</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reports.map((r, i) => (
//                 <React.Fragment key={r.id}>
//                   <tr style={{ borderBottom: '1px solid #eee' }}>
//                     <td>{i + 1}</td>
//                     <td>
//                       <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{r.url}</a>
//                     </td>
//                     <td>{r.keyword}</td>
//                     <td>{(r.ctr * 100).toFixed(2)}%</td>
//                     <td>{r.position.toFixed(2)}</td>
//                     <td>
//                       <button onClick={() => toggle(r.id)} style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}>
//                         {openId === r.id ? '⬆️' : '⬇️'}
//                       </button>
//                     </td>
//                   </tr>
//                   {openId === r.id && (
//                     <tr>
//                       <td colSpan={6}>
//                         <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
//                           <strong>Current Title:</strong> {r.title}<br />
//                           <strong>Current Meta:</strong> {r.meta_description}<br /><br />
//                           <div dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }} />
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default GscLowCtrFixes;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscLowCtrFixes() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchReports(page, sortBy, sortOrder);
  }, [page, sortBy, sortOrder]);

  const fetchReports = async (pageNum, sortField, order) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-low-ctr?page=${pageNum}&sortBy=${sortField}&sortOrder=${order}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page || pageNum);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('❌ Fetch failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports(page, sortBy, sortOrder);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const toggle = (id) => setOpenId(openId === id ? null : id);

  const formatMarkdown = (text) => {
    if (!text) return 'No data.';
    return text
      .replace(/^(\d+\.\s+.*)/gm, '<h3 style="font-weight: 700; color: #374151; margin-bottom: 6px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)/gm, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/---/g, '<hr style="margin: 16px 0; border-color: #e5e7eb;" />')
      .replace(/[\*#]+/g, '')
      .replace(/\n/g, '<br />');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    
    const date = new Date(dateStr);
    
    // Format: "8:01AM 21st November"
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    // Convert to 12-hour format
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minutesStr = minutes.toString().padStart(2, '0');
    
    // Get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const formattedDate = `${hour12}:${minutesStr}${ampm} ${day}${getDaySuffix(day)} ${month}`;
    
    return formattedDate;
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return '↕️';
    }
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div style={{ padding: 16, background: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', marginBottom: '4px' }}>
          🎯 Low CTR Fix Suggestions
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
          Pages with low click-through rates that need optimization
        </p>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          style={{
            background: refreshing ? "#9ca3af" : "#4f46e5",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: refreshing || loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          {refreshing ? "🔄 Refreshing..." : "🔄 Refresh Data"}
        </button>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Sort Controls */}
        {!loading && reports.length > 0 && (
          <div
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "16px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "600" }}>
                Sort by:
              </span>
              <button
                onClick={() => handleSort('ctr')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'ctr' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'ctr' ? "#eef2ff" : "white",
                  color: sortBy === 'ctr' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'ctr' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                CTR {getSortIcon('ctr')}
              </button>
              <button
                onClick={() => handleSort('position')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'position' ? "#eef2ff" : "white",
                  color: sortBy === 'position' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'position' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Position {getSortIcon('position')}
              </button>
              <button
                onClick={() => handleSort('created_at')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'created_at' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'created_at' ? "#eef2ff" : "white",
                  color: sortBy === 'created_at' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'created_at' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Date Added {getSortIcon('created_at')}
              </button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 16 }}>
          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>Loading...</p>
          ) : reports.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>No data found</p>
          ) : (
            <>
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>#</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>URL</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Keyword</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>CTR</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>More</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <React.Fragment key={r.id || i}>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px' }}>{(page - 1) * 80 + i + 1}</td>
                        <td style={{ padding: '12px' }}>
                          <a href={r.url} target="_blank" rel="noreferrer" 
                             style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-word' }}>
                            {r.url}
                          </a>
                          {/* Date Display */}
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#9ca3af' }}>📅</span>
                            <span>Added: {formatDate(r.created_at)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>{r.keyword || 'Unknown'}</td>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{(r.ctr * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px' }}>{r.position.toFixed(2)}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => toggle(r.id)} 
                                  style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>
                            {openId === r.id ? '⬆️' : '⬇️'}
                          </button>
                        </td>
                      </tr>
                      {openId === r.id && (
                        <tr>
                          <td colSpan={6}>
                            <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#7c3aed', marginBottom: '12px' }}>🔍 AI Recommendations</h3>
                              <div style={{ marginBottom: '12px', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
                                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                                  <strong>Current Title:</strong> {r.title || 'N/A'}
                                </div>
                                <div style={{ fontSize: '13px', color: '#374151' }}>
                                  <strong>Current Meta:</strong> {r.meta_description || 'N/A'}
                                </div>
                              </div>
                              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }} 
                                   dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    style={{
                      marginRight: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ◀ Previous
                  </button>
                  <span style={{ fontSize: '14px', margin: '0 10px', color: '#6b7280' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= totalPages}
                    style={{
                      marginLeft: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GscLowCtrFixes;