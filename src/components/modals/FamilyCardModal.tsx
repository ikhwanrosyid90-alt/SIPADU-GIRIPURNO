import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FamilyCard, FamilyMember, FamilyRelation, Gender } from '../../types';
import { X, Save, Plus, Trash2, FileSpreadsheet, UserPlus } from 'lucide-react';

interface FamilyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  kkToEdit?: FamilyCard | null;
}

export const FamilyCardModal: React.FC<FamilyCardModalProps> = ({
  isOpen,
  onClose,
  kkToEdit
}) => {
  const { addFamilyCard, updateFamilyCard, residents } = useApp();

  const [noKk, setNoKk] = useState('');
  const [namaKepalaKeluarga, setNamaKepalaKeluarga] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [rt, setRt] = useState('001');
  const [rw, setRw] = useState('001');
  const [dusun, setDusun] = useState('Dusun Suka Makmur');
  const [tanggalPenerbitan, setTanggalPenerbitan] = useState('2022-01-01');
  const [members, setMembers] = useState<FamilyMember[]>([]);

  // Form search resident to add to KK
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [selectedHubungan, setSelectedHubungan] = useState<FamilyRelation>('Anak');

  useEffect(() => {
    if (kkToEdit) {
      setNoKk(kkToEdit.noKk || '');
      setNamaKepalaKeluarga(kkToEdit.namaKepalaKeluarga || '');
      setAlamatLengkap(kkToEdit.alamatLengkap || '');
      setRt(kkToEdit.rt || '001');
      setRw(kkToEdit.rw || '001');
      setDusun(kkToEdit.dusun || 'Dusun Suka Makmur');
      setTanggalPenerbitan(kkToEdit.tanggalPenerbitan || '2022-01-01');
      setMembers(kkToEdit.members || []);
    } else {
      setNoKk('3201121005' + Math.floor(100000 + Math.random() * 900000));
      setNamaKepalaKeluarga('');
      setAlamatLengkap('Jl. Pemuda Desa Sukamaju');
      setRt('001');
      setRw('001');
      setDusun('Dusun Suka Makmur');
      setTanggalPenerbitan(new Date().toISOString().slice(0, 10));
      setMembers([]);
    }
  }, [kkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddMemberFromResident = () => {
    if (!selectedResidentId) return;
    const resTarget = residents.find(r => r.id === selectedResidentId);
    if (!resTarget) return;

    if (members.some(m => m.nik === resTarget.nik)) {
      alert('Penduduk ini sudah terdaftar dalam anggota Kartu Keluarga!');
      return;
    }

    const newMem: FamilyMember = {
      residentId: resTarget.id,
      nik: resTarget.nik,
      namaLengkap: resTarget.namaLengkap,
      hubunganKeluarga: selectedHubungan,
      jenisKelamin: resTarget.jenisKelamin,
      tanggalLahir: resTarget.tanggalLahir
    };

    setMembers([...members, newMem]);

    if (selectedHubungan === 'Kepala Keluarga') {
      setNamaKepalaKeluarga(resTarget.namaLengkap);
    }
  };

  const handleRemoveMember = (nik: string) => {
    setMembers(members.filter(m => m.nik !== nik));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noKk || noKk.length !== 16) {
      alert('Nomor Kartu Keluarga wajib 16 digit!');
      return;
    }
    if (!namaKepalaKeluarga.trim()) {
      alert('Nama Kepala Keluarga wajib diisi!');
      return;
    }

    const headResident = residents.find(r => r.namaLengkap.toLowerCase() === namaKepalaKeluarga.toLowerCase());

    const kkPayload = {
      noKk,
      headResidentId: headResident?.id || 'RES-HEAD',
      namaKepalaKeluarga,
      alamatLengkap,
      rt,
      rw,
      dusun,
      tanggalPenerbitan,
      members
    };

    if (kkToEdit) {
      updateFamilyCard(kkToEdit.id, kkPayload);
    } else {
      addFamilyCard(kkPayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{kkToEdit ? 'Edit Kartu Keluarga' : 'Terbitkan Kartu Keluarga Baru'}</h3>
              <p className="text-xs text-slate-400">Pendaftaran No. KK dan Anggota Keluarga Terdaftar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (16 Digit)*</label>
              <input
                type="text"
                maxLength={16}
                value={noKk}
                onChange={(e) => setNoKk(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Keluarga*</label>
              <input
                type="text"
                value={namaKepalaKeluarga}
                onChange={(e) => setNamaKepalaKeluarga(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
                placeholder="Nama Bpk/Ibu Kepala KK"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={alamatLengkap}
                onChange={(e) => setAlamatLengkap(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dusun</label>
              <select value={dusun} onChange={(e) => setDusun(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                <option value="Dusun Suka Makmur">Dusun Suka Makmur</option>
                <option value="Dusun Suka Rame">Dusun Suka Rame</option>
                <option value="Dusun Suka Jaya">Dusun Suka Jaya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RT / RW</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={rt} onChange={(e) => setRt(e.target.value)} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" placeholder="RT" />
                <input type="text" value={rw} onChange={(e) => setRw(e.target.value)} className="bg-white border border-slate-300 rounded-lg p-2 text-xs" placeholder="RW" />
              </div>
            </div>
          </div>

          {/* Section: Anggota Keluarga */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center justify-between">
              <span>Daftar Anggota Keluarga ({members.length} Orang)</span>
            </h4>

            {/* Quick Add Member Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pilih Dari Data Penduduk:</label>
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs"
                >
                  <option value="">-- Pilih Penduduk --</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.namaLengkap} ({r.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hubungan Keluarga:</label>
                <select
                  value={selectedHubungan}
                  onChange={(e) => setSelectedHubungan(e.target.value as FamilyRelation)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs"
                >
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Cucu">Cucu</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Famili Lain">Famili Lain</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddMemberFromResident}
                className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Tambah ke KK
              </button>
            </div>

            {/* Table Members */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Nama Lengkap</th>
                    <th className="p-2">NIK</th>
                    <th className="p-2">Hubungan</th>
                    <th className="p-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">
                        Belum ada anggota keluarga ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.nik} className="hover:bg-slate-50">
                        <td className="p-2 font-bold">{m.namaLengkap}</td>
                        <td className="p-2 font-mono">{m.nik}</td>
                        <td className="p-2 font-medium text-blue-700">{m.hubunganKeluarga}</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(m.nik)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Simpan Kartu Keluarga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
