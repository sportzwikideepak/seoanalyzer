import React, { useEffect, useState } from "react";
import "./FunnyCommentary.css";

// ✅ Update this if needed
const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function FunnyCommentaryDeepSeek({ matchId = "88324", inningNumber = 1}) {
  const [deepseekData, setDeepseekData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ Component mounted with:", matchId, inningNumber);
    fetchDeepSeek();
    const interval = setInterval(fetchDeepSeek, 10000); // every 10 sec
    return () => clearInterval(interval);
  }, [matchId, inningNumber]);

  const fetchDeepSeek = async () => {
    const url = `${API_BASE}/funny-commentary/${matchId}/${inningNumber}?provider=deepseek`;
    console.log("📡 Fetching from:", url);

    try {
      const response = await fetch(url);
      const result = await response.json();

      const commentaries = result?.response?.commentaries || [];

      if (commentaries.length > 0) {
        const sorted = [...commentaries]
          .sort((a, b) => {
            const aVal = parseFloat(`${a.over}.${a.ball}`);
            const bVal = parseFloat(`${b.over}.${b.ball}`);
            return bVal - aVal; // newest first
          })
          .slice(0, 6) // latest 6 only
          .sort((a, b) => {
            const aVal = parseFloat(`${a.over}.${a.ball}`);
            const bVal = parseFloat(`${b.over}.${b.ball}`);
            return aVal - bVal; // restore order
          });

        console.log("✅ DeepSeek commentary loaded:", sorted);
        setDeepseekData(sorted);
      } else {
        console.warn("⚠️ No commentary found in response.");
        setDeepseekData([]);
      }
    } catch (err) {
      console.error("❌ DeepSeek Fetch Error:", err);
      setDeepseekData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="funny-commentary-container">
      <h2>🧠 DeepSeek Funny Commentary</h2>

      {loading ? (
        <p>⏳ Loading commentary...</p>
      ) : deepseekData.length === 0 ? (
        <p>😕 No commentary available yet.</p>
      ) : (
        deepseekData.map((item, idx) => (
          <div key={idx} className="commentary-card">
            <h4>Over {item.over}.{item.ball}</h4>
            <p>{item.commentary || item.text || "😶 No content found."}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FunnyCommentaryDeepSeek;


// import React, { useEffect, useState } from "react";
// import "./FunnyCommentary.css";

// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

// function FunnyCommentarySelector({ matchId = "88324", inningNumber = 1 }) {
//   const [provider, setProvider] = useState("openai"); // Default provider
//   const [commentary, setCommentary] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("✅ Mounted with match:", matchId, "inning:", inningNumber);
//     fetchCommentary();

//     const interval = setInterval(fetchCommentary, 10000); // 10 sec
//     return () => clearInterval(interval);
//   }, [matchId, inningNumber, provider]);

//   const fetchCommentary = async () => {
//     const url = `${API_BASE}/funny-commentary/${matchId}/${inningNumber}?provider=${provider}`;
//     console.log("📡 Fetching:", url);
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       const raw = data?.response?.commentaries || [];

//       const sorted = [...raw]
//         .sort((a, b) => parseFloat(`${a.over}.${a.ball}`) - parseFloat(`${b.over}.${b.ball}`))
//         .slice(-6); // Latest 6

//       setCommentary(sorted);
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       setCommentary([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="funny-commentary-container">
//       <h2>🎙️ Funny Commentary Generator</h2>

//       <div className="provider-selector">
//         <label>Select Commentary Source: </label>
//         <select value={provider} onChange={(e) => setProvider(e.target.value)}>
//           <option value="openai">🤖 OpenAI</option>
//           <option value="deepseek">🧠 DeepSeek</option>
//         </select>
//       </div>

//       {loading ? (
//         <p>⏳ Loading commentary...</p>
//       ) : commentary.length === 0 ? (
//         <p>😕 No commentary available yet.</p>
//       ) : (
//         commentary.map((item, idx) => (
//           <div key={idx} className="commentary-card">
//             <h4>Over {item.over}.{item.ball}</h4>
//             <p>{item.commentary || item.text || "😶 No content."}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default FunnyCommentarySelector;
