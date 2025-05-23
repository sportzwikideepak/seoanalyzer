




import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import SavedReports from './SavedReports.jsx'; // <-- Import new component
// import './App.css';
import GSCQueries from './GSCQueries.jsx';
import GSCInsight from './GSCInsight.jsx';
import DeepSeekReports from './DeepSeekReports.jsx';
import FunnyCommentary from './FunnyCommentary.jsx';
import FunnyCommentaryCompareBox from './FunnyCommentary.jsx';
import FunnyCommentaryDeepSeek from './FunnyCommentaryDeepSeek.jsx';
import GscAiReports from './GscAiReports.jsx';
import './index.css';
import GscContentRefreshReports from './GscContentRefreshReports.jsx';
import GscLowCtrFixes from './GscLowCtrFixes.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/saved-reports" element={<SavedReports />} />
        <Route path="/gsc" element={<GSCQueries />} />
        <Route path="/gsc/insight" element={<GSCInsight />} />
        <Route path="/saved" element={<DeepSeekReports />} />
        <Route path="/gsc/ai-reports" element={<GscAiReports />} />
        <Route path="/gsc/content-refresh" element={<GscContentRefreshReports />} />
<Route path="/gsc/low-ctr" element={<GscLowCtrFixes />} />


        
{/* <Route path="/funny-commentary" element={<FunnyCommentaryDeepSeek matchId="88324" inningNumber={1} />} /> */}



      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
