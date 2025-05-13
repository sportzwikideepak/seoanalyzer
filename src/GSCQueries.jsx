import React, { useEffect, useState } from "react";
import axios from "axios";

// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";
const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api"; // for local dev

function GSCQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/gsc/queries`)
      .then((res) => {
        setQueries(res.data.queries || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch GSC queries", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2>📈 Google Search Console - Top Queries</h2>

      {loading ? (
        <p>Loading GSC data...</p>
      ) : queries.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <table className="seo-table-markdown">
          <thead>
            <tr>
              <th>Query</th>
              <th>Clicks</th>
              <th>Impressions</th>
              <th>CTR (%)</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((row, idx) => (
              <tr key={idx}>
                <td>{row.keys[0]}</td>
                <td>{row.clicks}</td>
                <td>{row.impressions}</td>
                <td>{(row.ctr * 100).toFixed(2)}</td>
                <td>{row.position.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GSCQueries;
