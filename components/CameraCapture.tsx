
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CloseIcon, CameraIcon } from './icons';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-2xl animate-scaleIn">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-400 p-4">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        {!error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                    onClick={handleCapture}
                    className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 p-1 flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="Capture photo"
                >
                    <div className="w-full h-full bg-white rounded-full border-2 border-gray-800"></div>
                </button>
            </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CameraCapture;
