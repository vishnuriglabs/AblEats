import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useContinuousSpeechRecognition } from '../hooks/useContinuousSpeechRecognition';
import { useCommandProcessor } from '../hooks/useCommandProcessor';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { ActiveListeningIndicator } from './ActiveListeningIndicator';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface VoiceRecognitionContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasPermission: boolean | null;
}

const VoiceRecognitionContext = createContext<VoiceRecognitionContextType | null>(null);

export const useVoiceRecognition = () => {
  const context = useContext(VoiceRecognitionContext);
  if (!context) {
    throw new Error('useVoiceRecognition must be used within a VoiceRecognitionProvider');
  }
  return context;
};

interface VoiceRecognitionProviderProps {
  children: ReactNode;
}

export function VoiceRecognitionProvider({ children }: VoiceRecognitionProviderProps) {
  const { isListening, transcript, lastCommand, startListening, stopListening, hasPermission } = useContinuousSpeechRecognition();
  const { processCommand } = useCommandProcessor();
  const { mode } = useAccessibilityStore();
  const { speak, cancel } = useSpeechSynthesis();
  const location = useLocation();

  // Welcome message and initial setup
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const welcomeMessage = 
        'Welcome to AblEats, your accessible food delivery platform. ' +
        'Voice commands are now enabled. ' +
        'I am your voice assistant, and I will help you navigate through the application. ' +
        'You can interrupt me at any time by speaking a command. ' +
        'Say Help to hear all available commands. ' +
        'To navigate home, just say Go to Home. ' +
        'I will confirm each command and guide you through the pages.';

      speak(welcomeMessage);
      
      toast.success('Voice Assistant Activated', {
        duration: 5000,
        description: 'Say "Help" anytime to hear available commands'
      });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [speak]);

  // Handle page changes
  useEffect(() => {
    if (mode === 'voice') {
      // Announce the current page
      const pageMessages: { [key: string]: string } = {
        '/': 'Welcome to AblEats. Your accessible food delivery platform. Say Help to hear available commands.',
        '/home': 'You are on the Home page. Here you can browse restaurants and food items. Say Help for navigation options.',
        '/cart': 'You are viewing your Shopping cart. Here you can review your order items. Say Help for available commands.',
        '/checkout': 'You are on the Checkout page. Here you can complete your order. Say Help for assistance.',
        '/profile': 'You are on your Profile page. Here you can view your account details. Say Help for available options.',
        '/order-success': 'Great news! Your order is confirmed and will be delivered soon. Thank you for choosing AblEats.'
      };

      const message = pageMessages[location.pathname] || 'Page loaded. Say Help for navigation options.';
      speak(message);
    }
  }, [location.pathname, mode, speak]);

  // Start listening when in voice mode
  useEffect(() => {
    if (mode === 'voice') {
      if (!isListening && hasPermission) {
        startListening();
      }
    } else {
      if (isListening) {
        stopListening();
      }
    }
  }, [mode, isListening, startListening, stopListening, hasPermission]);

  // Process commands when transcript changes
  useEffect(() => {
    if (transcript && mode === 'voice') {
      // Cancel any ongoing speech when user starts speaking
      cancel();
      console.log('Received transcript:', transcript);
      processCommand(transcript);
    }
  }, [transcript, processCommand, mode, cancel]);
  
  // Listen for the custom voiceCommand event from the help button
  useEffect(() => {
    const handleVoiceCommand = (event: Event) => {
      const customEvent = event as CustomEvent<{command: string}>;
      if (customEvent.detail && customEvent.detail.command) {
        // Cancel any ongoing speech when processing a command
        cancel();
        processCommand(customEvent.detail.command);
      }
    };
    
    window.addEventListener('voiceCommand', handleVoiceCommand);
    
    return () => {
      window.removeEventListener('voiceCommand', handleVoiceCommand);
    };
  }, [processCommand, cancel]);

  return (
    <VoiceRecognitionContext.Provider
      value={{
        isListening,
        startListening,
        stopListening,
        hasPermission
      }}
    >
      {/* Display the active listening indicator on all pages */}
      <ActiveListeningIndicator isListening={isListening} transcription={lastCommand} />
      
      {children}
    </VoiceRecognitionContext.Provider>
  );
} 