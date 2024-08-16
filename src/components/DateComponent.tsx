"use client";

export default function DateComponent() {
  return (
    <h1 className="font-light hidden md:block">{new Date().toDateString()}</h1>
  );
}
