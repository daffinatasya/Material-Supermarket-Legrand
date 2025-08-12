import React, { useState, useEffect } from 'react';
import { Material } from './MaterialManagementApp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Package2, Minus, Plus, AlertTriangle, Download } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { toast } from 'sonner@2.0.3';

interface MaterialTakeDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeMaterial: (materialId: string, binNumber: number, quantity: number) => void;
}

export function MaterialTakeDialog({ 
  material, 
  open, 
  onOpenChange, 
  onTakeMaterial 
}: MaterialTakeDialogProps) {
  const [selectedBin, setSelectedBin] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state when dialog opens/closes or material changes
  useEffect(() => {
    if (!open || !material) {
      setSelectedBin(null);
      setQuantity(1);
      setShowConfirmation(false);
    }
  }, [open, material]);

  // Don't render anything if no material is selected
  if (!material) {
    return null;
  }

  const bins = [
    { number: 1, available: material.bin1, label: 'BIN 1' },
    { number: 2, available: material.bin2, label: 'BIN 2' },
    { number: 3, available: material.bin3, label: 'BIN 3' },
    { number: 4, available: material.bin4, label: 'BIN 4' }
  ];

  const availableBins = bins.filter(bin => bin.available > 0);
  const selectedBinData = bins.find(bin => bin.number === selectedBin);
  const maxQuantity = selectedBinData?.available || 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleBinSelect = (binNumber: number) => {
    setSelectedBin(binNumber);
    setQuantity(1); // Reset quantity when switching bins
  };

  const handleTakeRequest = () => {
    if (!selectedBin || quantity <= 0) {
      toast.error('Pilih bin dan masukkan jumlah yang valid');
      return;
    }

    if (!material) {
      toast.error('Material tidak valid');
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmTake = () => {
    if (!selectedBin || !material) return;

    console.log('Taking material from dialog:', {
      materialId: material.id,
      binNumber: selectedBin,
      quantity: quantity
    });

    onTakeMaterial(material.id, selectedBin, quantity);
    
    // Reset state and close dialog
    setSelectedBin(null);
    setQuantity(1);
    setShowConfirmation(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedBin(null);
    setQuantity(1);
    setShowConfirmation(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <span>Ambil Material</span>
            </DialogTitle>
            <DialogDescription>
              Pilih bin dan jumlah material yang akan diambil untuk {material.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Material Info */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Package2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-sm font-medium text-gray-900">
                    {material.id}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {material.description}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-2">
                    Kapasitas: {material.qtyPerBin} qty/bin
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Simplified Bin Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Pilih Bin untuk Mengambil Material
              </Label>
              
              {availableBins.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Stok Habis</h3>
                  <p className="text-gray-500">Semua bin untuk material ini sudah kosong</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {bins.map((bin) => {
                    const isAvailable = bin.available > 0;
                    const isSelected = selectedBin === bin.number;
                    
                    return (
                      <button
                        key={bin.number}
                        onClick={() => isAvailable && handleBinSelect(bin.number)}
                        disabled={!isAvailable}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-left
                          ${isAvailable ? 'hover:border-green-300 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                          ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{bin.label}</span>
                          <Badge 
                            variant={isAvailable ? (isSelected ? "default" : "secondary") : "secondary"}
                            className="text-xs"
                          >
                            {bin.available} tersedia
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="text-xs text-green-600 mt-1 flex items-center">
                            <Download className="w-3 h-3 mr-1" />
                            ✓ Dipilih untuk pengambilan
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Selection - Simplified */}
            {selectedBin && maxQuantity > 0 && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Jumlah yang Akan Diambil (Max: {maxQuantity})
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      type="button"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(value);
                      }}
                      min={1}
                      max={maxQuantity}
                      className="w-24 text-center"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(maxQuantity)}
                      type="button"
                    >
                      Max ({maxQuantity})
                    </Button>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Setelah pengambilan:</span>
                      <div className="flex items-center space-x-2">
                        <Package2 className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {selectedBinData?.label}: {Math.max(0, (selectedBinData?.available || 0) - quantity)} tersisa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Batal
            </Button>
            <Button 
              onClick={handleTakeRequest}
              disabled={!selectedBin || quantity <= 0 || availableBins.length === 0}
              className="bg-green-600 hover:bg-green-700"
              type="button"
            >
              <Download className="w-4 h-4 mr-2" />
              Ambil Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Konfirmasi Pengambilan Material"
        description={`Apakah Anda yakin ingin mengambil ${quantity} ${material.description} dari ${selectedBinData?.label}?`}
        confirmText="Ya, Ambil"
        cancelText="Batal"
        icon="download"
        onConfirm={handleConfirmTake}
      />
    </>
  );
}