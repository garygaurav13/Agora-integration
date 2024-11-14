"use client";

import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useState } from 'react';
import type { VideoPlayer } from '@/lib/agora';

interface VideoControlsProps {
  localTracks: VideoPlayer;
}

export default function VideoControls({ localTracks }: VideoControlsProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const toggleAudio = () => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={isAudioMuted ? "destructive" : "default"}
        size="icon"
        onClick={toggleAudio}
      >
        {isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      <Button
        variant={isVideoMuted ? "destructive" : "default"}
        size="icon"
        onClick={toggleVideo}
      >
        {isVideoMuted ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
      </Button>
    </div>
  );
}