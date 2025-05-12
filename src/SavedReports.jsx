// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// // const API_BASE = 'https://hammerhead-app-jkdit.ondigitalocean.app/api'; // Update if needed
// const API_BASE = 'http://localhost:5000/api'; // Update if needed

// function SavedReports() {
//   const [reports, setReports] = useState([]);
//   console.log(reports,"reportsdataaaaaaaaaaaaa")
//   const [searchUrl, setSearchUrl] = useState('');
//   const [searchResult, setSearchResult] = useState(null);

//   useEffect(() => {
//     axios.get(`${API_BASE}/reports-json`)
//       .then(res => setReports(res.data.data || []))
//       .catch(err => console.error('Error fetching reports', err));
//   }, []);

//   const parseSection = (text, start, end) => {
//     const s = text.indexOf(start);
//     const e = text.indexOf(end);
//     return s !== -1 && e !== -1 ? text.substring(s + start.length, e).trim() : null;
//   };

//   const parseRewrite = (text) => {
//     const start = text.indexOf('✅ RECOMMENDED REWRITE');
//     if (start === -1) return null;
//     const block = text.substring(start + 26).trim();
//     const title = block.match(/Title:\s*(.+)/i)?.[1]?.trim() || '';
//     const meta = block.match(/Meta:\s*(.+)/i)?.[1]?.trim() || '';
//     const body = block.split(/Body:\s*/i)?.[1]?.trim() || '';
//     return { title, meta, body };
//   };

//   const parseReport = (text) => {
//     return {
//       gap: parseSection(text, '📊 SEO GAP REPORT', '📝 WRITING PATTERN ANALYSIS'),
//       rewrite: parseRewrite(text)
//     };
//   };

//   const renderMarkdownTable = (markdown) => {
//     if (!markdown) return <p>No SEO Gap Report found.</p>;
//     const lines = markdown.split('\n').filter(Boolean);
//     const header = lines[0].split('|').map(h => h.trim()).filter(Boolean);
//     const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
//     return (
//       <table className="seo-table-markdown">
//         <thead><tr>{header.map((cell, i) => <th key={i}>{cell}</th>)}</tr></thead>
//         <tbody>
//           {rows.map((row, rowIdx) => (
//             <tr key={rowIdx}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchUrl.trim()) return;

//     try {
//       const res = await axios.get(`${API_BASE}/reports-json/search?url=${encodeURIComponent(searchUrl)}`);
//       if (res.data.success) {
//         setSearchResult(res.data.data);
//       } else {
//         setSearchResult({ error: res.data.message || 'No data found' });
//       }
//     } catch (err) {
//       setSearchResult({ error: 'Search failed. Please try again.' });
//     }
//   };

//   return (
//     <div className="container">
//       <h1>📁 Saved SEO Reports</h1>

//       <form className="input-section" onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search by URL..."
//           value={searchUrl}
//           onChange={(e) => setSearchUrl(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>

//       {searchResult && (
//         <div className="report-card">
//           {searchResult.error ? (
//             <p>{searchResult.error}</p>
//           ) : (
//             <div>
//               <h3>{searchResult.title}</h3>
//               <div className="article-url">{searchResult.url}</div>
//               {(() => {
//                 const parsed = parseReport(searchResult.full_gpt_text);
//                 return (
//                   <>
//                     <h4>📊 SEO GAP REPORT</h4>
//                     {renderMarkdownTable(parsed.gap)}
//                     <h4>✍️ Recommended Rewrite</h4>
//                     <p><b>Title:</b> {parsed.rewrite?.title}</p>
//                     <p><b>Meta:</b> {parsed.rewrite?.meta}</p>
//                     <div className="rewrite">{parsed.rewrite?.body}</div>
//                   </>
//                 );
//               })()}
//             </div>
//           )}
//         </div>
//       )}

//       <h2>📝 Latest 5 Reports</h2>
//       <ul className="article-list">
//         {reports.map((item, idx) => {
//           const parsed = parseReport(item.full_gpt_text);
//           return (
//             <li key={idx} className="article-item">
//               <div className="article-title">{item.title}</div>
//               <div className="article-url">{item.url}</div>
//               <h4>📊 SEO GAP REPORT</h4>
//               {renderMarkdownTable(parsed.gap)}
//               <h4>✍️ Recommended Rewrite</h4>
//               <p><b>Title:</b> {parsed.rewrite?.title}</p>
//               <p><b>Meta:</b> {parsed.rewrite?.meta}</p>
//               <div className="rewrite">{parsed.rewrite?.body}</div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

// export default SavedReports;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function SavedReports() {
  const [reports, setReports] = useState([]);
  const [searchUrl, setSearchUrl] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/reports-json`)
      .then((res) => setReports(res.data.data || []))
      .catch((err) => console.error("Error fetching reports", err));
  }, []);

  const parseSection = (text, start, end) => {
    const s = text.indexOf(start);
    const e = text.indexOf(end);
    return s !== -1 && e !== -1
      ? text.substring(s + start.length, e).trim()
      : null;
  };

  const parseRewrite = (text) => {
    const blockStart = text.indexOf("✅ RECOMMENDED REWRITE");
    if (blockStart === -1) return { title: "", meta: "", body: text.trim() };

    const block = text.substring(blockStart + 26).trim();

    const titleMatch = block.match(/\*\*Title:\*\*\s*(.+)/i);
    const metaMatch =
      block.match(/\*\*Meta Description:\*\*\s*(.+)/i) ||
      block.match(/\*\*Meta:\*\*\s*(.+)/i);
    const bodyStart = block.search(/\*\*Body:\*\*/i);

    const title = titleMatch?.[1]?.trim() || "";
    const meta = metaMatch?.[1]?.trim() || "";
    const body = bodyStart !== -1 ? block.substring(bodyStart + 9).trim() : "";

    return { title, meta, body };
  };

  const parseReport = (text) => {
    return {
      gap: parseSection(
        text,
        "📊 SEO GAP REPORT",
        "📝 WRITING PATTERN ANALYSIS"
      ),
      rewrite: parseRewrite(text),
    };
  };

  const renderMarkdownTable = (markdown) => {
    if (!markdown) return <p>No SEO Gap Report found.</p>;
    const lines = markdown.split("\n").filter(Boolean);
    const header = lines[0]
      .split("|")
      .map((h) => h.trim())
      .filter(Boolean);
    const rows = lines.slice(2).map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
    );
    return (
      <table className="seo-table-markdown">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUrl.trim()) return;

    try {
      const res = await axios.get(
        `${API_BASE}/reports-json/search?url=${encodeURIComponent(searchUrl)}`
      );
      if (res.data.success) {
        setSearchResult(res.data.data);
      } else {
        setSearchResult({ error: res.data.message || "No data found" });
      }
    } catch (err) {
      setSearchResult({ error: "Search failed. Please try again." });
    }
  };

  return (
    <div className="container">
      <h1>📁 Saved SEO Reports</h1>

      <form className="input-section" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by URL..."
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {searchResult && (
        <div className="report-card">
          {searchResult.error ? (
            <p>{searchResult.error}</p>
          ) : (
            <div>
              <h3>{searchResult.title}</h3>
              <div className="article-url">{searchResult.url}</div>
              {(() => {
                const parsed = parseReport(searchResult.full_gpt_text);
                return (
                  <>
                    <h4>📊 SEO GAP REPORT</h4>
                    {renderMarkdownTable(parsed.gap)}
                    <h4>✍️ Recommended Rewrite</h4>
                    <p>
                      <b>Title:</b> {parsed.rewrite?.title}
                    </p>
                    <p>
                      <b>Meta:</b> {parsed.rewrite?.meta}
                    </p>
                    <div className="rewrite">{parsed.rewrite?.body}</div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      <h2>📝 Latest 5 Reports</h2>
      <ul className="article-list">
        {/* {reports.map((item, idx) => {
          const parsed = parseReport(item.full_gpt_text);
          return (
            <li key={idx} className="article-item">
              <div className="article-title">{item.title}</div>
              <div className="article-url">{item.url}</div>
              <h4>📊 SEO GAP REPORT</h4>
              {renderMarkdownTable(parsed.gap)}
              <h4>✍️ Recommended Rewrite</h4>
              <p><b>Title:</b> {parsed.rewrite?.title}</p>
              <p><b>Meta:</b> {parsed.rewrite?.meta}</p>
              <div className="rewrite">{parsed.rewrite?.body}</div>
            </li>
          );
        })} */}

        {reports.map((item, idx) => {
          const parsed = parseReport(item.full_gpt_text);
          const dateObj = new Date(item.published_date); // <-- parse date
          const formattedDate = dateObj.toLocaleString("en-IN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          return (
            <li key={idx} className="article-item">
              <div className="article-title">{item.title}</div>
              <div className="article-url">{item.url}</div>
              <div className="article-date">🕒 {formattedDate}</div>{" "}
              {/* Display the time */}
              <h4>📊 SEO GAP REPORT</h4>
              {renderMarkdownTable(parsed.gap)}
              <h4>✍️ Recommended Rewrite</h4>
              <p>
                <b>Title:</b> {parsed.rewrite?.title}
              </p>
              <p>
                <b>Meta:</b> {parsed.rewrite?.meta}
              </p>
              <div className="rewrite">{parsed.rewrite?.body}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SavedReports;
