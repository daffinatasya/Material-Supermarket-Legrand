// History functionality
import { calculateHistoryStats, filterHistory, formatDate } from './utils.js';
import { ELEMENT_IDS } from './constants.js';

export function updateHistoryDisplay(history) {
    const searchTerm = document.getElementById(ELEMENT_IDS.historySearch)?.value.toLowerCase() || '';
    const filterAction = document.getElementById(ELEMENT_IDS.historyActionFilter)?.value || 'all';
    const sortBy = document.getElementById(ELEMENT_IDS.historySort)?.value || 'newest';

    const filteredHistory = filterHistory(history, searchTerm, filterAction, sortBy);
    const historyStats = calculateHistoryStats(history);

    // Update history statistics
    updateHistoryStats(history.length, historyStats);

    // Update filter results
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = filteredHistory.length;
    }

    // Render history list
    const historyList = document.getElementById(ELEMENT_IDS.historyList);
    if (!historyList) return;
    
    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <i data-lucide="package-2" class="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada histori</h3>
                <p class="text-gray-500">
                    ${searchTerm || filterAction !== 'all' 
                        ? 'Tidak ada aktivitas yang sesuai dengan filter Anda'
                        : 'Aktivitas pengambilan dan pengisian material akan muncul di sini'
                    }
                </p>
            </div>
        `;
        document.getElementById('history-summary')?.classList.add('hidden');
    } else {
        historyList.innerHTML = filteredHistory.map(entry => createHistoryEntryHTML(entry)).join('');

        // Show and update summary
        updateHistorySummary(filteredHistory, history, historyStats);
    }
    
    if (window.lucide) window.lucide.createIcons();
}

function updateHistoryStats(totalCount, historyStats) {
    const elements = {
        'history-total-display': totalCount,
        'history-total-activities': totalCount,
        'history-total-filled': historyStats.totalFilled.toLocaleString(),
        'history-total-taken': historyStats.totalTaken.toLocaleString(),
        'history-today-entries': historyStats.todayEntries
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function createHistoryEntryHTML(entry) {
    return `
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 flex-1">
                    <div class="p-3 rounded-lg ${entry.action === 'take' ? 'bg-red-100' : 'bg-green-100'}">
                        <i data-lucide="${entry.action === 'take' ? 'download' : 'upload'}" class="w-6 h-6 ${entry.action === 'take' ? 'text-red-600' : 'text-green-600'}"></i>
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h4 class="font-mono text-sm font-medium text-gray-900">
                                ${entry.materialId}
                            </h4>
                            <div class="text-xs border ${entry.action === 'take' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'} rounded-full px-2 py-1">
                                ${entry.action === 'take' ? 'Diambil' : 'Diisi'}
                            </div>
                            <div class="border border-gray-200 rounded-full px-2 py-1 text-xs">
                                BIN ${entry.binNumber}
                            </div>
                        </div>
                        
                        <p class="text-gray-600 text-sm mb-2">
                            ${entry.materialDescription}
                        </p>
                        
                        <div class="flex items-center space-x-4 text-xs text-gray-500">
                            <div class="flex items-center space-x-1">
                                <i data-lucide="user" class="w-3 h-3"></i>
                                <span>${entry.user}</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <i data-lucide="clock" class="w-3 h-3"></i>
                                <span>${formatDate(entry.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-right ml-4">
                    <div class="text-2xl font-bold ${entry.action === 'take' ? 'text-red-600' : 'text-green-600'}">
                        ${entry.action === 'take' ? '-' : '+'}${entry.quantity}
                    </div>
                    <div class="text-xs text-gray-500">qty</div>
                </div>
            </div>
        </div>
    `;
}

function updateHistorySummary(filteredHistory, allHistory, historyStats) {
    const summaryElement = document.getElementById('history-summary');
    if (!summaryElement) return;
    
    summaryElement.classList.remove('hidden');
    
    const elements = {
        'summary-filtered-count': filteredHistory.length,
        'summary-percentage': Math.round((filteredHistory.length / allHistory.length) * 100) + '%'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    const netChangeEl = document.getElementById('summary-net-change');
    if (netChangeEl) {
        netChangeEl.textContent = (historyStats.netChange >= 0 ? '+' : '') + historyStats.netChange.toLocaleString();
    }
}

export function resetHistoryFilters() {
    const elements = [
        { id: ELEMENT_IDS.historySearch, value: '' },
        { id: ELEMENT_IDS.historyActionFilter, value: 'all' },
        { id: ELEMENT_IDS.historySort, value: 'newest' }
    ];

    elements.forEach(({ id, value }) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}