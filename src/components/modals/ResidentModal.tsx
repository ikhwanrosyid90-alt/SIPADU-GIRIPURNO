import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Resident, Gender, Religion, Education, Occupation, MaritalStatus, BloodType, ResidenceStatus, ActiveStatus } from '../../types';
import { X, Save, UserCheck, AlertCircle, Upload, FileCheck } from 'lucide-react';
import { normalizeDateToYYYYMMDD } from '../../utils/helpers';

interface ResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  residentToEdit?: Resident | null;
}

export const ResidentModal: React.FC<ResidentModalProps> = ({
  isOpen,
  onClose,
  residentToEdit
}) => {
  const { addResident, updateResident, dusunList, rwList, rtList } = useApp();

  const [formData, setFormData] = useState({
    nik: '',
    noKk: '',
    namaLengkap: '',
    namaAyah: '',
    namaIbu: '',
    tempatLahir: '',
    tanggalLahir: '1995-01-01',
    jenisKelamin: 'Laki-laki' as Gender,
    agama: 'Islam' as Religion,
    pendidikan: 'SMA/Sederajat' as Education,
    pekerjaan: 'Wiraswasta' as Occupation,
    statusPerkawinan: 'Kawin' as MaritalStatus,
    golonganDarah: 'O' as BloodType,
    kewarganegaraan: 'WNI' as 'WNI' | 'WNA',
    shdk: 'Kepala Keluarga',
    aktaLahir: 'Ada',
    noAktaLahir: '',
    aktaKawin: 'Tidak',
    noAktaKawin: '',
    aktaCerai: 'Tidak',
    noAktaCerai: '',
    noHp: '',
    email: '',
    fotoKtpUrl: '',
    fotoKkUrl: '',
    alamatLengkap: '',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap' as ResidenceStatus,
    statusAktif: 'Aktif' as ActiveStatus,
    isMiskin: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (residentToEdit) {
      setFormData({
        nik: residentToEdit.nik || '',
        noKk: residentToEdit.noKk || '',
        namaLengkap: residentToEdit.namaLengkap || '',
        namaAyah: residentToEdit.namaAyah || '',
        namaIbu: residentToEdit.namaIbu || '',
        tempatLahir: residentToEdit.tempatLahir || '',
        tanggalLahir: normalizeDateToYYYYMMDD(residentToEdit.tanggalLahir || '1995-01-01'),
        jenisKelamin: residentToEdit.jenisKelamin || 'Laki-laki',
        agama: residentToEdit.agama || 'Islam',
        pendidikan: residentToEdit.pendidikan || 'SMA/Sederajat',
        pekerjaan: residentToEdit.pekerjaan || 'Wiraswasta',
        statusPerkawinan: residentToEdit.statusPerkawinan || 'Kawin',
        golonganDarah: residentToEdit.golonganDarah || 'O',
        kewarganegaraan: residentToEdit.kewarganegaraan || 'WNI',
        shdk: residentToEdit.shdk || 'Kepala Keluarga',
        aktaLahir: residentToEdit.aktaLahir || 'Ada',
        noAktaLahir: residentToEdit.noAktaLahir || '',
        aktaKawin: residentToEdit.aktaKawin || 'Tidak',
        noAktaKawin: residentToEdit.noAktaKawin || '',
        aktaCerai: residentToEdit.aktaCerai || 'Tidak',
        noAktaCerai: residentToEdit.noAktaCerai || '',
        noHp: residentToEdit.noHp || '',
        email: residentToEdit.email || '',
        fotoKtpUrl: residentToEdit.fotoKtpUrl || '',
        fotoKkUrl: residentToEdit.fotoKkUrl || '',
        alamatLengkap: residentToEdit.alamatLengkap || '',
        rt: residentToEdit.rt || '001',
        rw: residentToEdit.rw || '001',
        dusun: residentToEdit.dusun || 'Dusun Suka Makmur',
        statusTinggal: residentToEdit.statusTinggal || 'Tetap',
        statusAktif: residentToEdit.statusAktif || 'Aktif',
        isMiskin: residentToEdit.isMiskin || false
      });
    } else {
      setFormData({
        nik: '320112' + Math.floor(1000000000 + Math.random() * 9000000000),
        noKk: '3201121005' + Math.floor(100000 + Math.random() * 900000),
        namaLengkap: '',
        namaAyah: '',
        namaIbu: '',
        tempatLahir: 'Bogor',
        tanggalLahir: '1995-01-01',
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        pendidikan: 'SMA/Sederajat',
        pekerjaan: 'Wiraswasta',
        statusPerkawinan: 'Kawin',
        golonganDarah: 'O',
        kewarganegaraan: 'WNI',
        shdk: 'Kepala Keluarga',
        aktaLahir: 'Ada',
        noAktaLahir: '',
        aktaKawin: 'Tidak',
        noAktaKawin: '',
        aktaCerai: 'Tidak',
        noAktaCerai: '',
        noHp: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
        email: '',
        fotoKtpUrl: '',
        fotoKkUrl: '',
        alamatLengkap: 'Jl. Pemuda Desa Sukamaju',
        rt: '001',
        rw: '001',
        dusun: 'Dusun Suka Makmur',
        statusTinggal: 'Tetap',
        statusAktif: 'Aktif',
        isMiskin: false
      });
    }
  }, [residentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErr: Record<string, string> = {};
    if (!formData.nik || formData.nik.length !== 16) newErr.nik = 'NIK harus terdiri dari 16 digit angka!';
    if (!formData.noKk || formData.noKk.length !== 16) newErr.noKk = 'Nomor KK harus 16 digit!';
    if (!formData.namaLengkap.trim()) newErr.namaLengkap = 'Nama lengkap wajib diisi!';
    if (!formData.tempatLahir.trim()) newErr.tempatLahir = 'Tempat lahir wajib diisi!';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (residentToEdit) {
      updateResident(residentToEdit.id, formData);
    } else {
      addResident(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {residentToEdit ? 'Edit Data Biodata Penduduk' : 'Tambah Penduduk Baru'}
              </h3>
              <p className="text-xs text-slate-400">Lengkapi formulir standar administrasi kependudukan desa</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Identitas Utam */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">I. Identitas Utama (NIK & KK)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit)*</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                {errors.nik && <p className="text-[11px] text-rose-600 mt-1">{errors.nik}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor KK (16 Digit)*</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.noKk}
                  onChange={(e) => setFormData({ ...formData, noKk: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                {errors.noKk && <p className="text-[11px] text-rose-600 mt-1">{errors.noKk}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap (Sesuai KTP)*</label>
                <input
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Ahmad Rizky Supriadi"
                />
                {errors.namaLengkap && <p className="text-[11px] text-rose-600 mt-1">{errors.namaLengkap}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ayah Kandung (Sesuai Dukcapil)</label>
                <input
                  type="text"
                  value={formData.namaAyah}
                  onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Kromo Pawiro"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu Kandung (Sesuai Dukcapil)</label>
                <input
                  type="text"
                  value={formData.namaIbu}
                  onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Siti Aminah"
                />
              </div>
            </div>
          </div>

          {/* Demografi & Bio */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">II. Bio & Demografi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as Gender })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agama</label>
                <select
                  value={formData.agama}
                  onChange={(e) => setFormData({ ...formData, agama: e.target.value as Religion })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                <select
                  value={formData.pendidikan}
                  onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value as Education })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                  <option value="Belum Tamat SD">Belum Tamat SD</option>
                  <option value="SD/Sederajat">SD/Sederajat</option>
                  <option value="SMP/Sederajat">SMP/Sederajat</option>
                  <option value="SMA/Sederajat">SMA/Sederajat</option>
                  <option value="D1/D2/D3">D1/D2/D3</option>
                  <option value="S1/D4">S1/D4</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pekerjaan Utama</label>
                <select
                  value={formData.pekerjaan}
                  onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value as Occupation })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Belum/Tidak Bekerja">Belum/Tidak Bekerja</option>
                  <option value="Mengurus Rumah Tangga">Mengurus Rumah Tangga</option>
                  <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                  <option value="PNS/ASN">PNS/ASN</option>
                  <option value="TNI/Polri">TNI/Polri</option>
                  <option value="Karyawan Swasta">Karyawan Swasta</option>
                  <option value="Wiraswasta">Wiraswasta</option>
                  <option value="Petani/Pekebun">Petani/Pekebun</option>
                  <option value="Peternak">Peternak</option>
                  <option value="Nelayan">Nelayan</option>
                  <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Perkawinan</label>
                <select
                  value={formData.statusPerkawinan}
                  onChange={(e) => setFormData({ ...formData, statusPerkawinan: e.target.value as MaritalStatus })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Golongan Darah</label>
                <select
                  value={formData.golonganDarah}
                  onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as BloodType })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Hubungan (SHDK)</label>
                <select
                  value={formData.shdk}
                  onChange={(e) => setFormData({ ...formData, shdk: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-blue-900"
                >
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Mantu">Mantu</option>
                  <option value="Cucu">Cucu</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Famili Lain">Famili Lain</option>
                  <option value="Pembantu">Pembantu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Akta Lahir</label>
                <select
                  value={formData.aktaLahir}
                  onChange={(e) => setFormData({ ...formData, aktaLahir: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Ada">Ada</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Akta Lahir</label>
                <input
                  type="text"
                  value={formData.noAktaLahir}
                  onChange={(e) => setFormData({ ...formData, noAktaLahir: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800"
                  placeholder="No. Reg Akta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Akta Kawin / Nikah</label>
                <select
                  value={formData.aktaKawin}
                  onChange={(e) => setFormData({ ...formData, aktaKawin: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Ada">Ada</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Akta Kawin</label>
                <input
                  type="text"
                  value={formData.noAktaKawin}
                  onChange={(e) => setFormData({ ...formData, noAktaKawin: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800"
                  placeholder="No. Buku Nikah"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Akta Cerai</label>
                <select
                  value={formData.aktaCerai}
                  onChange={(e) => setFormData({ ...formData, aktaCerai: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Ada">Ada</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Akta Cerai</label>
                <input
                  type="text"
                  value={formData.noAktaCerai}
                  onChange={(e) => setFormData({ ...formData, noAktaCerai: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800"
                  placeholder="No. Akta Cerai"
                />
              </div>
            </div>
          </div>

          {/* Domisili & Wilayah */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">III. Alamat & Wilayah Administrasi Desa</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap (Jalan / Gang / No. Rumah)</label>
                <input
                  type="text"
                  value={formData.alamatLengkap}
                  onChange={(e) => setFormData({ ...formData, alamatLengkap: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  placeholder="Jl. Merdeka No. 12"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dusun</label>
                <select
                  value={formData.dusun}
                  onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  {dusunList.map(d => (
                    <option key={d.id} value={d.namaDusun}>{d.namaDusun}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RW</label>
                <select
                  value={formData.rw}
                  onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="001">RW 001</option>
                  <option value="002">RW 002</option>
                  <option value="003">RW 003</option>
                  <option value="004">RW 004</option>
                  <option value="005">RW 005</option>
                  <option value="006">RW 006</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RT</label>
                <select
                  value={formData.rt}
                  onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="001">RT 001</option>
                  <option value="002">RT 002</option>
                  <option value="003">RT 003</option>
                  <option value="004">RT 004</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Tinggal</label>
                <select
                  value={formData.statusTinggal}
                  onChange={(e) => setFormData({ ...formData, statusTinggal: e.target.value as ResidenceStatus })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Kos">Kos</option>
                  <option value="Sementara">Sementara</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Aktif</label>
                <select
                  value={formData.statusAktif}
                  onChange={(e) => setFormData({ ...formData, statusAktif: e.target.value as ActiveStatus })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Meninggal">Meninggal</option>
                  <option value="Pindah">Pindah</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isMiskin"
                  checked={formData.isMiskin}
                  onChange={(e) => setFormData({ ...formData, isMiskin: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="isMiskin" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Kategori Ekonomi Miskin / Rentan Miskin
                </label>
              </div>
            </div>
          </div>

          {/* Data Orang Tua & Berkas Kependudukan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">IV. Data Orang Tua Kandung</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ayah Kandung</label>
                <input
                  type="text"
                  value={formData.namaAyah}
                  onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                  placeholder="Contoh: Supriadi Usman"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  value={formData.namaIbu}
                  onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                  placeholder="Contoh: Siti Aminah"
                />
              </div>
            </div>
          </div>

          {/* Upload Foto / Scan KTP & KK */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" /> V. Upload Dokumen KTP & KK Warga
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload KTP */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Scan / Foto KTP</span>
                {formData.fotoKtpUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                    <img src={formData.fotoKtpUrl} alt="KTP" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, fotoKtpUrl: '' })}
                      className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white text-xs hover:bg-rose-700 shadow-md"
                      title="Hapus KTP"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-colors">
                    <FileCheck className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-blue-600">Upload KTP</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, atau WEBP (Maks 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, fotoKtpUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Upload KK */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Scan / Foto Kartu Keluarga (KK)</span>
                {formData.fotoKkUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                    <img src={formData.fotoKkUrl} alt="Kartu Keluarga" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, fotoKkUrl: '' })}
                      className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white text-xs hover:bg-rose-700 shadow-md"
                      title="Hapus KK"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-colors">
                    <FileCheck className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-blue-600">Upload KK</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, atau WEBP (Maks 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, fotoKkUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan Data Penduduk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
