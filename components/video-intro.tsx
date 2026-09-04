"use client"

import { useEffect, useRef, useState } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Ensure the first frame/poster is available without starting playback
    video.load();
  }, []);

  const handleClick = () => {
    if (started) return;

    const video = videoRef.current;
    if (!video) return;

    setStarted(true);
    video.play().catch(() => {
      // If playback fails (rare), allow another click attempt
      setStarted(false);
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          style={{ width: '100vw', height: '100dvh', objectPosition: 'center' }}
          playsInline={true}
          muted={true}
          autoPlay={false}
          controls={false}
          onEnded={onComplete}
          preload="auto"
          disablePictureInPicture
          loop={false}
        >
        <source src="/engagement-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
