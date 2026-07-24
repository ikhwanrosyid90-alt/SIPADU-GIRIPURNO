import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MutationType } from '../../types';
import { X, Save, UserMinus, Baby, Skull, Truck, MapPin } from 'lucide-react';

interface MutationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MutationModal: React.FC<MutationModalProps> = ({ isOpen, onClose }) => {
  const { addMutation, residents, addResident } = useApp();

  const [jenisMutasi, setJenisMutasi] = useState<MutationType>('Kelahiran');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [tanggalMutasi, setTanggalMutasi] = useState(new Date().toISOString().slice(0, 10));
  const [dusun, setDusun] = useState('Dusun Suka Makmur');
  const [rt, setRt] = useState('001');
  const [rw, setRw] = useState('001');
  const [noSuratMutasi, setNoSuratMutasi] = useState(`474.1/${Math.floor(Math.random()*800)+100}/SK/2026`);
  const [keterangan, setKeterangan] = useState('');

  // Kelahiran specific
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [beratLahir, setBeratLahir] = useState('3.2');
  const [panjangLahir, setPanjangLahir] = useState('49');

  // Kematian specific
  const [sebabKematian, setSebabKematian] = useState('Sakit Usia Lanjut');
  const [tempatKematian, setTempatKematian] = useState('Rumah Duka Desa Sukamaju');

  // Pindah / Datang
  const [alamatAsal, setAlamatAsal] = useState('');
  const [alamatTujuan, setAlamatTujuan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      alert('Nama subjek mutasi wajib diisi!');
      return;
    }

    addMutation({
      jenisMutasi,
      namaLengkap,
      nik: nik || '320112' + Math.floor(1000000000 + Math.random() * 9000000000),
      tanggalMutasi,
      rt,
      rw,
      dusun,
      noSuratMutasi,
      keterangan: keterangan || `Pencatatan mutasi ${jenisMutasi}`,
      namaAyah,
      namaIbu,
      beratLahir: parseFloat(beratLahir) || 3.0,
      panjangLahir: parseFloat(panjangLahir) || 48,
      sebabKematian,
      tempatKematian,
      alamatAsal,
      alamatTujuan
    });

    // If Birth, auto add to Resident List as Bayi!
    if (jenisMutasi === 'Kelahiran') {
      addResident({
        nik: nik || '320112' + Math.floor(1000000000 + Math.random() * 9000000000),
        noKk: '3201121005100001',
        namaLengkap,
        tempatLahir: 'Bogor',
        tanggalLahir: tanggalMutasi,
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        pendidikan: 'Tidak/Belum Sekolah',
        pekerjaan: 'Belum/Tidak Bekerja',
        statusPerkawinan: 'Belum Kawin',
        golonganDarah: 'O',
        kewarganegaraan: 'WNI',
        noHp: '',
        email: '',
        alamatLengkap: `Dusun ${dusun}, RT ${rt}/RW ${rw}`,
        rt,
        rw,
        dusun,
        statusTinggal: 'Tetap',
        statusAktif: 'Aktif',
        isMiskin: false
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pencatatan Mutasi Penduduk</h3>
              <p className="text-xs text-slate-400">Catat peristiwa Kelahiran, Kematian, Pindah, atau Datang</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Jenis Mutasi Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Jenis Peristiwa Mutasi:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setJenisMutasi('Kelahiran')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  jenisMutasi === 'Kelahiran' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Baby className="w-5 h-5 text-emerald-600" />
                <span>Kelahiran</span>
              </button>

              <button
                type="button"
                onClick={() => setJenisMutasi('Kematian')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  jenisMutasi === 'Kematian' ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Skull className="w-5 h-5 text-rose-600" />
                <span>Kematian</span>
              </button>

              <button
                type="button"
                onClick={() => setJenisMutasi('Penduduk Datang')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  jenisMutasi === 'Penduduk Datang' ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Penduduk Datang</span>
              </button>

              <button
                type="button"
                onClick={() => setJenisMutasi('Penduduk Pindah')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  jenisMutasi === 'Penduduk Pindah' ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <MapPin className="w-5 h-5 text-amber-600" />
                <span>Penduduk Pindah</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap*</label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
                placeholder={jenisMutasi === 'Kelahiran' ? 'Nama Bayi' : 'Nama Penduduk'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIK (Jika Ada)</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Peristiwa*</label>
              <input
                type="date"
                value={tanggalMutasi}
                onChange={(e) => setTanggalMutasi(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat Surat Keterangan</label>
              <input
                type="text"
                value={noSuratMutasi}
                onChange={(e) => setNoSuratMutasi(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dusun Peristiwa</label>
              <select value={dusun} onChange={(e) => setDusun(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                <option value="Dusun Suka Makmur">Dusun Suka Makmur</option>
                <option value="Dusun Suka Rame">Dusun Suka Rame</option>
                <option value="Dusun Suka Jaya">Dusun Suka Jaya</option>
              </select>
            </div>
          </div>

          {/* Conditional Detail Form */}
          {jenisMutasi === 'Kelahiran' && (
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-xs text-emerald-900">Detail Bayi Baru Lahir</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Nama Ayah Kandung</label>
                  <input type="text" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Nama Ibu Kandung</label>
                  <input type="text" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Berat Lahir (kg)</label>
                  <input type="number" step="0.1" value={beratLahir} onChange={(e) => setBeratLahir(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Panjang Lahir (cm)</label>
                  <input type="number" value={panjangLahir} onChange={(e) => setPanjangLahir(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
              </div>
            </div>
          )}

          {jenisMutasi === 'Kematian' && (
            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-3">
              <h4 className="font-bold text-xs text-rose-900">Detail Peristiwa Kematian</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Penyebab Kematian</label>
                  <input type="text" value={sebabKematian} onChange={(e) => setSebabKematian(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Tempat Kematian</label>
                  <input type="text" value={tempatKematian} onChange={(e) => setTempatKematian(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" />
                </div>
              </div>
            </div>
          )}

          {(jenisMutasi === 'Penduduk Datang' || jenisMutasi === 'Penduduk Pindah') && (
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
              <h4 className="font-bold text-xs text-blue-900">Detail Kepindahan / Kedatangan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Alamat Asal</label>
                  <input type="text" value={alamatAsal} onChange={(e) => setAlamatAsal(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" placeholder="Kab/Kota Asal" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Alamat Tujuan</label>
                  <input type="text" value={alamatTujuan} onChange={(e) => setAlamatTujuan(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs" placeholder="Alamat Tujuan Pindah" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Simpan Record Mutasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
