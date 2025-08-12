import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Smartphone, ArrowLeft, CheckCircle } from 'lucide-react';
import { Screen } from '../App';

interface EWalletPaymentScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  getTotalPrice: () => number;
  handlePaymentComplete: (amount: number) => void;
}

export function EWalletPaymentScreen({ 
  setCurrentScreen, 
  getTotalPrice,
  handlePaymentComplete 
}: EWalletPaymentScreenProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = getTotalPrice();

  const eWallets = [
    {
      id: 'paypal',
      name: 'PayPal',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '💙'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: '🍎'
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '🟢'
    },
    {
      id: 'touchngo',
      name: 'Touch \'n Go',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: '🔴'
    }
  ];

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const handlePayment = () => {
    if (selectedWallet) {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        handlePaymentComplete(totalAmount);
      }, 3000);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* App Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentScreen('payment')}
            className="p-2 -ml-2"
            disabled={isProcessing}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">E-Wallet Payment</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Payment Amount */}
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <h2 className="text-gray-600 mb-2">Amount to Pay</h2>
              <div className="text-3xl font-bold text-green-600">
                RM{totalAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* E-Wallet Instructions */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Smartphone className="mr-2 text-purple-600" size={24} />
                <h2 className="text-lg font-semibold text-purple-800">
                  Pay with your preferred e-wallet.
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* E-Wallet Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800 px-1">Select Your E-Wallet</h3>
            {eWallets.map((wallet) => (
              <Card 
                key={wallet.id}
                className={`${wallet.color} border-2 cursor-pointer active:scale-95 transition-all duration-200 ${
                  selectedWallet === wallet.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                }`}
                onClick={() => handleWalletSelect(wallet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-full p-4 shadow-md text-2xl">
                      {wallet.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{wallet.name}</h3>
                      <p className="text-sm opacity-75 mt-1">
                        {wallet.name === 'PayPal' && 'Pay securely with your PayPal account'}
                        {wallet.name === 'Apple Pay' && 'Pay with Face ID or Touch ID'}
                        {wallet.name === 'GrabPay' && 'Pay with GrabPay wallet'}
                        {wallet.name === 'Touch \'n Go' && 'Pay with Touch \'n Go eWallet'}
                      </p>
                    </div>
                    {selectedWallet === wallet.id && (
                      <CheckCircle className="text-purple-600" size={24} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-3">How E-Wallet Payment Works</h3>
              <ol className="space-y-2 text-blue-700 text-sm">
                <li>1. Select your preferred e-wallet above</li>
                <li>2. Tap "Proceed to Payment" button</li>
                <li>3. You'll be redirected to your e-wallet app</li>
                <li>4. Confirm the payment in your e-wallet</li>
                <li>5. Return to complete your purchase</li>
              </ol>
            </CardContent>
          </Card>

          {/* Proceed Button */}
          <div className="pb-6">
            <Button
              onClick={handlePayment}
              disabled={!selectedWallet || isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full h-12 active:scale-95 transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Smartphone className="mr-2" size={20} />
                  Proceed to Payment
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}