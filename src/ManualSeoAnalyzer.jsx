import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function ManualSeoAnalyzer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [urlSlug, setUrlSlug] = useState("");
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const parseReport = (text) => {
    if (!text) return { table: null, rewrite: "" };
    const lower = text.toLowerCase();
    const gapStart = lower.indexOf("seo gap report");
    const rewriteStart = lower.indexOf("✅ recommended rewrite".toLowerCase());
    if (gapStart === -1 || rewriteStart === -1) return { table: null, rewrite: text };
    const table = text.slice(gapStart + 15, rewriteStart).trim();
    const rewrite = text.slice(rewriteStart + 26).trim();
    return { table, rewrite };
  };

  const renderMarkdownTable = (markdown) => {
    if (!markdown) return <p>No SEO GAP Report found.</p>;
    const lines = markdown.split("\n").filter(Boolean);
    const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map((line) =>
      line.split("|").map((cell) => cell.trim()).filter(Boolean)
    );
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {headers.map((cell, i) => (
                <th key={i} style={{ padding: "8px", border: "1px solid #e5e7eb", fontWeight: 600 }}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "8px", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/manual-seo-job`, {
        title,
        description,
        body,
        url: urlSlug,
      });
      const jobId = res.data.jobId;
      setJobId(jobId);

      const pollInterval = setInterval(async () => {
        const statusRes = await axios.get(`${API_BASE}/manual-seo-status?jobId=${jobId}`);
        const { status, result, error } = statusRes.data.data;

        if (status === "completed") {
          clearInterval(pollInterval);
          setResult(parseReport(result));
          setLoading(false);
        }

        if (status === "failed") {
          clearInterval(pollInterval);
          setError(error || "Analysis failed");
          setLoading(false);
        }
      }, 5000);
    } catch (err) {
      setError("❌ Failed to submit job");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>Manual SEO Analyze</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Analyze content before publishing</p>
      </div>

      <div style={{ maxWidth: '800px', margin: 'auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
          <input
            type="text"
            placeholder="Meta Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
          <textarea
            placeholder="Body Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', resize: 'vertical' }}
          />
          <input
            type="text"
            placeholder="Pre-publish URL slug (e.g. /ind-vs-pak-preview)"
            value={urlSlug}
            onChange={(e) => setUrlSlug(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
          <button
            type="submit"
            style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '600' }}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Your Content And Get Suggestions"}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', color: 'red' }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4b5563' }}>📊 SEO GAP REPORT</h3>
            {renderMarkdownTable(result.table)}

            <h3 style={{ marginTop: '20px', fontSize: '16px', fontWeight: '700', color: '#4b5563' }}>✍️ Recommended Rewrite</h3>
            <pre style={{ background: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid #eee' }}>
              {result.rewrite || "No rewrite content found."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualSeoAnalyzer;
