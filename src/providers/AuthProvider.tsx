"use client";
import { SessionProvider } from "next-auth/react";
import { useCallStatus } from "./CallStatusProvider";
import React from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCallActive } = useCallStatus();
  return (
    <SessionProvider refetchOnWindowFocus={!isCallActive}>
      {children}
    </SessionProvider>
  );
}
