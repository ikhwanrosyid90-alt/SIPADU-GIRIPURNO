import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserRole, 
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
import { 
  INITIAL_RESIDENTS, 
  INITIAL_FAMILY_CARDS, 
  INITIAL_MUTATIONS, 
  INITIAL_ASSISTANCE, 
  INITIAL_DUSUN, 
  INITIAL_RW, 
  INITIAL_RT, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_AGENDAS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_VILLAGE_CONFIG
} from '../data/initialData';

export type ViewTab = 
  | 'dashboard' 
  | 'resident' 
  | 'family-card' 
  | 'mutation' 
  | 'assistance' 
  | 'region' 
  | 'organization' 
  | 'agenda' 
  | 'calendar' 
  | 'reports' 
  | 'audit-log';

interface AppContextType {
  activeView: ViewTab;
  setActiveView: (view: ViewTab) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUserName: string;
  
  villageConfig: VillageConfig;
  updateVillageConfig: (config: VillageConfig) => void;

  residents: Resident[];
  familyCards: FamilyCard[];
  mutations: MutationRecord[];
  assistance: AssistanceRecipient[];
  dusunList: DusunInfo[];
  rwList: RWInfo[];
  rtList: RTInfo[];
  organizations: VillageOrganization[];
  agendas: VillageAgenda[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  
  googleStatus: { connected: boolean; message: string };
  
  appsScriptUrl: string;
  setAppsScriptUrl: (url: string) => void;
  fetchFromAppsScript: (sheetName?: string) => Promise<{ success: boolean; data?: any[]; message: string }>;
  sendToAppsScript: (sheetName: string, data: any, action?: string) => Promise<{ success: boolean; message: string }>;
  
  // Handlers
  addResident: (resident: Omit<Resident, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Resident;
  updateResident: (id: string, resident: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  
  addFamilyCard: (kk: Omit<FamilyCard, 'id' | 'history'>) => void;
  updateFamilyCard: (id: string, kk: Partial<FamilyCard>) => void;
  deleteFamilyCard: (id: string) => void;
  
  addMutation: (mutation: Omit<MutationRecord, 'id' | 'createdAt' | 'createdUser'>) => void;
  updateMutation: (id: string, mutation: Partial<MutationRecord>) => void;
  deleteMutation: (id: string) => void;
  
  addAssistance: (item: Omit<AssistanceRecipient, 'id'>) => void;
  updateAssistance: (id: string, item: Partial<AssistanceRecipient>) => void;
  deleteAssistance: (id: string) => void;
  
  // Region Handlers
  addDusun: (dusun: Omit<DusunInfo, 'id'>) => void;
  updateDusun: (id: string, dusun: Partial<DusunInfo>) => void;
  deleteDusun: (id: string) => void;
  addRW: (rw: Omit<RWInfo, 'id'>) => void;
  updateRW: (id: string, rw: Partial<RWInfo>) => void;
  deleteRW: (id: string) => void;
  addRT: (rt: Omit<RTInfo, 'id'>) => void;
  updateRT: (id: string, rt: Partial<RTInfo>) => void;
  deleteRT: (id: string) => void;

  addOrganization: (org: Omit<VillageOrganization, 'id'>) => void;
  updateOrganization: (id: string, org: Partial<VillageOrganization>) => void;
  deleteOrganization: (id: string) => void;
  
  addAgenda: (agenda: Omit<VillageAgenda, 'id' | 'createdAt'>) => void;
  updateAgenda: (id: string, agenda: Partial<VillageAgenda>) => void;
  deleteAgenda: (id: string) => void;
  
  logAudit: (module: string, action: string, details: string) => void;
  markNotificationRead: (id: string) => void;
  
  syncModuleToGoogleSheets: (moduleName: string, data: any) => Promise<{ success: boolean; sheetUrl?: string; message: string }>;
  backupToGoogleDrive: () => Promise<{ success: boolean; driveUrl?: string; fileName?: string; message: string }>;
  
  resetDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewTab>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Administrator Desa');
  const [currentUserName] = useState('Ikhwan Rosyid');

  const [villageConfig, setVillageConfig] = useState<VillageConfig>(() => {
    const saved = localStorage.getItem('sipadu_village_config');
    return saved ? JSON.parse(saved) : INITIAL_VILLAGE_CONFIG;
  });

  // Local storage state initialization with fallbacks
  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('sipadu_residents');
    return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
  });

  const [familyCards, setFamilyCards] = useState<FamilyCard[]>(() => {
    const saved = localStorage.getItem('sipadu_family_cards');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_CARDS;
  });

  const [mutations, setMutations] = useState<MutationRecord[]>(() => {
    const saved = localStorage.getItem('sipadu_mutations');
    return saved ? JSON.parse(saved) : INITIAL_MUTATIONS;
  });

  const [assistance, setAssistance] = useState<AssistanceRecipient[]>(() => {
    const saved = localStorage.getItem('sipadu_assistance');
    return saved ? JSON.parse(saved) : INITIAL_ASSISTANCE;
  });

  const [dusunList, setDusunList] = useState<DusunInfo[]>(() => {
    const saved = localStorage.getItem('sipadu_dusun_list');
    return saved ? JSON.parse(saved) : INITIAL_DUSUN;
  });

  const [rwList, setRwList] = useState<RWInfo[]>(() => {
    const saved = localStorage.getItem('sipadu_rw_list');
    return saved ? JSON.parse(saved) : INITIAL_RW;
  });

  const [rtList, setRtList] = useState<RTInfo[]>(() => {
    const saved = localStorage.getItem('sipadu_rt_list');
    return saved ? JSON.parse(saved) : INITIAL_RT;
  });

  const [organizations, setOrganizations] = useState<VillageOrganization[]>(() => {
    const saved = localStorage.getItem('sipadu_organizations');
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
  });

  const [agendas, setAgendas] = useState<VillageAgenda[]>(() => {
    const saved = localStorage.getItem('sipadu_agendas');
    return saved ? JSON.parse(saved) : INITIAL_AGENDAS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sipadu_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sipadu_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [googleStatus, setGoogleStatus] = useState({ connected: true, message: 'Google Workspace Terhubung (Sheets & Drive)' });

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('sipadu_village_config', JSON.stringify(villageConfig));
  }, [villageConfig]);

  useEffect(() => {
    localStorage.setItem('sipadu_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('sipadu_family_cards', JSON.stringify(familyCards));
  }, [familyCards]);

  useEffect(() => {
    localStorage.setItem('sipadu_mutations', JSON.stringify(mutations));
  }, [mutations]);

  useEffect(() => {
    localStorage.setItem('sipadu_assistance', JSON.stringify(assistance));
  }, [assistance]);

  useEffect(() => {
    localStorage.setItem('sipadu_dusun_list', JSON.stringify(dusunList));
  }, [dusunList]);

  useEffect(() => {
    localStorage.setItem('sipadu_rw_list', JSON.stringify(rwList));
  }, [rwList]);

  useEffect(() => {
    localStorage.setItem('sipadu_rt_list', JSON.stringify(rtList));
  }, [rtList]);

  useEffect(() => {
    localStorage.setItem('sipadu_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('sipadu_agendas', JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem('sipadu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sipadu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Village Config Handler
  const updateVillageConfig = (config: VillageConfig) => {
    setVillageConfig(config);
    logAudit('Pengaturan Desa', 'Update Identitas Desa', `Mengubah profil desa menjadi ${config.namaDesa}, Kades ${config.namaKepalaDesa}`);
    addNotification('Identitas Desa Diperbarui', `Profil Desa ${config.namaDesa} berhasil diperbarui.`, 'success');
  };

  // Audit Logger
  const logAudit = (module: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      userName: `${currentUserName} (${currentUserRole})`,
      userRole: currentUserRole,
      action,
      module,
      details,
      ipAddress: '182.253.112.5'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert', linkModule?: string) => {
    const notif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleString('id-ID'),
      type,
      read: false,
      linkModule
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Residents handlers
  const addResident = (residentData: Omit<Resident, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Resident => {
    const id = 'RES-' + String(residents.length + 1).padStart(3, '0') + '-' + Math.floor(Math.random() * 100);
    const now = new Date().toISOString();
    const newResident: Resident = {
      ...residentData,
      id,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: 'H-' + Date.now(),
          timestamp: new Date().toLocaleString('id-ID'),
          user: currentUserName,
          role: currentUserRole,
          action: 'Tambah',
          notes: 'Pendaftaran penduduk baru'
        }
      ]
    };
    setResidents(prev => [newResident, ...prev]);
    logAudit('Data Penduduk', 'Tambah Penduduk', `Menambahkan NIK ${newResident.nik} (${newResident.namaLengkap})`);
    addNotification('Penduduk Baru Didaftarkan', `Data NIK ${newResident.nik} - ${newResident.namaLengkap} berhasil disimpan.`, 'success', 'resident');
    return newResident;
  };

  const updateResident = (id: string, residentData: Partial<Resident>) => {
    setResidents(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...residentData, updatedAt: new Date().toISOString() };
        updated.history = [
          {
            id: 'H-' + Date.now(),
            timestamp: new Date().toLocaleString('id-ID'),
            user: currentUserName,
            role: currentUserRole,
            action: 'Edit',
            notes: 'Pembaruan data biodata'
          },
          ...(r.history || [])
        ];
        return updated;
      }
      return r;
    }));
    logAudit('Data Penduduk', 'Pembaruan Data', `Mengubah data penduduk ID ${id}`);
  };

  const deleteResident = (id: string) => {
    const target = residents.find(r => r.id === id);
    setResidents(prev => prev.filter(r => r.id !== id));
    logAudit('Data Penduduk', 'Hapus Penduduk', `Menghapus data NIK ${target?.nik || id} (${target?.namaLengkap || ''})`);
  };

  // Family Card Handlers
  const addFamilyCard = (kkData: Omit<FamilyCard, 'id' | 'history'>) => {
    const id = 'KK-' + String(familyCards.length + 1).padStart(3, '0');
    const newCard: FamilyCard = {
      ...kkData,
      id,
      history: [
        {
          id: 'HKK-' + Date.now(),
          timestamp: new Date().toLocaleString('id-ID'),
          user: currentUserName,
          role: currentUserRole,
          action: 'Tambah',
          notes: 'Penerbitan Kartu Keluarga Desa Baru'
        }
      ]
    };
    setFamilyCards(prev => [newCard, ...prev]);
    logAudit('Kartu Keluarga', 'Tambah KK', `Penerbitan No KK ${newCard.noKk} Kategori ${newCard.namaKepalaKeluarga}`);
  };

  const updateFamilyCard = (id: string, kkData: Partial<FamilyCard>) => {
    setFamilyCards(prev => prev.map(f => f.id === id ? { ...f, ...kkData } : f));
    logAudit('Kartu Keluarga', 'Edit KK', `Memperbarui data Kartu Keluarga ID ${id}`);
  };

  const deleteFamilyCard = (id: string) => {
    setFamilyCards(prev => prev.filter(f => f.id !== id));
    logAudit('Kartu Keluarga', 'Hapus KK', `Menghapus Kartu Keluarga ID ${id}`);
  };

  // Mutation Handlers
  const addMutation = (mutationData: Omit<MutationRecord, 'id' | 'createdAt' | 'createdUser'>) => {
    const newMut: MutationRecord = {
      ...mutationData,
      id: 'MUT-' + String(mutations.length + 1).padStart(3, '0'),
      createdAt: new Date().toLocaleString('id-ID'),
      createdUser: `${currentUserName} (${currentUserRole})`
    };
    setMutations(prev => [newMut, ...prev]);
    logAudit('Mutasi Penduduk', `Catat ${newMut.jenisMutasi}`, `Pencatatan mutasi ${newMut.jenisMutasi} atas nama ${newMut.namaLengkap}`);
    addNotification('Mutasi Penduduk Ditambahkan', `${newMut.jenisMutasi}: ${newMut.namaLengkap} (${newMut.dusun})`, 'info', 'mutation');
  };

  const updateMutation = (id: string, mutationData: Partial<MutationRecord>) => {
    setMutations(prev => prev.map(m => m.id === id ? { ...m, ...mutationData } : m));
    logAudit('Mutasi Penduduk', 'Update Mutasi', `Memperbarui rekaman mutasi ID ${id}`);
    addNotification('Mutasi Penduduk Diperbarui', `Rekaman mutasi ID ${id} berhasil diperbarui.`, 'success', 'mutation');
  };

  const deleteMutation = (id: string) => {
    setMutations(prev => prev.filter(m => m.id !== id));
    logAudit('Mutasi Penduduk', 'Hapus Mutasi', `Menghapus rekaman mutasi ID ${id}`);
  };

  // Region Handlers (Dusun, RW, RT)
  const addDusun = (dusun: Omit<DusunInfo, 'id'>) => {
    const newDusun: DusunInfo = {
      ...dusun,
      id: 'DUS-' + String(dusunList.length + 1).padStart(2, '0')
    };
    setDusunList(prev => [...prev, newDusun]);
    logAudit('Wilayah Administrasi', 'Tambah Dusun', `Menambahkan Dusun ${newDusun.namaDusun}`);
  };

  const updateDusun = (id: string, updated: Partial<DusunInfo>) => {
    setDusunList(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    logAudit('Wilayah Administrasi', 'Update Dusun', `Memperbarui data Dusun ID ${id}`);
  };

  const deleteDusun = (id: string) => {
    setDusunList(prev => prev.filter(d => d.id !== id));
    logAudit('Wilayah Administrasi', 'Hapus Dusun', `Menghapus Dusun ID ${id}`);
  };

  const addRW = (rw: Omit<RWInfo, 'id'>) => {
    const newRW: RWInfo = {
      ...rw,
      id: 'RW-' + String(rwList.length + 1).padStart(2, '0')
    };
    setRwList(prev => [...prev, newRW]);
    logAudit('Wilayah Administrasi', 'Tambah RW', `Menambahkan RW ${newRW.nomorRw}`);
  };

  const updateRW = (id: string, updated: Partial<RWInfo>) => {
    setRwList(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    logAudit('Wilayah Administrasi', 'Update RW', `Memperbarui data RW ID ${id}`);
  };

  const deleteRW = (id: string) => {
    setRwList(prev => prev.filter(r => r.id !== id));
    logAudit('Wilayah Administrasi', 'Hapus RW', `Menghapus RW ID ${id}`);
  };

  const addRT = (rt: Omit<RTInfo, 'id'>) => {
    const newRT: RTInfo = {
      ...rt,
      id: 'RT-' + String(rtList.length + 1).padStart(3, '0')
    };
    setRtList(prev => [...prev, newRT]);
    logAudit('Wilayah Administrasi', 'Tambah RT', `Menambahkan RT ${newRT.nomorRt}`);
  };

  const updateRT = (id: string, updated: Partial<RTInfo>) => {
    setRtList(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    logAudit('Wilayah Administrasi', 'Update RT', `Memperbarui data RT ID ${id}`);
  };

  const deleteRT = (id: string) => {
    setRtList(prev => prev.filter(r => r.id !== id));
    logAudit('Wilayah Administrasi', 'Hapus RT', `Menghapus RT ID ${id}`);
  };

  // Assistance Handlers
  const addAssistance = (item: Omit<AssistanceRecipient, 'id'>) => {
    const newItem: AssistanceRecipient = {
      ...item,
      id: 'BS-' + String(assistance.length + 1).padStart(3, '0')
    };
    setAssistance(prev => [newItem, ...prev]);
    logAudit('Penerimaan Bantuan', 'Tambah Penerima', `Menambahkan ${newItem.namaPenerima} sebagai penerima ${newItem.jenisBantuan}`);
  };

  const updateAssistance = (id: string, item: Partial<AssistanceRecipient>) => {
    setAssistance(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));
    logAudit('Penerimaan Bantuan', 'Update Status', `Memperbarui data penerima bantuan ID ${id}`);
  };

  const deleteAssistance = (id: string) => {
    setAssistance(prev => prev.filter(a => a.id !== id));
    logAudit('Penerimaan Bantuan', 'Hapus Penerima', `Menghapus penerima bantuan ID ${id}`);
  };

  // Organization Handlers
  const addOrganization = (org: Omit<VillageOrganization, 'id'>) => {
    const newOrg: VillageOrganization = {
      ...org,
      id: 'ORG-' + String(organizations.length + 1).padStart(3, '0')
    };
    setOrganizations(prev => [newOrg, ...prev]);
    logAudit('Organisasi Desa', 'Tambah Organisasi', `Menambahkan organisasi ${newOrg.namaOrganisasi}`);
  };

  const updateOrganization = (id: string, org: Partial<VillageOrganization>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...org } : o));
    logAudit('Organisasi Desa', 'Update Organisasi', `Memperbarui organisasi ID ${id}`);
  };

  const deleteOrganization = (id: string) => {
    setOrganizations(prev => prev.filter(o => o.id !== id));
    logAudit('Organisasi Desa', 'Hapus Organisasi', `Menghapus organisasi ID ${id}`);
  };

  // Agenda Handlers
  const addAgenda = (agenda: Omit<VillageAgenda, 'id' | 'createdAt'>) => {
    const newAgenda: VillageAgenda = {
      ...agenda,
      id: 'AGD-' + String(agendas.length + 1).padStart(3, '0'),
      createdAt: new Date().toLocaleString('id-ID')
    };
    setAgendas(prev => [newAgenda, ...prev]);
    logAudit('Agenda Desa', 'Tambah Agenda', `Jadwal baru: ${newAgenda.namaKegiatan} tanggal ${newAgenda.tanggal}`);
    addNotification('Agenda Desa Baru', `${newAgenda.namaKegiatan} - ${newAgenda.tanggal}`, 'info', 'calendar');
  };

  const updateAgenda = (id: string, agenda: Partial<VillageAgenda>) => {
    setAgendas(prev => prev.map(a => a.id === id ? { ...a, ...agenda } : a));
    logAudit('Agenda Desa', 'Update Agenda', `Memperbarui agenda ID ${id}`);
  };

  const deleteAgenda = (id: string) => {
    setAgendas(prev => prev.filter(a => a.id !== id));
    logAudit('Agenda Desa', 'Hapus Agenda', `Menghapus agenda ID ${id}`);
  };

  // Google Apps Script URL State
  const [appsScriptUrl, setAppsScriptUrlState] = useState<string>(() => {
    return localStorage.getItem('sipadu_apps_script_url') || "https://script.google.com/macros/s/AKfycbzFhnDIKQTn_q0spvNzTB4xCsqJUTc7R3c3QecjvQwH8vLGwGIygncqA53DzhM7DAsH/exec";
  });

  const setAppsScriptUrl = (url: string) => {
    setAppsScriptUrlState(url);
    localStorage.setItem('sipadu_apps_script_url', url);
  };

  const fetchFromAppsScript = async (sheetName: string = 'Data Penduduk') => {
    try {
      const res = await fetch(`/api/apps-script/fetch?url=${encodeURIComponent(appsScriptUrl)}&sheet=${encodeURIComponent(sheetName)}`);
      const result = await res.json();
      if (result.success && result.data) {
        logAudit('Google Apps Script', 'Import Data', `Berhasil mengambil data dari sheet ${sheetName}`);
        
        // If sheet is Data Penduduk and contains items, update residents state
        if (sheetName === 'Data Penduduk' && Array.isArray(result.data.data) && result.data.data.length > 0) {
          const mappedResidents = result.data.data.map((item: any, idx: number) => ({
            id: item.nik || `res-gas-${idx}`,
            nik: String(item.nik || item.nik_ || `320112${100000 + idx}`),
            noKk: String(item.no_kk || item.nokk || '3201121005100001'),
            namaLengkap: item.nama_lengkap || item.namalengkap || item.nama || 'Warga Desa',
            namaAyah: item.nama_ayah || item.namaayah || item.ayah || '',
            namaIbu: item.nama_ibu || item.namaibu || item.ibu || '',
            tempatLahir: item.tempat_lahir || item.tempatlahir || 'Bogor',
            tanggalLahir: item.tanggal_lahir || item.tanggallahir || '1990-01-01',
            jenisKelamin: item.jenis_kelamin || item.jeniskelamin || 'Laki-laki',
            agama: item.agama || 'Islam',
            pendidikan: item.pendidikan || 'SMA/Sederajat',
            pekerjaan: item.pekerjaan || 'Wiraswasta',
            statusPerkawinan: item.status_perkawinan || item.statusperkawinan || 'Kawin',
            golonganDarah: item.golongan_darah || item.golongandarah || 'O',
            dusun: item.dusun || 'Dusun 1 Krajan',
            rw: item.rw || 'RW 01',
            rt: item.rt || 'RT 01',
            alamatLengkap: item.alamat_lengkap || item.alamat || 'Jl. Desa Utama No. 12',
            statusPenduduk: item.status_penduduk || item.statuspenduduk || 'Tetap',
            statusSosialEkonomi: item.status_sosial_ekonomi || item.statussosialekonomi || 'Mampu',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          setResidents(mappedResidents);
          localStorage.setItem('sipadu_residents', JSON.stringify(mappedResidents));
        }

        return { 
          success: true, 
          data: result.data.data || [], 
          message: `Berhasil mengambil ${result.data.total || (result.data.data ? result.data.data.length : 0)} baris data dari Google Sheets!` 
        };
      }
      return { success: false, message: result.error || 'Gagal mengambil data dari Google Apps Script' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal tersambung ke Apps Script API' };
    }
  };

  const sendToAppsScript = async (sheetName: string, data: any, action: string = 'overwrite') => {
    try {
      const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
      const rows = Array.isArray(data) ? data.map(item => Object.values(item)) : [];

      const payload = {
        sheetName,
        action,
        headers,
        rows,
        data
      };

      const res = await fetch('/api/apps-script/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptUrl: appsScriptUrl, payload })
      });
      const result = await res.json();
      if (result.success) {
        logAudit('Google Apps Script', 'Export Data', `Mengirim data ${sheetName} ke Google Sheets via Apps Script`);
        return { success: true, message: `Data ${sheetName} berhasil dikirim ke Google Sheets (Apps Script)!` };
      }
      return { success: false, message: result.error || 'Gagal mengirim data ke Google Apps Script' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal tersambung ke Apps Script API' };
    }
  };

  // Google Sync Services
  const syncModuleToGoogleSheets = async (moduleName: string, data: any) => {
    try {
      const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
      const rows = Array.isArray(data) ? data.map(item => Object.values(item)) : [];

      const res = await fetch('/api/google/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleName, data, headers, rows, scriptUrl: appsScriptUrl })
      });
      const result = await res.json();
      if (result.success) {
        logAudit('Google Workspace', 'Export Sheets', `Menyinkronkan data ${moduleName} ke Google Sheets`);
      }
      return result;
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal tersambung ke Google Sheets server' };
    }
  };

  const backupToGoogleDrive = async () => {
    try {
      const payload = {
        residents,
        familyCards,
        mutations,
        assistance,
        organizations,
        agendas,
        auditLogs
      };
      const res = await fetch('/api/google/drive/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupType: 'FULL_SIPADU_SYSTEM', payload })
      });
      const result = await res.json();
      if (result.success) {
        logAudit('Google Workspace', 'Backup Drive', `Menyimpan berkas cadangan JSON ke Google Drive`);
      }
      return result;
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal menyimpan backup ke Google Drive' };
    }
  };

  const resetDataToDefault = () => {
    localStorage.clear();
    setResidents(INITIAL_RESIDENTS);
    setFamilyCards(INITIAL_FAMILY_CARDS);
    setMutations(INITIAL_MUTATIONS);
    setAssistance(INITIAL_ASSISTANCE);
    setOrganizations(INITIAL_ORGANIZATIONS);
    setAgendas(INITIAL_AGENDAS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    logAudit('Sistem', 'Reset Data', 'Mengembalikan seluruh data simulasi ke awal.');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUserRole,
        setCurrentUserRole,
        currentUserName,
        villageConfig,
        updateVillageConfig,
        residents,
        familyCards,
        mutations,
        assistance,
        dusunList,
        rwList,
        rtList,
        organizations,
        agendas,
        auditLogs,
        notifications,
        googleStatus,
        appsScriptUrl,
        setAppsScriptUrl,
        fetchFromAppsScript,
        sendToAppsScript,
        addResident,
        updateResident,
        deleteResident,
        addFamilyCard,
        updateFamilyCard,
        deleteFamilyCard,
        addMutation,
        updateMutation,
        deleteMutation,
        addDusun,
        updateDusun,
        deleteDusun,
        addRW,
        updateRW,
        deleteRW,
        addRT,
        updateRT,
        deleteRT,
        addAssistance,
        updateAssistance,
        deleteAssistance,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        addAgenda,
        updateAgenda,
        deleteAgenda,
        logAudit,
        markNotificationRead,
        syncModuleToGoogleSheets,
        backupToGoogleDrive,
        resetDataToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
