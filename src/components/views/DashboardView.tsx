import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAge, getAgeCategory, formatRupiah } from '../../utils/helpers';
import { 
  Users, 
  FileSpreadsheet, 
  UserCheck, 
  Baby, 
  Smile, 
  User, 
  HeartHandshake, 
  TrendingUp, 
  AlertCircle, 
  Gift, 
  Building2, 
  ArrowUpRight, 
  Calendar,
  Layers,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface DashboardViewProps {
  onOpenPrintModal: () => void;
  onOpenGoogleModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenPrintModal, onOpenGoogleModal }) => {
  const { residents, familyCards, mutations, assistance, dusunList, agendas, setActiveView, villageConfig } = useApp();

  // Metrics calculation
  const totalPenduduk = residents.length;
  const totalKK = familyCards.length;
  const totalLaki = residents.filter(r => r.jenisKelamin === 'Laki-laki').length;
  const totalPerempuan = residents.filter(r => r.jenisKelamin === 'Perempuan').length;

  // Demografi Umur
  let totalBayi = 0;   // <= 1
  let totalBalita = 0; // 2-5
  let totalRemaja = 0; // 6-17
  let totalDewasa = 0; // 18-59
  let totalLansia = 0; // >= 60

  residents.forEach(r => {
    const age = calculateAge(r.tanggalLahir);
    const cat = getAgeCategory(age);
    if (cat === 'Bayi') totalBayi++;
    if (cat === 'Balita') totalBalita++;
    if (cat === 'Remaja') totalRemaja++;
    if (cat === 'Dewasa') totalDewasa++;
    if (cat === 'Lansia') totalLansia++;
  });

  const totalMiskin = residents.filter(r => r.isMiskin).length;
  const totalPenerimaBantuan = assistance.filter(a => a.statusAktif).length;

  // Chart Data: Demografi Umur
  const ageData = [
    { name: 'Bayi (0-1 th)', value: totalBayi, color: '#10B981' },
    { name: 'Balita (2-5 th)', value: totalBalita, color: '#06B6D4' },
    { name: 'Remaja (6-17 th)', value: totalRemaja, color: '#3B82F6' },
    { name: 'Dewasa (18-59 th)', value: totalDewasa, color: '#6366F1' },
    { name: 'Lansia (60+ th)', value: totalLansia, color: '#8B5CF6' }
  ];

  // Chart Data: Pertumbuhan & Mutasi Bulanan
  const growthData = [
    { bulan: 'Jan', Penduduk: totalPenduduk - 15, Kelahiran: 3, Kematian: 1, Datang: 4, Pindah: 2 },
    { bulan: 'Feb', Penduduk: totalPenduduk - 11, Kelahiran: 2, Kematian: 1, Datang: 3, Pindah: 0 },
    { bulan: 'Mar', Penduduk: totalPenduduk - 7, Kelahiran: 4, Kematian: 0, Datang: 2, Pindah: 1 },
    { bulan: 'Apr', Penduduk: totalPenduduk - 4, Kelahiran: 1, Kematian: 2, Datang: 5, Pindah: 1 },
    { bulan: 'Mei', Penduduk: totalPenduduk - 1, Kelahiran: 3, Kematian: 1, Datang: 2, Pindah: 1 },
    { bulan: 'Jun', Penduduk: totalPenduduk, Kelahiran: 2, Kematian: 0, Datang: 1, Pindah: 0 }
  ];

  // Chart Data: Distribution per Dusun
  const dusunStatsData = dusunList.map(d => {
    const resDusunCount = residents.filter(r => r.dusun === d.namaDusun).length;
    const kkDusunCount = familyCards.filter(f => f.dusun === d.namaDusun).length;
    return {
      dusun: d.namaDusun.replace('Dusun ', ''),
      Penduduk: resDusunCount > 0 ? resDusunCount : d.jumlahPenduduk,
      KartuKeluarga: kkDusunCount > 0 ? kkDusunCount : d.jumlahKk
    };
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            SIPADU Dukcapil Desa {villageConfig.namaDesa || 'Sukamaju'} Real-time
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Dashboard Administrasi & Demografi Desa {villageConfig.namaDesa}</h2>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Sistem terintegrasi pengelolaan data kependudukan, kartu keluarga, mutasi penduduk, bantuan sosial, wilayah, organisasi, dan agenda kegiatan desa.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={onOpenPrintModal}
            className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            Cetak Dokumen / Surat
          </button>
          <button
            onClick={onOpenGoogleModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            Export Google Sheets
          </button>
        </div>
      </div>

      {/* Row 1: Primary Key Metrics (High Density Theme Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Penduduk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide">Total Penduduk</p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-black text-[#1E3A8A]">{totalPenduduk}</h2>
            <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +12 Bln Ini
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Jiwa terdaftar di database Dukcapil</p>
        </div>

        {/* Card 2: Jumlah KK */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide">Kepala Keluarga (KK)</p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-black text-[#1E3A8A]">{totalKK}</h2>
            <span className="text-blue-700 text-[10px] font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              KK Aktif
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Terbit KK Resmi Kabupaten {villageConfig.kabupaten || 'Bogor'}</p>
        </div>

        {/* Card 3: Gender Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide">Laki-Laki / Perempuan</p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-black text-[#1E3A8A]">
              {totalLaki} <span className="font-thin text-slate-300">/</span> {totalPerempuan}
            </h2>
            <div className="flex h-2 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0">
              <div className="bg-blue-500" style={{ width: `${totalPenduduk > 0 ? (totalLaki / totalPenduduk) * 100 : 50}%` }}></div>
              <div className="bg-pink-500" style={{ width: `${totalPenduduk > 0 ? (totalPerempuan / totalPenduduk) * 100 : 50}%` }}></div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Rasio gender seimbang 50:50</p>
        </div>

        {/* Card 4: Penerima Bantuan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide">Penerima Bantuan</p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-black text-amber-600">{totalPenerimaBantuan}</h2>
            <span className="text-slate-500 text-[10px] font-semibold">
              {totalPenduduk > 0 ? ((totalPenerimaBantuan / totalPenduduk) * 100).toFixed(1) : 0}% Pop
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Penerima PKH, BLT-DD, BPNT & Rice</p>
        </div>
      </div>

      {/* Row 2: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Growth & Mutation Trends */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Grafik Pertumbuhan & Mutasi Penduduk Desa</h3>
              <p className="text-xs text-slate-500">Tren Kelahiran, Kematian, Pendatang, dan Pindah Penduduk</p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
              Tahun 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPenduduk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Penduduk" stroke="#2563EB" fillOpacity={1} fill="url(#colorPenduduk)" strokeWidth={2} />
                <Bar dataKey="Kelahiran" fill="#10B981" />
                <Bar dataKey="Kematian" fill="#EF4444" />
                <Bar dataKey="Datang" fill="#3B82F6" />
                <Bar dataKey="Pindah" fill="#F59E0B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Age Pyramid Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Demografi Rentang Umur</h3>
            <p className="text-xs text-slate-500">Distribusi Bayi, Balita, Remaja, Dewasa, Lansia</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {ageData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Regional Stats & Upcoming Agendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Breakdown per Dusun */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Statistik Kependudukan per Dusun</h3>
              <p className="text-xs text-slate-500">Perbandingan Jumlah Penduduk dan Kartu Keluarga per Dusun</p>
            </div>
            <button
              onClick={() => setActiveView('region')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Lihat Detail Wilayah <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dusunStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dusun" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Penduduk" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="KartuKeluarga" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Village Agendas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Agenda Kegiatan Desa Mendatang</h3>
              <p className="text-xs text-slate-500">Jadwal Musyawarah, Gotong Royong, Posyandu</p>
            </div>
            <button
              onClick={() => setActiveView('agenda')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Kelola Agenda <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {agendas.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      {a.jenisKegiatan}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{a.tanggal} ({a.waktuMulai} WIB)</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{a.namaKegiatan}</h4>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {a.lokasi} ({a.dusun})
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-bold shrink-0 ${
                  a.statusKegiatan === 'Rencana' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {a.statusKegiatan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
