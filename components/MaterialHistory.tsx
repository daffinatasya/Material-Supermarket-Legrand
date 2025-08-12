import React, { useState } from 'react';
import { HistoryEntry } from './MaterialManagementApp';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Download, 
  Upload, 
  Search, 
  Calendar, 
  User, 
  Package2, 
  Filter,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  Database
} from 'lucide-react';

interface MaterialHistoryProps {
  history: HistoryEntry[];
}

export function MaterialHistory({ history }: MaterialHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | 'take' | 'fill'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredHistory = history
    .filter(entry => {
      const matchesSearch = 
        entry.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.materialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterAction === 'all' || entry.action === filterAction;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.timestamp.getTime() - b.timestamp.getTime();
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

  const getActionIcon = (action: 'take' | 'fill') => {
    return action === 'take' ? Download : Upload;
  };

  const getActionColor = (action: 'take' | 'fill') => {
    return action === 'take' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getActionText = (action: 'take' | 'fill') => {
    return action === 'take' ? 'Diambil' : 'Diisi';
  };

  // Statistics
  const totalTaken = history.filter(h => h.action === 'take').reduce((sum, h) => sum + h.quantity, 0);
  const totalFilled = history.filter(h => h.action === 'fill').reduce((sum, h) => sum + h.quantity, 0);
  const todayEntries = history.filter(h => {
    const today = new Date();
    const entryDate = h.timestamp;
    return entryDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-gray-600">Riwayat pengambilan dan pengisian material</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{history.length}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{history.length}</div>
              <div className="text-sm text-gray-600">Total Aktivitas</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalFilled.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Diisi</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalTaken.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Diambil</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{todayEntries}</div>
              <div className="text-sm text-gray-600">Hari Ini</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
          {(searchTerm || filterAction !== 'all') && (
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
              className="pl-10 bg-white border-gray-300 focus:border-blue-500"
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
          
          <Select value={filterAction} onValueChange={(value: any) => setFilterAction(value)}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aktivitas</SelectItem>
              <SelectItem value="take">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-red-500" />
                  <span>Hanya Pengambilan</span>
                </div>
              </SelectItem>
              <SelectItem value="fill">
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-green-500" />
                  <span>Hanya Pengisian</span>
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
          
          {(searchTerm || filterAction !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterAction('all');
              }}
              className="bg-white"
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <Package2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada histori</h3>
            <p className="text-gray-500">
              {searchTerm || filterAction !== 'all' 
                ? 'Tidak ada aktivitas yang sesuai dengan filter Anda'
                : 'Aktivitas pengambilan dan pengisian material akan muncul di sini'
              }
            </p>
          </Card>
        ) : (
          filteredHistory.map((entry) => {
            const ActionIcon = getActionIcon(entry.action);
            
            return (
              <Card key={entry.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${entry.action === 'take' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <ActionIcon className={`w-6 h-6 ${entry.action === 'take' ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-mono text-sm font-medium text-gray-900">
                          {entry.materialId}
                        </h4>
                        <Badge 
                          className={`text-xs border ${getActionColor(entry.action)}`}
                          variant="outline"
                        >
                          {getActionText(entry.action)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          BIN {entry.binNumber}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {entry.materialDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{entry.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold ${entry.action === 'take' ? 'text-red-600' : 'text-green-600'}`}>
                      {entry.action === 'take' ? '-' : '+'}{entry.quantity}
                    </div>
                    <div className="text-xs text-gray-500">qty</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{filteredHistory.length}</div>
              <div className="text-xs text-gray-600">Filtered Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((filteredHistory.length / history.length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">of Total History</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {(totalFilled - totalTaken) >= 0 ? '+' : ''}{(totalFilled - totalTaken).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Net Stock Change</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}