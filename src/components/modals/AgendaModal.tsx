import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageAgenda, AgendaCategory, ActivityStatus } from '../../types';
import { X, Save, Calendar } from 'lucide-react';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  agendaToEdit?: VillageAgenda | null;
  initialDate?: string;
}

export const AgendaModal: React.FC<AgendaModalProps> = ({ isOpen, onClose, agendaToEdit, initialDate }) => {
  const { addAgenda, updateAgenda, organizations } = useApp();

  const [formData, setFormData] = useState({
    namaKegiatan: '',
    jenisKegiatan: 'Musyawarah' as AgendaCategory,
    penyelenggara: 'Pemerintah Desa Sukamaju',
    organisasiPenanggungJawab: 'BPD Sukamaju',
    ketuaPelaksana: 'Ahmad Supriadi',
    lokasi: 'Aula Balai Desa Sukamaju',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    tanggal: initialDate || new Date().toISOString().slice(0, 10),
    waktuMulai: '08:30',
    waktuSelesai: '12:00',
    anggaran: 1500000,
    sumberDana: 'Dana Desa' as 'Dana Desa' | 'ADD' | 'Swadaya' | 'Bantuan Kabupaten' | 'Lainnya',
    deskripsi: '',
    statusKegiatan: 'Rencana' as ActivityStatus,
    notulen: '',
    beritaAcara: ''
  });

  useEffect(() => {
    if (agendaToEdit) {
      setFormData({
        namaKegiatan: agendaToEdit.namaKegiatan,
        jenisKegiatan: agendaToEdit.jenisKegiatan,
        penyelenggara: agendaToEdit.penyelenggara,
        organisasiPenanggungJawab: agendaToEdit.organisasiPenanggungJawab,
        ketuaPelaksana: agendaToEdit.ketuaPelaksana,
        lokasi: agendaToEdit.lokasi,
        rt: agendaToEdit.rt,
        rw: agendaToEdit.rw,
        dusun: agendaToEdit.dusun,
        tanggal: agendaToEdit.tanggal,
        waktuMulai: agendaToEdit.waktuMulai,
        waktuSelesai: agendaToEdit.waktuSelesai,
        anggaran: agendaToEdit.anggaran,
        sumberDana: agendaToEdit.sumberDana,
        deskripsi: agendaToEdit.deskripsi,
        statusKegiatan: agendaToEdit.statusKegiatan,
        notulen: agendaToEdit.notulen || '',
        beritaAcara: agendaToEdit.beritaAcara || ''
      });
    } else if (initialDate) {
      setFormData(prev => ({ ...prev, tanggal: initialDate }));
    }
  }, [agendaToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaKegiatan.trim()) {
      alert('Nama kegiatan desa wajib diisi!');
      return;
    }

    if (agendaToEdit) {
      updateAgenda(agendaToEdit.id, formData);
    } else {
      addAgenda(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{agendaToEdit ? 'Edit Agenda Kegiatan' : 'Jadwalkan Agenda Desa Baru'}</h3>
              <p className="text-xs text-slate-400">Musyawarah, Gotong Royong, Posyandu, Penyuluhan, Keagamaan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan Desa*</label>
              <input
                type="text"
                value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
                placeholder="Contoh: Musrenbangdes RKP Desa 2027"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kegiatan</label>
              <select
                value={formData.jenisKegiatan}
                onChange={(e) => setFormData({ ...formData, jenisKegiatan: e.target.value as AgendaCategory })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-amber-900"
              >
                <option value="Musyawarah">Musyawarah Desa</option>
                <option value="Gotong Royong">Gotong Royong / Kerja Bakti</option>
                <option value="Posyandu">Posyandu & Kesehatan</option>
                <option value="Penyuluhan">Penyuluhan & Pelatihan</option>
                <option value="Keagamaan">Keagamaan & Pengajian</option>
                <option value="Kepemudaan">Kepemudaan & Olahraga</option>
                <option value="Sosialisasi">Sosialisasi Program</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organisasi Penanggung Jawab</label>
              <select
                value={formData.organisasiPenanggungJawab}
                onChange={(e) => setFormData({ ...formData, organisasiPenanggungJawab: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.namaOrganisasi}>{o.namaOrganisasi}</option>
                ))}
                <option value="Pemerintah Desa Sukamaju">Pemerintah Desa Sukamaju</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan*</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Waktu (Mulai - Selesai)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={formData.waktuMulai} onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" />
                <input type="time" value={formData.waktuSelesai} onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Pelaksanaan</label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Anggaran (Rp)</label>
              <input
                type="number"
                value={formData.anggaran}
                onChange={(e) => setFormData({ ...formData, anggaran: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Kegiatan</label>
              <select
                value={formData.statusKegiatan}
                onChange={(e) => setFormData({ ...formData, statusKegiatan: e.target.value as ActivityStatus })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Rencana">Rencana (Akan Datang)</option>
                <option value="Berlangsung">Berlangsung</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat / Agenda</label>
              <textarea
                rows={2}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="Rincian pembahasan atau persiapan..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Notulen & Ringkasan Hasil Rapat</label>
              <textarea
                rows={2}
                value={formData.notulen}
                onChange={(e) => setFormData({ ...formData, notulen: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="Tuliskan poin keputusan musyawarah / berita acara..."
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Simpan Agenda Desa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
