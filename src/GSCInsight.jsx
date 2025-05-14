// import React, { useState } from "react";
// import axios from "axios";

// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api"; // Update if needed

// function GSCInsight() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [insight, setInsight] = useState("");
//   const [error, setError] = useState("");

//   const handleAnalyze = async (e) => {
//     e.preventDefault();
//     if (!url.trim()) return;

//     setLoading(true);
//     setInsight("");
//     setError("");

//     try {
//       const res = await axios.get(`${API_BASE}/gsc/insight`, {
//         params: { url },
//       });

//       if (res.data.success) {
//         setInsight(res.data.data);
//       } else {
//         setError("Something went wrong.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("❌ Failed to fetch SEO insight.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>🧠 Smart SEO Insight (GSC + AI)</h2>

//       <form onSubmit={handleAnalyze} className="input-section">
//         <input
//           type="text"
//           placeholder="Paste your article/page URL..."
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button type="submit">Analyze</button>
//       </form>

//       {loading && <p className="loading">⏳ Generating SEO report...</p>}
//       {error && <p className="error">{error}</p>}

//       {insight && (
//         <div className="insight-report">
//           <h4>📊 Insight Report</h4>
//           <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: "1rem", borderRadius: "8px" }}>
//             {insight}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GSCInsight;




import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

// const API_BASE = "http://localhost:5000/api";


function GSCInsight() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState("");
  const [error, setError] = useState("");
  const [modelUsed, setModelUsed] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setInsight("");
    setError("");
    setModelUsed("openai");

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

  const handleAnalyzeDeepSeek = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setInsight("");
    setError("");
    setModelUsed("deepseek");

    try {
      const res = await axios.get(`${API_BASE}/gsc/insight-deepseek`, {
        params: { url },
      });

      if (res.data.success) {
        setInsight(res.data.data);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch DeepSeek SEO insight.");
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
        <button type="submit">Analyze with OpenAI</button>
        <button type="button" onClick={handleAnalyzeDeepSeek} style={{ marginLeft: '10px' }}>
          Analyze with DeepSeek
        </button>
      </form>

      {loading && <p className="loading">⏳ Generating SEO report...</p>}
      {error && <p className="error">{error}</p>}

      {insight && (
        <div className="insight-report">
          <h4>📊 Insight Report ({modelUsed === "deepseek" ? "DeepSeek" : "OpenAI"})</h4>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f7f7f7",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            {insight}
          </pre>
        </div>
      )}
    </div>
  );
}

export default GSCInsight;
