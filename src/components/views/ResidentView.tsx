import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resident, Education, Occupation, Religion, ResidenceStatus, ActiveStatus } from '../../types';
import { calculateAge, formatRupiah, exportToExcel, exportTableToPDF } from '../../utils/helpers';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Edit3, 
  Trash2, 
  Eye, 
  Upload, 
  CheckCircle2, 
  UserCheck,
  RotateCcw
} from 'lucide-react';

interface ResidentViewProps {
  onOpenAddModal: () => void;
  onEditResident: (resident: Resident) => void;
  onOpenPrintModal: (resident?: Resident) => void;
  onOpenImportModal: () => void;
  onOpenGoogleModal: () => void;
}

export const ResidentView: React.FC<ResidentViewProps> = ({
  onOpenAddModal,
  onEditResident,
  onOpenPrintModal,
  onOpenImportModal,
  onOpenGoogleModal
}) => {
  const { residents, deleteResident, dusunList, syncModuleToGoogleSheets } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDusun, setFilterDusun] = useState('ALL');
  const [filterRw, setFilterRw] = useState('ALL');
  const [filterRt, setFilterRt] = useState('ALL');
  const [filterAgama, setFilterAgama] = useState('ALL');
  const [filterPendidikan, setFilterPendidikan] = useState('ALL');
  const [filterPekerjaan, setFilterPekerjaan] = useState('ALL');
  const [filterStatusAktif, setFilterStatusAktif] = useState('ALL');
  const [filterMiskin, setFilterMiskin] = useState('ALL');

  const [selectedResidentDetail, setSelectedResidentDetail] = useState<Resident | null>(null);

  // Filtering Logic
  const filteredResidents = residents.filter((r) => {
    const matchesSearch = 
      r.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nik.includes(searchTerm) ||
      r.noKk.includes(searchTerm) ||
      r.alamatLengkap.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDusun = filterDusun === 'ALL' || r.dusun === filterDusun;
    const matchesRw = filterRw === 'ALL' || r.rw === filterRw;
    const matchesRt = filterRt === 'ALL' || r.rt === filterRt;
    const matchesAgama = filterAgama === 'ALL' || r.agama === filterAgama;
    const matchesPendidikan = filterPendidikan === 'ALL' || r.pendidikan === filterPendidikan;
    const matchesPekerjaan = filterPekerjaan === 'ALL' || r.pekerjaan === filterPekerjaan;
    const matchesStatus = filterStatusAktif === 'ALL' || r.statusAktif === filterStatusAktif;
    const matchesMiskin = filterMiskin === 'ALL' || (filterMiskin === 'YES' ? r.isMiskin : !r.isMiskin);

    return matchesSearch && matchesDusun && matchesRw && matchesRt && matchesAgama && matchesPendidikan && matchesPekerjaan && matchesStatus && matchesMiskin;
  });

  const handleExportExcel = () => {
    const exportData = filteredResidents.map((r, i) => ({
      No: i + 1,
      NIK: r.nik,
      NO_KK: r.noKk,
      Nama_Lengkap: r.namaLengkap,
      Tempat_Lahir: r.tempatLahir,
      Tanggal_Lahir: r.tanggalLahir,
      Umur: calculateAge(r.tanggalLahir),
      Jenis_Kelamin: r.jenisKelamin,
      Agama: r.agama,
      Pendidikan: r.pendidikan,
      Pekerjaan: r.pekerjaan,
      Status_Kawin: r.statusPerkawinan,
      Gol_Darah: r.golonganDarah,
      Dusun: r.dusun,
      RT: r.rt,
      RW: r.rw,
      Alamat: r.alamatLengkap,
      Status_Aktif: r.statusAktif,
      Ekonomi_Miskin: r.isMiskin ? 'YA' : 'TIDAK'
    }));
    exportToExcel(exportData, 'DATA_PENDUDUK_DESA_SUKAMUJU');
  };

  const handleExportPDF = () => {
    const headers = ['No', 'NIK', 'Nama Lengkap', 'JK', 'Umur', 'Agama', 'Pekerjaan', 'Dusun', 'RT/RW', 'Status'];
    const rows = filteredResidents.map((r, i) => [
      i + 1,
      r.nik,
      r.namaLengkap,
      r.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
      `${calculateAge(r.tanggalLahir)} th`,
      r.agama,
      r.pekerjaan,
      r.dusun.replace('Dusun ', ''),
      `${r.rt}/${r.rw}`,
      r.statusAktif
    ]);
    exportTableToPDF('LAPORAN MASTER DATA PENDUDUK DESA', headers, rows, 'REKAP_PENDUDUK_DESA');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Master Data Penduduk Desa
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
              {filteredResidents.length} Jiwa
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Lengkap dengan fitur NIK, KK, Biodata, Multi-Filter, Import/Export Excel & PDF</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-300 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            Import Excel
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            Export PDF
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Penduduk Baru
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Control Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Quick Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan NIK, No. KK, Nama, atau Alamat..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Filter Dusun */}
          <div>
            <select
              value={filterDusun}
              onChange={(e) => setFilterDusun(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Semua Dusun</option>
              {dusunList.map(d => (
                <option key={d.id} value={d.namaDusun}>{d.namaDusun}</option>
              ))}
            </select>
          </div>

          {/* Filter Pekerjaan */}
          <div>
            <select
              value={filterPekerjaan}
              onChange={(e) => setFilterPekerjaan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Semua Pekerjaan</option>
              <option value="Petani/Pekebun">Petani/Pekebun</option>
              <option value="PNS/ASN">PNS/ASN</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Karyawan Swasta">Karyawan Swasta</option>
              <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
              <option value="Mengurus Rumah Tangga">Mengurus Rumah Tangga</option>
              <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          <select value={filterRw} onChange={(e) => setFilterRw(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua RW</option>
            <option value="001">RW 001</option>
            <option value="002">RW 002</option>
            <option value="003">RW 003</option>
            <option value="004">RW 004</option>
          </select>

          <select value={filterRt} onChange={(e) => setFilterRt(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua RT</option>
            <option value="001">RT 001</option>
            <option value="002">RT 002</option>
            <option value="003">RT 003</option>
            <option value="004">RT 004</option>
          </select>

          <select value={filterPendidikan} onChange={(e) => setFilterPendidikan(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua Pendidikan</option>
            <option value="SD/Sederajat">SD/Sederajat</option>
            <option value="SMP/Sederajat">SMP/Sederajat</option>
            <option value="SMA/Sederajat">SMA/Sederajat</option>
            <option value="S1/D4">S1/D4</option>
          </select>

          <select value={filterStatusAktif} onChange={(e) => setFilterStatusAktif(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua Status Aktif</option>
            <option value="Aktif">Aktif</option>
            <option value="Meninggal">Meninggal</option>
            <option value="Pindah">Pindah</option>
          </select>

          <select value={filterMiskin} onChange={(e) => setFilterMiskin(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua Ekonomi</option>
            <option value="YES">Rentan Miskin / DTKS</option>
            <option value="NO">Mampu / Non-DTKS</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3">NIK / No. KK</th>
                <th className="p-3">Nama Lengkap</th>
                <th className="p-3">JK / Umur</th>
                <th className="p-3">Agama / Pendidikan</th>
                <th className="p-3">Pekerjaan</th>
                <th className="p-3">Dusun & RT/RW</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ada data penduduk ditemukan dengan kriteria filter tersebut.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((r, idx) => {
                  const age = calculateAge(r.tanggalLahir);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-mono font-bold text-blue-900">{r.nik}</div>
                        <div className="font-mono text-[10px] text-slate-400">KK: {r.noKk}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm">{r.namaLengkap}</div>
                        {(r.namaAyah || r.namaIbu) && (
                          <div className="text-[10px] text-blue-700 font-medium">
                            {r.namaAyah && <span>Ayah: {r.namaAyah}</span>}
                            {r.namaAyah && r.namaIbu && <span className="mx-1">•</span>}
                            {r.namaIbu && <span>Ibu: {r.namaIbu}</span>}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500">{r.statusPerkawinan} • Blood: {r.golonganDarah}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{r.jenisKelamin}</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{age} Tahun</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{r.agama}</div>
                        <div className="text-[10px] text-slate-500">{r.pendidikan}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{r.pekerjaan}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{r.dusun}</div>
                        <div className="text-[10px] text-slate-500">RT {r.rt} / RW {r.rw}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          r.statusAktif === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {r.statusAktif}
                        </span>
                        {r.isMiskin && (
                          <div className="mt-1">
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">DTKS</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenPrintModal(r)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Cetak Biodata Penduduk Resmi"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditResident(r)}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Data Penduduk"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data NIK ${r.nik} (${r.namaLengkap})?`)) {
                                deleteResident(r.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
