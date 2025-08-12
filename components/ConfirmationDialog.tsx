import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, Download, Upload } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: 'download' | 'upload' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Batal",
  variant = "default",
  icon = "warning",
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (icon) {
      case 'download':
        return <Download className="w-6 h-6 text-green-600" />;
      case 'upload':
        return <Upload className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getButtonVariant = () => {
    if (variant === 'destructive') return 'destructive';
    if (icon === 'download') return 'default';
    if (icon === 'upload') return 'default';
    return 'default';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button 
            variant={getButtonVariant()}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}