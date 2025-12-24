
import React, { useRef } from 'react';

interface DiagramEditorProps {
  code: string;
  onChange: (code: string) => void;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      onChange(value.substring(0, start) + '  ' + value.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const cleanCurrentCode = () => {
    const cleaned = code
      .replace(/```[a-z]*\n?/gi, '')
      .replace(/```/g, '')
      .replace(/\\\\n/g, '\\n')
      .trim();
    onChange(cleaned);
  };

  return (
    <div className="flex-1 flex flex-col relative bg-slate-900 group">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={cleanCurrentCode}
          className="px-2 py-1 bg-slate-800 text-[10px] text-indigo-300 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
          title="Nettoyer les backticks et erreurs d'échappement"
        >
          <i className="fa-solid fa-broom mr-1"></i> Clean Syntax
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full p-6 bg-transparent text-indigo-100 code-font text-sm leading-relaxed resize-none outline-none focus:ring-2 focus:ring-indigo-500/20"
        spellCheck={false}
        placeholder="@startuml..."
      />
      <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        UTF-8 · PlantUML v1.2 (Zlib Mode)
      </div>
    </div>
  );
};

export default DiagramEditor;
