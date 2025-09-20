
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AutomatedCricketNews = () => {
//   const [storedNews, setStoredNews] = useState([]);
//   const [processedNews, setProcessedNews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState({});
//   const [activeTab, setActiveTab] = useState('stored');
  
//   // Pagination states
//   const [storedCurrentPage, setStoredCurrentPage] = useState(1);
//   const [processedCurrentPage, setProcessedCurrentPage] = useState(1);
//   const [storedTotalPages, setStoredTotalPages] = useState(1);
//   const [processedTotalPages, setProcessedTotalPages] = useState(1);
//   const [storedTotalCount, setStoredTotalCount] = useState(0);
//   const [processedTotalCount, setProcessedTotalCount] = useState(0);

//   const DEPLOYED_BACKEND_URL = "https://hammerhead-app-jkdit.ondigitalocean.app";
//   const ITEMS_PER_PAGE = 25;

//   // Fetch stored news from database with pagination
//   const fetchStoredNews = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * ITEMS_PER_PAGE;
//       const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/stored-news?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
//       if (response.data.success) {
//         setStoredNews(response.data.news);
//         setStoredTotalCount(response.data.totalCount || response.data.news.length);
//         setStoredTotalPages(Math.ceil((response.data.totalCount || response.data.news.length) / ITEMS_PER_PAGE));
//         setStoredCurrentPage(page);
//       }
//     } catch (error) {
//       console.error('Error fetching stored news:', error);
//       alert(`Error: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch processed news from database with pagination
//   const fetchProcessedNews = async (page = 1) => {
//     try {
//       const offset = (page - 1) * ITEMS_PER_PAGE;
//       const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/processed-news?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
//       if (response.data.success) {
//         setProcessedNews(response.data.news);
//         setProcessedTotalCount(response.data.totalCount || response.data.news.length);
//         setProcessedTotalPages(Math.ceil((response.data.totalCount || response.data.news.length) / ITEMS_PER_PAGE));
//         setProcessedCurrentPage(page);
//       }
//     } catch (error) {
//       console.error('Error fetching processed news:', error);
//     }
//   };

//   // Process single article
//   const processArticle = async (articleId) => {
//     setProcessing(prev => ({ ...prev, [articleId]: true }));
    
//     try {
//       const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/process-article/${articleId}`);
      
//       if (response.data.success) {
//         await fetchStoredNews(storedCurrentPage);
//         await fetchProcessedNews(processedCurrentPage);
//         alert('Article processed successfully!');
//       } else {
//         alert(`Error: ${response.data.error}`);
//       }
//     } catch (error) {
//       alert(`Error: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setProcessing(prev => ({ ...prev, [articleId]: false }));
//     }
//   };

//   // Manual fetch news
//   const manualFetchNews = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/manual-fetch-news`);
//       if (response.data.success) {
//         await fetchStoredNews(1);
//         setStoredCurrentPage(1);
//         alert('News fetched and stored successfully!');
//       }
//     } catch (error) {
//       alert(`Error: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-refresh every 5 minutes
//   useEffect(() => {
//     fetchStoredNews(1);
//     fetchProcessedNews(1);
    
//     const interval = setInterval(() => {
//       fetchStoredNews(storedCurrentPage);
//       fetchProcessedNews(processedCurrentPage);
//     }, 5 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Format date and time
//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return {
//       date: date.toLocaleDateString('en-IN'),
//       time: date.toLocaleTimeString('en-IN', { 
//         hour: '2-digit', 
//         minute: '2-digit',
//         hour12: true 
//       })
//     };
//   };

//   // Generate meta title from article title - FULL TITLE
//   const generateMetaTitle = (title) => {
//     return title; // Show full title without truncation
//   };

//   // Convert plain text to HTML format with proper tags
//   const convertToHTML = (text) => {
//     if (!text) return '';
    
//     // Clean the text first
//     let cleanText = text
//       .replace(/Of course\. Here is a complete, ready-to-publish cricket article crafted from your content\./gi, '')
//       .replace(/optimized for engagement and search engines\./gi, '')
//       .replace(/Stay updated with the latest cricket news and analysis from the Asia Cup\./gi, '')
//       .replace(/\*\*(.*?)\*\*/g, '$1')
//       .replace(/\*(.*?)\*/g, '$1')
//       .replace(/#{1,6}\s*/g, '')
//       .replace(/\*\s*/g, '')
//       .replace(/\n\*\*\*/g, '\n\n')
//       .replace(/\*\*\*/g, '')
//       .replace(/Here is a complete, ready-to-publish cricket article/gi, '')
//       .replace(/crafted from your content/gi, '')
//       .replace(/designed to be professional, engaging/gi, '')
//       .replace(/optimized for both readers and search engines/gi, '')
//       .replace(/Format it with proper headings, subheadings, and structure/gi, '')
//       .replace(/Make it sound human and natural, not AI-generated/gi, '')
//       .replace(/The incident highlights/gi, '')
//       .replace(/This development comes/gi, '')
//       .replace(/The controversy began/gi, '')
//       .replace(/In response to/gi, '')
//       .replace(/The decision marks/gi, '')
//       .replace(/This move comes/gi, '')
//       .replace(/The announcement follows/gi, '')
//       .replace(/In conclusion/gi, '')
//       .replace(/To summarize/gi, '')
//       .replace(/Overall/gi, '')
//       .replace(/In summary/gi, '')
//       .replace(/It is clear that/gi, '')
//       .replace(/This demonstrates/gi, '')
//       .replace(/\n\s*\n\s*\n/g, '\n\n')
//       .replace(/^\s+|\s+$/g, '')
//       .replace(/^\s*\n+/, '')
//       .replace(/\n+\s*$/, '');
    
//     // Split into paragraphs
//     const paragraphs = cleanText.split('\n\n').filter(p => p.trim());
    
//     let html = '';
    
//     // First paragraph as h1 (main title)
//     if (paragraphs.length > 0) {
//       const firstPara = paragraphs[0].trim();
//       html += `<h1>${firstPara}</h1>`;
      
//       // Rest as paragraphs
//       for (let i = 1; i < paragraphs.length; i++) {
//         const para = paragraphs[i].trim();
//         if (para) {
//           html += `<p>${para}</p>`;
//         }
//       }
//     } else {
//       html = `<p>${cleanText}</p>`;
//     }
    
//     return html;
//   };

//   // Pagination component
//   const Pagination = ({ currentPage, totalPages, onPageChange, totalCount }) => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: '10px',
//         marginTop: '20px',
//         padding: '20px'
//       }}>
//         <button
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//           style={{
//             padding: '8px 12px',
//             backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//             fontSize: '14px'
//           }}
//         >
//           First
//         </button>
        
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           style={{
//             padding: '8px 12px',
//             backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//             fontSize: '14px'
//           }}
//         >
//           Previous
//         </button>

//         {pages.map(page => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             style={{
//               padding: '8px 12px',
//               backgroundColor: currentPage === page ? '#28a745' : '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: currentPage === page ? 'bold' : 'normal'
//             }}
//           >
//             {page}
//           </button>
//         ))}

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           style={{
//             padding: '8px 12px',
//             backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//             fontSize: '14px'
//           }}
//         >
//           Next
//         </button>
        
//         <button
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           style={{
//             padding: '8px 12px',
//             backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//             fontSize: '14px'
//           }}
//         >
//           Last
//         </button>

//         <div style={{
//           marginLeft: '20px',
//           fontSize: '14px',
//           color: '#666'
//         }}>
//           Page {currentPage} of {totalPages} ({totalCount} total items)
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
//       {/* Header */}
//       <div style={{textAlign: 'center', marginBottom: '30px'}}>
//         <h1 style={{color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px'}}>
//           🏏 Continuous Cricket News
//         </h1>
//         <p style={{color: '#666', fontSize: '1.1rem'}}>
//           24/7 News Fetching & Processing System
//         </p>
//       </div>

//       {/* Tabs */}
//       <div style={{
//         display: 'flex',
//         gap: '10px',
//         marginBottom: '30px',
//         borderBottom: '2px solid #e9ecef'
//       }}>
//         <button
//           onClick={() => setActiveTab('stored')}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: activeTab === 'stored' ? '#007bff' : '#f8f9fa',
//             color: activeTab === 'stored' ? 'white' : '#333',
//             border: 'none',
//             borderRadius: '8px 8px 0 0',
//             cursor: 'pointer',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           Stored News ({storedTotalCount})
//         </button>
//         <button
//           onClick={() => setActiveTab('processed')}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: activeTab === 'processed' ? '#28a745' : '#f8f9fa',
//             color: activeTab === 'processed' ? 'white' : '#333',
//             border: 'none',
//             borderRadius: '8px 8px 0 0',
//             cursor: 'pointer',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           ✅ Processed Articles ({processedTotalCount})
//         </button>
//       </div>

//       {/* Controls */}
//       <div style={{textAlign: 'center', marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center'}}>
//         <button
//           onClick={() => {
//             fetchStoredNews(storedCurrentPage);
//             fetchProcessedNews(processedCurrentPage);
//           }}
//           disabled={loading}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: loading ? '#ccc' : '#17a2b8',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           {loading ? '⏳ Refreshing...' : '🔄 Refresh All'}
//         </button>
        
//         <button
//           onClick={manualFetchNews}
//           disabled={loading}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: loading ? '#ccc' : '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           {loading ? '⏳ Fetching...' : '📰 Fetch New News'}
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === 'stored' ? (
//         <div>
//           <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
//             Latest Stored News (Page {storedCurrentPage} of {storedTotalPages})
//           </h2>
          
//           {loading ? (
//             <div style={{textAlign: 'center', padding: '40px'}}>
//               <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
//               <p>Loading latest news...</p>
//             </div>
//           ) : storedNews.length === 0 ? (
//             <div style={{textAlign: 'center', padding: '40px'}}>
//               <div style={{fontSize: '48px', marginBottom: '20px'}}>📰</div>
//               <p style={{fontSize: '18px', color: '#666'}}>No news found. Click "Fetch New News" to get latest cricket news.</p>
//             </div>
//           ) : (
//             <>
//               <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
//                 {storedNews.map((article) => {
//                   const { date, time } = formatDateTime(article.published_at);
//                   return (
//                     <div key={article.id} style={{
//                       border: '2px solid #e9ecef',
//                       borderRadius: '12px',
//                       padding: '20px',
//                       backgroundColor: 'white',
//                       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <div style={{flex: 1}}>
//                         <h3 style={{
//                           fontWeight: 'bold',
//                           marginBottom: '10px',
//                           fontSize: '16px',
//                           lineHeight: '1.4',
//                           color: '#2c3e50'
//                         }}>
//                           {article.title}
//                         </h3>
                        
//                         <div style={{
//                           display: 'flex',
//                           gap: '20px',
//                           fontSize: '12px',
//                           color: '#666'
//                         }}>
//                           <span>📅 {date}</span>
//                           <span>🕒 {time}</span>
//                           <span> {article.source_name}</span>
//                           <span>📝 {article.word_count} words</span>
//                           {article.processed && (
//                             <span style={{color: '#28a745', fontWeight: 'bold'}}>✅ Processed</span>
//                           )}
//                         </div>
//                       </div>
                      
//                       {!article.processed && (
//                         <button
//                           onClick={() => processArticle(article.id)}
//                           disabled={processing[article.id]}
//                           style={{
//                             padding: '10px 20px',
//                             backgroundColor: processing[article.id] ? '#ccc' : '#28a745',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '8px',
//                             cursor: processing[article.id] ? 'not-allowed' : 'pointer',
//                             fontSize: '14px',
//                             fontWeight: 'bold',
//                             minWidth: '120px'
//                           }}
//                         >
//                           {processing[article.id] ? '⏳ Processing...' : '🚀 Process'}
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
              
//               <Pagination
//                 currentPage={storedCurrentPage}
//                 totalPages={storedTotalPages}
//                 onPageChange={fetchStoredNews}
//                 totalCount={storedTotalCount}
//               />
//             </>
//           )}
//         </div>
//       ) : (
//         <div>
//           <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
//             ✅ Processed Articles (Page {processedCurrentPage} of {processedTotalPages})
//           </h2>
          
//           <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
//             {processedNews.map((article) => {
//               const { date, time } = formatDateTime(article.processed_at);
//               const metaTitle = generateMetaTitle(article.title);
              
//               return (
//                 <div key={article.id} style={{
//                   border: '2px solid #28a745',
//                   borderRadius: '12px',
//                   padding: '20px',
//                   backgroundColor: '#f8fff8',
//                   boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                 }}>
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: '15px'
//                   }}>
//                     <h3 style={{
//                       fontWeight: 'bold',
//                       fontSize: '16px',
//                       color: '#2c3e50',
//                       flex: 1
//                     }}>
//                       {article.title}
//                     </h3>
//                     <div style={{
//                       fontSize: '12px',
//                       color: '#666',
//                       textAlign: 'right'
//                     }}>
//                       <div>✅ Processed: {date} {time}</div>
//                       <div>📰 {article.source_name}</div>
//                     </div>
//                   </div>
                  
//                   {/* Meta Information - ONLY TITLE */}
//                   <div style={{
//                     backgroundColor: '#e9ecef',
//                     padding: '15px',
//                     borderRadius: '8px',
//                     marginBottom: '15px',
//                     fontSize: '12px'
//                   }}>
//                     <div>
//                       <strong>Meta Title:</strong> {metaTitle}
//                     </div>
//                   </div>
                  
//                   {/* HTML Tags as Text - NOT RENDERED */}
//                   <div style={{
//                     maxHeight: '600px',
//                     overflow: 'auto',
//                     fontSize: '12px',
//                     lineHeight: '1.4',
//                     backgroundColor: '#f8f9fa',
//                     padding: '20px',
//                     borderRadius: '8px',
//                     border: '1px solid #e9ecef',
//                     fontFamily: 'monospace',
//                     whiteSpace: 'pre-wrap'
//                   }}>
//                     {convertToHTML(article.ready_article)}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
          
//           <Pagination
//             currentPage={processedCurrentPage}
//             totalPages={processedTotalPages}
//             onPageChange={fetchProcessedNews}
//             totalCount={processedTotalCount}
//           />
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import axios from "axios";

// const API = "http://localhost:5000";  // change if you deploy
const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

const PAGE = 25;

export default function AutomatedCricketNews() {
  const [stored, setStored] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});

  const [sp, setSp] = useState(1);
  const [pp, setPp] = useState(1);
  const [stp, setStp] = useState(1);
  const [ptp, setPtp] = useState(1);
  const [stc, setStc] = useState(0);
  const [ptc, setPtc] = useState(0);

  // ---- helpers ----
  const fmt = (d) => {
    if (!d) return { date: "-", time: "-" };
    const t = new Date(d); // ISO 'Z' from backend -> renders in local time here
    return {
      date: t.toLocaleDateString("en-IN"),
      time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  const safePublishedAt = (row) => row.published_at_iso || row.published_at;
  const safeProcessedAt = (row) => row.processed_at_iso || row.processed_at;

  // ---- fetchers ----
  const fetchStored = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(`${API}/api/stored-news?limit=${PAGE}&offset=${offset}`);
      if (r.data?.success) {
        setStored(r.data.news || []);
        const total = r.data.totalCount || 0;
        setStc(total);
        setStp(Math.max(1, Math.ceil(total / PAGE)));
        setSp(page);
      }
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessed = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(`${API}/api/processed-news?limit=${PAGE}&offset=${offset}`);
      if (r.data?.success) {
        setProcessed(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtc(total);
        setPtp(Math.max(1, Math.ceil(total / PAGE)));
        setPp(page);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStored(1);
    fetchProcessed(1);
  }, []);

  const gen = async (id) => {
    setBusy((m) => ({ ...m, [id]: true }));
    try {
      const r = await axios.post(`${API}/api/articles/${id}/generate`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      await fetchStored(sp);
      await fetchProcessed(pp);
      alert("✅ Article generated.");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  };

  const manualFetch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/manual-fetch-news`);
      await fetchStored(1);
      setSp(1);
      alert("News fetched.");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>🏏 Continuous Cricket News</h1>
        <p>24/7 News Fetching & One-Click Article Generation</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setTab("stored")}
          style={{ padding: "10px 16px", background: tab === "stored" ? "#007bff" : "#f3f4f6", color: tab === "stored" ? "#fff" : "#333" }}
        >
          Stored News ({stc})
        </button>
        <button
          onClick={() => setTab("processed")}
          style={{ padding: "10px 16px", background: tab === "processed" ? "#28a745" : "#f3f4f6", color: tab === "processed" ? "#fff" : "#333" }}
        >
          ✅ Processed Articles ({ptc})
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
        <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }}>
          {loading ? "⏳ Refreshing…" : "🔄 Refresh All"}
        </button>
        <button disabled={loading} onClick={manualFetch}>
          {loading ? "⏳ Fetching…" : "📰 Fetch New News"}
        </button>
      </div>

      {tab === "stored" ? (
        <div>
          <h2>Latest Stored News (Page {sp} of {stp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stored.map((a) => {
              const { date, time } = fmt(safePublishedAt(a));
              const isBusy = !!busy[a.id];
              return (
                <div key={a.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{a.title}</div>
                    <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12 }}>
                      <span>📅 {date}</span>
                      <span>🕒 {time}</span>
                      <span>{a.source_name}</span>
                      {typeof a.word_count === "number" && <span>📝 {a.word_count} words</span>}
                      {a.processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ Processed</span> : null}
                    </div>
                  </div>
                  <button
                    onClick={() => gen(a.id)}
                    disabled={isBusy}
                    style={{ padding: "10px 14px", background: isBusy ? "#95a5a6" : "#00b894", color: "#fff", border: "none", borderRadius: 8 }}
                  >
                    {isBusy ? "⏳ Generating…" : "🧠 Generate Article (AI)"}
                  </button>
                </div>
              );
            })}
          </div>
          <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
        </div>
      ) : (
        <div>
          <h2>✅ Processed Articles (Page {pp} of {ptp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processed.map((a) => {
              const { date, time } = fmt(safeProcessedAt(a));
              const title = a.final_title || a.title;
              const meta  = a.final_meta || "";
              const slug  = a.final_slug || "article";

              return (
                <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <div>Processed: {date} {time}</div>
                      <div>📰 {a.source_name}</div>
                    </div>
                  </div>

                  <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                    <div><strong>Meta Title:</strong> {title}</div>
                    {meta && <div><strong>Meta Description:</strong> {meta}</div>}
                    {slug && <div><strong>Slug:</strong> {slug}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(a.ready_article || "")}>📋 Copy Full HTML</button>
                    <button onClick={() => {
                      const blob = new Blob([a.ready_article || ""], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const aTag = document.createElement("a");
                      aTag.href = url;
                      aTag.download = `${slug}.html`;
                      aTag.click();
                      URL.revokeObjectURL(url);
                    }}>💾 Download HTML</button>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <iframe title={`preview-${a.id}`} srcDoc={a.ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={pp} total={ptp} totalCount={ptc} onChange={fetchProcessed} />
        </div>
      )}
    </div>
  );
}

function Pager({ page, total, totalCount, onChange }) {
  const nums = [];
  const max = 5;
  let s = Math.max(1, page - Math.floor(max / 2));
  let e = Math.min(total, s + max - 1);
  if (e - s + 1 < max) s = Math.max(1, e - max + 1);
  for (let i = s; i <= e; i++) nums.push(i);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
      <button disabled={page===1} onClick={() => onChange(1)}>First</button>
      <button disabled={page===1} onClick={() => onChange(page-1)}>Prev</button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal" }}>{n}</button>
      ))}
      <button disabled={page===total} onClick={() => onChange(page+1)}>Next</button>
      <button disabled={page===total} onClick={() => onChange(total)}>Last</button>
      <span style={{ marginLeft: 8, color: "#666" }}>Page {page} of {total} ({totalCount})</span>
    </div>
  );
}
