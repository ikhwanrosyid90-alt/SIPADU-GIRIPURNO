import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageOrganization } from '../../types';
import { X, Save, Building2 } from 'lucide-react';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgToEdit?: VillageOrganization | null;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose, orgToEdit }) => {
  const { addOrganization, updateOrganization } = useApp();

  const [formData, setFormData] = useState({
    namaOrganisasi: '',
    singkatan: '',
    ketua: '',
    wakilKetua: '',
    sekretaris: '',
    bendahara: '',
    bidang: '',
    masaJabatan: '2024 - 2029',
    alamatSekretariat: 'Balai Desa Sukamaju',
    noHp: '',
    email: '',
    statusAktif: true,
    skNomor: `141/${Math.floor(Math.random()*80)+10}/SK-KADES/2026`,
    skTanggal: new Date().toISOString().slice(0, 10),
    pengurusList: [],
    anggotaList: []
  });

  useEffect(() => {
    if (orgToEdit) {
      setFormData({
        namaOrganisasi: orgToEdit.namaOrganisasi,
        singkatan: orgToEdit.singkatan || '',
        ketua: orgToEdit.ketua,
        wakilKetua: orgToEdit.wakilKetua,
        sekretaris: orgToEdit.sekretaris,
        bendahara: orgToEdit.bendahara,
        bidang: orgToEdit.bidang,
        masaJabatan: orgToEdit.masaJabatan,
        alamatSekretariat: orgToEdit.alamatSekretariat,
        noHp: orgToEdit.noHp,
        email: orgToEdit.email,
        statusAktif: orgToEdit.statusAktif,
        skNomor: orgToEdit.skNomor || '',
        skTanggal: orgToEdit.skTanggal || '',
        pengurusList: orgToEdit.pengurusList || [],
        anggotaList: orgToEdit.anggotaList || []
      });
    }
  }, [orgToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaOrganisasi.trim()) {
      alert('Nama organisasi wajib diisi!');
      return;
    }

    if (orgToEdit) {
      updateOrganization(orgToEdit.id, formData);
    } else {
      addOrganization(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{orgToEdit ? 'Edit Organisasi Desa' : 'Tambah Organisasi Desa Baru'}</h3>
              <p className="text-xs text-slate-400">Karang Taruna, PKK, BPD, BUMDes, Linmas, Poktan, dll.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Organisasi Desa*</label>
              <input
                type="text"
                value={formData.namaOrganisasi}
                onChange={(e) => setFormData({ ...formData, namaOrganisasi: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
                placeholder="Contoh: Karang Taruna Tunas Muda"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Singkatan / Akronim</label>
              <input
                type="text"
                value={formData.singkatan}
                onChange={(e) => setFormData({ ...formData, singkatan: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="KT Tunas Muda"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bidang Kegiatan</label>
              <input
                type="text"
                value={formData.bidang}
                onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="Kepemudaan, Sosial, Pemberdayaan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua Umum*</label>
              <input
                type="text"
                value={formData.ketua}
                onChange={(e) => setFormData({ ...formData, ketua: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Wakil Ketua</label>
              <input
                type="text"
                value={formData.wakilKetua}
                onChange={(e) => setFormData({ ...formData, wakilKetua: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sekretaris</label>
              <input
                type="text"
                value={formData.sekretaris}
                onChange={(e) => setFormData({ ...formData, sekretaris: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bendahara</label>
              <input
                type="text"
                value={formData.bendahara}
                onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Masa Jabatan</label>
              <input
                type="text"
                value={formData.masaJabatan}
                onChange={(e) => setFormData({ ...formData, masaJabatan: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                placeholder="2024 - 2029"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor SK Pengesahan Kepala Desa</label>
              <input
                type="text"
                value={formData.skNomor}
                onChange={(e) => setFormData({ ...formData, skNomor: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Simpan Organisasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
