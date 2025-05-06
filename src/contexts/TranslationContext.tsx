import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { transcribeAudio, translateText, extractAudioFromVideo } from '../services/translationService';

type TranslationHistoryItem = {
  original: string;
  translated: string;
  timestamp: Date;
};

interface TranslationContextType {
  isTranslating: boolean;
  isListening: boolean;
  isAudioEnabled: boolean;
  lastTranscript: string;
  lastTranslation: string;
  translationError: string | null;
  translationHistory: TranslationHistoryItem[];
  volume: number;
  originalVolume: number;
  startTranslation: () => void;
  stopTranslation: () => void;
  toggleAudio: () => void;
  setVolume: (value: number) => void;
  setOriginalVolume: (value: number) => void;
  processVideoFile: (file: File) => Promise<void>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastTranslation, setLastTranslation] = useState('');
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([]);
  const [volume, setVolume] = useState(0.8);
  const [originalVolume, setOriginalVolume] = useState(0.3);

  const playTranslatedAudio = async (text: string) => {
    if (!isAudioEnabled) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.volume = volume;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing translated audio:', error);
      setTranslationError('Failed to play translated audio');
    }
  };

  const processVideoFile = async (file: File) => {
    try {
      setIsTranslating(true);
      setTranslationError(null);

      // Extract audio from video
      const audioBuffer = await extractAudioFromVideo(file);

      // Transcribe audio to text
      const transcription = await transcribeAudio(audioBuffer);
      setLastTranscript(transcription);

      // Translate text
      const translation = await translateText(transcription);
      setLastTranslation(translation);

      // Add to history
      setTranslationHistory(prev => [{
        original: transcription,
        translated: translation,
        timestamp: new Date()
      }, ...prev].slice(0, 50));

      // Play translated audio
      if (isAudioEnabled) {
        await playTranslatedAudio(translation);
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setTranslationError('Failed to process video');
    } finally {
      setIsTranslating(false);
    }
  };

  const startTranslation = useCallback(() => {
    setIsTranslating(true);
    setTranslationError(null);
  }, []);

  const stopTranslation = useCallback(() => {
    setIsTranslating(false);
    window.speechSynthesis.cancel();
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
    window.speechSynthesis.cancel();
  }, []);

  const value = {
    isTranslating,
    isListening,
    isAudioEnabled,
    lastTranscript,
    lastTranslation,
    translationError,
    translationHistory,
    volume,
    originalVolume,
    startTranslation,
    stopTranslation,
    toggleAudio,
    setVolume,
    setOriginalVolume,
    processVideoFile
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};