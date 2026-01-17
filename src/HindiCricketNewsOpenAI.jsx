import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";
// const API = "http://localhost:5000";

const PAGE = 25;

export default function HindiCricketNewsOpenAI() {
  const [stored, setStored] = useState([]);
  const [processedOpenAI, setProcessedOpenAI] = useState([]);
  const [processedDeepSeek, setProcessedDeepSeek] = useState([]);
  const [compared, setCompared] = useState([]);
  const [englishConverted, setEnglishConverted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stored");
  const [busy, setBusy] = useState({});
  const [provider, setProvider] = useState("openai");

  const [sp, setSp] = useState(1);
  const [ppo, setPpo] = useState(1);
  const [ppd, setPpd] = useState(1);
  const [pcp, setPcp] = useState(1);
  const [pec, setPec] = useState(1);
  const [stp, setStp] = useState(1);
  const [ptpo, setPtpo] = useState(1);
  const [ptpd, setPtpd] = useState(1);
  const [ptcp, setPtcp] = useState(1);
  const [ptec, setPtec] = useState(1);
  const [stc, setStc] = useState(0);
  const [ptco, setPtco] = useState(0);
  const [ptcd, setPtcd] = useState(0);
  const [ptcc, setPtcc] = useState(0);
  const [ptce, setPtce] = useState(0);

  const fmt = (v) => {
    if (!v) return { date: "-", time: "-" };
    const match = v.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, hh, mm] = match;
      const h24 = parseInt(hh, 10);
      const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24;
      const ampm = h24 >= 12 ? "pm" : "am";
      return {
        date: new Date(v).toLocaleDateString("en-IN"),
        time: `${h12}:${mm} ${ampm}`,
      };
    }
    return { date: "-", time: "-" };
  };

  const getPub = (row) => row.published_at_iso ?? row.published_at;
  const getProcOpenAI = (row) => row.openai_processed_at_iso ?? row.openai_processed_at;
  const getProcDeepSeek = (row) => row.processed_at_iso ?? row.processed_at;
  const getEnglishConverted = (row) => row.english_converted_at_iso ?? row.english_converted_at;

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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProcessedDeepSeek = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEnglishConverted = async (page = 1) => {
    try {
      const offset = (page - 1) * PAGE;
      const r = await axios.get(
        `${API}/api/hindi-cricket-openai/english-converted-news?limit=${PAGE}&offset=${offset}&_=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (r.data?.success) {
        setEnglishConverted(r.data.news || []);
        const total = r.data.totalCount || 0;
        setPtce(total);
        setPtec(Math.max(1, Math.ceil(total / PAGE)));
        setPec(page);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCompared = async (page = 1) => {
    try {
      let allOpenAI = [];
      let offsetOpenAI = 0;
      let hasMoreOpenAI = true;
      while (hasMoreOpenAI) {
        const res = await axios.get(
          `${API}/api/hindi-cricket-openai/processed-news?limit=100&offset=${offsetOpenAI}&_=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        if (res.data?.success && res.data.news?.length) {
          allOpenAI = allOpenAI.concat(res.data.news);
          offsetOpenAI += 100;
          if (res.data.news.length < 100) hasMoreOpenAI = false;
        } else {
          hasMoreOpenAI = false;
        }
      }

      let allDeepSeek = [];
      let offsetDeep = 0;
      let hasMoreDeep = true;
      while (hasMoreDeep) {
        const res = await axios.get(
          `${API}/api/hindi/processed-news?limit=100&offset=${offsetDeep}&_=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        if (res.data?.success && res.data.news?.length) {
          allDeepSeek = allDeepSeek.concat(res.data.news);
          offsetDeep += 100;
          if (res.data.news.length < 100) hasMoreDeep = false;
        } else {
          hasMoreDeep = false;
        }
      }

      const openaiIds = new Set(allOpenAI.map((a) => a.id));
      const deepIds = new Set(allDeepSeek.map((a) => a.id));
      const commonIds = [...openaiIds].filter((id) => deepIds.has(id));

      const comparedArticles = allOpenAI
        .filter((item) => commonIds.includes(item.id))
        .map((openaiItem) => {
          const deepItem = allDeepSeek.find((d) => d.id === openaiItem.id);
          return {
            ...openaiItem,
            ready_article: deepItem?.ready_article || "",
            final_title: deepItem?.final_title || openaiItem.title,
            final_meta: deepItem?.final_meta || "",
            final_slug: deepItem?.final_slug || "article",
            processed_at: deepItem?.processed_at || null,
            processed_at_iso: deepItem?.processed_at_iso || null,
          };
        });

      comparedArticles.sort((a, b) => {
        const dA = new Date(a.openai_processed_at || a.openai_processed_at_iso || 0);
        const dB = new Date(b.openai_processed_at || b.openai_processed_at_iso || 0);
        return dB - dA;
      });

      const offset = (page - 1) * PAGE;
      const paginated = comparedArticles.slice(offset, offset + PAGE);
      setCompared(paginated);
      setPtcc(comparedArticles.length);
      setPtcp(Math.max(1, Math.ceil(comparedArticles.length / PAGE)));
      setPcp(page);
    } catch (e) {
      console.error("Comparison fetch error:", e);
    }
  };

  useEffect(() => {
    fetchStored(1);
    fetchProcessedOpenAI(1);
    fetchProcessedDeepSeek(1);
    fetchCompared(1);
    fetchEnglishConverted(1);
  }, []);

  const gen = async (id, providerType) => {
    const providerKey = `${id}-${providerType}`;
    setBusy((m) => ({ ...m, [providerKey]: true }));
    try {
      const endpoint =
        providerType === "openai"
          ? `${API}/api/hindi-cricket-openai/articles/${id}/generate`
          : `${API}/api/hindi/process-article/${id}`; // purana DeepSeek endpoint

      const r = await axios.post(endpoint);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");

      await fetchStored(sp);
      await fetchProcessedOpenAI(ppo);
      await fetchProcessedDeepSeek(ppd);
      await fetchCompared(pcp);

      alert(
        `✅ Hindi Cricket article generated successfully with ${
          providerType === "openai" ? "OpenAI" : "DeepSeek"
        }!`
      );
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [providerKey]: false }));
    }
  };

  const convertToEnglish = async (id) => {
    const convertKey = `convert-${id}`;
    setBusy((m) => ({ ...m, [convertKey]: true }));
    try {
      const r = await axios.post(`${API}/api/hindi-cricket-openai/articles/${id}/convert-to-english`);
      if (!r.data?.success) throw new Error(r.data?.error || "Failed");

      await fetchStored(sp);
      await fetchProcessedOpenAI(ppo);
      await fetchEnglishConverted(pec);
      alert("✅ Hindi article converted to English successfully!");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setBusy((m) => ({ ...m, [convertKey]: false }));
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
        <div style={{ fontSize: 12, color: "#999", marginTop: 10 }}>
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
            fontWeight: tab === "stored" ? "bold" : "normal",
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
            fontWeight: tab === "processed-openai" ? "bold" : "normal",
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
            fontWeight: tab === "processed-deepseek" ? "bold" : "normal",
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
            fontWeight: tab === "compare" ? "bold" : "normal",
          }}
        >
          🔄 दोनों की तुलना ({ptcc})
        </button>
        <button
          onClick={() => setTab("english-converted")}
          style={{
            padding: "10px 16px",
            background: tab === "english-converted" ? "#ff9800" : "#f3f4f6",
            color: tab === "english-converted" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            fontWeight: tab === "english-converted" ? "bold" : "normal",
          }}
        >
          🌐 English Converted ({ptce})
        </button>
      </div>

      {tab === "stored" ? (
        <StoredView
          stored={stored}
          fmt={fmt}
          getPub={getPub}
          busy={busy}
          onGenerate={gen}
          onConvertToEnglish={convertToEnglish}
          provider={provider}
          loading={loading}
          fetchAll={() => {
            fetchStored(sp);
            fetchProcessedOpenAI(ppo);
            fetchProcessedDeepSeek(ppd);
            fetchCompared(pcp);
            fetchEnglishConverted(pec);
          }}
          manualFetch={manualFetch}
          sp={sp}
          stp={stp}
          stc={stc}
          setPaged={fetchStored}
          setProvider={setProvider}
        />
      ) : tab === "processed-openai" ? (
        <ProcessedView
          items={processedOpenAI}
          fmt={fmt}
          getProc={getProcOpenAI}
          titleField="openai_final_title"
          metaField="openai_final_meta"
          slugField="openai_final_slug"
          htmlField="openai_ready_article"
          page={ppo}
          total={ptpo}
          totalCount={ptco}
          onChange={fetchProcessedOpenAI}
          busy={busy}
          onConvertToEnglish={convertToEnglish}
          englishTitleField="english_final_title"
          englishMetaField="english_final_meta"
          englishSlugField="english_final_slug"
          englishHtmlField="english_ready_article"
        />
      ) : tab === "processed-deepseek" ? (
        <ProcessedView
          items={processedDeepSeek}
          fmt={fmt}
          getProc={getProcDeepSeek}
          titleField="final_title"
          metaField="final_meta"
          slugField="final_slug"
          htmlField="ready_article"
          page={ppd}
          total={ptpd}
          totalCount={ptcd}
          onChange={fetchProcessedDeepSeek}
          busy={busy}
          onConvertToEnglish={null}
        />
      ) : tab === "english-converted" ? (
        <EnglishConvertedView
          items={englishConverted}
          fmt={fmt}
          getProc={getEnglishConverted}
          page={pec}
          total={ptec}
          totalCount={ptce}
          onChange={fetchEnglishConverted}
        />
      ) : (
        <CompareView
          compared={compared}
          fmt={fmt}
          getPub={getPub}
          page={pcp}
          total={ptcp}
          totalCount={ptcc}
          onChange={fetchCompared}
        />
      )}
    </div>
  );
}

function StoredView({
  stored,
  fmt,
  getPub,
  busy,
  onGenerate,
  onConvertToEnglish,
  provider,
  setProvider,
  loading,
  fetchAll,
  manualFetch,
  sp,
  stp,
  stc,
  setPaged,
}) {
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: "#f8f9fa",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
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

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
        <button disabled={loading} onClick={fetchAll}>
          {loading ? "⏳ रिफ्रेश हो रहा है…" : "🔄 सभी रिफ्रेश करें"}
        </button>
        <button disabled={loading} onClick={manualFetch}>
          {loading ? "⏳ फेच हो रहा है…" : "🏏 हिंदी क्रिकेट न्यूज़ फेच करें"}
        </button>
      </div>

      <h2>नवीनतम हिंदी क्रिकेट न्यूज़ (पेज {sp} of {stp})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {stored.map((a) => {
          const { date, time } = fmt(getPub(a));
          const isBusyOpenAI = !!busy[`${a.id}-openai`];
          const isBusyDeepSeek = !!busy[`${a.id}-deepseek`];
          const isConverting = !!busy[`convert-${a.id}`];
          const hasEnglish = !!(a.english_ready_article);

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
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      if (a.source_url) window.open(a.source_url, "_blank", "noopener,noreferrer");
                      else alert("No source URL available");
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
                    {a.processed && <span style={{ color: "#6f42c1", fontWeight: 700 }}>🤖 DeepSeek</span>}
                    {hasEnglish && <span style={{ color: "#ff6b35", fontWeight: 700 }}>🌐 English Available</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => onGenerate(a.id, "openai")}
                  disabled={isBusyOpenAI || a.openai_processed}
                  style={{
                    padding: "10px 14px",
                    background: isBusyOpenAI ? "#95a5a6" : a.openai_processed ? "#28a745" : "#00b894",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: isBusyOpenAI ? "not-allowed" : "pointer",
                    flex: 1,
                    minWidth: "150px",
                  }}
                >
                  {isBusyOpenAI ? "⏳ जेनरेट हो रहा है…" : a.openai_processed ? "✅ OpenAI हो गया" : "🤖 जेनरेट करें (OpenAI)"}
                </button>
                <button
                  onClick={() => onGenerate(a.id, "deepseek")}
                  disabled={isBusyDeepSeek || a.processed}
                  style={{
                    padding: "10px 14px",
                    background: isBusyDeepSeek ? "#95a5a6" : a.processed ? "#6f42c1" : "#9c27b0",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: isBusyDeepSeek ? "not-allowed" : "pointer",
                    flex: 1,
                    minWidth: "150px",
                  }}
                >
                  {isBusyDeepSeek ? "⏳ जेनरेट हो रहा है…" : a.processed ? "✅ DeepSeek हो गया" : "🤖 जेनरेट करें (DeepSeek)"}
                </button>
                {onConvertToEnglish && (
                  <button
                    onClick={() => onConvertToEnglish(a.id)}
                    disabled={isConverting || hasEnglish}
                    style={{
                      padding: "10px 14px",
                      background: isConverting ? "#95a5a6" : hasEnglish ? "#28a745" : "#ff6b35",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: isConverting || hasEnglish ? "not-allowed" : "pointer",
                      minWidth: "180px",
                    }}
                  >
                    {isConverting ? "⏳ Converting..." : hasEnglish ? "✅ English Ready" : "🌐 Convert with OpenAI"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Pager page={sp} total={stp} totalCount={stc} onChange={setPaged} />
    </div>
  );
}

function ProcessedView({ 
  items, 
  fmt, 
  getProc, 
  titleField, 
  metaField, 
  slugField, 
  htmlField, 
  page, 
  total, 
  totalCount, 
  onChange,
  busy,
  onConvertToEnglish,
  englishTitleField,
  englishMetaField,
  englishSlugField,
  englishHtmlField
}) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((a) => {
          const { date, time } = fmt(getProc(a));
          const title = a[titleField] || a.title;
          const meta = a[metaField] || "";
          const slug = a[slugField] || "article";
          const html = a[htmlField] || "";

          // English version fields (if available)
          const englishTitle = englishTitleField ? (a[englishTitleField] || "") : "";
          const englishMeta = englishMetaField ? (a[englishMetaField] || "") : "";
          const englishSlug = englishSlugField ? (a[englishSlugField] || "") : "";
          const englishHtml = englishHtmlField ? (a[englishHtmlField] || "") : "";
          const hasEnglish = !!englishHtml;
          const isConverting = onConvertToEnglish ? !!busy[`convert-${a.id}`] : false;

          return (
            <div key={a.id} style={{ border: "1px solid #d1c4e9", borderRadius: 10, padding: 16, background: "#f3e5f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  <div>Processed: {date} {time}</div>
                  <div>📰 {a.source_name}</div>
                  {hasEnglish && <div style={{ color: "#28a745", fontWeight: 700, marginTop: 4 }}>✅ English Available</div>}
                </div>
              </div>

              <div style={{ background: "#ede7f6", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                <div><strong>मेटा टाइटल:</strong> {title}</div>
                {meta && <div><strong>मेटा डिस्क्रिप्शन:</strong> {meta}</div>}
                {slug && <div><strong>स्लग:</strong> {slug}</div>}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <button onClick={() => navigator.clipboard.writeText(html)}>📋 पूरा HTML कॉपी करें</button>
                <button
                  onClick={() => {
                    const blob = new Blob([html], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const aTag = document.createElement("a");
                    aTag.href = url;
                    aTag.download = `${slug}.html`;
                    aTag.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 HTML डाउनलोड करें
                </button>
                {onConvertToEnglish && (
                  <button
                    onClick={() => onConvertToEnglish(a.id)}
                    disabled={isConverting || hasEnglish}
                    style={{
                      background: isConverting ? "#95a5a6" : hasEnglish ? "#28a745" : "#ff6b35",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 12px",
                      cursor: isConverting || hasEnglish ? "not-allowed" : "pointer",
                    }}
                  >
                    {isConverting ? "⏳ Converting..." : hasEnglish ? "✅ English Ready" : "🌐 Convert to English"}
                  </button>
                )}
              </div>

              {/* English Version Section */}
              {hasEnglish && (
                <div style={{ border: "2px solid #28a745", borderRadius: 8, padding: 12, marginBottom: 10, background: "#f0fff4" }}>
                  <div style={{ fontWeight: 700, color: "#28a745", marginBottom: 8, fontSize: 16 }}>🌐 English Version</div>
                  <div style={{ background: "#e8f5e9", padding: 8, borderRadius: 6, marginBottom: 8, fontSize: 13 }}>
                    <div><strong>Title:</strong> {englishTitle}</div>
                    {englishMeta && <div><strong>Meta:</strong> {englishMeta}</div>}
                    {englishSlug && <div><strong>Slug:</strong> {englishSlug}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => navigator.clipboard.writeText(englishHtml)}
                      style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
                    >
                      📋 Copy English HTML
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([englishHtml], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const aTag = document.createElement("a");
                        aTag.href = url;
                        aTag.download = `${englishSlug || slug}-english.html`;
                        aTag.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
                    >
                      💾 Download English HTML
                    </button>
                  </div>
                  <div style={{ border: "1px solid #28a745", borderRadius: 6, overflow: "hidden" }}>
                    <iframe title={`english-preview-${a.id}`} srcDoc={englishHtml} style={{ width: "100%", height: 400, border: "none" }} />
                  </div>
                </div>
              )}

              {/* Hindi Version Preview */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: "#f3e5f5", padding: 8, fontWeight: 700, fontSize: 14 }}>🇮🇳 Hindi Version</div>
                <iframe title={`preview-${a.id}`} srcDoc={html} style={{ width: "100%", height: 500, border: "none" }} />
              </div>
            </div>
          );
        })}
      </div>
      <Pager page={page} total={total} totalCount={totalCount} onChange={onChange} />
    </div>
  );
}

function EnglishConvertedView({ items, fmt, getProc, page, total, totalCount, onChange }) {
  return (
    <div>
      <h2>🌐 English Converted Articles (Page {page} of {total})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((a) => {
          const { date, time } = fmt(getProc(a));
          const englishTitle = a.english_final_title || a.title;
          const englishMeta = a.english_final_meta || "";
          const englishSlug = a.english_final_slug || "article";
          const englishHtml = a.english_ready_article || "";

          return (
            <div key={a.id} style={{ border: "2px solid #ff9800", borderRadius: 10, padding: 16, background: "#fff3e0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#ff9800" }}>🌐 English Converted</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  <div>Converted: {date} {time}</div>
                  <div>📰 {a.source_name}</div>
                </div>
              </div>

              <div style={{ background: "#ffe0b2", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
                <div><strong>English Title:</strong> {englishTitle}</div>
                {englishMeta && <div><strong>English Meta:</strong> {englishMeta}</div>}
                {englishSlug && <div><strong>English Slug:</strong> {englishSlug}</div>}
              </div>

              <div style={{ background: "#f9f9f9", padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 12 }}>
                <div><strong>Original Hindi Title:</strong> {a.title}</div>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigator.clipboard.writeText(englishHtml)}
                  style={{ cursor: "pointer", padding: "8px 12px", fontSize: 13, background: "#ff9800", color: "#fff", border: "none", borderRadius: 6 }}
                >
                  📋 Copy English HTML
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([englishHtml], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const aTag = document.createElement("a");
                    aTag.href = url;
                    aTag.download = `${englishSlug}.html`;
                    aTag.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ cursor: "pointer", padding: "8px 12px", fontSize: 13, background: "#ff9800", color: "#fff", border: "none", borderRadius: 6 }}
                >
                  💾 Download English HTML
                </button>
              </div>

              <div style={{ border: "2px solid #ff9800", borderRadius: 8, overflow: "hidden" }}>
                <iframe title={`english-converted-${a.id}`} srcDoc={englishHtml} style={{ width: "100%", height: 500, border: "none" }} />
              </div>
            </div>
          );
        })}
      </div>
      <Pager page={page} total={total} totalCount={totalCount} onChange={onChange} />
    </div>
  );
}

function CompareView({ compared, fmt, getPub, page, total, totalCount, onChange }) {
  return (
    <div>
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
                <ArticlePreview
                  label="✅ OpenAI"
                  date={dateOpenAI}
                  time={timeOpenAI}
                  title={titleOpenAI}
                  meta={metaOpenAI}
                  html={a.openai_ready_article}
                  slug={`${slug}-openai`}
                  buttonColor="#28a745"
                  borderColor="#28a745"
                />

                <ArticlePreview
                  label="🤖 DeepSeek"
                  date={dateDeepSeek}
                  time={timeDeepSeek}
                  title={titleDeepSeek}
                  meta={metaDeepSeek}
                  html={a.ready_article}
                  slug={`${slug}-deepseek`}
                  buttonColor="#6f42c1"
                  borderColor="#6f42c1"
                />
              </div>
            </div>
          );
        })}
      </div>
      <Pager page={page} total={total} totalCount={totalCount} onChange={onChange} />
    </div>
  );
}

function ArticlePreview({ label, date, time, title, meta, html, slug, buttonColor, borderColor }) {
  return (
    <div style={{ border: `2px solid ${borderColor}`, borderRadius: 10, padding: 12, background: "#f9f9ff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: borderColor, fontSize: 16 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#666" }}>{date} {time}</div>
      </div>

      <div style={{ background: "#f0f0ff", padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 12 }}>
        <div><strong>टाइटल:</strong> {title}</div>
        {meta && <div><strong>मेटा:</strong> {meta}</div>}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => navigator.clipboard.writeText(html || "")}
          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: buttonColor, color: "#fff", border: "none", borderRadius: 4 }}
        >
          📋 कॉपी
        </button>
        <button
          onClick={() => {
            const blob = new Blob([html || ""], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const aTag = document.createElement("a");
            aTag.href = url;
            aTag.download = `${slug}.html`;
            aTag.click();
            URL.revokeObjectURL(url);
          }}
          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 12, background: buttonColor, color: "#fff", border: "none", borderRadius: 4 }}
        >
          💾 डाउनलोड
        </button>
      </div>

      <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, overflow: "hidden" }}>
        <iframe title={`${label}-preview`} srcDoc={html || ""} style={{ width: "100%", height: 400, border: "none" }} />
      </div>
    </div>
  );
}

function Pager({ page, total, totalCount, onChange }) {
  const nums = [];
  const max = 5;
  let start = Math.max(1, page - Math.floor(max / 2));
  let end = Math.min(total, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16, flexWrap: "wrap" }}>
      <button disabled={page === 1} onClick={() => onChange(1)} style={{ cursor: page === 1 ? "not-allowed" : "pointer" }}>
        पहला
      </button>
      <button disabled={page === 1} onClick={() => onChange(page - 1)} style={{ cursor: page === 1 ? "not-allowed" : "pointer" }}>
        पिछला
      </button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} style={{ fontWeight: n === page ? "bold" : "normal", cursor: "pointer" }}>
          {n}
        </button>
      ))}
      <button disabled={page === total} onClick={() => onChange(page + 1)} style={{ cursor: page === total ? "not-allowed" : "pointer" }}>
        अगला
      </button>
      <button disabled={page === total} onClick={() => onChange(total)} style={{ cursor: page === total ? "not-allowed" : "pointer" }}>
        अंतिम
      </button>
      <span style={{ marginLeft: 8, color: "#666" }}>
        पेज {page} of {total} ({totalCount})
      </span>
    </div>
  );
}
