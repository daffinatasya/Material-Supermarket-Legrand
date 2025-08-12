import React from 'react';
import { Material } from './MaterialManagementApp';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Package2, AlertCircle, CheckCircle, Download, Upload, Warehouse } from 'lucide-react';

interface MaterialListProps {
  materials: Material[];
  onTakeMaterial: (material: Material) => void;
  onFillMaterial: (material: Material) => void;
}

export function MaterialList({ materials, onTakeMaterial, onFillMaterial }: MaterialListProps) {
  const getBinStatus = (quantity: number, capacity: number) => {
    const percentage = (quantity / capacity) * 100;
    if (quantity === 0) return { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Kosong' };
    if (percentage < 30) return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Rendah' };
    if (percentage >= 90) return { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Penuh' };
    return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Tersedia' };
  };

  const getTotalAvailable = (material: Material) => {
    return material.bin1 + material.bin2 + material.bin3 + material.bin4;
  };

  const hasAvailableStock = (material: Material) => {
    return getTotalAvailable(material) > 0;
  };

  const getUtilizationPercentage = (material: Material) => {
    const totalStock = getTotalAvailable(material);
    const totalCapacity = material.qtyPerBin * 4;
    return Math.round((totalStock / totalCapacity) * 100);
  };

  // Direct button handlers with immediate feedback
  const handleTakeClick = (material: Material, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Take button clicked for:', material.id);
    
    // Immediate visual feedback
    const button = event.currentTarget as HTMLButtonElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    onTakeMaterial(material);
  };

  const handleFillClick = (material: Material, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Fill button clicked for:', material.id);
    
    // Immediate visual feedback
    const button = event.currentTarget as HTMLButtonElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    onFillMaterial(material);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Package2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Material Inventory</h2>
              <p className="text-gray-600">Manajemen dan monitoring stok material</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{materials.length}</div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </div>
        </div>
      </Card>

      {/* Materials Grid */}
      <div className="space-y-4">
        {materials.length === 0 ? (
          <Card className="p-8 text-center">
            <Package2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada material ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
          </Card>
        ) : (
          materials.map((material) => {
            const totalAvailable = getTotalAvailable(material);
            const isAvailable = hasAvailableStock(material);
            const utilizationPercentage = getUtilizationPercentage(material);
            
            return (
              <Card key={material.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Material Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Package2 className={`w-5 h-5 ${isAvailable ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-medium text-gray-900">
                        {material.id}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {material.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {material.qtyPerBin} qty/bin
                    </Badge>
                    <Badge variant={isAvailable ? "default" : "secondary"} className="text-xs">
                      Total: {totalAvailable}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {utilizationPercentage}% Fill
                    </Badge>
                  </div>
                </div>

                {/* Stock Overview */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Warehouse className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Stock Overview</span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{totalAvailable} / {material.qtyPerBin * 4} Total Capacity</span>
                    <span>{utilizationPercentage}% Utilized</span>
                  </div>
                </div>

                {/* Bin Status Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'BIN 1', qty: material.bin1 },
                    { label: 'BIN 2', qty: material.bin2 },
                    { label: 'BIN 3', qty: material.bin3 },
                    { label: 'BIN 4', qty: material.bin4 }
                  ].map((bin, index) => {
                    const status = getBinStatus(bin.qty, material.qtyPerBin);
                    const StatusIcon = status.icon;
                    const binPercentage = Math.round((bin.qty / material.qtyPerBin) * 100);
                    
                    return (
                      <div key={index} className="text-center">
                        <div className={`rounded-lg p-3 ${status.color} mb-2`}>
                          <StatusIcon className="w-4 h-4 mx-auto mb-1" />
                          <div className="font-bold text-sm">{bin.qty}</div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{bin.label}</div>
                        <div className="text-xs text-gray-500">{binPercentage}%</div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons - Simple and Direct */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  {/* Take Material Button */}
                  <button
                    onClick={(e) => handleTakeClick(material, e)}
                    disabled={!isAvailable}
                    className={`
                      flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      ${isAvailable 
                        ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800 cursor-pointer shadow-sm hover:shadow-md' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    style={{ pointerEvents: 'auto' }}
                    type="button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isAvailable ? 'Ambil Material' : 'Stok Kosong'}
                  </button>

                  {/* Fill Material Button */}
                  <button
                    onClick={(e) => handleFillClick(material, e)}
                    className="
                      flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-gray-100 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                    "
                    style={{ pointerEvents: 'auto' }}
                    type="button"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Isi Material
                  </button>
                </div>

                {/* Alternative Button using UI Components - Backup method */}
                <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-100">
                  <Button 
                    onClick={(e) => handleTakeClick(material, e)}
                    disabled={!isAvailable}
                    className="flex-1"
                    variant={isAvailable ? "default" : "secondary"}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isAvailable ? 'Ambil (UI)' : 'Kosong (UI)'}
                  </Button>
                  <Button 
                    onClick={(e) => handleFillClick(material, e)}
                    className="flex-1"
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Isi (UI)
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {materials.length > 0 && (
        <Card className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
              <div className="text-xs text-gray-600">Total Materials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {materials.filter(m => hasAvailableStock(m)).length}
              </div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {materials.filter(m => !hasAvailableStock(m)).length}
              </div>
              <div className="text-xs text-gray-600">Empty</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {materials.reduce((sum, m) => sum + getTotalAvailable(m), 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Stock</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}