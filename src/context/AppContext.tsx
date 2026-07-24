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
  VillageConfig,
  ActiveStatus
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
import { formatResidentForSheet, normalizeDateToYYYYMMDD } from '../utils/helpers';

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
  lastSyncedTime: string;
  isAutoSyncActive: boolean;
  setIsAutoSyncActive: (active: boolean) => void;
  
  appsScriptUrl: string;
  setAppsScriptUrl: (url: string) => void;
  fetchFromAppsScript: (sheetName?: string) => Promise<{ success: boolean; data?: any[]; message: string }>;
  sendToAppsScript: (sheetName: string, data: any, action?: string) => Promise<{ success: boolean; message: string }>;
  
  // Handlers
  addResident: (resident: Omit<Resident, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Resident;
  updateResident: (id: string, resident: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  bulkDeleteResidents: (ids: string[]) => void;
  bulkUpdateStatusResidents: (ids: string[], status: ActiveStatus) => void;
  
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
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => new Date().toLocaleTimeString('id-ID'));
  const [isAutoSyncActive, setIsAutoSyncActive] = useState<boolean>(true);

  // Automatic KK synchronization whenever residents change
  useEffect(() => {
    if (!residents || residents.length === 0) return;

    setFamilyCards(prevCards => {
      const kkMap = new Map<string, Resident[]>();
      residents.forEach(r => {
        if (!r.noKk) return;
        const cleanKk = String(r.noKk).trim();
        if (!cleanKk) return;
        if (!kkMap.has(cleanKk)) {
          kkMap.set(cleanKk, []);
        }
        kkMap.get(cleanKk)!.push(r);
      });

      const updatedCards: FamilyCard[] = [];

      kkMap.forEach((members, noKk) => {
        const existing = prevCards.find(k => String(k.noKk).trim() === noKk);
        
        // Find kepala keluarga (SHDK includes 'KEPALA' or existing head or first member)
        const head = members.find(r => 
          (r.shdk && String(r.shdk).toUpperCase().includes('KEPALA')) ||
          (existing && r.id === existing.headResidentId)
        ) || members[0];

        const mappedMembers = members.map(m => ({
          residentId: m.id,
          nik: m.nik,
          namaLengkap: m.namaLengkap,
          hubunganKeluarga: (m.shdk || 'Anggota Keluarga') as any,
          jenisKelamin: m.jenisKelamin,
          tanggalLahir: m.tanggalLahir
        }));

        if (existing) {
          updatedCards.push({
            ...existing,
            headResidentId: head?.id || existing.headResidentId,
            namaKepalaKeluarga: head?.namaLengkap || existing.namaKepalaKeluarga,
            alamatLengkap: head?.alamatLengkap || members[0]?.alamatLengkap || existing.alamatLengkap,
            rt: head?.rt || members[0]?.rt || existing.rt,
            rw: head?.rw || members[0]?.rw || existing.rw,
            dusun: head?.dusun || members[0]?.dusun || existing.dusun,
            members: mappedMembers
          });
        } else {
          updatedCards.push({
            id: 'KK-' + noKk,
            noKk,
            headResidentId: head?.id || '',
            namaKepalaKeluarga: head?.namaLengkap || 'Belum Ditentukan',
            alamatLengkap: head?.alamatLengkap || members[0]?.alamatLengkap || 'Jl. Desa Utama',
            rt: head?.rt || members[0]?.rt || '001',
            rw: head?.rw || members[0]?.rw || '001',
            dusun: head?.dusun || members[0]?.dusun || '',
            tanggalPenerbitan: new Date().toISOString().slice(0, 10),
            members: mappedMembers,
            history: [
              {
                id: 'HKK-' + Date.now(),
                timestamp: new Date().toLocaleString('id-ID'),
                user: 'Sistem Sinkronisasi',
                role: 'Otomatis',
                action: 'Tambah',
                notes: 'Penerbitan KK otomatis dari data penduduk'
              }
            ]
          });
        }
      });

      return updatedCards;
    });
  }, [residents]);

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

  const bulkDeleteResidents = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    setResidents(prev => prev.filter(r => !ids.includes(r.id)));
    logAudit('Data Penduduk', 'Hapus Sekaligus', `Menghapus ${ids.length} data penduduk sekaligus`);
    addNotification('Hapus Massal Penduduk', `${ids.length} data penduduk telah dihapus.`, 'warning', 'resident');
  };

  const bulkUpdateStatusResidents = (ids: string[], newStatus: ActiveStatus) => {
    if (!ids || ids.length === 0) return;
    const now = new Date().toISOString();
    setResidents(prev => prev.map(r => {
      if (ids.includes(r.id)) {
        const updated = { ...r, statusAktif: newStatus, updatedAt: now };
        updated.history = [
          {
            id: 'H-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            timestamp: new Date().toLocaleString('id-ID'),
            user: currentUserName,
            role: currentUserRole,
            action: 'Edit Massal',
            notes: `Mengubah status aktif menjadi ${newStatus}`
          },
          ...(r.history || [])
        ];
        return updated;
      }
      return r;
    }));
    logAudit('Data Penduduk', 'Update Status Massal', `Mengubah status aktif ${ids.length} penduduk menjadi ${newStatus}`);
    addNotification('Status Massal Diperbarui', `Status aktif ${ids.length} data penduduk diubah menjadi ${newStatus}.`, 'success', 'resident');
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
        
        let rows = Array.isArray(result.data.data) ? result.data.data : (Array.isArray(result.data) ? result.data : []);

        if (sheetName === 'Data Penduduk' && rows.length > 0) {
          const mappedResidents = rows.map((item: any, idx: number) => {
            const getVal = (...keys: string[]) => {
              for (const k of keys) {
                if (item[k] !== undefined && item[k] !== null && String(item[k]).trim() !== '') return String(item[k]);
                const lowerK = k.toLowerCase().replace(/_/g, '');
                for (const itemKey of Object.keys(item)) {
                  if (itemKey.toLowerCase().replace(/_/g, '') === lowerK && item[itemKey] !== undefined && item[itemKey] !== null && String(item[itemKey]).trim() !== '') {
                    return String(item[itemKey]);
                  }
                }
              }
              return '';
            };

            const nik = getVal('NIK', 'nik') || `320112${10000000 + idx}`;
            const noKk = getVal('NO_KK', 'no_kk', 'nokk') || '3201121005100001';
            const namaLengkap = getVal('NAMA_LGKP', 'nama_lengkap', 'namalengkap', 'nama') || 'Warga Desa';
            const jenisKelamin = getVal('JENIS_KELAMIN', 'jenis_kelamin', 'jeniskelamin') || 'Laki-laki';
            const rawTanggalLahir = getVal('TANGGAL_LAHIR', 'tanggal_lahir', 'tanggallahir') || '1990-01-01';
            const tanggalLahir = normalizeDateToYYYYMMDD(rawTanggalLahir);
            const tempatLahir = getVal('TEMPAT_LAHIR', 'tempat_lahir', 'tempatlahir') || 'Bogor';
            const alamatLengkap = getVal('ALAMAT', 'alamat_lengkap', 'alamat') || 'Jl. Desa Utama No. 12';
            const rt = getVal('NO_RT', 'rt') || '001';
            const rw = getVal('NO_RW', 'rw') || '001';
            const shdk = getVal('SHDK', 'status_hubungan_keluarga', 'shdk') || 'Kepala Keluarga';
            const statusPerkawinan = getVal('STATUS_KAWIN', 'status_perkawinan', 'statuskawin') || 'Kawin';
            const pendidikan = getVal('PENDIDIKAN', 'pendidikan') || 'SMA/Sederajat';
            const agama = getVal('AGAMA', 'agama') || 'Islam';
            const pekerjaan = getVal('PEKERJAAN', 'pekerjaan') || 'Wiraswasta';
            const aktaLahir = getVal('AKTA_LAHIR', 'akta_lahir') || 'Ada';
            const noAktaLahir = getVal('NO_AKTA_LAHIR', 'no_akta_lahir') || '';
            const aktaKawin = getVal('AKTA_KAWIN', 'akta_kawin') || 'Tidak';
            const noAktaKawin = getVal('NO_AKTA_KAWIN', 'no_akta_kawin') || '';
            const aktaCerai = getVal('AKTA_CERAI', 'akta_cerai') || 'Tidak';
            const noAktaCerai = getVal('NO_AKTA_CERAI', 'no_akta_cerai') || '';
            const namaAyah = getVal('NAMA_AYAH', 'nama_ayah', 'ayah') || '';
            const namaIbu = getVal('NAMA_IBU', 'nama_ibu', 'ibu') || '';
            const dusun = getVal('DUSUN', 'dusun') || 'Dusun Suka Makmur';
            const golonganDarah = getVal('GOLONGAN_DARAH', 'golongan_darah') || 'O';
            const statusPenduduk = getVal('STATUS_PENDUDUK', 'status_penduduk', 'status_tinggal') || 'Tetap';
            const statusSosial = getVal('STATUS_SOSIAL_EKONOMI', 'status_sosial_ekonomi');
            const isMiskin = statusSosial.toLowerCase().includes('miskin') || getVal('isMiskin') === 'true';
            const noHp = getVal('NO_HP', 'no_hp', 'nohp') || '';
            const email = getVal('EMAIL', 'email') || '';
            const statusAktif = getVal('STATUS_AKTIF', 'status_aktif') || 'Aktif';

            return {
              id: nik ? `RES-${nik}` : `res-gas-${idx}`,
              nik,
              noKk,
              namaLengkap,
              namaAyah,
              namaIbu,
              tempatLahir,
              tanggalLahir,
              jenisKelamin: (jenisKelamin.toLowerCase().includes('p') && !jenisKelamin.toLowerCase().includes('laki')) ? 'Perempuan' : 'Laki-laki',
              agama: agama as any,
              pendidikan: pendidikan as any,
              pekerjaan: pekerjaan as any,
              statusPerkawinan: statusPerkawinan as any,
              golonganDarah: golonganDarah as any,
              kewarganegaraan: 'WNI',
              shdk,
              aktaLahir,
              noAktaLahir,
              aktaKawin,
              noAktaKawin,
              aktaCerai,
              noAktaCerai,
              noHp,
              email,
              alamatLengkap,
              rt,
              rw,
              dusun,
              statusTinggal: statusPenduduk as any,
              statusAktif: statusAktif as any,
              isMiskin,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

          setResidents(mappedResidents);
          localStorage.setItem('sipadu_residents', JSON.stringify(mappedResidents));
          setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));
        }

        return { 
          success: true, 
          data: rows, 
          message: `Berhasil mengambil ${rows.length} baris data dari Google Sheets!` 
        };
      }
      return { success: false, message: result.error || 'Gagal mengambil data dari Google Apps Script' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal tersambung ke Apps Script API' };
    }
  };

  const sendToAppsScript = async (sheetName: string = 'Data Penduduk', customData?: any) => {
    try {
      const rawData = customData || residents;
      const formattedData = sheetName === 'Data Penduduk' && Array.isArray(rawData) 
        ? rawData.map(formatResidentForSheet)
        : rawData;

      const headers = Array.isArray(formattedData) && formattedData.length > 0 ? Object.keys(formattedData[0]) : [];
      const rows = Array.isArray(formattedData) ? formattedData.map(item => Object.values(item)) : [];

      const payload = {
        sheetName,
        action: 'overwrite',
        headers,
        rows,
        data: formattedData
      };

      const res = await fetch('/api/apps-script/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptUrl: appsScriptUrl, payload })
      });
      const result = await res.json();
      if (result.success) {
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));
        logAudit('Google Apps Script', 'Export Data', `Mengirim ${formattedData.length} data ${sheetName} ke Google Sheets via Apps Script`);
        return { success: true, message: `Data ${sheetName} (${formattedData.length} baris) berhasil disimpan ke Google Sheets!` };
      }
      return { success: false, message: result.error || 'Gagal mengirim data ke Google Apps Script' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal tersambung ke Apps Script API' };
    }
  };

  // Real-time background sync interval (polls Apps Script every 20 seconds for multi-device sync)
  useEffect(() => {
    if (!isAutoSyncActive || !appsScriptUrl) return;

    const intervalId = setInterval(() => {
      fetchFromAppsScript('Data Penduduk');
    }, 20000);

    return () => clearInterval(intervalId);
  }, [isAutoSyncActive, appsScriptUrl]);

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
        lastSyncedTime,
        isAutoSyncActive,
        setIsAutoSyncActive,
        appsScriptUrl,
        setAppsScriptUrl,
        fetchFromAppsScript,
        sendToAppsScript,
        addResident,
        updateResident,
        deleteResident,
        bulkDeleteResidents,
        bulkUpdateStatusResidents,
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
