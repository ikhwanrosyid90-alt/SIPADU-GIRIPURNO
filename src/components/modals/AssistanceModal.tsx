import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistanceType, AssistanceFormat, DistributionStatus, AssistanceRecipient } from '../../types';
import { X, Save, Gift, UserCheck } from 'lucide-react';

interface AssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistanceToEdit?: AssistanceRecipient | null;
}

export const AssistanceModal: React.FC<AssistanceModalProps> = ({ isOpen, onClose, assistanceToEdit }) => {
  const { addAssistance, updateAssistance, residents } = useApp();

  const [formData, setFormData] = useState({
    namaPenerima: '',
    nik: '',
    noKk: '',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    jenisBantuan: 'BLT Dana Desa' as AssistanceType,
    programBantuan: 'BLT Kemiskinan Ekstrem 2026',
    instansiPemberi: 'Pemerintah Desa Sukamaju',
    nominalBantuan: 300000,
    bentukBantuan: 'Uang' as AssistanceFormat,
    rincianBarang: '',
    tanggalPenerimaan: new Date().toISOString().slice(0, 10),
    periodeBantuan: 'Tahap III (2026)',
    statusAktif: true,
    statusPenyaluran: 'Tersalurkan' as DistributionStatus,
    keterangan: 'Penyaluran langsung di Balai Desa'
  });

  const [selectedResidentId, setSelectedResidentId] = useState('');

  useEffect(() => {
    if (assistanceToEdit) {
      setFormData({
        namaPenerima: assistanceToEdit.namaPenerima,
        nik: assistanceToEdit.nik,
        noKk: assistanceToEdit.noKk,
        rt: assistanceToEdit.rt,
        rw: assistanceToEdit.rw,
        dusun: assistanceToEdit.dusun,
        jenisBantuan: assistanceToEdit.jenisBantuan,
        programBantuan: assistanceToEdit.programBantuan,
        instansiPemberi: assistanceToEdit.instansiPemberi,
        nominalBantuan: assistanceToEdit.nominalBantuan,
        bentukBantuan: assistanceToEdit.bentukBantuan,
        rincianBarang: assistanceToEdit.rincianBarang || '',
        tanggalPenerimaan: assistanceToEdit.tanggalPenerimaan,
        periodeBantuan: assistanceToEdit.periodeBantuan,
        statusAktif: assistanceToEdit.statusAktif,
        statusPenyaluran: assistanceToEdit.statusPenyaluran,
        keterangan: assistanceToEdit.keterangan
      });
    }
  }, [assistanceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectResident = (resId: string) => {
    setSelectedResidentId(resId);
    const r = residents.find(res => res.id === resId);
    if (r) {
      setFormData(prev => ({
        ...prev,
        namaPenerima: r.namaLengkap,
        nik: r.nik,
        noKk: r.noKk,
        rt: r.rt,
        rw: r.rw,
        dusun: r.dusun
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaPenerima.trim() || !formData.nik) {
      alert('Nama penerima dan NIK wajib terisi!');
      return;
    }

    if (assistanceToEdit) {
      updateAssistance(assistanceToEdit.id, formData);
    } else {
      addAssistance(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{assistanceToEdit ? 'Edit Data Penerima Bantuan' : 'Pendaftaran Penerima Bantuan Sosial'}</h3>
              <p className="text-xs text-slate-400">Pilih warga penerima dan detail program bantuan pemerintah/desa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Picker Resident */}
          {!assistanceToEdit && (
            <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200">
              <label className="block text-xs font-bold text-blue-900 mb-1">Cari Warga Dari Data Penduduk Desa:</label>
              <select
                value={selectedResidentId}
                onChange={(e) => handleSelectResident(e.target.value)}
                className="w-full bg-white border border-blue-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                <option value="">-- Isikan Manual atau Pilih Dari Master Penduduk --</option>
                {residents.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.namaLengkap} ({r.nik}) - Dusun {r.dusun} {r.isMiskin ? '[Sangat Layak / Miskin]' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penerima*</label>
              <input
                type="text"
                value={formData.namaPenerima}
                onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIK*</label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor KK</label>
              <input
                type="text"
                value={formData.noKk}
                onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dusun</label>
              <select value={formData.dusun} onChange={(e) => setFormData({ ...formData, dusun: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                <option value="Dusun Suka Makmur">Dusun Suka Makmur</option>
                <option value="Dusun Suka Rame">Dusun Suka Rame</option>
                <option value="Dusun Suka Jaya">Dusun Suka Jaya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RT / RW</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={formData.rt} onChange={(e) => setFormData({ ...formData, rt: e.target.value })} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" placeholder="RT" />
                <input type="text" value={formData.rw} onChange={(e) => setFormData({ ...formData, rw: e.target.value })} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" placeholder="RW" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Bantuan Sosial*</label>
              <select
                value={formData.jenisBantuan}
                onChange={(e) => setFormData({ ...formData, jenisBantuan: e.target.value as AssistanceType })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-blue-900"
              >
                <option value="PKH">PKH (Program Keluarga Harapan)</option>
                <option value="BPNT">BPNT (Bantuan Pangan Non Tunai)</option>
                <option value="BLT Dana Desa">BLT Dana Desa</option>
                <option value="Bantuan Pangan">Bantuan Pangan (Beras/CPP)</option>
                <option value="RTLH">RTLH (Bedah Rumah)</option>
                <option value="PIP">PIP (Program Indonesia Pintar)</option>
                <option value="KIP">KIP (Kartu Indonesia Pintar)</option>
                <option value="KIS">KIS (Kartu Indonesia Sehat)</option>
                <option value="Bantuan UMKM">Bantuan Modal UMKM</option>
                <option value="Bantuan Pertanian">Bantuan Pertanian</option>
                <option value="Bantuan Perikanan">Bantuan Perikanan</option>
                <option value="Bantuan Peternakan">Bantuan Peternakan</option>
                <option value="Bantuan Sosial Daerah">Bantuan Sosial Daerah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Program & Instansi Pemberi</label>
              <input
                type="text"
                value={formData.programBantuan}
                onChange={(e) => setFormData({ ...formData, programBantuan: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="Nama Program Bantuan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Bantuan (Rp)</label>
              <input
                type="number"
                value={formData.nominalBantuan}
                onChange={(e) => setFormData({ ...formData, nominalBantuan: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bentuk Bantuan</label>
              <select
                value={formData.bentukBantuan}
                onChange={(e) => setFormData({ ...formData, bentukBantuan: e.target.value as AssistanceFormat })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Uang">Uang Tunai / Transfer</option>
                <option value="Barang">Sembako / Material Barang</option>
                <option value="Kombinasi">Kombinasi Uang + Barang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Penyaluran</label>
              <select
                value={formData.statusPenyaluran}
                onChange={(e) => setFormData({ ...formData, statusPenyaluran: e.target.value as DistributionStatus })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Tersalurkan">Tersalurkan</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Belum Diambil">Belum Diambil</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Simpan Data Bantuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
