import React, { useState } from 'react';
import { HistoryEntry } from './MaterialManagementApp';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Download, 
  Search, 
  Calendar, 
  User, 
  Package2, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Truck
} from 'lucide-react';

export interface ADGIEntry extends HistoryEntry {
  adgiStatus: 'pending' | 'done';
  adgiUpdatedAt?: Date;
  adgiUpdatedBy?: string;
}

interface MaterialADGIProps {
  history: HistoryEntry[];
  onUpdateADGIStatus: (entryId: string, status: 'pending' | 'done') => void;
}

export function MaterialADGI({ history, onUpdateADGIStatus }: MaterialADGIProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filter to only show 'take' actions (ADGI is only for material withdrawal)
  const takeHistory = history
    .filter(entry => entry.action === 'take')
    .map(entry => ({
      ...entry,
      adgiStatus: (entry as any).adgiStatus || 'pending',
      adgiUpdatedAt: (entry as any).adgiUpdatedAt,
      adgiUpdatedBy: (entry as any).adgiUpdatedBy
    } as ADGIEntry));

  // Group materials by materialId and consolidate quantities
  const consolidatedMaterials = React.useMemo(() => {
    const materialsMap = new Map<string, {
      materialId: string;
      materialDescription: string;
      totalQuantity: number;
      adgiStatus: 'pending' | 'done';
      firstTimestamp: Date;
      lastTimestamp: Date;
      binNumbers: number[];
      user: string;
      entries: ADGIEntry[];
      allDone: boolean;
    }>();

    takeHistory.forEach(entry => {
      if (materialsMap.has(entry.materialId)) {
        const existing = materialsMap.get(entry.materialId)!;
        existing.totalQuantity += entry.quantity;
        existing.binNumbers.push(entry.binNumber);
        existing.entries.push(entry);
        
        // Update timestamps
        if (entry.timestamp < existing.firstTimestamp) {
          existing.firstTimestamp = entry.timestamp;
        }
        if (entry.timestamp > existing.lastTimestamp) {
          existing.lastTimestamp = entry.timestamp;
        }
        
        // Check if all entries for this material are done
        existing.allDone = existing.entries.every(e => e.adgiStatus === 'done');
        existing.adgiStatus = existing.allDone ? 'done' : 'pending';
      } else {
        materialsMap.set(entry.materialId, {
          materialId: entry.materialId,
          materialDescription: entry.materialDescription,
          totalQuantity: entry.quantity,
          adgiStatus: entry.adgiStatus,
          firstTimestamp: entry.timestamp,
          lastTimestamp: entry.timestamp,
          binNumbers: [entry.binNumber],
          user: entry.user,
          entries: [entry],
          allDone: entry.adgiStatus === 'done'
        });
      }
    });

    return Array.from(materialsMap.values());
  }, [takeHistory]);

  const filteredHistory = consolidatedMaterials
    .filter(material => {
      const matchesSearch = 
        material.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.materialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.user.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || material.adgiStatus === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.lastTimestamp.getTime() - a.lastTimestamp.getTime();
      }
      return a.firstTimestamp.getTime() - b.firstTimestamp.getTime();
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const getStatusColor = (status: 'pending' | 'done') => {
    return status === 'done' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusIcon = (status: 'pending' | 'done') => {
    return status === 'done' ? CheckCircle : AlertCircle;
  };

  const getStatusText = (status: 'pending' | 'done') => {
    return status === 'done' ? 'ADGI Done' : 'ADGI Pending';
  };

  // Statistics
  const totalTakes = takeHistory.length;
  const pendingCount = takeHistory.filter(h => h.adgiStatus === 'pending').length;
  const doneCount = takeHistory.filter(h => h.adgiStatus === 'done').length;
  const todayTakes = takeHistory.filter(h => {
    const today = new Date();
    const entryDate = h.timestamp;
    return entryDate.toDateString() === today.toDateString();
  }).length;

  const handleStatusUpdate = (materialId: string, newStatus: 'pending' | 'done') => {
    // Find the consolidated material and update all its entries
    const material = consolidatedMaterials.find(m => m.materialId === materialId);
    if (material) {
      material.entries.forEach(entry => {
        onUpdateADGIStatus(entry.id, newStatus);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 p-3 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ADGI Management</h2>
              <p className="text-gray-600">Pengelolaan status pengambilan material untuk ADGI</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{totalTakes}</div>
            <div className="text-sm text-gray-600">Total Pengambilan</div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalTakes}</div>
              <div className="text-sm text-gray-600">Total Pengambilan</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
              <div className="text-sm text-gray-600">ADGI Pending</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{doneCount}</div>
              <div className="text-sm text-gray-600">ADGI Done</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{todayTakes}</div>
              <div className="text-sm text-gray-600">Hari Ini</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-orange-50">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
          {(searchTerm || filterStatus !== 'all') && (
            <Badge variant="outline" className="text-xs">
              {filteredHistory.length} hasil
            </Badge>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan ID material, deskripsi, atau user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-orange-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span>ADGI Pending</span>
                </div>
              </SelectItem>
              <SelectItem value="done">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ADGI Done</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Terbaru</span>
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Terlama</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || filterStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="bg-white"
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* ADGI List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <Package2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pengambilan material</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tidak ada pengambilan yang sesuai dengan filter Anda'
                : 'Pengambilan material akan muncul di sini setelah ada transaksi'
              }
            </p>
          </Card>
        ) : (
          filteredHistory.map((material) => {
            const StatusIcon = getStatusIcon(material.adgiStatus);
            const uniqueBins = [...new Set(material.binNumbers)].sort();
            const binText = uniqueBins.length === 1 
              ? `BIN ${uniqueBins[0]}` 
              : `${uniqueBins.length} BINs (${uniqueBins.join(', ')})`;
            
            return (
              <Card key={material.materialId} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Download className="w-6 h-6 text-red-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-mono text-sm font-medium text-gray-900">
                          {material.materialId}
                        </h4>
                        <Badge 
                          className={`text-xs border ${getStatusColor(material.adgiStatus)}`}
                          variant="outline"
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusText(material.adgiStatus)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {binText}
                        </Badge>
                        {material.entries.length > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            {material.entries.length} transactions
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {material.materialDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{material.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {material.firstTimestamp.getTime() === material.lastTimestamp.getTime() 
                              ? formatDate(material.firstTimestamp)
                              : `${formatDate(material.firstTimestamp)} - ${formatDate(material.lastTimestamp)}`
                            }
                          </span>
                        </div>
                        {material.entries.some(e => e.adgiUpdatedAt) && (
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>Updated</span>
                          </div>
                        )}
                      </div>

                      {/* Individual Transactions Details */}
                      {material.entries.length > 1 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-2">Detail Pengambilan:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {material.entries.map((entry, index) => (
                              <div key={entry.id} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  BIN {entry.binNumber} - {formatDate(entry.timestamp)}
                                </span>
                                <span className="font-medium text-red-600">
                                  -{entry.quantity} qty
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        -{material.totalQuantity}
                      </div>
                      <div className="text-xs text-gray-500">total qty</div>
                    </div>
                    
                    {/* Status Toggle Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant={material.adgiStatus === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusUpdate(material.materialId, 'pending')}
                        className="text-xs"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Button>
                      <Button
                        variant={material.adgiStatus === 'done' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusUpdate(material.materialId, 'done')}
                        className="text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {filteredHistory.length > 0 && (
        <Card className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{filteredHistory.length}</div>
              <div className="text-xs text-gray-600">Filtered Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((filteredHistory.length / totalTakes) * 100)}%
              </div>
              <div className="text-xs text-gray-600">of Total Takes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredHistory.filter(h => h.adgiStatus === 'pending').length}
              </div>
              <div className="text-xs text-gray-600">Still Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredHistory.filter(h => h.adgiStatus === 'done').length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}