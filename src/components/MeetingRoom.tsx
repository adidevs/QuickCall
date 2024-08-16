import {
  useCall,
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallControls,
  CallStatsButton,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EndCallButton from "@/components/EndCallButton";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CallLayoutType = "speaker-left" | "speaker-right" | "grid";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = React.useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = React.useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callState = useCallCallingState();

  if (callState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white bg-[#000d24]">
      <div className=" relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={`${
            showParticipants ? "show-block" : "hidden"
          } h-[calc(100vh-86px)] ml-2`}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push(`/`)} />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl  px-4 py-2 hover:bg-[#333333]">
              <Image src="/layout.png" alt="Layout" height={20} width={20} />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-black bg-black text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="border-hidden"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-hidden" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <Button
          variant="link"
          onClick={() => setShowParticipants((prev) => !prev)}
        >
          <Image src="/users.png" alt="Users" height={20} width={20} />
        </Button>
        <EndCallButton />
      </div>
    </section>
  );
}

export default MeetingRoom;
