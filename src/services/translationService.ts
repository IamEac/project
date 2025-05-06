const recognition = 'webkitSpeechRecognition' in window
  ? new webkitSpeechRecognition()
  : new SpeechRecognition();

export const transcribeAudio = async (audioBuffer: ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Default to English, can be made configurable

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      // Convert ArrayBuffer to audio element and play it
      const audio = new Audio();
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      audio.src = URL.createObjectURL(blob);
      
      audio.onended = () => {
        recognition.stop();
      };

      audio.onplay = () => {
        recognition.start();
      };

      audio.play();
    } catch (error) {
      reject(error);
    }
  });
};

export const extractAudioFromVideo = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }

        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);

        const audioContext = new AudioContext();
        const mediaElement = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        mediaElement.connect(destination);

        video.onloadedmetadata = () => {
          video.play();
        };

        const recorder = new MediaRecorder(destination.stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const arrayBuffer = await blob.arrayBuffer();
          resolve(arrayBuffer);
        };

        recorder.start();
        video.currentTime = 0;

        video.onended = () => {
          recorder.stop();
          audioContext.close();
        };
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export const translateText = async (text: string): Promise<string> => {
  // TODO: Implement actual translation logic
  // For now, return a mock translation
  return `Translated: ${text}`;
};

// Type declaration for browsers that use the webkit prefix
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}