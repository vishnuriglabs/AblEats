import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { toast } from 'sonner';

interface CommandProcessorResult {
  processCommand: (command: string) => void;
}

export function useCommandProcessor(): CommandProcessorResult {
  const navigate = useNavigate();
  const { speak, cancel } = useSpeechSynthesis();
  const { setMode, mode } = useAccessibilityStore();

  const emitVoiceCommand = useCallback((command: string) => {
    const event = new CustomEvent('voiceCommand', { 
      detail: { command },
      bubbles: true 
    });
    window.dispatchEvent(event);
    console.log('Emitted voice command:', command);
  }, []);

  const processCommand = useCallback((command: string) => {
    if (!command?.trim()) {
      console.log('Empty command received');
      return;
    }
    
    // Clean and normalize the command by:
    // 1. Converting to lowercase
    // 2. Removing extra whitespace
    // 3. Removing duplicate words/commands
    const normalizedCommand = command.toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word, index, arr) => {
        // Keep word if it's different from the previous word
        return word !== arr[index - 1];
      })
      .join(' ');
    
    // Log the original and normalized commands
    console.log('Original command:', command);
    console.log('Normalized command:', normalizedCommand);
    
    try {
      // Help command
      if (normalizedCommand === 'help' || 
          normalizedCommand.includes('what can i say') || 
          normalizedCommand.includes('what can i do') ||
          normalizedCommand.includes('show commands') ||
          normalizedCommand.includes('available commands')) {
        
        cancel();
        
        const helpMessage = 
          'Here are the available voice commands: ' +
          'For navigation, say "Go to Home". ' +
          'For searching, say "Search for" followed by what you want to find. ' +
          'To filter results, say "Show restaurants" or "Show foods". ' +
          'For dietary preferences, say "Show vegetarian only" or "Show all items". ' +
          'For accessibility modes, say: Voice mode, Deaf mode, or Mute mode. ' +
          'Say Help again to hear these commands again.';
        
        speak(helpMessage);
        toast.success('Help information provided');
        return;
      }
      
      // Navigation command - only Home
      if (normalizedCommand === 'go to home' || 
          normalizedCommand === 'home' ||
          normalizedCommand === 'go home') {
        console.log('Home command recognized, navigating...');
        speak('Navigating to home page');
        toast.success('Navigating to home page');
        navigate('/home');
        return;
      }

      // Search commands
      if (normalizedCommand.startsWith('search for ')) {
        const searchTerm = normalizedCommand.replace('search for ', '');
        speak(`Searching for ${searchTerm}`);
        emitVoiceCommand(`search for ${searchTerm}`);
        return;
      }

      // Filter commands - don't navigate for these
      if (normalizedCommand === 'show restaurants' || 
          normalizedCommand === 'view restaurants') {
        console.log('Filter command recognized');
        speak('Showing restaurants');
        emitVoiceCommand('show restaurants');
        return;
      }

      if (normalizedCommand === 'show foods' || 
          normalizedCommand === 'view foods') {
        console.log('Filter command recognized');
        speak('Showing food items');
        emitVoiceCommand('show foods');
        return;
      }

      // Dietary preference commands
      if (normalizedCommand.includes('vegetarian') || 
          normalizedCommand.includes('veg only')) {
        speak('Showing vegetarian items only');
        emitVoiceCommand('show vegetarian only');
        return;
      }

      if (normalizedCommand === 'show all' || 
          normalizedCommand === 'show everything') {
        speak('Showing all items');
        emitVoiceCommand('show all items');
        return;
      }
      
      // Mode switching commands
      if (normalizedCommand.includes('voice mode')) {
        if (mode !== 'voice') {
          speak('Switching to voice mode');
          toast.success('Switched to Voice Mode');
          setMode('voice');
        } else {
          speak('Already in voice mode');
          toast.info('Already in voice mode');
        }
        return;
      }
      
      if (normalizedCommand.includes('deaf mode')) {
        if (mode !== 'deaf') {
          speak('Switching to deaf mode');
          toast.success('Switched to Deaf Mode');
          setMode('deaf');
        } else {
          speak('Already in deaf mode');
          toast.info('Already in deaf mode');
        }
        return;
      }
      
      if (normalizedCommand.includes('mute mode')) {
        if (mode !== 'mute') {
          speak('Switching to mute mode');
          toast.success('Switched to Mute Mode');
          setMode('mute');
        } else {
          speak('Already in mute mode');
          toast.info('Already in mute mode');
        }
        return;
      }
      
      // If no commands matched
      console.log('Command not recognized:', normalizedCommand);
      speak('Command not recognized. Try saying Help for available commands.');
      toast.info('Command not recognized. Try saying "Help" for available commands.', {
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error processing command:', error);
      speak('An error occurred while processing your command. Please try again.');
      toast.error('Error processing command', {
        description: 'Please try again or say "Help" for available commands'
      });
    }
  }, [navigate, speak, cancel, setMode, mode, emitVoiceCommand]);
  
  return { processCommand };
} 