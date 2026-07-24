import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Bell, 
  ShieldAlert, 
  FileSpreadsheet, 
  HardDrive, 
  RefreshCw, 
  UserCheck, 
  Printer, 
  CheckCircle2, 
  X,
  ExternalLink,
  Sparkles,
  Building2,
  Settings,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenGoogleModal: () => void;
  onOpenPrintModal: () => void;
  onOpenVillageSettings: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenGoogleModal, 
  onOpenPrintModal, 
  onOpenVillageSettings,
  onToggleMobileSidebar
}) => {
  const { 
    currentUserRole, 
    setCurrentUserRole, 
    currentUserName, 
    notifications, 
    markNotificationRead,
    syncModuleToGoogleSheets,
    residents,
    resetDataToDefault,
    villageConfig
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const rolesList: UserRole[] = [
    'Super Admin',
    'Administrator Desa',
    'Operator Kependudukan',
    'Sekretaris Desa',
    'Kepala Dusun',
    'Ketua RW',
    'Ketua RT',
    'Operator Bantuan',
    'Operator Organisasi',
    'Operator Agenda',
    'Kepala Desa'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleQuickSyncSheets = async () => {
    setIsSyncingSheets(true);
    setSyncMessage(null);
    const res = await syncModuleToGoogleSheets('Data Penduduk', residents);
    setIsSyncingSheets(false);
    if (res.success) {
      setSyncMessage('Berhasil disinkronkan ke Google Sheets!');
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <header className="h-16 bg-[#1E3A8A] text-white flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-md z-30 sticky top-0">
      {/* Title & Emblem Area */}
      <div className="flex items-center space-x-2 sm:space-x-3 truncate">
        {/* Mobile Hamburger Toggle Button */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-0.5">
          {villageConfig.logoUrl ? (
            <img src={villageConfig.logoUrl} alt="Logo Desa" className="w-full h-full object-contain" />
          ) : (
            <div className="w-7 h-7 border-4 border-[#1E3A8A] rounded-xs flex items-center justify-center">
              <span className="text-[#1E3A8A] font-black text-[10px]">
                {villageConfig.namaDesa ? villageConfig.namaDesa.substring(0, 2).toUpperCase() : 'SD'}
              </span>
            </div>
          )}
        </div>
        <div className="truncate">
          <h1 className="text-xs sm:text-base font-extrabold leading-none tracking-tight uppercase flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="truncate">SIPADU DESA {villageConfig.namaDesa || 'SUKAMUJU'}</span>
            <span className="hidden md:inline-block text-[10px] bg-blue-500/30 text-blue-100 font-semibold px-2 py-0.5 rounded border border-blue-400/30 uppercase shrink-0">
              KEC. {villageConfig.kecamatan || 'CIBINONG'}
            </span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-blue-200 opacity-90 uppercase tracking-widest mt-1 truncate">
            {villageConfig.kabupaten ? `KAB. ${villageConfig.kabupaten}` : 'Sistem Administrasi Kependudukan Terintegrasi'}
          </p>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Sync Notification Banner */}
        {syncMessage && (
          <div className="hidden xl:flex text-xs bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 px-3 py-1 rounded-md items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">{syncMessage}</span>
          </div>
        )}

        {/* Quick Action: Pengaturan Desa */}
        <button
          onClick={onOpenVillageSettings}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-2.5 py-1.5 rounded-md shadow-xs transition-colors"
          title="Atur Nama Desa, Kepala Desa, dan Alamat"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline text-[11px]">Set Desa</span>
        </button>

        {/* Quick Action: Cetak Surat */}
        <button
          onClick={onOpenPrintModal}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-2.5 py-1.5 rounded-md border border-white/20 transition-colors"
          title="Cetak Dokumen Resmi (Biodata, KK Sementara, Surat Pengantar)"
        >
          <Printer className="w-3.5 h-3.5 text-blue-200" />
          <span className="hidden sm:inline text-[11px]">Cetak</span>
        </button>

        {/* Quick Action: Google Workspace Sync Button */}
        <button
          onClick={handleQuickSyncSheets}
          disabled={isSyncingSheets}
          className="hidden md:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-2.5 py-1.5 rounded-md shadow-xs transition-colors"
          title="Sync Langsung ke Google Sheets"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="text-[11px]">{isSyncingSheets ? 'Sync...' : 'Sheets'}</span>
        </button>

        {/* Google Workspace Cloud Status Badge */}
        <button
          onClick={onOpenGoogleModal}
          className="flex items-center gap-1.5 bg-blue-900/60 hover:bg-blue-900/90 text-blue-100 font-semibold text-xs px-2.5 py-1.5 rounded-md border border-blue-400/30 transition-colors"
          title="Google Workspace (Sheets & Drive Integrasi)"
        >
          <HardDrive className="w-3.5 h-3.5 text-sky-300" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden lg:inline text-[10px]">Drive & Sheets</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <span className="font-bold text-xs">Notifikasi Sistem Real-time</span>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                  {unreadCount} Baru
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-center text-slate-400">Tidak ada notifikasi.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-blue-50/60 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-blue-400/30 my-auto"></div>

        {/* Role Switcher Badge */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/30 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs border border-white/20 flex items-center justify-center">
              {currentUserName.charAt(0)}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white leading-tight">{currentUserName}</p>
              <p className="text-[10px] text-blue-200 font-medium flex items-center justify-end gap-1">
                <UserCheck className="w-2.5 h-2.5 text-emerald-400" />
                {currentUserRole}
              </p>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <div className="px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                Simulasi Hak Akses (RBAC)
              </div>
              <div className="max-h-60 overflow-y-auto">
                {rolesList.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentUserRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                      currentUserRole === role ? 'font-bold text-blue-900 bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{role}</span>
                    {currentUserRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 p-2">
                <button
                  onClick={() => {
                    if (confirm('Reset seluruh data simulasi ke kondisi awal?')) {
                      resetDataToDefault();
                      setShowRoleMenu(false);
                    }
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded font-medium flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Data Simulasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
