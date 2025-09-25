// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

// const PAGE = 25;

// export default function ViralContentGenerator() {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("instagram");
//   const [content, setContent] = useState(null);
//   const [analysis, setAnalysis] = useState(null);
//   const [newsArticles, setNewsArticles] = useState([]);
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   // --- SIMPLE FIX for timezone ---
//   const fmt = (v) => {
//     console.log("⏰ fmt function input:", v);
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

//   // Fetch stored news from database
//   const fetchStoredNews = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * PAGE;
//       const response = await axios.get(`${API}/api/viral/stored-news`, {
//         params: {
//           limit: PAGE,
//           offset: offset
//         }
//       });

//       if (response.data.success) {
//         setNewsArticles(response.data.news || []);
//         setTotalCount(response.data.totalCount || 0);
//         setTotalPages(response.data.totalPages || 1);
//         setCurrentPage(page);
//         console.log(`✅ Fetched ${response.data.news?.length} stored articles for viral content`);
//       } else {
//         alert("Error fetching stored news: " + response.data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching stored news:", error);
//       alert("Error fetching stored news: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate viral content from selected article
//   const generateContent = async () => {
//     if (!selectedArticle) {
//       alert("Please select an article first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${API}/api/viral/generate-from-stored`, {
//         articleId: selectedArticle.id
//       });

//       if (response.data.success) {
//         setContent(response.data.content);
//         setAnalysis(response.data.analysis);
//         console.log("✅ Viral content generated successfully");
//       } else {
//         alert("Error generating content: " + response.data.error);
//       }
//     } catch (error) {
//       console.error("Error generating viral content:", error);
//       alert("Error generating content: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Copy content to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert("Content copied to clipboard!");
//   };

//   // Download content as JSON
//   const downloadContent = () => {
//     const data = {
//       analysis,
//       content,
//       generatedAt: new Date().toISOString(),
//       originalArticle: selectedArticle
//     };
    
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `viral-content-${Date.now()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Load news on component mount
//   useEffect(() => {
//     fetchStoredNews(1);
//   }, []);

//   return (
//     <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
//       <div style={{ textAlign: "center", marginBottom: 24 }}>
//         <h1>🚀 Viral Social Media Content Generator</h1>
//         <p>Transform stored cricket news into viral content for Instagram, Facebook, X, and YouTube</p>
//         <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//           Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
//         </div>
//       </div>

//       {/* News Selection Section */}
//       <div style={{ background: "#f8f9fa", padding: 20, borderRadius: 12, marginBottom: 24 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//           <h3>📚 Select Stored Cricket News Article</h3>
//           <button
//             onClick={() => fetchStoredNews(currentPage)}
//             disabled={loading}
//             style={{
//               padding: "8px 12px",
//               background: loading ? "#95a5a6" : "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: loading ? "not-allowed" : "pointer"
//             }}
//           >
//             {loading ? "⏳ Loading..." : "🔄 Refresh"}
//           </button>
//         </div>

//         {/* News Articles List */}
//         <div style={{ maxHeight: 400, overflow: "auto", border: "1px solid #ddd", borderRadius: 6, marginBottom: 16 }}>
//           {newsArticles.map((article) => {
//             const { date, time } = fmt(getPub(article));
//             return (
//               <div
//                 key={article.id}
//                 onClick={() => setSelectedArticle(article)}
//                 style={{
//                   padding: 12,
//                   borderBottom: "1px solid #eee",
//                   cursor: "pointer",
//                   background: selectedArticle?.id === article.id ? "#e3f2fd" : "white",
//                   borderLeft: selectedArticle?.id === article.id ? "4px solid #2196f3" : "4px solid transparent"
//                 }}
//               >
//                 <div style={{ fontWeight: "bold", marginBottom: 4, color: "#333" }}>
//                   {article.title}
//                 </div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                   📅 {date} 🕒 {time} | 
//                   📰 {article.source_name} | 
//                   📝 {article.word_count || 0} words
//                   {article.processed ? " | ✅ Processed" : ""}
//                 </div>
//                 <div style={{ fontSize: 13, color: "#555" }}>
//                   {article.description}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
//           <button
//             disabled={currentPage === 1}
//             onClick={() => fetchStoredNews(1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             First
//           </button>
//           <button
//             disabled={currentPage === 1}
//             onClick={() => fetchStoredNews(currentPage - 1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Prev
//           </button>
//           <span style={{ padding: "6px 12px", background: "#007bff", color: "white", borderRadius: 4 }}>
//             {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => fetchStoredNews(currentPage + 1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Next
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => fetchStoredNews(totalPages)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Last
//           </button>
//         </div>

//         {/* Generate Button */}
//         {selectedArticle && (
//           <div style={{ textAlign: "center" }}>
//             <button
//               onClick={generateContent}
//               disabled={loading}
//               style={{
//                 padding: "12px 24px",
//                 background: loading ? "#95a5a6" : "#e74c3c",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 fontSize: 16,
//                 fontWeight: "bold",
//                 cursor: loading ? "not-allowed" : "pointer"
//               }}
//             >
//               {loading ? "⏳ Generating..." : "🚀 Generate Viral Content"}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Analysis Section */}
//       {analysis && (
//         <div style={{ background: "#e8f5e8", padding: 20, borderRadius: 12, marginBottom: 24 }}>
//           <h3>🔍 News Analysis</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
//             <div>
//               <strong>Emotional Triggers:</strong>
//               <ul>
//                 {analysis.emotionalTriggers?.map((trigger, i) => (
//                   <li key={i}>{trigger}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Viral Angles:</strong>
//               <ul>
//                 {analysis.viralAngles?.map((angle, i) => (
//                   <li key={i}>{angle}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Target Audience:</strong>
//               <ul>
//                 {analysis.targetAudience?.map((audience, i) => (
//                   <li key={i}>{audience}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Controversy Potential:</strong>
//               <span style={{ 
//                 padding: "4px 8px", 
//                 borderRadius: 4, 
//                 background: analysis.controversyPotential === "high" ? "#ff6b6b" : 
//                            analysis.controversyPotential === "medium" ? "#ffa726" : "#66bb6a",
//                 color: "white",
//                 fontSize: 12
//               }}>
//                 {analysis.controversyPotential}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content Display */}
//       {content && (
//         <div>
//           {/* Platform Tabs */}
//           <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
//             {["instagram", "facebook", "twitter", "youtube"].map((platform) => (
//               <button
//                 key={platform}
//                 onClick={() => setActiveTab(platform)}
//                 style={{
//                   padding: "10px 16px",
//                   background: activeTab === platform ? "#007bff" : "#f3f4f6",
//                   color: activeTab === platform ? "#fff" : "#333",
//                   border: "none",
//                   borderRadius: "6px 6px 0 0",
//                   cursor: "pointer",
//                   textTransform: "capitalize"
//                 }}
//               >
//                 {platform === "twitter" ? "X/Twitter" : platform}
//               </button>
//             ))}
//           </div>

//           {/* Content Display */}
//           <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//               <h3 style={{ margin: 0, textTransform: "capitalize" }}>
//                 {activeTab === "twitter" ? "X/Twitter" : activeTab} Content Ideas
//               </h3>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                   onClick={() => copyToClipboard(content[activeTab])}
//                   style={{
//                     padding: "8px 12px",
//                     background: "#28a745",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 6,
//                     cursor: "pointer"
//                   }}
//                 >
//                   📋 Copy
//                 </button>
//                 <button
//                   onClick={downloadContent}
//                   style={{
//                     padding: "8px 12px",
//                     background: "#17a2b8",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 6,
//                     cursor: "pointer"
//                   }}
//                 >
//                   💾 Download
//                 </button>
//               </div>
//             </div>

//             <div style={{
//               background: "#f8f9fa",
//               padding: 16,
//               borderRadius: 8,
//               border: "1px solid #e9ecef",
//               whiteSpace: "pre-wrap",
//               fontFamily: "monospace",
//               fontSize: 14,
//               lineHeight: 1.6,
//               maxHeight: 500,
//               overflow: "auto"
//             }}>
//               {content[activeTab]}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Instructions */}
//       <div style={{ background: "#fff3cd", padding: 20, borderRadius: 12, marginTop: 24 }}>
//         <h3> How to Use</h3>
//         <ol>
//           <li>Browse through stored cricket news articles (latest first)</li>
//           <li>Click on any article to select it</li>
//           <li>Click "Generate Viral Content" to create 12 platform-specific ideas</li>
//           <li>Review the analysis to understand viral potential</li>
//           <li>Switch between platform tabs to see different content ideas</li>
//           <li>Copy or download the content for your social media team</li>
//         </ol>
//         <p><strong>Note:</strong> Each platform gets 3 different viral content ideas with hooks, CTAs, hashtags, and timing suggestions.</p>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

// const PAGE = 25;

// export default function ViralContentGenerator() {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("instagram");
//   const [content, setContent] = useState(null);
//   const [analysis, setAnalysis] = useState(null);
//   const [newsArticles, setNewsArticles] = useState([]);
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   // --- SIMPLE FIX for timezone ---
//   const fmt = (v) => {
//     console.log("⏰ fmt function input:", v);
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

//   // Fetch stored news from database
//   const fetchStoredNews = async (page = 1) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * PAGE;
//       const response = await axios.get(`${API}/api/viral/stored-news`, {
//         params: {
//           limit: PAGE,
//           offset: offset
//         }
//       });

//       if (response.data.success) {
//         setNewsArticles(response.data.news || []);
//         setTotalCount(response.data.totalCount || 0);
//         setTotalPages(response.data.totalPages || 1);
//         setCurrentPage(page);
//         console.log(`✅ Fetched ${response.data.news?.length} stored articles for viral content`);
//       } else {
//         alert("Error fetching stored news: " + response.data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching stored news:", error);
//       alert("Error fetching stored news: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate viral content from selected article
//   const generateContent = async () => {
//     if (!selectedArticle) {
//       alert("Please select an article first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${API}/api/viral/generate-from-stored`, {
//         articleId: selectedArticle.id
//       });

//       if (response.data.success) {
//         setContent(response.data.content);
//         setAnalysis(response.data.analysis);
//         console.log("✅ Viral content generated successfully");
//       } else {
//         alert("Error generating content: " + response.data.error);
//       }
//     } catch (error) {
//       console.error("Error generating viral content:", error);
//       alert("Error generating content: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Copy content to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert("Content copied to clipboard!");
//   };

//   // Download content as JSON
//   const downloadContent = () => {
//     const data = {
//       analysis,
//       content,
//       generatedAt: new Date().toISOString(),
//       originalArticle: selectedArticle
//     };
    
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `viral-content-${Date.now()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Load news on component mount
//   useEffect(() => {
//     fetchStoredNews(1);
//   }, []);

//   return (
//     <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
//       <div style={{ textAlign: "center", marginBottom: 24 }}>
//         <h1>🚀 Viral Social Media Post Creation</h1>
//         <p>Transform stored cricket news into viral content for Instagram, Facebook, X, and YouTube</p>
//         <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//           Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
//         </div>
//       </div>

//       {/* News Selection Section */}
//       <div style={{ background: "#f8f9fa", padding: 20, borderRadius: 12, marginBottom: 24 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//           <h3>📚 Select Stored Cricket News Article</h3>
//           <button
//             onClick={() => fetchStoredNews(currentPage)}
//             disabled={loading}
//             style={{
//               padding: "8px 12px",
//               background: loading ? "#95a5a6" : "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: loading ? "not-allowed" : "pointer"
//             }}
//           >
//             {loading ? "⏳ Loading..." : "🔄 Refresh"}
//           </button>
//         </div>

//         {/* News Articles List */}
//         <div style={{ maxHeight: 400, overflow: "auto", border: "1px solid #ddd", borderRadius: 6, marginBottom: 16 }}>
//           {newsArticles.map((article) => {
//             const { date, time } = fmt(getPub(article));
//             return (
//               <div
//                 key={article.id}
//                 onClick={() => setSelectedArticle(article)}
//                 style={{
//                   padding: 12,
//                   borderBottom: "1px solid #eee",
//                   cursor: "pointer",
//                   background: selectedArticle?.id === article.id ? "#e3f2fd" : "white",
//                   borderLeft: selectedArticle?.id === article.id ? "4px solid #2196f3" : "4px solid transparent"
//                 }}
//               >
//                 <div style={{ fontWeight: "bold", marginBottom: 4, color: "#333" }}>
//                   {article.title}
//                 </div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                   📅 {date} 🕒 {time} | 
//                   📰 {article.source_name} | 
//                   📝 {article.word_count || 0} words
//                   {article.processed ? " | ✅ Processed" : ""}
//                 </div>
//                 <div style={{ fontSize: 13, color: "#555" }}>
//                   {article.description}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
//           <button
//             disabled={currentPage === 1}
//             onClick={() => fetchStoredNews(1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             First
//           </button>
//           <button
//             disabled={currentPage === 1}
//             onClick={() => fetchStoredNews(currentPage - 1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Prev
//           </button>
//           <span style={{ padding: "6px 12px", background: "#007bff", color: "white", borderRadius: 4 }}>
//             {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => fetchStoredNews(currentPage + 1)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Next
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => fetchStoredNews(totalPages)}
//             style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
//           >
//             Last
//           </button>
//         </div>

//         {/* Generate Button */}
//         {selectedArticle && (
//           <div style={{ textAlign: "center" }}>
//             <button
//               onClick={generateContent}
//               disabled={loading}
//               style={{
//                 padding: "12px 24px",
//                 background: loading ? "#95a5a6" : "#e74c3c",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 fontSize: 16,
//                 fontWeight: "bold",
//                 cursor: loading ? "not-allowed" : "pointer"
//               }}
//             >
//               {loading ? "⏳ Generating..." : "🚀 Generate Viral Content"}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Analysis Section */}
//       {analysis && (
//         <div style={{ background: "#e8f5e8", padding: 20, borderRadius: 12, marginBottom: 24 }}>
//           <h3>🔍 News Analysis</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
//             <div>
//               <strong>Emotional Triggers:</strong>
//               <ul>
//                 {analysis.emotionalTriggers?.map((trigger, i) => (
//                   <li key={i}>{trigger}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Viral Angles:</strong>
//               <ul>
//                 {analysis.viralAngles?.map((angle, i) => (
//                   <li key={i}>{angle}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Target Audience:</strong>
//               <ul>
//                 {analysis.targetAudience?.map((audience, i) => (
//                   <li key={i}>{audience}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <strong>Controversy Potential:</strong>
//               <span style={{ 
//                 padding: "4px 8px", 
//                 borderRadius: 4, 
//                 background: analysis.controversyPotential === "high" ? "#ff6b6b" : 
//                            analysis.controversyPotential === "medium" ? "#ffa726" : "#66bb6a",
//                 color: "white",
//                 fontSize: 12
//               }}>
//                 {analysis.controversyPotential}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content Display */}
//       {content && (
//         <div>
//           {/* Platform Tabs */}
//           <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
//             {["instagram", "facebook", "twitter", "youtube"].map((platform) => (
//               <button
//                 key={platform}
//                 onClick={() => setActiveTab(platform)}
//                 style={{
//                   padding: "10px 16px",
//                   background: activeTab === platform ? "#007bff" : "#f3f4f6",
//                   color: activeTab === platform ? "#fff" : "#333",
//                   border: "none",
//                   borderRadius: "6px 6px 0 0",
//                   cursor: "pointer",
//                   textTransform: "capitalize"
//                 }}
//               >
//                 {platform === "twitter" ? "X/Twitter" : platform}
//               </button>
//             ))}
//           </div>

//           {/* Content Display */}
//           <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//               <h3 style={{ margin: 0, textTransform: "capitalize" }}>
//                 {activeTab === "twitter" ? "X/Twitter" : activeTab} Content Ideas
//               </h3>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                   onClick={() => copyToClipboard(content[activeTab])}
//                   style={{
//                     padding: "8px 12px",
//                     background: "#28a745",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 6,
//                     cursor: "pointer"
//                   }}
//                 >
//                   📋 Copy
//                 </button>
//                 <button
//                   onClick={downloadContent}
//                   style={{
//                     padding: "8px 12px",
//                     background: "#17a2b8",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 6,
//                     cursor: "pointer"
//                   }}
//                 >
//                   💾 Download
//                 </button>
//               </div>
//             </div>

//             <div style={{
//               background: "#f8f9fa",
//               padding: 16,
//               borderRadius: 8,
//               border: "1px solid #e9ecef",
//               whiteSpace: "pre-wrap",
//               fontFamily: "monospace",
//               fontSize: 14,
//               lineHeight: 1.6,
//               maxHeight: 500,
//               overflow: "auto"
//             }}>
//               {content[activeTab]}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Instructions */}
//       <div style={{ background: "#fff3cd", padding: 20, borderRadius: 12, marginTop: 24 }}>
//         <h3>📋 How to Use</h3>
//         <ol>
//           <li>Browse through stored cricket news articles (latest first)</li>
//           <li>Click on any article to select it</li>
//           <li>Click "Generate Viral Content" to create 12 platform-specific ideas</li>
//           <li>Review the analysis to understand viral potential</li>
//           <li>Switch between platform tabs to see different content ideas</li>
//           <li>Copy or download the content for your social media team</li>
//         </ol>
//         <p><strong>Note:</strong> Each platform gets 3 different viral content ideas with hooks, CTAs, hashtags, and timing suggestions.</p>
//       </div>
//     </div>
//   );
// }









import React, { useState, useEffect } from "react";
import axios from "axios";

// const API = "http://localhost:5000";

const API = "https://hammerhead-app-jkdit.ondigitalocean.app";

const PAGE = 25;

export default function ViralContentGenerator() {
  // State Management
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  const [content, setContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [busy, setBusy] = useState({});

  // Viral History State
  const [viralHistory, setViralHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);
  const [selectedViralContent, setSelectedViralContent] = useState(null);

  // Platform content state
  const [activePlatform, setActivePlatform] = useState("instagram");

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
  const getGenerated = (row) => row.generated_at_iso ?? row.generated_at;

  // Fetch stored news from database
  const fetchStoredNews = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const response = await axios.get(`${API}/api/viral/stored-news`, {
        params: {
          limit: PAGE,
          offset: offset
        }
      });

      if (response.data.success) {
        setNewsArticles(response.data.news || []);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
        console.log(`✅ Fetched ${response.data.news?.length} stored articles for viral content`);
      } else {
        alert("Error fetching stored news: " + response.data.error);
      }
    } catch (error) {
      console.error("Error fetching stored news:", error);
      alert("Error fetching stored news: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch viral content history
  const fetchViralHistory = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE;
      const response = await axios.get(`${API}/api/viral/history`, {
        params: {
          limit: PAGE,
          offset: offset
        }
      });

      if (response.data.success) {
        setViralHistory(response.data.viralContent || []);
        setHistoryTotalCount(response.data.totalCount || 0);
        setHistoryTotalPages(response.data.totalPages || 1);
        setHistoryPage(page);
        console.log(`✅ Fetched ${response.data.viralContent?.length} viral content items`);
        console.log("Sample viral content:", response.data.viralContent[0]); // Debug log
      } else {
        alert("Error fetching viral history: " + response.data.error);
      }
    } catch (error) {
      console.error("Error fetching viral history:", error);
      alert("Error fetching viral history: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate viral content from selected article
  const generateContent = async (articleId) => {
    setBusy((m) => ({ ...m, [articleId]: true }));
    try {
      const response = await axios.post(`${API}/api/viral/generate-from-stored`, {
        articleId: articleId
      });

      if (response.data.success) {
        console.log("Generated content:", response.data.content); // Debug log
        console.log("Generated analysis:", response.data.analysis); // Debug log
        
        setContent(response.data.content);
        setAnalysis(response.data.analysis);
        setSelectedArticle(response.data.originalArticle);
        setActiveTab("content");
        console.log("✅ Viral content generated and stored successfully");
      } else {
        alert("Error generating content: " + response.data.error);
      }
    } catch (error) {
      console.error("Error generating viral content:", error);
      alert("Error generating content: " + error.message);
    } finally {
      setBusy((m) => ({ ...m, [articleId]: false }));
    }
  };

  // Load specific viral content from history
  const loadViralContent = async (viralId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/viral/content/${viralId}`);

      if (response.data.success) {
        const viralContent = response.data.viralContent;
        console.log("Loaded viral content:", viralContent); // Debug log
        
        // Parse JSON strings if they're strings
        let parsedContent = viralContent.content;
        let parsedAnalysis = viralContent.analysis;
        
        if (typeof parsedContent === 'string') {
          try {
            parsedContent = JSON.parse(parsedContent);
          } catch (e) {
            console.error("Error parsing content JSON:", e);
          }
        }
        
        if (typeof parsedAnalysis === 'string') {
          try {
            parsedAnalysis = JSON.parse(parsedAnalysis);
          } catch (e) {
            console.error("Error parsing analysis JSON:", e);
          }
        }
        
        setContent(parsedContent);
        setAnalysis(parsedAnalysis);
        setSelectedViralContent(viralContent);
        setActiveTab("content");
        console.log("✅ Loaded viral content from history");
      } else {
        alert("Error loading viral content: " + response.data.error);
      }
    } catch (error) {
      console.error("Error loading viral content:", error);
      alert("Error loading viral content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual fetch news
  const manualFetch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/manual-fetch-news`);
      await fetchStoredNews(1);
      setCurrentPage(1);
      alert("News fetched.");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Content copied to clipboard!");
  };

  // Download content as JSON
  const downloadContent = () => {
    const data = {
      analysis,
      content,
      generatedAt: new Date().toISOString(),
      originalArticle: selectedArticle || selectedViralContent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viral-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load news on component mount
  useEffect(() => {
    fetchStoredNews(1);
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>🚀 Viral Social Media Content Generator</h1>
        <p>Transform stored cricket news into viral content for Instagram, Facebook, X, and YouTube</p>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Current Time: {new Date().toLocaleString("en-IN")} | API: {API}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setActiveTab("news")}
          style={{ 
            padding: "10px 16px", 
            background: activeTab === "news" ? "#007bff" : "#f3f4f6", 
            color: activeTab === "news" ? "#fff" : "#333" 
          }}
        >
          Stored News ({totalCount})
        </button>
        {/* <button
          onClick={() => {
            setActiveTab("history");
            fetchViralHistory();
          }}
          style={{ 
            padding: "10px 16px", 
            background: activeTab === "history" ? "#17a2b8" : "#f3f4f6", 
            color: activeTab === "history" ? "#fff" : "#333" 
          }}
        >
          📚 Viral History ({historyTotalCount})
        </button> */}
        <button
          onClick={() => setActiveTab("content")}
          disabled={!content}
          style={{ 
            padding: "10px 16px", 
            background: activeTab === "content" ? "#28a745" : "#f3f4f6", 
            color: activeTab === "content" ? "#fff" : "#333" 
          }}
        >
          ✅ Generated Content
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
        <button 
          disabled={loading} 
          onClick={() => { 
            if (activeTab === "news") fetchStoredNews(currentPage);
            if (activeTab === "history") fetchViralHistory(historyPage);
          }}
          style={{
            padding: "8px 16px",
            background: loading ? "#95a5a6" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⏳ Refreshing…" : " Refresh"}
        </button>
        {activeTab === "news" && (
          <button 
            disabled={loading} 
            onClick={manualFetch}
            style={{
              padding: "8px 16px",
              background: loading ? "#95a5a6" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Fetching…" : "📰 Fetch New News"}
          </button>
        )}
      </div>

      {/* NEWS TAB */}
      {activeTab === "news" && (
        <div>
          <h2>Latest Stored News (Page {currentPage} of {totalPages})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {newsArticles.map((article) => {
              const { date, time } = fmt(getPub(article));
              const isBusy = !!busy[article.id];
              return (
                <div 
                  key={article.id} 
                  style={{ 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 10, 
                    padding: 16, 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                  }}
                >
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
                        if (article.source_url) {
                          window.open(article.source_url, '_blank', 'noopener,noreferrer');
                        } else {
                          alert('No source URL available');
                        }
                      }}
                    >
                      {article.title}
                    </div>
                    <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12 }}>
                      <span>📅 {date}</span>
                      <span>🕒 {time}</span>
                      <span>{article.source_name}</span>
                      {typeof article.word_count === "number" && <span>📝 {article.word_count} words</span>}
                      {article.processed ? <span style={{ color: "#28a745", fontWeight: 700 }}>✅ Processed</span> : null}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      generateContent(article.id);
                    }}
                    disabled={isBusy}
                    style={{ 
                      padding: "10px 14px", 
                      background: isBusy ? "#95a5a6" : "#e74c3c", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: 8 
                    }}
                  >
                    {isBusy ? "⏳ Generating…" : "🚀 Generate Viral Content"}
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => fetchStoredNews(1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              First
            </button>
            <button 
              disabled={currentPage === 1} 
              onClick={() => fetchStoredNews(currentPage - 1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Prev
            </button>
            <span style={{ padding: "6px 12px", background: "#007bff", color: "white", borderRadius: 4 }}>
              {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => fetchStoredNews(currentPage + 1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Next
            </button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => fetchStoredNews(totalPages)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Last
            </button>
            <span style={{ marginLeft: 8, color: "#666" }}>
              Page {currentPage} of {totalPages} ({totalCount})
            </span>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div>
          <h2>Generated Viral Content History (Page {historyPage} of {historyTotalPages})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {viralHistory.map((item) => {
              const { date, time } = fmt(getGenerated(item));
              const pubDate = fmt(getPub(item));
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    border: "1px solid #17a2b8", 
                    borderRadius: 10, 
                    padding: 16, 
                    background: "#f0f8ff",
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                  }}
                >
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, color: "#17a2b8" }}>
                      {item.title}
                    </div>
                    <div style={{ display: "flex", gap: 14, color: "#666", fontSize: 12, marginBottom: 4 }}>
                      <span>📰 {item.source_name}</span>
                      <span> Published: {pubDate.date}</span>
                      <span> Generated: {date} {time}</span>
                      <span>⏱️ {item.processing_time}ms</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {item.description}
                    </div>
                  </div>
                  <button
                    onClick={() => loadViralContent(item.id)}
                    style={{ 
                      padding: "10px 14px", 
                      background: "#17a2b8", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: 8 
                    }}
                  >
                    📖 Load Content
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
            <button 
              disabled={historyPage === 1} 
              onClick={() => fetchViralHistory(1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              First
            </button>
            <button 
              disabled={historyPage === 1} 
              onClick={() => fetchViralHistory(historyPage - 1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Prev
            </button>
            <span style={{ padding: "6px 12px", background: "#17a2b8", color: "white", borderRadius: 4 }}>
              {historyPage} of {historyTotalPages}
            </span>
            <button 
              disabled={historyPage === historyTotalPages} 
              onClick={() => fetchViralHistory(historyPage + 1)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Next
            </button>
            <button 
              disabled={historyPage === historyTotalPages} 
              onClick={() => fetchViralHistory(historyTotalPages)}
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
            >
              Last
            </button>
            <span style={{ marginLeft: 8, color: "#666" }}>
              Page {historyPage} of {historyTotalPages} ({historyTotalCount})
            </span>
          </div>
        </div>
      )}

      {/* CONTENT TAB */}
      {activeTab === "content" && (
        <div>
          <h2>✅ Generated Viral Content</h2>
          
          {/* Debug Info */}
          <div style={{ background: "#fff3cd", padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 12 }}>
            <strong>Debug Info:</strong> Content: {content ? "✅ Loaded" : "❌ None"} | 
            Analysis: {analysis ? "✅ Loaded" : "❌ None"} | 
            Active Platform: {activePlatform}
          </div>
          
          {/* Original Article Info */}
          {(selectedArticle || selectedViralContent) && (
            <div style={{ background: "#e3f2fd", padding: 16, borderRadius: 8, marginBottom: 20 }}>
              <h4 style={{ margin: 0, marginBottom: 8, color: "#1976d2" }}>
                📰 Original Article: {(selectedArticle || selectedViralContent).title}
              </h4>
              <div style={{ fontSize: 12, color: "#666" }}>
                Source: {(selectedArticle || selectedViralContent).source_name} | 
                Published: {fmt(getPub(selectedArticle || selectedViralContent)).date}
              </div>
            </div>
          )}
          
          {/* Analysis Section */}
          {analysis && (
            <div style={{ background: "#e8f5e8", padding: 20, borderRadius: 12, marginBottom: 24 }}>
              <h3>🔍 News Analysis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <div>
                  <strong>Emotional Triggers:</strong>
                  <ul>
                    {analysis.emotionalTriggers?.map((trigger, i) => (
                      <li key={i}>{trigger}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Viral Angles:</strong>
                  <ul>
                    {analysis.viralAngles?.map((angle, i) => (
                      <li key={i}>{angle}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Target Audience:</strong>
                  <ul>
                    {analysis.targetAudience?.map((audience, i) => (
                      <li key={i}>{audience}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Controversy Potential:</strong>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    background: analysis.controversyPotential === "high" ? "#ff6b6b" : 
                               analysis.controversyPotential === "medium" ? "#ffa726" : "#66bb6a",
                    color: "white",
                    fontSize: 12
                  }}>
                    {analysis.controversyPotential}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Display */}
          {content && (
            <div>
              {/* Platform Tabs */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: "2px solid #eee" }}>
                {["instagram", "facebook", "twitter", "youtube"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setActivePlatform(platform)}
                    style={{
                      padding: "10px 16px",
                      background: activePlatform === platform ? "#007bff" : "#f3f4f6",
                      color: activePlatform === platform ? "#fff" : "#333",
                      border: "none",
                      borderRadius: "6px 6px 0 0",
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {platform === "twitter" ? "X/Twitter" : platform}
                  </button>
                ))}
              </div>

              {/* Content Display */}
              <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, textTransform: "capitalize" }}>
                    {activePlatform === "twitter" ? "X/Twitter" : activePlatform} Content Ideas
                  </h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => copyToClipboard(content[activePlatform] || "No content available")}
                      style={{
                        padding: "8px 12px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer"
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={downloadContent}
                      style={{
                        padding: "8px 12px",
                        background: "#17a2b8",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer"
                      }}
                    >
                      💾 Download
                    </button>
                  </div>
                </div>

                <div style={{
                  background: "#f8f9fa",
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid #e9ecef",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxHeight: 500,
                  overflow: "auto"
                }}>
                  {content[activePlatform] || "No content available for this platform"}
                </div>
              </div>
            </div>
          )}

          {!content && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              <p>No viral content loaded. Generate new content or load from history.</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ background: "#fff3cd", padding: 20, borderRadius: 12, marginTop: 24 }}>
        <h3>📋 How to Use</h3>
        <ol>
          <li><strong>Stored News:</strong> Browse cricket news and generate viral content</li>
          <li><strong>Viral History:</strong> View all previously generated viral content</li>
          <li><strong>Generated Content:</strong> View current viral content with platform tabs</li>
          <li><strong>Features:</strong> Copy content, download as JSON, view analysis</li>
          <li><strong>Storage:</strong> All generated content is automatically saved to database</li>
        </ol>
        <p><strong>Note:</strong> Each platform gets 3 different viral content ideas with hooks, CTAs, hashtags, and timing suggestions.</p>
      </div>
    </div>
  );
}