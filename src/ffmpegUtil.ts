import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath as string);

// This script will be used to pair audio and images, preview, and render videos using FFmpeg.
// Implementation will be added in the next steps.

export async function renderPairToVideo({
  audioPath,
  imagePath,
  outputPath,
}: {
  audioPath: string;
  imagePath: string;
  outputPath: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagePath)
      .loop()
      .input(audioPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('1920x1080')
      .outputOptions([
        '-pix_fmt yuv420p',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=white',
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

export async function renderAllPairsToVideos({
  pairs,
  outputDir = 'output',
}: {
  pairs: { audio: { file: File, path: string }, image: { file: File, path: string } }[];
  outputDir?: string;
}): Promise<string[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  const outputPaths: string[] = [];
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.audio && pair.image) {
      const audioPath = pair.audio?.path;
      const imagePath = pair.image?.path;
      if (audioPath && imagePath) {
        const outputPath = path.join(outputDir, `output_pair_${i + 1}.mp4`);
        await renderPairToVideo({ audioPath, imagePath, outputPath });
        outputPaths.push(outputPath);
      }
    }
  }
  return outputPaths;
}
