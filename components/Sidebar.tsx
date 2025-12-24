
import React, { useState } from 'react';
import { DiagramData } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: DiagramData[];
  onLoadDiagram: (d: DiagramData) => void;
  onDeleteDiagram: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, history, onLoadDiagram, onDeleteDiagram }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Archives</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Library & Versions</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-solid fa-box-archive text-2xl text-slate-200"></i>
                </div>
                <p className="text-sm font-semibold text-slate-400">Your archive is empty</p>
                <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tight">Save diagrams to see them here</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  className={`group relative border transition-all rounded-xl overflow-hidden ${expandedId === item.id ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
                >
                  <div className="p-4 flex items-center gap-3">
                    <button 
                      onClick={() => onLoadDiagram(item)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <h4 className="text-sm font-bold text-slate-700 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        <i className="fa-regular fa-clock mr-1"></i>
                        {new Date(item.updatedAt).toLocaleDateString()} at {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </button>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => toggleExpand(item.id)}
                        className={`p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${expandedId === item.id ? 'text-indigo-600 bg-indigo-50' : ''}`}
                        title="View Code"
                      >
                        <i className="fa-solid fa-code text-xs"></i>
                      </button>
                      <button 
                        onClick={() => onDeleteDiagram(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete from Archives"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>

                  {expandedId === item.id && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-slate-900/95 rounded-lg p-3 max-h-40 overflow-auto shadow-inner border border-slate-800">
                        <pre className="text-[10px] code-font text-indigo-200/80 whitespace-pre-wrap leading-relaxed">
                          {item.code}
                        </pre>
                      </div>
                      <button 
                        onClick={() => onLoadDiagram(item)}
                        className="w-full mt-3 py-2 bg-indigo-600 text-white text-[11px] font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Restore & Edit This Version
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
             <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                   <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                </div>
                <div className="min-w-0">
                   <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Sync Status</p>
                   <p className="text-[10px] text-slate-400 truncate">Saved locally on this device</p>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
