
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_PLANTUML, TEMPLATES } from './constants';
import { getDiagramUrl } from './services/plantumlService';
import { generateDiagramCode, convertDiagramCode } from './services/geminiService';
import DiagramEditor from './components/DiagramEditor';
import DiagramViewer from './components/DiagramViewer';
import AIAssistant from './components/AIAssistant';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SaveDialog from './components/SaveDialog';
import FullscreenViewer from './components/FullscreenViewer';
import { DiagramData } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState(INITIAL_PLANTUML);
  const [history, setHistory] = useState<DiagramData[]>([]);
  const [currentDiagramName, setCurrentDiagramName] = useState("Untitled Diagram");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Architecting...");
  
  // Resizable panes state
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const isResizing = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('plantuml_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (name: string) => {
    const newEntry: DiagramData = {
      id: Date.now().toString(),
      name: name,
      code: code,
      updatedAt: Date.now()
    };
    const updated = [newEntry, ...history].slice(0, 50); 
    setHistory(updated);
    localStorage.setItem('plantuml_history', JSON.stringify(updated));
    setCurrentDiagramName(name);
  };

  const deleteFromHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('plantuml_history', JSON.stringify(updated));
  };

  const handleAiRequest = async (prompt: string) => {
    setLoadingText("Thinking...");
    setIsLoading(true);
    try {
      const newCode = await generateDiagramCode(prompt, code);
      if (newCode) setCode(newCode);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async (targetType: string) => {
    setLoadingText(`Converting to ${targetType}...`);
    setIsLoading(true);
    try {
      const newCode = await convertDiagramCode(code, targetType);
      if (newCode) {
        setCode(newCode);
        setCurrentDiagramName(prev => `${prev} (${targetType})`);
      }
    } catch (error) {
      console.error("Conversion Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDiagram = (diagram: DiagramData) => {
    setCode(diagram.code);
    setCurrentDiagramName(diagram.name);
    setIsSidebarOpen(false);
  };

  // Resize Handlers
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const offsetLeft = e.clientX;
    const totalWidth = window.innerWidth;
    const percentage = (offsetLeft / totalWidth) * 100;
    if (percentage > 20 && percentage < 80) {
      setLeftWidth(percentage);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [onMouseMove, stopResizing]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        diagramName={currentDiagramName}
        onRename={setCurrentDiagramName}
        onSave={() => setIsSaveDialogOpen(true)}
        onConvert={handleConvert}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          history={history}
          onLoadDiagram={handleLoadDiagram}
          onDeleteDiagram={deleteFromHistory}
        />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Editor Pane */}
          <div 
            style={{ width: `${leftWidth}%` }}
            className="flex flex-col bg-white border-r border-slate-200 overflow-hidden relative transition-[width] duration-75 ease-out"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Editor</span>
              <button onClick={() => setCode('@startuml\n\n@enduml')} className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider">Clear</button>
            </div>
            <DiagramEditor code={code} onChange={setCode} />
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-indigo-100">
                  <span className="text-[11px] font-bold text-indigo-600 animate-pulse">{loadingText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Resizer Handle */}
          <div 
            onMouseDown={startResizing}
            className="hidden md:flex w-1.5 hover:w-2 bg-slate-200 hover:bg-indigo-400 cursor-col-resize z-30 items-center justify-center transition-all group"
          >
            <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-indigo-200 rounded-full"></div>
          </div>

          {/* Preview Pane */}
          <div 
            style={{ width: `${100 - leftWidth}%` }}
            className="flex flex-col bg-slate-50 overflow-hidden transition-[width] duration-75 ease-out"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsFullscreenOpen(true)}
                  className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-slate-50 transition-colors font-bold uppercase"
                >
                  <i className="fa-solid fa-expand mr-1"></i> Fullscreen
                </button>
                <a 
                  href={getDiagramUrl(code, 'png')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors font-bold uppercase"
                >
                  Download PNG
                </a>
              </div>
            </div>
            <DiagramViewer code={code} onImageClick={() => setIsFullscreenOpen(true)} />
          </div>
        </main>

        <AIAssistant 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)}
          onSubmit={handleAiRequest}
          isLoading={isLoading}
        />

        <SaveDialog 
          isOpen={isSaveDialogOpen}
          onClose={() => setIsSaveDialogOpen(false)}
          onConfirm={saveToHistory}
          defaultName={currentDiagramName}
        />

        <FullscreenViewer 
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          imageUrl={getDiagramUrl(code, 'svg')}
        />
      </div>
    </div>
  );
};

export default App;
