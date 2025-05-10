// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';     // <-- Make sure this matches the file
// import './App.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );




import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import SavedReports from './SavedReports.jsx'; // <-- Import new component
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/saved-reports" element={<SavedReports />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
