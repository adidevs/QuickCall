"use client";
import { useEffect, useState } from "react";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useCallStatus } from "@/providers/CallStatusProvider";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function MeetingPage({
  params,
}: {
  params: { meeting_id: string };
}) {
  const router = useRouter();
  const { setCallActive } = useCallStatus();
  const [isCallSetup, setIsCallSetup] = useState(false);
  const { call, isCallLoading, status } = useGetCallById(params.meeting_id);
  useEffect(() => {
    setCallActive(true);
    window.addEventListener("beforeunload", () => {
      setCallActive(false);
      call?.camera.disable();
      call?.microphone.disable();
    });

    return () => {
      setCallActive(false);
    };
  }, [setCallActive, call?.camera, call?.microphone]);

  if (status == "unauthenticated") return router.replace("/");
  if (isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isCallSetup ? (
            <MeetingSetup setIsCallSetup={setIsCallSetup} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
