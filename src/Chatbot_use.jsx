import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://localhost:5000/chat", { question });
      setResponse(res.data);
    } catch (err) {
      setResponse({ source: "error", answer: "❌ Error getting response." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        className="chatbot-container"
        style={{
          background: "white",
          maxWidth: "720px",
          margin: "auto",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4f46e5",
            fontSize: "24px",
            fontWeight: "800",
            marginBottom: "16px",
          }}
        >
          🤖 EduBot (AI Cricket Assistant)
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something like 'Virat Kohli'..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <button
            onClick={ask}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 16px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Ask
          </button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            🧠 Thinking...
          </p>
        )}

        {response && (
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "15px",
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            <p style={{ marginBottom: "12px", fontWeight: "600" }}>
              {response.source.toUpperCase()} BOT:
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: response.answer
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br />"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
