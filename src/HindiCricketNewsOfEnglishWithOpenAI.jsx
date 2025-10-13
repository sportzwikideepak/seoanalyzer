import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// const API = "http://localhost:5000";

const PAGE = 25;

export default function HindiCricketNewsOfEnglishWithOpenAI() {
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

  // Fetch stored English cricket news for Hindi conversion
  const fetchStored = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/hindi-cricket-news/stored-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setStored(r.data.news || []);
        setStc(r.data.totalCount || 0);
        setStp(Math.max(1, Math.ceil((r.data.totalCount || 0) / PAGE)));
        setSp(page);
        console.log("📰 Fetched English cricket news for Hindi conversion:", r.data.news?.length);
      }
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch processed Hindi cricket articles
  const fetchProcessed = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/hindi-cricket-news/processed-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setProcessed(r.data.news || []);
        setPtc(r.data.totalCount || 0);
        setPtp(Math.max(1, Math.ceil((r.data.totalCount || 0) / PAGE)));
        setPp(page);
        console.log("✅ Fetched Hindi cricket articles:", r.data.news?.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("🏏 Hindi Cricket News (English→Hindi with OpenAI GPT-5) Component mounted");
    console.log("🕒 Current system time:", new Date().toLocaleString("en-IN"));
    fetchStored(1);
    fetchProcessed(1);
  }, []);

  // Generate Hindi article from English cricket news using OpenAI GPT-5
  const gen = async (id) => {
    setBusy((m) => ({ ...m, [id]: true }));
    try {
      console.log(`🎨 Converting English article ${id} to Hindi with OpenAI GPT-5...`);
      const r = await axios.post(`${API}/api/hindi-cricket-news/articles/${id}/generate`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");
      
      console.log("✅ Hindi article generated with GPT-5:", r.data);
      await fetchStored(sp);
      await fetchProcessed(pp);
      
      alert(`✅ Hindi article generated successfully with GPT-5!\n\n📊 Style: ${r.data.metadata?.style}\n🤖 Model: ${r.data.metadata?.model}\n⏱️ Time: ${(r.data.metadata?.processingTime / 1000).toFixed(2)}s`);
    } catch (e) {
      console.error("❌ Hindi generation error:", e);
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
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
        <h1 style={styles.mainTitle}>🏏 Hindi Cricket News Generator</h1>
        <p style={styles.subtitle}>
          English Cricket News → Hindi Articles • OpenAI GPT-5 Powered
        </p>
        <div style={styles.systemInfo}>
          🕒 {new Date().toLocaleString("en-IN")} | 🌐 API: {API} | 📊 Using cricket_news table | 🤖 GPT-5
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
          📰 English Cricket News ({stc})
        </button>
        <button
          onClick={() => setTab("processed")}
          style={{
            ...styles.tab,
            ...(tab === "processed" ? styles.tabActiveGreen : styles.tabInactive)
          }}
        >
          ✅ Hindi Articles ({ptc})
        </button>
      </div>

      {/* Refresh Button */}
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

/* ========== STORED ENGLISH NEWS TAB (For Hindi Conversion) ========== */
function StoredNewsTab({ stored, sp, stp, stc, busy, gen, fmt, getPub, fetchStored }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📰 English Cricket News → Convert to Hindi with GPT-5 (Page {sp} of {stp})</h2>
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
                  {a.hindi_processed && <span style={styles.badgeSuccess}>✅ Hindi Ready</span>}
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
                {isBusy ? "⏳ Converting with GPT-5…" : "🎨 Convert to Hindi (GPT-5)"}
              </button>
            </div>
          );
        })}
      </div>
      <Pager page={sp} total={stp} totalCount={stc} onChange={fetchStored} />
    </div>
  );
}

/* ========== PROCESSED HINDI NEWS TAB ========== */
function ProcessedNewsTab({ processed, pp, ptp, ptc, fmt, getProc, copyToClipboard, downloadHTML, fetchProcessed }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>✅ Hindi Cricket Articles (Generated with GPT-5) (Page {pp} of {ptp})</h2>
      <div style={styles.cardContainer}>
        {processed.map((a) => {
          const { date, time } = fmt(getProc(a));
          const title = a.hindi_final_title || a.title;
          const meta = a.hindi_final_meta || "";
          const slug = a.hindi_final_slug || "article";

          return (
            <div key={a.id} style={styles.processedCard}>
              <div style={styles.processedHeader}>
                <div style={styles.processedTitle}>{title}</div>
                <div style={styles.processedMeta}>
                  <div>✅ Hindi Processed with GPT-5: {date} {time}</div>
                  <div>📰 {a.source_name}</div>
                </div>
              </div>

              <div style={styles.metaBox}>
                <div><strong>Hindi Title:</strong> {title}</div>
                {meta && <div><strong>Hindi Meta Description:</strong> {meta}</div>}
                {slug && <div><strong>Slug:</strong> {slug}</div>}
                <div style={{ marginTop: '8px', padding: '8px', background: '#e8f5e8', borderRadius: '4px', fontSize: '0.85rem' }}>
                  <strong>🤖 Generated with:</strong> OpenAI GPT-5
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => copyToClipboard(a.hindi_ready_article, "Hindi HTML")}
                  style={{ ...styles.button, ...styles.buttonInfo }}
                >
                  📋 Copy Hindi HTML
                </button>
                <button
                  onClick={() => downloadHTML(a.hindi_ready_article, slug)}
                  style={{ ...styles.button, ...styles.buttonSuccess }}
                >
                  💾 Download Hindi HTML
                </button>
                <button
                  onClick={() => copyToClipboard(title, "Hindi Title")}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  📝 Copy Hindi Title
                </button>
                <button
                  onClick={() => copyToClipboard(meta, "Hindi Meta")}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  📄 Copy Hindi Meta
                </button>
              </div>

              <div style={styles.previewContainer}>
                <iframe
                  title={`preview-${a.id}`}
                  srcDoc={a.hindi_ready_article || ""}
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
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
    background: '#ff6b6b',
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
  buttonSecondary: {
    background: '#6c757d',
    color: '#fff'
  },
  buttonGenerate: {
    background: '#ff6b6b',
    color: '#fff',
    minWidth: '200px'
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
    color: '#ff6b6b',
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
    border: '2px solid #ff6b6b',
    borderRadius: '12px',
    padding: '25px',
    background: '#fff5f5',
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
    background: '#ffe8e8',
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
    background: '#ff6b6b',
    color: '#fff',
    transition: 'all 0.2s ease'
  },
  pagerButtonActive: {
    background: '#ee5a24',
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