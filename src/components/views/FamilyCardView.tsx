import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FamilyCard } from '../../types';
import { formatDateIndo } from '../../utils/helpers';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Trash2, 
  Users, 
  ChevronDown, 
  ChevronUp,
  UserCheck
} from 'lucide-react';

interface FamilyCardViewProps {
  onOpenAddModal: () => void;
  onEditKk: (kk: FamilyCard) => void;
  onOpenPrintModal: (kk?: FamilyCard) => void;
}

export const FamilyCardView: React.FC<FamilyCardViewProps> = ({
  onOpenAddModal,
  onEditKk,
  onOpenPrintModal
}) => {
  const { familyCards, deleteFamilyCard } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKkId, setExpandedKkId] = useState<string | null>(familyCards[0]?.id || null);

  const filteredKk = familyCards.filter((f) => 
    f.noKk.includes(searchTerm) ||
    f.namaKepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.alamatLengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Modul Data Kartu Keluarga (KK)
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
              {filteredKk.length} Kartu Keluarga
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Pengelolaan data KK, anggota keluarga terdaftar, serta cetak Lembar KK Sementara Resmi</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Terbitkan KK Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari No. KK, Nama Kepala Keluarga, atau Alamat..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* List KK Cards */}
      <div className="space-y-4">
        {filteredKk.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Tidak ada Kartu Keluarga yang cocok.
          </div>
        ) : (
          filteredKk.map((kk) => {
            const isExpanded = expandedKkId === kk.id;
            return (
              <div key={kk.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedKkId(isExpanded ? null : kk.id)}
                      className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-900">No. KK: {kk.noKk}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          {kk.members?.length || 0} Anggota
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">Kepala KK: {kk.namaKepalaKeluarga}</p>
                      <p className="text-[11px] text-slate-500">{kk.alamatLengkap} (RT {kk.rt} / RW {kk.rw}, {kk.dusun})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPrintModal(kk)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak KK Sementara
                    </button>
                    <button
                      onClick={() => onEditKk(kk)}
                      className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg"
                      title="Edit KK"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus data Kartu Keluarga No. ${kk.noKk}?`)) {
                          deleteFamilyCard(kk.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Hapus KK"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Member Table when expanded */}
                {isExpanded && (
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      Daftar Anggota Keluarga Terdaftar
                    </h4>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-xs text-left text-slate-700">
                        <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="p-2.5">No</th>
                            <th className="p-2.5">Nama Lengkap</th>
                            <th className="p-2.5">NIK</th>
                            <th className="p-2.5">Jenis Kelamin</th>
                            <th className="p-2.5">Tanggal Lahir</th>
                            <th className="p-2.5">Hubungan Keluarga</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {kk.members?.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-slate-400">Belum ada anggota.</td>
                            </tr>
                          ) : (
                            kk.members?.map((m, idx) => (
                              <tr key={m.nik} className="hover:bg-slate-50">
                                <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                                <td className="p-2.5 font-bold text-slate-900">{m.namaLengkap}</td>
                                <td className="p-2.5 font-mono text-blue-900">{m.nik}</td>
                                <td className="p-2.5">{m.jenisKelamin}</td>
                                <td className="p-2.5">{formatDateIndo(m.tanggalLahir)}</td>
                                <td className="p-2.5 font-bold text-emerald-800">{m.hubunganKeluarga}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
