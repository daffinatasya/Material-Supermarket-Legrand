import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { 
  CheckCircle, 
  Printer, 
  Mail, 
  Star, 
  Home, 
  Gift, 
  QrCode,
  Share2,
  Download,
  Smartphone,
  Leaf,
  MessageCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { CartItem, Receipt, User } from '../App';

interface ReceiptScreenProps {
  cartItems: CartItem[];
  totalPaid: number;
  resetCheckout: () => void;
  currentReceipt: Receipt | null;
  user: User | null;
}

export function ReceiptScreen({ cartItems, totalPaid, resetCheckout, currentReceipt, user }: ReceiptScreenProps) {
  const [email, setEmail] = useState(user?.email || '');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [selectedShare, setSelectedShare] = useState<string | null>(null);

  const loyaltyPoints = Math.floor(totalPaid * 2);
  const receiptUrl = `https://payease.com/receipts/${currentReceipt?.id}`;

  const handleSendDigitalReceipt = () => {
    if (email) {
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setShowEmailInput(false);
      }, 3000);
    }
  };

  const handleCopyReceiptUrl = () => {
    navigator.clipboard.writeText(receiptUrl);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleShareToApp = (app: string) => {
    setSelectedShare(app);
    // Simulate sharing
    setTimeout(() => {
      setSelectedShare(null);
      alert(`Receipt shared to ${app} successfully!`);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    // Simulate PDF download
    alert('Digital receipt downloaded as PDF!');
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Success Header */}
          <div className="text-center mb-6 pt-6">
            <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">Your digital receipt is ready</p>
          </div>

          {/* Digital Receipt Card */}
          <Card className="mb-4 bg-white shadow-lg border-green-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">PayEase</h2>
                <p className="text-sm text-gray-600">Digital Receipt</p>
                <div className="flex items-center justify-center mt-2">
                  <Leaf className="text-green-500 mr-1" size={16} />
                  <span className="text-xs text-green-600 font-medium">Eco-Friendly</span>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Receipt ID</p>
                    <p className="font-mono font-medium">{currentReceipt?.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-medium">{currentReceipt?.timestamp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{currentReceipt?.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{currentReceipt?.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Items List */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="font-semibold mb-3 text-gray-800">Items Purchased</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} × RM{item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold text-gray-800">RM{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-green-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">RM{totalPaid.toFixed(2)}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="text-center mb-4">
                <Button
                  onClick={() => setShowQR(!showQR)}
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <QrCode className="mr-2" size={16} />
                  {showQR ? 'Hide QR Code' : 'Show Receipt QR Code'}
                </Button>
                
                {showQR && (
                  <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="w-32 h-32 bg-gray-900 mx-auto mb-2 rounded-lg flex items-center justify-center">
                      <QrCode className="text-white" size={80} />
                    </div>
                    <p className="text-xs text-gray-600">Scan to view receipt online</p>
                    <div className="flex items-center justify-center mt-2">
                      <Button
                        onClick={handleCopyReceiptUrl}
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        <Copy className="mr-1" size={12} />
                        {copiedToClipboard ? 'Copied!' : 'Copy Link'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Points */}
          <Card className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center text-orange-700 mb-2">
                <Gift className="mr-2" size={24} />
                <span className="font-bold text-lg">+{loyaltyPoints} Points Earned! 🎉</span>
              </div>
              <p className="text-sm text-orange-600 text-center">
                Points automatically added to your PayEase account
              </p>
            </CardContent>
          </Card>

          {/* Digital Receipt Options */}
          <Card className="mb-4 bg-white">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Smartphone className="mr-2 text-green-600" size={20} />
                Digital Receipt Options
              </h3>
              
              <div className="space-y-3">
                {/* Email Receipt */}
                {!showEmailInput ? (
                  <Button
                    onClick={() => setShowEmailInput(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 active:scale-95 transition-all duration-200"
                  >
                    <Mail className="mr-2" size={20} />
                    Email Digital Receipt
                  </Button>
                ) : (
                  <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSendDigitalReceipt}
                        disabled={!email || emailSent}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10"
                      >
                        {emailSent ? 'Email Sent! ✓' : 'Send Email'}
                      </Button>
                      <Button
                        onClick={() => setShowEmailInput(false)}
                        variant="outline"
                        className="flex-1 h-10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Download PDF */}
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 h-12 active:scale-95 transition-all duration-200"
                >
                  <Download className="mr-2" size={20} />
                  Download PDF Receipt
                </Button>

                {/* Share Options */}
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium mb-3 text-gray-700">Share Receipt</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleShareToApp('WhatsApp')}
                      variant="outline"
                      size="sm"
                      disabled={selectedShare === 'WhatsApp'}
                      className="h-12 flex flex-col items-center justify-center p-2"
                    >
                      <MessageCircle size={16} className="mb-1" />
                      <span className="text-xs">WhatsApp</span>
                    </Button>
                    <Button
                      onClick={() => handleShareToApp('Email')}
                      variant="outline"
                      size="sm"
                      disabled={selectedShare === 'Email'}
                      className="h-12 flex flex-col items-center justify-center p-2"
                    >
                      <Mail size={16} className="mb-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button
                      onClick={() => handleShareToApp('More')}
                      variant="outline"
                      size="sm"
                      disabled={selectedShare === 'More'}
                      className="h-12 flex flex-col items-center justify-center p-2"
                    >
                      <Share2 size={16} className="mb-1" />
                      <span className="text-xs">More</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="mb-4 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="text-green-600 mr-2" size={20} />
                <span className="font-semibold text-green-800">Eco-Friendly Choice</span>
              </div>
              <p className="text-sm text-green-700 text-center">
                By choosing digital receipt, you've helped save paper and reduce environmental impact. Thank you! 🌱
              </p>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card className="mb-4 bg-white">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="font-medium mb-3 text-gray-800">Rate Your PayEase Experience</p>
                <div className="flex justify-center space-x-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className="text-yellow-400 cursor-pointer active:scale-95 transition-all duration-200 hover:text-yellow-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Your feedback helps us improve</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="text-center text-gray-500 text-sm mb-4 space-y-2">
            <p className="font-medium">Thank you for choosing PayEase!</p>
            <p>🌟 Follow us on social media for exclusive deals</p>
            <p>📞 Support: 1-800-PAYEASE | 📧 help@payease.com</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-green-600 hover:text-green-700"
            >
              <ExternalLink className="mr-1" size={14} />
              Visit PayEase Website
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="bg-white border-t border-gray-200 p-4">
        <Button
          onClick={resetCheckout}
          className="bg-green-600 hover:bg-green-700 text-white w-full h-14 text-lg active:scale-95 transition-all duration-200"
        >
          <Home className="mr-2" size={24} />
          Start New Checkout
        </Button>
      </div>
    </div>
  );
}