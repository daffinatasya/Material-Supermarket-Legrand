import React, { useState } from 'react';
import { Button } from './ui/button';
import { ShoppingCart, HelpCircle, Store, LogOut, User } from 'lucide-react';
import { Screen, User as UserType } from '../App';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';

interface WelcomeScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  user: UserType | null;
  handleLogout: () => void;
}

export function WelcomeScreen({ setCurrentScreen, user, handleLogout }: WelcomeScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    handleLogout();
  };
  return (
    <div className="h-full bg-gradient-to-br from-green-100 via-white to-green-50 relative overflow-hidden flex flex-col">
      {/* Background Shopping Icons */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-6">
          <ShoppingCart size={60} className="text-green-600" />
        </div>
        <div className="absolute top-32 right-8">
          <Store size={45} className="text-green-600" />
        </div>
        <div className="absolute bottom-40 left-12">
          <ShoppingCart size={80} className="text-green-600" />
        </div>
        <div className="absolute bottom-24 right-6">
          <Store size={55} className="text-green-600" />
        </div>
        <div className="absolute top-1/2 left-1/3">
          <ShoppingCart size={35} className="text-green-600" />
        </div>
      </div>

      {/* Account for Status Bar in Phone Mockup */}
      <div className="h-8"></div>

      {/* User Info Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 rounded-full p-2">
            <User className="text-green-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-800">Welcome back!</p>
            <p className="text-sm text-gray-600">{user?.username}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogoutClick}
          className="text-red-600 hover:bg-red-50 p-2"
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="bg-green-600 rounded-full p-5 mb-4">
              <Store size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700">PayEase</h1>
          </div>
          <div className="w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 leading-tight">
            Welcome to PayEase Self-Checkout
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
            Hello {user?.username}! Scan your items and pay quickly with our easy-to-use mobile checkout
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={() => setCurrentScreen('scanning')}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-6 text-xl rounded-2xl shadow-lg active:scale-95 transition-all duration-200"
          >
            <ShoppingCart className="mr-3" size={24} />
            Start Checkout
          </Button>
          
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full py-4 rounded-xl active:scale-95 transition-all duration-200"
          >
            <HelpCircle className="mr-2" size={20} />
            Need Help?
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center text-gray-500 text-sm px-6">
        <p>Tap to begin • Press Help for assistance</p>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}