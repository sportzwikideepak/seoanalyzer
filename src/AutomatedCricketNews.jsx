

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

// const PAGE = 25;

// export default function AutomatedCricketNews() {
//   const [stored, setStored] = useState([]);
//   const [processed, setProcessed] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState("stored");
//   const [busy, setBusy] = useState({});
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [sp, setSp] = useState(1);
//   const [pp, setPp] = useState(1);
//   const [stp, setStp] = useState(1);
//   const [ptp, setPtp] = useState(1);
//   const [stc, setStc] = useState(0);
//   const [ptc, setPtc] = useState(0);

//   // --- SIMPLE FIX for timezone ---
//   const fmt = (v) => {
//     console.log(" fmt function input:", v);
//     if (!v) return { date: "-", time: "-" };
    
//     // Extract time directly from the string
//     const timeMatch = v.match(/T(\d{2}):(\d{2}):(\d{2})/);
//     if (timeMatch) {
//       const [, hours, minutes] = timeMatch;
//       const hour24 = parseInt(hours);
//       const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
//       const ampm = hour24 >= 12 ? 'pm' : 'am';
//       const formattedTime = `${hour12}:${minutes} ${ampm}`;
      
//       console.log(`⏰ Direct time extraction: ${v} → ${formattedTime}`);
      
//       return {
//         date: new Date(v).toLocaleDateString("en-IN"),
//         time: formattedTime,
//       };
//     }
    
//     return { date: "-", time: "-" };
//   };

//   const getPub = (row) => row.published_at_iso ?? row.published_at;
//   const getProc = (row) => row.processed_at_iso ?? row.processed_at;

//   // --- fetchers ---
//   const fetchStored = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * PAGE;
//       const r = await axios.get(
//         `${API}/api/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setStored(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setStc(total);
//         setStp(Math.max(1, Math.ceil(total / PAGE)));
//         setSp(page);
//         console.log("📰 Fetched stored news:", r.data.news?.length, "articles");
//       }
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProcessed = async (page = 1) => {
//     try {
//       const offset = (page - 1) * PAGE;
//       const r = await axios.get(
//         `${API}/api/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setProcessed(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setPtc(total);
//         setPtp(Math.max(1, Math.ceil(total / PAGE)));
//         setPp(page);
//         console.log("✅ Fetched processed news:", r.data.news?.length, "articles");
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     console.log(" Component mounted");
//     console.log(" Current system time:", new Date().toLocaleString("en-IN"));
//     fetchStored(1);
//     fetchProcessed(1);
//   }, []);

//   const gen = async (id) => {
//     setBusy((m) => ({ ...m, [id]: true }));
//     try {
//       const r = await axios.post(`${API}/api/articles/${id}/generate`);
//       if (!r.data?.success) throw new Error(r.data?.error || "Failed");
//       await fetchStored(sp);
//       await fetchProcessed(pp);
//       alert("✅ Article generated.");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setBusy((m) => ({ ...m, [id]: false }));
//     }
//   };

//   const manualFetch = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${API}/api/manual-fetch-news`);
//       await fetchStored(1);
//       setSp(1);
//       alert("News fetched.");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
//       <div style={{ textAlign: "center", marginBottom: 24 }}>
//         <h1> Continuous Cricket News</h1>
//         <p>24/7 News Fetching & One-Click Article Generation</p>
//         <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//           Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
//         <button
//           onClick={() => setTab("stored")}
//           style={{ padding: "10px 16px", background: tab === "stored" ? "#007bff" : "#f3f4f6", color: tab === "stored" ? "#fff" : "#333" }}
//         >
//           Stored News ({stc})
//         </button>
//         <button
//           onClick={() => setTab("processed")}
//           style={{ padding: "10px 16px", background: tab === "processed" ? "#28a745" : "#f3f4f6", color: tab === "processed" ? "#fff" : "#333" }}
//         >
//           ✅ Processed Articles ({ptc})
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
//         <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }}>
//           {loading ? "⏳ Refreshing…" : "🔄 Refresh All"}
//         </button>
//         <button disabled={loading} onClick={manualFetch}>
//           {loading ? "⏳ Fetching…" : "📰 Fetch New News"}
//         </button>
//       </div>

//       {tab === "stored" ? (
//         <div>
//           <h2>Latest Stored News (Page {sp} of {stp})</h2>
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {stored.map((a) => {
//               const { date, time } = fmt(getPub(a));
//               const isBusy = !!busy[a.id];
//               return (
//                 <div key={a.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{ flex: 1, paddingRight: 12 }}>
//                     <div 
//                       style={{ 
//                         fontWeight: 700, 
//                         marginBottom: 6, 
//                         color: "#007bff", 
//                         cursor: "pointer",
//                         textDecoration: "underline"
//                       }}
//                       onClick={() => {
//                         if (a.source_url) {
//                           window.open(a.source_url, '_blank', 'noopener,noreferrer');
//                         } else {
//                           alert('No source URL available');
//                         }
//                       }}
//                     >
//                       {a.title}
//                     </div>
//                     <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12 }}>
//                       <span>📅 {date}</span>
//                       <span>🕒 {time}</span>
//                       <span>{a.source_name}</span>
//                       {typeof a.word_count === "number" && <span>📝 {a.word_count} words</span>}
//                       {a.processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ Processed</span> : null}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => gen(a.id)}
//                     disabled={isBusy}
//                     style={{ padding: "10px 14px", background: isBusy ? "#95a5a6" : "#00b894", color: "#fff", border: "none", borderRadius: 8 }}
//                   >
//                     {isBusy ? "⏳ Generating…" : "🧠 Generate Article (AI)"}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//           <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
//         </div>
//       ) : (
//         <div>
//           <h2>✅ Processed Articles (Page {pp} of {ptp})</h2>
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {processed.map((a) => {
//               const { date, time } = fmt(getProc(a));
//               const title = a.final_title || a.title;
//               const meta  = a.final_meta || "";
//               const slug  = a.final_slug || "article";

//               return (
//                 <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                     <div style={{ fontWeight: 700 }}>{title}</div>
//                     <div style={{ fontSize: 12, color: "#666" }}>
//                       <div>Processed: {date} {time}</div>
//                       <div>📰 {a.source_name}</div>
//                     </div>
//                   </div>

//                   <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
//                     <div><strong>Meta Title:</strong> {title}</div>
//                     {meta && <div><strong>Meta Description:</strong> {meta}</div>}
//                     {slug && <div><strong>Slug:</strong> {slug}</div>}
//                   </div>

//                   <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//                     <button onClick={() => navigator.clipboard.writeText(a.ready_article || "")}>📋 Copy Full HTML</button>
//                     <button onClick={() => {
//                       const blob = new Blob([a.ready_article || ""], { type: "text/html" });
//                       const url = URL.createObjectURL(blob);
//                       const aTag = document.createElement("a");
//                       aTag.href = url;
//                       aTag.download = `${slug}.html`;
//                       aTag.click();
//                       URL.revokeObjectURL(url);
//                     }}>💾 Download HTML</button>
//                   </div>

//                   <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
//                     <iframe title={`preview-${a.id}`} srcDoc={a.ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <Pager page={pp} total={ptp} totalCount={ptc} onChange={fetchProcessed} />
//         </div>
//       )}
//     </div>
//   );
// }

// function Pager({ page, total, totalCount, onChange }) {
//   const nums = [];
//   const max = 5;
//   let s = Math.max(1, page - Math.floor(max / 2));
//   let e = Math.min(total, s + max - 1);
//   if (e - s + 1 < max) s = Math.max(1, e - max + 1);
//   for (let i = s; i <= e; i++) nums.push(i);

//   return (
//     <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
//       <button disabled={page===1} onClick={() => onChange(1)}>First</button>
//       <button disabled={page===1} onClick={() => onChange(page-1)}>Prev</button>
//       {nums.map((n) => (
//         <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal" }}>{n}</button>
//       ))}
//       <button disabled={page===total} onClick={() => onChange(page+1)}>Next</button>
//       <button disabled={page===total} onClick={() => onChange(total)}>Last</button>
//       <span style={{ marginLeft: 8, color: "#666" }}>Page {page} of {total} ({totalCount})</span>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

// const API = "http://localhost:5000";


const PAGE = 25;

export default function AutomatedCricketNews() {
  const [stored, setStored] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});
  const [regenerating, setRegenerating] = useState({});

  const [sp, setSp] = useState(1);
  const [pp, setPp] = useState(1);
  const [stp, setStp] = useState(1);
  const [ptp, setPtp] = useState(1);
  const [stc, setStc] = useState(0);
  const [ptc, setPtc] = useState(0);

  // Format timestamp
  const fmt = (v) => {
    if (!v) return { date: "-", time: "-" };
    const timeMatch = v.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      const hour24 = parseInt(hours);
      const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
      const ampm = hour24 >= 12 ? 'pm' : 'am';
      return {
        date: new Date(v).toLocaleDateString("en-IN"),
        time: `${hour12}:${minutes} ${ampm}`,
      };
    }
    return { date: "-", time: "-" };
  };

  const getPub = (row) => row.published_at_iso ?? row.published_at;
  const getProc = (row) => row.processed_at_iso ?? row.processed_at;

  // Fetch stored news
  const fetchStored = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setStored(r.data.news || []);
        setStc(r.data.totalCount || 0);
        setStp(Math.max(1, Math.ceil((r.data.totalCount || 0) / PAGE)));
        setSp(page);
        console.log("📰 Fetched stored news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch processed news
  const fetchProcessed = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessed(r.data.news || []);
        setPtc(r.data.totalCount || 0);
        setPtp(Math.max(1, Math.ceil((r.data.totalCount || 0) / PAGE)));
        setPp(page);
        console.log("✅ Fetched processed news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("🚀 Component mounted");
    console.log("🕒 Current system time:", new Date().toLocaleString("en-IN"));
    fetchStored(1);
    fetchProcessed(1);
  }, []);

  // Generate article with DeepSeek 4-Step Pipeline
  const gen = async (id) => {
    setBusy((m) => ({ ...m, [id]: true }));
    try {
      console.log(`🧠 Generating article ${id} with 4-Step Pipeline...`);
      const r = await axios.post(`${API}/api/articles/${id}/generate?use4Step=true`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      
      console.log("✅ Article generated:", r.data);
      await fetchStored(sp);
      await fetchProcessed(pp);
      
      alert(`✅ Article generated successfully!\n\n📊 Pipeline: ${r.data.pipeline}\n⏱️ Time: ${(r.data.metadata?.processingTime / 1000).toFixed(2)}s\n📉 Plagiarism: ${r.data.metadata?.plagiarismScore}`);
    } catch (e) {
      console.error("❌ Generation error:", e);
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  };

  // Regenerate with OpenAI GPT-4
  const regenerateOpenAI = async (id) => {
    setRegenerating((m) => ({ ...m, [id]: true }));
    try {
      console.log(`🎨 Regenerating article ${id} with OpenAI GPT-5...`);
      const r = await axios.post(`${API}/api/articles/${id}/regenerate-openai`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      
      console.log("✅ Article regenerated:", r.data);
      await fetchProcessed(pp);
      
      alert(`🎨 Article regenerated with OpenAI GPT-5!\n\n📊 Style: ${r.data.metadata?.style}\n🤖 Model: ${r.data.metadata?.model}\n⏱️ Time: ${(r.data.metadata?.processingTime / 1000).toFixed(2)}s\n📉 Plagiarism: ${r.data.metadata?.plagiarismScore}`);
    } catch (e) {
      console.error("❌ Regeneration error:", e);
      alert(e.response?.data?.error || e.message);
    } finally {
      setRegenerating((m) => ({ ...m, [id]: false }));
    }
  };

  // Manual fetch new news
  const manualFetch = async () => {
    setLoading(true);
    try {
      console.log("📰 Manually fetching new news...");
      await axios.post(`${API}/api/manual-fetch-news`);
      await fetchStored(1);
      setSp(1);
      alert("📰 News fetched successfully from GNews!");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, label = "HTML") => {
    navigator.clipboard.writeText(text || "")
      .then(() => alert(`✅ ${label} copied to clipboard!`))
      .catch(() => alert("❌ Failed to copy"));
  };

  // Download HTML file
  const downloadHTML = (html, filename) => {
    const blob = new Blob([html || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = `${filename}.html`;
    aTag.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>🏏 Automated Cricket News Generator</h1>
        <p style={styles.subtitle}>
          24/7 GNews Fetching • 4-Step DeepSeek Pipeline • OpenAI GPT-5 Regeneration
        </p>
        <div style={styles.systemInfo}>
          🕒 {new Date().toLocaleString("en-IN")} | 🌐 API: {API}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setTab("stored")}
          style={{
            ...styles.tab,
            ...(tab === "stored" ? styles.tabActive : styles.tabInactive)
          }}
        >
          📰 Stored News ({stc})
        </button>
        <button
          onClick={() => setTab("processed")}
          style={{
            ...styles.tab,
            ...(tab === "processed" ? styles.tabActiveGreen : styles.tabInactive)
          }}
        >
          ✅ Processed Articles ({ptc})
        </button>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          disabled={loading}
          onClick={() => { fetchStored(sp); fetchProcessed(pp); }}
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "⏳ Refreshing…" : "🔄 Refresh All"}
        </button>
        <button
          disabled={loading}
          onClick={manualFetch}
          style={{
            ...styles.button,
            ...styles.buttonSuccess,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "⏳ Fetching…" : "📰 Fetch New News from GNews"}
        </button>
      </div>

      {/* Content Area */}
      {tab === "stored" ? (
        <StoredNewsTab
          stored={stored}
          sp={sp}
          stp={stp}
          stc={stc}
          busy={busy}
          gen={gen}
          fmt={fmt}
          getPub={getPub}
          fetchStored={fetchStored}
        />
      ) : (
        <ProcessedNewsTab
          processed={processed}
          pp={pp}
          ptp={ptp}
          ptc={ptc}
          regenerating={regenerating}
          regenerateOpenAI={regenerateOpenAI}
          fmt={fmt}
          getProc={getProc}
          copyToClipboard={copyToClipboard}
          downloadHTML={downloadHTML}
          fetchProcessed={fetchProcessed}
        />
      )}
    </div>
  );
}

/* ========== STORED NEWS TAB ========== */
function StoredNewsTab({ stored, sp, stp, stc, busy, gen, fmt, getPub, fetchStored }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📰 Latest Stored News (Page {sp} of {stp})</h2>
      <div style={styles.cardContainer}>
        {stored.map((a) => {
          const { date, time } = fmt(getPub(a));
          const isBusy = !!busy[a.id];
          
          return (
            <div key={a.id} style={styles.card}>
              <div style={styles.cardContent}>
                <div
                  style={styles.cardTitle}
                  onClick={() => {
                    if (a.source_url) {
                      window.open(a.source_url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  {a.title}
                </div>
                <div style={styles.cardMeta}>
                  <span>📅 {date}</span>
                  <span>🕒 {time}</span>
                  <span>📰 {a.source_name}</span>
                  {typeof a.word_count === "number" && <span>📝 {a.word_count} words</span>}
                  {a.processed && <span style={styles.badgeSuccess}>✅ Processed</span>}
                </div>
              </div>
              <button
                onClick={() => gen(a.id)}
                disabled={isBusy}
                style={{
                  ...styles.button,
                  ...styles.buttonGenerate,
                  ...(isBusy ? styles.buttonDisabled : {})
                }}
              >
                {isBusy ? "⏳ Generating…" : "🧠 Generate Article"}
              </button>
            </div>
          );
        })}
      </div>
      <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
    </div>
  );
}

/* ========== PROCESSED NEWS TAB ========== */
function ProcessedNewsTab({ processed, pp, ptp, ptc, regenerating, regenerateOpenAI, fmt, getProc, copyToClipboard, downloadHTML, fetchProcessed }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>✅ Processed Articles (Page {pp} of {ptp})</h2>
      <div style={styles.cardContainer}>
        {processed.map((a) => {
          const { date, time } = fmt(getProc(a));
          const title = a.final_title || a.title;
          const meta = a.final_meta || "";
          const slug = a.final_slug || "article";
          const isRegenerating = !!regenerating[a.id];

          return (
            <div key={a.id} style={styles.processedCard}>
              <div style={styles.processedHeader}>
                <div style={styles.processedTitle}>{title}</div>
                <div style={styles.processedMeta}>
                  <div>✅ Processed: {date} {time}</div>
                  <div>📰 {a.source_name}</div>
                </div>
              </div>

              <div style={styles.metaBox}>
                <div><strong>Meta Title:</strong> {title}</div>
                {meta && <div><strong>Meta Description:</strong> {meta}</div>}
                {slug && <div><strong>Slug:</strong> {slug}</div>}
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => copyToClipboard(a.ready_article, "HTML")}
                  style={{ ...styles.button, ...styles.buttonInfo }}
                >
                  📋 Copy HTML
                </button>
                <button
                  onClick={() => downloadHTML(a.ready_article, slug)}
                  style={{ ...styles.button, ...styles.buttonSuccess }}
                >
                  💾 Download HTML
                </button>
                <button
                  onClick={() => copyToClipboard(title, "Title")}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  📝 Copy Title
                </button>
                <button
                  onClick={() => copyToClipboard(meta, "Meta Description")}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  📄 Copy Meta
                </button>
                <button
                  onClick={() => regenerateOpenAI(a.id)}
                  disabled={isRegenerating}
                  style={{
                    ...styles.button,
                    ...styles.buttonDanger,
                    ...(isRegenerating ? styles.buttonDisabled : {})
                  }}
                >
                  {isRegenerating ? "⏳ Regenerating…" : "🎨 Regenerate with OpenAI GPT-5"}
                </button>
              </div>

              <div style={styles.previewContainer}>
                <iframe
                  title={`preview-${a.id}`}
                  srcDoc={a.ready_article || ""}
                  style={styles.iframe}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Pager page={pp} total={ptp} totalCount={ptc} onChange={fetchProcessed} />
    </div>
  );
}

/* ========== PAGINATION COMPONENT ========== */
function Pager({ page, total, totalCount, onChange }) {
  const nums = [];
  const max = 5;
  let s = Math.max(1, page - Math.floor(max / 2));
  let e = Math.min(total, s + max - 1);
  if (e - s + 1 < max) s = Math.max(1, e - max + 1);
  for (let i = s; i <= e; i++) nums.push(i);

  return (
    <div style={styles.pagerContainer}>
      <button
        disabled={page === 1}
        onClick={() => onChange(1)}
        style={{
          ...styles.pagerButton,
          ...(page === 1 ? styles.pagerButtonDisabled : {})
        }}
      >
        First
      </button>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={{
          ...styles.pagerButton,
          ...(page === 1 ? styles.pagerButtonDisabled : {})
        }}
      >
        Prev
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            ...styles.pagerButton,
            ...(n === page ? styles.pagerButtonActive : {})
          }}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        style={{
          ...styles.pagerButton,
          ...(page === total ? styles.pagerButtonDisabled : {})
        }}
      >
        Next
      </button>
      <button
        disabled={page === total}
        onClick={() => onChange(total)}
        style={{
          ...styles.pagerButton,
          ...(page === total ? styles.pagerButtonDisabled : {})
        }}
      >
        Last
      </button>
      <span style={styles.pagerInfo}>
        Page {page} of {total} ({totalCount} total)
      </span>
    </div>
  );
}

/* ========== STYLES ========== */
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  mainTitle: {
    margin: '0 0 10px 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    margin: '0 0 15px 0',
    fontSize: '1.1rem',
    opacity: '0.95',
    fontWeight: '400'
  },
  systemInfo: {
    fontSize: '0.85rem',
    opacity: '0.8',
    fontFamily: 'monospace'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0'
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px 10px 0 0',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  tabActive: {
    background: '#007bff',
    color: '#fff'
  },
  tabActiveGreen: {
    background: '#28a745',
    color: '#fff'
  },
  tabInactive: {
    background: '#f3f4f6',
    color: '#666'
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  buttonPrimary: {
    background: '#007bff',
    color: '#fff'
  },
  buttonSuccess: {
    background: '#28a745',
    color: '#fff'
  },
  buttonInfo: {
    background: '#17a2b8',
    color: '#fff'
  },
  buttonDanger: {
    background: '#e74c3c',
    color: '#fff',
    fontWeight: '700'
  },
  buttonSecondary: {
    background: '#6c757d',
    color: '#fff'
  },
  buttonGenerate: {
    background: '#00b894',
    color: '#fff',
    minWidth: '180px'
  },
  buttonDisabled: {
    background: '#95a5a6',
    cursor: 'not-allowed',
    opacity: '0.7'
  },
  sectionTitle: {
    marginBottom: '20px',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2c3e50'
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  cardContent: {
    flex: 1,
    paddingRight: '20px'
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: '10px',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '1.1rem',
    lineHeight: '1.4'
  },
  cardMeta: {
    display: 'flex',
    gap: '15px',
    color: '#666',
    fontSize: '0.9rem',
    flexWrap: 'wrap'
  },
  badgeSuccess: {
    color: '#28a745',
    fontWeight: '700',
    background: '#d4edda',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  processedCard: {
    border: '2px solid #a7f3d0',
    borderRadius: '12px',
    padding: '25px',
    background: '#f0fff4',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  processedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  processedTitle: {
    fontWeight: '700',
    fontSize: '1.3rem',
    color: '#2c3e50',
    flex: 1
  },
  processedMeta: {
    fontSize: '0.85rem',
    color: '#666',
    textAlign: 'right'
  },
  metaBox: {
    background: '#eef2ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '0.9rem',
    lineHeight: '1.8'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  previewContainer: {
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#fff'
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none'
  },
  pagerContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '25px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  pagerButton: {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    background: '#007bff',
    color: '#fff',
    transition: 'all 0.2s ease'
  },
  pagerButtonActive: {
    background: '#0056b3',
    transform: 'scale(1.1)'
  },
  pagerButtonDisabled: {
    background: '#e0e0e0',
    color: '#999',
    cursor: 'not-allowed'
  },
  pagerInfo: {
    marginLeft: '15px',
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: '500'
  }
};