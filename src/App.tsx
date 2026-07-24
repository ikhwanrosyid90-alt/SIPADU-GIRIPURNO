import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ResidentView } from './components/views/ResidentView';
import { FamilyCardView } from './components/views/FamilyCardView';
import { MutationView } from './components/views/MutationView';
import { AssistanceView } from './components/views/AssistanceView';
import { RegionView } from './components/views/RegionView';
import { OrganizationView } from './components/views/OrganizationView';
import { AgendaView } from './components/views/AgendaView';
import { CalendarView } from './components/views/CalendarView';
import { ReportsView } from './components/views/ReportsView';
import { AuditLogView } from './components/views/AuditLogView';

// Modals
import { ResidentModal } from './components/modals/ResidentModal';
import { FamilyCardModal } from './components/modals/FamilyCardModal';
import { MutationModal } from './components/modals/MutationModal';
import { AssistanceModal } from './components/modals/AssistanceModal';
import { OrganizationModal } from './components/modals/OrganizationModal';
import { AgendaModal } from './components/modals/AgendaModal';
import { PrintDocumentModal } from './components/modals/PrintDocumentModal';
import { GoogleDriveModal } from './components/modals/GoogleDriveModal';
import { ImportExcelModal } from './components/modals/ImportExcelModal';
import { VillageSettingsModal } from './components/modals/VillageSettingsModal';

import { Resident, FamilyCard, AssistanceRecipient, VillageOrganization, VillageAgenda } from './types';

const MainAppContent: React.FC = () => {
  const { activeView } = useApp();

  // Modal States
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [residentToEdit, setResidentToEdit] = useState<Resident | null>(null);

  const [isKkModalOpen, setIsKkModalOpen] = useState(false);
  const [kkToEdit, setKkToEdit] = useState<FamilyCard | null>(null);

  const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);

  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [assistanceToEdit, setAssistanceToEdit] = useState<AssistanceRecipient | null>(null);

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [orgToEdit, setOrgToEdit] = useState<VillageOrganization | null>(null);

  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [agendaToEdit, setAgendaToEdit] = useState<VillageAgenda | null>(null);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string | undefined>(undefined);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printResident, setPrintResident] = useState<Resident | undefined>(undefined);
  const [printKk, setPrintKk] = useState<FamilyCard | undefined>(undefined);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVillageSettingsOpen, setIsVillageSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal Handlers
  const handleOpenAddResident = () => {
    setResidentToEdit(null);
    setIsResidentModalOpen(true);
  };

  const handleEditResident = (r: Resident) => {
    setResidentToEdit(r);
    setIsResidentModalOpen(true);
  };

  const handleOpenAddKk = () => {
    setKkToEdit(null);
    setIsKkModalOpen(true);
  };

  const handleEditKk = (kk: FamilyCard) => {
    setKkToEdit(kk);
    setIsKkModalOpen(true);
  };

  const handleOpenAddAssistance = () => {
    setAssistanceToEdit(null);
    setIsAssistanceModalOpen(true);
  };

  const handleEditAssistance = (a: AssistanceRecipient) => {
    setAssistanceToEdit(a);
    setIsAssistanceModalOpen(true);
  };

  const handleOpenAddOrg = () => {
    setOrgToEdit(null);
    setIsOrgModalOpen(true);
  };

  const handleEditOrg = (o: VillageOrganization) => {
    setOrgToEdit(o);
    setIsOrgModalOpen(true);
  };

  const handleOpenAddAgenda = (dateStr?: string) => {
    setAgendaToEdit(null);
    setSelectedAgendaDate(dateStr);
    setIsAgendaModalOpen(true);
  };

  const handleEditAgenda = (a: VillageAgenda) => {
    setAgendaToEdit(a);
    setSelectedAgendaDate(undefined);
    setIsAgendaModalOpen(true);
  };

  const handleOpenPrintModal = (r?: Resident, kk?: FamilyCard) => {
    setPrintResident(r);
    setPrintKk(kk);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        onOpenVillageSettings={() => setIsVillageSettingsOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenPrintModal={() => handleOpenPrintModal()}
          onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
          onOpenVillageSettings={() => setIsVillageSettingsOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9]">
          {activeView === 'dashboard' && (
            <DashboardView
              onOpenPrintModal={() => handleOpenPrintModal()}
              onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
            />
          )}

          {activeView === 'resident' && (
            <ResidentView
              onOpenAddModal={handleOpenAddResident}
              onEditResident={handleEditResident}
              onOpenPrintModal={(r) => handleOpenPrintModal(r)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
            />
          )}

          {activeView === 'family-card' && (
            <FamilyCardView
              onOpenAddModal={handleOpenAddKk}
              onEditKk={handleEditKk}
              onOpenPrintModal={(kk) => handleOpenPrintModal(undefined, kk)}
            />
          )}

          {activeView === 'mutation' && (
            <MutationView
              onOpenAddModal={() => setIsMutationModalOpen(true)}
            />
          )}

          {activeView === 'assistance' && (
            <AssistanceView
              onOpenAddModal={handleOpenAddAssistance}
              onEditAssistance={handleEditAssistance}
            />
          )}

          {activeView === 'region' && (
            <RegionView />
          )}

          {activeView === 'organization' && (
            <OrganizationView
              onOpenAddModal={handleOpenAddOrg}
              onEditOrg={handleEditOrg}
            />
          )}

          {activeView === 'agenda' && (
            <AgendaView
              onOpenAddModal={handleOpenAddAgenda}
              onEditAgenda={handleEditAgenda}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              onOpenAddModal={handleOpenAddAgenda}
              onEditAgenda={handleEditAgenda}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
              onOpenPrintModal={() => handleOpenPrintModal()}
            />
          )}

          {activeView === 'audit-log' && (
            <AuditLogView />
          )}
        </main>

        {/* Bottom Notifier Bar (High Density Design) */}
        <div className="h-8 bg-slate-200 border-t border-slate-300 flex items-center px-4 justify-between shrink-0 font-sans">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                Pesan Sistem: Sinkronisasi Terpusat Google Workspace & Dukcapil Aktif
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium hidden sm:block">
            © 2026 Dinas Kependudukan dan Catatan Sipil • Desa Sukamaju
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <ResidentModal
        isOpen={isResidentModalOpen}
        onClose={() => setIsResidentModalOpen(false)}
        residentToEdit={residentToEdit}
      />

      <FamilyCardModal
        isOpen={isKkModalOpen}
        onClose={() => setIsKkModalOpen(false)}
        kkToEdit={kkToEdit}
      />

      <MutationModal
        isOpen={isMutationModalOpen}
        onClose={() => setIsMutationModalOpen(false)}
      />

      <AssistanceModal
        isOpen={isAssistanceModalOpen}
        onClose={() => setIsAssistanceModalOpen(false)}
        assistanceToEdit={assistanceToEdit}
      />

      <OrganizationModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        orgToEdit={orgToEdit}
      />

      <AgendaModal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
        agendaToEdit={agendaToEdit}
        initialDate={selectedAgendaDate}
      />

      <PrintDocumentModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        resident={printResident}
        familyCard={printKk}
      />

      <GoogleDriveModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <VillageSettingsModal
        isOpen={isVillageSettingsOpen}
        onClose={() => setIsVillageSettingsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
