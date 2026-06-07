import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  assistantName?: string;
  languageName?: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  assistantName = 'Helen',
  languageName = 'English',
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeProps) => {
  const [mounted, setMounted] = useState(false);
  const [systemTime, setSystemTime] = useState('');
  const [cpuLoad, setCpuLoad] = useState(14.2);
  const [ramUsage, setRamUsage] = useState(1.82);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const offsetMinutes = now.getTimezoneOffset();
      const offsetSign = offsetMinutes <= 0 ? '+' : '-';
      const absOffsetMinutes = Math.abs(offsetMinutes);
      const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, '0');
      const offsetMins = String(absOffsetMinutes % 60).padStart(2, '0');
      const tzOffset = `GMT${offsetSign}${offsetHours}:${offsetMins}`;

      setSystemTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} (${tzOffset})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time CPU load fluctuations
      setCpuLoad((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        const next = prev + delta;
        return Math.min(Math.max(next, 8.0), 22.0);
      });
      // Simulate small RAM oscillations
      setRamUsage((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        const next = prev + delta;
        return Math.min(Math.max(next, 1.75), 1.95);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'fixed inset-0 mx-auto flex h-svh flex-col items-center justify-center overflow-hidden bg-black text-center selection:bg-cyan-500/30',
        disabled ? 'z-10' : 'z-20'
      )}
    >
      {/* 1. Cyber Grid background with animation */}
      <div className="cyber-grid cyber-grid-animate absolute inset-0 opacity-40" />

      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black opacity-95" />
      <div className="pointer-events-none absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/3 bottom-1/4 h-[450px] w-[450px] rounded-full bg-purple-500/5 blur-[130px]" />

      {/* Rotating HUD Rings */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-[spin_80s_linear_infinite] rounded-full border border-dashed border-cyan-500/5" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[630px] w-[630px] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite_reverse] rounded-full border border-dotted border-purple-500/5" />

      {/* Left side telemetry panel (Large screens only) */}
      <div className="pointer-events-none fixed top-1/4 left-12 z-15 hidden w-72 flex-col bg-slate-950/10 p-5 text-left font-mono text-[10px] tracking-wider text-slate-400 backdrop-blur-[2px] lg:flex">
        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-cyan-500/40" />
        <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-cyan-500/40" />
        <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-500/40" />
        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-cyan-500/40" />

        <div className="mb-4 flex items-center space-x-2 border-b border-cyan-500/20 pb-2 text-cyan-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-500"></span>
          <span className="text-[10px] font-bold tracking-widest">COGNITIVE CORE STATUS</span>
        </div>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-slate-500">SYS_ID:</span>{' '}
            <span className="font-bold text-cyan-400">HELEN_V2.5.0</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">MODEL:</span>{' '}
            <span className="text-slate-300">GEMINI-2.5-AUDIO</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">UPLINK_STABILITY:</span>{' '}
            <span className="text-green-400">99.98%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">SESSION_TIME:</span>{' '}
            <span className="text-slate-300">{systemTime}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">SYNAPSE_LATENCY:</span>{' '}
            <span className="text-cyan-400">12MS</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">WAKE_WORD:</span>{' '}
            <span className="text-purple-400">{assistantName.toUpperCase()}</span>
          </p>
        </div>
        <div className="mt-4 border-t border-slate-900 pt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900">
            <div className="h-full w-[85%] animate-[pulse_2s_infinite] bg-cyan-500" />
          </div>
          <p className="mt-2 text-[8px] leading-relaxed text-slate-500 uppercase">
            Initializing advanced speech visualizer & NLP parser protocols. Ready to receive voice
            commands.
          </p>
        </div>
      </div>

      {/* Right side telemetry panel (Large screens only) */}
      <div className="pointer-events-none fixed top-1/4 right-12 z-15 hidden w-72 flex-col bg-slate-950/10 p-5 text-left font-mono text-[10px] tracking-wider text-slate-400 backdrop-blur-[2px] lg:flex">
        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-purple-500/40" />
        <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-purple-500/40" />
        <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-purple-500/40" />
        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-purple-500/40" />

        <div className="mb-4 flex items-center space-x-2 border-b border-purple-500/20 pb-2 text-purple-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-purple-500"></span>
          <span className="text-[10px] font-bold tracking-widest">ACTIVE SENSOR MODULES</span>
        </div>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-slate-500">WEATHER_API:</span>{' '}
            <span className="text-green-400">ACTIVE</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">GOOGLE_SEARCH:</span>{' '}
            <span className="text-green-400">ACTIVE</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">FS_OPENER:</span>{' '}
            <span className="text-green-400">ACTIVE</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">LONG_TERM_MEM:</span>{' '}
            <span className="text-purple-400">MEM0_CLOUD</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">LANGUAGE:</span>{' '}
            <span className="font-bold text-cyan-400">{languageName.toUpperCase()}</span>
          </p>
        </div>
        <div className="mt-4 border-t border-slate-900 pt-4">
          <div className="flex items-center justify-around">
            {/* RAM Radial Dial */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#1e1b4b" strokeWidth="2.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeDasharray="94.2"
                    strokeDashoffset={94.2 - 94.2 * (ramUsage / 16)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[8px] font-bold text-purple-400">
                  {((ramUsage / 16) * 100).toFixed(1)}%
                </span>
              </div>
              <span className="text-[8px] tracking-widest text-slate-500 uppercase">RAM USE</span>
              <span className="font-mono text-[7px] text-slate-400">{ramUsage.toFixed(2)} GB</span>
            </div>

            {/* CPU Radial Dial */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#082f49" strokeWidth="2.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeDasharray="94.2"
                    strokeDashoffset={94.2 - 94.2 * (cpuLoad / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[8px] font-bold text-cyan-400">
                  {cpuLoad.toFixed(1)}%
                </span>
              </div>
              <span className="text-[8px] tracking-widest text-slate-500 uppercase">CPU LOAD</span>
              <span className="font-mono text-[7px] text-slate-400">{cpuLoad.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Portal Container */}
      <div className="hud-glowing-glow relative z-10 w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-slate-950/60 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] md:p-10">
        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute -top-[2px] -left-[2px] h-6 w-6 rounded-tl-2xl border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-[2px] -right-[2px] h-6 w-6 rounded-tr-2xl border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-[2px] -left-[2px] h-6 w-6 rounded-bl-2xl border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -right-[2px] -bottom-[2px] h-6 w-6 rounded-br-2xl border-r-2 border-b-2 border-cyan-400" />

        {/* Top Header */}
        <header className="relative flex flex-col items-center">
          <div className="mb-2 rounded border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 font-mono text-[8px] tracking-[0.25em] text-cyan-400 uppercase">
            SECURE LINK TERMINAL
          </div>
          <h1 className="bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-5xl font-black tracking-[0.35em] text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            HELEN
          </h1>
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-slate-400 uppercase">
            NEURAL VOICE RECEPTOR
          </p>
        </header>

        {/* AI Viewport with GIF and Scanning Effect */}
        <div className="relative my-8 aspect-[16/10] w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-black/60 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
          {/* Scanning Line overlay */}
          <div className="scanline absolute inset-x-0 z-20 h-1.5 animate-[bounce_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />

          <Image
            src="/Helen.gif"
            alt="Helen Neural Core View"
            fill
            sizes="450px"
            priority
            className="object-cover opacity-80 mix-blend-screen transition-all duration-700 hover:scale-105 hover:opacity-95"
          />

          {/* Screen Glare and tint */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Action button */}
        <div className="flex flex-col items-center justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const clickSound = new Audio('/button-click.m4a');
              clickSound.volume = 0.3;
              clickSound.play().catch(() => {});
              onStartCall();
            }}
            className="w-full cursor-pointer border border-cyan-500/30 bg-cyan-950/20 py-7 font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
          >
            {startButtonText}
          </Button>

          <div className="mt-5 flex items-center justify-center space-x-2 font-mono text-[9px] tracking-widest text-slate-400 uppercase select-none">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400"></span>
            <span>COGNITIVE CORE SECURED • LINK READY</span>
          </div>
        </div>
      </div>

      {/* Floating System Status Footer */}
      <footer className="pointer-events-none fixed bottom-6 left-0 z-20 flex w-full items-center justify-center">
        <div className="rounded-full border border-cyan-500/25 bg-black/60 px-5 py-2.5 shadow-md backdrop-blur-md">
          <p className="font-mono text-[9px] tracking-[0.25em] text-slate-400 uppercase">
            SYSTEM STATUS: ONLINE • <span className="text-cyan-400">COGNITIVE SYNC ENGAGED</span>
          </p>
        </div>
      </footer>

      {/* Corner Graphic Layout Lines */}
      <div className="pointer-events-none fixed top-0 left-0 h-48 w-48 rounded-tl-3xl border-t border-l border-cyan-500/10" />
      <div className="pointer-events-none fixed top-0 right-0 h-48 w-48 rounded-tr-3xl border-t border-r border-cyan-500/10" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-48 w-48 rounded-bl-3xl border-b border-l border-cyan-500/10" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-48 w-48 rounded-br-3xl border-r border-b border-cyan-500/10" />
    </section>
  );
};
