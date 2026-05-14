import React from 'react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  className = '',
}: LanguageSelectorProps) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <label
        htmlFor="language-select"
        className="pl-1 text-[10px] font-bold tracking-widest text-cyan-600/80 uppercase"
      >
        Select Language:
      </label>
      <div className="group relative">
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-cyan-900/50 bg-black/40 py-2.5 pr-10 pl-4 font-mono text-sm text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.05)] backdrop-blur-sm transition-all group-hover:bg-black/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
        >
          <optgroup
            label="Indian Languages"
            className="bg-slate-950 p-2 font-sans font-semibold tracking-wider text-cyan-500"
          >
            <option value="hi" className="font-mono font-normal text-cyan-100">
              Hinglish
            </option>
            <option value="bn" className="font-mono font-normal text-cyan-100">
              Bengali
            </option>
            <option value="ta" className="font-mono font-normal text-cyan-100">
              Tamil
            </option>
            <option value="te" className="font-mono font-normal text-cyan-100">
              Telugu
            </option>
            <option value="ml" className="font-mono font-normal text-cyan-100">
              Malayalam
            </option>
            <option value="pa" className="font-mono font-normal text-cyan-100">
              Punjabi
            </option>
            <option value="mr" className="font-mono font-normal text-cyan-100">
              Marathi
            </option>
            <option value="gu" className="font-mono font-normal text-cyan-100">
              Gujarati
            </option>
            <option value="kn" className="font-mono font-normal text-cyan-100">
              Kannada
            </option>
            <option value="ur" className="font-mono font-normal text-cyan-100">
              Urdu
            </option>
            <option value="as" className="font-mono font-normal text-cyan-100">
              Assamese
            </option>
          </optgroup>
          <optgroup
            label="Foreign Languages"
            className="bg-slate-950 p-2 font-sans font-semibold tracking-wider text-cyan-500"
          >
            <option value="en" className="font-mono font-normal text-cyan-100">
              English
            </option>
            <option value="ja" className="font-mono font-normal text-cyan-100">
              Japanese
            </option>
            <option value="es" className="font-mono font-normal text-cyan-100">
              Spanish
            </option>
            <option value="de" className="font-mono font-normal text-cyan-100">
              German
            </option>
            <option value="zh" className="font-mono font-normal text-cyan-100">
              Chinese
            </option>
            <option value="ko" className="font-mono font-normal text-cyan-100">
              Korean
            </option>
            <option value="fr" className="font-mono font-normal text-cyan-100">
              French
            </option>
            <option value="ru" className="font-mono font-normal text-cyan-100">
              Russian
            </option>
            <option value="ar" className="font-mono font-normal text-cyan-100">
              Arabic
            </option>
          </optgroup>
        </select>
        {/* Custom HUD-style Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-600 transition-colors group-hover:text-cyan-400">
          <svg
            className="h-4 w-4 fill-current drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
