import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ModeSelector } from '../components/ModeSelector';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { Helmet } from 'react-helmet-async';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function Welcome() {
  const { mode, textSize, setMode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();

  // Automatically trigger voice mode when the page loads
  useEffect(() => {
    // Ensure we're in voice mode
    setMode('voice');
    
    // Speak the welcome message with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      speak('Welcome to AblEats. Your accessible food delivery platform. Voice commands are now active. Try saying "Help" to hear available commands.');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [speak, setMode]);

  const textSizeClasses = {
    normal: 'text-5xl md:text-7xl',
    large: 'text-6xl md:text-8xl',
    'x-large': 'text-7xl md:text-9xl',
  };

  return (
    <>
      <Helmet>
        <title>Welcome to AblEats - Accessible Food Delivery</title>
        <meta name="description" content="AblEats - Your accessible food delivery platform. Choose your preferred interaction mode and start ordering food today." />
      </Helmet>
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10" />
        
        <h1 className={`${textSizeClasses[textSize]} font-bold mb-6 gradient-text animate-float`}>
          Welcome to AblEats
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Your accessible food delivery platform. Choose your preferred interaction mode below.
        </p>

        <ModeSelector autoStart={true} />

        <div className="mt-12">
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full 
                     bg-gradient-to-r from-primary to-secondary text-white hover-glow
                     md:py-4 md:text-lg md:px-10"
            role="button"
            aria-label="Continue to home page"
          >
            Continue to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <AccessibilityToolbar />
      </div>
    </>
  );
}