


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";

// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

// function App() {
//   const [articles, setArticles] = useState([]);
//   const [customURL, setCustomURL] = useState("");
//   const [customArticle, setCustomArticle] = useState(null);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [reports, setReports] = useState({});
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [jobPollInterval, setJobPollInterval] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/feed`)
//       .then((res) => setArticles(res.data.articles))
//       .catch((err) => console.error("Failed to load feed", err));
//   }, []);

//   const parseReport = (text) => {
//     if (!text) return { table: null, rewrite: null };
//     const lowerText = text.toLowerCase();
//     const gapStart = lowerText.indexOf("seo gap report");
//     const rewriteStart = lowerText.indexOf("✅ recommended rewrite".toLowerCase());
//     if (gapStart === -1 || rewriteStart === -1) return { table: null, rewrite: text };
//     const table = text.substring(gapStart + 15, rewriteStart).trim();
//     const rewrite = text.substring(rewriteStart + 26).trim();
//     return { table, rewrite };
//   };

//   const renderMarkdownTable = (markdown) => {
//     if (!markdown) return <p>No SEO Gap Report available.</p>;
//     const lines = markdown.trim().split("\n").filter(Boolean);
//     const header = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
//     const rows = lines.slice(2).map((line) =>
//       line.split("|").map((cell) => cell.trim()).filter(Boolean)
//     );
//     return (
//       <div style={{ overflowX: "auto", marginTop: "10px" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
//           <thead>
//             <tr style={{ background: "#f3f4f6" }}>
//               {header.map((cell, i) => (
//                 <th key={i} style={{ padding: "8px", border: "1px solid #e5e7eb", fontWeight: 600 }}>{cell}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, rowIdx) => (
//               <tr key={rowIdx}>
//                 {row.map((cell, i) => (
//                   <td key={i} style={{ padding: "8px", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap" }}>{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const handleAnalyzeDeepSeek = async (url, idx) => {
//     setExpandedIndex(idx);
//     setLoadingIndex(idx);
//     setReports((prev) => ({ ...prev, [idx]: { status: "queued" } }));

//     try {
//       const res = await axios.post(`${API_BASE}/analyze-url-deepseek-job`, { url });
//       const { jobId } = res.data;

//       const interval = setInterval(async () => {
//         const statusRes = await axios.get(`${API_BASE}/analyze-url-deepseek-status?jobId=${jobId}`);
//         const { status, result, error } = statusRes.data.data;

//         if (status === "completed") {
//           clearInterval(interval);
//           const parsed = parseReport(result);
//           setReports((prev) => ({
//             ...prev,
//             [idx]: { ...parsed, modelUsed: "deepseek", status: "completed" },
//           }));
//           setLoadingIndex(null);
//         }

//         if (status === "failed") {
//           clearInterval(interval);
//           setReports((prev) => ({
//             ...prev,
//             [idx]: { error: error || "Analysis failed", status: "failed" },
//           }));
//           setLoadingIndex(null);
//         }
//       }, 5000);

//       setJobPollInterval(interval);
//     } catch (err) {
//       setReports((prev) => ({
//         ...prev,
//         [idx]: { error: "❌ Failed to submit analysis job" },
//       }));
//       setLoadingIndex(null);
//     }
//   };

//   return (
//     <div style={{ background: '#f9fafb', padding: '16px', fontFamily: 'sans-serif' }}>
//       <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//         <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>🧠 SEO GAP ANALYZER</h1>
//         <p style={{ fontSize: '14px', color: '#6b7280' }}>Analyze article URLs and identify content gaps</p>
//       </div>

//       <div style={{ maxWidth: '1280px', margin: 'auto' }}>
//         <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               if (customURL) {
//                 setCustomArticle({ title: "Custom URL", link: customURL });
//                 handleAnalyzeDeepSeek(customURL, "custom");
//               }
//             }}
//             style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}
//           >
//             <input
//               type="text"
//               placeholder="Paste article URL here..."
//               value={customURL}
//               onChange={(e) => setCustomURL(e.target.value)}
//               style={{
//                 flex: 1,
//                 padding: '10px',
//                 borderRadius: '6px',
//                 border: '1px solid #e5e7eb',
//                 fontSize: '14px'
//               }}
//             />
//             <button type="submit" style={{ padding: '10px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
//               Search
//             </button>
//           </form>

//           {customArticle && (
//             <>
//               <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>🔍 Custom URL</h3>
//               <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" }}>
//                 <div style={{ marginBottom: "6px" }}>
//                   <a href={customArticle.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
//                     {customArticle.link}
//                   </a>
//                 </div>
//                 <button
//                   onClick={() => handleAnalyzeDeepSeek(customArticle.link, "custom")}
//                   style={{ padding: '8px 12px', background: '#e0e7ff', borderRadius: '6px', fontWeight: '600', color: '#3730a3', border: 'none', cursor: 'pointer' }}
//                 >
//                   Analyze with DeepSeek
//                 </button>

//                 {expandedIndex === "custom" && (
//                   <div style={{ marginTop: '16px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
//                     {loadingIndex === "custom" ? (
//                       <p style={{ fontStyle: "italic", color: "#6b7280" }}>⏳ Processing with DeepSeek...</p>
//                     ) : (
//                       <>
//                         {reports["custom"]?.error ? (
//                           <p style={{ color: "red" }}>{reports["custom"].error}</p>
//                         ) : (
//                           <>
//                             <h4 style={{ fontWeight: "700", color: "#4b5563" }}>📊 SEO GAP REPORT</h4>
//                             {renderMarkdownTable(reports["custom"].table)}

//                             <h4 style={{ marginTop: "16px", fontWeight: "700", color: "#4b5563" }}>✍️ Recommended Rewrite</h4>
//                             <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', border: '1px solid #eee', whiteSpace: 'pre-wrap' }}>
//                               {reports["custom"].rewrite || "No rewrite found."}
//                             </div>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', margin: '20px 0 12px' }}>📰 Latest Articles</h2>
//           <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//             {articles.map((item, idx) => (
//               <li key={idx} style={{ borderBottom: "1px solid #f3f4f6", padding: "12px 0" }}>
//                 <div className="article-title" style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
//                 <div className="article-url" style={{ marginBottom: '6px' }}>
//                   <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
//                     {item.link}
//                   </a>
//                 </div>
//                 <div className="article-date" style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
//                   🕒 {item.pubDate ? new Date(item.pubDate).toLocaleString() : "Date not available"}
//                 </div>

//                 <button
//                   onClick={() => handleAnalyzeDeepSeek(item.link, idx)}
//                   style={{ padding: '8px 12px', background: '#e0e7ff', borderRadius: '6px', fontWeight: '600', color: '#3730a3', border: 'none', cursor: 'pointer' }}
//                 >
//                   Analyze with DeepSeek
//                 </button>

//                 {expandedIndex === idx && (
//                   <div style={{ marginTop: '16px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
//                     {loadingIndex === idx ? (
//                       <p style={{ fontStyle: "italic", color: "#6b7280" }}>⏳ Processing with DeepSeek...</p>
//                     ) : (
//                       <>
//                         {reports[idx]?.error ? (
//                           <p style={{ color: "red" }}>{reports[idx].error}</p>
//                         ) : (
//                           <>
//                             <h4 style={{ fontWeight: "700", color: "#4b5563" }}>📊 SEO GAP REPORT</h4>
//                             {renderMarkdownTable(reports[idx].table)}

//                             <h4 style={{ marginTop: "16px", fontWeight: "700", color: "#4b5563" }}>✍️ Recommended Rewrite</h4>
//                             <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', border: '1px solid #eee', whiteSpace: 'pre-wrap' }}>
//                               {reports[idx].rewrite || "No rewrite found."}
//                             </div>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;




















// import React from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import "./App.css"; // Optional: your sidebar styles

// const App = () => {
//   const location = useLocation();

//   const navLinks = [
//     { label: "Analyze Article", path: "/analyze-article" },
//     { label: "Analyze Article Saved Reports", path: "/saved-reports" },

//     { label: "Pre-Publish Article Analyze", path: "/prepublish" },
//     { label: "Pre-Publish Article Saved Report", path: "/prepublishreport" },
    
//     // { label: "GSC Queries", path: "/gsc" },
//     // { label: "GSC Insights", path: "/gsc/insight" },
//     // { label: "DeepSeek Saved", path: "/saved" },
    
//     { label: "GSC AI Reports", path: "/gsc/ai-reports" },
//     { label: "Content Refresh", path: "/gsc/content-refresh" },
//     { label: "Low CTR Fixes", path: "/gsc/low-ctr" },
//     { label: "Ranking Watchdog", path: "/gsc/ranking-watchdog" },
//     { label: "Content-Query Match", path: "/gsc/content-query-match" },
//     { label: "Trending Keywords", path: "/gsc/trending-keywords" },

//     { label: "Article Summaries", path: "/article-summaries" },
//     { label: "Chatbot", path: "/chatbot" },
//     { label: "Smart Rewrite", path: "/journalist-rewrite" },
//   ];

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Sidebar */}
//       <aside
//         style={{
//           width: "250px",
//           background: "#1F2937",
//           color: "white",
//           padding: "20px",
//           overflowY: "auto",
//         }}
//       >
//         <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>🚀 Dashboard</h2>
//         <nav>
//           <ul style={{ listStyle: "none", padding: 0 }}>
//             {navLinks.map(({ label, path }) => (
//               <li key={path} style={{ marginBottom: "10px" }}>
//                 <Link
//                   to={path}
//                   style={{
//                     color: location.pathname === path ? "#FBBF24" : "white",
//                     textDecoration: "none",
//                     fontWeight: location.pathname === path ? "bold" : "normal",
//                   }}
//                 >
//                   {label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main style={{ flex: 1, padding: "20px", background: "#F3F4F6", overflowY: "auto" }}>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default App;
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Analyze Article", path: "/analyze-article" },
    { label: "Analyze Article Saved Reports", path: "/saved-reports" },
    { label: "Pre-Publish Article Analyze", path: "/prepublish" },
    { label: "Pre-Publish Article Saved Report", path: "/prepublishreport" },
    { label: "Article Summaries", path: "/article-summaries" },
    { label: "Chatbot", path: "/chatbot" },
    { label: "Smart Rewrite", path: "/journalist-rewrite" },
    { label: "Prompt Console", path: "/prompt-console" },
    { label: "GSC AI Reports", path: "/gsc/ai-reports" },
    { label: "Content Refresh", path: "/gsc/content-refresh" },
    { label: "Low CTR Fixes", path: "/gsc/low-ctr" },
    { label: "Ranking Watchdog", path: "/gsc/ranking-watchdog" },
    { label: "Content-Query Match", path: "/gsc/content-query-match" },
    { label: "Trending Keywords", path: "/gsc/trending-keywords" },
    { label: "Hindi GSC Reports", path: "/hindi-gsc-reports" },
    { label: "Hindi Content Refresh", path: "/hindi-content-refresh" },
    { label: "Hindi Low CTR Fixes", path: "/hindi-low-ctr" },
    { label: "Hindi Ranking Watchdog", path: "/hindi-ranking-watchdog" },
    { label: "Hindi Content Query Match", path: "/hindi-content-query-match" },
    { label: "🚗 Automobile News OpenAI", path: "/automobile-news-openai" },
    { label: "🚙 Car News OpenAI", path: "/car-news-openai" },
    { label: "🏷️ Brand Car News OpenAI", path: "/brand-car-news-openai" },
  ];

  return (
    <>
      {/* Hamburger (mobile only) */}
      <button className="hamburger" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </button>

      <div className="layout-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <h2>🚀 Dashboard</h2>
          
          <ul>
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
