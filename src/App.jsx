





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://hammerhead-app-jkdit.ondigitalocean.app/api';
// const API_BASE = 'http://localhost:5000/api'; // Uncomment for local testing

function App() {
  const [articles, setArticles] = useState([]);
  const [customURL, setCustomURL] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [reports, setReports] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/feed`)
      .then((res) => setArticles(res.data.articles))
      .catch((err) => console.error('Failed to load feed', err));
  }, []);

  const parseReport = (text) => {
    if (!text) return { table: null, rewrite: null };

    const lowerText = text.toLowerCase();
    const gapStart = lowerText.indexOf('seo gap report');
    const rewriteStart = lowerText.indexOf('✅ recommended rewrite'.toLowerCase());

    if (gapStart === -1 || rewriteStart === -1) {
      return { table: null, rewrite: text }; // fallback
    }

    const table = text.substring(gapStart + 15, rewriteStart).trim();
    const rewrite = text.substring(rewriteStart + 26).trim();
    return { table, rewrite };
  };

  const renderMarkdownTable = (markdown) => {
    if (!markdown) return <p>No SEO Gap Report available.</p>;

    const lines = markdown.trim().split('\n').filter(Boolean);
    const header = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));

    return (
      <table className="seo-table-markdown">
        <thead>
          <tr>{header.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, i) => <td key={i}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleAnalyze = async (url, idx) => {
    setExpandedIndex(idx);
    setLoadingIndex(idx);
    setReports(prev => ({ ...prev, [idx]: null }));

    try {
      const res = await axios.get(`${API_BASE}/analyze-url?url=${encodeURIComponent(url)}`);
      const parsed = parseReport(res.data.seo_report);
      setReports(prev => ({ ...prev, [idx]: { ...res.data, ...parsed } }));
    } catch (err) {
      setReports(prev => ({ ...prev, [idx]: { error: '❌ Failed to analyze this article.' } }));
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="container">
      <h1>🧠 SEO GAP ANALYZER</h1>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (customURL) handleAnalyze(customURL, -1);
      }} className="input-section">
        <input
          type="text"
          placeholder="Paste article URL here..."
          value={customURL}
          onChange={(e) => setCustomURL(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>

      <h2>📰 Latest Articles</h2>
      <ul className="article-list">
        {articles.map((item, idx) => (
          <li key={idx} className="article-item">
            <div className="article-title">{item.title}</div>
            <div className="article-url">{item.link}</div>
            <button onClick={() => handleAnalyze(item.link, idx)}>Analyze</button>

            {expandedIndex === idx && (
              <div className="dropdown">
                {loadingIndex === idx && <p className="loading">⏳ Processing... please wait...</p>}
                {!loadingIndex && reports[idx] && (
                  <>
                    {reports[idx].error ? (
                      <p className="error">{reports[idx].error}</p>
                    ) : (
                      <>
                        <h4>📊 SEO GAP REPORT</h4>
                        {renderMarkdownTable(reports[idx].table)}

                        <h4>✍️ Recommended Rewrite</h4>
                        <div className="rewrite">{reports[idx].rewrite || 'No rewrite found.'}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const API_BASE = 'https://hammerhead-app-jkdit.ondigitalocean.app/api'; // Update if needed

// function App() {
//   const [articles, setArticles] = useState([]);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchResult, setSearchResult] = useState(null);
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   useEffect(() => {
//     axios.get(`${API_BASE}/reports`)
//       .then(res => {
//         if (res.data.success) {
//           setArticles(res.data.reports);
//         }
//       })
//       .catch(err => console.error('Failed to load reports', err));
//   }, []);

//   const renderMarkdownTable = (markdown) => {
//     if (!markdown) return <p>No SEO Gap Report available.</p>;

//     const lines = markdown.trim().split('\n').filter(Boolean);
//     const header = lines[0].split('|').map(h => h.trim()).filter(Boolean);
//     const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));

//     return (
//       <table className="seo-table-markdown">
//         <thead>
//           <tr>{header.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
//         </thead>
//         <tbody>
//           {rows.map((row, rowIdx) => (
//             <tr key={rowIdx}>
//               {row.map((cell, i) => <td key={i}>{cell}</td>)}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchInput.trim()) return;

//     try {
//       const res = await axios.get(`${API_BASE}/reports/search?url=${encodeURIComponent(searchInput)}`);
//       if (res.data.success) {
//         setSearchResult(res.data.report);
//       }
//     } catch (err) {
//       console.error('Search failed:', err);
//       setSearchResult({ error: 'No result found.' });
//     }
//   };

//   return (
//     <div className="container">
//       <h1>🧠 SEO GAP ANALYZER</h1>

//       <form className="input-section" onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search by URL..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>

//       {searchResult && (
//         <div className="search-result">
//           {searchResult.error ? (
//             <p>{searchResult.error}</p>
//           ) : (
//             <div className="article-item">
//               <div className="article-title">{searchResult.title}</div>
//               <div className="article-url">{searchResult.url}</div>
//               <h4>📊 SEO GAP REPORT</h4>
//               {renderMarkdownTable(searchResult.table_text)}
//               <h4>✍️ Recommended Rewrite</h4>
//               <div className="rewrite">{searchResult.rewrite_text}</div>
//             </div>
//           )}
//         </div>
//       )}

//       <h2>📚 All Saved Reports</h2>
//       <ul className="article-list">
//         {articles.map((item, idx) => (
//           <li key={idx} className="article-item">
//             <div className="article-title">{item.title}</div>
//             <div className="article-url">{item.url}</div>
//             <button onClick={() => setExpandedIndex(idx === expandedIndex ? null : idx)}>
//               {expandedIndex === idx ? 'Hide' : 'Show Report'}
//             </button>
//             {expandedIndex === idx && (
//               <div className="dropdown">
//                 <h4>📊 SEO GAP REPORT</h4>
//                 {renderMarkdownTable(item.table_text)}
//                 <h4>✍️ Recommended Rewrite</h4>
//                 <div className="rewrite">{item.rewrite_text || 'No rewrite available.'}</div>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
