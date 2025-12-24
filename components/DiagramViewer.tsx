
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getDiagramUrl } from '../services/plantumlService';

interface DiagramViewerProps {
  code: string;
  onImageClick?: () => void;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ code, onImageClick }) => {
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1); // Zoom par défaut à 100%
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
      setLoading(true);
      setError(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [code]);

  const imageUrl = useMemo(() => {
    const trimmed = debouncedCode.trim();
    if (!trimmed || !trimmed.includes('@startuml')) return '';
    // On utilise systématiquement le format SVG pour une netteté absolue
    return getDiagramUrl(debouncedCode, 'svg');
  }, [debouncedCode]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-slate-50 overflow-hidden relative min-h-[400px]">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur border border-indigo-100 rounded-full shadow-lg z-30">
          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Mise à jour...</span>
        </div>
      )}

      {/* Zone de travail avec grille légère */}
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-auto flex flex-col items-center justify-start p-12 pb-48 custom-scrollbar"
        style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        {!imageUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-300">
            <i className="fa-solid fa-diagram-project text-7xl opacity-10"></i>
            <p className="text-sm font-semibold tracking-wide uppercase opacity-40">Editez le code pour voir le diagramme</p>
          </div>
        ) : (
          <div 
            className="transition-transform duration-200 ease-out origin-top flex flex-col items-center"
            style={{ 
              transform: `scale(${zoom})`,
              // On s'assure que la zone cliquable correspond à l'image
              width: 'max-content'
            }}
          >
            <div 
              className="bg-white p-4 md:p-8 shadow-2xl border border-slate-200 rounded-lg cursor-zoom-in hover:ring-4 hover:ring-indigo-500/10 transition-all"
              onClick={onImageClick}
            >
              <img 
                src={imageUrl} 
                alt="PlantUML Diagram" 
                className={`max-w-none h-auto transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
              />
            </div>
            
            {/* Petit indicateur de fin de diagramme pour confirmer le scroll complet */}
            <div className="h-4 w-full mt-4 flex justify-center">
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Barre de contrôle du zoom flottante (Restauration demandée) */}
      {imageUrl && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-40 animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
            title="Zoom arrière"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          
          <button 
            onClick={handleResetZoom}
            className="px-4 py-1.5 bg-slate-800 rounded-lg text-white font-bold text-xs border border-slate-700 hover:border-indigo-500 transition-colors flex flex-col items-center"
            title="Réinitialiser le zoom"
          >
            <span className="text-[9px] uppercase text-slate-400 block leading-none mb-1">Zoom</span>
            {Math.round(zoom * 100)}%
          </button>

          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
            title="Zoom avant"
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <div className="w-px h-6 bg-slate-700 mx-1"></div>

          <button 
            onClick={onImageClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 transition-all"
            title="Plein écran"
          >
            <i className="fa-solid fa-expand"></i>
          </button>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-8 text-center z-50">
          <div className="max-w-md flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl"></i>
            </div>
            <h3 className="font-black text-slate-900 text-xl">Erreur de Syntaxe</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Le code PlantUML contient des erreurs. Vérifiez vos balises ou demandez à l'assistant AI de corriger la structure.</p>
            <button 
              onClick={() => { setLoading(true); setZoom(1); }}
              className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl active:scale-95 transition-all"
            >
              Recharger le rendu
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 3px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default DiagramViewer;
