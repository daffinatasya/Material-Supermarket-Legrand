import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, ArrowLeft, Lock } from 'lucide-react';
import { Screen } from '../App';

interface CardPaymentScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  getTotalPrice: () => number;
  handlePaymentComplete: (amount: number) => void;
}

export function CardPaymentScreen({ 
  setCurrentScreen, 
  getTotalPrice,
  handlePaymentComplete 
}: CardPaymentScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = getTotalPrice();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = () => {
    if (cardNumber.replace(/\s/g, '').length === 16 && expiryDate.length === 5 && cvv.length === 3) {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        handlePaymentComplete(totalAmount);
      }, 3000);
    }
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && expiryDate.length === 5 && cvv.length === 3;

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
          <h1 className="text-xl font-semibold text-gray-800">Card Payment</h1>
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

          {/* Title */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="mr-2 text-blue-600" size={24} />
                <h2 className="text-lg font-semibold text-blue-800">
                  Enter your card details for online payment.
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Card Form */}
          <Card className="bg-white">
            <CardContent className="p-6 space-y-4">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="text-lg h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    className="text-lg h-12"
                  />
                </div>

                {/* CVV */}
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="text-lg h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Lock className="mr-2 text-green-600" size={20} />
                <div>
                  <p className="text-green-800 font-medium">Secure Payment</p>
                  <p className="text-green-600 text-sm">Your card details are encrypted and secure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proceed Button */}
          <div className="pb-6">
            <Button
              onClick={handlePayment}
              disabled={!isFormValid || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12 active:scale-95 transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}