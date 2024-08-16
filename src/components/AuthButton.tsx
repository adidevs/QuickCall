"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

export default function AuthButton() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (session) {
    return (
      <Popover>
        <PopoverTrigger className="m-2 text-base rounded-2xl border border-black px-2 py-1">
          Hi {session.user.name}!
        </PopoverTrigger>
        <PopoverContent className="flex justify-center items-center flex-col">
          <span>
            Logged in as: <br />
            {session.user.email}
          </span>
          <Button className="m-2 bg-blue-600" onClick={() => signOut()}>
            Sign out
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <button
      className="btn btn-primary bg-white text-base text-black font-semibold px-4 py-1 mr-2  rounded-full border border-black hover:bg-black hover:text-white"
      onClick={() => router.push("/sign-in")}
    >
      Sign in
    </button>
  );
}
