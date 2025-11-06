// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// // const API = "http://localhost:5000";


// const PAGE = 25;

// export default function HindiCricketNewsOpenAI() {
//   const [stored, setStored] = useState([]);
//   const [processed, setProcessed] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState("stored");
//   const [busy, setBusy] = useState({});

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

//   // --- fetchers ---
//   const fetchStored = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * PAGE;
//       const r = await axios.get(
//         `${API}/api/hindi-cricket-openai/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setStored(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setStc(total);
//         setStp(Math.max(1, Math.ceil(total / PAGE)));
//         setSp(page);
//         console.log("📰 Fetched stored Hindi cricket news:", r.data.news?.length, "articles");
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
//         `${API}/api/hindi-cricket-openai/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       if (r.data?.success) {
//         setProcessed(r.data.news || []);
//         const total = r.data.totalCount || 0;
//         setPtc(total);
//         setPtp(Math.max(1, Math.ceil(total / PAGE)));
//         setPp(page);
//         console.log("✅ Fetched processed Hindi cricket news:", r.data.news?.length, "articles");
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     console.log("🏏 Hindi Cricket News OpenAI Component mounted");
//     console.log("🕐 Current system time:", new Date().toLocaleString("en-IN"));
//     fetchStored(1);
//     fetchProcessed(1);
//   }, []);

//   const gen = async (id) => {
//     setBusy((m) => ({ ...m, [id]: true }));
//     try {
//       const r = await axios.post(`${API}/api/hindi-cricket-openai/articles/${id}/generate`);
//       if (!r.data?.success) throw new Error(r.data?.error || "Failed");
//       await fetchStored(sp);
//       await fetchProcessed(pp);
//       alert("✅ Hindi Cricket article generated successfully!");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setBusy((m) => ({ ...m, [id]: false }));
//     }
//   };

//   const manualFetch = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${API}/api/hindi-cricket-openai/manual-fetch-news`);
//       await fetchStored(1);
//       setSp(1);
//       alert("Hindi Cricket news fetched successfully!");
//     } catch (e) {
//       alert(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
//       <div style={{ textAlign: "center", marginBottom: 24 }}>
//         <h1>🏏 हिंदी क्रिकेट न्यूज़ OpenAI</h1>
//         <p>24/7 हिंदी क्रिकेट न्यूज़ फेचिंग और OpenAI के साथ वन-क्लिक आर्टिकल जेनरेशन</p>
//         <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//           Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
//         <button
//           onClick={() => setTab("stored")}
//           style={{ padding: "10px 16px", background: tab === "stored" ? "#007bff" : "#f3f4f6", color: tab === "stored" ? "#fff" : "#333" }}
//         >
//           🏏 स्टोर्ड हिंदी क्रिकेट न्यूज़ ({stc})
//         </button>
//         <button
//           onClick={() => setTab("processed")}
//           style={{ padding: "10px 16px", background: tab === "processed" ? "#28a745" : "#f3f4f6", color: tab === "processed" ? "#fff" : "#333" }}
//         >
//           ✅ OpenAI प्रोसेस्ड हिंदी क्रिकेट आर्टिकल्स ({ptc})
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
//         <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }}>
//           {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 सभी रिफ्रेश करें"}
//         </button>
//         <button disabled={loading} onClick={manualFetch}>
//           {loading ? "⏳ फेच हो रहा है…" : "🏏 हिंदी क्रिकेट न्यूज़ फेच करें"}
//         </button>
//       </div>

//       {tab === "stored" ? (
//         <div>
//           <h2>नवीनतम हिंदी क्रिकेट न्यूज़ (पेज {sp} of {stp})</h2>
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
//                       {typeof a.word_count === "number" && <span>📝 {a.word_count} शब्द</span>}
//                       {a.openai_processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ OpenAI प्रोसेस्ड</span> : null}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => gen(a.id)}
//                     disabled={isBusy}
//                     style={{ padding: "10px 14px", background: isBusy ? "#95a5a6" : "#00b894", color: "#fff", border: "none", borderRadius: 8 }}
//                   >
//                     {isBusy ? "⏳ जेनरेट हो रहा है…" : "🤖 आर्टिकल जेनरेट करें (OpenAI)"}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//           <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
//         </div>
//       ) : (
//         <div>
//           <h2>✅ OpenAI प्रोसेस्ड हिंदी क्रिकेट आर्टिकल्स (पेज {pp} of {ptp})</h2>
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
//                       <div>OpenAI प्रोसेस्ड: {date} {time}</div>
//                       <div>📰 {a.source_name}</div>
//                     </div>
//                   </div>

//                   <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
//                     <div><strong>मेटा टाइटल:</strong> {title}</div>
//                     {meta && <div><strong>मेटा डिस्क्रिप्शन:</strong> {meta}</div>}
//                     {slug && <div><strong>स्लग:</strong> {slug}</div>}
//                   </div>

//                   <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//                     <button onClick={() => navigator.clipboard.writeText(a.openai_ready_article || "")}>📋 पूरा HTML कॉपी करें</button>
//                     <button onClick={() => {
//                       const blob = new Blob([a.openai_ready_article || ""], { type: "text/html" });
//                       const url = URL.createObjectURL(blob);
//                       const aTag = document.createElement("a");
//                       aTag.href = url;
//                       aTag.download = `${slug}.html`;
//                       aTag.click();
//                       URL.revokeObjectURL(url);
//                     }}>💾 HTML डाउनलोड करें</button>
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
//       <button disabled={page===1} onClick={() => onChange(1)}>पहला</button>
//       <button disabled={page===1} onClick={() => onChange(page-1)}>पिछला</button>
//       {nums.map((n) => (
//         <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal" }}>{n}</button>
//       ))}
//       <button disabled={page===total} onClick={() => onChange(page+1)}>अगला</button>
//       <button disabled={page===total} onClick={() => onChange(total)}>अंतिम</button>
//       <span style={{ marginLeft: 8, color: "#666" }}>पेज {page} of {total} ({totalCount})</span>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// const API = "http://localhost:5000";

const PAGE = 25;

export default function HindiCricketNewsOpenAI() {
  const [stored, setStored] = useState([]);
  const [processedOpenAI, setProcessedOpenAI] = useState([]);
  const [processedDeepSeek, setProcessedDeepSeek] = useState([]);
  const [compared, setCompared] = useState([]); // Articles with both OpenAI and DeepSeek
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});
  const [provider, setProvider] = useState("openai");

  // Pagination states
  const [sp, setSp] = useState(1); // stored page
  const [ppo, setPpo] = useState(1); // OpenAI processed page
  const [ppd, setPpd] = useState(1); // DeepSeek processed page
  const [pcp, setPcp] = useState(1); // Comparison page
  const [stp, setStp] = useState(1); // stored total pages
  const [ptpo, setPtpo] = useState(1); // OpenAI processed total pages
  const [ptpd, setPtpd] = useState(1); // DeepSeek processed total pages
  const [ptcp, setPtcp] = useState(1); // Comparison total pages
  const [stc, setStc] = useState(0); // stored count
  const [ptco, setPtco] = useState(0); // OpenAI processed count
  const [ptcd, setPtcd] = useState(0); // DeepSeek processed count
  const [ptcc, setPtcc] = useState(0); // Comparison count

  // --- SIMPLE FIX for timezone ---
  const fmt = (v) => {
    if (!v) return { date: "-", time: "-" };
    
    const timeMatch = v.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      const hour24 = parseInt(hours);
      const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
      const ampm = hour24 >= 12 ? 'pm' : 'am';
      const formattedTime = `${hour12}:${minutes} ${ampm}`;
      
      return {
        date: new Date(v).toLocaleDateString("en-IN"),
        time: formattedTime,
      };
    }
    
    return { date: "-", time: "-" };
  };

  const getPub = (row) => row.published_at_iso ?? row.published_at;
  const getProcOpenAI = (row) => row.processed_at_iso ?? row.openai_processed_at;
  const getProcDeepSeek = (row) => row.processed_at_iso ?? row.deepseek_processed_at;

  // --- fetchers ---
  const fetchStored = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/hindi-cricket-openai/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setStored(r.data.news || []);
        const total = r.data.totalCount || 0;
        setStc(total);
        setStp(Math.max(1, Math.ceil(total / PAGE)));
        setSp(page);
        console.log("📰 Fetched stored Hindi cricket news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessedOpenAI = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/hindi-cricket-openai/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessedOpenAI(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtco(total);
        setPtpo(Math.max(1, Math.ceil(total / PAGE)));
        setPpo(page);
        console.log("✅ Fetched OpenAI processed Hindi cricket news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProcessedDeepSeek = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      // Use old working endpoint for DeepSeek processed articles
      const r = await axios.get(
        `${API}/api/hindi/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessedDeepSeek(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtcd(total);
        setPtpd(Math.max(1, Math.ceil(total / PAGE)));
        setPpd(page);
        console.log("✅ Fetched DeepSeek processed Hindi cricket news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch comparison articles (articles processed by both OpenAI and DeepSeek)
  const fetchCompared = async (page = 1) => {
    try {
      // Fetch all OpenAI processed articles (fetch all pages)
      let allOpenAI = [];
      let openaiOffset = 0;
      let hasMoreOpenAI = true;
      
      while (hasMoreOpenAI) {
        const openaiRes = await axios.get(
          `${API}/api/hindi-cricket-openai/processed-news?limit=100&offset=${openaiOffset}&_=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        if (openaiRes.data?.success && openaiRes.data.news?.length > 0) {
          allOpenAI = allOpenAI.concat(openaiRes.data.news);
          openaiOffset += 100;
          if (openaiRes.data.news.length < 100) hasMoreOpenAI = false;
        } else {
          hasMoreOpenAI = false;
        }
      }
      
      // Fetch all DeepSeek processed articles (old endpoint - fetch all pages)
      let allDeepSeek = [];
      let deepseekOffset = 0;
      let hasMoreDeepSeek = true;
      
      while (hasMoreDeepSeek) {
        const deepseekRes = await axios.get(
          `${API}/api/hindi/processed-news?limit=100&offset=${deepseekOffset}&_=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        if (deepseekRes.data?.success && deepseekRes.data.news?.length > 0) {
          allDeepSeek = allDeepSeek.concat(deepseekRes.data.news);
          deepseekOffset += 100;
          if (deepseekRes.data.news.length < 100) hasMoreDeepSeek = false;
        } else {
          hasMoreDeepSeek = false;
        }
      }
      
      console.log("🔍 OpenAI processed:", allOpenAI.length, "articles");
      console.log("🔍 DeepSeek processed:", allDeepSeek.length, "articles");
      
      // Find articles that are processed by both
      const openaiIds = new Set(allOpenAI.map(a => a.id));
      const deepseekIds = new Set(allDeepSeek.map(a => a.id));
      const comparedIds = [...openaiIds].filter(id => deepseekIds.has(id));
      
      console.log("🔄 Found articles processed by both:", comparedIds.length);
      
      // Get full data for compared articles
      const comparedArticles = allOpenAI
        .filter(a => comparedIds.includes(a.id))
        .map(openaiArticle => {
          const deepseekArticle = allDeepSeek.find(d => d.id === openaiArticle.id);
          return {
            ...openaiArticle,
            // Add DeepSeek data from old endpoint
            ready_article: deepseekArticle?.ready_article || "",
            final_title: deepseekArticle?.final_title || openaiArticle.title,
            final_meta: deepseekArticle?.final_meta || "",
            final_slug: deepseekArticle?.final_slug || "article",
            processed_at: deepseekArticle?.processed_at || null,
            processed_at_iso: deepseekArticle?.processed_at_iso || null
          };
        });
      
      // Sort by most recent
      comparedArticles.sort((a, b) => {
        const dateA = new Date(a.openai_processed_at || a.openai_processed_at_iso || 0);
        const dateB = new Date(b.openai_processed_at || b.openai_processed_at_iso || 0);
        return dateB - dateA;
      });
      
      // Pagination
      const offset = (page - 1) * PAGE;
      const paginated = comparedArticles.slice(offset, offset + PAGE);
      const total = comparedArticles.length;
      
      setCompared(paginated);
      setPtcc(total);
      setPtcp(Math.max(1, Math.ceil(total / PAGE)));
      setPcp(page);
      console.log("🔄 Fetched compared Hindi cricket news:", paginated.length, "articles (total:", total, ")");
    } catch (e) {
      console.error("❌ Comparison fetch error:", e);
      alert("Comparison fetch error: " + (e.response?.data?.error || e.message));
    }
  };

  useEffect(() => {
    console.log("🏏 Hindi Cricket News OpenAI & DeepSeek Component mounted");
    console.log("🕐 Current system time:", new Date().toLocaleString("en-IN"));
    
    // Auto-migrate DeepSeek columns if they don't exist
    const migrateColumns = async () => {
      try {
        await axios.post(`${API}/api/hindi-cricket-deepseek/migrate-columns`);
        console.log("✅ Hindi DeepSeek columns migration check completed");
      } catch (e) {
        console.error("Migration check error:", e.response?.data?.error || e.message);
      }
    };
    
    migrateColumns();
    fetchStored(1);
    fetchProcessedOpenAI(1);
    fetchProcessedDeepSeek(1);
    fetchCompared(1);
  }, []);

  const gen = async (id, providerType) => {
    const providerKey = `${id}-${providerType}`;
    setBusy((m) => ({ ...m, [providerKey]: true }));
    try {
      const endpoint = providerType === "openai" 
        ? `${API}/api/hindi-cricket-openai/articles/${id}/generate`
        : `${API}/api/hindi-cricket-deepseek/articles/${id}/generate`;
      
      const r = await axios.post(endpoint);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      
      await fetchStored(sp);
      await fetchProcessedOpenAI(ppo);
      await fetchProcessedDeepSeek(ppd);
      await fetchCompared(pcp);
      
      alert(`✅ Hindi Cricket article generated successfully with ${providerType === "openai" ? "OpenAI" : "DeepSeek"}!`);
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [providerKey]: false }));
    }
  };

  const manualFetch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/hindi-cricket-openai/manual-fetch-news`);
      await fetchStored(1);
      setSp(1);
      alert("Hindi Cricket news fetched successfully!");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1600, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>🏏 हिंदी क्रिकेट न्यूज़ OpenAI & DeepSeek</h1>
        <p>24/7 हिंदी क्रिकेट न्यूज़ फेचिंग और OpenAI & DeepSeek के साथ वन-क्लिक आर्टिकल जेनरेशन</p>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee", flexWrap: "wrap" }}>
        <button
          onClick={() => setTab("stored")}
          style={{ 
            padding: "10px 16px", 
            background: tab === "stored" ? "#007bff" : "#f3f4f6", 
            color: tab === "stored" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            fontWeight: tab === "stored" ? "bold" : "normal"
          }}
        >
          🏏 स्टोर्ड हिंदी क्रिकेट न्यूज़ ({stc})
        </button>
        <button
          onClick={() => setTab("processed-openai")}
          style={{ 
            padding: "10px 16px", 
            background: tab === "processed-openai" ? "#28a745" : "#f3f4f6", 
            color: tab === "processed-openai" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            fontWeight: tab === "processed-openai" ? "bold" : "normal"
          }}
        >
          ✅ OpenAI प्रोसेस्ड ({ptco})
        </button>
        <button
          onClick={() => setTab("processed-deepseek")}
          style={{ 
            padding: "10px 16px", 
            background: tab === "processed-deepseek" ? "#6f42c1" : "#f3f4f6", 
            color: tab === "processed-deepseek" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            fontWeight: tab === "processed-deepseek" ? "bold" : "normal"
          }}
        >
          🤖 DeepSeek प्रोसेस्ड ({ptcd})
        </button>
        <button
          onClick={() => setTab("compare")}
          style={{ 
            padding: "10px 16px", 
            background: tab === "compare" ? "#ff6b35" : "#f3f4f6", 
            color: tab === "compare" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            fontWeight: tab === "compare" ? "bold" : "normal"
          }}
        >
          🔄 दोनों की तुलना ({ptcc})
        </button>
      </div>

      {tab !== "stored" && tab !== "compare" && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
          <button 
            disabled={loading} 
            onClick={() => { 
              fetchProcessedOpenAI(ppo); 
              fetchProcessedDeepSeek(ppd); 
            }}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 प्रोसेस्ड रिफ्रेश करें"}
          </button>
        </div>
      )}

      {tab === "stored" ? (
        <div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
            <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessedOpenAI(ppo); fetchProcessedDeepSeek(ppd); fetchCompared(pcp); }}>
              {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 सभी रिफ्रेश करें"}
            </button>
            <button disabled={loading} onClick={manualFetch}>
              {loading ? "⏳ फेच हो रहा है…" : "🏏 हिंदी क्रिकेट न्यूज़ फेच करें"}
            </button>
          </div>

          <div style={{ marginBottom: 16, padding: 12, background: "#f8f9fa", borderRadius: 8, textAlign: "center" }}>
            <label style={{ marginRight: 12, fontWeight: "bold" }}>Default Provider:</label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ddd", fontSize: 14 }}
            >
              <option value="openai">OpenAI</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>

          <h2>नवीनतम हिंदी क्रिकेट न्यूज़ (पेज {sp} of {stp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stored.map((a) => {
              const { date, time } = fmt(getPub(a));
              const isBusyOpenAI = !!busy[`${a.id}-openai`];
              const isBusyDeepSeek = !!busy[`${a.id}-deepseek`];
              
              return (
                <div key={a.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
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
                      <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12, flexWrap: "wrap" }}>
                        <span>📅 {date}</span>
                        <span>🕒 {time}</span>
                        <span>{a.source_name}</span>
                        {typeof a.word_count === "number" && <span>📝 {a.word_count} शब्द</span>}
                        {a.openai_processed && <span style={{ color: "#28a745", fontWeight: 700 }}>✅ OpenAI</span>}
                        {a.deepseek_processed && <span style={{ color: "#6f42c1", fontWeight: 700 }}>🤖 DeepSeek</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => gen(a.id, "openai")}
                      disabled={isBusyOpenAI || a.openai_processed}
                      style={{ 
                        padding: "10px 14px", 
                        background: isBusyOpenAI ? "#95a5a6" : (a.openai_processed ? "#28a745" : "#00b894"), 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 8,
                        cursor: isBusyOpenAI ? "not-allowed" : "pointer",
                        flex: 1
                      }}
                    >
                      {isBusyOpenAI ? "⏳ जेनरेट हो रहा है…" : (a.openai_processed ? "✅ OpenAI हो गया" : "🤖 जेनरेट करें (OpenAI)")}
                    </button>
                    <button
                      onClick={() => gen(a.id, "deepseek")}
                      disabled={isBusyDeepSeek || a.deepseek_processed}
                      style={{ 
                        padding: "10px 14px", 
                        background: isBusyDeepSeek ? "#95a5a6" : (a.deepseek_processed ? "#6f42c1" : "#9c27b0"), 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 8,
                        cursor: isBusyDeepSeek ? "not-allowed" : "pointer",
                        flex: 1
                      }}
                    >
                      {isBusyDeepSeek ? "⏳ जेनरेट हो रहा है…" : (a.deepseek_processed ? "✅ DeepSeek हो गया" : "🤖 जेनरेट करें (DeepSeek)")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
        </div>
      ) : tab === "processed-openai" ? (
        <div>
          <h2>✅ OpenAI प्रोसेस्ड हिंदी क्रिकेट आर्टिकल्स (पेज {ppo} of {ptpo})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processedOpenAI.map((a) => {
              const { date, time } = fmt(getProcOpenAI(a));
              const title = a.openai_final_title || a.title;
              const meta  = a.openai_final_meta || "";
              const slug  = a.openai_final_slug || "article";

              return (
                <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <div>OpenAI प्रोसेस्ड: {date} {time}</div>
                      <div>📰 {a.source_name}</div>
                    </div>
                  </div>

                  <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                    <div><strong>मेटा टाइटल:</strong> {title}</div>
                    {meta && <div><strong>मेटा डिस्क्रिप्शन:</strong> {meta}</div>}
                    {slug && <div><strong>स्लग:</strong> {slug}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(a.openai_ready_article || "")} style={{ cursor: "pointer" }}>📋 पूरा HTML कॉपी करें</button>
                    <button onClick={() => {
                      const blob = new Blob([a.openai_ready_article || ""], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const aTag = document.createElement("a");
                      aTag.href = url;
                      aTag.download = `${slug}.html`;
                      aTag.click();
                      URL.revokeObjectURL(url);
                    }} style={{ cursor: "pointer" }}>💾 HTML डाउनलोड करें</button>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <iframe title={`preview-${a.id}`} srcDoc={a.openai_ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={ppo} total={ptpo} totalCount={ptco} onChange={fetchProcessedOpenAI} />
        </div>
      ) : tab === "processed-deepseek" ? (
        <div>
          <h2>🤖 DeepSeek प्रोसेस्ड हिंदी क्रिकेट आर्टिकल्स (पेज {ppd} of {ptpd})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processedDeepSeek.map((a) => {
              const { date, time } = fmt(getProcDeepSeek(a));
              const title = a.final_title || a.title;
              const meta  = a.final_meta || "";
              const slug  = a.final_slug || "article";

              return (
                <div key={a.id} style={{ border: "1px solid #d1c4e9", borderRadius: 10, padding: 16, background: "#f3e5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <div>DeepSeek प्रोसेस्ड: {date} {time}</div>
                      <div>📰 {a.source_name}</div>
                    </div>
                  </div>

                  <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                    <div><strong>मेटा टाइटल:</strong> {title}</div>
                    {meta && <div><strong>मेटा डिस्क्रिप्शन:</strong> {meta}</div>}
                    {slug && <div><strong>स्लग:</strong> {slug}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(a.ready_article || "")} style={{ cursor: "pointer" }}>📋 पूरा HTML कॉपी करें</button>
                    <button onClick={() => {
                      const blob = new Blob([a.ready_article || ""], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const aTag = document.createElement("a");
                      aTag.href = url;
                      aTag.download = `${slug}.html`;
                      aTag.click();
                      URL.revokeObjectURL(url);
                    }} style={{ cursor: "pointer" }}>💾 HTML डाउनलोड करें</button>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <iframe title={`preview-${a.id}`} srcDoc={a.ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={ppd} total={ptpd} totalCount={ptcd} onChange={fetchProcessedDeepSeek} />
        </div>
      ) : tab === "compare" ? (
        <div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
            <button 
              disabled={loading} 
              onClick={() => fetchCompared(pcp)}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 तुलना रिफ्रेश करें"}
            </button>
          </div>

          <h2>🔄 साइड-बाय-साइड तुलना: OpenAI vs DeepSeek (पेज {pcp} of {ptcp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {compared.map((a) => {
              const { date: dateOpenAI, time: timeOpenAI } = fmt(a.openai_processed_at_iso || a.openai_processed_at);
              const { date: dateDeepSeek, time: timeDeepSeek } = fmt(a.processed_at_iso || a.processed_at);
              const titleOpenAI = a.openai_final_title || a.title;
              const titleDeepSeek = a.final_title || a.title;
              const metaOpenAI = a.openai_final_meta || "";
              const metaDeepSeek = a.final_meta || "";
              const slug = a.openai_final_slug || a.final_slug || "article";

              return (
                <div key={a.id} style={{ border: "2px solid #ff6b35", borderRadius: 12, padding: 16, background: "#fff5f2" }}>
                  <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #ff6b35" }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#333" }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>📰 {a.source_name}</span>
                      <span>📅 मूल: {fmt(getPub(a)).date}</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* OpenAI Column */}
                    <div style={{ border: "2px solid #28a745", borderRadius: 10, padding: 12, background: "#f0fff4" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: "#28a745", fontSize: 16 }}>✅ OpenAI</div>
                        <div style={{ fontSize: 11, color: "#666" }}>{dateOpenAI} {timeOpenAI}</div>
                      </div>
                      
                      <div style={{ background: "#e8f5e9", padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 12 }}>
                        <div><strong>टाइटल:</strong> {titleOpenAI}</div>
                        {metaOpenAI && <div><strong>मेटा:</strong> {metaOpenAI}</div>}
                      </div>

                      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                        <button 
                          onClick={() => navigator.clipboard.writeText(a.openai_ready_article || "")} 
                          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
                        >
                          📋 कॉपी
                        </button>
                        <button 
                          onClick={() => {
                            const blob = new Blob([a.openai_ready_article || ""], { type: "text/html" });
                            const url = URL.createObjectURL(blob);
                            const aTag = document.createElement("a");
                            aTag.href = url;
                            aTag.download = `${slug}-openai.html`;
                            aTag.click();
                            URL.revokeObjectURL(url);
                          }} 
                          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
                        >
                          💾 डाउनलोड
                        </button>
                      </div>

                      <div style={{ border: "1px solid #a7f3d0", borderRadius: 6, overflow: "hidden" }}>
                        <iframe 
                          title={`openai-preview-${a.id}`} 
                          srcDoc={a.openai_ready_article || ""} 
                          style={{ width: "100%", height: 400, border: "none" }} 
                        />
                      </div>
                    </div>

                    {/* DeepSeek Column */}
                    <div style={{ border: "2px solid #6f42c1", borderRadius: 10, padding: 12, background: "#f3e5f5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: "#6f42c1", fontSize: 16 }}>🤖 DeepSeek</div>
                        <div style={{ fontSize: 11, color: "#666" }}>{dateDeepSeek} {timeDeepSeek}</div>
                      </div>
                      
                      <div style={{ background: "#ede7f6", padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 12 }}>
                        <div><strong>टाइटल:</strong> {titleDeepSeek}</div>
                        {metaDeepSeek && <div><strong>मेटा:</strong> {metaDeepSeek}</div>}
                      </div>

                      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                        <button 
                          onClick={() => navigator.clipboard.writeText(a.ready_article || "")} 
                          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#6f42c1", color: "#fff", border: "none", borderRadius: 4 }}
                        >
                          📋 कॉपी
                        </button>
                        <button 
                          onClick={() => {
                            const blob = new Blob([a.ready_article || ""], { type: "text/html" });
                            const url = URL.createObjectURL(blob);
                            const aTag = document.createElement("a");
                            aTag.href = url;
                            aTag.download = `${slug}-deepseek.html`;
                            aTag.click();
                            URL.revokeObjectURL(url);
                          }} 
                          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#6f42c1", color: "#fff", border: "none", borderRadius: 4 }}
                        >
                          💾 डाउनलोड
                        </button>
                      </div>

                      <div style={{ border: "1px solid #d1c4e9", borderRadius: 6, overflow: "hidden" }}>
                        <iframe 
                          title={`deepseek-preview-${a.id}`} 
                          srcDoc={a.ready_article || ""} 
                          style={{ width: "100%", height: 400, border: "none" }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pager page={pcp} total={ptcp} totalCount={ptcc} onChange={fetchCompared} />
        </div>
      ) : null}
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
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16, flexWrap: "wrap" }}>
      <button disabled={page===1} onClick={() => onChange(1)} style={{ cursor: page===1 ? "not-allowed" : "pointer" }}>पहला</button>
      <button disabled={page===1} onClick={() => onChange(page-1)} style={{ cursor: page===1 ? "not-allowed" : "pointer" }}>पिछला</button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal", cursor: "pointer" }}>{n}</button>
      ))}
      <button disabled={page===total} onClick={() => onChange(page+1)} style={{ cursor: page===total ? "not-allowed" : "pointer" }}>अगला</button>
      <button disabled={page===total} onClick={() => onChange(total)} style={{ cursor: page===total ? "not-allowed" : "pointer" }}>अंतिम</button>
      <span style={{ marginLeft: 8, color: "#666" }}>पेज {page} of {total} ({totalCount})</span>
    </div>
  );
}

