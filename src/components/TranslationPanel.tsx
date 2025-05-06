import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { Mic, MicOff, Volume2, Languages, Settings } from 'lucide-react';
import TranslationControls from './TranslationControls';
import TranslationHistory from './TranslationHistory';

const TranslationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');
  const { 
    isTranslating, 
    startTranslation, 
    stopTranslation, 
    isListening,
    lastTranscript,
    lastTranslation,
    translationError
  } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl h-full transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Languages className="mr-2 text-blue-500" size={20} />
            Translation Panel
          </h2>
          
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-full ${isTranslating ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={isTranslating ? stopTranslation : startTranslation}
              title={isTranslating ? 'Stop Translation' : 'Start Translation'}
            >
              {isTranslating ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mb-4 px-3 py-2 rounded-md bg-gray-700 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm">
            {isListening ? 'Listening and translating...' : 'Translation paused'}
          </span>
        </div>
        
        {/* Translation controls */}
        <TranslationControls />
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-700 mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('history')}
          >
            Translation History
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        {/* Tab content */}
        {activeTab === 'history' ? (
          <TranslationHistory />
        ) : (
          <div className="p-4 bg-gray-700 rounded-md">
            <h3 className="font-medium mb-3 flex items-center">
              <Settings size={16} className="mr-2" />
              Translation Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Input Language</label>
                <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm">
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Output Language</label>
                <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm">
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Speech Rate</label>
                <input type="range" className="w-full" min="0.5" max="2" step="0.1" defaultValue="1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPanel;