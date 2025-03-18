import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function OrderSuccess() {
  const navigate = useNavigate();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();
  
  // Generate a random order ID
  const orderId = `#${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();

  // Provide audio feedback for screen reader users
  useEffect(() => {
    if (mode === 'voice') {
      speak('Order placed successfully! Your food will be delivered soon. Thank you for ordering with AblEats.');
    }
  }, [mode, speak]);

  // Handle navigation back to home
  const handleBackToHome = () => {
    navigate('/home');
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak('Navigating to home page');
    }
  };

  return (
    <>
      <Helmet>
        <title>Order Confirmed - AblEats</title>
        <meta name="description" content="Your order has been successfully placed. Track your delivery status and enjoy your meal." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto" aria-hidden="true" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">Order Placed Successfully!</h1>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Thank you for your order. Your food is being prepared and will be delivered soon.
            We've sent a confirmation email with your order details.
          </p>
          
          <div className="glass-effect p-6 rounded-xl max-w-md mx-auto my-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-500">Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">{new Date(Date.now() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 mb-6">
              You will receive updates about your order via SMS and email.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToHome}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center mx-auto
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Return to home page"
            >
              <Home className="mr-2 h-5 w-5" aria-hidden="true" /> Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}