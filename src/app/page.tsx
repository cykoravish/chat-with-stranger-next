import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-4 border-lightgreen p-10 rounded-3xl">
        <header>
          <h1 className="text-center font-bold text-lightgreen">
            Best place to chat with strangers
          </h1>
        </header>
        <main>
          <div className="flex justify-center">
            <Image src="/logo.png" width={200} height={200} alt="chats" />
          </div>
          <div className="flex justify-center items-center gap-4">
            <label htmlFor="name" className="text-lg font-semibold text-darkgreen">
              Name:
            </label>
            <input
              type="text"
              className="px-4 py-2 text-base rounded-lg focus:outline-none font-mono bg-transparent border border-darkgreen text-white"
            />
          </div>
          <div className="text-center pt-6">
            <button className="border-2 text-lightgreen border-lightgreen font-semibold p-2 rounded-lg hover:bg-[#236167] hover:text-white w-full">
              Start Chat
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
