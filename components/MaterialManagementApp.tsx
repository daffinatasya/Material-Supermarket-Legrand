import React, { useState, useEffect, useRef } from 'react';
import { MaterialDashboard } from './MaterialDashboard';
import { MaterialList } from './MaterialList';
import { MaterialTakeDialog } from './MaterialTakeDialog';
import { MaterialFillDialog } from './MaterialFillDialog';
import { MaterialHistory } from './MaterialHistory';
import { MaterialADGI, ADGIEntry } from './MaterialADGI';
import { ExcelManager, ExcelManagerRef } from './ExcelManager';
import { Search, Package, Warehouse, Bell, Download, Upload, FileSpreadsheet, BarChart3, Truck } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Toaster } from './ui/sonner';
import * as XLSX from 'xlsx';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import university logos
import airlanggaLogo from 'figma:asset/5b042af4ab4f7be21b54f1962bb03b920f6600ec.png';
import sampoerrnaLogo from 'figma:asset/1fab3403a00557d9491015b5db2266ef96d87651.png';
// Import Legrand logo
import legrandLogo from 'figma:asset/8051c5cda0ddc9cceeb16020778077c85616e0db.png';

export interface Material {
  id: string;
  description: string;
  qtyPerBin: number;
  bin1: number;
  bin2: number;
  bin3: number;
  bin4: number;
}

export interface HistoryEntry {
  id: string;
  materialId: string;
  materialDescription: string;
  action: 'take' | 'fill';
  binNumber: number;
  quantity: number;
  timestamp: Date;
  user: string;
  adgiStatus?: 'pending' | 'done';
  adgiUpdatedAt?: Date;
  adgiUpdatedBy?: string;
}

const initialMaterials: Material[] = [
  { id: "X/A013604BA", description: "Joint 3 ways", qtyPerBin: 8, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "X/G005294AB", description: "Cover joint 3 ways", qtyPerBin: 25, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "X/G005320AB", description: "Screw Ejot type G", qtyPerBin: 385, bin1: 385, bin2: 385, bin3: 0, bin4: 0 },
  { id: "R04B40HEXM12035", description: "Baut m12x35 SS304", qtyPerBin: 25, bin1: 25, bin2: 0, bin3: 0, bin4: 0 },
  { id: "R04WCTM12E", description: "Contact washer m12", qtyPerBin: 50, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "R04WCTM06E", description: "Contact washer m6", qtyPerBin: 500, bin1: 500, bin2: 500, bin3: 0, bin4: 0 },
  { id: "R04B88HEXM06015E", description: "Bolt stell m6x15 ELG", qtyPerBin: 400, bin1: 202, bin2: 0, bin3: 0, bin4: 0 },
  { id: "R04NUTCGM06E", description: "Cage nut M6", qtyPerBin: 200, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "X/Y377A3", description: "Screw ejot type Y", qtyPerBin: 500, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "R04BEYB12035", description: "Eye bolt m12", qtyPerBin: 25, bin1: 25, bin2: 25, bin3: 0, bin4: 0 },
  { id: "2005372", description: "LABEL FOR BROTHER TZE-211 SZ 6MM WHITE", qtyPerBin: 3, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "2005373", description: "LABEL FOR BROTHER TZE-221 SZ 9MM WHITE", qtyPerBin: 3, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "2005369", description: "LABEL FOR BROTHER TZE-231 SZ 12MM WHITE", qtyPerBin: 3, bin1: 2, bin2: 3, bin3: 0, bin4: 0 },
  { id: "2005395", description: "SCHOEN BLADE 1.25-18 RED", qtyPerBin: 375, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "2005397", description: "SCHOEN BLADE 2.5-18 BLUE", qtyPerBin: 250, bin1: 100, bin2: 250, bin3: 0, bin4: 0 },
  { id: "2005406", description: "SCHOEN FERRULES 2-5 NON INSULATED", qtyPerBin: 500, bin1: 500, bin2: 500, bin3: 0, bin4: 0 },
  { id: "2005436", description: "SCHOEN RING 2.5-10 NON INSULATED", qtyPerBin: 100, bin1: 100, bin2: 100, bin3: 100, bin4: 100 },
  { id: "2005433", description: "SCHOEN RING 2.5-5 NON INSULATED", qtyPerBin: 750, bin1: 750, bin2: 750, bin3: 0, bin4: 0 },
  { id: "2005412", description: "SCHOEN RING 2-4 NON INSULATED", qtyPerBin: 250, bin1: 0, bin2: 0, bin3: 0, bin4: 0 },
  { id: "2005420", description: "SCHOEN RING 6-6 NON INSULATED", qtyPerBin: 125, bin1: 125, bin2: 125, bin3: 125, bin4: 0 },
  { id: "2005477", description: "SCHOEN Y 1.25-3 NON INSULATED", qtyPerBin: 2000, bin1: 2000, bin2: 0, bin3: 0, bin4: 0 },
  { id: "2005481", description: "SCHOEN Y 2.5-4 NON INSULATED", qtyPerBin: 500, bin1: 500, bin2: 500, bin3: 500, bin4: 500 },
  { id: "2005505", description: "VINYL CABLE 2.5MM2 BK", qtyPerBin: 375, bin1: 375, bin2: 375, bin3: 375, bin4: 0 },
  { id: "2005506", description: "VINYL CABLE 2.5MM2 BL", qtyPerBin: 375, bin1: 375, bin2: 375, bin3: 0, bin4: 0 },
  { id: "2005507", description: "VINYL CABLE 2.5MM2 BR", qtyPerBin: 375, bin1: 375, bin2: 375, bin3: 375, bin4: 0 },
  { id: "2005509", description: "VINYL CABLE 2.5MM2 GR", qtyPerBin: 375, bin1: 375, bin2: 375, bin3: 375, bin4: 375 },
  { id: "2005547", description: "VINYL CABLE 6MM2 G", qtyPerBin: 250, bin1: 250, bin2: 250, bin3: 0, bin4: 0 }
];

export function MaterialManagementApp() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showTakeDialog, setShowTakeDialog] = useState(false);
  const [showFillDialog, setShowFillDialog] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState('materials'); // Start with materials tab
  const [autoExportEnabled, setAutoExportEnabled] = useState(true);
  const [lastExportTime, setLastExportTime] = useState<Date | null>(null);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelManagerRef = useRef<ExcelManagerRef>(null);

  // Keyboard shortcut for Excel export
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        if (excelManagerRef.current) {
          excelManagerRef.current.exportCompleteData();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const filteredMaterials = materials.filter(material =>
    material.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMaterials = materials.length;
  const availableMaterials = materials.filter(m => m.bin1 > 0 || m.bin2 > 0 || m.bin3 > 0 || m.bin4 > 0).length;

  // Function to handle taking material with ADGI status
  const handleTakeMaterial = async (materialId: string, binNumber: number, quantity: number) => {
    console.log('🔥 PROCESSING TAKE MATERIAL:', { materialId, binNumber, quantity });
    
    const material = materials.find(m => m.id === materialId);
    if (!material) {
      toast.error('❌ Material tidak ditemukan');
      return;
    }

    const binKey = `bin${binNumber}` as keyof Pick<Material, 'bin1' | 'bin2' | 'bin3' | 'bin4'>;
    const currentBinValue = material[binKey] as number;
    
    if (currentBinValue < quantity) {
      toast.error(`❌ Stok tidak mencukupi. Tersedia: ${currentBinValue}`);
      return;
    }

    // Update materials state
    const updatedMaterials = materials.map(mat => {
      if (mat.id === materialId) {
        const newBinValue = Math.max(0, currentBinValue - quantity);
        console.log(`📦 Updating ${materialId} ${binKey}: ${currentBinValue} → ${newBinValue}`);
        return {
          ...mat,
          [binKey]: newBinValue
        };
      }
      return mat;
    });
    
    setMaterials(updatedMaterials);

    // Add to history with ADGI status (default to pending for take actions)
    const historyEntry: HistoryEntry = {
      id: `take-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      materialId,
      materialDescription: material.description,
      action: 'take',
      binNumber,
      quantity,
      timestamp: new Date(),
      user: 'Current User',
      adgiStatus: 'pending', // New take actions start as pending
      adgiUpdatedAt: new Date(),
      adgiUpdatedBy: 'System'
    };
    
    setHistory(prev => [historyEntry, ...prev]);
    
    // Success notification
    toast.success(`✅ Berhasil mengambil ${quantity} ${material.description} dari BIN ${binNumber}`, {
      duration: 3000,
    });

    // Auto-sync if enabled (no download, just sync)
    if (autoExportEnabled) {
      setIsAutoSyncing(true);
      try {
        // Trigger auto-sync in ExcelManager
        setLastExportTime(new Date());
      } catch (error) {
        console.error('Auto-sync error:', error);
        toast.error('Material diambil, namun gagal sync otomatis');
      } finally {
        setIsAutoSyncing(false);
      }
    }

    console.log('✅ Take material completed successfully');
  };

  // Function to handle filling material
  const handleFillMaterial = async (materialId: string, binNumber: number, quantity: number) => {
    console.log('🔥 PROCESSING FILL MATERIAL:', { materialId, binNumber, quantity });
    
    const material = materials.find(m => m.id === materialId);
    if (!material) {
      toast.error('❌ Material tidak ditemukan');
      return;
    }

    const binKey = `bin${binNumber}` as keyof Pick<Material, 'bin1' | 'bin2' | 'bin3' | 'bin4'>;
    const currentBinValue = material[binKey] as number;
    
    if (currentBinValue + quantity > material.qtyPerBin) {
      toast.error(`❌ Kapasitas bin tidak mencukupi. Maksimal: ${material.qtyPerBin}, Saat ini: ${currentBinValue}`);
      return;
    }

    // Update materials state
    const updatedMaterials = materials.map(mat => {
      if (mat.id === materialId) {
        const newBinValue = currentBinValue + quantity;
        console.log(`📦 Updating ${materialId} ${binKey}: ${currentBinValue} → ${newBinValue}`);
        return {
          ...mat,
          [binKey]: newBinValue
        };
      }
      return mat;
    });
    
    setMaterials(updatedMaterials);

    // Add to history (fill actions don't need ADGI status)
    const historyEntry: HistoryEntry = {
      id: `fill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      materialId,
      materialDescription: material.description,
      action: 'fill',
      binNumber,
      quantity,
      timestamp: new Date(),
      user: 'Current User'
    };
    
    setHistory(prev => [historyEntry, ...prev]);
    
    // Success notification
    toast.success(`✅ Berhasil mengisi ${quantity} ${material.description} ke BIN ${binNumber}`, {
      duration: 3000,
    });

    // Auto-sync if enabled
    if (autoExportEnabled) {
      setIsAutoSyncing(true);
      try {
        setLastExportTime(new Date());
      } catch (error) {
        console.error('Auto-sync error:', error);
        toast.error('Material diisi, namun gagal sync otomatis');
      } finally {
        setIsAutoSyncing(false);
      }
    }

    console.log('✅ Fill material completed successfully');
  };

  // Function to open take dialog
  const openTakeDialog = (material: Material) => {
    console.log('🔓 OPENING TAKE DIALOG for:', material.id);
    setSelectedMaterial(material);
    setShowTakeDialog(true);
    setShowFillDialog(false);
  };

  // Function to open fill dialog
  const openFillDialog = (material: Material) => {
    console.log('🔓 OPENING FILL DIALOG for:', material.id);
    setSelectedMaterial(material);
    setShowFillDialog(true);
    setShowTakeDialog(false);
  };

  // Function to close dialogs
  const closeDialogs = () => {
    console.log('🔒 CLOSING ALL DIALOGS');
    setShowTakeDialog(false);
    setShowFillDialog(false);
    setSelectedMaterial(null);
  };

  // Function to update ADGI status
  const handleUpdateADGIStatus = (entryId: string, status: 'pending' | 'done') => {
    setHistory(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          adgiStatus: status,
          adgiUpdatedAt: new Date(),
          adgiUpdatedBy: 'Current User'
        };
      }
      return entry;
    }));

    toast.success(`✅ Status ADGI diperbarui menjadi ${status === 'done' ? 'Done' : 'Pending'}`);
  };

  // Excel import function
  const importFromExcel = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const materialSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('material') || name.toLowerCase().includes('stock')
        );
        
        if (materialSheetName) {
          const worksheet = workbook.Sheets[materialSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const importedMaterials = jsonData.map((row: any) => ({
            id: row['ID SAP'] || '',
            description: row['Deskripsi'] || '',
            qtyPerBin: row['Kapasitas Per Bin'] || 0,
            bin1: row['BIN 1'] || 0,
            bin2: row['BIN 2'] || 0,
            bin3: row['BIN 3'] || 0,
            bin4: row['BIN 4'] || 0
          })).filter(material => material.id);
          
          if (importedMaterials.length > 0) {
            setMaterials(importedMaterials);
            toast.success(`✅ ${importedMaterials.length} material berhasil diimpor dari Excel`);
            
            if (autoExportEnabled) {
              setLastExportTime(new Date());
            }
          } else {
            toast.error('⚠️ Tidak ada data material yang valid untuk diimpor');
          }
        } else {
          toast.error('❌ Sheet Material Stock tidak ditemukan dalam file Excel');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('❌ Gagal mengimpor data dari Excel');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromExcel(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Main Header Row with Logos */}
          <div className="flex items-center justify-between mb-4">
            {/* Left Logo - Universitas Airlangga */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <ImageWithFallback 
                  src={airlanggaLogo}
                  alt="Universitas Airlangga Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>

            {/* Center - Main Title */}
            <div className="flex items-center space-x-4 flex-1 justify-center">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                <ImageWithFallback 
                  src={legrandLogo}
                  alt="Legrand Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Material Management</h1>
                <p className="text-lg text-gray-600">Sistem Manajemen Material Supermarket</p>
              </div>
            </div>

            {/* Right Logo - Sampoerna University */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <ImageWithFallback 
                  src={sampoerrnaLogo}
                  alt="Sampoerna University Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Sub Header Row with Stats and Controls */}
          <div className="flex items-center justify-between">
            {/* Created By Credits */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-green-50 px-3 py-1 rounded-full border border-gray-200">
                <span className="font-medium">Created by:</span> Daffina Natasya & Philip Surya
              </div>
            </div>

            {/* Stats and Controls */}
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Package className="w-4 h-4 mr-1" />
                {availableMaterials}/{totalMaterials} Available
              </Badge>
              {lastExportTime && (
                <Badge 
                  variant={isAutoSyncing ? "default" : "secondary"} 
                  className={`px-3 py-1 ${isAutoSyncing ? 'animate-pulse' : ''}`}
                >
                  <FileSpreadsheet className={`w-4 h-4 mr-1 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                  {isAutoSyncing ? 'Syncing...' : `Sync: ${lastExportTime.toLocaleTimeString('id-ID')}`}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifikasi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Cari material berdasarkan ID SAP atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => excelManagerRef.current?.exportCompleteData()}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </Button>
              
              <Button 
                onClick={() => {
                  setAutoExportEnabled(!autoExportEnabled);
                  toast.success(`Auto-sync Excel ${!autoExportEnabled ? 'diaktifkan' : 'dimatikan'}`);
                }}
                variant={autoExportEnabled ? "default" : "outline"}
                size="sm"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {autoExportEnabled ? 'Auto-Sync ON' : 'Auto-Sync OFF'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[1000px]">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Histori ({history.length})</span>
            </TabsTrigger>
            <TabsTrigger value="adgi" className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>ADGI ({history.filter(h => h.action === 'take').length})</span>
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel Database</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MaterialDashboard 
              materials={materials}
              history={history}
              lastExportTime={lastExportTime}
              autoExportEnabled={autoExportEnabled}
            />
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <MaterialList 
              materials={filteredMaterials} 
              onTakeMaterial={openTakeDialog}
              onFillMaterial={openFillDialog}
            />
          </TabsContent>

          <TabsContent value="history">
            <MaterialHistory history={history} />
          </TabsContent>

          <TabsContent value="adgi">
            <MaterialADGI 
              history={history} 
              onUpdateADGIStatus={handleUpdateADGIStatus}
            />
          </TabsContent>

          <TabsContent value="excel">
            <ExcelManager
              ref={excelManagerRef}
              materials={materials}
              history={history}
              autoExportEnabled={autoExportEnabled}
              onAutoExportToggle={setAutoExportEnabled}
              lastExportTime={lastExportTime}
              onImportMaterials={(importedMaterials) => {
                setMaterials(importedMaterials);
                if (autoExportEnabled) {
                  setLastExportTime(new Date());
                }
              }}
              onTemplateUpdate={() => setLastExportTime(new Date())}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <MaterialTakeDialog
        material={selectedMaterial}
        open={showTakeDialog}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
        }}
        onTakeMaterial={handleTakeMaterial}
      />

      <MaterialFillDialog
        material={selectedMaterial}
        open={showFillDialog}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
        }}
        onFillMaterial={handleFillMaterial}
      />
      
      <Toaster position="top-right" richColors />
    </div>
  );
}