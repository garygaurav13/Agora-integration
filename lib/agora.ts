import { createClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

export const createAgoraClient = () => {
  return createClient({ mode: 'rtc', codec: 'vp8' });
};

export const config = { appId };

export type VideoPlayer = {
  uid: number;
  videoTrack: ICameraVideoTrack | undefined;
  audioTrack: IMicrophoneAudioTrack | undefined;
};

export type RemotePlayer = {
  uid: number;
  videoTrack: MediaStreamTrack | undefined;
  audioTrack: MediaStreamTrack | undefined;
};