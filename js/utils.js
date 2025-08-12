// Material Management Utilities
import { ELEMENT_IDS } from './constants.js';

export function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    const timeElement = document.getElementById(ELEMENT_IDS.currentTime);
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

export function calculateMaterialStats(materials) {
    const totalMaterials = materials.length;
    const availableMaterials = materials.filter(m => (m.bin1 + m.bin2 + m.bin3 + m.bin4) > 0).length;
    const emptyMaterials = totalMaterials - availableMaterials;
    const totalStock = materials.reduce((sum, m) => sum + m.bin1 + m.bin2 + m.bin3 + m.bin4, 0);
    const totalCapacity = materials.reduce((sum, m) => sum + (m.qtyPerBin * 4), 0);
    const utilization = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

    return {
        totalMaterials,
        availableMaterials,
        emptyMaterials,
        totalStock,
        totalCapacity,
        utilization
    };
}

export function calculateHistoryStats(history) {
    const totalTaken = history.filter(h => h.action === 'take').reduce((sum, h) => sum + h.quantity, 0);
    const totalFilled = history.filter(h => h.action === 'fill').reduce((sum, h) => sum + h.quantity, 0);
    
    const today = new Date();
    const todayActivities = history.filter(h => h.timestamp.toDateString() === today.toDateString());
    const todayTaken = todayActivities.filter(h => h.action === 'take').reduce((sum, h) => sum + h.quantity, 0);
    const todayFilled = todayActivities.filter(h => h.action === 'fill').reduce((sum, h) => sum + h.quantity, 0);
    const todayEntries = todayActivities.length;

    return {
        totalTaken,
        totalFilled,
        todayActivities: todayActivities.length,
        todayTaken,
        todayFilled,
        todayEntries,
        netChange: todayFilled - todayTaken
    };
}

export function getUtilizationColor(percentage) {
    if (percentage >= 80) return { bgClass: 'bg-red-100', iconClass: 'text-red-600' };
    if (percentage >= 60) return { bgClass: 'bg-yellow-100', iconClass: 'text-yellow-600' };
    if (percentage >= 40) return { bgClass: 'bg-blue-100', iconClass: 'text-blue-600' };
    return { bgClass: 'bg-green-100', iconClass: 'text-green-600' };
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}

export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    
    toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm mb-2`;
    toast.innerHTML = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

export function generateHistoryId(action) {
    return `${action}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function filterMaterials(materials, searchTerm) {
    return materials.filter(material => 
        material.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

export function filterHistory(history, searchTerm, filterAction, sortBy) {
    return history
        .filter(entry => {
            const matchesSearch = 
                entry.materialId.toLowerCase().includes(searchTerm) ||
                entry.materialDescription.toLowerCase().includes(searchTerm) ||
                entry.user.toLowerCase().includes(searchTerm);
            
            const matchesFilter = filterAction === 'all' || entry.action === filterAction;
            
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return b.timestamp.getTime() - a.timestamp.getTime();
            }
            return a.timestamp.getTime() - b.timestamp.getTime();
        });
}

export function switchTab(tabName, renderCallbacks) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'shadow-sm');
        btn.classList.add('hover:bg-white', 'hover:shadow-sm');
    });

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate selected tab
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-white', 'shadow-sm');
        activeBtn.classList.remove('hover:bg-white', 'hover:shadow-sm');
    }

    // Show selected tab content
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // Call appropriate render callback
    if (renderCallbacks[tabName]) {
        renderCallbacks[tabName]();
    }
}