import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Home, 
  Truck, 
  Check, 
  ChevronRight, 
  ShoppingBag, 
  ShoppingCart,
  AlertTriangle, 
  X,
  Phone,
  CreditCard as CardIcon
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

// Define payment method type
type PaymentMethod = 'card' | 'upi' | 'cod';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();
  
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // State for delivery address
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // State for payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  });
  
  const [upiId, setUpiId] = useState('');
  
  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Calculate order totals
  const subtotal = getTotalPrice();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [items, navigate]);
  
  // Provide audio feedback when page loads
  useEffect(() => {
    if (mode === 'voice') {
      speak('Checkout page. Please fill in your delivery address and select a payment method. You can pay with card, UPI, or cash on delivery.');
    }
  }, [mode, speak]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    // Provide audio feedback
    if (mode === 'voice') {
      const methodNames = {
        card: 'Credit or Debit Card',
        upi: 'UPI payment',
        cod: 'Cash on Delivery'
      };
      speak(`Selected payment method: ${methodNames[method]}`);
    }
  };

  const handlePlaceOrder = () => {
    // Show confirmation dialog
    setShowConfirmation(true);
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak(`Please confirm your order. Total amount is ${total.toFixed(2)} rupees. Payment method is ${
        paymentMethod === 'card' ? 'Credit or Debit Card' : 
        paymentMethod === 'upi' ? 'UPI payment' : 
        'Cash on Delivery'
      }`);
    }
  };

  const confirmOrder = () => {
    // Process order
    clearCart();
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak('Order placed successfully! Thank you for ordering with AblEats.');
    }
    
    // Show success message
    toast.success('Order placed successfully!');
    
    // Navigate to order success page
    navigate('/order-success');
  };

  const cancelOrder = () => {
    setShowConfirmation(false);
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak('Order confirmation cancelled. You can modify your order or payment method.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - AblEats</title>
        <meta name="description" content="Complete your order - Choose your payment method and deliver address for your food delivery." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-primary mb-8"
          aria-label="Return to cart"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cart
        </button>

        <div className="flex items-center mb-8">
          <ShoppingBag className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Delivery Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Home className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  {/* Card Payment Option */}
                  <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer
                    ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                      className="sr-only"
                      aria-label="Pay with Credit or Debit Card"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${paymentMethod === 'card' ? 'border-primary' : 'border-gray-400'}`}>
                        {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <CardIcon className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </div>
                  </label>
                  
                  {/* UPI Payment Option */}
                  <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer
                    ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => handlePaymentMethodChange('upi')}
                      className="sr-only"
                      aria-label="Pay with UPI"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${paymentMethod === 'upi' ? 'border-primary' : 'border-gray-400'}`}>
                        {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <Phone className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <span className="font-medium">UPI</span>
                        <p className="text-sm text-gray-500">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
                      </div>
                    </div>
                  </label>
                  
                  {/* COD Payment Option */}
                  <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer
                    ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="sr-only"
                      aria-label="Pay with Cash on Delivery"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${paymentMethod === 'cod' ? 'border-primary' : 'border-gray-400'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <ShoppingBag className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </label>
                </div>
                
                {/* Additional fields based on payment method */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium mb-3">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-xs text-gray-500 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="nameOnCard" className="block text-xs text-gray-500 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="nameOnCard"
                          name="nameOnCard"
                          value={cardDetails.nameOnCard}
                          onChange={handleCardDetailsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="expiry" className="block text-xs text-gray-500 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardDetailsChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          maxLength={5}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-xs text-gray-500 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="***"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'upi' && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium mb-3">UPI Details</h3>
                    <div>
                      <label htmlFor="upiId" className="block text-xs text-gray-500 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="example@upi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center text-sm text-gray-600">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <p>Please keep exact change ready for the delivery person.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-effect p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-3">
                    <span className="flex items-center">
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="ml-2">{item.name}</span>
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span aria-live="polite">₹{total.toFixed(2)}</span>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {paymentMethod === 'cod' ? 'Pay on delivery' : paymentMethod === 'upi' ? 'Pay via UPI' : 'Pay with Card'}
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary 
                           text-white font-medium hover:opacity-90 transition-opacity mt-6
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Place order with ${
                  paymentMethod === 'card' ? 'credit or debit card' : 
                  paymentMethod === 'upi' ? 'UPI payment' : 
                  'cash on delivery'
                } for ${total.toFixed(2)} rupees`}
              >
                Place Order
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full" role="document">
              <div className="flex justify-between items-start mb-4">
                <h2 id="confirmation-title" className="text-xl font-semibold">Confirm Your Order</h2>
                <button
                  onClick={cancelOrder}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Please confirm that you want to place this order for ₹{total.toFixed(2)} using {
                    paymentMethod === 'card' ? 'Credit/Debit Card' : 
                    paymentMethod === 'upi' ? 'UPI' : 
                    'Cash on Delivery'
                  }.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Items ({items.length}):</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery:</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tax:</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelOrder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel order confirmation"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmOrder}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                  aria-label="Confirm and place order"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}