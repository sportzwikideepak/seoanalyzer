// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import App from "./App.jsx";
// import ProtectedRoute from "./ProtectedRoute.jsx"; // 🔁 new

// import SavedReports from "./SavedReports.jsx";
// import GSCQueries from "./GSCQueries.jsx";
// import GSCInsight from "./GSCInsight.jsx";
// import DeepSeekReports from "./DeepSeekReports.jsx";
// import FunnyCommentaryDeepSeek from "./FunnyCommentaryDeepSeek.jsx";
// import GscAiReports from "./GscAiReports.jsx";
// import GscContentRefreshReports from "./GscContentRefreshReports.jsx";
// import GscLowCtrFixes from "./GscLowCtrFixes.jsx";
// import GscTrendingKeywords from "./GscTrendingKeywords.jsx";
// import GscRankingWatchdog from "./GscRankingWatchdog.jsx";
// import GscContentQueryMatch from "./GscContentQueryMatch.jsx";
// import ArticleSummaries from "./ArticleSummaries.jsx";
// import ManualSeoAnalyzer from "./ManualSeoAnalyzer.jsx";
// import ManualSeoReports from "./ManualSeoReports.jsx";
// import Chatbot from "./Chatbot_use.jsx";

// import "./index.css";
// import Login from "./login_tem.jsx";
// import SmartJournalistRewrite from "./SmartJournalistRewrite.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         {/* <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <App />
//             </ProtectedRoute>
//           }
//         /> */}

//         <Route
//           path="/analyze-article"
//           element={
//             <ProtectedRoute>
//               <AnalyzePublishArticle />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/prepublish"
//           element={
//             <ProtectedRoute>
//               <ManualSeoAnalyzer />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/prepublishreport"
//           element={
//             <ProtectedRoute>
//               <ManualSeoReports />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/saved-reports"
//           element={
//             <ProtectedRoute>
//               <SavedReports />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc"
//           element={
//             <ProtectedRoute>
//               <GSCQueries />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/insight"
//           element={
//             <ProtectedRoute>
//               <GSCInsight />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/saved"
//           element={
//             <ProtectedRoute>
//               <DeepSeekReports />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/ai-reports"
//           element={
//             <ProtectedRoute>
//               <GscAiReports />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/content-refresh"
//           element={
//             <ProtectedRoute>
//               <GscContentRefreshReports />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/trending-keywords"
//           element={
//             <ProtectedRoute>
//               <GscTrendingKeywords />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/low-ctr"
//           element={
//             <ProtectedRoute>
//               <GscLowCtrFixes />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/ranking-watchdog"
//           element={
//             <ProtectedRoute>
//               <GscRankingWatchdog />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/gsc/content-query-match"
//           element={
//             <ProtectedRoute>
//               <GscContentQueryMatch />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/article-summaries"
//           element={
//             <ProtectedRoute>
//               <ArticleSummaries />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/chatbot"
//           element={
//             <ProtectedRoute>
//               <Chatbot />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/journalist-rewrite"
//           element={
//             <ProtectedRoute>
//               <SmartJournalistRewrite />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );







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
import AnalyzePublishArticle from "./AnalyzePublishArticle.jsx"; // ✅ you missed this import
import TranslatePublishArticle from "./TranslatePublishArticle.jsx";  // 🆕 Hindi converter

import "./index.css";
import Login from "./login_tem.jsx";
import PromptConsole from "./PromptConsole.jsx";

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
          <Route path="analyze-article" element={<AnalyzePublishArticle />} />
          <Route path="saved-reports" element={<SavedReports />} />
          <Route path="prepublish" element={<ManualSeoAnalyzer />} />
          <Route path="prepublishreport" element={<ManualSeoReports />} />
          {/* <Route path="gsc" element={<GSCQueries />} /> */}
          {/* <Route path="gsc/insight" element={<GSCInsight />} /> */}
          {/* <Route path="saved" element={<DeepSeekReports />} /> */}
          <Route path="gsc/ai-reports" element={<GscAiReports />} />
          <Route path="gsc/content-refresh" element={<GscContentRefreshReports />} />
          <Route path="gsc/trending-keywords" element={<GscTrendingKeywords />} />
          <Route path="gsc/low-ctr" element={<GscLowCtrFixes />} />
          <Route path="gsc/ranking-watchdog" element={<GscRankingWatchdog />} />
          <Route path="gsc/content-query-match" element={<GscContentQueryMatch />} />
          <Route path="article-summaries" element={<ArticleSummaries />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="journalist-rewrite" element={<SmartJournalistRewrite />} />
          <Route path="prompt-console" element={<PromptConsole />} />
          <Route path="hindi-converter" element={<TranslatePublishArticle />} />  {/* 🆕 */}


        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
