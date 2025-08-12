import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { ShoppingCart, Plus, Minus, Scan, ArrowLeft } from 'lucide-react';
import { CartItem, Screen } from '../App';

interface ItemScanningScreenProps {
  cartItems: CartItem[];
  setCurrentScreen: (screen: Screen) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
}

const mockItems = [
  { name: 'Milk', price: 5.00, barcode: '123456789' },
  { name: 'Bread', price: 3.50, barcode: '987654321' },
  { name: 'Eggs', price: 4.20, barcode: '456789123' },
  { name: 'Banana', price: 2.80, barcode: '789123456' },
  { name: 'Cheese', price: 8.90, barcode: '321654987' },
  { name: 'Apples', price: 6.50, barcode: '654987321' },
];

export function ItemScanningScreen({ 
  cartItems, 
  setCurrentScreen, 
  addItem, 
  removeItem, 
  updateQuantity, 
  getTotalPrice 
}: ItemScanningScreenProps) {
  const [barcodeInput, setBarcodeInput] = useState('');

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = mockItems.find(item => item.barcode === barcodeInput);
    if (item) {
      addItem({ name: item.name, price: item.price, quantity: 1 });
      setBarcodeInput('');
    } else {
      alert('Item not found. Please try again.');
    }
  };

  const handleQuickAdd = (item: { name: string; price: number }) => {
    addItem({ ...item, quantity: 1 });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* App Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentScreen('welcome')}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Scan Items</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {/* Scanning Area */}
          <Card className="border-2 border-dashed border-green-300 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-100 rounded-full p-6">
                  <Scan size={48} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-700">Scan Barcode</h3>
                <p className="text-green-600">Position barcode in camera view</p>
              </div>
            </CardContent>
          </Card>

          {/* Manual Barcode Entry */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Enter Barcode Manually</h3>
              <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter barcode number"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="h-12"
                />
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 w-full h-12"
                >
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Add Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Quick Add Items</h3>
              <div className="space-y-2">
                {mockItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickAdd(item)}
                    className="w-full justify-between p-4 h-auto"
                  >
                    <span>{item.name}</span>
                    <span className="text-green-600 font-medium">RM{item.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <ShoppingCart className="mr-2" size={20} />
                  Your Items ({cartItems.length})
                </h3>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No items scanned yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">RM{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="font-medium">
                          RM{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="px-3 py-1"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Checkout Bar */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-green-600">
            RM{getTotalPrice().toFixed(2)}
          </span>
        </div>
        <Button
          onClick={() => setCurrentScreen('payment')}
          disabled={cartItems.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg active:scale-95 transition-all duration-200"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}