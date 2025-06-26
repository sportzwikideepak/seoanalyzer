import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

// const API_BASE = "http://localhost:5000/api";


export default function PromptConsole() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [history, setHistory] = useState([]);

  // Load active prompt + history on mount
  useEffect(() => {
    axios.get(`${API_BASE}/prompts/active`).then(({ data }) => {
      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    });
    axios.get(`${API_BASE}/prompts`).then(({ data }) => setHistory(data));
  }, []);

  // Save & Activate
  const saveAndActivate = async () => {
    if (!content.trim()) return alert("Content is required");
    await axios.post(`${API_BASE}/prompts`, {
      title: title || "Untitled",
      content,
      activate: true,
    });
    // refresh
    const [{ data: active }, { data: all }] = await Promise.all([
      axios.get(`${API_BASE}/prompts/active`),
      axios.get(`${API_BASE}/prompts`),
    ]);
    setTitle(active.title);
    setContent(active.content);
    setHistory(all);
    alert("Prompt saved and activated!");
  };

  // Activate an old prompt
  const activateOld = async (id) => {
    await axios.patch(`${API_BASE}/prompts/${id}/activate`);
    const { data } = await axios.get(`${API_BASE}/prompts/active`);
    setTitle(data.title);
    setContent(data.content);
    setHistory((h) =>
      h.map((p) =>
        p.id === id ? { ...p, is_active: 1 } : { ...p, is_active: 0 }
      )
    );
  };

  return (
    <div style={{ background: "#f9fafb", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#4f46e5" }}>
          📝 Prompt Console
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Create and activate your AI rewrite prompts
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: "auto", background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: 16 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Prompt title"
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              marginBottom: 12,
            }}
          />
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write prompt here… use {{body}} & {{keyword}}"
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          <button
            onClick={saveAndActivate}
            style={{
              marginTop: 12,
              background: "#4f46e5",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            💾 Save & Activate
          </button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#374151", margin: "24px 0 12px" }}>
          🔄 Previous Prompts
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((p) => (
            <li key={p.id} style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
              <span style={{ flex: 1 }}>{p.title}</span>
              {p.is_active ? (
                <span style={{ color: "green", fontWeight: "bold" }}>(active)</span>
              ) : (
                <button
                  onClick={() => activateOld(p.id)}
                  style={{
                    background: "#e0e7ff",
                    color: "#3730a3",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Activate
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
