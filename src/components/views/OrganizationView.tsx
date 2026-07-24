import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageOrganization } from '../../types';
import { exportTableToPDF } from '../../utils/helpers';
import { 
  Building2, 
  Plus, 
  Printer, 
  Users, 
  Phone, 
  Mail, 
  FileText, 
  Edit3, 
  Trash2 
} from 'lucide-react';

interface OrganizationViewProps {
  onOpenAddModal: () => void;
  onEditOrg: (org: VillageOrganization) => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({ onOpenAddModal, onEditOrg }) => {
  const { organizations, deleteOrganization } = useApp();
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '');

  const activeOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  const handlePrintSk = (org: VillageOrganization) => {
    const headers = ['Jabatan Pengurus', 'Nama Pengurus', 'NIK / KTP', 'Nomor Kontak'];
    const rows = [
      ['Ketua Umum', org.ketua, '320112100510001', org.noHp || '-'],
      ['Wakil Ketua', org.wakilKetua, '320112100510002', '-'],
      ['Sekretaris', org.sekretaris, '320112100510003', '-'],
      ['Bendahara', org.bendahara, '320112100510004', '-']
    ];
    exportTableToPDF(
      `SURAT KETERANGAN KEPUTUSAN KEPALA DESA SUKAMUJU\nNOMOR: ${org.skNomor || '141/08/SK/2026'}\nTENTANG PENGESAHAN PENGURUS ${org.namaOrganisasi.toUpperCase()}`,
      headers,
      rows,
      `SK_PENGESAHAN_${org.namaOrganisasi.replace(/\s+/g, '_')}`
    );
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Kelembagaan & Organisasi Kemasyarakatan Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Karang Taruna, PKK, BPD, BUMDes, Linmas, Poktan, LPMD, Posyandu, dll.</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Organisasi Baru
        </button>
      </div>

      {/* Grid Organisasi Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((o) => {
          const isSelected = o.id === activeOrg?.id;
          return (
            <div
              key={o.id}
              onClick={() => setSelectedOrgId(o.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected ? 'bg-indigo-950 text-white border-indigo-900 shadow-lg ring-2 ring-indigo-500/20' : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-700'}`}>
                  {o.bidang || 'Lembaga Desa'}
                </span>
                <Building2 className={`w-5 h-5 ${isSelected ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>

              <h3 className="text-base font-extrabold mt-2">{o.namaOrganisasi}</h3>
              <p className={`text-xs mt-0.5 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                Ketua: <strong>{o.ketua}</strong>
              </p>

              <div className={`mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs ${isSelected ? 'border-indigo-900/60' : 'border-slate-100'}`}>
                <div>
                  <span className={`block text-[10px] ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>Masa Jabatan</span>
                  <span className="font-bold">{o.masaJabatan}</span>
                </div>
                <div>
                  <span className={`block text-[10px] ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>SK Kades</span>
                  <span className="font-mono text-[10px] font-bold truncate">{o.skNomor || 'Ada'}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrintSk(o);
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isSelected ? 'bg-white text-indigo-950 border-white' : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}
                >
                  <Printer className="w-3 h-3" /> Cetak SK Pengesahan
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOrg(o);
                    }}
                    className={`p-1.5 rounded ${isSelected ? 'hover:bg-indigo-800 text-indigo-200' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus organisasi ${o.namaOrganisasi}?`)) deleteOrganization(o.id);
                    }}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Organization Detail View */}
      {activeOrg && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">{activeOrg.namaOrganisasi}</h3>
              <p className="text-xs text-slate-500">Sekretariat: {activeOrg.alamatSekretariat}</p>
            </div>
            <button
              onClick={() => handlePrintSk(activeOrg)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Cetak SK Kades Resmi (PDF)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ketua Umum</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeOrg.ketua}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Wakil Ketua</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeOrg.wakilKetua || '-'}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sekretaris</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeOrg.sekretaris || '-'}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bendahara</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeOrg.bendahara || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
