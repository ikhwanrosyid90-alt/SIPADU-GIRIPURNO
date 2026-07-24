import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageAgenda } from '../../types';
import { formatDateIndo, formatRupiah, exportTableToPDF } from '../../utils/helpers';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2,
  CalendarCheck
} from 'lucide-react';

interface AgendaViewProps {
  onOpenAddModal: (date?: string) => void;
  onEditAgenda: (agenda: VillageAgenda) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ onOpenAddModal, onEditAgenda }) => {
  const { agendas, deleteAgenda } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Rencana' | 'Berlangsung' | 'Selesai'>('ALL');

  const filteredAgendas = agendas.filter(a => activeFilter === 'ALL' || a.statusKegiatan === activeFilter);

  const handlePrintNotulen = (agenda: VillageAgenda) => {
    const headers = ['Komponen Laporan', 'Rincian Notulen Musyawarah / Agenda'];
    const rows = [
      ['Nama Kegiatan', agenda.namaKegiatan],
      ['Kategori', agenda.jenisKegiatan],
      ['Tanggal & Waktu', `${agenda.tanggal} (${agenda.waktuMulai} - ${agenda.waktuSelesai} WIB)`],
      ['Lokasi Pelaksanaan', `${agenda.lokasi} (${agenda.dusun})`],
      ['Penyelenggara / Penanggungjawab', `${agenda.organisasiPenanggungJawab}`],
      ['Estimasi Anggaran', formatRupiah(agenda.anggaran)],
      ['Notulen & Keputusan Rapat', agenda.notulen || 'Belum diisikan notulen hasil rapat.']
    ];
    exportTableToPDF(
      `BERITA ACARA & NOTULEN KEGIATAN DESA SUKAMUJU\nKEGIATAN: ${agenda.namaKegiatan.toUpperCase()}`,
      headers,
      rows,
      `NOTULEN_${agenda.namaKegiatan.replace(/\s+/g, '_')}`
    );
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Agenda Kegiatan & Musyawarah Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Jadwal Musrenbangdes, Kerja Bakti, Posyandu, Pelatihan, dan Notulen Hasil Rapat</p>
        </div>

        <button
          onClick={() => onOpenAddModal()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Jadwalkan Agenda Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Semua Agenda ({agendas.length})
        </button>
        <button
          onClick={() => setActiveFilter('Rencana')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeFilter === 'Rencana' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'}`}
        >
          Akan Datang ({agendas.filter(a => a.statusKegiatan === 'Rencana').length})
        </button>
        <button
          onClick={() => setActiveFilter('Berlangsung')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeFilter === 'Berlangsung' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'}`}
        >
          Berlangsung Hari Ini ({agendas.filter(a => a.statusKegiatan === 'Berlangsung').length})
        </button>
        <button
          onClick={() => setActiveFilter('Selesai')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeFilter === 'Selesai' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'}`}
        >
          Selesai ({agendas.filter(a => a.statusKegiatan === 'Selesai').length})
        </button>
      </div>

      {/* Agenda Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgendas.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                {a.jenisKegiatan}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                a.statusKegiatan === 'Rencana' ? 'bg-blue-100 text-blue-800' :
                a.statusKegiatan === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {a.statusKegiatan}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">{a.namaKegiatan}</h3>
            <p className="text-xs text-slate-600 line-clamp-2">{a.deskripsi}</p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold">{formatDateIndo(a.tanggal)} ({a.waktuMulai} - {a.waktuSelesai} WIB)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{a.lokasi} ({a.dusun})</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono font-bold text-emerald-800">Anggaran: {formatRupiah(a.anggaran)}</span>
              </div>
            </div>

            {a.notulen && (
              <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-200 text-xs text-blue-900">
                <strong className="block text-[10px] uppercase font-bold text-blue-800">Ringkasan Notulen:</strong>
                <p className="text-[11px] italic mt-0.5">{a.notulen}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handlePrintNotulen(a)}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" /> Cetak Berita Acara & Notulen
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditAgenda(a)}
                  className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus agenda ${a.namaKegiatan}?`)) deleteAgenda(a.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
