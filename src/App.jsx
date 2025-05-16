











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";

// // const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";
// const API_BASE = 'http://localhost:5000/api'; // Uncomment for local testing

// function App() {
//   const [articles, setArticles] = useState([]);
//   const [customURL, setCustomURL] = useState("");
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [reports, setReports] = useState({});
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [selectedModel, setSelectedModel] = useState("openai");

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

//     if (gapStart === -1 || rewriteStart === -1) {
//       return { table: null, rewrite: text }; // fallback
//     }

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

//   const handleAnalyze = async (url, idx, model = "openai") => {
//     setSelectedModel(model);
//     setExpandedIndex(idx);
//     setLoadingIndex(idx);
//     setReports((prev) => ({ ...prev, [idx]: null }));

//     try {
//       const endpoint =
//         model === "deepseek" ? "/analyze-url-deepseek" : "/analyze-url";

//       const res = await axios.get(`${API_BASE}${endpoint}?url=${encodeURIComponent(url)}`);
//       const parsed = parseReport(res.data.seo_report);

//       setReports((prev) => ({
//         ...prev,
//         [idx]: { ...res.data, ...parsed, modelUsed: model },
//       }));
//     } catch (err) {
//       setReports((prev) => ({
//         ...prev,
//         [idx]: { error: "❌ Failed to analyze this article." },
//       }));
//     } finally {
//       setLoadingIndex(null);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>🧠 SEO GAP ANALYZER</h1>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (customURL) handleAnalyze(customURL, -1, "openai");
//         }}
//         className="input-section"
//       >
//         <input
//           type="text"
//           placeholder="Paste article URL here..."
//           value={customURL}
//           onChange={(e) => setCustomURL(e.target.value)}
//         />
//         <button type="submit">Analyze with OpenAI</button>
//         <button type="button" onClick={() => handleAnalyze(customURL, -1, "deepseek")}>
//           Analyze with DeepSeek
//         </button>
//       </form>

//       <h2>📰 Latest Articles</h2>
//       <ul className="article-list">
//         {articles.map((item, idx) => (
//           <li key={idx} className="article-item">
//             <div className="article-title">{item.title}</div>
//             <div className="article-url">
//               <a href={item.link} target="_blank" rel="noopener noreferrer">
//                 {item.link}
//               </a>
//             </div>
//             <div className="article-date">
//               🕒 {item.pubDate ? new Date(item.pubDate).toLocaleString() : "Date not available"}
//             </div>

//             <button onClick={() => handleAnalyze(item.link, idx, "openai")}>
//               Analyze with OpenAI
//             </button>
//             <button onClick={() => handleAnalyze(item.link, idx, "deepseek")} style={{ marginLeft: "10px" }}>
//               Analyze with DeepSeek
//             </button>

//             {expandedIndex === idx && (
//               <div className="dropdown">
//                 {loadingIndex === idx ? (
//                   <p className="loading">⏳ Processing... please wait...</p>
//                 ) : (
//                   reports[idx] && (
//                     <>
//                       {reports[idx].error ? (
//                         <p className="error">{reports[idx].error}</p>
//                       ) : (
//                         <>
//                           <h4>
//                             📊 SEO GAP REPORT ({reports[idx].modelUsed === "deepseek" ? "DeepSeek" : "OpenAI"})
//                           </h4>
//                           {renderMarkdownTable(reports[idx].table)}

//                           <h4>✍️ Recommended Rewrite</h4>
//                           <div className="rewrite">
//                             {reports[idx].rewrite || "No rewrite found."}
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )
//                 )}
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

















import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";
// const API_BASE = "http://localhost:5000/api"; // Use this for local dev

function App() {
  const [articles, setArticles] = useState([]);
  const [customURL, setCustomURL] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [reports, setReports] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [jobPollInterval, setJobPollInterval] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/feed`)
      .then((res) => setArticles(res.data.articles))
      .catch((err) => console.error("Failed to load feed", err));
  }, []);

  const parseReport = (text) => {
    if (!text) return { table: null, rewrite: null };

    const lowerText = text.toLowerCase();
    const gapStart = lowerText.indexOf("seo gap report");
    const rewriteStart = lowerText.indexOf("✅ recommended rewrite".toLowerCase());

    if (gapStart === -1 || rewriteStart === -1) {
      return { table: null, rewrite: text }; // fallback
    }

    const table = text.substring(gapStart + 15, rewriteStart).trim();
    const rewrite = text.substring(rewriteStart + 26).trim();
    return { table, rewrite };
  };

  const renderMarkdownTable = (markdown) => {
    if (!markdown) return <p>No SEO Gap Report available.</p>;

    const lines = markdown.trim().split("\n").filter(Boolean);
    const header = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map((line) =>
      line.split("|").map((cell) => cell.trim()).filter(Boolean)
    );

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

  const handleAnalyzeDeepSeek = async (url, idx) => {
    setExpandedIndex(idx);
    setLoadingIndex(idx);
    setReports((prev) => ({ ...prev, [idx]: { status: "queued" } }));

    try {
      const res = await axios.post(`${API_BASE}/analyze-url-deepseek-job`, { url });
      const { jobId } = res.data;

      const interval = setInterval(async () => {
        const statusRes = await axios.get(`${API_BASE}/analyze-url-deepseek-status?jobId=${jobId}`);
        const { status, result, error } = statusRes.data.data;

        if (status === "completed") {
          clearInterval(interval);
          const parsed = parseReport(result);
          setReports((prev) => ({
            ...prev,
            [idx]: { ...parsed, modelUsed: "deepseek", status: "completed" },
          }));
          setLoadingIndex(null);
        }

        if (status === "failed") {
          clearInterval(interval);
          setReports((prev) => ({
            ...prev,
            [idx]: { error: error || "Analysis failed", status: "failed" },
          }));
          setLoadingIndex(null);
        }
      }, 5000);

      setJobPollInterval(interval);
    } catch (err) {
      setReports((prev) => ({
        ...prev,
        [idx]: { error: "❌ Failed to submit analysis job" },
      }));
      setLoadingIndex(null);
    }
  };

  return (
    <div className="container">
      <h1>🧠 SEO GAP ANALYZER (DeepSeek Job Based)</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (customURL) handleAnalyzeDeepSeek(customURL, -1);
        }}
        className="input-section"
      >
        <input
          type="text"
          placeholder="Paste article URL here..."
          value={customURL}
          onChange={(e) => setCustomURL(e.target.value)}
        />
        <button type="submit">Analyze with DeepSeek</button>
      </form>

      <h2>📰 Latest Articles</h2>
      <ul className="article-list">
        {articles.map((item, idx) => (
          <li key={idx} className="article-item">
            <div className="article-title">{item.title}</div>
            <div className="article-url">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            </div>
            <div className="article-date">
              🕒 {item.pubDate ? new Date(item.pubDate).toLocaleString() : "Date not available"}
            </div>

            <button onClick={() => handleAnalyzeDeepSeek(item.link, idx)}>
              Analyze with DeepSeek
            </button>

            {expandedIndex === idx && (
              <div className="dropdown">
                {loadingIndex === idx && <p className="loading">⏳ Processing with DeepSeek...</p>}

                {reports[idx] && reports[idx].status === "completed" && (
                  <>
                    <h4>📊 SEO GAP REPORT (DeepSeek)</h4>
                    {renderMarkdownTable(reports[idx].table)}

                    <h4>✍️ Recommended Rewrite</h4>
                    <div className="rewrite">
                      {reports[idx].rewrite || "No rewrite found."}
                    </div>
                  </>
                )}

                {reports[idx] && reports[idx].error && (
                  <p className="error">{reports[idx].error}</p>
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
