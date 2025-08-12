# Material Management Application

## Cara Menggunakan Aplikasi

### Versi React (Rekomendasi)
Gunakan React version untuk development dan production:
- **Entry point**: `/App.tsx`
- **Main component**: `/components/MaterialManagementApp.tsx`

### Versi HTML (Single File)
Untuk demo atau deployment sederhana:
- **File utama**: `/material-management-complete.html`

## File yang TIDAK DIGUNAKAN

❌ **Jangan gunakan file-file ini** (sudah outdated):
- `/material-management.html` - versi lama
- `/material-management.html.bak` - backup file
- `/js/` folder - modular JS version yang sudah tidak diperlukan
- `/index.html` - hanya untuk React

## Fitur Lengkap

Kedua versi (React & HTML) memiliki fitur yang sama:

### ✅ **5 Tabs Navigation**
1. **Dashboard** - Analytics & monitoring
2. **Materials** - Material management (default tab)
3. **History** - Transaction history
4. **ADGI** - Material withdrawal tracking dengan status management
5. **Excel Database** - Auto-sync & manual export

### ✅ **Material Management**
- Simplified take/fill dialogs
- Confirmation popup untuk setiap transaksi
- Real-time bin status monitoring
- Search & filter materials

### ✅ **ADGI Management**
- Tracking pengambilan material
- Status toggle: "ADGI Pending" ↔ "ADGI Done"
- Filter berdasarkan status
- Real-time statistics

### ✅ **Excel Integration**
- Auto-sync (tanpa download file)
- Manual export (Complete Data, Live Snapshot, Template)
- Import dari Excel
- Real-time synchronization

## Teknologi

- **React Version**: React + TypeScript + Tailwind CSS + ShadCN UI
- **HTML Version**: Vanilla JavaScript + Tailwind CSS + Lucide Icons

## Getting Started

1. **Untuk React**: Jalankan development server biasa
2. **Untuk HTML**: Buka `/material-management-complete.html` langsung di browser

---

**Rekomendasi**: Gunakan React version untuk development, HTML version untuk demo/testing.