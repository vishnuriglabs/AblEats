import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const timeoutRef = useRef<number | null>(null);

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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!hasPermission) {
      toast.error('Microphone access is required. Please check your browser settings');
      return null;
    }

    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return null;
    }

    stopListening();

    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      retryCountRef.current = 0;
      toast.info('Listening... Speak now');
      
      timeoutRef.current = window.setTimeout(() => {
        if (recognitionRef.current === recognition) {
          stopListening();
          toast.info('No speech detected. Please try speaking again');
        }
      }, 5000);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
      stopListening();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech' && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        toast.info(`Listening... (Attempt ${retryCountRef.current + 1}/${maxRetries + 1})`);
        
        setTimeout(() => {
          if (recognitionRef.current === recognition) {
            recognition.start();
          }
        }, 1000);
      } else {
        stopListening();
        switch (event.error) {
          case 'no-speech':
            toast.error('No speech detected. Please try speaking again');
            break;
          case 'audio-capture':
            toast.error('No microphone detected. Please check your device');
            break;
          case 'not-allowed':
            toast.error('Microphone access denied. Please allow access in settings');
            setHasPermission(false);
            break;
          default:
            toast.error(`Speech recognition error: ${event.error}`);
        }
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
      return recognition;
    } catch (error) {
      console.error('Speech recognition start error:', error);
      toast.error('Failed to start speech recognition. Please try again');
      return null;
    }
  }, [hasPermission, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasPermission
  };
}