import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();

  // Calculate order details
  const subtotal = getTotalPrice();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Speak cart summary when page loads
  useEffect(() => {
    if (mode === 'voice') {
      const message = items.length > 0
        ? `You have ${items.length} items in your cart. Total amount is ${total} rupees. Say "proceed to checkout" to place your order, or "help" to hear available commands.`
        : 'Your cart is empty. Say "go to home" to browse food items.';
      speak(message);
    }
  }, [mode, items.length, total, speak]);

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = (event: Event) => {
      const customEvent = event as CustomEvent<{command: string}>;
      if (!customEvent.detail?.command) return;

      const command = customEvent.detail.command.toLowerCase();
      console.log('Cart received command:', command);

      // Handle help command
      if (command === 'help') {
        speak(
          'Available commands: Say "proceed to checkout" to place your order, ' +
          '"clear cart" to remove all items, ' +
          '"update quantity" followed by item name and number to change quantity, ' +
          'or "go to home" to continue shopping.'
        );
        return;
      }

      // Handle clear cart command
      if (command === 'clear cart') {
        clearCart();
        speak('Cart has been cleared');
        toast.success('Cart cleared');
        return;
      }

      // Handle checkout command
      if (command === 'proceed to checkout' || 
          command === 'checkout' || 
          command === 'place order') {
        if (items.length > 0) {
          speak('Taking you to checkout');
          navigate('/checkout');
        } else {
          speak('Your cart is empty. Please add items before checking out.');
        }
        return;
      }

      // Handle update quantity commands
      if (command.startsWith('update quantity') || command.startsWith('set quantity')) {
        const parts = command.split(' ');
        const quantity = parseInt(parts[parts.length - 1]);
        const itemName = parts.slice(2, -1).join(' ');
        
        const item = items.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
        if (item && !isNaN(quantity) && quantity > 0) {
          updateQuantity(item.id, quantity);
          speak(`Updated ${item.name} quantity to ${quantity}`);
          toast.success(`Updated quantity`, {
            description: `Set ${item.name} quantity to ${quantity}`
          });
        }
        return;
      }
    };

    window.addEventListener('voice-command', handleVoiceCommand);
    return () => window.removeEventListener('voice-command', handleVoiceCommand);
  }, [items, clearCart, updateQuantity, speak, navigate]);

  const handleQuantityChange = (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(itemId, newQuantity);
      
      // Provide audio feedback
      if (mode === 'voice') {
        const item = items.find(item => item.id === itemId);
        if (item) {
          speak(`${item.name} quantity updated to ${newQuantity}`);
        }
      }
    } else if (newQuantity < 1) {
      // If quantity becomes less than 1, ask for confirmation to remove
      removeItem(itemId);
      
      // Provide audio feedback
      if (mode === 'voice') {
        const item = items.find(item => item.id === itemId);
        if (item) {
          speak(`${item.name} removed from cart`);
        }
      }
      toast.success('Item removed from cart');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    removeItem(itemId);
    
    // Provide audio feedback
    if (mode === 'voice' && item) {
      speak(`${item.name} removed from cart`);
    }
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      
      // Provide audio feedback
      if (mode === 'voice') {
        speak('Cart cleared. All items have been removed.');
      }
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    navigate('/checkout');
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak('Proceeding to checkout');
    }
  };

  return (
    <>
      <Helmet>
        <title>{items.length > 0 ? `Your Cart (${items.length} items) - AblEats` : 'Your Cart - AblEats'}</title>
        <meta name="description" content={items.length > 0 ? `Review your cart with ${items.length} items and proceed to checkout.` : 'Your cart is currently empty. Browse our menu to add delicious items.'} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-8"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="glass-effect p-8 rounded-2xl text-center" role="alert" aria-live="polite">
            <div className="flex flex-col items-center justify-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/home')}
                className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary 
                             text-white font-medium hover:opacity-90 transition-opacity"
                aria-label="Browse menu to add items"
              >
                Browse Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="sr-only" aria-live="polite">
                You have {items.length} items in your cart.
              </div>
              
              <div role="table" aria-label="Cart items">
                <div role="rowgroup">
                  {items.map((item) => (
                    <div key={item.id} className="glass-effect p-4 rounded-xl mb-4" role="row">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow" role="cell">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-1">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold" role="cell">₹{item.price}</span>
                            <div className="flex items-center space-x-3" role="cell">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label={`Decrease quantity of ${item.name}, current quantity is ${item.quantity}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span aria-live="polite" aria-atomic="true">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label={`Increase quantity of ${item.name}, current quantity is ${item.quantity}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 rounded-full text-red-500 hover:bg-red-50"
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
                aria-label="Clear all items from cart"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="glass-effect p-6 rounded-xl sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity} x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="flex justify-between font-semibold">
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
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary 
                             text-white font-medium hover:opacity-90 transition-opacity mt-6
                             focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Proceed to checkout. Total amount ${total.toFixed(2)} rupees`}
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By proceeding, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}