"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <p>{session.expires}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <div>
          <h1></h1>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast.promise(
      signIn("credentials", {
        identifier: email,
        password: password,
        redirect: false,
      }),
      {
        pending: "Signing in...",
        success: "Signed in successfully",
        error: "Failed to sign in",
      }
    );
    router.replace("/");
  };
  return (
    <div className=" w-1/2 flex flex-col text-center m-auto pt-48 lg:w-1/3">
      <h1 className=" text-3xl font-bold m-3">Sign In</h1>
      <button
        className="btn btn-primary bg-white text-black font-semibold px-5 py-2 rounded-full border border-black hover:bg-black hover:text-white"
        onClick={() =>
          toast.promise(signIn("google"), {
            pending: "Signing in with Google..",
            success: "Taking you to Google sign in",
            error: "Failed to sign in",
          })
        }
      >
        <Image className=" inline-block size-9" src="/google.png" alt="" width={36} height={36}/>{" "}
        Continue with Google
      </button>
      <h3 className=" text-xl font-semibold m-2">OR</h3>
      <form className=" flex flex-col text-center ">
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="border border-black rounded-md p-2 my-2"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="border border-black rounded-md p-2 my-2"
        />
        <button
          onClick={handleSubmit}
          className="btn btn-primary bg-white text-black font-semibold px-5 py-2 rounded-full border border-black hover:bg-black hover:text-white"
        >
          Sign In
        </button>
      </form>
      <p className="m-2">
        Do not have an account?{" "}
        <a className="text-blue-500" href="/sign-up">
          Sign Up!
        </a>
      </p>
    </div>
  );
};

