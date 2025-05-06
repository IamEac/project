import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Upload, SkipBack, SkipForward } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

const VideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isTranslating,
    startTranslation,
    stopTranslation,
    originalVolume,
    processVideoFile
  } = useTranslation();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = originalVolume;
    }
  }, [originalVolume]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        if (isTranslating) {
          stopTranslation();
        }
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        if (!isTranslating) {
          startTranslation();
        }
      }
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleVideoFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      await handleVideoFile(file);
    }
  };

  const handleVideoFile = async (file: File) => {
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.volume = originalVolume;
      }
      
      // Process video for transcription and translation
      await processVideoFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-lg overflow-hidden bg-black shadow-xl transition-all duration-300">
      <div 
        className={`relative aspect-video bg-gray-800 ${!videoUrl ? 'cursor-pointer' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !videoUrl && handleUploadClick()}
      >
        {!videoUrl ? (
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDragging ? 'bg-gray-700' : 'bg-gray-800'}`}>
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-400 text-center">
              Drag and drop your video here<br />or click to select a file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-contain"
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                  <Play size={36} className="text-white ml-2" />
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={skipBackward}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      <SkipBack size={24} />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button 
                      onClick={skipForward}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      <SkipForward size={24} />
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={toggleMute}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Upload Your Video</h2>
        <p className="text-gray-400 text-sm">
          Upload an MP4 video file to translate from English to Spanish in real-time.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;