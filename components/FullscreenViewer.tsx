
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface FullscreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ isOpen, onClose, imageUrl }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(scale + delta, 0.1), 10);
    setScale(newScale);
  }, [scale]);

  useEffect(() => {
    const el = containerRef.current;
    if (el && isOpen) {
      el.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => el?.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <i className="fa-solid fa-magnifying-glass text-indigo-400"></i>
          <span className="font-bold text-sm uppercase tracking-widest">Native View & Zoom</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
            Wheel to Zoom · Drag to Move
          </span>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-600 rounded-full text-white transition-all shadow-lg active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          className="inline-block"
        >
          <img 
            src={imageUrl} 
            alt="Fullscreen Diagram" 
            className="max-w-none shadow-2xl bg-white select-none pointer-events-none"
            style={{ minWidth: '400px' }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur px-6 py-3 rounded-2xl border border-slate-700 shadow-2xl">
        <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.1))} className="text-white hover:text-indigo-400"><i className="fa-solid fa-minus"></i></button>
        <div className="text-white text-xs font-bold w-12 text-center">{Math.round(scale * 100)}%</div>
        <button onClick={() => setScale(prev => Math.min(prev + 0.1, 10))} className="text-white hover:text-indigo-400"><i className="fa-solid fa-plus"></i></button>
        <div className="w-px h-4 bg-slate-600 mx-2"></div>
        <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="text-white hover:text-indigo-400 text-xs font-bold uppercase tracking-widest">Reset</button>
      </div>
    </div>
  );
};

export default FullscreenViewer;
