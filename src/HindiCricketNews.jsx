import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

const PAGE = 25;

export default function HindiCricketNews() {
  const [stored, setStored] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [sp, setSp] = useState(1);
  const [pp, setPp] = useState(1);
  const [stp, setStp] = useState(1);
  const [ptp, setPtp] = useState(1);
  const [stc, setStc] = useState(0);
  const [ptc, setPtc] = useState(0);

  // --- SIMPLE FIX for timezone ---
  const fmt = (v) => {
    console.log("⏰ fmt function input:", v);
    if (!v) return { date: "-", time: "-" };
    
    // Extract time directly from the string
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
        `${API}/api/hindi/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setStored(r.data.news || []);
        const total = r.data.totalCount || 0;
        setStc(total);
        setStp(Math.max(1, Math.ceil(total / PAGE)));
        setSp(page);
        console.log("📰 Fetched stored Hindi news:", r.data.news?.length, "articles");
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
        `${API}/api/hindi/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessed(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtc(total);
        setPtp(Math.max(1, Math.ceil(total / PAGE)));
        setPp(page);
        console.log("✅ Fetched processed Hindi news:", r.data.news?.length, "articles");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("🇮🇳 Hindi Component mounted");
    console.log("�� Current system time:", new Date().toLocaleString("en-IN"));
    fetchStored(1);
    fetchProcessed(1);
  }, []);

  const gen = async (id) => {
    setBusy((m) => ({ ...m, [id]: true }));
    try {
      const r = await axios.post(`${API}/api/hindi/process-article/${id}`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      await fetchStored(sp);
      await fetchProcessed(pp);
      alert("✅ Hindi article generated.");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  };

  const manualFetch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/hindi/manual-fetch-news`);
      await fetchStored(1);
      setSp(1);
      alert("Hindi news fetched.");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>���� हिंदी क्रिकेट न्यूज़</h1>
        <p>24/7 हिंदी समाचार प्राप्ति और एक-क्लिक लेख निर्माण</p>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setTab("stored")}
          style={{ padding: "10px 16px", background: tab === "stored" ? "#007bff" : "#f3f4f6", color: tab === "stored" ? "#fff" : "#333" }}
        >
          संग्रहीत समाचार ({stc})
        </button>
        <button
          onClick={() => setTab("processed")}
          style={{ padding: "10px 16px", background: tab === "processed" ? "#28a745" : "#f3f4f6", color: tab === "processed" ? "#fff" : "#333" }}
        >
          ✅ प्रसंस्कृत लेख ({ptc})
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
        <button disabled={loading} onClick={() => { fetchStored(sp); fetchProcessed(pp); }}>
          {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 सभी रिफ्रेश करें"}
        </button>
        <button disabled={loading} onClick={manualFetch}>
          {loading ? "⏳ प्राप्त हो रहा है…" : "📰 नया समाचार प्राप्त करें"}
        </button>
      </div>

      {tab === "stored" ? (
        <div>
          <h2>नवीनतम संग्रहीत समाचार (पृष्ठ {sp} का {stp})</h2>
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
                      {typeof a.word_count === "number" && <span>�� {a.word_count} शब्द</span>}
                      {a.processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ प्रसंस्कृत</span> : null}
                    </div>
                  </div>
                  <button
                    onClick={() => gen(a.id)}
                    disabled={isBusy}
                    style={{ padding: "10px 14px", background: isBusy ? "#95a5a6" : "#00b894", color: "#fff", border: "none", borderRadius: 8 }}
                  >
                    {isBusy ? "⏳ निर्माण हो रहा है…" : "🧠 लेख निर्माण (AI)"}
                  </button>
                </div>
              );
            })}
          </div>
          <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
        </div>
      ) : (
        <div>
          <h2>✅ प्रसंस्कृत लेख (पृष्ठ {pp} का {ptp})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processed.map((a) => {
              const { date, time } = fmt(getProc(a));
              const title = a.final_title || a.title;
              const meta  = a.final_meta || "";
              const slug  = a.final_slug || "article";

              return (
                <div key={a.id} style={{ border: "1px solid #a7f3d0", borderRadius: 10, padding: 16, background: "#f0fff4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <div>प्रसंस्कृत: {date} {time}</div>
                      <div>📰 {a.source_name}</div>
                    </div>
                  </div>

                  <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                    <div><strong>मेटा शीर्षक:</strong> {title}</div>
                    {meta && <div><strong>मेटा विवरण:</strong> {meta}</div>}
                    {slug && <div><strong>स्लग:</strong> {slug}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(a.ready_article || "")}>📋 पूरा HTML कॉपी करें</button>
                    <button onClick={() => {
                      const blob = new Blob([a.ready_article || ""], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const aTag = document.createElement("a");
                      aTag.href = url;
                      aTag.download = `${slug}.html`;
                      aTag.click();
                      URL.revokeObjectURL(url);
                    }}>💾 HTML डाउनलोड करें</button>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                    <iframe title={`preview-${a.id}`} srcDoc={a.ready_article || ""} style={{ width: "100%", height: 500, border: "none" }} />
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
      <button disabled={page===1} onClick={() => onChange(1)}>पहला</button>
      <button disabled={page===1} onClick={() => onChange(page-1)}>पिछला</button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n===page ? "bold" : "normal" }}>{n}</button>
      ))}
      <button disabled={page===total} onClick={() => onChange(page+1)}>अगला</button>
      <button disabled={page===total} onClick={() => onChange(total)}>अंतिम</button>
      <span style={{ marginLeft: 8, color: "#666" }}>पृष्ठ {page} का {total} ({totalCount})</span>
    </div>
  );
}