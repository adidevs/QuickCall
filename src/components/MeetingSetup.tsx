"use client";
import { useState, useEffect } from "react";
import {
  VideoPreview,
  useCall,
  DeviceSettings,
  Avatar,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

export const ParticipantsPreview = () => {
  const { useCallSession } = useCallStateHooks();
  const session = useCallSession();

  if (!session?.participants || session?.participants.length === 0) return null;

  return (
    <div>
      <div>Already in call ({session?.participants.length}):</div>
      <div className="flex justify-center items-center gap-4">
        {session?.participants.map((participant, index) => (
          <div key={participant.user.id || index}>
            <Avatar
              name={participant.user.name}
              imageSrc={participant.user.image}
            />
            {participant.user.name && <div>{participant.user.name}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

function MeetingSetup({
  setIsCallSetup,
}: {
  setIsCallSetup: (value: boolean) => void;
}) {
  const [isMicCamEnabled, setIsMicCamEnabled] = useState(false);
  const call = useCall();

  if (!call)
    throw new Error("useCall hook is to be used in StreamCall Component ");

  useEffect(() => {
    if (isMicCamEnabled) {
      call?.camera?.disable();
      call?.microphone?.disable();
    } else {
      call?.camera?.enable();
      call?.microphone?.enable();
    }
  }, [isMicCamEnabled, call?.camera, call?.microphone]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-full lg:flex-row">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold m-2">Setup</h1>
        <VideoPreview />
        <div className="flex h-16 items-center justify-center gap-3">
          <label
            className="flex items-center justify-center gap-2 cursor-pointer font-medium"
            htmlFor=""
          >
            <input
              type="checkbox"
              checked={isMicCamEnabled}
              onChange={(e) => {
                setIsMicCamEnabled(e.target.checked);
              }}
            />
            Join with Mic and Camera Off
          </label>
          <div className="text-white font-inter">
            <DeviceSettings />
          </div>
        </div>
        <Button
          className="rounded-md bg-blue-500 text-white px-4 py-2.5"
          onClick={() => {
            call.join();
            setIsCallSetup(true);
          }}
        >
          Join Meeting
        </Button>
      </div>
      <ParticipantsPreview />
    </div>
  );
}

export default MeetingSetup;
