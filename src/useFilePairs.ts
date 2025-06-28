import { useCallback, useState } from 'react';

export type UploadedFile = {
  file: File;
  type: 'audio' | 'image';
  path: string;
};

export type FilePair = {
  audio?: UploadedFile;
  image?: UploadedFile;
};

export default function useFilePairs() {
  // Always show one empty pair by default
  const [pairs, setPairs] = useState<FilePair[]>([{ audio: undefined, image: undefined }]);

  const handleDrop = useCallback((files: FileList) => {
    const audios: UploadedFile[] = [];
    const images: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      const filePath = (file as any).path || file.name;
      if (file.type.startsWith('audio/')) {
        audios.push({ file, type: 'audio', path: filePath });
      } else if (file.type.startsWith('image/')) {
        images.push({ file, type: 'image', path: filePath });
      }
    });
    const max = Math.max(audios.length, images.length);
    const newPairs: FilePair[] = [];
    for (let i = 0; i < max; i++) {
      newPairs.push({ audio: audios[i], image: images[i] });
    }
    setPairs(newPairs.length > 0 ? newPairs : [{ audio: undefined, image: undefined }]);
  }, []);

  // Drag & drop swap logic
  const swapAudio = (from: number, to: number) => {
    setPairs((prev) => {
      const next = [...prev];
      const temp = next[from].audio;
      next[from].audio = next[to].audio;
      next[to].audio = temp;
      return next;
    });
  };
  const swapImage = (from: number, to: number) => {
    setPairs((prev) => {
      const next = [...prev];
      const temp = next[from].image;
      next[from].image = next[to].image;
      next[to].image = temp;
      return next;
    });
  };

  return { pairs, setPairs, handleDrop, swapAudio, swapImage };
}
