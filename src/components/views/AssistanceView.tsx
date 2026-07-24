import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistanceType, AssistanceRecipient } from '../../types';
import { formatRupiah, formatDateIndo, exportToExcel, exportTableToPDF } from '../../utils/helpers';
import { 
  Gift, 
  Plus, 
  Search, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2 
} from 'lucide-react';

interface AssistanceViewProps {
  onOpenAddModal: () => void;
  onEditAssistance: (item: AssistanceRecipient) => void;
}

export const AssistanceView: React.FC<AssistanceViewProps> = ({ onOpenAddModal, onEditAssistance }) => {
  const { assistance, deleteAssistance, dusunList } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDusun, setFilterDusun] = useState('ALL');

  const filteredAssistance = assistance.filter(a => {
    const matchesSearch = 
      a.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nik.includes(searchTerm) ||
      a.programBantuan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || a.jenisBantuan === filterType;
    const matchesDusun = filterDusun === 'ALL' || a.dusun === filterDusun;
    return matchesSearch && matchesType && matchesDusun;
  });

  const totalNominal = filteredAssistance.reduce((acc, curr) => acc + curr.nominalBantuan, 0);

  const handleExportExcel = () => {
    const data = filteredAssistance.map((a, i) => ({
      No: i + 1,
      Nama_Penerima: a.namaPenerima,
      NIK: a.nik,
      No_KK: a.noKk,
      Dusun: a.dusun,
      RT_RW: `${a.rt}/${a.rw}`,
      Jenis_Bantuan: a.jenisBantuan,
      Program: a.programBantuan,
      Instansi: a.instansiPemberi,
      Nominal: a.nominalBantuan,
      Bentuk: a.bentukBantuan,
      Penyaluran: a.statusPenyaluran,
      Tanggal: a.tanggalPenerimaan
    }));
    exportToExcel(data, 'PENERIMA_BANTUAN_SOSIAL_DESA');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Penerimaan Bantuan Sosial Desa
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
              {filteredAssistance.length} Penerima
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Rekapitulasi PKH, BPNT, BLT Dana Desa, Bantuan Pangan, RTLH, PIP, KIS, dan UMKM</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Penerima Bantuan
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Nilai Penyaluran Bantuan</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{formatRupiah(totalNominal)}</div>
          <p className="text-[10px] text-slate-400 mt-1">Akumulasi nominal tersalurkan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Status Penyaluran Sukses</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {filteredAssistance.filter(a => a.statusPenyaluran === 'Tersalurkan').length} Warga
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Telah diserahterimakan 100%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Proses / Belum Diambil</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {filteredAssistance.filter(a => a.statusPenyaluran !== 'Tersalurkan').length} Warga
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Perlu tindakan tindak lanjut</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari penerima, NIK, atau program..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-700"
            >
              <option value="ALL">Semua Jenis Bantuan</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT Dana Desa">BLT Dana Desa</option>
              <option value="Bantuan Pangan">Bantuan Pangan (Beras)</option>
              <option value="RTLH">RTLH (Bedah Rumah)</option>
              <option value="PIP">PIP / KIP</option>
              <option value="Bantuan UMKM">Bantuan UMKM</option>
            </select>
          </div>

          <div>
            <select
              value={filterDusun}
              onChange={(e) => setFilterDusun(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-700"
            >
              <option value="ALL">Semua Dusun</option>
              {dusunList.map(d => (
                <option key={d.id} value={d.namaDusun}>{d.namaDusun}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3">Penerima Bantuan</th>
                <th className="p-3">Program & Instansi</th>
                <th className="p-3">Nominal / Bentuk</th>
                <th className="p-3">Dusun & RT/RW</th>
                <th className="p-3">Periode & Tgl</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssistance.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Tidak ada penerima bantuan ditemukan.</td>
                </tr>
              ) : (
                filteredAssistance.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{a.namaPenerima}</div>
                      <div className="text-[10px] font-mono text-slate-400">NIK: {a.nik}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {a.jenisBantuan}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{a.programBantuan}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {a.nominalBantuan > 0 ? formatRupiah(a.nominalBantuan) : a.rincianBarang || 'Sembako'}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{a.dusun}</div>
                      <div className="text-[10px] text-slate-500">RT {a.rt} / RW {a.rw}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">{a.periodeBantuan}</div>
                      <div className="text-[10px] text-slate-400">{formatDateIndo(a.tanggalPenerimaan)}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.statusPenyaluran === 'Tersalurkan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.statusPenyaluran}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditAssistance(a)}
                          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus penerima bantuan ${a.namaPenerima}?`)) {
                              deleteAssistance(a.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
