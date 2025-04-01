import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ContinuousSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  lastCommand: string;
  startListening: () => void;
  stopListening: () => void;
  hasPermission: boolean | null;
}

export function useContinuousSpeechRecognition(): ContinuousSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check microphone permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch((error) => {
        console.error('Microphone access error:', error);
        setHasPermission(false);
        if (error.name === 'NotAllowedError') {
          toast.error('Please allow microphone access in your browser settings');
        } else {
          toast.error('Microphone not available. Please check your device settings');
        }
      });
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!hasPermission) {
      toast.error('Microphone access is required for voice commands');
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    stopListening();

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Set to false for single command at a time
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      // Clear previous transcript when starting new recognition
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      // Get only the last result
      const lastResult = event.results[event.results.length - 1];
      const currentTranscript = lastResult[0].transcript.trim();
      
      console.log('New transcript:', currentTranscript);
      setTranscript(currentTranscript);
      setLastCommand(currentTranscript);

      // Stop the current recognition instance
      stopListening();

      // Start a new recognition instance after a short delay
      setTimeout(() => {
        startListening();
      }, 100);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Don't show error for no speech, just restart
        startListening();
        return;
      }
      
      switch (event.error) {
        case 'audio-capture':
          toast.error('No microphone detected');
          break;
        case 'not-allowed':
          toast.error('Microphone access denied');
          setHasPermission(false);
          break;
        default:
          toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Only restart if we haven't already stopped intentionally
      if (recognitionRef.current === recognition) {
        startListening();
      }
    };

    try {
      recognition.start();
      console.log('Started speech recognition');
    } catch (error) {
      console.error('Speech recognition start error:', error);
      toast.error('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [hasPermission, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    transcript,
    lastCommand,
    startListening,
    stopListening,
    hasPermission
  };
} 