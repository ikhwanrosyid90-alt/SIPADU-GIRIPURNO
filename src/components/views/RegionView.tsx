import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DusunInfo, RWInfo, RTInfo } from '../../types';
import { MapPin, Users, FileSpreadsheet, Plus, Edit3, Trash2, X, Save, Check, Layers } from 'lucide-react';

export const RegionView: React.FC = () => {
  const { 
    dusunList, 
    residents, 
    familyCards, 
    addDusun, 
    updateDusun, 
    deleteDusun,
    updateRW,
    deleteRW,
    updateRT,
    deleteRT
  } = useApp();

  const [selectedDusunId, setSelectedDusunId] = useState<string>(dusunList[0]?.id || '');
  const [showAddDusunModal, setShowAddDusunModal] = useState(false);
  const [editingDusun, setEditingDusun] = useState<DusunInfo | null>(null);

  // Edit RW / RT modal state
  const [editingRw, setEditingRw] = useState<{ rwId: string; nomorRw: string; namaKetuaRw: string } | null>(null);
  const [editingRt, setEditingRt] = useState<{ rtId: string; nomorRt: string; namaKetuaRt: string } | null>(null);

  const [newDusunName, setNewDusunName] = useState('');
  const [newKadus, setNewKadus] = useState('');

  const activeDusun = dusunList.find(d => d.id === selectedDusunId) || dusunList[0];

  const handleAddDusun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDusunName.trim()) return;
    addDusun({
      namaDusun: newDusunName.startsWith('Dusun') ? newDusunName : `Dusun ${newDusunName}`,
      namaKadus: newKadus || 'Kepala Dusun Baru',
      jumlahKk: 0,
      jumlahPenduduk: 0,
      rwList: [
        {
          id: 'rw-new-' + Date.now(),
          nomorRw: '001',
          namaKetuaRw: 'Ketua RW 001',
          rtList: [
            { id: 'rt-new-' + Date.now(), nomorRt: '001', namaKetuaRt: 'Ketua RT 001', jumlahPenduduk: 0, jumlahKk: 0 }
          ]
        }
      ]
    });
    setNewDusunName('');
    setNewKadus('');
    setShowAddDusunModal(false);
  };

  const handleSaveDusunEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDusun) return;
    updateDusun(editingDusun.id, {
      namaDusun: editingDusun.namaDusun,
      namaKadus: editingDusun.namaKadus
    });
    setEditingDusun(null);
  };

  const handleDeleteDusun = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data ${name}?`)) {
      deleteDusun(id);
      if (selectedDusunId === id) {
        setSelectedDusunId(dusunList.find(d => d.id !== id)?.id || '');
      }
    }
  };

  const handleSaveRwEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRw || !activeDusun) return;
    const currentRwList = activeDusun.rwList || [];
    const updatedRwList = currentRwList.map(r => 
      r.id === editingRw.rwId ? { ...r, nomorRw: editingRw.nomorRw, namaKetuaRw: editingRw.namaKetuaRw } : r
    );
    updateDusun(activeDusun.id, { rwList: updatedRwList });
    setEditingRw(null);
  };

  const handleDeleteRw = (rwId: string, noRw: string) => {
    if (!activeDusun) return;
    if (confirm(`Hapus RW ${noRw} beserta RT di dalamnya?`)) {
      const currentRwList = activeDusun.rwList || [];
      const updatedRwList = currentRwList.filter(r => r.id !== rwId);
      updateDusun(activeDusun.id, { rwList: updatedRwList });
    }
  };

  const handleSaveRtEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRt || !activeDusun) return;
    const currentRwList = activeDusun.rwList || [];
    const updatedRwList = currentRwList.map(rw => ({
      ...rw,
      rtList: (rw.rtList || []).map(rt => 
        rt.id === editingRt.rtId ? { ...rt, nomorRt: editingRt.nomorRt, namaKetuaRt: editingRt.namaKetuaRt } : rt
      )
    }));
    updateDusun(activeDusun.id, { rwList: updatedRwList });
    setEditingRt(null);
  };

  const handleDeleteRt = (rtId: string, noRt: string) => {
    if (!activeDusun) return;
    if (confirm(`Hapus RT ${noRt}?`)) {
      const currentRwList = activeDusun.rwList || [];
      const updatedRwList = currentRwList.map(rw => ({
        ...rw,
        rtList: (rw.rtList || []).filter(rt => rt.id !== rtId)
      }));
      updateDusun(activeDusun.id, { rwList: updatedRwList });
    }
  };

  const handleAddRwToDusun = () => {
    if (!activeDusun) return;
    const currentRwList = activeDusun.rwList || [];
    const newRwNo = String(currentRwList.length + 1).padStart(3, '0');
    const newRw: RWInfo = {
      id: 'rw-' + Date.now(),
      nomorRw: newRwNo,
      namaKetuaRw: 'Ketua RW ' + newRwNo,
      rtList: [
        { id: 'rt-' + Date.now(), nomorRt: '001', namaKetuaRt: 'Ketua RT 001', jumlahPenduduk: 0, jumlahKk: 0 }
      ]
    };
    updateDusun(activeDusun.id, { rwList: [...currentRwList, newRw] });
  };

  const handleAddRtToRw = (rwId: string) => {
    if (!activeDusun) return;
    const currentRwList = activeDusun.rwList || [];
    const targetRw = currentRwList.find(r => r.id === rwId);
    if (!targetRw) return;
    const currentRtList = targetRw.rtList || [];
    const newRtNo = String(currentRtList.length + 1).padStart(3, '0');
    const newRt: RTInfo = {
      id: 'rt-' + Date.now(),
      nomorRt: newRtNo,
      namaKetuaRt: 'Ketua RT ' + newRtNo,
      jumlahPenduduk: 0,
      jumlahKk: 0
    };
    const updatedRwList = currentRwList.map(rw => 
      rw.id === rwId ? { ...rw, rtList: [...(rw.rtList || []), newRt] } : rw
    );
    updateDusun(activeDusun.id, { rwList: updatedRwList });
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Peta Wilayah Administrasi Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">Hierarki Kewilayahan: Dusun &rarr; Rukun Warga (RW) &rarr; Rukun Tetangga (RT)</p>
        </div>

        <button
          onClick={() => setShowAddDusunModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Wilayah Dusun
        </button>
      </div>

      {/* Dusun Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dusunList.map((d) => {
          const isSelected = d.id === activeDusun?.id;
          const realPenduduk = residents.filter(r => r.dusun === d.namaDusun).length;
          const realKK = familyCards.filter(f => f.dusun === d.namaDusun).length;

          return (
            <div
              key={d.id}
              className={`p-5 rounded-2xl border transition-all relative group ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-900 shadow-lg ring-2 ring-blue-500/20'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setSelectedDusunId(d.id)}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                  Wilayah Dusun
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingDusun(d); }}
                    className={`p-1 rounded-md transition-colors ${isSelected ? 'text-blue-200 hover:bg-blue-800' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                    title="Edit Dusun"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteDusun(d.id, d.namaDusun); }}
                    className={`p-1 rounded-md transition-colors ${isSelected ? 'text-rose-300 hover:bg-rose-900' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}
                    title="Hapus Dusun"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="cursor-pointer" onClick={() => setSelectedDusunId(d.id)}>
                <h3 className="text-lg font-extrabold mt-2">{d.namaDusun}</h3>
                <p className={`text-xs mt-0.5 font-medium ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                  Kadus: {d.namaKadus}
                </p>

                <div className={`grid grid-cols-2 gap-2 mt-4 pt-3 border-t text-xs ${isSelected ? 'border-blue-800' : 'border-slate-100'}`}>
                  <div>
                    <span className={`block text-[10px] ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>Jumlah Penduduk</span>
                    <span className="font-bold text-sm">{realPenduduk > 0 ? realPenduduk : d.jumlahPenduduk} Jiwa</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>Kepala Keluarga</span>
                    <span className="font-bold text-sm">{realKK > 0 ? realKK : d.jumlahKk} KK</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Dusun Details: RW & RT Hierarchy */}
      {activeDusun && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                Struktur Rukun Warga (RW) & Rukun Tetangga (RT) - {activeDusun.namaDusun}
              </h3>
              <p className="text-xs text-slate-500">
                Kepala Dusun: <strong className="text-slate-800">{activeDusun.namaKadus}</strong>
              </p>
            </div>

            <button
              onClick={handleAddRwToDusun}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah RW
            </button>
          </div>

          <div className="space-y-4">
            {activeDusun.rwList?.map((rw) => (
              <div key={rw.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                      RW {rw.nomorRw}
                    </span>
                    <span className="text-xs font-bold text-slate-800">Ketua RW: {rw.namaKetuaRw}</span>
                    <button
                      onClick={() => setEditingRw({ rwId: rw.id, nomorRw: rw.nomorRw, namaKetuaRw: rw.namaKetuaRw })}
                      className="p-1 text-slate-400 hover:text-blue-600"
                      title="Edit RW"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRw(rw.id, rw.nomorRw)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Hapus RW"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddRtToRw(rw.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah RT
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {rw.rtList?.map((rt) => {
                    const rtPenduduk = residents.filter(r => r.dusun === activeDusun.namaDusun && r.rt === rt.nomorRt && r.rw === rw.nomorRw).length;
                    const rtKk = familyCards.filter(f => f.dusun === activeDusun.namaDusun && f.rt === rt.nomorRt && f.rw === rw.nomorRw).length;

                    return (
                      <div key={rt.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1 relative group">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">RT {rt.nomorRt}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                              {rtPenduduk} Jiwa / {rtKk} KK
                            </span>
                            <button
                              onClick={() => setEditingRt({ rtId: rt.id, nomorRt: rt.nomorRt, namaKetuaRt: rt.namaKetuaRt })}
                              className="p-0.5 text-slate-400 hover:text-blue-600"
                              title="Edit RT"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteRt(rt.id, rt.nomorRt)}
                              className="p-0.5 text-slate-400 hover:text-rose-600"
                              title="Hapus RT"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500">Ketua RT: {rt.namaKetuaRt}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Dusun */}
      {showAddDusunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Tambah Wilayah Dusun Baru</h3>
            <form onSubmit={handleAddDusun} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Dusun</label>
                <input
                  type="text"
                  required
                  value={newDusunName}
                  onChange={(e) => setNewDusunName(e.target.value)}
                  placeholder="Contoh: Dusun Suka Maju Baru"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Dusun (Kadus)</label>
                <input
                  type="text"
                  required
                  value={newKadus}
                  onChange={(e) => setNewKadus(e.target.value)}
                  placeholder="Nama Kadus..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddDusunModal(false)} className="px-3 py-1.5 bg-slate-200 text-xs rounded-lg font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold shadow-md">
                  Simpan Dusun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Dusun */}
      {editingDusun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Edit Data Dusun</h3>
            <form onSubmit={handleSaveDusunEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Dusun</label>
                <input
                  type="text"
                  required
                  value={editingDusun.namaDusun}
                  onChange={(e) => setEditingDusun({ ...editingDusun, namaDusun: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Dusun (Kadus)</label>
                <input
                  type="text"
                  required
                  value={editingDusun.namaKadus}
                  onChange={(e) => setEditingDusun({ ...editingDusun, namaKadus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingDusun(null)} className="px-3 py-1.5 bg-slate-200 text-xs rounded-lg font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold shadow-md">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit RW */}
      {editingRw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Edit Data Rukun Warga (RW)</h3>
            <form onSubmit={handleSaveRwEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor RW</label>
                <input
                  type="text"
                  required
                  value={editingRw.nomorRw}
                  onChange={(e) => setEditingRw({ ...editingRw, nomorRw: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua RW</label>
                <input
                  type="text"
                  required
                  value={editingRw.namaKetuaRw}
                  onChange={(e) => setEditingRw({ ...editingRw, namaKetuaRw: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingRw(null)} className="px-3 py-1.5 bg-slate-200 text-xs rounded-lg font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold shadow-md">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit RT */}
      {editingRt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Edit Data Rukun Tetangga (RT)</h3>
            <form onSubmit={handleSaveRtEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor RT</label>
                <input
                  type="text"
                  required
                  value={editingRt.nomorRt}
                  onChange={(e) => setEditingRt({ ...editingRt, nomorRt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua RT</label>
                <input
                  type="text"
                  required
                  value={editingRt.namaKetuaRt}
                  onChange={(e) => setEditingRt({ ...editingRt, namaKetuaRt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingRt(null)} className="px-3 py-1.5 bg-slate-200 text-xs rounded-lg font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold shadow-md">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
