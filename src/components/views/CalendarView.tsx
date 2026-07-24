import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageAgenda } from '../../types';
import { formatDateIndo } from '../../utils/helpers';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  BellRing,
  Info
} from 'lucide-react';

interface CalendarViewProps {
  onOpenAddModal: (dateStr?: string) => void;
  onEditAgenda: (agenda: VillageAgenda) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenAddModal, onEditAgenda }) => {
  const { agendas } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default July 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAgendasForDate = (dateNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dateNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return agendas.filter(a => a.tanggal === dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Kalender Agenda & Kegiatan Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Klik tanggal pada kalender untuk menjadwalkan musyawarah, posyandu, atau kerja bakti</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-slate-900 text-sm px-3 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-900 text-white text-center font-bold text-xs py-3 border-b border-slate-800">
          <div className="text-rose-400">Minggu</div>
          <div>Senin</div>
          <div>Selasa</div>
          <div>Rabu</div>
          <div>Kamis</div>
          <div>Jumat</div>
          <div className="text-blue-300">Sabtu</div>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
          {calendarDays.map((dateNum, idx) => {
            if (dateNum === null) {
              return <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[110px]"></div>;
            }

            const dayAgendas = getAgendasForDate(dateNum);
            const isToday = dateNum === 15 && month === 6; // Mock July 15 as today
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dateNum).padStart(2, '0');
            const fullDateStr = `${year}-${formattedMonth}-${formattedDay}`;

            return (
              <div
                key={`day-${dateNum}`}
                onClick={() => onOpenAddModal(fullDateStr)}
                className={`p-2 min-h-[110px] hover:bg-blue-50/40 transition-colors cursor-pointer relative group flex flex-col justify-between ${
                  isToday ? 'bg-blue-50/80 ring-2 ring-blue-500/30' : 'bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-extrabold text-xs px-1.5 py-0.5 rounded ${
                      isToday ? 'bg-blue-600 text-white' : 'text-slate-800'
                    }`}>
                      {dateNum}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddModal(fullDateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-blue-600 hover:bg-blue-100 rounded text-[10px] font-bold"
                      title="Tambah Kegiatan Tanggal Ini"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[85px] overflow-y-auto">
                    {dayAgendas.map((a) => (
                      <div
                        key={a.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAgenda(a);
                        }}
                        className={`p-1 rounded text-[10px] font-bold truncate leading-tight shadow-2xs ${
                          a.jenisKegiatan === 'Musyawarah' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          a.jenisKegiatan === 'Posyandu' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          a.jenisKegiatan === 'Gotong Royong' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-purple-100 text-purple-900 border border-purple-300'
                        }`}
                        title={`${a.namaKegiatan} (${a.waktuMulai} WIB)`}
                      >
                        {a.waktuMulai} {a.namaKegiatan}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
