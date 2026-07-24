import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportTableToPDF, exportToExcel, calculateAge, formatRupiah } from '../../utils/helpers';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Gift, 
  Calendar,
  Building2
} from 'lucide-react';

interface ReportsViewProps {
  onOpenGoogleModal: () => void;
  onOpenPrintModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenGoogleModal, onOpenPrintModal }) => {
  const { residents, familyCards, mutations, assistance, organizations, agendas, villageConfig } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('REKAP_DEMOGRAFI');

  const handlePrintFullReport = () => {
    const namaDesaUpper = (villageConfig.namaDesa || 'SUKAMUJU').toUpperCase();
    if (selectedReportType === 'REKAP_DEMOGRAFI') {
      const headers = ['Indikator Demografi', 'Jumlah / Persentase', 'Keterangan Tambahan'];
      const rows = [
        ['Total Penduduk Desa', `${residents.length} Jiwa`, 'Terdaftar di Database'],
        ['Jumlah Kepala Keluarga', `${familyCards.length} KK`, 'Memiliki KK Terbit'],
        ['Jumlah Laki-Laki', `${residents.filter(r => r.jenisKelamin === 'Laki-laki').length} Jiwa`, 'Rasio Gender Laki-Laki'],
        ['Jumlah Perempuan', `${residents.filter(r => r.jenisKelamin === 'Perempuan').length} Jiwa`, 'Rasio Gender Perempuan'],
        ['Penduduk Rentan / Miskin (DTKS)', `${residents.filter(r => r.isMiskin).length} Jiwa`, 'Penerima Potensi Bansos'],
        ['Total Penerima Bantuan Sosial', `${assistance.length} Penerima`, 'PKH, BPNT, BLT Dana Desa']
      ];
      exportTableToPDF(`LAPORAN REKAPITULASI STATISTIK DEMOGRAFI DESA ${namaDesaUpper}`, headers, rows, 'LAPORAN_DEMOGRAFI_DESA', villageConfig);
    } else if (selectedReportType === 'PENERIMA_BANSOS') {
      const headers = ['No', 'Nama Penerima', 'NIK', 'Jenis Bantuan', 'Nominal', 'Penyaluran'];
      const rows = assistance.map((a, i) => [
        i + 1,
        a.namaPenerima,
        a.nik,
        a.jenisBantuan,
        formatRupiah(a.nominalBantuan),
        a.statusPenyaluran
      ]);
      exportTableToPDF(`LAPORAN PENYALURAN BANTUAN SOSIAL DESA ${namaDesaUpper}`, headers, rows, 'LAPORAN_BANSOS_DESA', villageConfig);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Pusat Laporan & Rekapitulasi Statistik Resmi Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Ekspor laporan cetak resmi PDF, spreadsheet Excel, dan sinkronisasi otomatis Google Sheets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGoogleModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Sync Google Sheets
          </button>
          <button
            onClick={handlePrintFullReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh Laporan PDF
          </button>
        </div>
      </div>

      {/* Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedReportType('REKAP_DEMOGRAFI')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedReportType === 'REKAP_DEMOGRAFI' ? 'bg-blue-900 text-white border-blue-900 shadow-lg' : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <Users className="w-6 h-6 mb-2 text-blue-400" />
          <h3 className="font-extrabold text-base">Laporan Rekap Demografi</h3>
          <p className="text-xs mt-1 text-slate-300">Demografi umur, jenis kelamin, pendidikan, pekerjaan, dan agama</p>
        </div>

        <div
          onClick={() => setSelectedReportType('PENERIMA_BANSOS')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedReportType === 'PENERIMA_BANSOS' ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg' : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <Gift className="w-6 h-6 mb-2 text-emerald-400" />
          <h3 className="font-extrabold text-base">Laporan Penyaluran Bansos</h3>
          <p className="text-xs mt-1 text-slate-300">Rekapitulasi PKH, BLT Dana Desa, BPNT, RTLH, Bantuan Pangan</p>
        </div>

        <div
          onClick={() => setSelectedReportType('MUTASI_AGENDA')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedReportType === 'MUTASI_AGENDA' ? 'bg-amber-900 text-white border-amber-900 shadow-lg' : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <Calendar className="w-6 h-6 mb-2 text-amber-400" />
          <h3 className="font-extrabold text-base">Laporan Mutasi & Agenda</h3>
          <p className="text-xs mt-1 text-slate-300">Rekapitulasi peristiwa kelahiran, kematian, kepindahan, dan notulen rapat</p>
        </div>
      </div>

      {/* Preview Laporan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-base text-slate-900">Preview Struktur Laporan Cetak Dukcapil</h3>
          <button
            onClick={handlePrintFullReport}
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Sekarang
          </button>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
          <div className="text-center space-y-1 pb-3 border-b border-slate-300">
            <h2 className="font-extrabold text-sm uppercase text-slate-900">PEMERINTAH KABUPATEN BOGOR • KECAMATAN CIBINONG</h2>
            <h1 className="font-black text-base text-blue-900">PEMERINTAH DESA SUKAMUJU</h1>
            <p className="text-[10px] text-slate-500">Alamat: Jl. Raya Sukamaju No. 01, Kecamatan Cibinong, Kabupaten Bogor 16911</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase">
              {selectedReportType === 'REKAP_DEMOGRAFI' && 'Ringkasan Laporan Rekapitulasi Demografi Penduduk'}
              {selectedReportType === 'PENERIMA_BANSOS' && 'Ringkasan Laporan Penyaluran Bantuan Sosial'}
              {selectedReportType === 'MUTASI_AGENDA' && 'Ringkasan Laporan Mutasi & Agenda Kegiatan Desa'}
            </h4>

            <table className="w-full bg-white border border-slate-200 text-left">
              <thead className="bg-slate-200 font-bold text-slate-800">
                <tr>
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Indikator</th>
                  <th className="p-2 border">Nilai / Jumlah</th>
                  <th className="p-2 border">Status Sinkronisasi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">1</td>
                  <td className="p-2 border font-bold">Total Penduduk Terdaftar</td>
                  <td className="p-2 border font-mono font-bold text-blue-900">{residents.length} Jiwa</td>
                  <td className="p-2 border text-emerald-700 font-semibold">Tersinkronisasi Dukcapil</td>
                </tr>
                <tr>
                  <td className="p-2 border">2</td>
                  <td className="p-2 border font-bold">Total Kepala Keluarga (KK)</td>
                  <td className="p-2 border font-mono font-bold text-blue-900">{familyCards.length} KK</td>
                  <td className="p-2 border text-emerald-700 font-semibold">Tersinkronisasi Dukcapil</td>
                </tr>
                <tr>
                  <td className="p-2 border">3</td>
                  <td className="p-2 border font-bold">Total Record Bantuan Sosial</td>
                  <td className="p-2 border font-mono font-bold text-blue-900">{assistance.length} Penerima</td>
                  <td className="p-2 border text-emerald-700 font-semibold">Valid DTKS Kemensos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
