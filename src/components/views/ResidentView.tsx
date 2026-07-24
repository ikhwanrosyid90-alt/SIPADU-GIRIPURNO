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
  RotateCcw,
  RefreshCw,
  CloudUpload,
  CloudDownload,
  Database,
  Radio,
  CheckSquare,
  Square,
  Users,
  Check,
  X
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
  const { 
    residents, 
    deleteResident, 
    bulkDeleteResidents,
    bulkUpdateStatusResidents,
    dusunList, 
    syncModuleToGoogleSheets, 
    villageConfig,
    sendToAppsScript,
    fetchFromAppsScript,
    lastSyncedTime,
    isAutoSyncActive,
    setIsAutoSyncActive
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // Bulk Selection State
  const [selectedResidentIds, setSelectedResidentIds] = useState<string[]>([]);
  const [selectedNewStatus, setSelectedNewStatus] = useState<ActiveStatus>('Aktif');

  const handleSaveAllToGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Menyimpan seluruh data ke Google Sheet...');
    const result = await sendToAppsScript('Data Penduduk', residents);
    setIsSyncing(false);
    if (result.success) {
      alert('✅ Berhasil! Seluruh data penduduk telah tersimpan rapi di Google Sheets.');
    } else {
      alert(`⚠️ ${result.message}`);
    }
  };

  const handleFetchFromGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Mengambil data terbaru dari Google Sheet...');
    const result = await fetchFromAppsScript('Data Penduduk');
    setIsSyncing(false);
    if (result.success) {
      alert(`✅ Berhasil! ${result.message}`);
    } else {
      alert(`⚠️ ${result.message}`);
    }
  };

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

  // Bulk Selection Helpers
  const isAllSelected = filteredResidents.length > 0 && filteredResidents.every(r => selectedResidentIds.includes(r.id));
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedResidentIds([]);
    } else {
      setSelectedResidentIds(filteredResidents.map(r => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedResidentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedResidentsList = residents.filter(r => selectedResidentIds.includes(r.id));

  const handleBulkDelete = () => {
    if (selectedResidentIds.length === 0) return;
    const names = selectedResidentsList.map(r => `${r.namaLengkap} (${r.nik})`).join(', ');
    if (confirm(`Apakah Anda yakin ingin MENGHAPUS ${selectedResidentIds.length} data warga yang dipilih berikut?\n\nDaftar Terpilih:\n${names}\n\nTindakan ini tidak dapat dibatalkan.`)) {
      bulkDeleteResidents(selectedResidentIds);
      setSelectedResidentIds([]);
    }
  };

  const handleBulkStatusChange = () => {
    if (selectedResidentIds.length === 0) return;
    if (confirm(`Ubah status aktif ${selectedResidentIds.length} warga yang dipilih menjadi '${selectedNewStatus}'?`)) {
      bulkUpdateStatusResidents(selectedResidentIds, selectedNewStatus);
      setSelectedResidentIds([]);
    }
  };

  const handleBulkSaveToSheet = async () => {
    if (selectedResidentIds.length === 0) return;
    setIsSyncing(true);
    setSyncStatusMsg(`Menyimpan ${selectedResidentIds.length} warga ke Google Sheet...`);
    const result = await sendToAppsScript('Data Penduduk', selectedResidentsList);
    setIsSyncing(false);
    if (result.success) {
      alert(`✅ Berhasil! ${selectedResidentIds.length} data warga terpilih telah tersimpan di Google Sheets.`);
    } else {
      alert(`⚠️ ${result.message}`);
    }
  };

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
    const cleanDesa = (villageConfig.namaDesa || 'DESA').toUpperCase().replace(/\s+/g, '_');
    exportToExcel(exportData, `DATA_PENDUDUK_DESA_${cleanDesa}`);
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
    exportTableToPDF(`LAPORAN MASTER DATA PENDUDUK DESA ${(villageConfig.namaDesa || '').toUpperCase()}`, headers, rows, 'REKAP_PENDUDUK_DESA', villageConfig);
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
          {/* Real-time Status Badge */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs">
            <Radio className={`w-3.5 h-3.5 ${isAutoSyncActive ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span>
              Real-Time: <strong className={isAutoSyncActive ? 'text-emerald-400' : 'text-slate-400'}>{isAutoSyncActive ? 'ON' : 'OFF'}</strong>
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">({lastSyncedTime})</span>
            <button
              onClick={() => setIsAutoSyncActive(!isAutoSyncActive)}
              className="ml-1 text-[10px] underline text-blue-300 hover:text-blue-200"
            >
              {isAutoSyncActive ? 'Matikan' : 'Aktifkan'}
            </button>
          </div>

          <button
            onClick={handleSaveAllToGoogleSheet}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Simpan seluruh data penduduk ke Google Sheet jika ada penambahan manual di sheet"
          >
            <CloudUpload className="w-4 h-4 text-white" />
            Simpan Semua ke Sheet
          </button>

          <button
            onClick={handleFetchFromGoogleSheet}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Tarik & sinkronkan data penduduk terbaru dari Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isSyncing ? 'animate-spin' : ''}`} />
            Tarik Data Baru
          </button>

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
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-white" />
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
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>

          <select value={filterMiskin} onChange={(e) => setFilterMiskin(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]">
            <option value="ALL">Semua Ekonomi</option>
            <option value="YES">Rentan Miskin / DTKS</option>
            <option value="NO">Mampu / Non-DTKS</option>
          </select>
        </div>
      </div>

      {/* Bulk Selection Control Panel ("Pilihan nya siapa aja") */}
      {selectedResidentIds.length > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-blue-500/40 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-400" />
              <span className="font-extrabold text-sm text-white">
                {selectedResidentIds.length} Warga Terpilih
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (dari total {filteredResidents.length} data tampil)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk Status Update */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value as ActiveStatus)}
                  className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg border border-slate-700 focus:outline-hidden"
                >
                  <option value="Aktif">Status: Aktif</option>
                  <option value="Meninggal">Status: Meninggal</option>
                  <option value="Pindah">Status: Pindah</option>
                  <option value="Tidak Aktif">Status: Tidak Aktif</option>
                </select>
                <button
                  onClick={handleBulkStatusChange}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Ubah Status Massal
                </button>
              </div>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Sekaligus
              </button>

              {/* Bulk Save to Sheets */}
              <button
                onClick={handleBulkSaveToSheet}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30 disabled:opacity-50"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                Simpan ke Sheet
              </button>

              {/* Clear Selection */}
              <button
                onClick={() => setSelectedResidentIds([])}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Batal Pilih
              </button>
            </div>
          </div>

          {/* List Preview: Pilihan Nya Siapa Aja */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Pilihan nya siapa aja ({selectedResidentsList.length} warga):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800">
              {selectedResidentsList.map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1.5 bg-blue-900/60 text-blue-100 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-blue-700/50 shadow-2xs"
                >
                  <strong className="text-white">{r.namaLengkap}</strong>
                  <span className="text-[9px] text-blue-300 font-mono">({r.nik})</span>
                  <button
                    onClick={() => toggleSelectOne(r.id)}
                    className="hover:text-rose-400 ml-0.5 font-bold text-slate-400 hover:bg-slate-800 rounded px-1"
                    title="Batal pilih warga ini"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
                    title="Pilih Semua Warga di Halaman Ini"
                  />
                </th>
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
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Tidak ada data penduduk ditemukan dengan kriteria filter tersebut.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((r, idx) => {
                  const age = calculateAge(r.tanggalLahir);
                  const isSelected = selectedResidentIds.includes(r.id);
                  return (
                    <tr 
                      key={r.id} 
                      className={`transition-colors ${isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-50/80'}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(r.id)}
                          className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
                        />
                      </td>
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
                          r.statusAktif === 'Aktif' ? 'bg-emerald-100 text-emerald-800' :
                          r.statusAktif === 'Meninggal' ? 'bg-rose-100 text-rose-800' :
                          r.statusAktif === 'Pindah' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
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
