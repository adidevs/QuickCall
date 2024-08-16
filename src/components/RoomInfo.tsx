"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BsShareFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { createMeeting, joinMeeting } from "@/utils/meetingHelper";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RoomInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState("");
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    link: "",
  });

  const joinRoom = async () => {
    if (status !== "authenticated" || !client) {
      toast.info("Login to create or join a room");
      return;
    }
    if (
      roomInfo.length < 12 &&
      !roomInfo.includes(`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/`)
    ) {
      toast.error("Invalid meeting code!");
      return;
    }
    const roomId = roomInfo.slice(-12);
    toast.info(roomId);
    const joinCall = async () => {
      const getRoomInfo = await joinMeeting(roomId, session.user.email || "");
      if (!getRoomInfo) {
        toast.error("Invalid meeting code!");
        return;
      }
      router.replace(`/meeting/${roomId}`);
    };
    toast.promise(joinCall(), {
      pending: "Joining room...",
      success: "Room joined successfully",
      error: "Failed to join room",
    });
  };

  const newRoom = async (forLater: boolean = false) => {
    if (status !== "authenticated" || !client) {
      toast.info("Login to create or join a room");
      return;
    }
    try {
      const id = await createMeeting(session.user.email || "");
      const call = client.call("default", id);
      if (!call) {
        toast.error("Failed to create a room");
        return;
      }
      const createInstantCall = async () => {
        const startsAt =
          values.dateTime.toISOString() || new Date(Date.now()).toISOString();

        await call.getOrCreate({
          data: {
            starts_at: startsAt,
          },
        });

        router.replace(`/meeting/${id}`);
      };

      const createCallForLater = async () => {
        setValues({
          ...values,
          link: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${id}`,
        });
        await call.getOrCreate();
      };

      if (forLater) {
        toast.promise(createCallForLater(), {
          pending: "Creating room...",
          success: "Room created successfully",
          error: "Failed to create a room",
        });
      } else {
        toast.promise(createInstantCall(), {
          pending: "Creating room...",
          success: "Room created successfully",
          error: "Failed to create a room",
        });
      }
    } catch (error) {
      toast.error("Failed to create a room");
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(values.link);
    toast.success("Meeting id copied to clipboard!");
  };

  return (
    <div className="flex justify-items-start items-center space-x-4">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className=" text-white border-hidden bg-blue-600 hover:bg-blue-700 text-base py-2 px-4 rounded-sm">
            New Meeting
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => newRoom()}>
              Start instant meeting
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem
                disabled={status !== "authenticated"}
                onClick={() => {
                  newRoom(true);
                }}
              >
                Create meeting for later
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to join the meeting after
              logging in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                placeholder="Link is loading..."
                value={values.link}
                readOnly
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyId}>
              <span className="sr-only">Copy</span>
              Copy
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        className="w-2/5 p-2 text-base border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600"
        type="text"
        value={roomInfo}
        onChange={(e) => setRoomInfo(e.target.value)}
        placeholder="Enter a code Or Link"
      />
      <button
        className="bg-white text-blue-600 hover:bg-blue-100 text-base py-2 px-4 rounded-sm"
        onClick={joinRoom}
        disabled={roomInfo === ""}
      >
        Join
      </button>
    </div>
  );
}
