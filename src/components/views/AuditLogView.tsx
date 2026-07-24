import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateIndo } from '../../utils/helpers';
import { History, Shield, User, Clock, CheckCircle2 } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Audit Trail & Log Aktivitas Sistem
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
              {auditLogs.length} Catatan Log
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Transparansi dan rekam jejak setiap aksi penambahan, pengubahan, penghapusan, dan pencetakan dokumen</p>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white font-bold text-xs flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <span>Riwayat Aktivitas Administrator & Perangkat Desa</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Belum ada catatan audit log.</div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                <div className={`p-2 rounded-xl text-white font-bold shrink-0 mt-0.5 ${
                  log.action.includes('TAMBAH') ? 'bg-emerald-600' :
                  log.action.includes('HAPUS') ? 'bg-rose-600' :
                  log.action.includes('CETAK') ? 'bg-blue-600' : 'bg-amber-600'
                }`}>
                  <Shield className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{log.userRole}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">{log.details}</p>
                  <p className="text-[10px] text-slate-400">Modul: {log.module}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
