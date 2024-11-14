"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IRemoteUser } from 'agora-rtc-sdk-ng';
import { createAgoraClient, config, VideoPlayer, RemotePlayer } from '@/lib/agora';

export function useAgoraClient(channelName: string) {
  const [localTracks, setLocalTracks] = useState<VideoPlayer>({ uid: 0, videoTrack: undefined, audioTrack: undefined });
  const [remoteTracks, setRemoteTracks] = useState<RemotePlayer[]>([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const initialized = useRef(false);

  const handleUserPublished = useCallback(async (user: IRemoteUser, mediaType: 'audio' | 'video') => {
    if (!clientRef.current) return;
    
    await clientRef.current.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      setRemoteTracks(prev => [
        ...prev.filter(track => track.uid !== user.uid),
        {
          uid: user.uid,
          videoTrack: user.videoTrack,
          audioTrack: undefined,
        },
      ]);
    }
    
    if (mediaType === 'audio') {
      user.audioTrack?.play();
      setRemoteTracks(prev => [
        ...prev.filter(track => track.uid !== user.uid),
        {
          uid: user.uid,
          videoTrack: undefined,
          audioTrack: user.audioTrack,
        },
      ]);
    }
  }, []);

  const handleUserLeft = useCallback((user: IRemoteUser) => {
    setRemoteTracks(prev => prev.filter(track => track.uid !== user.uid));
    setParticipantCount(prev => Math.max(1, prev - 1));
  }, []);

  const handleUserJoined = useCallback(() => {
    setParticipantCount(prev => prev + 1);
  }, []);

  const cleanup = useCallback(async () => {
    if (clientRef.current) {
      localTracks.audioTrack?.close();
      localTracks.videoTrack?.close();
      clientRef.current.removeAllListeners();
      await clientRef.current.leave();
      clientRef.current = null;
      initialized.current = false;
      setIsConnected(false);
      setLocalTracks({ uid: 0, videoTrack: undefined, audioTrack: undefined });
      setRemoteTracks([]);
      setParticipantCount(1);
    }
  }, [localTracks.audioTrack, localTracks.videoTrack]);

  useEffect(() => {
    const init = async () => {
      if (initialized.current || !channelName) return;
      
      try {
        clientRef.current = createAgoraClient();
        const client = clientRef.current;

        client.on('user-published', handleUserPublished);
        client.on('user-left', handleUserLeft);
        client.on('user-joined', handleUserJoined);

        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        await client.join(config.appId, channelName, null, Math.floor(Math.random() * 1000000));
        await client.publish([audioTrack, videoTrack]);
        
        setLocalTracks({
          uid: client.uid as number,
          audioTrack,
          videoTrack,
        });

        initialized.current = true;
        setIsConnected(true);
      } catch (error) {
        console.error('Error initializing video call:', error);
        await cleanup();
      }
    };

    init();
    return () => {
      cleanup();
    };
  }, [channelName, cleanup, handleUserJoined, handleUserLeft, handleUserPublished]);

  return {
    localTracks,
    remoteTracks,
    participantCount,
    isConnected,
    cleanup,
  };
}