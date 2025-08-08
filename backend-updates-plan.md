# Backend Updates Plan for Hindi Cricket Addictor Console

## 1. Database Schema Updates

### New Tables for Hindi GSC Data
```sql
-- Hindi GSC AI Recommendations
CREATE TABLE gsc_hindi_ai_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  position DECIMAL(10,2) DEFAULT 0,
  deepseek_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  article_published_at DATE NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_article_published_at (article_published_at)
);

-- Hindi Content Refresh Recommendations
CREATE TABLE gsc_hindi_content_refresh_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  keyword VARCHAR(255),
  old_position DECIMAL(10,2),
  new_position DECIMAL(10,2),
  old_clicks INT,
  new_clicks INT,
  old_impressions INT,
  new_impressions INT,
  deepseek_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  article_published_at DATE NULL
);

-- Hindi Low CTR Fixes
CREATE TABLE gsc_hindi_low_ctr_fixes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  keyword VARCHAR(255),
  impressions INT,
  clicks INT,
  ctr DECIMAL(5,4),
  position DECIMAL(10,2),
  ai_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hindi Trending Keywords
CREATE TABLE gsc_hindi_trending_keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keywords_json JSON,
  ai_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hindi Ranking Watchdog
CREATE TABLE gsc_hindi_ranking_watchdog_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  keyword VARCHAR(255),
  last_week_position DECIMAL(10,2),
  current_position DECIMAL(10,2),
  ai_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hindi Content Query Match
CREATE TABLE gsc_hindi_content_query_match (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  query VARCHAR(255),
  impressions INT,
  clicks INT,
  ctr DECIMAL(5,4),
  position DECIMAL(10,2),
  ai_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Updated GSC Service Configuration

### Enhanced gscService.js
```javascript
// config/gscService.js
const { google } = require('googleapis');

class GSCService {
  constructor(propertyConfig) {
    this.propertyUrl = propertyConfig.propertyUrl;
    this.language = propertyConfig.language;
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  async getSearchConsoleQueries(startDate, endDate) {
    const auth = await this.auth.getClient();
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    const response = await searchconsole.searchAnalytics.query({
      siteUrl: this.propertyUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 5000,
      },
    });

    return response.data.rows || [];
  }

  async getPageData(startDate, endDate) {
    const auth = await this.auth.getClient();
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    const response = await searchconsole.searchAnalytics.query({
      siteUrl: this.propertyUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 5000,
      },
    });

    return response.data.rows || [];
  }
}

module.exports = GSCService;
```

## 3. New API Endpoints for Hindi

### Language-Specific GSC APIs
```javascript
// Hindi GSC AI Reports
app.get("/api/gsc/hi/ai-reports", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 80;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_ai_recommendations 
       ORDER BY article_published_at IS NULL, article_published_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pollDBPool.query(
      `SELECT COUNT(*) AS total FROM gsc_hindi_ai_recommendations`
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({ success: true, data: rows, page, totalPages });
  } catch (err) {
    console.error("❌ Hindi GSC AI Report Fetch Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi reports" });
  }
});

// Hindi Content Refresh
app.get("/api/gsc/hi/content-refresh", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 80;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_content_refresh_recommendations
       ORDER BY article_published_at IS NULL, article_published_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pollDBPool.query(
      `SELECT COUNT(*) AS total FROM gsc_hindi_content_refresh_recommendations`
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({ success: true, data: rows, page, totalPages });
  } catch (err) {
    console.error("❌ Hindi Content Refresh Fetch Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi data" });
  }
});

// Hindi Low CTR Fixes
app.get("/api/gsc/hi/low-ctr", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_low_ctr_fixes ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to load Hindi low CTR fixes:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi data" });
  }
});

// Hindi Trending Keywords
app.get("/api/gsc/hi/trending-keywords", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_trending_keywords ORDER BY created_at DESC`
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      keywords: JSON.parse(row.keywords_json),
    }));

    res.json({ success: true, data: formattedRows });
  } catch (err) {
    console.error("❌ Failed to fetch Hindi trending keywords:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi data" });
  }
});

// Hindi Ranking Watchdog
app.get("/api/gsc/hi/ranking-watchdog", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_ranking_watchdog_alerts ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to fetch Hindi watchdog data:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi data" });
  }
});

// Hindi Content Query Match
app.get("/api/gsc/hi/content-query-match", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(
      `SELECT * FROM gsc_hindi_content_query_match ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to load Hindi query match:", err.message);
    res.status(500).json({ success: false, error: "Failed to load Hindi data" });
  }
});
```

## 4. Updated Automation Functions

### Hindi-Specific Automation
```javascript
// runGscHindiDeepSeekAutomation.js
const GSCService = require('./config/gscService');
const { getGSCConfig } = require('./config/gscConfig');

async function runGscHindiDeepSeekAutomation() {
  const config = getGSCConfig('hi');
  const gscService = new GSCService(config);
  
  // Hindi-specific automation logic
  // Similar to English but with Hindi prompts and database tables
}

// runGscHindiContentRefreshAutomation.js
async function runGscHindiContentRefreshAutomation() {
  const config = getGSCConfig('hi');
  const gscService = new GSCService(config);
  
  // Hindi content refresh logic
}

// runGscHindiLowCtrFixAutomation.js
async function runGscHindiLowCtrFixAutomation() {
  const config = getGSCConfig('hi');
  const gscService = new GSCService(config);
  
  // Hindi low CTR fix logic
}

// runGscHindiRankingWatchdog.js
async function runGscHindiRankingWatchdog() {
  const config = getGSCConfig('hi');
  const gscService = new GSCService(config);
  
  // Hindi ranking watchdog logic
}
```

## 5. Updated Cron Jobs

### Multi-Property Cron Schedule
```javascript
// Updated cron schedule to handle both properties
cron.schedule(
  "0 9,16 * * *",
  async () => {
    const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    console.log(`🚀 [${now} IST] Starting scheduled GSC AI analysis...`);
    
    try {
      // English Cricket Addictor
      console.log("📈 Processing English Cricket Addictor...");
      await runGscDeepSeekAutomation();
      await runGscContentRefreshAutomation();
      await runGscTrendingKeywords();
      await runGscLowCtrFixAutomation();
      await runGscRankingWatchdog();
      
      // Hindi Cricket Addictor
      console.log("📈 Processing Hindi Cricket Addictor...");
      await runGscHindiDeepSeekAutomation();
      await runGscHindiContentRefreshAutomation();
      await runGscHindiLowCtrFixAutomation();
      await runGscHindiRankingWatchdog();
      
      console.log("✅ All GSC AI analysis complete.");
    } catch (error) {
      console.error("❌ GSC AI automation failed:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
```

## 6. Environment Variables

### Additional Environment Variables
```bash
# Hindi Cricket Addictor GSC Property
HINDI_GSC_PROPERTY_URL=https://hindi.cricketaddictor.com
HINDI_GSC_PROPERTY_NAME="Cricket Addictor (Hindi)"

# Hindi-specific API keys (if needed)
HINDI_DEEPSEEK_API_KEY=your_hindi_deepseek_key
HINDI_OPENAI_API_KEY=your_hindi_openai_key
```

## 7. Implementation Steps

1. **Database Setup**: Run the SQL scripts to create Hindi tables
2. **Backend Updates**: Implement the new API endpoints and automation functions
3. **Frontend Integration**: Update components to use language-specific APIs
4. **Testing**: Test both English and Hindi flows
5. **Deployment**: Deploy with new environment variables
6. **Monitoring**: Set up monitoring for both properties

## 8. Benefits

- **Separate Data**: Hindi and English data are completely separate
- **Language-Specific Analysis**: AI prompts can be optimized for each language
- **Scalable**: Easy to add more languages in the future
- **Maintainable**: Clear separation of concerns
- **Performance**: Each property can be optimized independently

