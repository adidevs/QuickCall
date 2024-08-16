"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { auth } from "@/auth";
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.STREAM_SECRET as string;

export const tokenProvider = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Session not found");
  if (!apiKey) throw new Error("Stream API Key not found");
  if (!apiSecret) throw new Error("Stream API Secret not found");
  const user = {
    id: session?.user.email?.replace(/\./g, "") as string,
    name: session?.user.name as string,
  };
  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 3600;
  const issued = Math.round(new Date().getTime() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);
  return token;
};
