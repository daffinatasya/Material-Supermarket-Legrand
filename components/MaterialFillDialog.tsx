import React, { useState, useEffect } from 'react';
import { Material } from './MaterialManagementApp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Package2, Plus, Upload, Warehouse } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { toast } from 'sonner@2.0.3';

interface MaterialFillDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFillMaterial: (materialId: string, binNumber: number, quantity: number) => void;
}

export function MaterialFillDialog({ 
  material, 
  open, 
  onOpenChange, 
  onFillMaterial 
}: MaterialFillDialogProps) {
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
    { number: 1, current: material.bin1, label: 'BIN 1' },
    { number: 2, current: material.bin2, label: 'BIN 2' },
    { number: 3, current: material.bin3, label: 'BIN 3' },
    { number: 4, current: material.bin4, label: 'BIN 4' }
  ];

  const selectedBinData = bins.find(bin => bin.number === selectedBin);
  const maxCapacity = material.qtyPerBin;
  const currentQuantity = selectedBinData?.current || 0;
  const availableSpace = Math.max(0, maxCapacity - currentQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= availableSpace) {
      setQuantity(newQuantity);
    }
  };

  const handleBinSelect = (binNumber: number) => {
    setSelectedBin(binNumber);
    setQuantity(1); // Reset quantity when switching bins
  };

  const handleFillRequest = () => {
    if (!selectedBin || quantity <= 0) {
      toast.error('Pilih bin dan masukkan jumlah yang valid');
      return;
    }

    if (!material) {
      toast.error('Material tidak valid');
      return;
    }

    if (currentQuantity + quantity > maxCapacity) {
      toast.error('Jumlah melebihi kapasitas maksimum bin');
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmFill = () => {
    if (!selectedBin || !material) return;

    console.log('Filling material from dialog:', {
      materialId: material.id,
      binNumber: selectedBin,
      quantity: quantity
    });

    onFillMaterial(material.id, selectedBin, quantity);
    
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
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Isi Material</span>
            </DialogTitle>
            <DialogDescription>
              Pilih bin dan jumlah material yang akan diisi untuk {material.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Material Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package2 className="w-5 h-5 text-blue-600" />
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
                Pilih Bin untuk Mengisi Material
              </Label>
              
              <div className="grid grid-cols-2 gap-3">
                {bins.map((bin) => {
                  const isSelected = selectedBin === bin.number;
                  const isFull = bin.current >= maxCapacity;
                  const fillPercentage = (bin.current / maxCapacity) * 100;
                  const spaceAvailable = maxCapacity - bin.current;
                  
                  return (
                    <button
                      key={bin.number}
                      onClick={() => !isFull && handleBinSelect(bin.number)}
                      disabled={isFull}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${isFull ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 cursor-pointer'}
                        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{bin.label}</span>
                        <Badge 
                          variant={isFull ? "destructive" : (isSelected ? "default" : "secondary")}
                          className="text-xs"
                        >
                          {bin.current}/{maxCapacity}
                        </Badge>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            isFull ? 'bg-red-500' : isSelected ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {isFull ? 'Bin Penuh' : `${spaceAvailable} ruang kosong`}
                      </div>
                      
                      {isSelected && !isFull && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <Upload className="w-3 h-3 mr-1" />
                          ✓ Dipilih untuk pengisian
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection - Simplified */}
            {selectedBin && availableSpace > 0 && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Jumlah yang Akan Diisi (Max: {availableSpace})
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      type="button"
                    >
                      <Package2 className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(value);
                      }}
                      min={1}
                      max={availableSpace}
                      className="w-24 text-center"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= availableSpace}
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(availableSpace)}
                      type="button"
                    >
                      Penuh ({availableSpace})
                    </Button>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Setelah pengisian:</span>
                      <div className="flex items-center space-x-2">
                        <Warehouse className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {selectedBinData?.label}: {currentQuantity + quantity}/{maxCapacity} 
                          ({Math.round(((currentQuantity + quantity) / maxCapacity) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedBin && availableSpace <= 0 && (
              <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <Warehouse className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
                <div className="text-yellow-700 font-medium mb-1">Bin Sudah Penuh</div>
                <div className="text-sm text-yellow-600">Tidak ada ruang untuk menambah material</div>
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Batal
            </Button>
            <Button 
              onClick={handleFillRequest}
              disabled={!selectedBin || quantity <= 0 || availableSpace <= 0}
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Isi Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Konfirmasi Pengisian Material"
        description={`Apakah Anda yakin ingin mengisi ${quantity} ${material.description} ke ${selectedBinData?.label}?`}
        confirmText="Ya, Isi"
        cancelText="Batal"
        icon="upload"
        onConfirm={handleConfirmFill}
      />
    </>
  );
}