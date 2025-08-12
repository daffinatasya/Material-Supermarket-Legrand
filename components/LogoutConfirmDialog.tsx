import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onClose, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? Your current cart will be cleared and you'll need to sign in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}