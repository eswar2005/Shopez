/**
 * 结账页面组件 - 处理订单结账流程
 */
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../App'
import { CreditCard, Truck, Shield, MapPin, Phone, Mail } from 'lucide-react'

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export default function Checkout() {
  const { cart, setCart, user } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 计算订单总价
   */
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    if (subtotal >= 50) return 0;
    return selectedShipping === 'express' ? 19.99 : 9.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTax();
  };

  /**
   * 处理表单输入变化
   */
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  /**
   * 处理订单提交
   */
  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 清空购物车
      setCart([]);
      
      // 跳转到订单确认页面
      navigate('/?orderConfirmed=true');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 验证步骤
   */
  const validateStep = (step: number) => {
    if (step === 1) {
      return shippingInfo.firstName && shippingInfo.lastName && 
             shippingInfo.email && shippingInfo.address && 
             shippingInfo.city && shippingInfo.zipCode;
    }
    if (step === 2) {
      return selectedShipping;
    }
    if (step === 3) {
      if (selectedPayment === 'card') {
        return paymentInfo.cardNumber && paymentInfo.expiryMonth && 
               paymentInfo.expiryYear && paymentInfo.cvv && 
               paymentInfo.cardholderName;
      }
      return true;
    }
    return true;
  };

  const steps = [
    { number: 1, title: 'Shipping Information', icon: MapPin },
    { number: 2, title: 'Shipping Method', icon: Truck },
    { number: 3, title: 'Payment Information', icon: CreditCard },
    { number: 4, title: 'Review Order', icon: Shield }
  ];

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-0.5 ml-6 ${
                  currentStep > step.number ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Method</h2>
              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedShipping === 'standard' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedShipping('standard')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Standard Shipping</h3>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                    <span className="font-semibold">
                      {getSubtotal() >= 50 ? 'FREE' : '$9.99'}
                    </span>
                  </div>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedShipping === 'express' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedShipping('express')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Express Shipping</h3>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                    <span className="font-semibold">$19.99</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Information */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedPayment('card')}
                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${
                      selectedPayment === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                </div>
              </div>

              {selectedPayment === 'card' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Month *
                    </label>
                    <select
                      name="expiryMonth"
                      value={paymentInfo.expiryMonth}
                      onChange={handlePaymentChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      required
                    >
                      <option value="">Month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {(i + 1).toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Year *
                    </label>
                    <select
                      name="expiryYear"
                      value={paymentInfo.expiryYear}
                      onChange={handlePaymentChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      required
                    >
                      <option value="">Year</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review Order */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping & Payment Summary */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br/>
                      {shippingInfo.address}<br/>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br/>
                      {shippingInfo.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    <p className="text-sm text-gray-600">
                      {selectedShipping === 'standard' ? 'Standard Shipping (5-7 days)' : 'Express Shipping (2-3 days)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateStep(currentStep)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{getShippingCost() === 0 ? 'FREE' : `${getShippingCost().toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}