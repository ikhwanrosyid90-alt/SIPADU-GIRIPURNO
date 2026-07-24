export type UserRole = 
  | 'Super Admin'
  | 'Administrator Desa'
  | 'Operator Kependudukan'
  | 'Sekretaris Desa'
  | 'Kepala Dusun'
  | 'Ketua RW'
  | 'Ketua RT'
  | 'Operator Bantuan'
  | 'Operator Organisasi'
  | 'Operator Agenda'
  | 'Kepala Desa';

export type Gender = 'Laki-laki' | 'Perempuan';

export type Religion = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu' | 'Lainnya';

export type Education = 
  | 'Tidak/Belum Sekolah'
  | 'Belum Tamat SD'
  | 'SD/Sederajat'
  | 'SMP/Sederajat'
  | 'SMA/Sederajat'
  | 'D1/D2/D3'
  | 'S1/D4'
  | 'S2'
  | 'S3';

export type Occupation = 
  | 'Belum/Tidak Bekerja'
  | 'Mengurus Rumah Tangga'
  | 'Pelajar/Mahasiswa'
  | 'PNS/ASN'
  | 'TNI/Polri'
  | 'Karyawan Swasta'
  | 'Wiraswasta'
  | 'Petani/Pekebun'
  | 'Peternak'
  | 'Nelayan'
  | 'Buruh Harian Lepas'
  | 'Lainnya';

export type MaritalStatus = 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';

export type BloodType = 'A' | 'B' | 'AB' | 'O' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Tidak Tahu';

export type ResidenceStatus = 'Tetap' | 'Kontrak' | 'Kos' | 'Sementara';

export type ActiveStatus = 'Aktif' | 'Meninggal' | 'Pindah';

export type FamilyRelation = 
  | 'Kepala Keluarga'
  | 'Suami'
  | 'Istri'
  | 'Anak'
  | 'Mantu'
  | 'Cucu'
  | 'Orang Tua'
  | 'Mertua'
  | 'Famili Lain'
  | 'Pembantu'
  | 'Lainnya';

export interface DataHistory {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'Tambah' | 'Edit' | 'Hapus' | 'Status Change' | 'Cetak';
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  notes?: string;
}

export interface VillageConfig {
  namaDesa: string;
  kodeDesa?: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  namaKepalaDesa: string;
  nipKepalaDesa: string;
  alamatKantor: string;
  emailDesa: string;
  noHpDesa: string;
  websiteDesa?: string;
  logoUrl?: string;
}

export interface Resident {
  id: string;
  nik: string;
  noKk: string;
  namaLengkap: string;
  namaAyah?: string;
  namaIbu?: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: Gender;
  agama: Religion;
  pendidikan: Education;
  pekerjaan: Occupation;
  statusPerkawinan: MaritalStatus;
  golonganDarah: BloodType;
  kewarganegaraan: 'WNI' | 'WNA';
  shdk?: FamilyRelation | string;
  aktaLahir?: string;
  noAktaLahir?: string;
  aktaKawin?: string;
  noAktaKawin?: string;
  aktaCerai?: string;
  noAktaCerai?: string;
  noHp: string;
  email: string;
  fotoUrl?: string;
  fotoKtpUrl?: string;
  fotoKkUrl?: string;
  alamatLengkap: string;
  rt: string;
  rw: string;
  dusun: string;
  statusTinggal: ResidenceStatus;
  statusAktif: ActiveStatus;
  isMiskin: boolean;
  history: DataHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  residentId: string;
  nik: string;
  namaLengkap: string;
  hubunganKeluarga: FamilyRelation;
  jenisKelamin: Gender;
  tanggalLahir: string;
}

export interface FamilyCard {
  id: string;
  noKk: string;
  headResidentId: string; // NIK or ID of Kepala Keluarga
  namaKepalaKeluarga: string;
  alamatLengkap: string;
  rt: string;
  rw: string;
  dusun: string;
  tanggalPenerbitan: string;
  fotoKkUrl?: string;
  members: FamilyMember[];
  history: DataHistory[];
}

export type MutationType = 'Kelahiran' | 'Kematian' | 'Penduduk Datang' | 'Penduduk Pindah' | 'Perubahan Status';

export interface MutationRecord {
  id: string;
  jenisMutasi: MutationType;
  residentId?: string;
  nik?: string;
  namaLengkap: string;
  tanggalMutasi: string;
  rt: string;
  rw: string;
  dusun: string;
  // Detail spesifik mutasi
  noSuratMutasi?: string;
  keterangan: string;
  // Khusus Kelahiran
  namaAyah?: string;
  namaIbu?: string;
  beratLahir?: number;
  panjangLahir?: number;
  tempatLahir?: string;
  // Khusus Kematian
  sebabKematian?: string;
  tempatKematian?: string;
  // Khusus Pindah/Datang
  alamatAsal?: string;
  alamatTujuan?: string;
  alasanPindah?: string;
  createdUser: string;
  createdAt: string;
}

export type AssistanceType = 
  | 'PKH'
  | 'BPNT'
  | 'BLT Dana Desa'
  | 'Bantuan Pangan'
  | 'RTLH'
  | 'PIP'
  | 'KIP'
  | 'KIS'
  | 'Bantuan UMKM'
  | 'Bantuan Pertanian'
  | 'Bantuan Perikanan'
  | 'Bantuan Peternakan'
  | 'Bantuan Sosial Daerah'
  | 'Lainnya';

export type AssistanceFormat = 'Uang' | 'Barang' | 'Kombinasi';
export type DistributionStatus = 'Tersalurkan' | 'Dalam Proses' | 'Belum Diambil' | 'Dibatalkan';

export interface AssistanceRecipient {
  id: string;
  residentId?: string;
  namaPenerima: string;
  nik: string;
  noKk: string;
  rt: string;
  rw: string;
  dusun: string;
  jenisBantuan: AssistanceType;
  programBantuan: string;
  instansiPemberi: string;
  nominalBantuan: number;
  bentukBantuan: AssistanceFormat;
  rincianBarang?: string;
  tanggalPenerimaan: string;
  periodeBantuan: string; // e.g., '2026 Q2' or 'Tahun 2026'
  statusAktif: boolean;
  statusPenyaluran: DistributionStatus;
  keterangan: string;
}

export interface RTInfo {
  id: string;
  nomorRt: string;
  rwBelongs?: string;
  dusunBelongs?: string;
  namaKetuaRt: string;
  masaJabatan?: string;
  noHp?: string;
  jumlahKk?: number;
  jumlahPenduduk?: number;
}

export interface RWInfo {
  id: string;
  nomorRw: string;
  dusunBelongs?: string;
  namaKetuaRw: string;
  masaJabatan?: string;
  noHp?: string;
  jumlahRt?: number;
  jumlahKk?: number;
  jumlahPenduduk?: number;
  rtList?: RTInfo[];
}

export interface DusunInfo {
  id: string;
  namaDusun: string;
  namaKadus?: string;
  namaKepalaDusun?: string;
  noHp?: string;
  jumlahRw?: number;
  jumlahRt?: number;
  jumlahKk: number;
  jumlahPenduduk: number;
  rwList?: RWInfo[];
}

export interface OrganizationMember {
  id: string;
  nama: string;
  jabatan: string;
  noHp: string;
  alamat: string;
}

export interface VillageOrganization {
  id: string;
  namaOrganisasi: string;
  singkatan?: string;
  ketua: string;
  wakilKetua: string;
  sekretaris: string;
  bendahara: string;
  bidang: string;
  masaJabatan: string;
  alamatSekretariat: string;
  noHp: string;
  email: string;
  logoUrl?: string;
  statusAktif: boolean;
  skNomor?: string;
  skTanggal?: string;
  pengurusList: OrganizationMember[];
  anggotaList: OrganizationMember[];
}

export type AgendaCategory = 'Musyawarah' | 'Gotong Royong' | 'Penyuluhan' | 'Posyandu' | 'Keagamaan' | 'Kepemudaan' | 'Sosialisasi' | 'Lainnya';
export type ActivityStatus = 'Rencana' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';

export interface VillageAgenda {
  id: string;
  namaKegiatan: string;
  jenisKegiatan: AgendaCategory;
  penyelenggara: string;
  organisasiPenanggungJawab: string;
  ketuaPelaksana: string;
  lokasi: string;
  rt: string;
  rw: string;
  dusun: string;
  tanggal: string; // YYYY-MM-DD
  waktuMulai: string; // HH:mm
  waktuSelesai: string;
  anggaran: number;
  sumberDana: 'Dana Desa' | 'ADD' | 'Swadaya' | 'Bantuan Kabupaten' | 'Lainnya';
  deskripsi: string;
  dokumentasiUrl?: string[];
  statusKegiatan: ActivityStatus;
  notulen?: string;
  beritaAcara?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  linkModule?: string;
}
