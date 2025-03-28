import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { ItemDetails } from './pages/ItemDetails';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { UserProfile } from './pages/UserProfile';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { ProtectedRoute } from './components/ProtectedRoute';
import { VoiceRecognitionProvider } from './components/VoiceRecognitionProvider';
import { toast } from 'sonner';
import { Mic, AlertTriangle, X } from 'lucide-react';

function App() {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Request microphone permission early on app load
  useEffect(() => {
    // Check if we have already requested permission during this session
    if (!permissionRequested) {
      setPermissionRequested(true);
      
      // Show permission dialog first
      setShowPermissionDialog(true);
    }
  }, [permissionRequested]);

  const requestMicrophonePermission = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone permission granted');
        setShowPermissionDialog(false);
        toast.success('Microphone access granted. Voice commands are now available!');
      })
      .catch((error) => {
        console.error('Microphone access error:', error);
        setShowPermissionDialog(false);
        
        if (error.name === 'NotAllowedError') {
          toast.error('Microphone access denied. Voice commands will not work.', {
            duration: 5000,
          });
        } else {
          toast.error('Microphone not available. Voice commands will not work.', {
            duration: 5000,
          });
        }
      });
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <VoiceRecognitionProvider>
          {/* Microphone Permission Dialog */}
          {showPermissionDialog && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Mic className="h-5 w-5 mr-2 text-primary" />
                    Microphone Access
                  </h2>
                  <button 
                    onClick={() => setShowPermissionDialog(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    AblEats needs access to your microphone to enable voice commands for our accessible interface.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      When prompted by your browser, please click "Allow" to enable voice control features. You can change this setting at any time.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPermissionDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={requestMicrophonePermission}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover-glow"
                  >
                    Enable Voice Commands
                  </button>
                </div>
              </div>
            </div>
          )}
        
          <Layout>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Layout>
          <Toaster richColors position="top-center" />
        </VoiceRecognitionProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;