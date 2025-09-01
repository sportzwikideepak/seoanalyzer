// ===========================================
// HINDI GSC BACKEND APIs - ADD TO MAIN FILE
// ===========================================

// 1. Hindi GSC Content Refresh API
app.get("/api/gsc/hi/content-refresh", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 80;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pollDBPool.query(
      `
      SELECT id, url, keyword, old_position, new_position, old_clicks, new_clicks,
             old_impressions, new_impressions, deepseek_output,
             article_published_at, created_at
      FROM gsc_hindi_content_refresh_recommendations
      ORDER BY 
        article_published_at IS NULL,
        article_published_at DESC,
        created_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    const [countResult] = await pollDBPool.query(`
      SELECT COUNT(*) AS total FROM gsc_hindi_content_refresh_recommendations
    `);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({ success: true, data: rows, page, totalPages });
  } catch (err) {
    console.error("❌ Hindi Content Refresh Fetch Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to load data" });
  }
});

// 2. Hindi GSC Low CTR Fixes API
app.get("/api/gsc/hi/low-ctr", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(`
      SELECT * FROM gsc_hindi_low_ctr_fixes ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to load Hindi low CTR fixes:", err.message);
    res.status(500).json({ success: false, error: "Failed to load data" });
  }
});

// 3. Hindi GSC Ranking Watchdog API
app.get("/api/gsc/hi/ranking-watchdog", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(`
      SELECT * FROM gsc_hindi_ranking_watchdog_alerts ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to fetch Hindi watchdog data:", err.message);
    res.status(500).json({ success: false, error: "Failed to load data" });
  }
});

// 4. Hindi GSC Content Query Match API
app.get("/api/gsc/hi/content-query-match", async (req, res) => {
  try {
    const [rows] = await pollDBPool.query(`
      SELECT * FROM gsc_hindi_content_query_match ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Failed to load Hindi query match:", err.message);
    res.status(500).json({ success: false, error: "Failed to load data" });
  }
});

// 5. Test APIs for Hindi automations
app.post("/api/test-hindi-content-refresh", async (req, res) => {
  try {
    await runHindiGscContentRefreshAutomation();
    res.json({ success: true, message: "Hindi content refresh automation completed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/test-hindi-low-ctr", async (req, res) => {
  try {
    await runHindiGscLowCtrFixAutomation();
    res.json({ success: true, message: "Hindi low CTR fix automation completed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/test-hindi-ranking-watchdog", async (req, res) => {
  try {
    await runHindiGscRankingWatchdog();
    res.json({ success: true, message: "Hindi ranking watchdog automation completed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/test-hindi-content-query-match", async (req, res) => {
  try {
    await runHindiGscContentQueryMatch();
    res.json({ success: true, message: "Hindi content query match automation completed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===========================================
// CRON JOB UPDATES - ADD TO EXISTING CRON
// ===========================================

// Update your existing cron schedule to include Hindi automations:
/*
cron.schedule(
  "0 9,16 * * *",
  async () => {
    const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    console.log(`🚀 [${now} IST] Starting scheduled GSC AI analysis...`);
    try {
      // English automations
      await runGscDeepSeekAutomation();
      console.log("✅ English GSC AI analysis complete.");
      await runGscContentRefreshAutomation();
      console.log("✅ English GSC refresh complete.");
      await runGscLowCtrFixAutomation();
      console.log("✅ English low CTR fix complete.");
      await runGscRankingWatchdog();
      console.log("✅ English ranking watchdog complete.");

      // Hindi automations
      await runHindiGscDeepSeekAutomation();
      console.log("✅ Hindi GSC AI analysis complete.");
      await runHindiGscContentRefreshAutomation();
      console.log("✅ Hindi content refresh complete.");
      await runHindiGscLowCtrFixAutomation();
      console.log("✅ Hindi low CTR fix complete.");
      await runHindiGscRankingWatchdog();
      console.log("✅ Hindi ranking watchdog complete.");
      await runHindiGscContentQueryMatch();
      console.log("✅ Hindi content query match complete.");
    } catch (error) {
      console.error("❌ GSC automation failed:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
*/
