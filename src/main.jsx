// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App.jsx";
// import SavedReports from "./SavedReports.jsx"; // <-- Import new component
// // import './App.css';
// import GSCQueries from "./GSCQueries.jsx";
// import GSCInsight from "./GSCInsight.jsx";
// import DeepSeekReports from "./DeepSeekReports.jsx";
// import FunnyCommentary from "./FunnyCommentary.jsx";
// import FunnyCommentaryCompareBox from "./FunnyCommentary.jsx";
// import FunnyCommentaryDeepSeek from "./FunnyCommentaryDeepSeek.jsx";
// import GscAiReports from "./GscAiReports.jsx";
// import "./index.css";
// import GscContentRefreshReports from "./GscContentRefreshReports.jsx";
// import GscLowCtrFixes from "./GscLowCtrFixes.jsx";
// import GscTrendingKeywords from "./GscTrendingKeywords.jsx";
// import GscRankingWatchdog from "./GscRankingWatchdog.jsx";
// import GscContentQueryMatch from "./GscContentQueryMatch.jsx";
// import ArticleSummaries from "./ArticleSummaries.jsx";
// import ManualSeoAnalyzer from "./ManualSeoAnalyzer.jsx";
// import ManualSeoReports from "./ManualSeoReports.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />

//         <Route path="/prepublish" element={<ManualSeoAnalyzer />} />

//         <Route path="/prepublishreport" element={<ManualSeoReports />} />

        

//         <Route path="/saved-reports" element={<SavedReports />} />
//         <Route path="/gsc" element={<GSCQueries />} />
//         <Route path="/gsc/insight" element={<GSCInsight />} />

//         <Route path="/saved" element={<DeepSeekReports />} />

//         {/* //new tool */}

//         <Route path="/gsc/ai-reports" element={<GscAiReports />} />

//         {/* //copy of gsc ai report */}

//         <Route
//           path="/gsc/content-refresh"
//           element={<GscContentRefreshReports />}
//         />

//         <Route
//           path="/gsc/trending-keywords"
//           element={<GscTrendingKeywords />}
//         />

//         <Route path="/gsc/low-ctr" element={<GscLowCtrFixes />} />
//         <Route path="/gsc/ranking-watchdog" element={<GscRankingWatchdog />} />
//         <Route
//           path="/gsc/content-query-match"
//           element={<GscContentQueryMatch />}
//         />

//         {/* <Route path="/funny-commentary" element={<FunnyCommentaryDeepSeek matchId="88324" inningNumber={1} />} /> */}

//         <Route path="/article-summaries" element={<ArticleSummaries />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"; // 🔁 new

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

import "./index.css";
import Login from "./login_tem.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prepublish"
          element={
            <ProtectedRoute>
              <ManualSeoAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prepublishreport"
          element={
            <ProtectedRoute>
              <ManualSeoReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-reports"
          element={
            <ProtectedRoute>
              <SavedReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc"
          element={
            <ProtectedRoute>
              <GSCQueries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/insight"
          element={
            <ProtectedRoute>
              <GSCInsight />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <DeepSeekReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/ai-reports"
          element={
            <ProtectedRoute>
              <GscAiReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/content-refresh"
          element={
            <ProtectedRoute>
              <GscContentRefreshReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/trending-keywords"
          element={
            <ProtectedRoute>
              <GscTrendingKeywords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/low-ctr"
          element={
            <ProtectedRoute>
              <GscLowCtrFixes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/ranking-watchdog"
          element={
            <ProtectedRoute>
              <GscRankingWatchdog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gsc/content-query-match"
          element={
            <ProtectedRoute>
              <GscContentQueryMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article-summaries"
          element={
            <ProtectedRoute>
              <ArticleSummaries />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
