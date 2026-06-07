'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import { useWakeWord } from '@/hooks/useWakeWord';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SessionViewProps {
  appConfig: AppConfig;
  assistantName?: string;
  languageName?: string;
  disabled: boolean;
  sessionStarted: boolean;
  wakeWordEnabled?: boolean;
}

export const SessionView = ({
  appConfig,
  assistantName = 'Helen',
  languageName = 'English',
  disabled,
  sessionStarted,
  wakeWordEnabled = false,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  const [systemTime, setSystemTime] = useState('');

  useDebugMode({
    enabled: process.env.NODE_ENV !== 'production',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const offsetMinutes = now.getTimezoneOffset();
      const offsetSign = offsetMinutes <= 0 ? '+' : '-';
      const absOffsetMinutes = Math.abs(offsetMinutes);
      const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, '0');
      const offsetMins = String(absOffsetMinutes % 60).padStart(2, '0');
      const tzOffset = `GMT${offsetSign}${offsetHours}:${offsetMins}`;

      setSystemTime(`${hours}:${minutes}:${seconds} (${tzOffset})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSendMessage(message: string) {
    await send(message);
  }

  // --- WAKE WORD LOGIC ---
  const [hasShownInitialMuteToast, setHasShownInitialMuteToast] = useState(false);

  // Use the native Web Speech API hook
  const { keywordDetection, isLoaded, isListening } = useWakeWord(
    undefined,
    sessionStarted && wakeWordEnabled
  );

  // Auto-mute mic initially if wake word is active (Show toast only ONCE)
  useEffect(() => {
    if (wakeWordEnabled && sessionStarted && isLoaded && !hasShownInitialMuteToast) {
      room.localParticipant.setMicrophoneEnabled(false);
      setHasShownInitialMuteToast(true);
      toastAlert({
        title: 'WAKE WORD ACTIVE',
        description: `Microphone muted. Say "${assistantName}" to begin.`,
      });
    }
  }, [sessionStarted, isLoaded, room, assistantName, wakeWordEnabled, hasShownInitialMuteToast]);

  // Unmute mic when wake word is detected
  useEffect(() => {
    if (wakeWordEnabled && keywordDetection !== null) {
      console.log('Wake word detected!');
      room.localParticipant.setMicrophoneEnabled(true);
      toastAlert({
        title: `${assistantName.toUpperCase()} LISTENING`,
        description: 'Microphone unmuted.',
      });
    }
  }, [keywordDetection, room, assistantName, wakeWordEnabled]);

  // -----------------------

  // Watchdog connection status tracking to prevent disconnects on idle/listening/speaking states
  const [hasConnected, setHasConnected] = useState(false);

  useEffect(() => {
    if (sessionStarted && !hasConnected) {
      if (
        agentState === 'listening' ||
        agentState === 'thinking' ||
        agentState === 'speaking' ||
        agentState === 'idle'
      ) {
        setHasConnected(true);
      }
    }
  }, [agentState, sessionStarted, hasConnected]);

  useEffect(() => {
    if (sessionStarted && !hasConnected) {
      const timeout = setTimeout(() => {
        if (agentState === 'connecting' || agentState === 'disconnected') {
          toastAlert({
            title: 'CONNECTION TIMEOUT',
            description:
              'Helen failed to connect within 30 seconds. Please check your network or agent logs.',
          });
          room.disconnect();
        }
      }, 30_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, hasConnected, room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  const wakeWordStatusClass = cn(
    'inline-block font-bold transition-all duration-300',
    isListening && room.localParticipant.isMicrophoneEnabled
      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
      : 'animate-pulse text-blue-500/50'
  );

  // Dynamic state class helper
  const stateColorMap: Record<string, string> = {
    listening:
      'text-cyan-400 border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    thinking:
      'text-purple-400 border-purple-500/30 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    speaking:
      'text-rose-400 border-rose-500/30 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    connecting:
      'text-yellow-400 border-yellow-500/30 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    disconnected: 'text-slate-500 border-slate-700/20 bg-slate-950/20 shadow-none',
  };
  const activeStateStyle = stateColorMap[agentState] || stateColorMap.disconnected;

  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'fixed inset-0 overflow-hidden bg-black transition-opacity duration-500',
        disabled ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      {/* 1. Cyber Grid background with animation */}
      <div className="cyber-grid cyber-grid-animate absolute inset-0 opacity-20" />

      {/* Dynamic Ambient Background Glow */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] opacity-90 transition-all duration-1000 ease-in-out',
          agentState === 'listening' && 'from-cyan-950/20 via-black to-black',
          agentState === 'thinking' && 'from-purple-950/20 via-black to-black',
          agentState === 'speaking' && 'from-rose-950/20 via-black to-black',
          (agentState === 'connecting' || agentState === 'disconnected') &&
            'from-slate-950/20 via-black to-black'
        )}
      />

      {/* Left side telemetry panel (Large screens only) */}
      <div className="pointer-events-none fixed top-24 left-8 z-15 hidden w-64 flex-col bg-slate-950/10 p-5 text-left font-mono text-[10px] tracking-wider text-slate-400 backdrop-blur-[2px] lg:flex">
        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-cyan-500/40" />
        <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-cyan-500/40" />
        <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-500/40" />
        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-cyan-500/40" />

        <div className="mb-4 flex items-center space-x-2 border-b border-cyan-500/20 pb-2 text-cyan-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-500"></span>
          <span className="text-[9px] font-bold uppercase">COGNITIVE SYNC STATS</span>
        </div>
        <div className="space-y-1.5">
          <p className="flex justify-between">
            <span className="text-slate-500">ROOM_ID:</span>{' '}
            <span className="max-w-[130px] truncate font-bold text-cyan-400">
              {room.name || 'CONNECTING...'}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">PING_LATENCY:</span>{' '}
            <span className="text-slate-300">14MS</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">AUDIO_CODEC:</span>{' '}
            <span className="text-slate-300">OPUS/24KHZ</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">DECRYPT:</span>{' '}
            <span className="text-green-400">AES-GCM-256</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">SYS_LANG:</span>{' '}
            <span className="font-bold text-cyan-400">{languageName.toUpperCase()}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">SYS_TIME:</span>{' '}
            <span className="text-slate-300">{systemTime}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">MIC_STATE:</span>{' '}
            <span
              className={cn(
                'font-bold',
                room.localParticipant.isMicrophoneEnabled
                  ? 'animate-pulse text-green-400'
                  : 'text-red-400'
              )}
            >
              {room.localParticipant.isMicrophoneEnabled ? 'TRANSMITTING' : 'MUTED'}
            </span>
          </p>
        </div>
      </div>

      {/* Right side state monitor (Large screens only) */}
      <div className="pointer-events-none fixed top-24 right-8 z-15 hidden w-64 flex-col bg-slate-950/10 p-5 text-left font-mono text-[10px] tracking-wider text-slate-400 backdrop-blur-[2px] lg:flex">
        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-purple-500/40" />
        <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-purple-500/40" />
        <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-purple-500/40" />
        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-purple-500/40" />

        <div className="mb-4 flex items-center space-x-2 border-b border-purple-500/20 pb-2 text-purple-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-purple-500"></span>
          <span className="text-[9px] font-bold uppercase">NEURAL ENGINE MONITOR</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">ACTIVE CORE:</span>
            <span
              className={cn(
                'rounded border px-2 py-0.5 text-[8px] font-bold uppercase transition-all duration-500',
                activeStateStyle
              )}
            >
              {agentState}
            </span>
          </div>
          <p className="flex justify-between">
            <span className="text-slate-500">VAD_THRESH:</span>{' '}
            <span className="text-slate-300">-48DB</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">WAKE_TRIGGER:</span>{' '}
            <span className="text-purple-400">{wakeWordEnabled ? 'WAKE_WORD_ON' : 'BYPASSED'}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">VOL_INPUT:</span>{' '}
            <span className="text-slate-300">92%</span>
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-2 border-t border-slate-900 pt-3 text-[8px] text-slate-500">
          <span className="h-1 w-1 animate-ping rounded-full bg-green-500"></span>
          <span className="uppercase">Uplink Secured via WebRTC Gateway</span>
        </div>
      </div>

      {/* Futuristic scanning scanner line (Subtle decoration) */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.02),_rgba(0,255,0,0.01),_rgba(0,0,255,0.02))] bg-[size:100%_4px,_6px_100%]" />

      {/* Main content body containing conversation & visualizer */}
      <div className="relative z-10 h-full w-full overflow-y-auto pt-24 pb-44">
        {/* Glowing glassmorphic container for Chat Messages */}
        <div className="mx-auto w-full max-w-2xl px-4 md:px-0">
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, translateY: 15 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.98, translateY: 15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="hud-glowing-glow mb-6 rounded-2xl border border-cyan-500/10 bg-slate-950/65 p-6 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center justify-between border-b border-cyan-500/10 pb-3 font-mono text-[9px] tracking-wider text-cyan-400">
                  <span>TERMINAL LOG PROTOCOL</span>
                  <span className="animate-pulse">● TRANSCRIBING...</span>
                </div>
                <ChatMessageView className="scrollbar-thin scrollbar-thumb-cyan-500/20 max-h-[350px] space-y-3 overflow-y-auto pr-2 whitespace-pre-wrap">
                  <div className="space-y-4">
                    {messages.map((message: ReceivedChatMessage) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ChatEntry hideName key={message.id} entry={message} />
                      </motion.div>
                    ))}
                  </div>
                </ChatMessageView>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Core Media/Visualizer Tiles */}
        <MediaTiles chatOpen={chatOpen} />
      </div>

      {/* Fixed bottom controls */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-cyan-500/10 bg-black/50 px-4 pt-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md md:px-12 md:pb-10">
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          {appConfig.isPreConnectBufferEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: messages.length === 0 ? 1 : 0.8,
                transition: {
                  ease: 'easeIn',
                  delay: messages.length > 0 ? 0 : 0.2,
                  duration: 0.3,
                },
              }}
              aria-hidden={messages.length > 0}
              className="absolute inset-x-0 -top-10 text-center font-mono text-[10px] tracking-[0.25em]"
            >
              {!wakeWordEnabled ? (
                <p
                  className={cn(
                    'inline-block font-bold transition-all duration-300',
                    room.localParticipant.isMicrophoneEnabled
                      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : 'text-red-500/60'
                  )}
                >
                  {room.localParticipant.isMicrophoneEnabled
                    ? '🎙️ TRANSMITTING...'
                    : '🔇 MUTED (TAP TO UNMUTE)'}
                </p>
              ) : !isLoaded ? (
                <p className="inline-block animate-pulse text-cyan-400/50">
                  {assistantName} is preparing neural links...
                </p>
              ) : (
                <p className={wakeWordStatusClass}>
                  {isListening && room.localParticipant.isMicrophoneEnabled
                    ? '🎙️ NEURAL UPLINK ACTIVE'
                    : `🎙️ WAITING FOR WAKE COMMAND "${assistantName.toUpperCase()}"...`}
                </p>
              )}
            </motion.div>
          )}

          <AgentControlBar
            capabilities={capabilities}
            onChatOpenChange={setChatOpen}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </section>
  );
};
