// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:5000/api";
// // const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";


// function DeepSeekReports() {
//   const [reports, setReports] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedReport, setSelectedReport] = useState(null);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     const res = await axios.get(`${API_BASE}/deepseek-reports`);
//     setReports(res.data.data);
//   };

//   const handleSelectReport = async (id) => {
//     const res = await axios.get(`${API_BASE}/deepseek-reports/${id}`);
//     setSelectedReport(res.data.data);
//   };

//   const filtered = reports.filter(r => r.url.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="container">
//       <h2>📚 Past DeepSeek SEO Reports</h2>

//       <input
//         type="text"
//         placeholder="Search by URL..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
//       />

//       <ul>
//         {filtered.map((report) => (
//           <li key={report.id} style={{ marginBottom: "10px" }}>
//             <strong>#{report.id}</strong> - {report.url}
//             <button onClick={() => handleSelectReport(report.id)} style={{ marginLeft: "10px" }}>
//               View Report
//             </button>
//           </li>
//         ))}
//       </ul>

//       {selectedReport && (
//         <div className="report-output">
//           <h3>Report for: {selectedReport.url}</h3>
//           <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem" }}>
//             {selectedReport.result}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeepSeekReports;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeepSeekReports.css"; // Styling for tables + cards

// const API_BASE = "http://localhost:5000/api";
const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function DeepSeekReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  console.log(selectedReport,"seeeeeeeeeee")

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get(`${API_BASE}/deepseek-reports`);
    setReports(res.data.data);
  };

  const handleSelectReport = async (id) => {
    const res = await axios.get(`${API_BASE}/deepseek-reports/${id}`);
    setSelectedReport(res.data.data);
  };

  const filtered = reports.filter((r) =>
    r.url.toLowerCase().includes(search.toLowerCase())
  );

const parseReport = (text) => {
  if (!text) return { tableMarkdown: null, rewrite: "" };

  const lines = text.split("\n");

  const tableStart = lines.findIndex(line =>
    line.toLowerCase().includes("| section") && line.includes("|")
  );

  if (tableStart === -1) return { tableMarkdown: null, rewrite: text };

  const tableLines = [];
  for (let i = tableStart; i < lines.length; i++) {
    if (!lines[i].includes("|")) break;
    tableLines.push(lines[i]);
  }

  const tableMarkdown = tableLines.join("\n").trim();
  const rewrite = lines.slice(tableStart + tableLines.length).join("\n").trim();

  return { tableMarkdown, rewrite };
};


const renderMarkdownTable = (markdown) => {
  if (!markdown) return <p>No SEO GAP Report found.</p>;

  const lines = markdown.trim().split("\n").filter(Boolean);
  const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map(line =>
    line.split("|").map(cell => cell.trim()).filter(Boolean)
  );

  return (
    <div className="table-wrapper">
      <table className="seo-table-markdown">
        <thead>
          <tr>{headers.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ whiteSpace: 'pre-wrap' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



  return (
    <div className="report-container">
      <h2 className="report-title">📚 Saved DeepSeek SEO Reports</h2>

      <input
        type="text"
        placeholder="🔍 Search by URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="report-list">
        {filtered.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-meta">
              <span className="report-id">#{report.id}</span>
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="report-url"
              >
                {report.url}
              </a>
            </div>
            <button
              className="view-btn"
              onClick={() => handleSelectReport(report.id)}
            >
              View Report
            </button>
          </div>
        ))}
      </div>

{selectedReport && (
  <div className="report-output">
    <h3 className="report-subtitle">📝 SEO Report</h3>
    <p className="report-url-title">{selectedReport.url}</p>

    {renderMarkdownTable(parseReport(selectedReport.result).tableMarkdown)}

    <h4>✍️ Recommended Rewrite</h4>
    <pre className="report-content">
      {parseReport(selectedReport.result).rewrite}
    </pre>
  </div>
)}
    </div>
  );
}

export default DeepSeekReports;
