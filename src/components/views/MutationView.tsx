import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MutationRecord, MutationType } from '../../types';
import { formatDateIndo } from '../../utils/helpers';
import { 
  UserMinus, 
  Plus, 
  Baby, 
  Skull, 
  Truck, 
  MapPin, 
  FileText,
  Search,
  Download,
  Edit2,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface MutationViewProps {
  onOpenAddModal: () => void;
}

export const MutationView: React.FC<MutationViewProps> = ({ onOpenAddModal }) => {
  const { mutations, updateMutation, deleteMutation, dusunList } = useApp();
  const [activeTab, setActiveTab] = useState<'ALL' | MutationType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingMut, setEditingMut] = useState<MutationRecord | null>(null);

  const filteredMutations = mutations.filter(m => {
    const matchesTab = activeTab === 'ALL' || m.jenisMutasi === activeTab;
    const matchesSearch = 
      m.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.nik && m.nik.includes(searchTerm)) ||
      m.dusun.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const countKelahiran = mutations.filter(m => m.jenisMutasi === 'Kelahiran').length;
  const countKematian = mutations.filter(m => m.jenisMutasi === 'Kematian').length;
  const countDatang = mutations.filter(m => m.jenisMutasi === 'Penduduk Datang').length;
  const countPindah = mutations.filter(m => m.jenisMutasi === 'Penduduk Pindah').length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMut) return;
    updateMutation(editingMut.id, editingMut);
    setEditingMut(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan mutasi atas nama ${name}?`)) {
      deleteMutation(id);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Modul Mutasi & Perubahan Status Penduduk
          </h2>
          <p className="text-xs text-slate-500 mt-1">Pencatatan resmi Kelahiran, Kematian, Penduduk Pindah Datang & Pindah Keluar Desa</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Catat Mutasi Baru
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-600 text-white font-bold">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-900">{countKelahiran}</div>
            <p className="text-[11px] text-emerald-700 font-semibold">Kelahiran Baru</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-600 text-white font-bold">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-900">{countKematian}</div>
            <p className="text-[11px] text-rose-700 font-semibold">Kematian Record</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-blue-900">{countDatang}</div>
            <p className="text-[11px] text-blue-700 font-semibold">Penduduk Datang</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-600 text-white font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-900">{countPindah}</div>
            <p className="text-[11px] text-amber-700 font-semibold">Penduduk Pindah</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Mutasi ({mutations.length})
            </button>
            <button
              onClick={() => setActiveTab('Kelahiran')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'Kelahiran' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              Kelahiran ({countKelahiran})
            </button>
            <button
              onClick={() => setActiveTab('Kematian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'Kematian' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800'
              }`}
            >
              Kematian ({countKematian})
            </button>
            <button
              onClick={() => setActiveTab('Penduduk Datang')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'Penduduk Datang' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-800'
              }`}
            >
              Datang ({countDatang})
            </button>
            <button
              onClick={() => setActiveTab('Penduduk Pindah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'Penduduk Pindah' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800'
              }`}
            >
              Pindah ({countPindah})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NIK..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Table Mutasi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3">Peristiwa</th>
                <th className="p-3">Subjek Penduduk</th>
                <th className="p-3">Tanggal Mutasi</th>
                <th className="p-3">Wilayah Dusun</th>
                <th className="p-3">No. Surat / Keterangan</th>
                <th className="p-3">Pencatat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMutations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Belum ada riwayat mutasi penduduk.
                  </td>
                </tr>
              ) : (
                filteredMutations.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        m.jenisMutasi === 'Kelahiran' ? 'bg-emerald-100 text-emerald-800' :
                        m.jenisMutasi === 'Kematian' ? 'bg-rose-100 text-rose-800' :
                        m.jenisMutasi === 'Penduduk Datang' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.jenisMutasi}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{m.namaLengkap}</div>
                      {m.nik && <div className="text-[10px] font-mono text-slate-400">NIK: {m.nik}</div>}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{formatDateIndo(m.tanggalMutasi)}</td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{m.dusun}</div>
                      <div className="text-[10px] text-slate-500">RT {m.rt} / RW {m.rw}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-[11px] font-bold text-slate-800">{m.noSuratMutasi}</div>
                      <div className="text-[10px] text-slate-500 italic">{m.keterangan}</div>
                    </td>
                    <td className="p-3 text-[11px] text-slate-500">{m.createdUser}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingMut(m)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Catatan Mutasi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.namaLengkap)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Hapus Record Mutasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Mutasi */}
      {editingMut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Catatan Mutasi: {editingMut.namaLengkap}</h3>
              <button onClick={() => setEditingMut(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Mutasi</label>
                <select
                  value={editingMut.jenisMutasi}
                  onChange={(e) => setEditingMut({ ...editingMut, jenisMutasi: e.target.value as MutationType })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                >
                  <option value="Kelahiran">Kelahiran</option>
                  <option value="Kematian">Kematian</option>
                  <option value="Penduduk Datang">Penduduk Datang</option>
                  <option value="Penduduk Pindah">Penduduk Pindah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Subjek</label>
                <input
                  type="text"
                  required
                  value={editingMut.namaLengkap}
                  onChange={(e) => setEditingMut({ ...editingMut, namaLengkap: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK (Opsional)</label>
                <input
                  type="text"
                  value={editingMut.nik || ''}
                  onChange={(e) => setEditingMut({ ...editingMut, nik: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mutasi</label>
                <input
                  type="date"
                  required
                  value={editingMut.tanggalMutasi}
                  onChange={(e) => setEditingMut({ ...editingMut, tanggalMutasi: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dusun</label>
                  <select
                    value={editingMut.dusun}
                    onChange={(e) => setEditingMut({ ...editingMut, dusun: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  >
                    {dusunList.map(d => (
                      <option key={d.id} value={d.namaDusun}>{d.namaDusun}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RW</label>
                  <input
                    type="text"
                    value={editingMut.rw}
                    onChange={(e) => setEditingMut({ ...editingMut, rw: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RT</label>
                  <input
                    type="text"
                    value={editingMut.rt}
                    onChange={(e) => setEditingMut({ ...editingMut, rt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat Mutasi</label>
                <input
                  type="text"
                  value={editingMut.noSuratMutasi || ''}
                  onChange={(e) => setEditingMut({ ...editingMut, noSuratMutasi: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={editingMut.keterangan || ''}
                  onChange={(e) => setEditingMut({ ...editingMut, keterangan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingMut(null)}
                  className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
