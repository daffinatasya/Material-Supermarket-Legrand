import React, { useState, useEffect } from 'react';
import { Material, HistoryEntry } from './MaterialManagementApp';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Warehouse, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Database,
  FileSpreadsheet
} from 'lucide-react';

interface MaterialDashboardProps {
  materials: Material[];
  history: HistoryEntry[];
  lastExportTime: Date | null;
  autoExportEnabled: boolean;
}

export function MaterialDashboard({ 
  materials, 
  history, 
  lastExportTime, 
  autoExportEnabled 
}: MaterialDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dashboard statistics
  const totalMaterials = materials.length;
  const availableMaterials = materials.filter(m => 
    m.bin1 > 0 || m.bin2 > 0 || m.bin3 > 0 || m.bin4 > 0
  ).length;
  const emptyMaterials = totalMaterials - availableMaterials;
  const totalStock = materials.reduce((sum, m) => 
    sum + m.bin1 + m.bin2 + m.bin3 + m.bin4, 0
  );
  const totalCapacity = materials.reduce((sum, m) => 
    sum + (m.qtyPerBin * 4), 0
  );
  const utilizationPercentage = Math.round((totalStock / totalCapacity) * 100);

  // Bin statistics
  const binStats = [1, 2, 3, 4].map(binNum => {
    const binKey = `bin${binNum}` as keyof Material;
    const binStock = materials.reduce((sum, m) => sum + (m[binKey] as number), 0);
    const binCapacity = materials.reduce((sum, m) => sum + m.qtyPerBin, 0);
    const binUtilization = binCapacity > 0 ? Math.round((binStock / binCapacity) * 100) : 0;
    const activeMaterials = materials.filter(m => (m[binKey] as number) > 0).length;
    
    return {
      binNumber: binNum,
      stock: binStock,
      capacity: binCapacity,
      utilization: binUtilization,
      activeMaterials
    };
  });

  // Activity statistics
  const today = new Date();
  const todayActivities = history.filter(h => 
    h.timestamp.toDateString() === today.toDateString()
  );
  const todayTaken = todayActivities
    .filter(h => h.action === 'take')
    .reduce((sum, h) => sum + h.quantity, 0);
  const todayFilled = todayActivities
    .filter(h => h.action === 'fill')
    .reduce((sum, h) => sum + h.quantity, 0);

  // Critical materials (low stock)
  const criticalMaterials = materials.filter(m => {
    const totalStock = m.bin1 + m.bin2 + m.bin3 + m.bin4;
    const totalCapacity = m.qtyPerBin * 4;
    return totalStock < (totalCapacity * 0.2); // Less than 20% capacity
  });

  // Top active materials (most transactions)
  const materialActivityCount = materials.map(material => {
    const activityCount = history.filter(h => h.materialId === material.id).length;
    return { material, activityCount };
  }).filter(item => item.activityCount > 0) // Only show materials with activity
    .sort((a, b) => b.activityCount - a.activityCount)
    .slice(0, 5);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600 bg-red-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getBinStatusColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 70) return 'bg-yellow-500';
    if (utilization >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">System Dashboard</h2>
              <p className="text-gray-600">Real-time Material Management Overview</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="text-lg font-mono font-bold text-gray-900">
              {currentTime.toLocaleTimeString('id-ID')}
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalMaterials}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
              <div className="text-xs text-gray-500 mt-1">
                {availableMaterials} available, {emptyMaterials} empty
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{totalStock.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Stock</div>
              <div className="text-xs text-gray-500 mt-1">
                of {totalCapacity.toLocaleString()} capacity
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${getUtilizationColor(utilizationPercentage)}`}>
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{utilizationPercentage}%</div>
              <div className="text-sm text-gray-600">Utilization</div>
              <Progress value={utilizationPercentage} className="w-20 h-2 mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{history.length}</div>
              <div className="text-sm text-gray-600">Total Activities</div>
              <div className="text-xs text-gray-500 mt-1">
                {todayActivities.length} today
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bin Status Overview */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bin Status Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {binStats.map((bin) => (
            <div key={bin.binNumber} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">BIN {bin.binNumber}</h4>
                <Badge variant="outline" className="text-xs">
                  {bin.utilization}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{bin.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Materials:</span>
                  <span className="font-medium">{bin.activeMaterials}</span>
                </div>
                <Progress 
                  value={bin.utilization} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Materials Filled</div>
                  <div className="text-sm text-gray-600">{todayFilled.toLocaleString()} units</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900">Materials Taken</div>
                  <div className="text-sm text-gray-600">{todayTaken.toLocaleString()} units</div>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600">
                Net Change: <span className={`font-medium ${todayFilled - todayTaken >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {todayFilled - todayTaken >= 0 ? '+' : ''}{(todayFilled - todayTaken).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Critical Materials */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            <Badge variant="outline" className="text-xs">
              {criticalMaterials.length} items
            </Badge>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {criticalMaterials.length === 0 ? (
              <div className="flex items-center space-x-2 text-green-600 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">All materials have adequate stock levels</span>
              </div>
            ) : (
              criticalMaterials.map((material) => {
                const totalStock = material.bin1 + material.bin2 + material.bin3 + material.bin4;
                const totalCapacity = material.qtyPerBin * 4;
                const percentage = Math.round((totalStock / totalCapacity) * 100);
                
                return (
                  <div key={material.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-mono text-sm font-medium text-gray-900">
                        {material.id}
                      </div>
                      <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300">
                        {percentage}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {material.description.substring(0, 40)}...
                    </div>
                    <div className="text-xs text-gray-500">
                      Stock: {totalStock}/{totalCapacity}
                    </div>
                    <Progress value={percentage} className="h-1 mt-1" />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Most Active Materials */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Most Active Materials</h3>
          <Badge variant="outline" className="text-xs">
            Top {materialActivityCount.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {materialActivityCount.length === 0 ? (
            <div className="flex items-center space-x-2 text-gray-500 p-3 bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5" />
              <span className="text-sm">No activity data yet - start using materials to see activity rankings</span>
            </div>
          ) : (
            materialActivityCount.map((item, index) => (
              <div key={item.material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-gray-900">
                      {item.material.id}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.material.description.length > 50 
                        ? `${item.material.description.substring(0, 50)}...`
                        : item.material.description
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {item.activityCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.activityCount === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Excel Integration Status */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Excel Database Status</h3>
              <p className="text-sm text-gray-600">Real-time synchronization with Material_Management_Database.xlsx</p>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={autoExportEnabled ? "default" : "secondary"}
              className="mb-2"
            >
              {autoExportEnabled ? 'Auto-Sync ON' : 'Auto-Sync OFF'}
            </Badge>
            {lastExportTime && (
              <div className="text-sm text-gray-600">
                Last sync: {lastExportTime.toLocaleTimeString('id-ID')}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}