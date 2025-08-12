import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Banknote, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Screen } from '../App';

interface CashPaymentScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  getTotalPrice: () => number;
  handlePaymentComplete: (amount: number) => void;
}

export function CashPaymentScreen({ 
  setCurrentScreen, 
  getTotalPrice,
  handlePaymentComplete 
}: CashPaymentScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = getTotalPrice();

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      handlePaymentComplete(totalAmount);
    }, 2000);
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
          <h1 className="text-xl font-semibold text-gray-800">Cash Payment</h1>
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

          {/* Cash Payment Info */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Banknote className="mr-2 text-green-600" size={32} />
              </div>
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Pay with cash upon delivery.
              </h2>
              <p className="text-green-700 text-lg font-medium">
                Total to pay: RM{totalAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-3 text-orange-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">Payment Reminder</h3>
                  <p className="text-orange-700">
                    Please have the correct amount ready for payment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Payment Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Cash Payment Process</h3>
              <ol className="space-y-2 text-blue-700 text-sm">
                <li>1. Confirm your cash payment below</li>
                <li>2. Proceed to the payment counter</li>
                <li>3. Present your order details to the cashier</li>
                <li>4. Pay the exact amount in cash</li>
                <li>5. Collect your receipt and items</li>
              </ol>
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <div className="pb-6">
            <Button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white w-full h-12 active:scale-95 transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="mr-2" size={20} />
                  Confirm Cash Payment
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}