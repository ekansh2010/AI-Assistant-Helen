import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AgentAudioTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
}

export const AgentTile = ({
  state,
  audioTrack,
  className,
  ref,
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  const stateTheme = {
    listening: {
      color: 'bg-cyan-500/10 border-cyan-500/30',
      glow: 'shadow-[0_0_60px_rgba(6,182,212,0.3)]',
      text: 'HELEN IS LISTENING',
      textColor: 'text-cyan-400',
      waveColor: '[&>div]:bg-cyan-400 [&>div]:shadow-[0_0_10px_rgba(6,182,212,0.8)]',
      accentColor: 'border-cyan-500/40',
    },
    thinking: {
      color: 'bg-purple-500/10 border-purple-500/30',
      glow: 'shadow-[0_0_60px_rgba(168,85,247,0.3)]',
      text: 'HELEN IS THINKING',
      textColor: 'text-purple-400',
      waveColor: '[&>div]:bg-purple-400 [&>div]:shadow-[0_0_10px_rgba(168,85,247,0.8)]',
      accentColor: 'border-purple-500/40',
    },
    speaking: {
      color: 'bg-rose-500/10 border-rose-500/30',
      glow: 'shadow-[0_0_70px_rgba(244,63,94,0.45)]',
      text: 'HELEN IS SPEAKING',
      textColor: 'text-rose-400',
      waveColor: '[&>div]:bg-rose-400 [&>div]:shadow-[0_0_10px_rgba(244,63,94,0.8)]',
      accentColor: 'border-rose-500/40',
    },
    idle: {
      color: 'bg-slate-900/40 border-slate-700/30',
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.02)]',
      text: 'STANDBY MODE',
      textColor: 'text-slate-400',
      waveColor: '[&>div]:bg-slate-600',
      accentColor: 'border-slate-800',
    },
  };

  const currentTheme =
    state in stateTheme ? stateTheme[state as keyof typeof stateTheme] : stateTheme.idle;

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col items-center justify-center p-8 transition-all duration-500',
        className
      )}
    >
      {/* Outer Holographic Rotating HUD Ring */}
      <div
        className={cn(
          'absolute h-64 w-64 animate-[spin_40s_linear_infinite] rounded-full border border-dashed transition-all duration-1000 ease-in-out',
          currentTheme.accentColor,
          state === 'idle' ? 'opacity-20' : 'opacity-60'
        )}
      />

      {/* Middle Counter-Rotating HUD Ring */}
      <div
        className={cn(
          'absolute h-[236px] w-[236px] animate-[spin_25s_linear_infinite_reverse] rounded-full border border-dotted transition-all duration-1000 ease-in-out',
          currentTheme.accentColor,
          state === 'idle' ? 'opacity-10' : 'opacity-40'
        )}
      />

      {/* Pulsing Core Ambient Aura */}
      <div
        className={cn(
          'absolute h-48 w-48 rounded-full opacity-50 blur-[50px] transition-all duration-700',
          state === 'listening' && 'bg-cyan-500/15',
          state === 'thinking' && 'bg-purple-500/15',
          state === 'speaking' && 'bg-rose-500/20',
          state === 'idle' && 'bg-transparent'
        )}
      />

      {/* Central Holographic Core */}
      <div
        className={cn(
          'relative flex h-48 w-48 items-center justify-center rounded-full border backdrop-blur-3xl transition-all duration-500',
          currentTheme.color,
          currentTheme.glow,
          state === 'speaking' ? 'scale-[1.03]' : 'scale-100'
        )}
      >
        {/* Core telemetry overlay detail */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent" />

        {/* Futuristic Grid inside the core */}
        <div className="absolute inset-4 rounded-full border border-white/[0.02] bg-[radial-gradient(circle,_transparent_30%,_rgba(0,0,0,0.4)_100%)]" />

        {/* Audio Visualizer Waves */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <BarVisualizer
            barCount={15}
            state={state}
            options={{ minHeight: 6 }}
            trackRef={audioTrack}
            className={cn(
              'flex h-12 w-32 items-end justify-center gap-[5px] [&>div]:w-[3.5px] [&>div]:rounded-full [&>div]:transition-all [&>div]:duration-150',
              currentTheme.waveColor
            )}
          />
        </div>
      </div>

      {/* State Label with futuristic typography */}
      <div className="z-10 mt-8 text-center select-none">
        <p
          className={cn(
            'font-mono text-[10px] font-black tracking-[0.35em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-colors duration-500',
            currentTheme.textColor
          )}
        >
          {currentTheme.text}
        </p>
      </div>
    </div>
  );
};
