import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import SavedReports from "./SavedReports.jsx";
import GSCQueries from "./GSCQueries.jsx";
import GSCInsight from "./GSCInsight.jsx";
import DeepSeekReports from "./DeepSeekReports.jsx";
import FunnyCommentaryDeepSeek from "./FunnyCommentaryDeepSeek.jsx";
import GscAiReports from "./GscAiReports.jsx";
import GscContentRefreshReports from "./GscContentRefreshReports.jsx";
import GscLowCtrFixes from "./GscLowCtrFixes.jsx";
import GscTrendingKeywords from "./GscTrendingKeywords.jsx";
import GscRankingWatchdog from "./GscRankingWatchdog.jsx";
import GscContentQueryMatch from "./GscContentQueryMatch.jsx";
import ArticleSummaries from "./ArticleSummaries.jsx";
import ManualSeoAnalyzer from "./ManualSeoAnalyzer.jsx";
import ManualSeoReports from "./ManualSeoReports.jsx";
import Chatbot from "./Chatbot_use.jsx";
import SmartJournalistRewrite from "./SmartJournalistRewrite.jsx";
import AnalyzePublishArticle from "./AnalyzePublishArticle.jsx";
import TranslatePublishArticle from "./TranslatePublishArticle.jsx";
import HindiGscReports from "./HindiGscReports.jsx";
import HindiGscContentRefresh from "./HindiGscContentRefresh.jsx";
import HindiGscLowCtr from "./HindiGscLowCtr.jsx";
import HindiGscRankingWatchdog from "./HindiGscRankingWatchdog.jsx";
import HindiGscContentQueryMatch from "./HindiGscContentQueryMatch.jsx";

import "./index.css";
import Login from "./login_tem.jsx";
import PromptConsole from "./PromptConsole.jsx";
// In your main.jsx file, add this route:
import AutomatedCricketNews from './AutomatedCricketNews.jsx';
import HindiCricketNews from "./HindiCricketNews.jsx";
// Add this import
import ViralContentGenerator from './ViralContentGenerator.jsx';

// Add this route in your existing routes

// Add this route to your existing routes:

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login page (no sidebar layout) */}
        <Route path="/login" element={<Login />} />

        {/* All routes inside App layout with sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          {/* Common routes */}
          <Route path="analyze-article" element={<AnalyzePublishArticle />} />
          <Route path="saved-reports" element={<SavedReports />} />
          <Route path="prepublish" element={<ManualSeoAnalyzer />} />
          <Route path="prepublishreport" element={<ManualSeoReports />} />
          <Route path="article-summaries" element={<ArticleSummaries />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="journalist-rewrite" element={<SmartJournalistRewrite />} />
          <Route path="prompt-console" element={<PromptConsole />} />
          <Route path="hindi-converter" element={<TranslatePublishArticle />} />
          <Route path="automated-cricket-news" element={<AutomatedCricketNews />} />
          <Route path="viral-content-generator" element={<ViralContentGenerator />} />

 
         <Route path="hindi-cricket-news" element={<HindiCricketNews />} />


          {/* GSC Routes */}
          <Route path="gsc/ai-reports" element={<GscAiReports />} />
          <Route path="gsc/content-refresh" element={<GscContentRefreshReports />} />
          <Route path="gsc/trending-keywords" element={<GscTrendingKeywords />} />
          <Route path="gsc/low-ctr" element={<GscLowCtrFixes />} />
          <Route path="gsc/ranking-watchdog" element={<GscRankingWatchdog />} />
          <Route path="gsc/content-query-match" element={<GscContentQueryMatch />} />

          {/* Hindi GSC Routes */}
          <Route path="hindi-gsc-reports" element={<HindiGscReports />} />
          <Route path="hindi-content-refresh" element={<HindiGscContentRefresh />} />
          <Route path="hindi-low-ctr" element={<HindiGscLowCtr />} />
          <Route path="hindi-ranking-watchdog" element={<HindiGscRankingWatchdog />} />
          <Route path="hindi-content-query-match" element={<HindiGscContentQueryMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
