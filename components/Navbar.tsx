
import React, { useState, useRef, useEffect } from 'react';
import { DiagramType } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleAI: () => void;
  diagramName: string;
  onRename: (name: string) => void;
  onSave: () => void;
  onConvert: (targetType: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleAI, diagramName, onRename, onSave, onConvert }) => {
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const convertMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (convertMenuRef.current && !convertMenuRef.current.contains(event.target as Node)) {
        setShowConvertMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const convertOptions = [
    { type: DiagramType.SEQUENCE, label: 'Sequence', icon: 'fa-arrows-left-right' },
    { type: DiagramType.FLOW, label: 'Flow Chart', icon: 'fa-route' },
    { type: DiagramType.BPMN, label: 'BPMN / Process', icon: 'fa-project-diagram' },
  ];

  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Open Archives"
        >
          <i className="fa-solid fa-box-archive text-xl"></i>
        </button>
      </div>

      <div className="flex-1 max-w-md mx-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center gap-2">
        <i className="fa-solid fa-file-signature text-slate-300 text-xs"></i>
        <input 
          type="text" 
          value={diagramName} 
          onChange={(e) => onRename(e.target.value)}
          className="bg-transparent font-bold text-slate-700 text-sm focus:outline-none w-full text-center"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Convert Dropdown */}
        <div className="relative" ref={convertMenuRef}>
          <button 
            onClick={() => setShowConvertMenu(!showConvertMenu)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${showConvertMenu ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            title="Convert Diagram Type"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Convert</span>
          </button>
          
          {showConvertMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transform Logic To</p>
              {convertOptions.map((opt) => (
                <button 
                  key={opt.type}
                  onClick={() => { onConvert(opt.type); setShowConvertMenu(false); }}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-3 group"
                >
                  <i className={`fa-solid ${opt.icon} w-5 text-slate-400 group-hover:text-indigo-500`}></i> 
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
        >
          <i className="fa-solid fa-floppy-disk"></i>
          <span className="hidden sm:inline">Save</span>
        </button>
        <button 
          onClick={onToggleAI}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-95 border border-slate-700 shadow-xl"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          AI Assist
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
