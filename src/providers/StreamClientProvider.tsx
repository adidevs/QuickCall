"use client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "@/actions/stream.actions";
import { useSession } from "next-auth/react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();
  console.warn(session?.user);
  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    if (!apiKey) throw new Error("Stream API Key not found");
    console.warn(session);
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: session?.user.email?.replace(/\./g, "") as string,
        name: session?.user.name as string,
      },
      tokenProvider,
    });
    setVideoClient(client);
  }, [session, status]);

  if (!videoClient) {
    return <div>{children}</div>;
  }
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
