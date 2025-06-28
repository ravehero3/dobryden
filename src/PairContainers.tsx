import React, { useRef, useState, useEffect } from 'react';
import type { UploadedFile } from './useFilePairs';

interface AudioContainerProps {
  audio?: UploadedFile;
}

export function AudioContainer({ audio }: AudioContainerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const onTimeUpdate = () => {
      setProgress(audioRef.current!.currentTime / audioRef.current!.duration);
    };
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-32 bg-zinc-900 rounded-lg p-2 relative border-2 ${playing ? 'border-primary animate-glow' : 'border-zinc-700'}`}
    >
      {audio ? (
        <>
          <audio ref={audioRef} src={URL.createObjectURL(audio.file)} onEnded={() => setPlaying(false)} />
          <div className="flex items-center w-full mb-2">
            <button
              className="mr-2 px-2 py-1 rounded bg-primary text-black font-bold shadow"
              onClick={togglePlay}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <div className="flex-1 cursor-pointer" onClick={onSeek}>
              <WaveformBars progress={progress} />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-accent rounded-lg opacity-40">
          <span className="text-xs text-accent">Drop audio</span>
        </div>
      )}
    </div>
  );
}

function WaveformBars({ progress }: { progress: number }) {
  const bars = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="flex items-end h-8 w-full gap-[1px]">
      {bars.map((i) => (
        <div
          key={i}
          className={`w-[2.5%] rounded bg-primary transition-all duration-200 ${progress * 40 > i ? 'opacity-100' : 'opacity-40'}`}
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  );
}

interface ImageContainerProps {
  image?: UploadedFile;
}

export function ImageContainer({ image }: ImageContainerProps) {
  return image ? (
    <div className="flex items-center justify-center w-full h-32 bg-zinc-900 rounded-lg p-2">
      <img
        src={URL.createObjectURL(image.file)}
        alt="Preview"
        className="max-h-24 max-w-full object-contain rounded shadow"
        style={{ padding: '10px 0' }}
      />
    </div>
  ) : (
    <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-accent rounded-lg opacity-40">
      <span className="text-xs text-accent">Drop image</span>
    </div>
  );
}
