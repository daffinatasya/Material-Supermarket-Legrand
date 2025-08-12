// Main application entry point
import { INITIAL_MATERIALS, ELEMENT_IDS } from './constants.js';
import { updateCurrentTime, showToast, switchTab, calculateMaterialStats, generateHistoryId } from './utils.js';
import { updateDashboard } from './dashboard.js';
import { renderMaterials } from './materials.js';
import { updateHistoryDisplay, resetHistoryFilters } from './history.js';

// Application state
let materials = [...INITIAL_MATERIALS];
let history = [];
let autoExportEnabled = true;
let selectedMaterial = null;
let selectedBin = null;
let lastExportTime = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 HTML Material Management App Started - Materials Tab Active');
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    updateAllStats();
    setupEventListeners();
    renderMaterials(materials, openTakeModal, openFillModal);
    
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();
    
    console.log('✅ App initialized - Materials tab default');
});

function setupEventListeners() {
    // Search functionality
    document.getElementById(ELEMENT_IDS.searchInput)?.addEventListener('input', function(e) {
        if (document.getElementById('materials-tab').classList.contains('active')) {
            renderMaterials(materials, openTakeModal, openFillModal);
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            handleTabSwitch(targetTab);
        });
    });

    // History filters
    document.getElementById(ELEMENT_IDS.historySearch)?.addEventListener('input', () => updateHistoryDisplay(history));
    document.getElementById(ELEMENT_IDS.historyActionFilter)?.addEventListener('change', () => updateHistoryDisplay(history));
    document.getElementById(ELEMENT_IDS.historySort)?.addEventListener('change', () => updateHistoryDisplay(history));

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'take-modal') {
                closeTakeModal();
            } else if (e.target.id === 'fill-modal') {
                closeFillModal();
            }
        }
    });
}

function handleTabSwitch(tabName) {
    const renderCallbacks = {
        materials: () => renderMaterials(materials, openTakeModal, openFillModal),
        dashboard: () => updateDashboard(materials, history),
        history: () => updateHistoryDisplay(history),
        excel: () => updateExcelTab()
    };
    
    switchTab(tabName, renderCallbacks);
}

function updateAllStats() {
    const stats = calculateMaterialStats(materials);
    
    // Update header stats
    document.getElementById(ELEMENT_IDS.availableCount).textContent = stats.availableMaterials;
    document.getElementById(ELEMENT_IDS.totalCount).textContent = stats.totalMaterials;
    document.getElementById(ELEMENT_IDS.historyCount).textContent = history.length;
    
    updateDashboard(materials, history);
}

function updateExcelTab() {
    // Placeholder for Excel tab functionality
    console.log('Excel tab loaded');
}

// Modal functions
function openTakeModal(materialId) {
    selectedMaterial = materials.find(m => m.id === materialId);
    if (!selectedMaterial) {
        showToast('Material tidak ditemukan', 'error');
        return;
    }

    document.getElementById(ELEMENT_IDS.takeMaterialId).textContent = selectedMaterial.id;
    document.getElementById(ELEMENT_IDS.takeMaterialDesc).textContent = selectedMaterial.description;
    
    generateBinSelection('take');
    document.getElementById(ELEMENT_IDS.takeModal).classList.add('active');
    
    if (window.lucide) window.lucide.createIcons();
}

function openFillModal(materialId) {
    selectedMaterial = materials.find(m => m.id === materialId);
    if (!selectedMaterial) {
        showToast('Material tidak ditemukan', 'error');
        return;
    }

    document.getElementById(ELEMENT_IDS.fillMaterialId).textContent = selectedMaterial.id;
    document.getElementById(ELEMENT_IDS.fillMaterialDesc).textContent = selectedMaterial.description;
    
    generateBinSelection('fill');
    document.getElementById(ELEMENT_IDS.fillModal).classList.add('active');
    
    if (window.lucide) window.lucide.createIcons();
}

function generateBinSelection(type) {
    const bins = [
        { number: 1, current: selectedMaterial.bin1, label: 'BIN 1' },
        { number: 2, current: selectedMaterial.bin2, label: 'BIN 2' },
        { number: 3, current: selectedMaterial.bin3, label: 'BIN 3' },
        { number: 4, current: selectedMaterial.bin4, label: 'BIN 4' }
    ];

    const container = document.getElementById(`${type}-bin-selection`);
    if (!container) return;

    container.innerHTML = bins.map(bin => {
        const isAvailable = type === 'take' ? bin.current > 0 : bin.current < selectedMaterial.qtyPerBin;
        const statusText = type === 'take' ? `${bin.current} tersedia` : `${selectedMaterial.qtyPerBin - bin.current} ruang kosong`;
        
        return `
            <button 
                onclick="selectBin(${bin.number}, '${type}')" 
                ${!isAvailable && type === 'take' ? 'disabled' : ''}
                class="p-4 rounded-lg border-2 transition-all text-left bin-option ${
                    !isAvailable && type === 'take' ? 'opacity-50 cursor-not-allowed border-gray-200' : 'hover:border-blue-300 cursor-pointer border-gray-200'
                }" 
                data-bin="${bin.number}"
            >
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900">${bin.label}</span>
                    <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
                        ${statusText}
                    </span>
                </div>
            </button>
        `;
    }).join('');
}

function selectBin(binNumber, type) {
    selectedBin = binNumber;
    
    // Update UI
    document.querySelectorAll(`#${type}-bin-selection .bin-option`).forEach(option => {
        option.classList.remove('border-blue-500', 'bg-blue-50');
        option.classList.add('border-gray-200');
    });

    const selectedOption = document.querySelector(`#${type}-bin-selection .bin-option[data-bin="${binNumber}"]`);
    if (selectedOption) {
        selectedOption.classList.remove('border-gray-200');
        selectedOption.classList.add('border-blue-500', 'bg-blue-50');
    }

    // Show quantity section
    document.getElementById(`${type}-quantity-section`).classList.remove('hidden');
    document.getElementById(`confirm-${type}-btn`).disabled = false;
}

function confirmTakeMaterial() {
    if (!selectedMaterial || !selectedBin) return;

    const quantity = parseInt(document.getElementById('take-quantity-input').value) || 1;
    const binKey = `bin${selectedBin}`;
    
    if (selectedMaterial[binKey] < quantity) {
        showToast('Stok tidak mencukupi', 'error');
        return;
    }

    // Update material data
    selectedMaterial[binKey] = Math.max(0, selectedMaterial[binKey] - quantity);

    // Add to history
    const historyEntry = {
        id: generateHistoryId('take'),
        materialId: selectedMaterial.id,
        materialDescription: selectedMaterial.description,
        action: 'take',
        binNumber: selectedBin,
        quantity: quantity,
        timestamp: new Date(),
        user: 'Current User'
    };
    history.unshift(historyEntry);

    updateAllStats();
    renderMaterials(materials, openTakeModal, openFillModal);
    closeTakeModal();

    showToast(`✅ Berhasil mengambil ${quantity} ${selectedMaterial.description} dari BIN ${selectedBin}`, 'success');

    if (autoExportEnabled) {
        autoExportToExcel();
    }
}

function confirmFillMaterial() {
    if (!selectedMaterial || !selectedBin) return;

    const quantity = parseInt(document.getElementById('fill-quantity-input').value) || 1;
    const binKey = `bin${selectedBin}`;
    const current = selectedMaterial[binKey];
    
    if (current + quantity > selectedMaterial.qtyPerBin) {
        showToast('Jumlah melebihi kapasitas maksimum bin', 'error');
        return;
    }

    // Update material data
    selectedMaterial[binKey] = current + quantity;

    // Add to history
    const historyEntry = {
        id: generateHistoryId('fill'),
        materialId: selectedMaterial.id,
        materialDescription: selectedMaterial.description,
        action: 'fill',
        binNumber: selectedBin,
        quantity: quantity,
        timestamp: new Date(),
        user: 'Current User'
    };
    history.unshift(historyEntry);

    updateAllStats();
    renderMaterials(materials, openTakeModal, openFillModal);
    closeFillModal();

    showToast(`✅ Berhasil mengisi ${quantity} ${selectedMaterial.description} ke BIN ${selectedBin}`, 'success');

    if (autoExportEnabled) {
        autoExportToExcel();
    }
}

function closeTakeModal() {
    document.getElementById(ELEMENT_IDS.takeModal).classList.remove('active');
    selectedMaterial = null;
    selectedBin = null;
}

function closeFillModal() {
    document.getElementById(ELEMENT_IDS.fillModal).classList.remove('active');
    selectedMaterial = null;
    selectedBin = null;
}

// Excel functions (simplified)
function exportToExcel() {
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

        const materialsSheet = XLSX.utils.json_to_sheet(materialsData);
        XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Material Stock');

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `Material_Management_${timestamp}.xlsx`;

        XLSX.writeFile(workbook, filename);
        
        lastExportTime = new Date();
        showToast(`📄 Data berhasil diekspor ke ${filename}`, 'success');
        
        return true;
    } catch (error) {
        console.error('Export error:', error);
        showToast('❌ Gagal mengekspor data ke Excel', 'error');
        return false;
    }
}

function autoExportToExcel() {
    if (!autoExportEnabled) return;
    
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
            'Last Update': new Date().toLocaleString('id-ID')
        }));

        const materialsSheet = XLSX.utils.json_to_sheet(materialsData);
        XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Live Stock');

        const filename = 'Material_Management_Live.xlsx';
        XLSX.writeFile(workbook, filename);
        
        lastExportTime = new Date();
        
        // Update sync badge
        const syncBadge = document.getElementById(ELEMENT_IDS.syncBadge);
        const syncText = document.getElementById(ELEMENT_IDS.syncText);
        syncBadge?.classList.remove('hidden');
        if (syncText) syncText.textContent = `Sync: ${lastExportTime.toLocaleTimeString('id-ID')}`;
        
        showToast(`🔄 Data tersinkron ke Excel: ${filename}`, 'success');
    } catch (error) {
        console.error('Auto-export error:', error);
        showToast('❌ Gagal sinkronisasi otomatis ke Excel', 'error');
    }
}

function importFromExcel() {
    document.getElementById(ELEMENT_IDS.fileInput)?.click();
}

function handleFileImport(event) {
    const file = event.target.files?.[0];
    if (file) {
        // Simplified import logic
        showToast('Import functionality available', 'info');
    }
    event.target.value = '';
}

function toggleAutoSync() {
    autoExportEnabled = !autoExportEnabled;
    const btn = document.getElementById(ELEMENT_IDS.autoSyncBtn);
    
    if (btn) {
        if (autoExportEnabled) {
            btn.className = 'bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-blue-600';
            btn.innerHTML = '<i data-lucide="file-spreadsheet" class="w-4 h-4"></i><span>Auto-Sync ON</span>';
        } else {
            btn.className = 'bg-gray-500 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-600';
            btn.innerHTML = '<i data-lucide="file-spreadsheet" class="w-4 h-4"></i><span>Auto-Sync OFF</span>';
        }
        
        if (window.lucide) window.lucide.createIcons();
        showToast(`Auto-sync Excel ${autoExportEnabled ? 'diaktifkan' : 'dimatikan'}`, 'success');
    }
}

// Make functions globally available
window.openTakeModal = openTakeModal;
window.openFillModal = openFillModal;
window.closeTakeModal = closeTakeModal;
window.closeFillModal = closeFillModal;
window.selectBin = selectBin;
window.confirmTakeMaterial = confirmTakeMaterial;
window.confirmFillMaterial = confirmFillMaterial;
window.exportToExcel = exportToExcel;
window.importFromExcel = importFromExcel;
window.handleFileImport = handleFileImport;
window.toggleAutoSync = toggleAutoSync;
window.resetHistoryFilters = resetHistoryFilters;

console.log('✅ HTML Material Management App Fully Loaded - Modular Architecture');