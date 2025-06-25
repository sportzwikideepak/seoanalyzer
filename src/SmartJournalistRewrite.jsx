// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DOMPurify from "dompurify";

// const API_BASE = "http://localhost:5000/api";

// // Helper: Clean markdown and format as HTML
// function formatArticle(raw) {
//   if (!raw) return "";
//   return raw
//     .replace(/[*#_`~>-]+/g, "") // remove markdown symbols
//     .replace(/\n{2,}/g, "</p><p>") // double line breaks = new paragraph
//     .replace(/\n/g, " ") // single line = space
//     .replace(/^/, "<p>") // open paragraph
//     .replace(/$/, "</p>"); // close paragraph
// }

// function SmartJournalistRewrite() {
//   const [articles, setArticles] = useState([]);
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [rewritten, setRewritten] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/feed`)
//       .then((res) => setArticles(res.data.articles))
//       .catch((err) => console.error("Failed to load articles", err));
//   }, []);

//   const handleSmartRewrite = async (article, idx) => {
//     setLoadingIndex(idx);
//     setRewritten(null);

//     try {
//       const res = await axios.post(`${API_BASE}/smart-journalist-rewrite`, {
//         url: article.link,
//         keyword: article.title.split(" ").slice(0, 5).join(" "),
//       });

//       if (res.data.success) {
//         setRewritten(res.data.data);
//       } else {
//         setRewritten("❌ Rewrite failed. Try again.");
//       }
//     } catch (err) {
//       console.error("Rewrite error:", err.message);
//       setRewritten("❌ Rewrite failed.");
//     }

//     setLoadingIndex(null);
//   };

//   return (
//     <div style={{ background: "#f9fafb", padding: "16px", fontFamily: "sans-serif" }}>
//       <div style={{ textAlign: "center", marginBottom: "32px" }}>
//         <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#4f46e5" }}>
//           🧠 Smart Cricket Journalist Rewriter
//         </h1>
//         <p style={{ fontSize: "14px", color: "#6b7280" }}>
//           Click an article below to auto-rewrite it in expert style
//         </p>
//       </div>

//       <div style={{ maxWidth: "1280px", margin: "auto" }}>
//         <div
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//           }}
//         >
//           {articles.map((article, idx) => (
//             <div
//               key={idx}
//               style={{
//                 borderBottom: "1px solid #eee",
//                 padding: "16px 0",
//                 marginBottom: "8px",
//               }}
//             >
//               <h3 style={{ fontWeight: "600" }}>{article.title}</h3>
//               <a
//                 href={article.link}
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#2563eb", textDecoration: "underline" }}
//               >
//                 {article.link}
//               </a>
//               <div style={{ marginTop: "8px" }}>
//                 <button
//                   onClick={() => handleSmartRewrite(article, idx)}
//                   disabled={loadingIndex === idx}
//                   style={{
//                     background: "#4f46e5",
//                     color: "white",
//                     padding: "8px 16px",
//                     borderRadius: "6px",
//                     border: "none",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {loadingIndex === idx ? "Rewriting..." : "Smart Rewrite"}
//                 </button>
//               </div>

//               {loadingIndex === idx && (
//                 <p style={{ fontStyle: "italic", color: "#6b7280" }}>
//                   ⏳ Smart rewriting in progress...
//                 </p>
//               )}
//             </div>
//           ))}

//           {rewritten && (
//             <div
//               style={{
//                 marginTop: "24px",
//                 background: "#f9fafb",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 border: "1px solid #e5e7eb",
//                 maxHeight: "600px",
//                 overflowY: "auto",
//               }}
//             >
//               <h4
//                 style={{
//                   fontWeight: "700",
//                   color: "#4b5563",
//                   marginBottom: "12px",
//                   fontSize: "18px",
//                 }}
//               >
//                 📰 Rewritten Article
//               </h4>

//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: DOMPurify.sanitize(formatArticle(rewritten)),
//                 }}
//                 style={{ lineHeight: "1.7", color: "#1f2937", fontSize: "15px" }}
//               />

//               <button
//                 onClick={() => navigator.clipboard.writeText(rewritten)}
//                 style={{
//                   marginTop: "12px",
//                   background: "#10b981",
//                   color: "#fff",
//                   padding: "6px 12px",
//                   borderRadius: "6px",
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 📋 Copy Article
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SmartJournalistRewrite;

















import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function formatArticle(raw) {
  if (!raw) return "";
  return raw
    .replace(/\*\*/g, "")
    .replace(/[*#_`~>-]+/g, "")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, " ")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

function SmartJournalistRewrite() {
  const [articles, setArticles] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [rewritten, setRewritten] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/feed`)
      .then((res) => setArticles(res.data.articles))
      .catch((err) => console.error("Failed to load articles", err));
  }, []);

  const handleSmartRewrite = async (article, idx) => {
    setLoadingIndex(idx);
    setRewritten(null);
    try {
      const res = await axios.post(`${API_BASE}/smart-journalist-rewrite`, {
        url: article.link,
        keyword: article.title.split(" ").slice(0, 5).join(" "),
      });
      if (res.data.success) {
        setRewritten(res.data.rewrittenArticle);
      } else {
        setRewritten("❌ Rewrite failed. Try again.");
      }
    } catch (err) {
      console.error("Rewrite error:", err.message);
      setRewritten("❌ Rewrite failed.");
    }
    setLoadingIndex(null);
  };

  return (
    <div style={{ background: "#f9fafb", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}>
          🧠 Smart Cricket Journalist Rewriter
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Tap an article to auto-rewrite it in expert style
        </p>
      </div>

      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {articles.map((article, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #eee",
                padding: "16px 0",
              }}
            >
              <h3 style={{ fontWeight: "600", fontSize: "16px" }}>{article.title}</h3>
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb", wordBreak: "break-all", fontSize: "14px" }}
              >
                {article.link}
              </a>
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={() => handleSmartRewrite(article, idx)}
                  disabled={loadingIndex === idx}
                  style={{
                    background: "#4f46e5",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "200px",
                  }}
                >
                  {loadingIndex === idx ? "Rewriting..." : "Smart Rewrite"}
                </button>
              </div>

              {loadingIndex === idx && (
                <p style={{ fontStyle: "italic", color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>
                  ⏳ Smart rewriting in progress...
                </p>
              )}
            </div>
          ))}

          {rewritten && (
            <div
              style={{
                marginTop: "24px",
                background: "#f9fafb",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <h4
                style={{
                  fontWeight: "700",
                  color: "#4b5563",
                  marginBottom: "12px",
                  fontSize: "16px",
                }}
              >
                📰 Rewritten Article
              </h4>

              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(formatArticle(rewritten)),
                }}
                style={{ lineHeight: "1.6", color: "#1f2937", fontSize: "15px" }}
              />

              <button
                onClick={() => navigator.clipboard.writeText(rewritten)}
                style={{
                  marginTop: "12px",
                  background: "#10b981",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                📋 Copy Article
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmartJournalistRewrite;
