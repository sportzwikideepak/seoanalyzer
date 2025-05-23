import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FunnyCommentary.css";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";
// const API_BASE = "http://localhost:5000/api";

function FunnyCommentaryCompareBox({ matchId = "12345", inningNumber = 1 }) {
  const [openaiData, setOpenaiData] = useState([]);
  const [deepseekData, setDeepseekData] = useState([]);

  useEffect(() => {
    fetchBoth();
    const interval = setInterval(fetchBoth, 15000);
    return () => clearInterval(interval);
  }, [matchId, inningNumber]);

  const fetchBoth = async () => {
    try {
      const [openaiRes, deepseekRes] = await Promise.all([
        axios.get(`${API_BASE}/funny-commentary/${matchId}/${inningNumber}?provider=openai`),
        axios.get(`${API_BASE}/funny-commentary/${matchId}/${inningNumber}?provider=deepseek`)
      ]);

      setOpenaiData(openaiRes.data.commentaries || []);
      setDeepseekData(deepseekRes.data.commentaries || []);
    } catch (err) {
      console.error("❌ Error fetching commentary:", err.message);
    }
  };

  const mergeByOverBall = () => {
    const combined = {};
    openaiData.forEach((item) => {
      const key = `${item.over}.${item.ball}`;
      combined[key] = { over: item.over, ball: item.ball, openai: item.commentary || item.text };
    });
    deepseekData.forEach((item) => {
      const key = `${item.over}.${item.ball}`;
      if (!combined[key]) combined[key] = { over: item.over, ball: item.ball };
      combined[key].deepseek = item.commentary || item.text;
    });

    return Object.values(combined).sort((a, b) => {
      const aVal = parseFloat(`${a.over}.${a.ball}`);
      const bVal = parseFloat(`${b.over}.${b.ball}`);
      return aVal - bVal;
    });
  };

  const mergedCommentary = mergeByOverBall();

  return (
    <div className="funny-commentary-container">
      <h2>⚡ Funny Commentary (OpenAI vs DeepSeek)</h2>

      {mergedCommentary.map((item, idx) => (
        <div key={idx} className="dual-commentary-box">
          <h4>🟢 Over {item.over}.{item.ball}</h4>
          <div className="dual-box-wrapper">
            <div className="dual-box openai-box">
              <strong>🤖 OpenAI:</strong>
              <p>{item.openai || "⏳ Waiting..."}</p>
            </div>
            <div className="dual-box deepseek-box">
              <strong>🧠 DeepSeek:</strong>
              <p>{item.deepseek || "⏳ Waiting..."}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FunnyCommentaryCompareBox;
