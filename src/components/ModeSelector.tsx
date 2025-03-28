import React, { useEffect, useState } from 'react';
import { Mic, EarOff, MessageSquareOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ModeSelectorProps {
  autoStart?: boolean;
}

export function ModeSelector({ autoStart = false }: ModeSelectorProps) {
  const { mode, setMode } = useAccessibilityStore();
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, startListening, stopListening, isListening } = useSpeechRecognition();
  const [welcomeSpoken, setWelcomeSpoken] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only trigger automatically if autoStart is true
    if (mode === 'voice' && (autoStart || welcomeSpoken)) {
      if (!welcomeSpoken) {
        setWelcomeSpoken(true);
        
        try {
          // No need to speak welcome message here as it's already spoken in Welcome component
          // We'll just start listening
          const timeoutId = setTimeout(() => {
            try {
              const recognition = startListening();
              if (!recognition) {
                setMicError('Voice recognition is not supported in your browser');
                toast.error('Voice recognition is not supported in your browser. Please select a mode manually.', {
                  duration: 5000,
                  icon: <AlertCircle className="h-5 w-5" />,
                });
              }
            } catch (error) {
              console.error('Error starting speech recognition:', error);
              setMicError('Failed to start voice recognition');
            }
          }, 2000);  // Reduced delay since welcome message is already spoken in Welcome component

          return () => clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error in voice mode initialization:', error);
          setMicError('Failed to initialize voice mode');
        }
      }
    }
  }, [mode, speak, startListening, welcomeSpoken, autoStart]);

  useEffect(() => {
    if (transcript) {
      const command = transcript.toLowerCase();
      
      if (command.includes('help')) {
        speak('Available commands: Go to home, Go to restaurants, Search for food, Add to cart, Checkout, Go back, Show vegetarian only, Next item, Previous item, Select item');
        toast.success('Help information provided');
        
        // Start listening again after help message
        const timeoutId = setTimeout(() => {
          startListening();
          toast.info('Listening for your command...', {
            duration: 3000,
          });
        }, 6000);
        return () => clearTimeout(timeoutId);
      } else if (command.includes('go to home') || command.includes('home')) {
        navigate('/home');
      } else if (command.includes('show menu') || command.includes('show all menu')) {
        // Command to show all menu items
        toast.success('Showing all menu items');
        // This would be handled in the restaurant details page
      } else if (command.includes('vegetarian') || command.includes('show veg only')) {
        // Command to filter vegetarian items
        toast.success('Showing vegetarian items only');
        // This would be handled in the restaurant details page
      } else if (command.includes('add to cart')) {
        // Command to add current item to cart
        toast.success('Item added to cart');
        // This would be handled in the restaurant details page
      } else if (command.includes('go to cart') || command.includes('view cart')) {
        navigate('/cart');
      } else if (command.includes('checkout')) {
        navigate('/checkout');
      } else if (command.includes('deaf mode')) {
        setMode('deaf');
        speak('Switching to Deaf Mode');
        toast.success('Switched to Deaf Mode');
      } else if (command.includes('mute mode')) {
        setMode('mute');
        speak('Switching to Mute Mode');
        toast.success('Switched to Mute Mode');
      } else {
        toast.info('Command not recognized. Try saying "Help" for available commands.', {
          duration: 3000,
        });
        // Start listening again after unrecognized command
        const timeoutId = setTimeout(() => {
          startListening();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [transcript, setMode, speak, startListening, navigate]);

  const handleVoiceModeClick = () => {
    setMode('voice');
    setWelcomeSpoken(false);
    setMicError(null);
  };

  return (
    <div id="mode-selector" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <button
        onClick={handleVoiceModeClick}
        className={`glass-effect p-8 rounded-2xl hover-glow transition-all relative ${
          mode === 'voice' ? 'ring-4 ring-primary' : ''
        }`}
        aria-label="Continue in Voice Mode"
      >
        <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
          <Mic className={`h-8 w-8 text-white ${isListening ? 'animate-pulse' : ''}`} />
        </div>
        <h3 className="text-xl font-semibold mb-2 gradient-text">Voice Mode</h3>
        <p className="text-gray-600">Full voice control with speech feedback</p>
        
        {/* Listening Indicator */}
        {isListening && (
          <div className="absolute inset-0 border-2 border-primary rounded-2xl animate-pulse">
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Listening...</span>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {micError && (
          <div className="mt-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {micError}
          </div>
        )}
      </button>

      <button
        onClick={() => {
          cancel(); // Cancel any ongoing speech
          setMode('deaf');
          toast.success('Switched to Deaf Mode');
        }}
        className={`glass-effect p-8 rounded-2xl hover-glow transition-all ${
          mode === 'deaf' ? 'ring-4 ring-primary' : ''
        }`}
        aria-label="Switch to Deaf Mode"
      >
        <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
          <EarOff className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 gradient-text">Deaf Mode</h3>
        <p className="text-gray-600">Text-only interaction with visual cues</p>
      </button>

      <button
        onClick={() => {
          setMode('mute');
          toast.success('Switched to Mute Mode');
        }}
        className={`glass-effect p-8 rounded-2xl hover-glow transition-all ${
          mode === 'mute' ? 'ring-4 ring-primary' : ''
        }`}
        aria-label="Switch to Mute Mode"
      >
        <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
          <MessageSquareOff className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 gradient-text">Mute Mode</h3>
        <p className="text-gray-600">Text input with optional speech output</p>
      </button>
    </div>
  );
}