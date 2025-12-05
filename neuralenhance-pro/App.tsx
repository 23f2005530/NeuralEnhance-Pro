import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { SimpleComparison } from './components/ComparisonViewer';
import { processImage } from './services/geminiService';
import { AppMode, Resolution, ImageState } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    originalUrl: null,
    processedUrl: null,
    mimeType: '',
    originalBase64: null,
  });

  const [settings, setSettings] = useState({
    mode: AppMode.ENHANCE,
    resolution: Resolution.RES_16K, // Default to max
    prompt: '',
  });

  const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageSelected = (base64: string, mimeType: string) => {
    setImageState({
      originalUrl: `data:${mimeType};base64,${base64}`,
      processedUrl: null,
      mimeType,
      originalBase64: base64,
    });
    setStatus('idle');
  };

  const handleProcess = async () => {
    if (!imageState.originalBase64) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      const processedImageBase64 = await processImage(
        imageState.originalBase64,
        imageState.mimeType,
        settings.mode,
        settings.resolution,
        settings.prompt
      );

      setImageState(prev => ({ ...prev, processedUrl: processedImageBase64 }));
      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleReset = () => {
    setImageState({
      originalUrl: null,
      processedUrl: null,
      mimeType: '',
      originalBase64: null,
    });
    setStatus('idle');
  };

  const downloadImage = () => {
    if (!imageState.processedUrl) return;
    const link = document.createElement('a');
    link.href = imageState.processedUrl;
    link.download = `enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check for API Key handling capability on mount
  useEffect(() => {
    if (!(window as any).aistudio) {
      console.warn("window.aistudio is not available. Please ensure the app is running in the correct environment.");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 bg-[#0f0f11] border-b md:border-r border-gray-800 p-6 flex flex-col shrink-0 z-10">
        <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">N</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                NeuralEnhance <span className="text-xs bg-indigo-600 text-white px-1 rounded ml-1">FREE</span>
            </h1>
        </div>

        <div className="space-y-8 flex-1">
            {/* Mode Selection */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Operation Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1 rounded-lg">
                    <button 
                        onClick={() => setSettings(s => ({...s, mode: AppMode.ENHANCE}))}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${settings.mode === AppMode.ENHANCE ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Upscale
                    </button>
                    <button 
                        onClick={() => setSettings(s => ({...s, mode: AppMode.REMOVE_BG}))}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${settings.mode === AppMode.REMOVE_BG ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Remove BG
                    </button>
                </div>
            </div>

            {/* Resolution Selection */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Resolution</label>
                <div className="space-y-2">
                    {[
                        { val: Resolution.RES_1K, label: '1K Standard' },
                        { val: Resolution.RES_2K, label: '2K High Definition' },
                        { val: Resolution.RES_4K, label: '4K Ultra HD' },
                        { val: Resolution.RES_8K, label: '8K Ultra Detailed' },
                        { val: Resolution.RES_16K, label: '16K Cinema Grade' },
                    ].map((opt) => (
                        <div 
                            key={opt.val}
                            onClick={() => setSettings(s => ({...s, resolution: opt.val}))}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                settings.resolution === opt.val 
                                ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                                : 'border-gray-800 hover:border-gray-700 text-gray-400'
                            }`}
                        >
                            <span className="text-sm font-medium">{opt.label}</span>
                            {settings.resolution === opt.val && (
                                <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Instruction (Optional)</label>
                <textarea 
                    value={settings.prompt}
                    onChange={(e) => setSettings(s => ({...s, prompt: e.target.value}))}
                    placeholder={settings.mode === AppMode.ENHANCE ? "e.g., Make the skin texture clearer..." : "e.g., Replace background with neon city..."}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                />
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
             <p className="text-xs text-gray-600 text-center leading-relaxed">
                Powered by Gemini 2.5 Flash Image. <br/>
                Free Tier Compatible.
             </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative flex flex-col">
        {status === 'error' && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm">{errorMessage}</p>
                <button onClick={() => setStatus('idle')} className="ml-auto text-red-400 hover:text-red-300">Dismiss</button>
            </div>
        )}

        {/* Top Action Bar */}
        {imageState.originalUrl && (
            <div className="flex justify-between items-center mb-6">
                 <Button variant="ghost" onClick={handleReset}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    New Image
                 </Button>
                 
                 <div className="flex gap-3">
                    {status !== 'success' && status !== 'processing' && (
                         <Button onClick={handleProcess} isLoading={status === 'processing'}>
                            Start {settings.mode === AppMode.ENHANCE ? 'Enhancement' : 'Removal'}
                         </Button>
                    )}
                    {status === 'success' && (
                        <Button onClick={downloadImage}>
                            Download Result
                        </Button>
                    )}
                 </div>
            </div>
        )}

        {/* Viewport */}
        <div className="flex-1 flex flex-col justify-center min-h-[500px]">
            {!imageState.originalUrl ? (
                <div className="max-w-xl mx-auto w-full">
                    <div className="text-center mb-10">
                        <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mb-6 border border-white/5">
                             <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Image Perfection. Now Free.</h2>
                        <p className="text-gray-400 text-lg">Upscale images with our new 16K engine or isolate subjects with professional precision.</p>
                    </div>
                    <ImageUploader onImageSelected={handleImageSelected} />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col">
                    {status === 'processing' ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/30 rounded-2xl border border-gray-800 animate-pulse">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin reverse" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                            </div>
                            <h3 className="text-xl font-semibold text-white">Enhancing Image...</h3>
                            <p className="text-gray-400 mt-2">Generating 
                                {settings.resolution === Resolution.RES_16K ? ' 16K' : 
                                 settings.resolution === Resolution.RES_8K ? ' 8K' : ' High Res'} 
                                 {settings.mode === AppMode.ENHANCE ? ' details' : ' matte'}...
                            </p>
                        </div>
                    ) : imageState.processedUrl ? (
                        <SimpleComparison original={imageState.originalUrl} processed={imageState.processedUrl} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl border border-gray-800 p-8">
                            <img src={imageState.originalUrl} alt="Original" className="max-h-[600px] object-contain shadow-2xl" />
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;