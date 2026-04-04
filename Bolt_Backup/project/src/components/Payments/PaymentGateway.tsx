import React, { useState } from 'react';
import { CreditCard, Smartphone, QrCode, Shield, CheckCircle, Download, Receipt } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';

interface PaymentGatewayProps {
  amount: number;
  description: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  description,
  onSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction ID
    const txnId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setTransactionId(txnId);
    setProcessing(false);
    setPaymentComplete(true);
  };

  const handlePaymentSuccess = () => {
    onSuccess(transactionId);
  };

  const generateReceipt = () => {
    // Generate receipt data
    const receiptData = {
      transactionId,
      amount,
      description,
      date: new Date().toLocaleString(),
      paymentMethod: selectedMethod.toUpperCase(),
      status: 'Success'
    };

    // Create receipt content
    const receiptContent = `
PAYMENT RECEIPT
================

Transaction ID: ${receiptData.transactionId}
Date: ${receiptData.date}
Description: ${receiptData.description}
Amount: ₹${receiptData.amount.toLocaleString()}
Payment Method: ${receiptData.paymentMethod}
Status: ${receiptData.status}

Thank you for your payment!
PropertyHub - Property Management Platform
    `.trim();

    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">₹{amount.toLocaleString()}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedMethod}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full" onClick={generateReceipt}>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full" onClick={handlePaymentSuccess}>
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
            <p className="text-gray-600 mt-1">{description}</p>
            <p className="text-2xl font-bold text-primary-600 mt-2">₹{amount.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={`w-full p-3 border rounded-lg flex items-center space-x-3 transition-colors ${
                    selectedMethod === 'upi'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">UPI Payment</span>
                  <div className="flex-1 text-right">
                    <span className="text-xs text-green-600">Instant • Free</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`w-full p-3 border rounded-lg flex items-center space-x-3 transition-colors ${
                    selectedMethod === 'card'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`w-full p-3 border rounded-lg flex items-center space-x-3 transition-colors ${
                    selectedMethod === 'netbanking'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">Net Banking</span>
                </button>
              </div>
            </div>

            {/* UPI Details */}
            {selectedMethod === 'upi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@paytm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Or scan QR code</p>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Card Details */}
            {selectedMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handlePayment}
                disabled={processing || (selectedMethod === 'upi' && !upiId)}
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ₹${amount.toLocaleString()}`
                )}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={processing}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentGateway;