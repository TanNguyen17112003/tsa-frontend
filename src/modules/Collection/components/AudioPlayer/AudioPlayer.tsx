import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  audioSrc: string; // URL or path to the audio file
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current?.addEventListener("ended", handleAudioEnded);

    return () => {
      audioRef.current?.removeEventListener("ended", handleAudioEnded);
    };
  }, [audioRef]);

  return (
    <div className="flex items-center">
      <button
        onClick={togglePlayback}
        type="button"
        className={`
          flex items-center justify-center gap-3 rounded-full px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none
          ${isPlaying ? "bg-green-500 text-white" : "text-gray-500"}
        `}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
        {label}
      </button>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
};

export default AudioPlayer;
