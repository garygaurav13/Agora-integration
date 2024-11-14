"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Video } from 'lucide-react';
import VideoRoom from '@/components/VideoRoom';

export default function Home() {
  const [channelName, setChannelName] = useState('');
  const [isInCall, setIsInCall] = useState(false);

  const joinCall = () => {
    if (channelName.trim()) {
      setIsInCall(true);
    }
  };

  if (isInCall) {
    return <VideoRoom channelName={channelName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-primary/10 p-4">
            <Video className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center">
            Video Call Platform
          </h1>
          
          <p className="text-gray-400 text-center">
            Enter a room name to start or join a video call
          </p>

          <div className="w-full space-y-4">
            <Input
              type="text"
              placeholder="Enter room name..."
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            
            <Button 
              className="w-full"
              size="lg"
              onClick={joinCall}
              disabled={!channelName.trim()}
            >
              Join Call
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}