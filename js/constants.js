// Material Management Constants
export const INITIAL_MATERIALS = [
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

export const ELEMENT_IDS = {
    // Header elements
    availableCount: 'available-count',
    totalCount: 'total-count',
    syncBadge: 'sync-badge',
    syncText: 'sync-text',
    currentTime: 'current-time',
    
    // Search and controls
    searchInput: 'search-input',
    autoSyncBtn: 'auto-sync-btn',
    fileInput: 'file-input',
    
    // Tab navigation
    historyCount: 'history-count',
    
    // Dashboard elements
    dashboardTotalMaterials: 'dashboard-total-materials',
    dashboardAvailableMaterials: 'dashboard-available-materials',
    dashboardEmptyMaterials: 'dashboard-empty-materials',
    dashboardTotalStock: 'dashboard-total-stock',
    dashboardTotalCapacity: 'dashboard-total-capacity',
    dashboardUtilization: 'dashboard-utilization',
    dashboardUtilizationBar: 'dashboard-utilization-bar',
    dashboardTotalActivities: 'dashboard-total-activities',
    dashboardTodayActivities: 'dashboard-today-activities',
    
    // Materials elements
    materialsGrid: 'materials-grid',
    
    // History elements
    historyList: 'history-list',
    historySearch: 'history-search',
    historyActionFilter: 'history-action-filter',
    historySort: 'history-sort',
    
    // Excel elements
    excelMaterialsCount: 'excel-materials-count',
    excelTransactionsCount: 'excel-transactions-count',
    excelTotalStock: 'excel-total-stock',
    excelSyncUpdates: 'excel-sync-updates',
    excelActivityLog: 'excel-activity-log',
    
    // Modal elements
    takeModal: 'take-modal',
    fillModal: 'fill-modal',
    takeMaterialId: 'take-material-id',
    takeMaterialDesc: 'take-material-desc',
    takeMaterialCapacity: 'take-material-capacity',
    fillMaterialId: 'fill-material-id',
    fillMaterialDesc: 'fill-material-desc',
    fillMaterialCapacity: 'fill-material-capacity'
};

export const CSS_CLASSES = {
    tabBtn: 'tab-btn',
    tabContent: 'tab-content',
    active: 'active',
    modal: 'modal',
    hidden: 'hidden'
};