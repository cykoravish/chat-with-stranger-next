"use client";
import Image from "next/image";
import React from "react";
import { useAppContext } from "../context";

export default function Page() {
  const { setName } = useAppContext();
  const submitNameHandler = () => {
    console.log("name submitted");
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-2 sm:border-4 w-[20rem] sm:w-[25rem] border-lightgreen p-10 rounded-3xl shadow-2xl shadow-lightgreen">
        <header>
          <h1 className="text-center font-serif text-lightgreen text-sm sm:text-base lg:text-lg">
            Best place to chat with strangers
          </h1>
        </header>
        <main>
          <div>
            <Image
              className="w-auto mx-auto"
              src="/logo.png"
              width={200}
              height={200}
              alt="❤️"
              priority
            />
          </div>
          <div className="flex justify-center items-center gap-4">
            <label
              htmlFor="name"
              className="text-base font-serif font-semibold text-darkgreen"
            >
              Name:
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="px-4 w-[12rem] sm:w-[14rem] py-2 text-base rounded-lg focus:outline-none font-mono bg-transparent border border-darkgreen text-white"
            />
          </div>
          <div className="text-center pt-6">
            <button
              className="border-2 text-lightgreen border-lightgreen font-semibold p-2 font-serif rounded-lg hover:bg-[#236167] hover:text-white w-full"
              onClick={submitNameHandler}
            >
              Start Chat
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
