import { useCallback, useEffect } from 'react';

interface SpeechSynthesisResult {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisResult {
  // Track if system is currently speaking
  let isSpeaking = false;

  // Function to get the preferred female voice
  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Priority list of female voices
    const preferredVoices = [
      'Microsoft Zira', // Windows
      'Google UK English Female', // Chrome
      'Samantha', // macOS/iOS
      'en-US-JennyNeural', // Edge
      'en-GB-SoniaNeural' // Edge British
    ];

    // Try to find a preferred female voice
    for (const preferredVoice of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferredVoice));
      if (voice) return voice;
    }

    // Fallback to any female or neutral voice
    return voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.includes('Zira') ||
      voice.name.includes('Samantha')
    ) || voices[0];
  };

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech first
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties
    utterance.voice = getPreferredVoice();
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.2; // Slightly higher pitch for more feminine voice
    utterance.volume = 1.0;

    // Set speaking state
    isSpeaking = true;

    utterance.onend = () => {
      isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }, [cancel]);

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    // Load voices immediately
    loadVoices();

    // Some browsers (like Chrome) need this event
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return {
    speak,
    cancel,
    isSpeaking
  };
}