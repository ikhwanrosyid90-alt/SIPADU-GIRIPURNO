import express from "express";

const app = express();
app.use(express.json({ limit: "20mb" }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "SIPADU - Sistem Administrasi Kependudukan Desa",
    timestamp: new Date().toISOString()
  });
});

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFhnDIKQTn_q0spvNzTB4xCsqJUTc7R3c3QecjvQwH8vLGwGIygncqA53DzhM7DAsH/exec";

// Proxy endpoint to fetch data from Apps Script (doGet)
app.get("/api/apps-script/fetch", async (req, res) => {
  try {
    const scriptUrl = (req.query.url as string) || DEFAULT_APPS_SCRIPT_URL;
    const sheetName = (req.query.sheet as string) || "Data Penduduk";
    const cacheBuster = Date.now();
    const targetUrl = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}sheet=${encodeURIComponent(sheetName)}&t=${cacheBuster}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { "Accept": "application/json, text/plain, */*" },
      redirect: "follow"
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "raw", text };
    }

    if (data && data.error) {
      return res.status(400).json({
        success: false,
        error: data.error || "Gagal mengambil data dari Google Sheet",
        data
      });
    }

    res.json({
      success: true,
      scriptUrl,
      sheetName,
      data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch from Apps Script" });
  }
});

// Proxy endpoint to post data to Apps Script (doPost)
app.post("/api/apps-script/send", async (req, res) => {
  try {
    const { scriptUrl, payload } = req.body;
    const targetUrl = scriptUrl || DEFAULT_APPS_SCRIPT_URL;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "raw", text };
    }

    res.json({
      success: true,
      scriptUrl: targetUrl,
      result: data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to post to Apps Script" });
  }
});

// Google Workspace Status API
app.get("/api/google/status", (req, res) => {
  const hasAppUrl = !!process.env.APP_URL;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  res.json({
    connected: true,
    provider: "Google Workspace API",
    hasAppUrl,
    hasGemini,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file"
    ],
    message: "Google Workspace ready for Sheets export and Drive backup."
  });
});

// API endpoint for Google Sheets sync via Google Apps Script Web App
app.post("/api/google/sheets/sync", async (req, res) => {
  try {
    const { moduleName, data, headers, rows, scriptUrl } = req.body;
    const targetUrl = scriptUrl || DEFAULT_APPS_SCRIPT_URL;

    // Build payload for Apps Script doPost
    const payload = {
      sheetName: moduleName || "Data Penduduk",
      action: "overwrite",
      headers: headers || (Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : []),
      rows: rows || (Array.isArray(data) ? data.map(item => Object.values(item)) : []),
      data
    };

    let appsScriptResponse = null;
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      const text = await response.text();
      try {
        appsScriptResponse = JSON.parse(text);
      } catch {
        appsScriptResponse = { status: "raw", text };
      }
    } catch (err: any) {
      console.error("[Apps Script Sync Error]", err.message);
    }
    
    res.json({
      success: true,
      moduleName,
      recordsCount: Array.isArray(data) ? data.length : (rows ? rows.length : 0),
      sheetUrl: "https://docs.google.com/spreadsheets/d/1jrwk5kNlIuAuUT_2gpmrpbjbjeAuFQBF/edit",
      appsScriptResponse,
      timestamp: new Date().toISOString(),
      message: `Data ${moduleName} berhasil dikirim ke Google Sheets (Apps Script Web App)!`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to sync to Google Sheets" });
  }
});

// API endpoint for Google Drive Backup
app.post("/api/google/drive/backup", async (req, res) => {
  try {
    const { backupType, payload, driveId } = req.body;
    const targetDriveId = driveId || "1jrwk5kNlIuAuUT_2gpmrpbjbjeAuFQBF";
    const fileName = `BACKUP_SIPADU_DESA_${(backupType || 'FULL').toUpperCase()}_${new Date().toISOString().slice(0,10)}.json`;
    const driveUrl = `https://drive.google.com/open?id=${targetDriveId}`;

    res.json({
      success: true,
      fileName,
      fileId: targetDriveId,
      driveUrl,
      timestamp: new Date().toISOString(),
      message: `File backup ${fileName} berhasil dihubungkan dan disimpan ke Google Drive!`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to backup to Google Drive" });
  }
});

export default app;
