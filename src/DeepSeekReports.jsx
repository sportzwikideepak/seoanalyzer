import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutomatedCricketNews = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('cricket');
  const [maxArticles, setMaxArticles] = useState(25);

  // Your deployed backend URL
  const DEPLOYED_BACKEND_URL = "https://hammerhead-app-jkdit.ondigitalocean.app";

  // Fetch cricket news from your backend
  const fetchNews = async () => {
    setLoading(true);
    console.log('🚀 Starting to fetch news...');
    console.log('📡 Backend URL:', DEPLOYED_BACKEND_URL);
    console.log('🔍 Search Query:', searchQuery);
    console.log('📊 Max Articles:', maxArticles);
    
    try {
      const url = `${DEPLOYED_BACKEND_URL}/api/fetch-cricket-news`;
      const params = {
        query: searchQuery,
        lang: 'en',
        country: 'in',
        max: maxArticles
      };
      
      console.log('🌐 Making request to:', url);
      console.log('📋 Request params:', params);
      
      const response = await axios.get(url, { params });
      
      console.log('📥 Response received:', response);
      console.log('📊 Response status:', response.status);
      console.log('📄 Response data:', response.data);

      if (response.data && response.data.success) {
        setArticles(response.data.articles || []);
        console.log(`✅ Successfully fetched ${response.data.articles?.length || 0} articles`);
        console.log('📰 Articles data:', response.data.articles);
      } else {
        console.error('❌ Failed to fetch news - no success flag');
        console.error('📄 Response data:', response.data);
        alert(`Failed to fetch news: ${response.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      alert(`Error fetching news: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 Fetch completed');
    }
  };

  // Process selected articles
  const processSelectedArticles = async () => {
    if (selectedArticles.length === 0) return;

    setProcessing(true);
    const processedResults = [];

    for (const articleIndex of selectedArticles) {
      const article = articles[articleIndex];
      try {
        const response = await axios.post(`${DEPLOYED_BACKEND_URL}/api/process-selected-article`, {
          article: {
            title: article.title,
            description: article.description,
            content: article.content
          },
          options: {
            language: 'en',
            includePrePublishingChecks: true,
            includeHumanLikeRewriting: true,
            includeGoogleOptimization: true,
            avoidAIDetection: true
          }
        });

        if (response.data.success) {
          processedResults.push({
            originalTitle: article.title,
            readyToPublishArticle: response.data.readyToPublishArticle,
            processingTime: response.data.processingTime,
            source: article.source?.name,
            publishedAt: article.publishedAt
          });
        }
      } catch (error) {
        console.error(`Error processing article: ${article.title}`, error);
        processedResults.push({
          originalTitle: article.title,
          error: error.response?.data?.error || 'Processing failed'
        });
      }
    }

    setResults(processedResults);
    setProcessing(false);
  };

  // Toggle article selection
  const toggleArticleSelection = (index) => {
    setSelectedArticles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Clear results
  const clearResults = () => {
    setResults([]);
    setSelectedArticles([]);
  };

  // Test backend connection
  const testBackend = async () => {
    console.log('🧪 Testing backend connection...');
    try {
      const response = await axios.get(`${DEPLOYED_BACKEND_URL}/api/example`);
      console.log('✅ Backend is reachable:', response.data);
      alert('Backend is working! Check console for details.');
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      alert(`Backend connection failed: ${error.message}`);
    }
  };

  return (
    <div className="automated-cricket-news">
      <div className="header">
        <h1>🏏 Automated Cricket News Processor</h1>
        <p>Fetch, select, and process cricket news articles automatically</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <div className="control-item">
            <label>Search Query</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search term"
            />
          </div>
          <div className="control-item">
            <label>Max Articles</label>
            <input
              type="number"
              value={maxArticles}
              onChange={(e) => setMaxArticles(parseInt(e.target.value))}
              min="1"
              max="50"
            />
          </div>
        </div>
        <div className="control-group">
          <button 
            className="btn btn-primary" 
            onClick={fetchNews}
            disabled={loading}
          >
            {loading ? '⏳ Fetching...' : '📰 Fetch Latest News'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={processSelectedArticles}
            disabled={selectedArticles.length === 0 || processing}
          >
            {processing ? '⏳ Processing...' : `💎 Process Selected (${selectedArticles.length})`}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={clearResults}
          >
            🗑️ Clear Results
          </button>
          <button 
            className="btn btn-warning" 
            onClick={testBackend}
          >
            🧪 Test Backend
          </button>
        </div>
      </div>

      {/* Articles Section */}
      <div className="articles-section">
        <h2>💎 Available Articles ({articles.length})</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching latest cricket news...</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div 
                key={index}
                className={`article-card ${selectedArticles.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleArticleSelection(index)}
              >
                <div className="article-title">{article.title}</div>
                <div className="article-meta">
                  <span>{article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span className={`status-badge ${article.validation?.isValid ? 'valid' : 'invalid'}`}>
                    {article.validation?.isValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
                <div className="article-description">{article.summary || article.description}</div>
                <div className="article-actions">
                  <button 
                    className="btn btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Process single article
                      setSelectedArticles([index]);
                      processSelectedArticles();
                    }}
                  >
                    Process Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="results-section">
          <h2>📄 Processing Results</h2>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">{results.filter(r => !r.error).length}</div>
              <div className="stat-label">Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{results.filter(r => r.error).length}</div>
              <div className="stat-label">Failed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{results.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          
          <div className="results-container">
            {results.map((result, index) => (
              <div key={index} className={`result-item ${result.error ? 'error' : ''}`}>
                <div className="result-title">
                  {result.error ? '❌' : '✅'} {result.originalTitle}
                </div>
                <div className="result-content">
                  {result.error ? result.error : result.readyToPublishArticle}
                </div>
                {!result.error && (
                  <div className="result-meta">
                    <small>Processing time: {result.processingTime}ms</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedCricketNews;