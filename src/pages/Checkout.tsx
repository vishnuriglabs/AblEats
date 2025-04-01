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
  CreditCard as CardIcon,
  Wallet
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProfileStore } from '../store/profileStore';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

// Define payment method type
type PaymentMethod = 'card' | 'upi' | 'cash';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();
  const profile = useProfileStore();
  
  // Set UPI as default payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  
  // State for delivery address
  const [formData, setFormData] = useState({
    fullName: profile.name,
    phone: profile.phone,
    address: profile.getActiveAddress() || '',
    city: profile.city || '',
    pinCode: profile.pinCode || ''
  });

  // State for payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: profile.cardDetails.cardNumber,
    nameOnCard: profile.cardDetails.nameOnCard,
    expiry: profile.cardDetails.expiry,
    cvv: profile.cardDetails.cvv
  });
  
  const [upiId, setUpiId] = useState(profile.upiId);
  
  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Calculate order totals
  const subtotal = getTotalPrice();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Provide audio feedback when page loads
  useEffect(() => {
    if (mode === 'voice') {
      speak(
        'Checkout page. By default, we are using UPI payment method. ' +
        'If you want to change payment method, say "pay by card" or "cash on delivery". ' +
        'To proceed with UPI payment, say "place order". ' +
        'You can also say "help" for available commands.'
      );
    }
  }, [mode, speak]);

  // Handle voice commands
  useEffect(() => {
    const handleVoiceCommand = (event: Event) => {
      const customEvent = event as CustomEvent<{command: string}>;
      if (!customEvent.detail?.command) return;

      const command = customEvent.detail.command.toLowerCase();
      console.log('Checkout received command:', command);

      // Handle help command
      if (command === 'help') {
        speak(
          'Available commands: Say "place order" to confirm your order with UPI payment, ' +
          'or change payment method by saying "pay by card" or "cash on delivery". ' +
          'Say "review order" to hear order details, or "go back" to return to cart.'
        );
        return;
      }

      // Handle place order command
      if (command === 'place order' || 
          command.includes('place') || 
          command.includes('order') ||
          command.includes('palce') || // Handle common misspelling
          command.includes('oder')) {  // Handle common misspelling
        console.log('Place order command received:', command);
        
        // Validate form
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pinCode) {
          speak('Please fill in all delivery details before placing the order.');
          toast.error('Please fill in all required fields');
          return;
        }

        // Validate payment method specific requirements
        if (paymentMethod === 'upi' && !profile.upiId) {
          speak('Please add your UPI ID in your profile before placing the order.');
          toast.error('Please add your UPI ID in your profile');
          return;
        }

        // Process the order
        try {
          // Clear cart first
          clearCart();
          
          // Provide success feedback before navigation
          speak('Thank you for ordering with AblEats. Your food will be delivered soon.');
          toast.success('Order placed successfully!');
          
          // Navigate to success page after a short delay to ensure speech completes
          setTimeout(() => {
            navigate('/order-success', { replace: true });
          }, 100);
        } catch (error) {
          console.error('Error placing order:', error);
          speak('Sorry, there was an error placing your order. Please try again.');
          toast.error('Failed to place order. Please try again.');
        }
        return;
      }

      // Handle payment method selection
      if (command.includes('pay by card') || command.includes('card payment')) {
        setPaymentMethod('card');
        speak(
          'Payment method changed to card payment. ' +
          'Your saved card details will be used. ' +
          'Say "place order" to complete your purchase.'
        );
        return;
      }

      if (command.includes('cash') || command.includes('cash on delivery')) {
        setPaymentMethod('cash');
        speak(
          'Payment method changed to cash on delivery. ' +
          'You will pay in cash when your order is delivered. ' +
          'Say "place order" to complete your purchase.'
        );
        return;
      }

      // Handle review order command
      if (command === 'review order') {
        speak(
          `Your order total is ${total} rupees, including ${deliveryFee} rupees delivery fee and ${tax} rupees tax. ` +
          `Delivery address is ${formData.address}. ` +
          `Payment will be made via ${
            paymentMethod === 'card' ? 'card payment' : 
            paymentMethod === 'upi' ? 'UPI' : 
            'cash on delivery'
          }. ` +
          'Say "place order" to confirm your order.'
        );
        return;
      }

      // Handle go back command
      if (command === 'go back') {
        navigate('/cart');
        return;
      }
    };

    window.addEventListener('voice-command', handleVoiceCommand);
    return () => window.removeEventListener('voice-command', handleVoiceCommand);
  }, [navigate, speak, total, deliveryFee, tax, formData, paymentMethod, profile.upiId, clearCart]);

  useEffect(() => {
    // Update card details when payment method changes to card
    if (paymentMethod === 'card') {
      setCardDetails({
        cardNumber: profile.cardDetails.cardNumber,
        nameOnCard: profile.cardDetails.nameOnCard,
        expiry: profile.cardDetails.expiry,
        cvv: profile.cardDetails.cvv
      });
    }
  }, [paymentMethod, profile.cardDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pinCode) {
      toast.error('Please fill in all required fields');
      speak('Please fill in all required delivery details before placing the order.');
      return;
    }

    // Validate payment method specific requirements
    if (paymentMethod === 'upi' && !profile.upiId) {
      toast.error('Please add your UPI ID in your profile');
      speak('Please add your UPI ID in your profile before placing the order.');
      return;
    }

    try {
      // Simulate order processing
      speak('Processing your order. Please wait.');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success');
      
      if (mode === 'voice') {
        speak('Order placed successfully! Thank you for ordering with AblEats. Your food will be delivered soon.');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      speak('Sorry, there was an error placing your order. Please try again.');
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
        <meta name="description" content="Complete your food order by providing delivery details." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-primary mb-8"
          aria-label="Back to cart"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cart
        </button>

        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
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
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                             focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="glass-effect p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Wallet className="h-6 w-6 text-primary mr-2" />
                Choose Payment Method
              </h2>

              <div className="space-y-4">
                <label className="block p-4 rounded-lg border border-gray-200 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary focus:ring-primary"
                    />
                    <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                    <span className="font-medium">Card Payment</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pl-8">
                      <p className="text-sm text-gray-600">
                        {profile.cardDetails.cardNumber ? 
                          `Card ending in ${profile.cardDetails.cardNumber.slice(-4)}` :
                          'No card saved. Please add card details in your profile.'}
                      </p>
                    </div>
                  )}
                </label>

                <label className="block p-4 rounded-lg border border-gray-200 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="ml-3 font-medium">UPI Payment</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pl-8">
                      <p className="text-sm text-gray-600">
                        {profile.upiId ? 
                          `UPI ID: ${profile.upiId}` :
                          'No UPI ID saved. Please add UPI details in your profile.'}
                      </p>
                    </div>
                  )}
                </label>

                <label className="block p-4 rounded-lg border border-gray-200 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="ml-3 font-medium">Cash on Delivery</span>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="mt-4 pl-8">
                      <p className="text-sm text-gray-600">Pay in cash when your order is delivered</p>
                    </div>
                  )}
                </label>
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
                  {paymentMethod === 'cash' ? 'Pay in cash' : paymentMethod === 'upi' ? 'Pay via UPI' : 'Pay with Card'}
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