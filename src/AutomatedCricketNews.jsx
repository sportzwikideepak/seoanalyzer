// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AutomatedCricketNews = () => {
//   const [articles, setArticles] = useState([]);
//   const [selectedArticles, setSelectedArticles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [results, setResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('cricket');
//   const [maxArticles, setMaxArticles] = useState(25);
//   const [processingArticle, setProcessingArticle] = useState('');

//   // Your deployed backend URL
//   const DEPLOYED_BACKEND_URL = "https://hammerhead-app-jkdit.ondigitalocean.app";
  
//   // GNews API Configuration
//   const GNEWS_API_KEY = "10221c352c3324d296732745fffffe4c";
//   const GNEWS_BASE_URL = "https://gnews.io/api/v4/search";

//   // Fetch cricket news directly from GNews API
//   const fetchNews = async () => {
//     setLoading(true);
//     try {
//       const url = new URL(GNEWS_BASE_URL);
//       url.searchParams.append("q", searchQuery);
//       url.searchParams.append("lang", "en");
//       url.searchParams.append("country", "in");
//       url.searchParams.append("max", maxArticles.toString());
//       url.searchParams.append("expand", "content");
//       url.searchParams.append("apikey", GNEWS_API_KEY);
      
//       const response = await axios.get(url.toString());
      
//       if (response.data && response.data.articles) {
//         const filteredArticles = response.data.articles.filter(article => 
//           article.content && 
//           article.content.length > 500 && 
//           !article.title.toLowerCase().includes('betting') &&
//           !article.title.toLowerCase().includes('gambling') &&
//           !article.title.toLowerCase().includes('casino')
//         );

//         const processedArticles = filteredArticles.map(article => ({
//           ...article,
//           summary: article.content ? article.content.substring(0, 200) + "..." : article.description,
//           validation: {
//             isValid: article.content && article.content.length > 300 && article.title && article.title.length > 10
//           },
//           wordCount: article.content ? article.content.split(' ').length : 0
//         }));

//         setArticles(processedArticles);
//         setSelectedArticles([]);
//         setResults([]);
//       } else {
//         alert('No articles found. Try a different search term.');
//       }
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       alert(`Error fetching news: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Process selected articles
//   const processSelectedArticles = async () => {
//     if (selectedArticles.length === 0) return;

//     setProcessing(true);
//     const processedResults = [];

//     for (const articleIndex of selectedArticles) {
//       const article = articles[articleIndex];
//       setProcessingArticle(`Processing: ${article.title.substring(0, 50)}...`);
      
//       try {
//         const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/get-ready-article`, {
//           title: article.title,
//           description: article.description,
//           content: article.content
//         });

//         if (response.data && response.data.success) {
//           // Clean the article content - remove AI patterns
//           let cleanArticle = response.data.readyToPublishArticle;
          
//           // Remove AI patterns
//           cleanArticle = cleanArticle.replace(/Of course\. Here is a complete, ready-to-publish cricket article crafted from your content\./gi, '');
//           cleanArticle = cleanArticle.replace(/optimized for engagement and search engines\./gi, '');
//           cleanArticle = cleanArticle.replace(/Stay updated with the latest cricket news and analysis from the Asia Cup\./gi, '');
//           cleanArticle = cleanArticle.replace(/\*Stay updated with the latest cricket news and analysis from the Asia Cup\.\*/gi, '');
          
//           // Remove markdown formatting
//           cleanArticle = cleanArticle.replace(/\*\*(.*?)\*\*/g, '$1');
//           cleanArticle = cleanArticle.replace(/\*(.*?)\*/g, '$1');
//           cleanArticle = cleanArticle.replace(/#{1,6}\s*/g, '');
//           cleanArticle = cleanArticle.replace(/\*\s*/g, '');
//           cleanArticle = cleanArticle.replace(/\n\*\*\*/g, '\n\n');
//           cleanArticle = cleanArticle.replace(/\*\*\*/g, '');
          
//           // Remove template sections
//           cleanArticle = cleanArticle.replace(/\*\*Meta Title:\*\*/gi, '');
//           cleanArticle = cleanArticle.replace(/\*\*Meta Description:\*\*/gi, '');
//           cleanArticle = cleanArticle.replace(/The Incident That Sparked/gi, '');
//           cleanArticle = cleanArticle.replace(/The ICC's Rebuttal/gi, '');
//           cleanArticle = cleanArticle.replace(/Internal PCB Miscommunication/gi, '');
//           cleanArticle = cleanArticle.replace(/In a surprising twist/gi, '');
//           cleanArticle = cleanArticle.replace(/The fallout.*has been swift/gi, '');
          
//           // Remove more AI patterns
//           cleanArticle = cleanArticle.replace(/Here is a complete, ready-to-publish cricket article/gi, '');
//           cleanArticle = cleanArticle.replace(/crafted from your content/gi, '');
//           cleanArticle = cleanArticle.replace(/designed to be professional, engaging/gi, '');
//           cleanArticle = cleanArticle.replace(/optimized for both readers and search engines/gi, '');
//           cleanArticle = cleanArticle.replace(/Format it with proper headings, subheadings, and structure/gi, '');
//           cleanArticle = cleanArticle.replace(/Make it sound human and natural, not AI-generated/gi, '');
          
//           // Remove template phrases
//           cleanArticle = cleanArticle.replace(/The incident highlights/gi, '');
//           cleanArticle = cleanArticle.replace(/This development comes/gi, '');
//           cleanArticle = cleanArticle.replace(/The controversy began/gi, '');
//           cleanArticle = cleanArticle.replace(/In response to/gi, '');
//           cleanArticle = cleanArticle.replace(/The decision marks/gi, '');
//           cleanArticle = cleanArticle.replace(/This move comes/gi, '');
//           cleanArticle = cleanArticle.replace(/The announcement follows/gi, '');
          
//           // Remove AI conclusion patterns
//           cleanArticle = cleanArticle.replace(/In conclusion/gi, '');
//           cleanArticle = cleanArticle.replace(/To summarize/gi, '');
//           cleanArticle = cleanArticle.replace(/Overall/gi, '');
//           cleanArticle = cleanArticle.replace(/In summary/gi, '');
//           cleanArticle = cleanArticle.replace(/It is clear that/gi, '');
//           cleanArticle = cleanArticle.replace(/This demonstrates/gi, '');
          
//           // Clean up extra spaces and newlines
//           cleanArticle = cleanArticle.replace(/\n\s*\n\s*\n/g, '\n\n');
//           cleanArticle = cleanArticle.replace(/^\s+|\s+$/g, '');
          
//           // Remove empty lines at start and end
//           cleanArticle = cleanArticle.replace(/^\s*\n+/, '');
//           cleanArticle = cleanArticle.replace(/\n+\s*$/, '');
          
//           processedResults.push({
//             originalTitle: article.title,
//             readyToPublishArticle: cleanArticle,
//             processingTime: response.data.processingTime || 'N/A',
//             source: article.source?.name,
//             publishedAt: article.publishedAt
//           });
//         } else {
//           processedResults.push({
//             originalTitle: article.title,
//             error: response.data?.error || 'Processing failed'
//           });
//         }
//       } catch (error) {
//         processedResults.push({
//           originalTitle: article.title,
//           error: error.response?.data?.error || error.message || 'Processing failed'
//         });
//       }
//     }

//     setResults(processedResults);
//     setProcessing(false);
//     setProcessingArticle('');
//   };

//   // Toggle article selection
//   const toggleArticleSelection = (index) => {
//     setSelectedArticles(prev => 
//       prev.includes(index) 
//         ? prev.filter(i => i !== index)
//         : [...prev, index]
//     );
//   };

//   // Clear results
//   const clearResults = () => {
//     setResults([]);
//     setSelectedArticles([]);
//   };

//   return (
//     <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
//       {/* Header */}
//       <div style={{textAlign: 'center', marginBottom: '30px'}}>
//         <h1 style={{color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px'}}>
//           🏏 Automated Cricket News Processor
//         </h1>
//         <p style={{color: '#666', fontSize: '1.1rem'}}>
//           Fetch, select, and process cricket news articles automatically
//         </p>
//       </div>

//       {/* Processing Overlay */}
//       {processing && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.8)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 9999
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '40px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             maxWidth: '500px',
//             margin: '20px'
//           }}>
//             <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
//             <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Processing Article...</h3>
//             <p style={{color: '#666', marginBottom: '20px'}}>{processingArticle}</p>
//             <div style={{
//               width: '100%',
//               height: '6px',
//               backgroundColor: '#e9ecef',
//               borderRadius: '3px',
//               overflow: 'hidden'
//             }}>
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: '#007bff',
//                 animation: 'loading 2s ease-in-out infinite'
//               }}></div>
//             </div>
//             <p style={{color: '#999', fontSize: '12px', marginTop: '10px'}}>
//               This may take 1-2 minutes. Please wait...
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div style={{
//         backgroundColor: '#f8f9fa',
//         padding: '25px',
//         borderRadius: '12px',
//         marginBottom: '30px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         <div style={{display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap'}}>
//           <div>
//             <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
//               Search Query
//             </label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Enter search term"
//               style={{
//                 padding: '12px',
//                 borderRadius: '8px',
//                 border: '2px solid #ddd',
//                 width: '250px',
//                 fontSize: '16px'
//               }}
//             />
//           </div>
//           <div>
//             <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
//               Max Articles
//             </label>
//             <input
//               type="number"
//               value={maxArticles}
//               onChange={(e) => setMaxArticles(parseInt(e.target.value))}
//               min="1"
//               max="50"
//               style={{
//                 padding: '12px',
//                 borderRadius: '8px',
//                 border: '2px solid #ddd',
//                 width: '120px',
//                 fontSize: '16px'
//               }}
//             />
//           </div>
//         </div>
        
//         <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
//           <button 
//             onClick={fetchNews}
//             disabled={loading}
//             style={{
//               padding: '12px 24px',
//               backgroundColor: loading ? '#ccc' : '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             {loading ? '⏳ Fetching...' : '�� Fetch Latest News'}
//           </button>
          
//           <button 
//             onClick={processSelectedArticles}
//             disabled={selectedArticles.length === 0 || processing}
//             style={{
//               padding: '12px 24px',
//               backgroundColor: (selectedArticles.length === 0 || processing) ? '#ccc' : '#28a745',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: (selectedArticles.length === 0 || processing) ? 'not-allowed' : 'pointer',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             {processing ? '⏳ Processing...' : `�� Process Selected (${selectedArticles.length})`}
//           </button>
          
//           <button 
//             onClick={clearResults}
//             style={{
//               padding: '12px 24px',
//               backgroundColor: '#dc3545',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             🗑️ Clear Results
//           </button>
//         </div>
//       </div>

//       {/* Articles Section */}
//       <div style={{marginBottom: '40px'}}>
//         <h2 style={{color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem'}}>
//           📰 Available Articles ({articles.length})
//         </h2>
        
//         {loading ? (
//           <div style={{textAlign: 'center', padding: '60px'}}>
//             <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
//             <p style={{fontSize: '18px', color: '#666'}}>Fetching latest cricket news...</p>
//           </div>
//         ) : (
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
//             gap: '25px'
//           }}>
//             {articles.map((article, index) => (
//               <div 
//                 key={index}
//                 onClick={() => toggleArticleSelection(index)}
//                 style={{
//                   border: selectedArticles.includes(index) ? '3px solid #007bff' : '2px solid #e9ecef',
//                   borderRadius: '12px',
//                   padding: '20px',
//                   backgroundColor: selectedArticles.includes(index) ? '#f0f8ff' : 'white',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                   boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//                   position: 'relative'
//                 }}
//               >
//                 {selectedArticles.includes(index) && (
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     backgroundColor: '#007bff',
//                     color: 'white',
//                     padding: '5px 10px',
//                     borderRadius: '20px',
//                     fontSize: '12px',
//                     fontWeight: 'bold'
//                   }}>
//                     ✓ SELECTED
//                   </div>
//                 )}
                
//                 <h3 style={{
//                   fontWeight: 'bold',
//                   marginBottom: '15px',
//                   fontSize: '16px',
//                   lineHeight: '1.4',
//                   color: '#2c3e50'
//                 }}>
//                   {article.title}
//                 </h3>
                
//                 <div style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>
//                   <span style={{
//                     backgroundColor: '#e9ecef',
//                     padding: '4px 8px',
//                     borderRadius: '12px',
//                     marginRight: '10px'
//                   }}>
//                     {article.source?.name}
//                   </span>
//                   <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
//                   <span style={{
//                     float: 'right',
//                     padding: '4px 8px',
//                     borderRadius: '12px',
//                     backgroundColor: article.validation?.isValid ? '#28a745' : '#dc3545',
//                     color: 'white',
//                     fontSize: '10px',
//                     fontWeight: 'bold'
//                   }}>
//                     {article.validation?.isValid ? '✓ Valid' : '✗ Invalid'}
//                   </span>
//                 </div>
                
//                 <p style={{
//                   fontSize: '14px',
//                   lineHeight: '1.5',
//                   color: '#555',
//                   marginBottom: '20px'
//                 }}>
//                   {article.summary || article.description}
//                 </p>
                
//                 <button 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedArticles([index]);
//                     processSelectedArticles();
//                   }}
//                   style={{
//                     padding: '10px 20px',
//                     backgroundColor: '#28a745',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                 >
//                   🚀 Process Now
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Results Section */}
//       <div style={{
//         backgroundColor: '#f8f9fa',
//         padding: '30px',
//         borderRadius: '12px',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//       }}>
//         <h2 style={{color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem'}}>
//           📄 Processing Results ({results.length})
//         </h2>
        
//         {results.length === 0 ? (
//           <div style={{
//             textAlign: 'center',
//             padding: '40px',
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             border: '2px dashed #ddd'
//           }}>
//             <div style={{fontSize: '48px', marginBottom: '20px'}}>��</div>
//             <p style={{fontSize: '18px', color: '#666'}}>
//               No results yet. Select articles and click "Process Selected" to see results here.
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Stats */}
//             <div style={{
//               display: 'flex',
//               gap: '30px',
//               marginBottom: '30px',
//               justifyContent: 'center'
//             }}>
//               <div style={{textAlign: 'center'}}>
//                 <div style={{
//                   fontSize: '32px',
//                   fontWeight: 'bold',
//                   color: '#28a745',
//                   marginBottom: '5px'
//                 }}>
//                   {results.filter(r => !r.error).length}
//                 </div>
//                 <div style={{fontSize: '14px', color: '#666', fontWeight: 'bold'}}>Processed</div>
//               </div>
//               <div style={{textAlign: 'center'}}>
//                 <div style={{
//                   fontSize: '32px',
//                   fontWeight: 'bold',
//                   color: '#dc3545',
//                   marginBottom: '5px'
//                 }}>
//                   {results.filter(r => r.error).length}
//                 </div>
//                 <div style={{fontSize: '14px', color: '#666', fontWeight: 'bold'}}>Failed</div>
//               </div>
//               <div style={{textAlign: 'center'}}>
//                 <div style={{
//                   fontSize: '32px',
//                   fontWeight: 'bold',
//                   color: '#007bff',
//                   marginBottom: '5px'
//                 }}>
//                   {results.length}
//                 </div>
//                 <div style={{fontSize: '14px', color: '#666', fontWeight: 'bold'}}>Total</div>
//               </div>
//             </div>
            
//             {/* Results */}
//             <div>
//               {results.map((result, index) => (
//                 <div key={index} style={{
//                   border: result.error ? '2px solid #dc3545' : '2px solid #28a745',
//                   padding: '25px',
//                   margin: '20px 0',
//                   borderRadius: '12px',
//                   backgroundColor: result.error ? '#fff5f5' : '#f8fff8',
//                   boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                 }}>
//                   <div style={{
//                     fontWeight: 'bold',
//                     marginBottom: '15px',
//                     fontSize: '18px',
//                     color: result.error ? '#dc3545' : '#28a745'
//                   }}>
//                     {result.error ? '❌' : '✅'} {result.originalTitle}
//                   </div>
                  
//                   <div style={{
//                     maxHeight: '500px',
//                     overflow: 'auto',
//                     fontSize: '14px',
//                     lineHeight: '1.6',
//                     whiteSpace: 'pre-wrap',
//                     backgroundColor: 'white',
//                     padding: '20px',
//                     borderRadius: '8px',
//                     border: '1px solid #e9ecef'
//                   }}>
//                     {result.error ? result.error : result.readyToPublishArticle}
//                   </div>
                  
//                   {!result.error && (
//                     <div style={{
//                       marginTop: '15px',
//                       fontSize: '12px',
//                       color: '#666',
//                       textAlign: 'right'
//                     }}>
//                       <strong>Processing time:</strong> {result.processingTime}ms
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* CSS for loading animation */}
//       <style>
//         {`
//           @keyframes loading {
//             0% { transform: translateX(-100%); }
//             100% { transform: translateX(100%); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default AutomatedCricketNews;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutomatedCricketNews = () => {
  const [storedNews, setStoredNews] = useState([]);
  const [processedNews, setProcessedNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});
  const [activeTab, setActiveTab] = useState('stored'); // 'stored' or 'processed'
  
  // Pagination states
  const [storedCurrentPage, setStoredCurrentPage] = useState(1);
  const [processedCurrentPage, setProcessedCurrentPage] = useState(1);
  const [storedTotalPages, setStoredTotalPages] = useState(1);
  const [processedTotalPages, setProcessedTotalPages] = useState(1);
  const [storedTotalCount, setStoredTotalCount] = useState(0);
  const [processedTotalCount, setProcessedTotalCount] = useState(0);

  const DEPLOYED_BACKEND_URL = "http://localhost:5000"; // Change to your deployed URL when ready
  const ITEMS_PER_PAGE = 25;

  // Fetch stored news from database with pagination
  const fetchStoredNews = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/stored-news?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
      if (response.data.success) {
        setStoredNews(response.data.news);
        setStoredTotalCount(response.data.totalCount || response.data.news.length);
        setStoredTotalPages(Math.ceil((response.data.totalCount || response.data.news.length) / ITEMS_PER_PAGE));
        setStoredCurrentPage(page);
        console.log('Fetched news:', response.data.news.length);
      }
    } catch (error) {
      console.error('Error fetching stored news:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch processed news from database with pagination
  const fetchProcessedNews = async (page = 1) => {
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/processed-news?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
      if (response.data.success) {
        setProcessedNews(response.data.news);
        setProcessedTotalCount(response.data.totalCount || response.data.news.length);
        setProcessedTotalPages(Math.ceil((response.data.totalCount || response.data.news.length) / ITEMS_PER_PAGE));
        setProcessedCurrentPage(page);
        console.log('Fetched processed news:', response.data.news.length);
      }
    } catch (error) {
      console.error('Error fetching processed news:', error);
    }
  };

  // Process single article
  const processArticle = async (articleId) => {
    setProcessing(prev => ({ ...prev, [articleId]: true }));
    
    try {
      const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/process-article/${articleId}`);
      
      if (response.data.success) {
        // Refresh both lists
        await fetchStoredNews(storedCurrentPage);
        await fetchProcessedNews(processedCurrentPage);
        alert('Article processed successfully!');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setProcessing(prev => ({ ...prev, [articleId]: false }));
    }
  };

  // Manual fetch news
  const manualFetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/manual-fetch-news`);
      if (response.data.success) {
        await fetchStoredNews(1); // Go to first page after fetching new news
        setStoredCurrentPage(1);
        alert('News fetched and stored successfully!');
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchStoredNews(1);
    fetchProcessedNews(1);
    
    const interval = setInterval(() => {
      fetchStoredNews(storedCurrentPage);
      fetchProcessedNews(processedCurrentPage);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, totalCount }) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
        padding: '20px'
      }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          First
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === page ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentPage === page ? 'bold' : 'normal'
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Next
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Last
        </button>

        <div style={{
          marginLeft: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          Page {currentPage} of {totalPages} ({totalCount} total items)
        </div>
      </div>
    );
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px'}}>
          🏏 Continuous Cricket News
        </h1>
        <p style={{color: '#666', fontSize: '1.1rem'}}>
          24/7 News Fetching & Processing System
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <button
          onClick={() => setActiveTab('stored')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'stored' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'stored' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          �� Stored News ({storedTotalCount})
        </button>
        <button
          onClick={() => setActiveTab('processed')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'processed' ? '#28a745' : '#f8f9fa',
            color: activeTab === 'processed' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ✅ Processed Articles ({processedTotalCount})
        </button>
      </div>

      {/* Controls */}
      <div style={{textAlign: 'center', marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center'}}>
        <button
          onClick={() => {
            fetchStoredNews(storedCurrentPage);
            fetchProcessedNews(processedCurrentPage);
          }}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Refreshing...' : '🔄 Refresh All'}
        </button>
        
        <button
          onClick={manualFetchNews}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Fetching...' : '📰 Fetch New News'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'stored' ? (
        <div>
          <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
            �� Latest Stored News (Page {storedCurrentPage} of {storedTotalPages})
          </h2>
          
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
              <p>Loading latest news...</p>
            </div>
          ) : storedNews.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}></div>
              <p style={{fontSize: '18px', color: '#666'}}>No news found. Click "Fetch New News" to get latest cricket news.</p>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {storedNews.map((article) => {
                  const { date, time } = formatDateTime(article.published_at);
                  return (
                    <div key={article.id} style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{flex: 1}}>
                        <h3 style={{
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          fontSize: '16px',
                          lineHeight: '1.4',
                          color: '#2c3e50'
                        }}>
                          {article.title}
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          gap: '20px',
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          <span>📅 {date}</span>
                          <span> {time}</span>
                          <span>�� {article.source_name}</span>
                          <span>📝 {article.word_count} words</span>
                          {article.processed && (
                            <span style={{color: '#28a745', fontWeight: 'bold'}}>✅ Processed</span>
                          )}
                        </div>
                      </div>
                      
                      {!article.processed && (
                        <button
                          onClick={() => processArticle(article.id)}
                          disabled={processing[article.id]}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: processing[article.id] ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: processing[article.id] ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            minWidth: '120px'
                          }}
                        >
                          {processing[article.id] ? '⏳ Processing...' : '🚀 Process'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <Pagination
                currentPage={storedCurrentPage}
                totalPages={storedTotalPages}
                onPageChange={fetchStoredNews}
                totalCount={storedTotalCount}
              />
            </>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
            ✅ Processed Articles (Page {processedCurrentPage} of {processedTotalPages})
          </h2>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {processedNews.map((article) => {
              const { date, time } = formatDateTime(article.processed_at);
              return (
                <div key={article.id} style={{
                  border: '2px solid #28a745',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#f8fff8',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#2c3e50',
                      flex: 1
                    }}>
                      {article.title}
                    </h3>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      textAlign: 'right'
                    }}>
                      <div>✅ Processed: {date} {time}</div>
                      <div>📰 {article.source_name}</div>
                    </div>
                  </div>
                  
                  <div style={{
                    maxHeight: '300px',
                    overflow: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    {article.ready_article}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Pagination
            currentPage={processedCurrentPage}
            totalPages={processedTotalPages}
            onPageChange={fetchProcessedNews}
            totalCount={processedTotalCount}
          />
        </div>
      )}
    </div>
  );
};

export default AutomatedCricketNews;