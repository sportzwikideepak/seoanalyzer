import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscRankingWatchdog() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
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
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ranking-watchdog?page=${pageNum}&sortBy=${sortField}&sortOrder=${order}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page || pageNum);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('❌ Failed to fetch ranking watchdog:', err);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not available';
    
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
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

  const getPositionChange = (lastPos, currentPos) => {
    const change = currentPos - lastPos;
    const isDrop = change > 0;
    const absChange = Math.abs(change).toFixed(2);
    
    return {
      value: isDrop ? `+${absChange}` : `-${absChange}`,
      color: isDrop ? '#dc2626' : '#16a34a',
      icon: isDrop ? '📉' : '📈'
    };
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>
          📉 Ranking Drop Watchdog
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
          Recent ranking drops with AI recommendations to recover
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

      <div className="container" style={{ maxWidth: '1280px', margin: 'auto' }}>
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
                onClick={() => handleSort('last_week_position')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'last_week_position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'last_week_position' ? "#eef2ff" : "white",
                  color: sortBy === 'last_week_position' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'last_week_position' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Last Pos {getSortIcon('last_week_position')}
              </button>
              <button
                onClick={() => handleSort('current_position')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'current_position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'current_position' ? "#eef2ff" : "white",
                  color: sortBy === 'current_position' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'current_position' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Current Pos {getSortIcon('current_position')}
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

        <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px', marginTop: '4px' }}>
            Pages With Drops
          </h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>Loading...</p>
          ) : reports.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>No data found</p>
          ) : (
            <>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>#</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>URL</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Keyword</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Current Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Change</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>More</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => {
                    const positionChange = getPositionChange(r.last_week_position, r.current_position);
                    return (
                      <React.Fragment key={r.id || i}>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>{(page - 1) * 80 + i + 1}</td>
                          <td style={{ padding: '12px' }}>
                            <a
                              href={r.url}
                              style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-all' }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {r.url}
                            </a>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                              Added: {formatDate(r.created_at)}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{r.keyword || 'Unknown'}</td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{r.last_week_position?.toFixed(2) || 'N/A'}</td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{r.current_position?.toFixed(2) || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ color: positionChange.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {positionChange.icon} {positionChange.value}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
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
                            <td colSpan="7">
                              <div
                                className="dropdown-box"
                                style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                              >
                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '12px' }}>
                                  🔍 AI Drop Insight
                                </h2>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                  <strong>URL:</strong>{' '}
                                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                    {r.url}
                                  </a>
                                </p>
                                <div
                                  className="suggestions"
                                  style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}
                                  dangerouslySetInnerHTML={{ __html: formatMarkdown(r.ai_output) }}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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

export default GscRankingWatchdog;