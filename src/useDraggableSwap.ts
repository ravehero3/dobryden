import { useRef } from 'react';
import { useMotionValue, useDragControls } from 'framer-motion';

export function useDraggableSwap({ onSwap }: { onSwap: (from: number, to: number) => void }) {
  const draggingIndex = useRef<number | null>(null);
  const controls = useDragControls();
  const y = useMotionValue(0);

  const handleDragStart = (index: number) => {
    draggingIndex.current = index;
  };
  const handleDragEnd = (index: number, overIndex: number | null) => {
    if (overIndex !== null && overIndex !== index) {
      onSwap(index, overIndex);
    }
    draggingIndex.current = null;
  };
  return { controls, y, handleDragStart, handleDragEnd, draggingIndex };
}
