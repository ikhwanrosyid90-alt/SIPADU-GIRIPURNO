import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function normalizeDateToYYYYMMDD(val: any): string {
  if (!val) return '1990-01-01';
  const str = String(val).trim();
  if (!str) return '1990-01-01';

  // 1. ISO string with T (e.g., 1993-06-18T17:00:00.000Z or 1993-06-18T00:00:00)
  if (str.includes('T')) {
    const parts = str.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(parts)) {
      return parts;
    }
  }

  // 2. YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // 3. DD/MM/YYYY or DD-MM-YYYY or D/M/YYYY or D-M-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 4. YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 5. Excel serial number check (e.g. 34138)
  const num = Number(str);
  if (!isNaN(num) && num > 1000 && num < 100000) {
    const excelEpoch = new Date(1899, 11, 30);
    const dateFromExcel = new Date(excelEpoch.getTime() + num * 86400000);
    const yyyy = dateFromExcel.getFullYear();
    const mm = String(dateFromExcel.getMonth() + 1).padStart(2, '0');
    const dd = String(dateFromExcel.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 6. Generic JS Date parsing fallback
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    if (yyyy > 1900 && yyyy < 2100) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  return '1990-01-01';
}

export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const cleanDateStr = normalizeDateToYYYYMMDD(birthDateString);
  const today = new Date();
  const birthDate = new Date(cleanDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

export type AgeCategory = 'Bayi' | 'Balita' | 'Remaja' | 'Dewasa' | 'Lansia';

export function getAgeCategory(age: number): AgeCategory {
  if (age <= 1) return 'Bayi';
  if (age <= 5) return 'Balita';
  if (age <= 17) return 'Remaja';
  if (age <= 59) return 'Dewasa';
  return 'Lansia';
}

export function formatRupiah(amount: number): string {
  if (!amount && amount !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Export array of objects to Excel
export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// Export simple table to PDF
export function exportTableToPDF(title: string, headers: string[], rows: any[][], fileName: string, villageConfig?: any) {
  const doc = new jsPDF('landscape');
  
  const kab = villageConfig?.kabupaten ? villageConfig.kabupaten.toUpperCase() : 'BOGOR';
  const kec = villageConfig?.kecamatan ? villageConfig.kecamatan.toUpperCase() : 'CIBINONG';
  const desa = villageConfig?.namaDesa ? villageConfig.namaDesa.toUpperCase() : 'GIRIPURNO';
  const alamat = villageConfig?.alamatKantor || 'Jl. Raya Desa No. 01';
  const email = villageConfig?.emailDesa || 'admin@desa.id';

  // Header Kop Surat
  doc.setFontSize(16);
  doc.text(`PEMERINTAH KABUPATEN ${kab}`, 14, 15);
  doc.setFontSize(14);
  doc.text(`KECAMATAN ${kec} - DESA ${desa}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`${alamat} | Email: ${email}`, 14, 27);
  doc.line(14, 29, 280, 29);

  doc.setFontSize(14);
  doc.text(title.toUpperCase(), 14, 38);
  doc.setFontSize(9);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 43);

  autoTable(doc, {
    startY: 47,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 }, // Navy Blue
    styles: { fontSize: 8, cellPadding: 2 }
  });

  doc.save(`${fileName}_${new Date().toISOString().slice(0,10)}.pdf`);
}

export function formatResidentForSheet(res: any) {
  const cleanTanggalLahir = normalizeDateToYYYYMMDD(res.tanggalLahir);
  return {
    NIK: String(res.nik || ''),
    NO_KK: String(res.noKk || ''),
    NAMA_LGKP: String(res.namaLengkap || ''),
    JENIS_KELAMIN: String(res.jenisKelamin || 'Laki-laki'),
    TANGGAL_LAHIR: cleanTanggalLahir,
    UMUR: calculateAge(cleanTanggalLahir),
    TEMPAT_LAHIR: String(res.tempatLahir || ''),
    ALAMAT: String(res.alamatLengkap || ''),
    NO_RT: String(res.rt || '001'),
    NO_RW: String(res.rw || '001'),
    SHDK: String(res.shdk || 'Kepala Keluarga'),
    STATUS_KAWIN: String(res.statusPerkawinan || 'Belum Kawin'),
    PENDIDIKAN: String(res.pendidikan || 'SMA/Sederajat'),
    AGAMA: String(res.agama || 'Islam'),
    PEKERJAAN: String(res.pekerjaan || 'Wiraswasta'),
    AKTA_LAHIR: String(res.aktaLahir || 'Ada'),
    NO_AKTA_LAHIR: String(res.noAktaLahir || ''),
    AKTA_KAWIN: String(res.aktaKawin || 'Tidak'),
    NO_AKTA_KAWIN: String(res.noAktaKawin || ''),
    AKTA_CERAI: String(res.aktaCerai || 'Tidak'),
    NO_AKTA_CERAI: String(res.noAktaCerai || ''),
    NAMA_AYAH: String(res.namaAyah || ''),
    NAMA_IBU: String(res.namaIbu || ''),
    DUSUN: String(res.dusun || ''),
    GOLONGAN_DARAH: String(res.golonganDarah || 'O'),
    STATUS_PENDUDUK: String(res.statusTinggal || 'Tetap'),
    STATUS_SOSIAL_EKONOMI: res.isMiskin ? 'Rentan/Miskin' : 'Mampu',
    NO_HP: String(res.noHp || ''),
    EMAIL: String(res.email || ''),
    STATUS_AKTIF: String(res.statusAktif || 'Aktif')
  };
}
