import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CreditCard, Banknote, QrCode, Smartphone, ArrowLeft } from 'lucide-react';
import { Screen, PaymentMethod } from '../App';

interface PaymentMethodScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  getTotalPrice: () => number;
  handlePaymentComplete: (amount: number) => void;
}

export function PaymentMethodScreen({ 
  setCurrentScreen, 
  setSelectedPaymentMethod, 
  getTotalPrice,
  handlePaymentComplete 
}: PaymentMethodScreenProps) {
  const totalAmount = getTotalPrice();

  const handlePaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    switch (method) {
      case 'cash':
        setCurrentScreen('cash-payment');
        break;
      case 'card':
        setCurrentScreen('card-payment');
        break;
      case 'ewallet':
        setCurrentScreen('ewallet-payment');
        break;
      case 'qr':
        setCurrentScreen('qr-payment');
        break;
    }
  };

  const paymentMethods = [
    {
      id: 'cash' as PaymentMethod,
      name: 'Cash',
      icon: Banknote,
      color: 'bg-green-100 text-green-700 border-green-200',
      description: 'Pay with cash upon delivery'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      description: 'Enter card details for online payment'
    },
    {
      id: 'qr' as PaymentMethod,
      name: 'QR Code',
      icon: QrCode,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      description: 'Scan QR code with your banking app'
    },
    {
      id: 'ewallet' as PaymentMethod,
      name: 'eWallet',
      icon: Smartphone,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      description: 'Pay with PayPal, Apple Pay, GrabPay, etc.'
    }
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* App Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentScreen('scanning')}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Payment</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Total Amount */}
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <h2 className="text-gray-600 mb-2">Total Amount</h2>
              <div className="text-3xl font-bold text-green-600">
                RM{totalAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800 px-1">Select Payment Method</h3>
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className={`${method.color} border-2 cursor-pointer active:scale-95 transition-all duration-200`}
                  onClick={() => handlePaymentMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white rounded-full p-4 shadow-md">
                        <IconComponent size={32} className={method.color.split(' ')[1]} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{method.name}</h3>
                        <p className="text-sm opacity-75 mt-1">{method.description}</p>
                      </div>
                      <div className="text-gray-400">
                        <ArrowLeft size={20} className="rotate-180" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Payment Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-3">How to Pay</h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• <strong>Cash:</strong> Pay with cash upon delivery</li>
                <li>• <strong>Card:</strong> Enter card details for secure online payment</li>
                <li>• <strong>QR Code:</strong> Scan QR code with your banking app</li>
                <li>• <strong>eWallet:</strong> Use PayPal, Apple Pay, GrabPay, or other e-wallets</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}