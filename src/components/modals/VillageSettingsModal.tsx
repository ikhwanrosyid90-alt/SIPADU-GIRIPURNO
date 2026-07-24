import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Building, ShieldCheck, Upload, MapPin, Mail, Phone, Globe, Check } from 'lucide-react';

interface VillageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VillageSettingsModal: React.FC<VillageSettingsModalProps> = ({ isOpen, onClose }) => {
  const { villageConfig, updateVillageConfig } = useApp();

  const [formData, setFormData] = useState(villageConfig);
  const [logoPreview, setLogoPreview] = useState<string>(villageConfig.logoUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(villageConfig);
      setLogoPreview(villageConfig.logoUrl || '');
      setIsSaved(false);
    }
  }, [isOpen, villageConfig]);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVillageConfig(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Pengaturan Identitas & Pemdes</h3>
              <p className="text-xs text-slate-400">Atur nama desa, kepala desa, dan alamat untuk digunakan seluruh dokumen & pengguna</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Logo & Info Utama Desa */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Profil Administrasi Desa
            </h4>

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              {/* Logo Desa Upload */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden relative shadow-inner">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Desa" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors">
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{logoPreview ? 'Ubah Logo' : 'Upload Logo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>

              {/* Form Input Desa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Desa / Kelurahan*</label>
                  <input
                    type="text"
                    required
                    value={formData.namaDesa}
                    onChange={(e) => setFormData({ ...formData, namaDesa: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Sukamaju"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Permendagri Desa</label>
                  <input
                    type="text"
                    value={formData.kodeDesa || ''}
                    onChange={(e) => setFormData({ ...formData, kodeDesa: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                    placeholder="3201012001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan*</label>
                  <input
                    type="text"
                    required
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    placeholder="Contoh: Cibinong"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten / Kota*</label>
                  <input
                    type="text"
                    required
                    value={formData.kabupaten}
                    onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    placeholder="Contoh: Bogor"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi*</label>
                  <input
                    type="text"
                    required
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    placeholder="Contoh: Jawa Barat"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.kodePos}
                    onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                    placeholder="16911"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kepala Desa & Penandatangan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Kepala Desa / Penandatangan Surat
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Desa*</label>
                <input
                  type="text"
                  required
                  value={formData.namaKepalaDesa}
                  onChange={(e) => setFormData({ ...formData, namaKepalaDesa: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  placeholder="Contoh: H. Sukarna S.AP"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIP / NIAP Kepala Desa</label>
                <input
                  type="text"
                  value={formData.nipKepalaDesa}
                  onChange={(e) => setFormData({ ...formData, nipKepalaDesa: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                  placeholder="Contoh: 197508122005011002"
                />
              </div>
            </div>
          </div>

          {/* Alamat Lengkap Kantor & Kontak */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" /> Alamat Kantor & Kontak Resmi
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap Kantor Desa*</label>
              <textarea
                rows={2}
                required
                value={formData.alamatKantor}
                onChange={(e) => setFormData({ ...formData, alamatKantor: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                placeholder="Jl. Raya Sukamaju No. 01, Kecamatan Cibinong, Kabupaten Bogor, Jawa Barat 16911"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" /> Email Desa
                </label>
                <input
                  type="email"
                  value={formData.emailDesa}
                  onChange={(e) => setFormData({ ...formData, emailDesa: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  placeholder="pemdes.sukamaju@bogorkab.go.id"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> Telepon / WA Desa
                </label>
                <input
                  type="text"
                  value={formData.noHpDesa}
                  onChange={(e) => setFormData({ ...formData, noHpDesa: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-500" /> Website Resmi
                </label>
                <input
                  type="text"
                  value={formData.websiteDesa || ''}
                  onChange={(e) => setFormData({ ...formData, websiteDesa: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  placeholder="https://sukamaju.desa.id"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-colors"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Pengaturan Desa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
