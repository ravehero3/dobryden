import { useState, useRef } from 'react';
import useFilePairs from './useFilePairs';
import { AudioContainer, ImageContainer } from './PairContainers';
import { renderAllPairsToVideos } from './ffmpegUtil';

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-white">
      <h1 className="text-3xl font-bold mb-6 tracking-wide">Welcome to Type Beat Video Creator</h1>
      <p className="text-zinc-400 mb-10 text-lg text-center max-w-xl">
        Upload your audio (MP3/WAV) and image (PNG/JPG) files to get started. Drag and drop or use the grid below. Pair, preview, rearrange, and render your futuristic beat videos!
      </p>
      <div className="flex gap-16 mb-10 items-center justify-center">
        <div className="w-56 h-44 flex flex-col items-center justify-center rounded-2xl border-2 border-primary bg-[#232336] shadow-xl">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="18" y="24" width="6" height="16" rx="3" fill="#00fff7"/><rect x="30" y="16" width="6" height="32" rx="3" fill="#00fff7"/><rect x="42" y="28" width="6" height="8" rx="3" fill="#00fff7"/></svg>
          <span className="mt-4 text-primary font-semibold text-lg">Audio</span>
        </div>
        <div className="w-56 h-44 flex flex-col items-center justify-center rounded-2xl border-2 border-accent bg-[#232336] shadow-xl">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="10" y="18" width="44" height="28" rx="6" fill="#ff00ea" fillOpacity="0.18" stroke="#ff00ea" strokeWidth="2.5"/><circle cx="22" cy="32" r="5" fill="#ff00ea"/><path d="M18 42L28 30L38 40L46 32L54 42" stroke="#ff00ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="mt-4 text-accent font-semibold text-lg">Image</span>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-primary text-black font-bold text-lg shadow animate-glow" onClick={onStart}>
        Get Started
      </button>
    </div>
  );
}

export default function App() {
  const { pairs, handleDrop } = useFilePairs();
  const [showWelcome, setShowWelcome] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoPreviews, setVideoPreviews] = useState<(string | null)[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  // Drag and drop handlers
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleDrop(e.dataTransfer.files);
      setShowWelcome(false);
    }
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Render all videos
  async function handleRenderVideos() {
    setRendering(true);
    setRenderProgress(0);
    const outputPaths = await renderAllPairsToVideos({
      pairs: pairs.filter(p => p.audio && p.image) as any,
      outputDir: 'output',
    });
    setVideoPreviews(outputPaths);
    setRendering(false);
  }

  if (showWelcome) {
    return <Welcome onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6 tracking-wide">Arrange Your Beat Pairs</h1>
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="w-full max-w-3xl grid grid-cols-2 gap-8 mb-8 p-6 rounded-2xl bg-[#18181b] border border-zinc-700 shadow-xl"
        style={{ minHeight: 300 }}
      >
        {pairs.map((pair, i) => (
          <div key={i} className="flex flex-col gap-4">
            <AudioContainer audio={pair.audio} />
            <ImageContainer image={pair.image} />
          </div>
        ))}
      </div>
      <button
        className="px-8 py-3 rounded-xl bg-primary text-black font-bold text-lg shadow animate-glow disabled:opacity-50"
        onClick={handleRenderVideos}
        disabled={rendering || pairs.every(p => !p.audio || !p.image)}
      >
        {rendering ? `Rendering... (${renderProgress}%)` : 'Render All Videos'}
      </button>
      {videoPreviews.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Rendered Videos</h2>
          <ul className="space-y-2">
            {videoPreviews.map((path, i) => (
              <li key={i} className="bg-zinc-800 rounded p-3 text-sm">
                {path}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
