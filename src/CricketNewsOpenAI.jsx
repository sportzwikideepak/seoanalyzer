import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// const API = "http://localhost:5000";

const PAGE = 25;

export default function CricketNewsOpenAI() {
  const [stored, setStored] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});

  const [sp, setSp] = useState(1);
  const [pp, setPp] = useState(1);
  const [stp, setStp] = useState(1);
  const [ptp, setPtp] = useState(1);
  const [stc, setStc] = useState(0);
  const [ptc, setPtc] = useState(0);

  // --- SIMPLE FIX for timezone ---
  const fmt = (v) => {
    console.log(" fmt function input:", v);
    if (!v) return { date: "-", time: "-" };
    
    const timeMatch = v.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      const hour24 = parseInt(hours);
      const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
      const ampm = hour24 >= 12 ? 'pm' : 'am';
      const formattedTime = `${hour12}:${minutes} ${ampm}`;
      
      console.log(`⏰ Direct time extraction: ${v} → ${formattedTime}`);
      
      return {
        date: new Date(v).toLocaleDateString("en-IN"),
        time: formattedTime,
      };
    }
    
    return { date: "-", time: "-" };
  };

  const getPub = (row) => row.published_at_iso ?? row.published_at;
  const getProc = (row) => row.processed_at_iso ?? row.processed_at;

  // --- fetchers ---
  const fetchStored = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/cricket-openai/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setStored(r.data.news || []);
        const total = r.data.totalCount || 0;
        setStc(total);
        setStp(Math.max(1, Math.ceil(total / PAGE)));
        setSp(page);
        console.log("📰 Fetched stored cricket news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessed = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/cricket-openai/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessed(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtc(total);
        setPtp(Math.max(1, Math.ceil(total / PAGE)));
        setPp(page);
        console.log("✅ Fetched processed cricket news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("🏏 Cricket News OpenAI Component mounted");
    console.log("🕐 Current system time:", new Date().toLocaleString("en-IN"));
    fetchStored(1);
    fetchProcessed(1);
  }, []);

  const gen = async (id) => {
    setBusy((m) => ({ ...m, [id]: true }));
    try {
      const r = await axios.post(`${API}/api/cricket-openai/articles/${id}/generate`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      await fetchStored(sp);
      await fetchProcessed(pp);
      alert("✅ Cricket article generated successfully!");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  };

  const manualFetch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/cricket-openai/manual-fetch-news`);
      await fetchStored(1);
      setSp(1);
      alert("Cricket news fetched successfully!");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>🏏 Cricket News OpenAI</h1>
        <p>24/7 Cricket News Fetching & One-Click Article Generation with OpenAI</p>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setTab("stored")}
          style={{ padding: "10px 16px", background: tab === "stored" ? "#007bff" : "#f3f4f6", color: tab === "stored" ? "#fff" : "#333" }}
        >
          🏏 Stored Cricket News ({stc})
        </button>
        <button
          onClick={() => setTab("processed")}
          style={{ padding: "10px 16px", background: tab === "processed" ? "#28a745" : "#f3f4f6", color: tab === "processed" ? "#fff" : "#333" }}
        >
          ✅ OpenAI Processed Cricket Articles ({ptc})
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
        <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }}>
          {loading ? "⏳ Refreshing…" : "🔄 Refresh All"}
        </button>
        <button disabled={loading} onClick={manualFetch}>
          {loading ? "⏳ Fetching…" : "🏏 Fetch Cricket News"}
        </button>
      </div>

      {tab === "stored" ? (
        <div>
          <h2>Latest Cricket News (Page {sp} of {stp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stored.map((a) => {
              const { date, time } = fmt(getPub(a));
              const isBusy = !!busy[a.id];
              return (
                <div key={a.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div 
                      style={{ 
                        fontWeight: 700, 
                        marginBottom: 6, 
                        color: "#007bff", 
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      onClick={() => {
                        if (a.source_url) {
                          window.open(a.source_url, '_blank', 'noopener,noreferrer');
                        } else {
                          alert('No source URL available');
                        }
                      }}
                    >
                      {a.title}
                    </div>
                    <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12 }}>
                      <span>📅 {date}</span>
                      <span>🕒 {time}</span>
                      <span>{a.source_name}</span>
                      {typeof a.word_count === "number" && <span>📝 {a.word_count} words</span>}
                      {a.openai_processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ OpenAI Processed</span> : null}
                    </div>
                  </div>
                  <button
                    onClick={() => gen(a.id)}
                    disabled={isBusy}
                    style={{ padding: "10px 14px", background: isBusy ? "#95a5a6" : "#00b894", color: "#fff", border: "none", borderRadius: 8 }}
                  >
                    {isBusy ? "⏳ Generating…" : "🤖 Generate Article (OpenAI)"}
                  </button>
                </div>
              );
            })}
          </div>
          <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
        </div>
      ) : (
        <div>
          <h2>✅ OpenAI Processed Cricket Articles (Page {pp} of {ptp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processed.map((a) => {
              const { date, time } = fmt(getProc(a));
              const title = a.openai_final_title || a.title;
              const meta  = a.openai_final_meta || "";
              const slug  = a.openai_final_slug || "article";

              return (
                <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <div>OpenAI Processed: {date} {time}</div>
                      <div>📰 {a.source_name}</div>
                    </div>
                  </div>

                  <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                    <div><strong>Meta Title:</strong> {title}</div>
                    {meta && <div><strong>Meta Description:</strong> {meta}</div>}
                    {slug && <div><strong>Slug:</strong> {slug}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(a.openai_ready_article || "")}>📋 Copy Full HTML</button>
                    <button onClick={() => {
                      const blob = new Blob([a.openai_ready_article || ""], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const aTag = document.createElement("a");
                      aTag.href = url;
                      aTag.download = `${slug}.html`;
                      aTag.click();
                      URL.revokeObjectURL(url);
                    }}>💾 Download HTML</button>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <iframe title={`preview-${a.id}`} srcDoc={a.openai_ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={pp} total={ptp} totalCount={ptc} onChange={fetchProcessed} />
        </div>
      )}
    </div>
  );
}

function Pager({ page, total, totalCount, onChange }) {
  const nums = [];
  const max = 5;
  let s = Math.max(1, page - Math.floor(max / 2));
  let e = Math.min(total, s + max - 1);
  if (e - s + 1 < max) s = Math.max(1, e - max + 1);
  for (let i = s; i <= e; i++) nums.push(i);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
      <button disabled={page===1} onClick={() => onChange(1)}>First</button>
      <button disabled={page===1} onClick={() => onChange(page-1)}>Prev</button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal" }}>{n}</button>
      ))}
      <button disabled={page===total} onClick={() => onChange(page+1)}>Next</button>
      <button disabled={page===total} onClick={() => onChange(total)}>Last</button>
      <span style={{ marginLeft: 8, color: "#666" }}>Page {page} of {total} ({totalCount})</span>
    </div>
  );
}












































// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// // const API = "http://localhost:5000";

// const PAGE = 25;

// export default function CricketNewsOpenAI() {
//   const [stored, setStored] = useState([]);
//   const [processed, setProcessed] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState("stored");
//   const [busy, setBusy] = useState({});
//   const [promptConfig, setPromptConfig] = useState(null);
//   const [savingPrompt, setSavingPrompt] = useState(false);

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

//   // --- Fetch Prompt Config ---
//   const fetchPromptConfig = async () => {
//     try {
//       const r = await axios.get(`${API}/api/cricket-openai/prompt-config`);
//       if (r.data?.success) {
//         setPromptConfig(r.data.config);
//         console.log('✅ Prompt config loaded:', r.data.config);
//       }
//     } catch (e) {
//       console.error('Error fetching prompt config:', e);
//       alert('Failed to load prompt configuration: ' + (e.response?.data?.error || e.message));
//     }
//   };

//   // --- Update Prompt Config ---
//   const updatePromptConfig = async () => {
//     setSavingPrompt(true);
//     try {
//       await axios.put(`${API}/api/cricket-openai/prompt-config`, {
//         system_prompt: promptConfig.system_prompt,
//         user_prompt_template: promptConfig.user_prompt_template,
//         temperature: promptConfig.temperature,
//         max_tokens: promptConfig.max_tokens,
//         top_p: promptConfig.top_p,
//         frequency_penalty: promptConfig.frequency_penalty,
//         presence_penalty: promptConfig.presence_penalty
//       });
//       alert('✅ Prompt configuration updated successfully!');
//     } catch (e) {
//       alert('Error updating prompt: ' + (e.response?.data?.error || e.message));
//     } finally {
//       setSavingPrompt(false);
//     }
//   };

//   // --- fetchers ---
//   const fetchStored = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * PAGE;
//       const r = await axios.get(
//         `${API}/api/cricket-openai/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setStored(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setStc(total);
//         setStp(Math.max(1, Math.ceil(total / PAGE)));
//         setSp(page);
//         console.log("📰 Fetched stored cricket news:", r.data.news?.length, "articles");
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
//         `${API}/api/cricket-openai/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setProcessed(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setPtc(total);
//         setPtp(Math.max(1, Math.ceil(total / PAGE)));
//         setPp(page);
//         console.log("✅ Fetched processed cricket news:", r.data.news?.length, "articles");
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     console.log("🏏 Cricket News OpenAI Component mounted");
//     console.log("🕐 Current system time:", new Date().toLocaleString("en-IN"));
//     fetchPromptConfig();
//     fetchStored(1);
//     fetchProcessed(1);
//   }, []);

//   const gen = async (id) => {
//     setBusy((m) => ({ ...m, [id]: true }));
//     try {
//       const r = await axios.post(`${API}/api/cricket-openai/articles/${id}/generate`);
//       if (!r.data?.success) throw new Error(r.data?.error || "Failed");
//       await fetchStored(sp);
//       await fetchProcessed(pp);
//       alert("✅ Cricket article generated successfully!");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setBusy((m) => ({ ...m, [id]: false }));
//     }
//   };

//   const manualFetch = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${API}/api/cricket-openai/manual-fetch-news`);
//       await fetchStored(1);
//       setSp(1);
//       alert("Cricket news fetched successfully!");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto", fontFamily: "Inter, Arial" }}>
//       <div style={{ textAlign: "center", marginBottom: 24 }}>
//         <h1>🏏 Cricket News OpenAI</h1>
//         <p>24/7 Cricket News Fetching & One-Click Article Generation with OpenAI</p>
//         <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//           Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee", flexWrap: "wrap" }}>
//         <button
//           onClick={() => setTab("stored")}
//           style={{ 
//             padding: "10px 16px", 
//             background: tab === "stored" ? "#007bff" : "#f3f4f6", 
//             color: tab === "stored" ? "#fff" : "#333",
//             border: "none",
//             borderRadius: "8px 8px 0 0",
//             cursor: "pointer",
//             fontWeight: tab === "stored" ? "bold" : "normal"
//           }}
//         >
//           🏏 Stored Cricket News ({stc})
//         </button>
//         <button
//           onClick={() => setTab("processed")}
//           style={{ 
//             padding: "10px 16px", 
//             background: tab === "processed" ? "#28a745" : "#f3f4f6", 
//             color: tab === "processed" ? "#fff" : "#333",
//             border: "none",
//             borderRadius: "8px 8px 0 0",
//             cursor: "pointer",
//             fontWeight: tab === "processed" ? "bold" : "normal"
//           }}
//         >
//           ✅ OpenAI Processed Articles ({ptc})
//         </button>
//         <button
//           onClick={() => setTab("prompt-editor")}
//           style={{ 
//             padding: "10px 16px", 
//             background: tab === "prompt-editor" ? "#ff6b6b" : "#f3f4f6", 
//             color: tab === "prompt-editor" ? "#fff" : "#333",
//             border: "none",
//             borderRadius: "8px 8px 0 0",
//             cursor: "pointer",
//             fontWeight: tab === "prompt-editor" ? "bold" : "normal"
//           }}
//         >
//           ⚙️ Prompt Editor
//         </button>
//       </div>

//       {tab !== "prompt-editor" && (
//         <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
//           <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
//             {loading ? "⏳ Refreshing…" : "🔄 Refresh All"}
//           </button>
//           <button disabled={loading} onClick={manualFetch} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
//             {loading ? "⏳ Fetching…" : "🏏 Fetch Cricket News"}
//           </button>
//         </div>
//       )}

//       {tab === "stored" ? (
//         <div>
//           <h2>Latest Cricket News (Page {sp} of {stp})</h2>
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
//                       {a.openai_processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ OpenAI Processed</span> : null}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => gen(a.id)}
//                     disabled={isBusy}
//                     style={{ 
//                       padding: "10px 14px", 
//                       background: isBusy ? "#95a5a6" : "#00b894", 
//                       color: "#fff", 
//                       border: "none", 
//                       borderRadius: 8,
//                       cursor: isBusy ? "not-allowed" : "pointer"
//                     }}
//                   >
//                     {isBusy ? "⏳ Generating…" : "🤖 Generate Article (OpenAI)"}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//           <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
//         </div>
//       ) : tab === "processed" ? (
//         <div>
//           <h2>✅ OpenAI Processed Cricket Articles (Page {pp} of {ptp})</h2>
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {processed.map((a) => {
//               const { date, time } = fmt(getProc(a));
//               const title = a.openai_final_title || a.title;
//               const meta  = a.openai_final_meta || "";
//               const slug  = a.openai_final_slug || "article";

//               return (
//                 <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                     <div style={{ fontWeight: 700 }}>{title}</div>
//                     <div style={{ fontSize: 12, color: "#666" }}>
//                       <div>OpenAI Processed: {date} {time}</div>
//                       <div>📰 {a.source_name}</div>
//                     </div>
//                   </div>

//                   <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
//                     <div><strong>Meta Title:</strong> {title}</div>
//                     {meta && <div><strong>Meta Description:</strong> {meta}</div>}
//                     {slug && <div><strong>Slug:</strong> {slug}</div>}
//                   </div>

//                   <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//                     <button onClick={() => navigator.clipboard.writeText(a.openai_ready_article || "")} style={{ cursor: "pointer" }}>📋 Copy Full HTML</button>
//                     <button onClick={() => {
//                       const blob = new Blob([a.openai_ready_article || ""], { type: "text/html" });
//                       const url = URL.createObjectURL(blob);
//                       const aTag = document.createElement("a");
//                       aTag.href = url;
//                       aTag.download = `${slug}.html`;
//                       aTag.click();
//                       URL.revokeObjectURL(url);
//                     }} style={{ cursor: "pointer" }}>💾 Download HTML</button>
//                   </div>

//                   <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
//                     <iframe title={`preview-${a.id}`} srcDoc={a.openai_ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <Pager page={pp} total={ptp} totalCount={ptc} onChange={fetchProcessed} />
//         </div>
//       ) : tab === "prompt-editor" && promptConfig ? (
//         <div style={{ maxWidth: 1000, margin: '0 auto' }}>
//           <h2>⚙️ OpenAI Prompt Configuration Editor</h2>
//           <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
//             Edit the system prompt and user prompt template. Changes will apply to all new article generations.
//             <br/>
//             <strong>Note:</strong> Use <code>{`{{TITLE}}`}</code>, <code>{`{{DESCRIPTION}}`}</code>, <code>{`{{BODY}}`}</code> as placeholders in the template.
//           </p>

//           <div style={{ marginBottom: 20 }}>
//             <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 8, fontSize: 15 }}>
//               🤖 System Prompt (AI Personality):
//             </label>
//             <textarea
//               value={promptConfig.system_prompt || ''}
//               onChange={(e) => setPromptConfig({...promptConfig, system_prompt: e.target.value})}
//               style={{
//                 width: '100%',
//                 minHeight: 120,
//                 padding: 12,
//                 border: '2px solid #ddd',
//                 borderRadius: 8,
//                 fontFamily: 'monospace',
//                 fontSize: 14,
//                 resize: 'vertical'
//               }}
//               placeholder="e.g., You are an Indian cricket journalist..."
//             />
//             <small style={{ color: '#666' }}>This defines how the AI should behave and write.</small>
//           </div>

//           <div style={{ marginBottom: 20 }}>
//             <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 8, fontSize: 15 }}>
//               📝 User Prompt Template (Article Generation Instructions):
//             </label>
//             <textarea
//               value={promptConfig.user_prompt_template || ''}
//               onChange={(e) => setPromptConfig({...promptConfig, user_prompt_template: e.target.value})}
//               style={{
//                 width: '100%',
//                 minHeight: 500,
//                 padding: 12,
//                 border: '2px solid #ddd',
//                 borderRadius: 8,
//                 fontFamily: 'monospace',
//                 fontSize: 13,
//                 lineHeight: 1.6,
//                 resize: 'vertical'
//               }}
//               placeholder={`Use {{TITLE}}, {{DESCRIPTION}}, {{BODY}} as placeholders\n\nExample:\nRewrite this article:\nTitle: {{TITLE}}\nDescription: {{DESCRIPTION}}\nBody: {{BODY}}`}
//             />
//             <small style={{ color: '#666' }}>
//               The actual article content will replace the placeholders when generating.
//             </small>
//           </div>

//           <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
//             <h3 style={{ marginTop: 0, marginBottom: 15, fontSize: 16 }}>🎛️ OpenAI Parameters</h3>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15 }}>
//               <div>
//                 <label style={{ fontSize: 13, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
//                   Temperature (0-2):
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="2"
//                   value={promptConfig.temperature || 0.97}
//                   onChange={(e) => setPromptConfig({...promptConfig, temperature: parseFloat(e.target.value)})}
//                   style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
//                 />
//                 <small style={{ color: '#666', fontSize: 11 }}>Higher = more random</small>
//               </div>

//               <div>
//                 <label style={{ fontSize: 13, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
//                   Max Tokens:
//                 </label>
//                 <input
//                   type="number"
//                   step="100"
//                   min="100"
//                   max="8000"
//                   value={promptConfig.max_tokens || 5000}
//                   onChange={(e) => setPromptConfig({...promptConfig, max_tokens: parseInt(e.target.value)})}
//                   style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
//                 />
//                 <small style={{ color: '#666', fontSize: 11 }}>Max response length</small>
//               </div>

//               <div>
//                 <label style={{ fontSize: 13, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
//                   Top P (0-1):
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="1"
//                   value={promptConfig.top_p || 0.88}
//                   onChange={(e) => setPromptConfig({...promptConfig, top_p: parseFloat(e.target.value)})}
//                   style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
//                 />
//                 <small style={{ color: '#666', fontSize: 11 }}>Nucleus sampling</small>
//               </div>

//               <div>
//                 <label style={{ fontSize: 13, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
//                   Frequency Penalty (0-2):
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="2"
//                   value={promptConfig.frequency_penalty || 0.5}
//                   onChange={(e) => setPromptConfig({...promptConfig, frequency_penalty: parseFloat(e.target.value)})}
//                   style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
//                 />
//                 <small style={{ color: '#666', fontSize: 11 }}>Reduce repetition</small>
//               </div>

//               <div>
//                 <label style={{ fontSize: 13, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
//                   Presence Penalty (0-2):
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="2"
//                   value={promptConfig.presence_penalty || 0.45}
//                   onChange={(e) => setPromptConfig({...promptConfig, presence_penalty: parseFloat(e.target.value)})}
//                   style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
//                 />
//                 <small style={{ color: '#666', fontSize: 11 }}>Introduce new topics</small>
//               </div>
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
//             <button 
//               onClick={updatePromptConfig}
//               disabled={savingPrompt}
//               style={{ 
//                 padding: '14px 28px', 
//                 background: savingPrompt ? '#95a5a6' : '#28a745', 
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: 8,
//                 fontWeight: 'bold',
//                 cursor: savingPrompt ? 'not-allowed' : 'pointer',
//                 fontSize: 15
//               }}
//             >
//               {savingPrompt ? '⏳ Saving...' : '💾 Save Configuration'}
//             </button>
//             <button 
//               onClick={fetchPromptConfig}
//               disabled={savingPrompt}
//               style={{ 
//                 padding: '14px 28px', 
//                 background: '#6c757d', 
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: 8,
//                 cursor: savingPrompt ? 'not-allowed' : 'pointer',
//                 fontSize: 15
//               }}
//             >
//               🔄 Reset to Saved
//             </button>
//           </div>

//           <div style={{ padding: 20, background: '#fff3cd', borderRadius: 8, fontSize: 14, border: '1px solid #ffc107' }}>
//             <strong style={{ fontSize: 15 }}>💡 Tips for Best Results:</strong>
//             <ul style={{ marginTop: 10, paddingLeft: 25, lineHeight: 1.8 }}>
//               <li><strong>Temperature 0.97+</strong> = More creative, random, human-like variations (best for bypassing AI detection)</li>
//               <li><strong>Temperature 0.2</strong> = More focused, consistent, predictable (best for factual content)</li>
//               <li><strong>Frequency Penalty (0.5+)</strong> = Reduces word repetition, makes text more varied</li>
//               <li><strong>Presence Penalty (0.45+)</strong> = Encourages introducing new topics and ideas</li>
//               <li><strong>Top P (0.88)</strong> = Balances creativity with coherence</li>
//               <li>Use placeholders <code>{`{{TITLE}}`}</code>, <code>{`{{DESCRIPTION}}`}</code>, <code>{`{{BODY}}`}</code> to inject article data</li>
//               <li>Test different prompts to find what works best for your needs</li>
//             </ul>
//           </div>

//           <div style={{ marginTop: 20, padding: 15, background: '#e7f3ff', borderRadius: 8, fontSize: 13 }}>
//             <strong>📌 Last Updated:</strong> {new Date(promptConfig.updated_at).toLocaleString('en-IN')}
//           </div>
//         </div>
//       ) : tab === "prompt-editor" && !promptConfig ? (
//         <div style={{ textAlign: 'center', padding: 40 }}>
//           <h3>⏳ Loading prompt configuration...</h3>
//         </div>
//       ) : null}
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
//     <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16, flexWrap: "wrap" }}>
//       <button disabled={page===1} onClick={() => onChange(1)} style={{ cursor: page===1 ? "not-allowed" : "pointer" }}>First</button>
//       <button disabled={page===1} onClick={() => onChange(page-1)} style={{ cursor: page===1 ? "not-allowed" : "pointer" }}>Prev</button>
//       {nums.map((n) => (
//         <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal", cursor: "pointer" }}>{n}</button>
//       ))}
//       <button disabled={page===total} onClick={() => onChange(page+1)} style={{ cursor: page===total ? "not-allowed" : "pointer" }}>Next</button>
//       <button disabled={page===total} onClick={() => onChange(total)} style={{ cursor: page===total ? "not-allowed" : "pointer" }}>Last</button>
//       <span style={{ marginLeft: 8, color: "#666" }}>Page {page} of {total} ({totalCount})</span>
//     </div>
//   );
// }