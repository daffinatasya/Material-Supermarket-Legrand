import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { QrCode, ArrowLeft, Timer, CheckCircle } from 'lucide-react';
import { Screen } from '../App';

interface QRPaymentScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  getTotalPrice: () => number;
  handlePaymentComplete: (amount: number) => void;
  selectedPaymentMethod: string | null;
}

export function QRPaymentScreen({ 
  setCurrentScreen, 
  getTotalPrice, 
  handlePaymentComplete,
  selectedPaymentMethod 
}: QRPaymentScreenProps) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = getTotalPrice();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentScreen('payment');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setCurrentScreen]);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      handlePaymentComplete(totalAmount);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQRCodeData = () => {
    return `payment://supermart.com/pay?amount=${totalAmount}&method=${selectedPaymentMethod}&id=${Date.now()}`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
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
          <h1 className="text-xl font-semibold text-gray-800">Scan to Pay</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Payment Amount */}
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <h2 className="text-gray-600 mb-2">Amount to Pay</h2>
              <div className="text-3xl font-bold text-green-600">
                RM{totalAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-6">
                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-black flex items-center justify-center mx-auto relative rounded-lg">
                    <div className="absolute inset-4 bg-white rounded"></div>
                    <div className="absolute inset-8 bg-black flex items-center justify-center rounded">
                      <QrCode size={80} className="text-white" />
                    </div>
                    {/* QR Code pattern simulation */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-black rounded-sm"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-sm"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-black rounded-sm"></div>
                    <div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-sm"></div>
                    <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-sm"></div>
                    <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {selectedPaymentMethod === 'qr' ? 'Scan with Banking App' : 'Scan with eWallet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  Use your {selectedPaymentMethod === 'qr' ? 'banking app' : 'eWallet app'} to complete payment
                </p>
                
                {/* Timer */}
                <div className="flex items-center justify-center mb-6 bg-orange-50 rounded-lg p-3">
                  <Timer className="mr-2 text-orange-600" size={20} />
                  <span className="font-medium text-orange-600">
                    Expires in {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Demo Payment Button */}
                <Button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white w-full h-12 mb-4 active:scale-95 transition-all duration-200"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="mr-2" size={20} />
                      Simulate Payment
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500">
                  Demo mode - Real app detects payment automatically
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-3">How to Pay</h3>
              <ol className="space-y-2 text-blue-700 text-sm">
                <li>1. Open your {selectedPaymentMethod === 'qr' ? 'banking' : 'eWallet'} app</li>
                <li>2. Select "Scan to Pay" or "QR Pay"</li>
                <li>3. Point camera at QR code above</li>
                <li>4. Confirm the payment amount</li>
                <li>5. Complete the transaction</li>
              </ol>
            </CardContent>
          </Card>

          {/* Cancel Button */}
          <div className="pb-6">
            <Button
              variant="destructive"
              onClick={() => setCurrentScreen('payment')}
              disabled={isProcessing}
              className="w-full h-12 active:scale-95 transition-all duration-200"
            >
              Cancel Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}