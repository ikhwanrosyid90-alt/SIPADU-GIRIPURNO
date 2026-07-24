import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resident, FamilyCard, VillageOrganization } from '../../types';
import { formatDateIndo } from '../../utils/helpers';
import { X, Printer, FileText, Download, CheckCircle2 } from 'lucide-react';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedResident?: Resident;
  preselectedFamilyCard?: FamilyCard;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  preselectedResident,
  preselectedFamilyCard
}) => {
  const { residents, familyCards, organizations, villageConfig } = useApp();

  const [docType, setDocType] = useState<'biodata' | 'kk' | 'pengantar' | 'sk_org'>('biodata');
  const [selectedResidentId, setSelectedResidentId] = useState(preselectedResident?.id || residents[0]?.id || '');
  const [selectedKkId, setSelectedKkId] = useState(preselectedFamilyCard?.id || familyCards[0]?.id || '');
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '');
  
  // Surat Pengantar details
  const [suratJenis, setSuratJenis] = useState<'KTP' | 'SKCK' | 'Domisili' | 'SKTM' | 'Usaha'>('Domisili');
  const [keperluanSurat, setKeperluanSurat] = useState('Persyaratan Administrasi');
  const [nomorSurat, setNomorSurat] = useState(`470/${Math.floor(Math.random()*900)+100}/SK-DS/${new Date().getFullYear()}`);

  if (!isOpen) return null;

  const resident = residents.find(r => r.id === selectedResidentId) || residents[0];
  const familyCard = familyCards.find(f => f.id === selectedKkId) || familyCards[0];
  const org = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 my-8">
        {/* Header Controls (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Cetak Dokumen Administrasi Desa</h3>
              <p className="text-xs text-slate-400">Pilih format dokumen resmi dan pratinjau sebelum dicetak/PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Cetak Sekarang / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control Panel Bar (Hidden during print) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDocType('biodata')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                docType === 'biodata' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Biodata Penduduk
            </button>

            <button
              onClick={() => setDocType('kk')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                docType === 'kk' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Kartu Keluarga Sementara
            </button>

            <button
              onClick={() => setDocType('pengantar')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                docType === 'pengantar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Surat Pengantar Desa
            </button>

            <button
              onClick={() => setDocType('sk_org')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                docType === 'sk_org' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Surat Keputusan (SK) Organisasi
            </button>
          </div>

          {/* Context Selector Based on Doc Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(docType === 'biodata' || docType === 'pengantar') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Penduduk:</label>
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.namaLengkap} (NIK: {r.nik})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {docType === 'kk' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Kartu Keluarga:</label>
                <select
                  value={selectedKkId}
                  onChange={(e) => setSelectedKkId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  {familyCards.map((f) => (
                    <option key={f.id} value={f.id}>
                      No. KK: {f.noKk} - Kepala: {f.namaKepalaKeluarga}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {docType === 'pengantar' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jenis Surat Keterangan:</label>
                  <select
                    value={suratJenis}
                    onChange={(e) => setSuratJenis(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Domisili">Surat Keterangan Domisili</option>
                    <option value="KTP">Surat Pengantar Permohonan KTP</option>
                    <option value="SKCK">Surat Pengantar SKCK</option>
                    <option value="SKTM">Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option value="Usaha">Surat Keterangan Usaha (SKU)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Maksud / Keperluan:</label>
                  <input
                    type="text"
                    value={keperluanSurat}
                    onChange={(e) => setKeperluanSurat(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                  />
                </div>
              </>
            )}

            {docType === 'sk_org' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Organisasi Desa:</label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.namaOrganisasi} ({o.singkatan || ''})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Document Printable View Canvas */}
        <div className="p-8 bg-white min-h-[600px] text-slate-900 printable-area font-serif text-sm leading-relaxed">
          {/* Header Kop Surat */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-6 relative">
            {villageConfig.logoUrl && (
              <img 
                src={villageConfig.logoUrl} 
                alt="Logo Desa" 
                className="w-16 h-16 object-contain absolute left-0 top-0 hidden sm:block" 
              />
            )}
            <h2 className="font-bold text-base uppercase tracking-wider">
              PEMERINTAH KABUPATEN {(villageConfig.kabupaten || 'BOGOR').toUpperCase()}
            </h2>
            <h2 className="font-extrabold text-lg uppercase tracking-widest">
              KECAMATAN {(villageConfig.kecamatan || 'CIBINONG').toUpperCase()} - DESA {(villageConfig.namaDesa || 'SUKAMUJU').toUpperCase()}
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              {villageConfig.alamatKantor || 'Jl. Raya Desa No. 01'} Kode Pos {villageConfig.kodePos || '16911'} | Email: {villageConfig.emailDesa || 'admin@desa.id'}
            </p>
          </div>

          {/* DOC TYPE 1: BIODATA PENDUDUK */}
          {docType === 'biodata' && resident && (
            <div className="space-y-6 font-sans text-xs">
              <div className="text-center">
                <h3 className="font-extrabold text-base underline uppercase tracking-wide">BIODATA PENDUDUK WARGA DESA</h3>
                <p className="text-xs text-slate-600 font-mono">Nomor Dokumen: BPD/{resident.nik}/2026</p>
              </div>

              <div className="grid grid-cols-4 gap-4 items-start">
                {/* Photo box */}
                <div className="col-span-1 border-2 border-slate-400 p-2 text-center h-40 flex flex-col items-center justify-center bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Pas Foto 3x4</span>
                  <span className="text-[9px] text-slate-400">Cap Desa {villageConfig.namaDesa || 'Sukamaju'}</span>
                </div>

                {/* Data Fields */}
                <div className="col-span-3 space-y-2">
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">1. NIK</span>
                    <span className="col-span-2 font-mono font-bold text-blue-900">{resident.nik}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">2. Nomor KK</span>
                    <span className="col-span-2 font-mono">{resident.noKk}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">3. Nama Lengkap</span>
                    <span className="col-span-2 font-bold uppercase">{resident.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">4. Nama Ayah Kandung</span>
                    <span className="col-span-2 uppercase font-medium">{resident.namaAyah || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">5. Nama Ibu Kandung</span>
                    <span className="col-span-2 uppercase font-medium">{resident.namaIbu || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">6. Tempat, Tgl Lahir</span>
                    <span className="col-span-2">{resident.tempatLahir}, {formatDateIndo(resident.tanggalLahir)}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">7. Jenis Kelamin</span>
                    <span className="col-span-2">{resident.jenisKelamin}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">8. Agama</span>
                    <span className="col-span-2">{resident.agama}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">9. Pendidikan</span>
                    <span className="col-span-2">{resident.pendidikan}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">10. Pekerjaan</span>
                    <span className="col-span-2">{resident.pekerjaan}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">11. Status Perkawinan</span>
                    <span className="col-span-2">{resident.statusPerkawinan}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">12. Golongan Darah</span>
                    <span className="col-span-2">{resident.golonganDarah}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                    <span className="font-bold">13. Alamat Lengkap</span>
                    <span className="col-span-2">{resident.alamatLengkap} (RT {resident.rt} / RW {resident.rw}, {resident.dusun})</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between text-center">
                <div>
                  <p>Yang Bersangkutan,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{resident.namaLengkap}</p>
                </div>
                <div>
                  <p>Sukamaju, {formatDateIndo(new Date().toISOString())}</p>
                  <p className="font-bold">Kepala Desa Sukamaju</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">H. Ahmad Dahlan, S.E.</p>
                </div>
              </div>
            </div>
          )}

          {/* DOC TYPE 2: KARTU KELUARGA SEMENTARA */}
          {docType === 'kk' && familyCard && (
            <div className="space-y-5 font-sans text-xs">
              <div className="text-center">
                <h3 className="font-extrabold text-lg uppercase tracking-wide">KARTU KELUARGA SEMENTARA DESA</h3>
                <p className="text-sm font-mono font-bold text-slate-800">No. {familyCard.noKk}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <p><span className="font-bold">Nama Kepala Keluarga:</span> {familyCard.namaKepalaKeluarga}</p>
                  <p><span className="font-bold">Alamat:</span> {familyCard.alamatLengkap}</p>
                </div>
                <div>
                  <p><span className="font-bold">RT / RW:</span> {familyCard.rt} / {familyCard.rw}</p>
                  <p><span className="font-bold">Dusun / Desa:</span> {familyCard.dusun} / Sukamaju</p>
                </div>
              </div>

              {/* Table members */}
              <table className="w-full border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800">
                    <th className="border border-slate-800 p-1.5 text-center">No</th>
                    <th className="border border-slate-800 p-1.5 text-left">Nama Lengkap</th>
                    <th className="border border-slate-800 p-1.5 text-center">NIK</th>
                    <th className="border border-slate-800 p-1.5 text-center">JK</th>
                    <th className="border border-slate-800 p-1.5 text-center">Tgl Lahir</th>
                    <th className="border border-slate-800 p-1.5 text-center">Hubungan</th>
                  </tr>
                </thead>
                <tbody>
                  {familyCard.members.map((m, idx) => (
                    <tr key={m.nik} className="border-b border-slate-300">
                      <td className="border border-slate-800 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-1.5 font-bold uppercase">{m.namaLengkap}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-mono">{m.nik}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{m.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{formatDateIndo(m.tanggalLahir)}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-medium">{m.hubunganKeluarga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 flex justify-between text-center">
                <div>
                  <p>Kepala Keluarga,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{familyCard.namaKepalaKeluarga}</p>
                </div>
                <div>
                  <p>Sukamaju, {formatDateIndo(new Date().toISOString())}</p>
                  <p className="font-bold">Kepala Desa Sukamaju</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">H. Ahmad Dahlan, S.E.</p>
                </div>
              </div>
            </div>
          )}

          {/* DOC TYPE 3: SURAT PENGANTAR DESA */}
          {docType === 'pengantar' && resident && (
            <div className="space-y-5 font-serif text-xs">
              <div className="text-center">
                <h3 className="font-bold text-sm underline uppercase">SURAT KETERANGAN / PENGANTAR DESA</h3>
                <p className="text-xs font-mono">Nomor: {nomorSurat}</p>
              </div>

              <p className="indent-8 text-justify leading-relaxed">
                Yang bertanda tangan di bawah ini Kepala Desa Sukamaju, Kecamatan Cibinong, Kabupaten Bogor, menerangkan dengan sebenarnya bahwa:
              </p>

              <div className="pl-6 space-y-1.5 font-sans">
                <div className="grid grid-cols-3"><span className="font-bold">Nama Lengkap</span><span>: <strong>{resident.namaLengkap}</strong></span></div>
                <div className="grid grid-cols-3"><span className="font-bold">NIK / No. KK</span><span>: {resident.nik} / {resident.noKk}</span></div>
                <div className="grid grid-cols-3"><span className="font-bold">Tempat, Tgl Lahir</span><span>: {resident.tempatLahir}, {formatDateIndo(resident.tanggalLahir)}</span></div>
                <div className="grid grid-cols-3"><span className="font-bold">Jenis Kelamin / Agama</span><span>: {resident.jenisKelamin} / {resident.agama}</span></div>
                <div className="grid grid-cols-3"><span className="font-bold">Pekerjaan</span><span>: {resident.pekerjaan}</span></div>
                <div className="grid grid-cols-3"><span className="font-bold">Alamat</span><span>: {resident.alamatLengkap}</span></div>
              </div>

              <p className="indent-8 text-justify leading-relaxed">
                Orang tersebut di atas adalah benar-benar warga penduduk Desa {villageConfig.namaDesa} yang berdomisili di alamat tersebut. Surat pengantar ini diterbitkan untuk keperluan: <strong className="underline">{keperluanSurat}</strong> (Permohonan {suratJenis}).
              </p>

              <p className="indent-8 text-justify leading-relaxed">
                Demikian surat keterangan ini dibuat agar dapat dipergunakan sebagaimana mestinya.
              </p>

              <div className="pt-8 flex justify-between text-center font-sans">
                <div>
                  <p>Pemegang Surat,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{resident.namaLengkap}</p>
                </div>
                <div>
                  <p>{villageConfig.namaDesa}, {formatDateIndo(new Date().toISOString())}</p>
                  <p className="font-bold">Kepala Desa {villageConfig.namaDesa}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{villageConfig.namaKepalaDesa || 'H. Sukarna S.AP'}</p>
                  {villageConfig.nipKepalaDesa && <p className="text-[10px] font-mono text-slate-500">NIP. {villageConfig.nipKepalaDesa}</p>}
                </div>
              </div>
            </div>
          )}

          {/* DOC TYPE 4: SK ORGANISASI */}
          {docType === 'sk_org' && org && (
            <div className="space-y-5 font-serif text-xs">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-sm uppercase">SURAT KEPUTUSAN KEPALA DESA {(villageConfig.namaDesa || 'SUKAMUJU').toUpperCase()}</h3>
                <p className="text-xs font-mono">NOMOR: {org.skNomor || '141/01/SK-KADES/2026'}</p>
                <p className="font-bold uppercase text-xs pt-2">TENTANG PENETAPAN PENGURUS {org.namaOrganisasi.toUpperCase()}</p>
              </div>

              <div className="space-y-2 text-justify">
                <p><strong>MEMUTUSKAN:</strong></p>
                <p>Menetapkan susunan pengurus {org.namaOrganisasi} Desa {villageConfig.namaDesa} Masa Jabatan {org.masaJabatan} sebagai berikut:</p>
              </div>

              <div className="pl-4 font-sans space-y-1 bg-slate-50 p-4 border border-slate-300 rounded">
                <p><strong>Ketua Umum:</strong> {org.ketua}</p>
                <p><strong>Wakil Ketua:</strong> {org.wakilKetua}</p>
                <p><strong>Sekretaris:</strong> {org.sekretaris}</p>
                <p><strong>Bendahara:</strong> {org.bendahara}</p>
                <p><strong>Bidang Tugas:</strong> {org.bidang}</p>
              </div>

              <div className="pt-8 flex justify-end text-center font-sans">
                <div>
                  <p>Ditetapkan di: {villageConfig.namaDesa}</p>
                  <p>Pada tanggal: {formatDateIndo(org.skTanggal || new Date().toISOString())}</p>
                  <p className="font-bold mt-2">Kepala Desa {villageConfig.namaDesa}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{villageConfig.namaKepalaDesa || 'H. Sukarna S.AP'}</p>
                  {villageConfig.nipKepalaDesa && <p className="text-[10px] font-mono text-slate-500">NIP. {villageConfig.nipKepalaDesa}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
