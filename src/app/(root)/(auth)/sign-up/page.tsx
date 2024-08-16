"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (name === "" || email === "") {
      toast.error("Name and email are required");
      return;
    } else if (password.length < 4) {
      toast.warn("Password must be at least 8 characters");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const SignUserUp = async () => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 200) {
          await signIn("credentials", {
            identifier: email,
            password: password,
            redirect: false,
          });
          router.replace("/");
        } else {
          toast.error(`${data.message}`);
        }
      }
    };
    toast.promise(SignUserUp(), {
      pending: "Signing Up...",
      success: "Signed Up successfully",
      error: "Failed to sign up",
    });
  };
  return (
    <div className=" flex flex-col w-1/2 m-auto pt-36 text-center lg:w-1/3">
      <h1 className=" text-3xl font-semibold m-3">Sign Up</h1>
      <button
        className="btn btn-primary bg-white text-black font-semibold px-5 py-2 rounded-full border border-black hover:bg-black hover:text-white"
        onClick={() => signIn("google")}
      >
        <Image className=" inline-block size-9" src="/google.png" alt="" height={36} width={36}/>{" "}
        Continue with Google
      </button>
      <h3 className=" text-xl font-semibold m-2">OR</h3>
      <form className=" flex flex-col text-center ">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          className="border border-black rounded-md p-2 my-2"
        />
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
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="border border-black rounded-md p-2 my-2"
        />
        <button
          onClick={handleSignUp}
          className="btn btn-primary bg-white text-black font-semibold px-5 py-2 rounded-full border border-black hover:bg-black hover:text-white"
        >
          Sign Up
        </button>
      </form>
      <p className="m-2">
        Already have an account?{" "}
        <a className="text-blue-500" href="/sign-in">
          Sign In!
        </a>
      </p>
    </div>
  );
}
