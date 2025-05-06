import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { Volume2, VolumeX } from 'lucide-react';

const TranslationControls: React.FC = () => {
  const { 
    isTranslating,
    isAudioEnabled,
    toggleAudio,
    volume,
    setVolume,
    originalVolume,
    setOriginalVolume
  } = useTranslation();

  return (
    <div className="p-4 bg-gray-700 rounded-md mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Audio Controls</h3>
        <button 
          onClick={toggleAudio}
          className={`text-sm flex items-center ${isAudioEnabled ? 'text-blue-400' : 'text-gray-400'}`}
        >
          {isAudioEnabled ? <Volume2 size={16} className="mr-1" /> : <VolumeX size={16} className="mr-1" />}
          {isAudioEnabled ? 'Audio ON' : 'Audio OFF'}
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">Spanish Translation Volume:</label>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-grow"
              disabled={!isAudioEnabled}
            />
            <span className="text-xs w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-400">Original Audio Volume:</label>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={originalVolume} 
              onChange={(e) => setOriginalVolume(parseFloat(e.target.value))}
              className="flex-grow"
            />
            <span className="text-xs w-8">{Math.round(originalVolume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationControls;