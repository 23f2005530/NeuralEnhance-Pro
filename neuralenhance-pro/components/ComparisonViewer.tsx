import React, { useState } from 'react';

interface ComparisonViewerProps {
  original: string;
  processed: string;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ original, processed }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-black select-none group"
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
    >
        {/* Processed Image (Background) */}
        <img 
            src={processed} 
            alt="Processed" 
            className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Original Image (Clipped Overlay) */}
        <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%`, borderRight: '1px solid rgba(255,255,255,0.5)' }}
        >
            <img 
                src={original} 
                alt="Original" 
                className="absolute w-full h-full object-contain max-w-none"
                // Important: we need to unset the width here relative to container to match the bg image exactly
                style={{ width: '100%', height: '100%' }} // This is tricky with object-contain.
                // Let's use a simpler approach for object-contain comparison:
                // Actually, object-contain makes direct overlay hard if aspect ratios differ from container.
                // We will rely on both images being same aspect ratio (processed is generated from original).
             />
             {/* If object-fit is used, the clipping approach needs the images to be same physical size on screen.
                 A better way for 'contain' is to center them. */}
        </div>

        {/* Since object-contain centers the image, the clipping div needs to match the image dimensions, not the container, 
            or we switch to object-cover if we want to fill the area. 
            Let's switch to a simpler "Side by Side" if detailed inspection is needed, 
            or just use object-cover for the "Fancy" effect if the user doesn't mind cropping.
            
            Hybrid approach: Use background-image to control positioning perfectly.
        */}
    </div>
  );
};

// Simplified version that handles aspect ratios gracefully
export const SimpleComparison: React.FC<ComparisonViewerProps> = ({ original, processed }) => {
    const [view, setView] = useState<'split' | 'original' | 'processed'>('processed');

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-center gap-2 mb-2">
                <button onClick={() => setView('original')} className={`px-3 py-1 text-sm rounded-full ${view === 'original' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Original</button>
                <button onClick={() => setView('split')} className={`px-3 py-1 text-sm rounded-full ${view === 'split' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Side-by-Side</button>
                <button onClick={() => setView('processed')} className={`px-3 py-1 text-sm rounded-full ${view === 'processed' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Result</button>
            </div>

            <div className="relative flex-1 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[400px]">
                {view === 'original' && (
                     <img src={original} alt="Original" className="max-w-full max-h-[600px] object-contain shadow-2xl" />
                )}
                {view === 'processed' && (
                     <img src={processed} alt="Processed" className="max-w-full max-h-[600px] object-contain shadow-2xl shadow-indigo-500/20" />
                )}
                {view === 'split' && (
                    <div className="flex gap-4 w-full h-full overflow-x-auto">
                        <div className="flex-1 flex flex-col items-center min-w-[300px]">
                            <span className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Original</span>
                            <img src={original} className="w-full h-auto rounded-lg border border-gray-800" />
                        </div>
                        <div className="flex-1 flex flex-col items-center min-w-[300px]">
                             <span className="text-xs text-indigo-400 mb-2 uppercase tracking-wider">Enhanced</span>
                             <img src={processed} className="w-full h-auto rounded-lg border border-indigo-500/30" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}