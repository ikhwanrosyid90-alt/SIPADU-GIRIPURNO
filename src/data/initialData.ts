import { 
  Resident, 
  FamilyCard, 
  MutationRecord, 
  AssistanceRecipient, 
  DusunInfo, 
  RWInfo, 
  RTInfo, 
  VillageOrganization, 
  VillageAgenda, 
  AuditLog, 
  NotificationItem,
  VillageConfig
} from '../types';

export const INITIAL_VILLAGE_CONFIG: VillageConfig = {
  namaDesa: 'Sukamaju',
  kodeDesa: '3201012001',
  kecamatan: 'Cibinong',
  kabupaten: 'Bogor',
  provinsi: 'Jawa Barat',
  kodePos: '16911',
  namaKepalaDesa: 'H. Sukarna S.AP',
  nipKepalaDesa: '197508122005011002',
  alamatKantor: 'Jl. Raya Sukamaju No. 01, Kecamatan Cibinong, Kabupaten Bogor 16911',
  emailDesa: 'pemdes.sukamaju@bogorkab.go.id',
  noHpDesa: '081234567890',
  websiteDesa: 'https://sukamaju.desa.id',
  logoUrl: ''
};

export const INITIAL_DUSUN: DusunInfo[] = [
  {
    id: 'DUS-01',
    namaDusun: 'Dusun Suka Makmur',
    namaKadus: 'Bambang Soeprapto',
    namaKepalaDusun: 'Bambang Soeprapto',
    noHp: '081234567890',
    jumlahRw: 2,
    jumlahRt: 4,
    jumlahKk: 120,
    jumlahPenduduk: 450,
    rwList: [
      {
        id: 'RW-01',
        nomorRw: '001',
        dusunBelongs: 'Dusun Suka Makmur',
        namaKetuaRw: 'H. Suryadi',
        rtList: [
          { id: 'RT-001', nomorRt: '001', rwBelongs: '001', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Agus Setiawan', jumlahKk: 30, jumlahPenduduk: 115 },
          { id: 'RT-002', nomorRt: '002', rwBelongs: '001', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Tono Hartono', jumlahKk: 30, jumlahPenduduk: 115 }
        ]
      },
      {
        id: 'RW-02',
        nomorRw: '002',
        dusunBelongs: 'Dusun Suka Makmur',
        namaKetuaRw: 'Drs. Hendra Utama',
        rtList: [
          { id: 'RT-003', nomorRt: '003', rwBelongs: '002', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Supriadi', jumlahKk: 30, jumlahPenduduk: 110 },
          { id: 'RT-004', nomorRt: '004', rwBelongs: '002', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Eko Prasetyo', jumlahKk: 30, jumlahPenduduk: 110 }
        ]
      }
    ]
  },
  {
    id: 'DUS-02',
    namaDusun: 'Dusun Suka Rame',
    namaKadus: 'Siti Rahmawati',
    namaKepalaDusun: 'Siti Rahmawati',
    noHp: '081298765432',
    jumlahRw: 2,
    jumlahRt: 4,
    jumlahKk: 110,
    jumlahPenduduk: 410,
    rwList: [
      {
        id: 'RW-03',
        nomorRw: '003',
        dusunBelongs: 'Dusun Suka Rame',
        namaKetuaRw: 'Kurniawan S.Pd',
        rtList: [
          { id: 'RT-005', nomorRt: '001', rwBelongs: '003', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Rudi Hermawan', jumlahKk: 28, jumlahPenduduk: 103 },
          { id: 'RT-006', nomorRt: '002', rwBelongs: '003', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Wawan Gunawan', jumlahKk: 27, jumlahPenduduk: 102 }
        ]
      },
      {
        id: 'RW-04',
        nomorRw: '004',
        dusunBelongs: 'Dusun Suka Rame',
        namaKetuaRw: 'Budi Santoso',
        rtList: [
          { id: 'RT-007', nomorRt: '001', rwBelongs: '004', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Dedi Kurnia', jumlahKk: 28, jumlahPenduduk: 103 },
          { id: 'RT-008', nomorRt: '002', rwBelongs: '004', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Hasan Basri', jumlahKk: 27, jumlahPenduduk: 102 }
        ]
      }
    ]
  },
  {
    id: 'DUS-03',
    namaDusun: 'Dusun Suka Jaya',
    namaKadus: 'Ahmad Hidayat',
    namaKepalaDusun: 'Ahmad Hidayat',
    noHp: '081355512345',
    jumlahRw: 2,
    jumlahRt: 4,
    jumlahKk: 95,
    jumlahPenduduk: 380,
    rwList: [
      {
        id: 'RW-05',
        nomorRw: '005',
        dusunBelongs: 'Dusun Suka Jaya',
        namaKetuaRw: 'Zulkifli',
        rtList: [
          { id: 'RT-009', nomorRt: '001', rwBelongs: '005', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRt: 'Amiruddin', jumlahKk: 24, jumlahPenduduk: 95 },
          { id: 'RT-010', nomorRt: '002', rwBelongs: '005', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRt: 'M. Ali', jumlahKk: 24, jumlahPenduduk: 95 }
        ]
      },
      {
        id: 'RW-06',
        nomorRw: '006',
        dusunBelongs: 'Dusun Suka Jaya',
        namaKetuaRw: 'M. Arifin',
        rtList: [
          { id: 'RT-011', nomorRt: '001', rwBelongs: '006', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRt: 'Syaiful', jumlahKk: 24, jumlahPenduduk: 95 },
          { id: 'RT-012', nomorRt: '002', rwBelongs: '006', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRt: 'Bambang Irawan', jumlahKk: 23, jumlahPenduduk: 95 }
        ]
      }
    ]
  }
];

export const INITIAL_RW: RWInfo[] = [
  { id: 'RW-01', nomorRw: '001', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRw: 'H. Suryadi', masaJabatan: '2022 - 2027', noHp: '081211112222', jumlahRt: 2, jumlahKk: 60, jumlahPenduduk: 230 },
  { id: 'RW-02', nomorRw: '002', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRw: 'Drs. Hendra Utama', masaJabatan: '2023 - 2028', noHp: '081233334444', jumlahRt: 2, jumlahKk: 60, jumlahPenduduk: 220 },
  { id: 'RW-03', nomorRw: '003', dusunBelongs: 'Dusun Suka Rame', namaKetuaRw: 'Kurniawan S.Pd', masaJabatan: '2021 - 2026', noHp: '081255556666', jumlahRt: 2, jumlahKk: 55, jumlahPenduduk: 205 },
  { id: 'RW-04', nomorRw: '004', dusunBelongs: 'Dusun Suka Rame', namaKetuaRw: 'Budi Santoso', masaJabatan: '2022 - 2027', noHp: '081277778888', jumlahRt: 2, jumlahKk: 55, jumlahPenduduk: 205 },
  { id: 'RW-05', nomorRw: '005', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRw: 'Zulkifli', masaJabatan: '2024 - 2029', noHp: '081299990000', jumlahRt: 2, jumlahKk: 48, jumlahPenduduk: 190 },
  { id: 'RW-06', nomorRw: '006', dusunBelongs: 'Dusun Suka Jaya', namaKetuaRw: 'M. Arifin', masaJabatan: '2022 - 2027', noHp: '081212123434', jumlahRt: 2, jumlahKk: 47, jumlahPenduduk: 190 }
];

export const INITIAL_RT: RTInfo[] = [
  { id: 'RT-001', nomorRt: '001', rwBelongs: '001', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Agus Setiawan', masaJabatan: '2023 - 2028', noHp: '081311110001', jumlahKk: 30, jumlahPenduduk: 115 },
  { id: 'RT-002', nomorRt: '002', rwBelongs: '001', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Tono Hartono', masaJabatan: '2023 - 2028', noHp: '081311110002', jumlahKk: 30, jumlahPenduduk: 115 },
  { id: 'RT-003', nomorRt: '003', rwBelongs: '002', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Supriadi', masaJabatan: '2022 - 2027', noHp: '081311110003', jumlahKk: 30, jumlahPenduduk: 110 },
  { id: 'RT-004', nomorRt: '004', rwBelongs: '002', dusunBelongs: 'Dusun Suka Makmur', namaKetuaRt: 'Eko Prasetyo', masaJabatan: '2022 - 2027', noHp: '081311110004', jumlahKk: 30, jumlahPenduduk: 110 },
  { id: 'RT-005', nomorRt: '001', rwBelongs: '003', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Rudi Hermawan', masaJabatan: '2021 - 2026', noHp: '081311110005', jumlahKk: 28, jumlahPenduduk: 103 },
  { id: 'RT-006', nomorRt: '002', rwBelongs: '003', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Wawan Gunawan', masaJabatan: '2021 - 2026', noHp: '081311110006', jumlahKk: 27, jumlahPenduduk: 102 },
  { id: 'RT-007', nomorRt: '001', rwBelongs: '004', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Dedi Kurnia', masaJabatan: '2024 - 2029', noHp: '081311110007', jumlahKk: 28, jumlahPenduduk: 103 },
  { id: 'RT-008', nomorRt: '002', rwBelongs: '004', dusunBelongs: 'Dusun Suka Rame', namaKetuaRt: 'Hasan Basri', masaJabatan: '2024 - 2029', noHp: '081311110008', jumlahKk: 27, jumlahPenduduk: 102 }
];

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'RES-001',
    nik: '3201121508820001',
    noKk: '3201121005100001',
    namaLengkap: 'Bambang Soeprapto',
    namaAyah: 'Suryo Handoko',
    namaIbu: 'Siti Rahmah',
    tempatLahir: 'Bogor',
    tanggalLahir: '1982-08-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'S1/D4',
    pekerjaan: 'PNS/ASN',
    statusPerkawinan: 'Kawin',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
    noHp: '081234567890',
    email: 'bambang.s@desa-sukamaju.id',
    alamatLengkap: 'Jl. Merdeka No. 12, RT 001/RW 001, Dusun Suka Makmur',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: false,
    history: [
      { id: 'H-1', timestamp: '2026-01-10 09:00', user: 'Admin Desa', role: 'Administrator Desa', action: 'Tambah', notes: 'Pendaftaran awal sistem' }
    ],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'RES-002',
    nik: '3201125203850002',
    noKk: '3201121005100001',
    namaLengkap: 'Sri Wahyuni',
    namaAyah: 'Mangun Kartono',
    namaIbu: 'Suparni',
    tempatLahir: 'Bandung',
    tanggalLahir: '1985-03-12',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    pendidikan: 'SMA/Sederajat',
    pekerjaan: 'Mengurus Rumah Tangga',
    statusPerkawinan: 'Kawin',
    golonganDarah: 'A',
    kewarganegaraan: 'WNI',
    noHp: '081234567891',
    email: 'sri.wahyuni@gmail.com',
    alamatLengkap: 'Jl. Merdeka No. 12, RT 001/RW 001, Dusun Suka Makmur',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: false,
    history: [],
    createdAt: '2026-01-10T09:15:00Z',
    updatedAt: '2026-01-10T09:15:00Z'
  },
  {
    id: 'RES-003',
    nik: '3201122010120003',
    noKk: '3201121005100001',
    namaLengkap: 'Rizky Pratama',
    namaAyah: 'Bambang Soeprapto',
    namaIbu: 'Sri Wahyuni',
    tempatLahir: 'Bogor',
    tanggalLahir: '2012-10-20',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'SMP/Sederajat',
    pekerjaan: 'Pelajar/Mahasiswa',
    statusPerkawinan: 'Belum Kawin',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
    noHp: '081234567892',
    email: '',
    alamatLengkap: 'Jl. Merdeka No. 12, RT 001/RW 001, Dusun Suka Makmur',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: false,
    history: [],
    createdAt: '2026-01-10T09:20:00Z',
    updatedAt: '2026-01-10T09:20:00Z'
  },
  {
    id: 'RES-004',
    nik: '3201120501250004',
    noKk: '3201121005100001',
    namaLengkap: 'Anindya Putri',
    namaAyah: 'Bambang Soeprapto',
    namaIbu: 'Sri Wahyuni',
    tempatLahir: 'Bogor',
    tanggalLahir: '2025-01-05',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    pendidikan: 'Tidak/Belum Sekolah',
    pekerjaan: 'Belum/Tidak Bekerja',
    statusPerkawinan: 'Belum Kawin',
    golonganDarah: 'A',
    kewarganegaraan: 'WNI',
    noHp: '',
    email: '',
    alamatLengkap: 'Jl. Merdeka No. 12, RT 001/RW 001, Dusun Suka Makmur',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: false,
    history: [],
    createdAt: '2026-01-10T09:25:00Z',
    updatedAt: '2026-01-10T09:25:00Z'
  },
  {
    id: 'RES-005',
    nik: '3201121104750005',
    noKk: '3201121005100002',
    namaLengkap: 'Sukaryo',
    namaAyah: 'Pawiro Semito',
    namaIbu: 'Sukamti',
    tempatLahir: 'Kuningan',
    tanggalLahir: '1975-04-11',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'SD/Sederajat',
    pekerjaan: 'Buruh Harian Lepas',
    statusPerkawinan: 'Kawin',
    golonganDarah: 'B',
    kewarganegaraan: 'WNI',
    noHp: '085712349988',
    email: '',
    alamatLengkap: 'Gang Mawar No. 4, RT 002/RW 001, Dusun Suka Makmur',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: true,
    history: [],
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z'
  },
  {
    id: 'RES-006',
    nik: '3201124808780006',
    noKk: '3201121005100002',
    namaLengkap: 'Siti Aminah',
    namaAyah: 'Ahmad Zaenuri',
    namaIbu: 'Siti Fatimah',
    tempatLahir: 'Bogor',
    tanggalLahir: '1978-08-08',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    pendidikan: 'SMP/Sederajat',
    pekerjaan: 'Mengurus Rumah Tangga',
    statusPerkawinan: 'Kawin',
    golonganDarah: 'B',
    kewarganegaraan: 'WNI',
    noHp: '085712349989',
    email: '',
    alamatLengkap: 'Gang Mawar No. 4, RT 002/RW 001, Dusun Suka Makmur',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: true,
    history: [],
    createdAt: '2026-01-11T10:10:00Z',
    updatedAt: '2026-01-11T10:10:00Z'
  },
  {
    id: 'RES-007',
    nik: '3201120101500007',
    noKk: '3201121005100003',
    namaLengkap: 'Mbah Kromo Pawiro',
    namaAyah: 'Sastro Dikromo',
    namaIbu: 'Sariyem',
    tempatLahir: 'Solo',
    tanggalLahir: '1950-01-01',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'Tidak/Belum Sekolah',
    pekerjaan: 'Petani/Pekebun',
    statusPerkawinan: 'Cerai Mati',
    golonganDarah: 'AB',
    kewarganegaraan: 'WNI',
    noHp: '',
    email: '',
    alamatLengkap: 'Jl. Kenanga No. 8, RT 001/RW 003, Dusun Suka Rame',
    rt: '001',
    rw: '003',
    dusun: 'Dusun Suka Rame',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: true,
    history: [],
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-01-12T11:00:00Z'
  },
  {
    id: 'RES-008',
    nik: '3201121505260008',
    noKk: '3201121005100004',
    namaLengkap: 'Muhammad Arka',
    tempatLahir: 'Bogor',
    tanggalLahir: '2026-05-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'Tidak/Belum Sekolah',
    pekerjaan: 'Belum/Tidak Bekerja',
    statusPerkawinan: 'Belum Kawin',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
    noHp: '',
    email: '',
    alamatLengkap: 'Jl. Melati No. 15, RT 001/RW 004, Dusun Suka Rame',
    rt: '001',
    rw: '004',
    dusun: 'Dusun Suka Rame',
    statusTinggal: 'Tetap',
    statusAktif: 'Aktif',
    isMiskin: false,
    history: [],
    createdAt: '2026-05-16T08:00:00Z',
    updatedAt: '2026-05-16T08:00:00Z'
  }
];

export const INITIAL_FAMILY_CARDS: FamilyCard[] = [
  {
    id: 'KK-001',
    noKk: '3201121005100001',
    headResidentId: 'RES-001',
    namaKepalaKeluarga: 'Bambang Soeprapto',
    alamatLengkap: 'Jl. Merdeka No. 12, RT 001/RW 001, Dusun Suka Makmur',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    tanggalPenerbitan: '2021-06-15',
    members: [
      { residentId: 'RES-001', nik: '3201121508820001', namaLengkap: 'Bambang Soeprapto', hubunganKeluarga: 'Kepala Keluarga', jenisKelamin: 'Laki-laki', tanggalLahir: '1982-08-15' },
      { residentId: 'RES-002', nik: '3201125203850002', namaLengkap: 'Sri Wahyuni', hubunganKeluarga: 'Istri', jenisKelamin: 'Perempuan', tanggalLahir: '1985-03-12' },
      { residentId: 'RES-003', nik: '3201122010120003', namaLengkap: 'Rizky Pratama', hubunganKeluarga: 'Anak', jenisKelamin: 'Laki-laki', tanggalLahir: '2012-10-20' },
      { residentId: 'RES-004', nik: '3201120501250004', namaLengkap: 'Anindya Putri', hubunganKeluarga: 'Anak', jenisKelamin: 'Perempuan', tanggalLahir: '2025-01-05' }
    ],
    history: [
      { id: 'HKK-1', timestamp: '2025-01-06 10:00', user: 'Op Kependudukan', role: 'Operator Kependudukan', action: 'Tambah', notes: 'Penambahan anggota kelahiran Anindya Putri' }
    ]
  },
  {
    id: 'KK-002',
    noKk: '3201121005100002',
    headResidentId: 'RES-005',
    namaKepalaKeluarga: 'Sukaryo',
    alamatLengkap: 'Gang Mawar No. 4, RT 002/RW 001, Dusun Suka Makmur',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    tanggalPenerbitan: '2018-02-10',
    members: [
      { residentId: 'RES-005', nik: '3201121104750005', namaLengkap: 'Sukaryo', hubunganKeluarga: 'Kepala Keluarga', jenisKelamin: 'Laki-laki', tanggalLahir: '1975-04-11' },
      { residentId: 'RES-006', nik: '3201124808780006', namaLengkap: 'Siti Aminah', hubunganKeluarga: 'Istri', jenisKelamin: 'Perempuan', tanggalLahir: '1978-08-08' }
    ],
    history: []
  },
  {
    id: 'KK-003',
    noKk: '3201121005100003',
    headResidentId: 'RES-007',
    namaKepalaKeluarga: 'Mbah Kromo Pawiro',
    alamatLengkap: 'Jl. Kenanga No. 8, RT 001/RW 003, Dusun Suka Rame',
    rt: '001',
    rw: '003',
    dusun: 'Dusun Suka Rame',
    tanggalPenerbitan: '2015-09-20',
    members: [
      { residentId: 'RES-007', nik: '3201120101500007', namaLengkap: 'Mbah Kromo Pawiro', hubunganKeluarga: 'Kepala Keluarga', jenisKelamin: 'Laki-laki', tanggalLahir: '1950-01-01' }
    ],
    history: []
  }
];

export const INITIAL_MUTATIONS: MutationRecord[] = [
  {
    id: 'MUT-001',
    jenisMutasi: 'Kelahiran',
    residentId: 'RES-008',
    nik: '3201121505260008',
    namaLengkap: 'Muhammad Arka',
    tanggalMutasi: '2026-05-15',
    rt: '001',
    rw: '004',
    dusun: 'Dusun Suka Rame',
    noSuratMutasi: '474.1/045/SK/2026',
    keterangan: 'Kelahiran anak pertama dari pasangan Bpk Dedi & Ibu Rina',
    namaAyah: 'Dedi Kurnia',
    namaIbu: 'Rina Herlina',
    beratLahir: 3.2,
    panjangLahir: 49,
    tempatLahir: 'Puskesmas Desa Sukamaju',
    createdUser: 'Operator Kependudukan',
    createdAt: '2026-05-16 08:30'
  },
  {
    id: 'MUT-002',
    jenisMutasi: 'Penduduk Datang',
    namaLengkap: 'Sugianto',
    nik: '3310021406880009',
    tanggalMutasi: '2026-03-10',
    rt: '002',
    rw: '002',
    dusun: 'Dusun Suka Makmur',
    noSuratMutasi: '471.2/012/SKP/2026',
    keterangan: 'Pindah datang dari Kab. Klaten untuk kerja proyek desa',
    alamatAsal: 'Desa Baturetno, Klaten, Jawa Tengah',
    alamatTujuan: 'Gang Dahlia No. 2, Dusun Suka Makmur',
    createdUser: 'Operator Kependudukan',
    createdAt: '2026-03-10 10:15'
  },
  {
    id: 'MUT-003',
    jenisMutasi: 'Kematian',
    namaLengkap: 'Siti Maryam (Alm)',
    nik: '3201126004450010',
    tanggalMutasi: '2026-02-18',
    rt: '001',
    rw: '005',
    dusun: 'Dusun Suka Jaya',
    noSuratMutasi: '474.3/008/KM/2026',
    keterangan: 'Meninggal dunia karena usia lanjut di rumah duka',
    sebabKematian: 'Usia Lanjut / Sakit',
    tempatKematian: 'Rumah Duka RT 001/RW 005',
    createdUser: 'Operator Kependudukan',
    createdAt: '2026-02-18 14:00'
  }
];

export const INITIAL_ASSISTANCE: AssistanceRecipient[] = [
  {
    id: 'BS-001',
    residentId: 'RES-005',
    namaPenerima: 'Sukaryo',
    nik: '3201121104750005',
    noKk: '3201121005100002',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    jenisBantuan: 'BLT Dana Desa',
    programBantuan: 'BLT Kemiskinan Ekstrem 2026',
    instansiPemberi: 'Pemerintah Desa Sukamaju',
    nominalBantuan: 300000,
    bentukBantuan: 'Uang',
    tanggalPenerimaan: '2026-06-05',
    periodeBantuan: 'Tahap 2 (Juni 2026)',
    statusAktif: true,
    statusPenyaluran: 'Tersalurkan',
    keterangan: 'Telah diserahkan langsung di Balai Desa Sukamaju'
  },
  {
    id: 'BS-002',
    residentId: 'RES-006',
    namaPenerima: 'Siti Aminah',
    nik: '3201124808780006',
    noKk: '3201121005100002',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    jenisBantuan: 'PKH',
    programBantuan: 'Program Keluarga Harapan - Komponen Pendidikan',
    instansiPemberi: 'Kementerian Sosial RI',
    nominalBantuan: 750000,
    bentukBantuan: 'Uang',
    tanggalPenerimaan: '2026-05-20',
    periodeBantuan: 'Triwulan II 2026',
    statusAktif: true,
    statusPenyaluran: 'Tersalurkan',
    keterangan: 'Pencairan via rekening Himbara (BNI)'
  },
  {
    id: 'BS-003',
    residentId: 'RES-007',
    namaPenerima: 'Mbah Kromo Pawiro',
    nik: '3201120101500007',
    noKk: '3201121005100003',
    rt: '001',
    rw: '003',
    dusun: 'Dusun Suka Rame',
    jenisBantuan: 'Bantuan Pangan',
    programBantuan: 'Cadangan Pangan Pemerintah (CPP)',
    instansiPemberi: 'Bulog / Bapanas',
    nominalBantuan: 0,
    bentukBantuan: 'Barang',
    rincianBarang: 'Beras Medium 10 kg + Telur 1 Tray',
    tanggalPenerimaan: '2026-06-12',
    periodeBantuan: 'Juni 2026',
    statusAktif: true,
    statusPenyaluran: 'Tersalurkan',
    keterangan: 'Diantar langsung oleh Bhabinkamtibmas dan Kadus'
  },
  {
    id: 'BS-004',
    namaPenerima: 'Suparno',
    nik: '3201121809680011',
    noKk: '3201121005100005',
    rt: '001',
    rw: '005',
    dusun: 'Dusun Suka Jaya',
    jenisBantuan: 'RTLH',
    programBantuan: 'Bedah Rumah Tidak Layak Huni',
    instansiPemberi: 'Dinas Perkim Kabupaten',
    nominalBantuan: 20000000,
    bentukBantuan: 'Kombinasi',
    rincianBarang: 'Material Bangunan + Insentif Tukang',
    tanggalPenerimaan: '2026-07-01',
    periodeBantuan: 'Tahun 2026',
    statusAktif: true,
    statusPenyaluran: 'Dalam Proses',
    keterangan: 'Pengerjaan pondasi dan atap baja ringan'
  }
];

export const INITIAL_ORGANIZATIONS: VillageOrganization[] = [
  {
    id: 'ORG-001',
    namaOrganisasi: 'Karang Taruna Tunas Muda',
    singkatan: 'KT Tunas Muda',
    ketua: 'Rian Kurniawan S.Kom',
    wakilKetua: 'Deni Ardiansyah',
    sekretaris: 'Siska Febriani',
    bendahara: 'Nadia Safitri',
    bidang: 'Kepemudaan, Olahraga & Sosial',
    masaJabatan: '2024 - 2027',
    alamatSekretariat: 'Gedung Serbaguna Desa Sukamaju',
    noHp: '081288889999',
    email: 'karangtaruna.sukamaju@gmail.com',
    statusAktif: true,
    skNomor: '141/08/SK-KADES/2024',
    skTanggal: '2024-01-15',
    pengurusList: [
      { id: 'P-1', nama: 'Rian Kurniawan', jabatan: 'Ketua Umum', noHp: '081288889999', alamat: 'Dusun Suka Makmur' },
      { id: 'P-2', nama: 'Siska Febriani', jabatan: 'Sekretaris', noHp: '081288887777', alamat: 'Dusun Suka Rame' }
    ],
    anggotaList: [
      { id: 'A-1', nama: 'Bagus Setyo', jabatan: 'Anggota Divisi Olahraga', noHp: '081399001122', alamat: 'RT 001/RW 001' },
      { id: 'A-2', nama: 'Dita Rahma', jabatan: 'Anggota Divisi Seni', noHp: '081399001133', alamat: 'RT 002/RW 002' }
    ]
  },
  {
    id: 'ORG-002',
    namaOrganisasi: 'Pemberdayaan Kesejahteraan Keluarga',
    singkatan: 'PKK Desa Sukamaju',
    ketua: 'Hj. Endang Rahayu S.Pd',
    wakilKetua: 'Sri Wahyuni',
    sekretaris: 'Rina Herlina',
    bendahara: 'Ratna Mutiara',
    bidang: 'Pemberdayaan Perempuan & Kesehatan Keluarga',
    masaJabatan: '2023 - 2028',
    alamatSekretariat: 'Kantor Desa Sukamaju Lantai 2',
    noHp: '081277776666',
    email: 'pkk.sukamaju@gmail.com',
    statusAktif: true,
    skNomor: '141/02/SK-KADES/2023',
    skTanggal: '2023-02-10',
    pengurusList: [
      { id: 'P-3', nama: 'Hj. Endang Rahayu', jabatan: 'Ketua Tim Penggerak PKK', noHp: '081277776666', alamat: 'Dusun Suka Makmur' }
    ],
    anggotaList: [
      { id: 'A-3', nama: 'Ibu Euis', jabatan: 'Kader Pokja I', noHp: '081388001144', alamat: 'RT 003/RW 002' }
    ]
  },
  {
    id: 'ORG-003',
    namaOrganisasi: 'Badan Permusyawaratan Desa',
    singkatan: 'BPD Sukamaju',
    ketua: 'Dr. H. Mulyadi M.Si',
    wakilKetua: 'Suryanto S.H.',
    sekretaris: 'Lestari Indah S.P.',
    bendahara: 'Zulham Efendi',
    bidang: 'Pengawasan & Aspirasi Masyakat',
    masaJabatan: '2021 - 2027',
    alamatSekretariat: 'Kantor BPD Desa Sukamaju',
    noHp: '081122334455',
    email: 'bpd@desa-sukamaju.id',
    statusAktif: true,
    skNomor: '141/15/SK-BUPATI/2021',
    skTanggal: '2021-05-10',
    pengurusList: [
      { id: 'P-4', nama: 'Dr. H. Mulyadi', jabatan: 'Ketua BPD', noHp: '081122334455', alamat: 'Dusun Suka Jaya' }
    ],
    anggotaList: []
  },
  {
    id: 'ORG-004',
    namaOrganisasi: 'BUMDes Sukamaju Sejahtera',
    singkatan: 'BUMDes SukaSejahtera',
    ketua: 'Ir. Farhan Hidayat',
    wakilKetua: 'Aris Munandar',
    sekretaris: 'Maya Kartika',
    bendahara: 'Agus Subagyo',
    bidang: 'Ekonomi Desa & Unit Usaha Pangan/Toko Desa',
    masaJabatan: '2023 - 2028',
    alamatSekretariat: 'Kios BUMDes Pasar Desa Sukamaju',
    noHp: '081344556677',
    email: 'bumdes@desa-sukamaju.id',
    statusAktif: true,
    skNomor: '141/11/SK-KADES/2023',
    skTanggal: '2023-04-12',
    pengurusList: [
      { id: 'P-5', nama: 'Ir. Farhan Hidayat', jabatan: 'Direktur Utama', noHp: '081344556677', alamat: 'Dusun Suka Rame' }
    ],
    anggotaList: []
  },
  {
    id: 'ORG-005',
    namaOrganisasi: 'Kelompok Tani Makmur Bersama',
    singkatan: 'Poktan Makmur',
    ketua: 'Sutrisno',
    wakilKetua: 'Karsiman',
    sekretaris: 'Darsono',
    bendahara: 'Kasturi',
    bidang: 'Pertanian Irigasi & Distibusi Pupuk',
    masaJabatan: '2022 - 2026',
    alamatSekretariat: 'Gazebo Tani Dusun Suka Jaya',
    noHp: '085811223344',
    email: '',
    statusAktif: true,
    skNomor: '520/04/SK-KADES/2022',
    skTanggal: '2022-03-20',
    pengurusList: [],
    anggotaList: []
  }
];

export const INITIAL_AGENDAS: VillageAgenda[] = [
  {
    id: 'AGD-001',
    namaKegiatan: 'Musrenbangdes RKP Desa Tahun 2027',
    jenisKegiatan: 'Musyawarah',
    penyelenggara: 'Pemerintah Desa Sukamaju & BPD',
    organisasiPenanggungJawab: 'BPD Sukamaju',
    ketuaPelaksana: 'Dr. H. Mulyadi M.Si',
    lokasi: 'Aula Balai Desa Sukamaju',
    rt: '001',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    tanggal: '2026-07-28',
    waktuMulai: '08:30',
    waktuSelesai: '13:00',
    anggaran: 3500000,
    sumberDana: 'Dana Desa',
    deskripsi: 'Musyawarah Perencanaan Pembangunan Desa penetapan prioritas fisik dan bantuan sosial tahun anggaran 2027.',
    statusKegiatan: 'Rencana',
    notulen: 'Draft agenda dan materi paparan siap disebarkan ke Ketua RT/RW.',
    createdAt: '2026-07-10 10:00'
  },
  {
    id: 'AGD-002',
    namaKegiatan: 'Posyandu Balita & Lansia Terintegrasi',
    jenisKegiatan: 'Posyandu',
    penyelenggara: 'Kader PKK & Puskesmas Pembantu Desa',
    organisasiPenanggungJawab: 'PKK Desa Sukamaju',
    ketuaPelaksana: 'Sri Wahyuni',
    lokasi: 'Posyandu Melati RT 002/RW 001',
    rt: '002',
    rw: '001',
    dusun: 'Dusun Suka Makmur',
    tanggal: '2026-07-24',
    waktuMulai: '08:00',
    waktuSelesai: '11:30',
    anggaran: 1200000,
    sumberDana: 'Dana Desa',
    deskripsi: 'Penimbangan balita, pemberian PMT (Pemberian Makanan Tambahan), dan cek gula darah lansia gratis.',
    statusKegiatan: 'Rencana',
    createdAt: '2026-07-15 09:00'
  },
  {
    id: 'AGD-003',
    namaKegiatan: 'Gotong Royong Kebersihan Saluran Air Mencegah Banjir',
    jenisKegiatan: 'Gotong Royong',
    penyelenggara: 'Pemerintah Desa & Karang Taruna',
    organisasiPenanggungJawab: 'Karang Taruna Tunas Muda',
    ketuaPelaksana: 'Rian Kurniawan S.Kom',
    lokasi: 'Sepanjang Jalan Utama Dusun Suka Rame',
    rt: '001',
    rw: '003',
    dusun: 'Dusun Suka Rame',
    tanggal: '2026-07-26',
    waktuMulai: '07:00',
    waktuSelesai: '11:00',
    anggaran: 800000,
    sumberDana: 'Swadaya',
    deskripsi: 'Kerja bakti pembersihan gorong-gorong dan pangkas dahan pohon menjelang musim hujan.',
    statusKegiatan: 'Rencana',
    createdAt: '2026-07-18 11:30'
  },
  {
    id: 'AGD-004',
    namaKegiatan: 'Penyuluhan Pertanian Organik & Pembagian Pupuk',
    jenisKegiatan: 'Penyuluhan',
    penyelenggara: 'Dinas Pertanian & Poktan Makmur',
    organisasiPenanggungJawab: 'Kelompok Tani Makmur Bersama',
    ketuaPelaksana: 'Sutrisno',
    lokasi: 'Gazebo Tani Dusun Suka Jaya',
    rt: '001',
    rw: '005',
    dusun: 'Dusun Suka Jaya',
    tanggal: '2026-07-15',
    waktuMulai: '09:00',
    waktuSelesai: '12:00',
    anggaran: 2500000,
    sumberDana: 'Bantuan Kabupaten',
    deskripsi: 'Edukasi penggunaan mikroba hayati dan serah terima benih padi unggul.',
    statusKegiatan: 'Selesai',
    notulen: 'Telah dihadiri oleh 45 anggota Poktan. Seluruh benih padi tersalurkan 100%.',
    beritaAcara: 'BA-012/POKTAN/VII/2026 tertanggal 15 Juli 2026.',
    createdAt: '2026-07-01 08:00'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-07-21 22:45:10',
    userName: 'Ikhwan Rosyid (Admin)',
    userRole: 'Super Admin',
    action: 'Login Sistem',
    module: 'Otentikasi',
    details: 'Berhasil masuk ke Sistem Informasi Administrasi Kependudukan Desa (SIPADU)',
    ipAddress: '182.253.112.5'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-07-21 21:30:15',
    userName: 'Bambang S. (Kadus)',
    userRole: 'Kepala Dusun',
    action: 'Pengajuan Mutasi Kelahiran',
    module: 'Mutasi Penduduk',
    details: 'Mencatat kelahiran atas nama Muhammad Arka (NIK: 3201121505260008)',
    ipAddress: '182.253.112.8'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-07-21 20:15:00',
    userName: 'Sri Wahyuni (Op Bansos)',
    userRole: 'Operator Bantuan',
    action: 'Pembaruan Status Penyaluran',
    module: 'Penerimaan Bantuan',
    details: 'Mengubah status BLT Dana Desa untuk Sukaryo menjadi Tersalurkan',
    ipAddress: '182.253.112.12'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Pengingat Agenda H-7',
    message: 'Musrenbangdes RKP Desa Tahun 2027 akan dilaksanakan pada 28 Juli 2026 di Aula Balai Desa.',
    timestamp: '2026-07-21 08:00',
    type: 'info',
    read: false,
    linkModule: 'agenda'
  },
  {
    id: 'NOTIF-002',
    title: 'Penyaluran Bantuan Selesai',
    message: 'Rekapitulasi bantuan BLT Dana Desa Tahap 2 telah rampung 100%.',
    timestamp: '2026-07-20 16:30',
    type: 'success',
    read: false,
    linkModule: 'assistance'
  },
  {
    id: 'NOTIF-003',
    title: 'Update Data Penduduk Baru',
    message: '1 data mutasi kelahiran baru telah dicatatkan dan siap dicetak biodatanya.',
    timestamp: '2026-07-21 14:10',
    type: 'warning',
    read: true,
    linkModule: 'resident'
  }
];
