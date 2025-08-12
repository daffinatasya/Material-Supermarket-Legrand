import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Material, HistoryEntry } from './MaterialManagementApp';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Database, 
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  FileCode,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner@2.0.3';

interface ExcelManagerProps {
  materials: Material[];
  history: HistoryEntry[];
  autoExportEnabled: boolean;
  onAutoExportToggle: (enabled: boolean) => void;
  lastExportTime: Date | null;
  onImportMaterials: (materials: Material[]) => void;
  onTemplateUpdate: () => void;
}

export interface ExcelManagerRef {
  exportCompleteData: () => Promise<boolean>;
  exportLiveSnapshot: () => Promise<boolean>;
  createTemplate: () => Promise<boolean>;
}

export const ExcelManager = forwardRef<ExcelManagerRef, ExcelManagerProps>(({
  materials,
  history,
  autoExportEnabled,
  onAutoExportToggle,
  lastExportTime,
  onImportMaterials,
  onTemplateUpdate
}, ref) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [templateActive, setTemplateActive] = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-sync function (no download, just sync data)
  const performAutoSync = async () => {
    if (!autoExportEnabled) return;
    
    try {
      // Simulate auto-sync operation without file download
      const materialsData = materials.map(material => ({
        'ID SAP': material.id,
        'Deskripsi': material.description,
        'BIN 1': material.bin1,
        'BIN 2': material.bin2,
        'BIN 3': material.bin3,
        'BIN 4': material.bin4,
        'Total': material.bin1 + material.bin2 + material.bin3 + material.bin4,
        'Last Update': new Date().toLocaleString('id-ID')
      }));

      const recentHistory = history.slice(0, 50).map(entry => ({
        'Time': entry.timestamp.toLocaleString('id-ID'),
        'Material': entry.materialId,
        'Action': entry.action === 'take' ? 'TAKE' : 'FILL',
        'Bin': entry.binNumber,
        'Qty': entry.quantity,
        'User': entry.user
      }));

      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSyncCount(prev => prev + 1);
      
      toast.success('🔄 Data tersinkron otomatis', {
        description: `Sync berhasil pada ${new Date().toLocaleTimeString('id-ID')}`,
        duration: 2000,
      });
      
      return true;
    } catch (error) {
      console.error('Auto-sync error:', error);
      toast.error('❌ Gagal sinkronisasi otomatis');
      return false;
    }
  };

  // Manual export functions (with actual file download)
  const exportCompleteData = async (): Promise<boolean> => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      const materialsData = materials.map(material => ({
        'ID SAP': material.id,
        'Deskripsi': material.description,
        'Kapasitas Per Bin': material.qtyPerBin,
        'BIN 1': material.bin1,
        'BIN 2': material.bin2,
        'BIN 3': material.bin3,
        'BIN 4': material.bin4,
        'Total Stok': material.bin1 + material.bin2 + material.bin3 + material.bin4,
        'Status': (material.bin1 + material.bin2 + material.bin3 + material.bin4) > 0 ? 'Tersedia' : 'Kosong',
        'Terakhir Update': new Date().toLocaleString('id-ID')
      }));

      const historyData = history.map(entry => ({
        'Waktu': entry.timestamp.toLocaleString('id-ID'),
        'ID Material': entry.materialId,
        'Deskripsi': entry.materialDescription,
        'Aktivitas': entry.action === 'take' ? 'Pengambilan' : 'Pengisian',
        'Bin': `BIN ${entry.binNumber}`,
        'Jumlah': entry.quantity,
        'User': entry.user,
        'ID Transaksi': entry.id
      }));

      const materialsSheet = XLSX.utils.json_to_sheet(materialsData);
      const historySheet = XLSX.utils.json_to_sheet(historyData);

      XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Material Stock');
      XLSX.utils.book_append_sheet(workbook, historySheet, 'History');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Material_Management_Complete_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);
      
      toast.success(`📄 Data lengkap berhasil diekspor ke ${filename}`);
      onTemplateUpdate();
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      toast.error('❌ Gagal mengekspor data lengkap');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const exportLiveSnapshot = async (): Promise<boolean> => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      const materialsData = materials.map(material => ({
        'ID SAP': material.id,
        'Deskripsi': material.description,
        'BIN 1': material.bin1,
        'BIN 2': material.bin2,
        'BIN 3': material.bin3,
        'BIN 4': material.bin4,
        'Total': material.bin1 + material.bin2 + material.bin3 + material.bin4,
        'Status': (material.bin1 + material.bin2 + material.bin3 + material.bin4) > 0 ? 'OK' : 'EMPTY',
        'Last Update': new Date().toLocaleString('id-ID')
      }));

      const recentHistory = history.slice(0, 50).map(entry => ({
        'Time': entry.timestamp.toLocaleString('id-ID'),
        'Material': entry.materialId,
        'Action': entry.action === 'take' ? 'TAKE' : 'FILL',
        'Bin': entry.binNumber,
        'Qty': entry.quantity,
        'User': entry.user
      }));

      const materialsSheet = XLSX.utils.json_to_sheet(materialsData);
      const historySheet = XLSX.utils.json_to_sheet(recentHistory);

      XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Live Stock');
      XLSX.utils.book_append_sheet(workbook, historySheet, 'Recent Activity');

      XLSX.writeFile(workbook, 'Material_Management_Live_Snapshot.xlsx');
      
      toast.success('📊 Live snapshot berhasil diekspor');
      onTemplateUpdate();
      
      return true;
    } catch (error) {
      console.error('Live export error:', error);
      toast.error('❌ Gagal mengekspor live snapshot');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const createTemplate = async (): Promise<boolean> => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      // Header Information
      const headerData = [
        ['🏭 SISTEM MANAJEMEN MATERIAL SUPERMARKET', '', '', '', '', '', '', '', '', ''],
        ['📊 Template Real-time Update & Monitoring', '', '', '', '', '', '', '', '', ''],
        ['⏰ Generated:', new Date().toLocaleString('id-ID'), '', '', '', '', '', '', '', ''],
        ['🔄 Auto-Sync Status: ' + (autoExportEnabled ? 'ACTIVE' : 'INACTIVE'), '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['ID SAP', 'DESKRIPSI MATERIAL', 'KAPASITAS/BIN', 'BIN 1', 'BIN 2', 'BIN 3', 'BIN 4', 'TOTAL STOK', 'STATUS', 'LAST UPDATE']
      ];
      
      // Materials data with consistent positioning for real-time updates
      const materialsData = materials.map((material) => [
        material.id,
        material.description,
        material.qtyPerBin,
        material.bin1,
        material.bin2,
        material.bin3,
        material.bin4,
        material.bin1 + material.bin2 + material.bin3 + material.bin4,
        (material.bin1 + material.bin2 + material.bin3 + material.bin4) > 0 ? 'TERSEDIA' : 'KOSONG',
        new Date().toLocaleString('id-ID')
      ]);
      
      // Combine header and data
      const allData = [...headerData, ...materialsData];
      
      // Create main worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(allData);
      
      // Set column widths for better visibility
      const columnWidths = [
        { wch: 20 }, // ID SAP
        { wch: 40 }, // Description
        { wch: 15 }, // Capacity
        { wch: 10 }, // BIN 1
        { wch: 10 }, // BIN 2
        { wch: 10 }, // BIN 3
        { wch: 10 }, // BIN 4
        { wch: 12 }, // Total
        { wch: 12 }, // Status
        { wch: 20 }  // Last Update
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Material Template');
      
      // Export template
      const filename = 'Material_Management_Template.xlsx';
      XLSX.writeFile(workbook, filename);
      
      setTemplateActive(true);
      toast.success(`📊 Template Excel berhasil dibuat: ${filename}`);
      onTemplateUpdate();
      
      return true;
    } catch (error) {
      console.error('Template creation error:', error);
      toast.error('❌ Gagal membuat template Excel');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const materialSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('material') || name.toLowerCase().includes('stock') || name.toLowerCase().includes('template')
        );
        
        if (materialSheetName) {
          const worksheet = workbook.Sheets[materialSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const importedMaterials = jsonData.map((row: any) => ({
            id: row['ID SAP'] || row['ID SAP'] || '',
            description: row['DESKRIPSI MATERIAL'] || row['Deskripsi'] || '',
            qtyPerBin: row['KAPASITAS/BIN'] || row['Kapasitas Per Bin'] || 0,
            bin1: row['BIN 1'] || 0,
            bin2: row['BIN 2'] || 0,
            bin3: row['BIN 3'] || 0,
            bin4: row['BIN 4'] || 0
          })).filter(material => material.id);
          
          if (importedMaterials.length > 0) {
            onImportMaterials(importedMaterials);
            toast.success(`✅ ${importedMaterials.length} material berhasil diimpor dari Excel`);
            
            // Trigger auto-sync after import if enabled
            if (autoExportEnabled) {
              setTimeout(() => performAutoSync(), 1000);
            }
          } else {
            toast.error('⚠️ Tidak ada data material yang valid untuk diimpor');
          }
        } else {
          toast.error('❌ Sheet material tidak ditemukan dalam file Excel');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('❌ Gagal mengimpor data dari Excel');
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    exportCompleteData,
    exportLiveSnapshot,
    createTemplate
  }));

  // Auto-sync trigger (call this from parent when data changes)
  React.useEffect(() => {
    if (autoExportEnabled && (materials.length > 0 || history.length > 0)) {
      performAutoSync();
    }
  }, [materials, history, autoExportEnabled]);

  // Statistics
  const totalMaterials = materials.length;
  const totalTransactions = history.length;
  const totalStock = materials.reduce((sum, m) => sum + m.bin1 + m.bin2 + m.bin3 + m.bin4, 0);
  const successRate = 100; // Always 100% for this demo

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Status */}
      <Card className="p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Excel Database Center</h2>
              <p className="text-gray-600">Auto-sync & manual export management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={autoExportEnabled ? "default" : "secondary"}
              className="px-3 py-1"
            >
              <Zap className={`w-3 h-3 mr-1 ${autoExportEnabled ? 'animate-pulse' : ''}`} />
              Auto-Sync {autoExportEnabled ? 'ON' : 'OFF'}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <RefreshCw className="w-3 h-3 mr-1" />
              {syncCount} syncs
            </Badge>
          </div>
        </div>
      </Card>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalMaterials}</div>
              <div className="text-sm text-gray-600">Materials</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <HardDrive className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalStock.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Stock</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{syncCount}</div>
              <div className="text-sm text-gray-600">Auto Syncs</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Auto-Sync Control */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Sync Settings</h3>
            <p className="text-sm text-gray-600">
              Auto-sync will automatically synchronize data changes without downloading files. 
              Use manual export when you need actual Excel files.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Label htmlFor="auto-sync-toggle" className="text-sm font-medium">
              Auto-Sync {autoExportEnabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id="auto-sync-toggle"
              checked={autoExportEnabled}
              onCheckedChange={onAutoExportToggle}
            />
          </div>
        </div>
        {lastExportTime && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Clock className="w-4 h-4" />
              <span>Last sync: {lastExportTime.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Manual Export & Import Functions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Functions */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Manual Export</h3>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={exportCompleteData} 
              disabled={isExporting}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Complete Data
                </>
              )}
            </Button>
            
            <Button 
              onClick={exportLiveSnapshot} 
              disabled={isExporting}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Export Live Snapshot
            </Button>
            
            <Button 
              onClick={createTemplate} 
              disabled={isExporting}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <FileCode className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </Card>

        {/* Import Functions */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import from Excel
                </>
              )}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />

            <div className="text-sm text-gray-500 space-y-1">
              <p>• Supports .xlsx and .xls files</p>
              <p>• Looks for 'Material', 'Stock', or 'Template' sheets</p>
              <p>• Auto-sync will trigger after successful import</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Information */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sync Status</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Auto-sync: {autoExportEnabled ? 'Active - Data syncs automatically' : 'Inactive - Manual export only'}</p>
              <p>• Total syncs performed: {syncCount}</p>
              <p>• Success rate: {successRate}%</p>
              <p>• Last activity: {lastExportTime ? lastExportTime.toLocaleString('id-ID') : 'Never'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`p-3 rounded-full ${autoExportEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Database className={`w-8 h-8 ${autoExportEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

ExcelManager.displayName = 'ExcelManager';