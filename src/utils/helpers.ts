import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
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
