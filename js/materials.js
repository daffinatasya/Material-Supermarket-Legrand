// Materials functionality
import { filterMaterials } from './utils.js';
import { ELEMENT_IDS } from './constants.js';

export function renderMaterials(materials, openTakeModal, openFillModal) {
    console.log('📝 Rendering materials grid...');
    const grid = document.getElementById(ELEMENT_IDS.materialsGrid);
    if (!grid) return;
    
    const searchTerm = document.getElementById(ELEMENT_IDS.searchInput)?.value.toLowerCase() || '';
    const filteredMaterialList = filterMaterials(materials, searchTerm);

    if (filteredMaterialList.length === 0) {
        grid.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <i data-lucide="package-2" class="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada material ditemukan</h3>
                <p class="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    grid.innerHTML = filteredMaterialList.map(material => {
        const totalAvailable = material.bin1 + material.bin2 + material.bin3 + material.bin4;
        const isAvailable = totalAvailable > 0;
        const utilizationPercentage = Math.round((totalAvailable / (material.qtyPerBin * 4)) * 100);
        
        return `
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <!-- Material Header -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 rounded-lg ${isAvailable ? 'bg-green-100' : 'bg-gray-100'}">
                            <i data-lucide="package-2" class="w-5 h-5 ${isAvailable ? 'text-green-600' : 'text-gray-400'}"></i>
                        </div>
                        <div>
                            <h3 class="font-mono text-sm font-medium text-gray-900">${material.id}</h3>
                            <p class="text-gray-600 text-sm mt-1">${material.description}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">${material.qtyPerBin} qty/bin</span>
                        <span class="bg-${isAvailable ? 'blue' : 'gray'}-100 text-${isAvailable ? 'blue' : 'gray'}-600 rounded-full px-2 py-1 text-xs">Total: ${totalAvailable}</span>
                        <span class="bg-gray-50 text-gray-500 rounded-full px-2 py-1 text-xs">${utilizationPercentage}% Fill</span>
                    </div>
                </div>

                <!-- Stock Overview -->
                <div class="mb-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i data-lucide="warehouse" class="w-4 h-4 text-gray-500"></i>
                        <span class="text-sm text-gray-600">Stock Overview</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${utilizationPercentage}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${totalAvailable} / ${material.qtyPerBin * 4} Total Capacity</span>
                        <span>${utilizationPercentage}% Utilized</span>
                    </div>
                </div>

                <!-- Bin Status Grid -->
                <div class="grid grid-cols-4 gap-3 mb-4">
                    ${generateBinStatusGrid(material)}
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center space-x-3 pt-4 border-t">
                    <button 
                        onclick="openTakeModal('${material.id}')" 
                        ${!isAvailable ? 'disabled' : ''}
                        class="flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isAvailable 
                                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }"
                    >
                        <i data-lucide="download" class="w-4 h-4 mr-2 inline"></i>
                        ${isAvailable ? 'Ambil Material' : 'Stok Kosong'}
                    </button>
                    
                    <button 
                        onclick="openFillModal('${material.id}')"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200"
                    >
                        <i data-lucide="upload" class="w-4 h-4 mr-2 inline"></i>
                        Isi Material
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    console.log(`✅ Rendered ${filteredMaterialList.length} materials`);
}

function generateBinStatusGrid(material) {
    return [1, 2, 3, 4].map(binNum => {
        const binQty = material[`bin${binNum}`];
        const binPercentage = Math.round((binQty / material.qtyPerBin) * 100);
        let statusClass = 'bg-red-100 text-red-800';
        let icon = 'alert-circle';
        
        if (binQty === 0) {
            statusClass = 'bg-red-100 text-red-800';
            icon = 'alert-circle';
        } else if (binPercentage < 30) {
            statusClass = 'bg-yellow-100 text-yellow-800';
            icon = 'alert-triangle';
        } else if (binPercentage >= 90) {
            statusClass = 'bg-blue-100 text-blue-800';
            icon = 'check-circle';
        } else {
            statusClass = 'bg-green-100 text-green-800';
            icon = 'check-circle';
        }
        
        return `
            <div class="text-center">
                <div class="rounded-lg p-3 ${statusClass} mb-2">
                    <i data-lucide="${icon}" class="w-4 h-4 mx-auto mb-1"></i>
                    <div class="font-bold text-sm">${binQty}</div>
                </div>
                <div class="text-xs text-gray-600 mb-1">BIN ${binNum}</div>
                <div class="text-xs text-gray-500">${binPercentage}%</div>
            </div>
        `;
    }).join('');
}