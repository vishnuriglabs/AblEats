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

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setLastCommand('');
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearTranscript();
    setIsListening(false);
  }, [clearTranscript]);

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

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      clearTranscript();
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map(result => result.transcript)
        .join(' ')
        .trim();
      
      if (currentTranscript) {
        console.log('New transcript:', currentTranscript);
        setTranscript(currentTranscript);
        setLastCommand(currentTranscript);

        // Clear the transcript after a delay
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(clearTranscript, 2000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Don't show error for no speech, just keep listening
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
      console.log('Speech recognition ended, restarting...');
      clearTranscript();
      // Automatically restart if we're supposed to be listening
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
          setIsListening(false);
        }
      }
    };

    try {
      recognition.start();
      console.log('Started continuous speech recognition');
    } catch (error) {
      console.error('Speech recognition start error:', error);
      toast.error('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [hasPermission, stopListening, clearTranscript]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
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