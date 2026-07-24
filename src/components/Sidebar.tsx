import React from 'react';
import { useApp, ViewTab } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  UserMinus, 
  Gift, 
  MapPin, 
  Building2, 
  Calendar, 
  CalendarDays, 
  BarChart3, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  onOpenVillageSettings?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenVillageSettings, isOpen = false, onClose }) => {
  const { activeView, setActiveView, residents, assistance, agendas, notifications, villageConfig } = useApp();

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleSelectTab = (tab: ViewTab) => {
    setActiveView(tab);
    if (onClose) onClose();
  };

  const handleOpenSettings = () => {
    if (onOpenVillageSettings) onOpenVillageSettings();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#1E293B] text-slate-300 flex flex-col shrink-0 border-r border-slate-700 font-sans select-none h-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-extrabold text-white text-xs tracking-tight">SIPAK-DESA</h2>
              <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{villageConfig.namaDesa}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      {/* Sidebar Navigation */}
      <nav className="flex-1 py-4 text-xs font-medium space-y-1 overflow-y-auto px-2 custom-scrollbar">
        {/* Section 1: Main Menu */}
        <div className="px-4 py-2 text-[10px] uppercase text-slate-500 tracking-widest font-bold">
          Main Menu
        </div>

        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'dashboard' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="truncate">Dashboard Utama</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('resident')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'resident' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Data Penduduk</span>
          </div>
          <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-bold">
            {residents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('family-card')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'family-card' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span className="truncate">Kartu Keluarga</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('mutation')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'mutation' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <UserMinus className="w-4 h-4 shrink-0" />
            <span className="truncate">Mutasi & Perubahan</span>
          </div>
        </button>

        {/* Section 2: Sosial & Wilayah */}
        <div className="px-4 py-2 mt-4 text-[10px] uppercase text-slate-500 tracking-widest font-bold">
          Sosial & Wilayah
        </div>

        <button
          onClick={() => setActiveView('assistance')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'assistance' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <Gift className="w-4 h-4 shrink-0" />
            <span className="truncate">Penerimaan Bantuan</span>
          </div>
          <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded font-bold">
            {assistance.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('region')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'region' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">Wilayah Administrasi</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('organization')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'organization' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Organisasi Desa</span>
          </div>
        </button>

        {/* Section 3: Agenda & Laporan */}
        <div className="px-4 py-2 mt-4 text-[10px] uppercase text-slate-500 tracking-widest font-bold">
          Agenda & Laporan
        </div>

        <button
          onClick={() => setActiveView('agenda')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'agenda' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Agenda & Kegiatan</span>
          </div>
          <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-bold">
            {agendas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('calendar')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'calendar' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span className="truncate">Kalender Interaktif</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('reports')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'reports' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Laporan & Statistik</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('audit-log')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
            activeView === 'audit-log' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Audit Log & Akses</span>
          </div>
          {unreadNotifCount > 0 && (
            <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-bold">
              {unreadNotifCount}
            </span>
          )}
        </button>

        {/* Section 4: Pengaturan */}
        <div className="px-4 py-2 mt-4 text-[10px] uppercase text-slate-500 tracking-widest font-bold">
          Pengaturan
        </div>

        {onOpenVillageSettings && (
          <button
            onClick={onOpenVillageSettings}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors text-amber-300 hover:bg-slate-800 hover:text-amber-200 font-semibold"
          >
            <div className="flex items-center gap-3 truncate">
              <Settings className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate">Pengaturan Desa</span>
            </div>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">
              Config
            </span>
          </button>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-700 bg-slate-900 text-[10px] flex flex-col gap-1 shrink-0">
        <div className="flex justify-between items-center text-slate-300 font-medium">
          <span className="truncate">Desa {villageConfig.namaDesa}</span>
          <span className="text-green-400 font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
          </span>
        </div>
        <div className="text-slate-500 text-[9px] font-mono truncate">
          Kec. {villageConfig.kecamatan}, Kab. {villageConfig.kabupaten}
        </div>
      </div>
    </aside>
  </>
  );
};
