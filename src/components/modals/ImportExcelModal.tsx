import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

import { normalizeDateToYYYYMMDD } from '../../utils/helpers';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose }) => {
  const { addResident } = useApp();

  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setParsedData(data);
      } catch (err) {
        alert('Gagal membaca berkas Excel/CSV. Pastikan format valid.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExecuteImport = () => {
    if (parsedData.length === 0) return;
    setIsImporting(true);

    let count = 0;
    parsedData.forEach((row) => {
      addResident({
        nik: String(row.NIK || row.nik || '320112' + Math.floor(1000000000 + Math.random() * 9000000000)),
        noKk: String(row.NO_KK || row.noKk || '3201121005100001'),
        namaLengkap: String(row.NAMA || row.namaLengkap || row.Nama || 'Warga Tanpa Nama'),
        tempatLahir: String(row.TEMPAT_LAHIR || row.tempatLahir || 'Bogor'),
        tanggalLahir: normalizeDateToYYYYMMDD(row.TANGGAL_LAHIR || row.tanggalLahir || '1995-01-01'),
        jenisKelamin: (row.JK || row.jenisKelamin) === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
        agama: (row.AGAMA || row.agama || 'Islam') as any,
        pendidikan: (row.PENDIDIKAN || row.pendidikan || 'SMA/Sederajat') as any,
        pekerjaan: (row.PEKERJAAN || row.pekerjaan || 'Wiraswasta') as any,
        statusPerkawinan: (row.STATUS || row.statusPerkawinan || 'Kawin') as any,
        golonganDarah: (row.GOL_DARAH || row.golonganDarah || 'O') as any,
        kewarganegaraan: 'WNI',
        noHp: String(row.NO_HP || row.noHp || ''),
        email: '',
        alamatLengkap: String(row.ALAMAT || row.alamatLengkap || 'Desa Sukamaju'),
        rt: String(row.RT || row.rt || '001'),
        rw: String(row.RW || row.rw || '001'),
        dusun: String(row.DUSUN || row.dusun || 'Dusun Suka Makmur'),
        statusTinggal: 'Tetap',
        statusAktif: 'Aktif',
        isMiskin: false
      });
      count++;
    });

    setIsImporting(false);
    setSuccessCount(count);
    setTimeout(() => {
      onClose();
      setSuccessCount(null);
      setParsedData([]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Import Data Penduduk Dari Excel / CSV</h3>
              <p className="text-xs text-slate-400">Unggah berkas spreadsheet .xlsx / .csv untuk memuat masal data warga</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">Klik atau Drag Berkas Excel (.xlsx, .csv) ke sini</p>
            <p className="text-[11px] text-slate-500 mt-1">Kolom yang terbaca otomatis: NIK, NO_KK, NAMA, TEMPAT_LAHIR, TANGGAL_LAHIR, AGAMA, ALAMAT</p>
          </div>

          {fileName && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900 font-medium">
              <span>Berkas Terpilih: <strong>{fileName}</strong></span>
              <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">{parsedData.length} Baris Data</span>
            </div>
          )}

          {successCount !== null && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Berhasil mengimpor {successCount} data penduduk ke dalam database!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={parsedData.length === 0 || isImporting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Mengimpor...' : `Proses Import (${parsedData.length} Data)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
