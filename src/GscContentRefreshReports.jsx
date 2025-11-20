import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscContentRefreshReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchReports(page, sortBy, sortOrder);
  }, [page, sortBy, sortOrder]);

  const fetchReports = async (pageNum, sortField, order) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-content-refresh?page=${pageNum}&sortBy=${sortField}&sortOrder=${order}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('❌ Failed to fetch content refresh reports:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports(page, sortBy, sortOrder);
  };

  const handleManualGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-content-refresh/manual-generate`
      );
      if (res.data.success) {
        alert('✅ Reports generation started! Please wait a few moments and refresh the data.');
        // Auto refresh after 3 seconds
        setTimeout(() => {
          fetchReports(1, sortBy, sortOrder);
          setPage(1);
        }, 3000);
      } else {
        alert(res.data.error || 'Failed to generate reports');
      }
    } catch (err) {
      console.error('❌ Failed to generate reports:', err);
      alert(err.response?.data?.error || 'Failed to generate reports. Please try again.');
    } finally {
      setGenerating(false);
    }
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

  const getPositionChange = (oldPos, newPos) => {
    const change = newPos - oldPos;
    if (change > 0) {
      return { text: `+${change.toFixed(2)}`, color: '#dc2626', icon: '📉' }; // Dropped
    } else if (change < 0) {
      return { text: `${change.toFixed(2)}`, color: '#16a34a', icon: '📈' }; // Improved
    }
    return { text: '0.00', color: '#6b7280', icon: '➡️' }; // No change
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>
          📉 Content Refresh Suggestions
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
          Based on ranking drops in GSC + AI recommendations
        </p>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading || generating}
            style={{
              background: refreshing ? "#9ca3af" : "#4f46e5",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: refreshing || loading || generating ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {refreshing ? "🔄 Refreshing..." : "🔄 Refresh Data"}
          </button>
          <button
            onClick={handleManualGenerate}
            disabled={generating || loading || refreshing}
            style={{
              background: generating ? "#9ca3af" : "#16a34a",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: generating || loading || refreshing ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {generating ? "⏳ Generating..." : "🚀 Generate Reports"}
          </button>
        </div>
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
                onClick={() => handleSort('old_position')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'old_position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'old_position' ? "#eef2ff" : "white",
                  color: sortBy === 'old_position' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'old_position' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Old Position {getSortIcon('old_position')}
              </button>
              <button
                onClick={() => handleSort('new_position')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'new_position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'new_position' ? "#eef2ff" : "white",
                  color: sortBy === 'new_position' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'new_position' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                New Position {getSortIcon('new_position')}
              </button>
              <button
                onClick={() => handleSort('old_clicks')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'old_clicks' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'old_clicks' ? "#eef2ff" : "white",
                  color: sortBy === 'old_clicks' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'old_clicks' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Old Clicks {getSortIcon('old_clicks')}
              </button>
              <button
                onClick={() => handleSort('new_clicks')}
                style={{
                  padding: "6px 12px",
                  border: sortBy === 'new_clicks' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                  background: sortBy === 'new_clicks' ? "#eef2ff" : "white",
                  color: sortBy === 'new_clicks' ? "#4f46e5" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: sortBy === 'new_clicks' ? "600" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                New Clicks {getSortIcon('new_clicks')}
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
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Dropped URLs</h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading...</p>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>#</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>URL</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Keyword</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Old Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>New Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Change</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Old Clicks</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>New Clicks</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>More</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => {
                    const positionChange = getPositionChange(r.old_position, r.new_position);
                    return (
                      <React.Fragment key={r.id || i}>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>{(page - 1) * 80 + i + 1}</td>
                          <td style={{ padding: '12px' }}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer"
                               style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-word' }}>
                              {r.url}
                            </a>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                              {r.article_published_at
                                ? `Published: ${formatDate(r.article_published_at)}`
                                : `Detected: ${formatDate(r.created_at)}`}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                              Added: {formatDate(r.created_at)}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{r.keyword || 'Unknown'}</td>
                          <td style={{ padding: '12px' }}>{r.old_position.toFixed(2)}</td>
                          <td style={{ padding: '12px' }}>{r.new_position.toFixed(2)}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ color: positionChange.color, fontWeight: '600' }}>
                              {positionChange.icon} {positionChange.text}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>{r.old_clicks}</td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{r.new_clicks}</td>
                          <td style={{ padding: '12px' }}>
                            <button onClick={() => toggleDropdown(r.id || i)}
                                    style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                              Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
                            </button>
                          </td>
                        </tr>
                        {openDropdownId === (r.id || i) && (
                          <tr>
                            <td colSpan="9">
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
                    );
                  })}
                </tbody>
              </table>

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
                <span style={{ fontSize: '14px', margin: '0 10px' }}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GscContentRefreshReports;