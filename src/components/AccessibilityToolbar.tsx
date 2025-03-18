import React from 'react';
import { Settings, Sun, Type } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';

export function AccessibilityToolbar() {
  const { highContrast, textSize, toggleHighContrast, setTextSize } = useAccessibilityStore();

  return (
    <div className="fixed bottom-4 right-4 glass-effect rounded-full p-2 flex items-center space-x-2">
      <button
        onClick={toggleHighContrast}
        className={`p-2 rounded-full transition-colors ${
          highContrast ? 'bg-primary text-white' : 'hover:bg-gray-100'
        }`}
        aria-label="Toggle high contrast"
      >
        <Sun className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => setTextSize(textSize === 'normal' ? 'large' : textSize === 'large' ? 'x-large' : 'normal')}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Adjust text size"
      >
        <Type className="h-5 w-5" />
      </button>

      <button
        onClick={() => document.getElementById('mode-selector')?.focus()}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}