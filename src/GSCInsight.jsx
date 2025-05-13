import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api"; // Update if needed

function GSCInsight() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setInsight("");
    setError("");

    try {
      const res = await axios.get(`${API_BASE}/gsc/insight`, {
        params: { url },
      });

      if (res.data.success) {
        setInsight(res.data.data);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch SEO insight.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🧠 Smart SEO Insight (GSC + AI)</h2>

      <form onSubmit={handleAnalyze} className="input-section">
        <input
          type="text"
          placeholder="Paste your article/page URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>

      {loading && <p className="loading">⏳ Generating SEO report...</p>}
      {error && <p className="error">{error}</p>}

      {insight && (
        <div className="insight-report">
          <h4>📊 Insight Report</h4>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: "1rem", borderRadius: "8px" }}>
            {insight}
          </pre>
        </div>
      )}
    </div>
  );
}

export default GSCInsight;
