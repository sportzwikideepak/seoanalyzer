import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContinuousNews = () => {
  const [storedNews, setStoredNews] = useState([]);
  const [processedNews, setProcessedNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});
  const [activeTab, setActiveTab] = useState('stored'); // 'stored' or 'processed'

  const DEPLOYED_BACKEND_URL = "http://localhost:5000";

  // Fetch stored news
  const fetchStoredNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/stored-news?limit=100`);
      if (response.data.success) {
        setStoredNews(response.data.news);
      }
    } catch (error) {
      console.error('Error fetching stored news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch processed news
  const fetchProcessedNews = async () => {
    try {
      const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/processed-news?limit=100`);
      if (response.data.success) {
        setProcessedNews(response.data.news);
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
        await fetchStoredNews();
        await fetchProcessedNews();
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

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchStoredNews();
    fetchProcessedNews();
    
    const interval = setInterval(() => {
      fetchStoredNews();
      fetchProcessedNews();
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
          📰 Stored News ({storedNews.length})
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
          ✅ Processed News ({processedNews.length})
        </button>
      </div>

      {/* Refresh Button */}
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <button
          onClick={() => {
            fetchStoredNews();
            fetchProcessedNews();
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
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Now'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'stored' ? (
        <div>
          <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
            📰 Latest Stored News
          </h2>
          
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
              <p>Loading latest news...</p>
            </div>
          ) : (
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
                        <span>🕐 {time}</span>
                        <span>📰 {article.source_name}</span>
                        <span>📝 {article.word_count} words</span>
                      </div>
                    </div>
                    
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
                      {processing[article.id] ? '⏳ Processing...' : '�� Process'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>
            ✅ Processed Articles
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
        </div>
      )}
    </div>
  );
};

export default ContinuousNews;