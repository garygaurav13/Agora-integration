"use client";

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import VideoControls from './VideoControls';
import { useAgoraClient } from '@/hooks/useAgoraClient';

interface VideoRoomProps {
  channelName: string;
}

export default function VideoRoom({ channelName }: VideoRoomProps) {
  const router = useRouter();
  const { localTracks, remoteTracks, participantCount, cleanup } = useAgoraClient(channelName);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (localVideoRef.current && localTracks.videoTrack) {
      localTracks.videoTrack.play(localVideoRef.current);
    }
  }, [localTracks.videoTrack]);

  useEffect(() => {
    remoteTracks.forEach(track => {
      const container = remoteVideoRefs.current[track.uid];
      if (container && track.videoTrack) {
        track.videoTrack.play(container);
      }
    });
  }, [remoteTracks]);

  const leaveCall = async () => {
    await cleanup();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Video Room: {channelName}</h1>
            <div className="flex items-center mt-2 text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={leaveCall}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave Call
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local Video */}
          <Card className="relative overflow-hidden aspect-video bg-gray-950">
            <div ref={localVideoRef} className="w-full h-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <VideoControls localTracks={localTracks} />
            </div>
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-sm text-white">
              You
            </div>
          </Card>

          {/* Remote Videos */}
          {remoteTracks.map((track) => (
            <Card key={track.uid} className="relative overflow-hidden aspect-video bg-gray-950">
              <div 
                ref={el => remoteVideoRefs.current[track.uid] = el}
                className="w-full h-full"
              />
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-sm text-white">
                Participant {track.uid}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}