import Image from "next/image";
import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Image src="/loading.svg" alt="Loading" width={50} height={50} />
    </div>
  );
}

export default Loader;
