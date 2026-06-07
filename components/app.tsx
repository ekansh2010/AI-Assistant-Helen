'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room, RoomEvent } from 'livekit-client';
import { motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import { Welcome } from '@/components/welcome';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';
import { Button } from './ui/button';

const MotionWelcome = motion.create(Welcome);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    let aborted = false;
    if (sessionStarted && room.state === 'disconnected') {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: appConfig.isPreConnectBufferEnabled,
        }),
        existingOrRefreshConnectionDetails().then((connectionDetails) =>
          room.connect(connectionDetails.serverUrl, connectionDetails.participantToken)
        ),
      ]).catch((error) => {
        if (aborted) {
          // Once the effect has cleaned up after itself, drop any errors
          //
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    return () => {
      aborted = true;
      room.disconnect();
    };
  }, [
    room,
    sessionStarted,
    appConfig.isPreConnectBufferEnabled,
    existingOrRefreshConnectionDetails,
  ]);

  const { startButtonText } = appConfig;
  const router = useRouter();

  // Fetch Assistant Name and Language for Dashboard
  const [assistantButtonText, setAssistantButtonText] = useState(startButtonText);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [selectedLanguageName, setSelectedLanguageName] = useState('English');

  const LANGUAGE_MAP: Record<string, string> = {
    hi: 'Hinglish',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    pa: 'Punjabi',
    mr: 'Marathi',
    gu: 'Gujarati',
    kn: 'Kannada',
    ur: 'Urdu',
    as: 'Assamese',
    en: 'English',
    ja: 'Japanese',
    es: 'Spanish',
    de: 'German',
    zh: 'Chinese',
    ko: 'Korean',
    fr: 'French',
    ru: 'Russian',
    ar: 'Arabic',
  };

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          if (data.assistant_name) {
            setAssistantButtonText(`TALK TO ${data.assistant_name.toUpperCase()}`);
          }
          if (data.wake_word_enabled !== undefined) {
            setWakeWordEnabled(data.wake_word_enabled);
          }
          if (data.language) {
            const langName = LANGUAGE_MAP[data.language] || 'English';
            setSelectedLanguageName(langName);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch config for button name:', err));
  }, [startButtonText]);

  return (
    <main className="relative">
      <div className="absolute top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={() => router.push('/settings')}>
          {/* <Settings className="h-[1.2rem] w-[1.2rem]" /> */}
          <span className="font-bold">⚙️</span>
          <span className="sr-only">Settings</span>
        </Button>
      </div>
      <MotionWelcome
        key="welcome"
        startButtonText={assistantButtonText}
        assistantName={assistantButtonText
          .replace('TALK TO ', '')
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase())}
        languageName={selectedLanguageName}
        onStartCall={() => setSessionStarted(true)}
        disabled={sessionStarted}
        initial={{ opacity: 1 }}
        animate={{ opacity: sessionStarted ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'linear', delay: sessionStarted ? 0 : 0.5 }}
      />

      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />
        {/* --- */}
        <MotionSessionView
          key="session-view"
          appConfig={appConfig}
          assistantName={assistantButtonText
            .replace('TALK TO ', '')
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase())} // Propagate name
          languageName={selectedLanguageName}
          disabled={!sessionStarted}
          sessionStarted={sessionStarted}
          wakeWordEnabled={wakeWordEnabled}
          initial={{ opacity: 0 }}
          animate={{ opacity: sessionStarted ? 1 : 0 }}
          transition={{
            duration: 0.5,
            ease: 'linear',
            delay: sessionStarted ? 0.5 : 0,
          }}
        />
      </RoomContext.Provider>

      <Toaster />
    </main>
  );
}
