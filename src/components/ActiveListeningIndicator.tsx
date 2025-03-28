import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2, HelpCircle, X } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface ActiveListeningIndicatorProps {
  isListening: boolean;
  transcription: string;
}

export function ActiveListeningIndicator({ isListening, transcription }: ActiveListeningIndicatorProps) {
  const [showTranscription, setShowTranscription] = useState(false);
  const { isSpeaking } = useSpeechSynthesis();

  // Reset transcription visibility
  const hideTranscription = useCallback(() => {
    setShowTranscription(false);
  }, []);

  // Show transcription and set timeout to hide it
  useEffect(() => {
    if (transcription) {
      setShowTranscription(true);
      const timeoutId = window.setTimeout(hideTranscription, 5000);
      return () => window.clearTimeout(timeoutId);
    }
  }, [transcription, hideTranscription]);

  // Generate sound wave animation bars when listening
  const renderSoundWaves = () => {
    return (
      <div className="flex h-4 items-end space-x-0.5 ml-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-1 bg-white animate-wave opacity-80"
            style={{
              height: '100%',
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Hidden element for screen readers */}
      <div className="sr-only" aria-live="assertive">
        {isListening ? 'Listening for voice commands' : ''}
        {transcription ? `Last command heard: ${transcription}` : ''}
      </div>
      
      <div className="fixed top-4 left-4 z-50 flex flex-col items-start">
        {/* Voice indicator */}
        <div className={`
          bg-primary/95 text-white rounded-full py-2 px-3 shadow-lg 
          flex items-center space-x-1 mb-2 transition-all transform
          ${isListening ? 'scale-100 animate-listening-pulse' : 'scale-90'}
          ${isSpeaking ? 'bg-secondary/95' : 'bg-primary/95'}
        `}>
          {isListening ? (
            <>
              <Mic className="h-5 w-5" />
              <span className="text-sm font-medium">Listening</span>
              {renderSoundWaves()}
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="h-5 w-5" />
              <span className="text-sm font-medium">Speaking</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 opacity-70" />
              <span className="text-sm font-medium opacity-70">Voice Ready</span>
            </>
          )}
          
          {/* Help tooltip */}
          <button 
            className="ml-2 bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Show help information"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('voiceCommand', {
                detail: { command: 'help' }
              }));
            }}
          >
            <HelpCircle className="h-3 w-3" />
          </button>
        </div>
        
        {/* Transcription display */}
        {showTranscription && transcription && (
          <div className="bg-white/95 text-gray-800 rounded-lg p-3 shadow-lg max-w-xs break-words relative">
            <button 
              className="absolute -top-2 -right-2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 transition-colors"
              onClick={hideTranscription}
              aria-label="Close transcription"
            >
              <X className="h-3 w-3" />
            </button>
            
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Last heard:</span>
            </div>
            <p className="text-sm">{transcription}</p>
          </div>
        )}
      </div>
    </>
  );
} 