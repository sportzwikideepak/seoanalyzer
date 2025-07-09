/* ------------------------------------------------------------------------
   TranslatePublishArticle.jsx
   ------------------------------------------------------------------------
   • Lists the latest articles from /api/feed
   • Lets an editor paste any custom URL
   • Calls /api/translate-url-deepseek to get a Hindi version
   • Displays the Hindi text in an expandable panel
   --------------------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";            // you already have basic styles here

// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";
const API_BASE = "http://localhost:5000/api";


export default function TranslatePublishArticle() {
  /* ───────────────────── state ──────────────────────────────── */
  const [articles, setArticles] = useState([]);
  const [customURL, setCustomURL] = useState("");
  const [customResult, setCustomResult] = useState(null);

  const [expanded, setExpanded] = useState(null);   // idx | "custom"
  const [loading,  setLoading]  = useState(null);   // idx | "custom"
  const [hindiMap, setHindiMap] = useState({});     // { idx : hindi }

  /* ───────────────────── fetch RSS once ─────────────────────── */
  useEffect(() => {
    axios.get(`${API_BASE}/feed`)
      .then(res => setArticles(res.data.articles))
      .catch(err => console.error("Feed load error:", err));
  }, []);

  /* ───────────────────── DeepSeek call ──────────────────────── */
  const translate = async (url, key) => {
    setExpanded(key);
    setLoading(key);
    try {
      const { data } = await axios.post(
        `${API_BASE}/translate-url-deepseek`,
        { url }
      );

      if (key === "custom") setCustomResult(data.hindi);
      else setHindiMap(prev => ({ ...prev, [key]: data.hindi }));
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      if (key === "custom") setCustomResult(`❌ ${msg}`);
      else setHindiMap(prev => ({ ...prev, [key]: `❌ ${msg}` }));
    } finally {
      setLoading(null);
    }
  };

  /* ───────────────────── helper ─────────────────────────────── */
  const HindiPanel = ({ text }) => (
    <div
      style={{
        background: "#fff",
        padding: "12px",
        borderRadius: "6px",
        fontSize: "15px",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
        border: "1px solid #e5e7eb"
      }}
    >
      {text}
    </div>
  );

  /* ───────────────────── render ─────────────────────────────── */
  return (
    <div style={{ background: "#f9fafb", padding: "16px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#4f46e5" }}>
          🌐 English → Hindi Converter
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Pick a CricketAddictor article (or paste any URL) and get a polished Hindi draft.
        </p>
      </header>

      <div style={{ maxWidth: "1280px", margin: "auto" }}>
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,.1)"
          }}
        >

          {/* ─────────────── custom URL box ─────────────── */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!customURL.trim()) return;
              translate(customURL.trim(), "custom");
            }}
            style={{ display: "flex", gap: "12px", marginBottom: "20px" }}
          >
            <input
              type="text"
              placeholder="Paste article URL …"
              value={customURL}
              onChange={e => setCustomURL(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "14px"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Translate
            </button>
          </form>

          {expanded === "custom" && (
            <div style={{ marginTop: "12px" }}>
              {loading === "custom"
                ? <p style={{ fontStyle: "italic", color: "#6b7280" }}>⌛ Translating …</p>
                : <HindiPanel text={customResult || "—"} />}
            </div>
          )}

          {/* ─────────────── feed list ─────────────── */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#374151",
              margin: "20px 0 12px"
            }}
          >
            📰 Latest CricketAddictor Articles
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {articles.map((a, idx) => (
              <li
                key={idx}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                  padding: "12px 0"
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {a.title}
                </div>
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  {a.link}
                </a>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "8px"
                  }}
                >
                  🕒{" "}
                  {a.pubDate
                    ? new Date(a.pubDate).toLocaleString()
                    : "—"}
                </div>

                <button
                  onClick={() => translate(a.link, idx)}
                  style={{
                    padding: "8px 12px",
                    background: "#e0e7ff",
                    borderRadius: "6px",
                    fontWeight: "600",
                    color: "#3730a3",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Convert to Hindi
                </button>

                {expanded === idx && (
                  <div style={{ marginTop: "12px" }}>
                    {loading === idx
                      ? <p style={{ fontStyle: "italic", color: "#6b7280" }}>⌛ Translating …</p>
                      : <HindiPanel text={hindiMap[idx]} />}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
