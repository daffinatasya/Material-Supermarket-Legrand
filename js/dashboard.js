// Dashboard functionality
import { calculateMaterialStats, calculateHistoryStats, getUtilizationColor } from './utils.js';
import { ELEMENT_IDS } from './constants.js';

export function updateDashboard(materials, history) {
    const stats = calculateMaterialStats(materials);
    const historyStats = calculateHistoryStats(history);

    // Update dashboard metrics
    document.getElementById(ELEMENT_IDS.dashboardTotalMaterials).textContent = stats.totalMaterials;
    document.getElementById(ELEMENT_IDS.dashboardAvailableMaterials).textContent = stats.availableMaterials;
    document.getElementById(ELEMENT_IDS.dashboardEmptyMaterials).textContent = stats.emptyMaterials;
    document.getElementById(ELEMENT_IDS.dashboardTotalStock).textContent = stats.totalStock.toLocaleString();
    document.getElementById(ELEMENT_IDS.dashboardTotalCapacity).textContent = stats.totalCapacity.toLocaleString();
    document.getElementById(ELEMENT_IDS.dashboardUtilization).textContent = stats.utilization + '%';
    document.getElementById(ELEMENT_IDS.dashboardUtilizationBar).style.width = stats.utilization + '%';
    document.getElementById(ELEMENT_IDS.dashboardTotalActivities).textContent = history.length;
    document.getElementById(ELEMENT_IDS.dashboardTodayActivities).textContent = historyStats.todayActivities;

    // Update utilization color
    updateUtilizationColor(stats.utilization);

    // Update today's activity
    updateTodayActivity(historyStats);

    // Update bin status grid
    updateBinStatusGrid(materials);
    
    // Update critical materials
    updateCriticalMaterials(materials);
    
    // Update most active materials
    updateMostActiveMaterials(materials, history);
}

function updateUtilizationColor(utilizationPercentage) {
    const utilizationIconBg = document.getElementById('utilization-icon-bg');
    const utilizationIcon = document.getElementById('utilization-icon');
    
    if (!utilizationIconBg || !utilizationIcon) return;
    
    const colors = getUtilizationColor(utilizationPercentage);
    utilizationIconBg.className = `p-3 rounded-lg ${colors.bgClass}`;
    utilizationIcon.className = `w-6 h-6 ${colors.iconClass}`;
}

function updateTodayActivity(historyStats) {
    const elements = {
        todayFilled: document.getElementById('dashboard-today-filled'),
        todayTaken: document.getElementById('dashboard-today-taken'),
        netChange: document.getElementById('dashboard-net-change')
    };

    if (elements.todayFilled) elements.todayFilled.textContent = historyStats.todayFilled.toLocaleString();
    if (elements.todayTaken) elements.todayTaken.textContent = historyStats.todayTaken.toLocaleString();
    
    if (elements.netChange) {
        elements.netChange.textContent = (historyStats.netChange >= 0 ? '+' : '') + historyStats.netChange.toLocaleString();
        elements.netChange.className = `font-medium ${historyStats.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`;
    }
}

function updateBinStatusGrid(materials) {
    const binStatusGrid = document.getElementById('bin-status-grid');
    if (!binStatusGrid) return;
    
    const binStats = [1, 2, 3, 4].map(binNum => {
        const binKey = `bin${binNum}`;
        const binStock = materials.reduce((sum, m) => sum + m[binKey], 0);
        const binCapacity = materials.reduce((sum, m) => sum + m.qtyPerBin, 0);
        const binUtilization = binCapacity > 0 ? Math.round((binStock / binCapacity) * 100) : 0;
        const activeMaterials = materials.filter(m => m[binKey] > 0).length;
        
        return {
            binNumber: binNum,
            stock: binStock,
            capacity: binCapacity,
            utilization: binUtilization,
            activeMaterials
        };
    });

    binStatusGrid.innerHTML = binStats.map(bin => `
        <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">BIN ${bin.binNumber}</h4>
                <div class="border border-gray-200 rounded-full px-2 py-1 text-xs">
                    ${bin.utilization}%
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Stock:</span>
                    <span class="font-medium">${bin.stock.toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Active Materials:</span>
                    <span class="font-medium">${bin.activeMaterials}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="progress-bar h-2 rounded-full" style="width: ${bin.utilization}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCriticalMaterials(materials) {
    const criticalMaterials = materials.filter(m => {
        const totalStock = m.bin1 + m.bin2 + m.bin3 + m.bin4;
        const totalCapacity = m.qtyPerBin * 4;
        return totalStock < (totalCapacity * 0.2);
    });

    const criticalCount = document.getElementById('critical-count');
    const criticalContainer = document.getElementById('critical-materials');
    
    if (criticalCount) criticalCount.textContent = `${criticalMaterials.length} items`;
    
    if (!criticalContainer) return;
    
    if (criticalMaterials.length === 0) {
        criticalContainer.innerHTML = `
            <div class="flex items-center space-x-2 text-green-600 p-3 bg-green-50 rounded-lg">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span class="text-sm">All materials have adequate stock levels</span>
            </div>
        `;
    } else {
        criticalContainer.innerHTML = criticalMaterials.map(material => {
            const totalStock = material.bin1 + material.bin2 + material.bin3 + material.bin4;
            const totalCapacity = material.qtyPerBin * 4;
            const percentage = Math.round((totalStock / totalCapacity) * 100);
            
            return `
                <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div class="flex items-center justify-between mb-1">
                        <div class="font-mono text-sm font-medium text-gray-900">
                            ${material.id}
                        </div>
                        <div class="border border-yellow-300 text-yellow-700 rounded-full px-2 py-1 text-xs">
                            ${percentage}%
                        </div>
                    </div>
                    <div class="text-xs text-gray-600 mb-2">
                        ${material.description.substring(0, 40)}...
                    </div>
                    <div class="text-xs text-gray-500">
                        Stock: ${totalStock}/${totalCapacity}
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div class="progress-bar h-1 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function updateMostActiveMaterials(materials, history) {
    const materialActivityCount = materials.map(material => {
        const activityCount = history.filter(h => h.materialId === material.id).length;
        return { material, activityCount };
    }).filter(item => item.activityCount > 0)
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, 5);

    const countElement = document.getElementById('active-materials-count');
    if (countElement) countElement.textContent = `Top ${materialActivityCount.length}`;
    
    const container = document.getElementById('most-active-materials');
    if (!container) return;
    
    if (materialActivityCount.length === 0) {
        container.innerHTML = `
            <div class="flex items-center space-x-2 text-gray-500 p-3 bg-gray-50 rounded-lg">
                <i data-lucide="activity" class="w-5 h-5"></i>
                <span class="text-sm">No activity data yet - start using materials to see activity rankings</span>
            </div>
        `;
    } else {
        container.innerHTML = materialActivityCount.map((item, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                <div class="flex items-center space-x-3">
                    <div class="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <div class="font-mono text-sm font-medium text-gray-900">
                            ${item.material.id}
                        </div>
                        <div class="text-xs text-gray-600">
                            ${item.material.description.length > 50 
                                ? `${item.material.description.substring(0, 50)}...`
                                : item.material.description
                            }
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-gray-900">
                        ${item.activityCount}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${item.activityCount === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}