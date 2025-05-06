import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const TranslationHistory: React.FC = () => {
  const { translationHistory } = useTranslation();

  if (translationHistory.length === 0) {
    return (
      <div className="p-4 bg-gray-700 rounded-md text-center text-gray-400 text-sm">
        No translation history yet. Start playing a video to begin translation.
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto rounded-md bg-gray-700">
      {translationHistory.map((item, index) => (
        <div key={index} className="p-3 border-b border-gray-600 last:border-b-0">
          <div className="text-sm text-gray-400 mb-1">English:</div>
          <p className="text-sm mb-2">{item.original}</p>
          <div className="text-sm text-blue-400 mb-1">Spanish:</div>
          <p className="text-sm italic">{item.translated}</p>
        </div>
      ))}
    </div>
  );
};

export default TranslationHistory;