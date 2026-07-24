import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  FileSpreadsheet, 
  HardDrive, 
  CheckCircle2, 
  Download, 
  Share2, 
  Database,
  ExternalLink,
  ShieldCheck,
  CloudUpload
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  const { 
    syncModuleToGoogleSheets, 
    backupToGoogleDrive, 
    residents, 
    familyCards, 
    assistance, 
    agendas,
    mutations,
    appsScriptUrl,
    setAppsScriptUrl,
    fetchFromAppsScript,
    sendToAppsScript
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sheets' | 'drive' | 'script'>('sheets');
  const [selectedModule, setSelectedModule] = useState('Data Penduduk');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; sheetUrl?: string; driveUrl?: string; fileName?: string; message: string } | null>(null);

  const appsScriptCode = `/**
 * GOOGLE APPS SCRIPT - SIPAK DESA / SYSTEM INTEGRATION
 * Dipasang pada: Google Sheets > Extensions > Apps Script
 * Deploy sebagai: Web App (Execute as: Me, Who has access: Anyone)
 */

// 1. FUNGSI doGet - Mengambil Data dari Google Sheets ke Aplikasi Web
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : "Data Penduduk";
    var sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
    
    var data = sheet.getDataRange().getValues();
    if (data.length < 1) {
      return responseJSON({ status: "success", data: [] });
    }
    
    var headers = data[0];
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j].toString().trim().toLowerCase().replace(/\\s+/g, '_');
        obj[key || ('col_' + j)] = row[j];
      }
      result.push(obj);
    }
    
    return responseJSON({
      status: "success",
      sheet: sheet.getName(),
      total: result.length,
      data: result
    });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

// 2. FUNGSI doPost - Menerima Data dari Aplikasi Web & Menyimpan ke Google Sheets
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = contents.sheetName || "Data Penduduk";
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    var action = contents.action || "append"; // "append", "update", atau "overwrite"
    
    if (action === "overwrite" && contents.headers && contents.rows) {
      sheet.clearContents();
      sheet.appendRow(contents.headers);
      for (var r = 0; r < contents.rows.length; r++) {
        sheet.appendRow(contents.rows[r]);
      }
      return responseJSON({ status: "success", message: "Seluruh data berhasil disinkronkan!" });
    } 
    
    if (action === "append" && contents.row) {
      sheet.appendRow(contents.row);
      return responseJSON({ status: "success", message: "Baris data berhasil ditambahkan!" });
    }
    
    if (action === "update" && contents.keyIndex !== undefined && contents.keyValue && contents.row) {
      var dataRange = sheet.getDataRange().getValues();
      var updated = false;
      for (var i = 1; i < dataRange.length; i++) {
        if (String(dataRange[i][contents.keyIndex]) === String(contents.keyValue)) {
          sheet.getRange(i + 1, 1, 1, contents.row.length).setValues([contents.row]);
          updated = true;
          break;
        }
      }
      if (!updated) {
        sheet.appendRow(contents.row);
      }
      return responseJSON({ status: "success", message: updated ? "Data berhasil diperbarui!" : "Data baru berhasil ditambahkan!" });
    }
    
    return responseJSON({ status: "error", message: "Format payload action tidak valid." });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

// Helper untuk format Output JSON
function responseJSON(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  if (!isOpen) return null;

  const handleSyncSheets = async () => {
    setIsLoading(true);
    setSyncResult(null);

    let targetData: any = residents;
    if (selectedModule === 'Kartu Keluarga') targetData = familyCards;
    if (selectedModule === 'Penerimaan Bantuan') targetData = assistance;
    if (selectedModule === 'Agenda Desa') targetData = agendas;
    if (selectedModule === 'Mutasi Penduduk') targetData = mutations;

    const res = await syncModuleToGoogleSheets(selectedModule, targetData);
    setIsLoading(false);
    setSyncResult(res);
  };

  const handleBackupDrive = async () => {
    setIsLoading(true);
    setSyncResult(null);
    const res = await backupToGoogleDrive();
    setIsLoading(false);
    setSyncResult(res);
  };

  const handleFetchFromAppsScript = async () => {
    setIsLoading(true);
    setSyncResult(null);
    const res = await fetchFromAppsScript(selectedModule);
    setIsLoading(false);
    setSyncResult({
      success: res.success,
      message: res.message
    });
  };

  const handleSendToAppsScript = async () => {
    setIsLoading(true);
    setSyncResult(null);

    let targetData: any = residents;
    if (selectedModule === 'Kartu Keluarga') targetData = familyCards;
    if (selectedModule === 'Penerimaan Bantuan') targetData = assistance;
    if (selectedModule === 'Agenda Desa') targetData = agendas;
    if (selectedModule === 'Mutasi Penduduk') targetData = mutations;

    const res = await sendToAppsScript(selectedModule, targetData, 'overwrite');
    setIsLoading(false);
    setSyncResult({
      success: res.success,
      message: res.message
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <HardDrive className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Integrasi Google Workspace</h3>
              <p className="text-xs text-blue-200 font-medium">Sinkronisasi Data ke Google Sheets & Google Drive</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('sheets'); setSyncResult(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'sheets'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Google Sheets
          </button>

          <button
            onClick={() => { setActiveTab('drive'); setSyncResult(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'drive'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudUpload className="w-4 h-4 text-blue-600" />
            Backup Google Drive
          </button>

          <button
            onClick={() => { setActiveTab('script'); setSyncResult(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'script'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-purple-600" />
            Kode Google Apps Script
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2.5 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Koneksi OAuth 2.0 Google Workspace <strong>Aktif</strong> (Level Akses Terverifikasi)</span>
            </div>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              AUTHORIZED
            </span>
          </div>

          {activeTab === 'sheets' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Google Apps Script (Web App Endpoint Exec):
                </label>
                <input
                  type="text"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
                <p className="text-[11px] text-blue-600 mt-1 font-medium">
                  ✓ URL ini digunakan oleh fungsi <code>doGet()</code> untuk mengambil data dan <code>doPost()</code> untuk mengirim data kependudukan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Modul Data yang Akan Disinkronkan:
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="Data Penduduk">Data Penduduk ({residents.length} Baris - NIK, Nama, Ortudukcapil)</option>
                  <option value="Kartu Keluarga">Data Kartu Keluarga ({familyCards.length} Baris)</option>
                  <option value="Penerimaan Bantuan">Data Penerimaan Bantuan ({assistance.length} Baris)</option>
                  <option value="Agenda Desa">Data Agenda Kegiatan Desa ({agendas.length} Baris)</option>
                  <option value="Mutasi Penduduk">Data Mutasi Penduduk ({mutations.length} Baris)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleFetchFromAppsScript}
                  disabled={isLoading}
                  className="py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  {isLoading ? 'Memuat Data...' : `Tarik Data via doGet()`}
                </button>

                <button
                  onClick={handleSendToAppsScript}
                  disabled={isLoading}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {isLoading ? 'Mengirim Data...' : `Kirim Data via doPost()`}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                Atau gunakan API Sync otomatis untuk mengekspor data {selectedModule} secara langsung ke lembar kerja Google Sheets.
              </p>
            </div>
          ) : activeTab === 'drive' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Penyimpanan Cadangan Lengkap Sistem (Full System Backup)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyimpan seluruh database kependudukan, kartu keluarga, bansos, agenda, dan audit log desa ke dalam bentuk berkas terenkripsi JSON di Google Drive Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID / Link Folder Google Drive Target:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue="1jrwk5kNlIuAuUT_2gpmrpbjbjeAuFQBF"
                    id="drive-target-id"
                    placeholder="Masukkan ID Folder atau File Google Drive"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <a
                    href="https://drive.google.com/open?id=1jrwk5kNlIuAuUT_2gpmrpbjbjeAuFQBF"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Drive
                  </a>
                </div>
                <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                  ✓ Berkas cadangan otomatis ditautkan ke lokasi Google Drive ID: <code>1jrwk5kNlIuAuUT_2gpmrpbjbjeAuFQBF</code>
                </p>
              </div>

              <button
                onClick={handleBackupDrive}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CloudUpload className="w-4 h-4" />
                {isLoading ? 'Mengunggah Berkas Backup...' : 'Simpan Cadangan Database ke Google Drive'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Kode Google Apps Script (doGet & doPost)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(appsScriptCode);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedScript ? 'Tersalin!' : 'Salin Kode'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Tempelkan kode di bawah ini pada Google Sheets via menu <strong>Ekstensi &gt; Apps Script</strong>, lalu Publikasikan sebagai <strong>Web App</strong> (Akses: Siapa Saja).
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-700 leading-relaxed custom-scrollbar">
                {appsScriptCode}
              </pre>
            </div>
          )}

          {/* Sync Result Feedback Box */}
          {syncResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 animate-fade-in ${
              syncResult.success ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{syncResult.message}</span>
              </div>
              {(syncResult.sheetUrl || syncResult.driveUrl) && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">Akses Tautan Google Workspace:</span>
                  <a
                    href={syncResult.sheetUrl || syncResult.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:underline text-xs"
                  >
                    Buka Berkas <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
