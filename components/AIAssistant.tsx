
import React, { useState } from 'react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt);
    setPrompt("");
  };

  const suggestions = [
    "Make this diagram colorful and professional",
    "Design a flow chart for an e-commerce checkout logic",
    "Add a database layer to my current sequence diagram",
    "Explain my current diagram",
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <h2 className="text-lg font-bold">AI Design Assistant</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <p className="text-indigo-100 text-sm opacity-90">Describe the diagram or change you want, and I'll write the PlantUML for you.</p>
        </div>

        <div className="p-6">
          <div className="relative mb-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Make the arrows red and the boxes blue..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all text-slate-700"
              autoFocus
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center gap-2 rounded-xl">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-indigo-600 animate-pulse">Architecting your request...</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-[11px] font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              className={`px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all active:scale-95 ${(!prompt.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
              Generate
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-emerald-500 text-[10px]"></i>
          <span className="text-[10px] text-slate-400 font-medium">Powered by Gemini 3.0 Pro · Results may vary based on complexity</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
