import RoomInfo from "@/components/RoomInfo";
import Image from "next/image";
import DateComponent from "@/components/DateComponent";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="p-1">
      <nav className="flex justify-between items-center mx-2 pt-2 text-xl">
        <h1 className="font-light text-2xl">QuickCall</h1>
        <div className="flex justify-between items-center">
          <AuthButton />
          <DateComponent />
        </div>
      </nav>
      <div className="flex justify-around items-center mx-2 flex-col lg:flex-row text-center lg:text-left">
        <div>
          <h1 className="font-medium text-4xl mt-4 mb-4 lg:text-5xl">
            Connect with People.
            <br />
            In an instant!
          </h1>
          <p className="font-light mb-10 mt-4">
            Hopping on a quick call is now simpler than ever.
            <br />
          </p>
          <RoomInfo />
        </div>
        <div className="mt-8 lg:mt-0">
          <Image src="/talk.svg" alt="video call" width={500} height={500} />
          <p className="mt-4">
            Create a meeting link and share the code to hop on to a quick
            one-on-one
          </p>
        </div>
      </div>
    </main>
  );
}
