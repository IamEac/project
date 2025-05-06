import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import TranslationPanel from './TranslationPanel';
import { TranslationProvider } from '../contexts/TranslationContext';

const TranslationApp: React.FC = () => {
  return (
    <TranslationProvider>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">
            <span className="text-blue-500">Translate</span>
            <span className="text-white">Tube</span>
          </h1>
          <p className="text-center text-gray-400 mt-2">Real-time English to Spanish translation</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <VideoPlayer />
          </div>
          <div className="lg:col-span-4">
            <TranslationPanel />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 TranslateTube - Real-time video translation</p>
        </footer>
      </div>
    </TranslationProvider>
  );
};

export default TranslationApp;