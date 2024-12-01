"use client";
import React from "react";
import { useAppContext } from "@/context";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";

export default function ConnectingScreen() {
  const { name } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-2">
      <div className="flex justify-center items-center">
        <Image
          className="w-[120px] sm:w-[150px] md:w-[200px] lg:w-[250px] mx-auto animate-pulse transform"
          src="/logo.png"
          width={250}
          height={250}
          alt="❤️"
          priority
        />
      </div>
      <h1 className="text-2xl font-extrabold mb-4 text-center animate-fade-in">
        Welcome <span className="text-darkgreen">{name}</span>
      </h1>
      <p className="text-base sm:text-xl mb-8 text-center animate-fade-in delay-200">
        You are in the waiting area...
      </p>

      {/* Animated Dots with Different Speeds */}
      <div className="flex items-center space-x-2 mb-6">
        <FaCircle
          className="text-blue-500 animate-bounce"
          style={{
            fontSize: "1.5rem",
            animationDuration: "0.8s",
            animationDelay: "0.2s",
          }}
        />

        <FaCircle
          className="text-green-500 animate-bounce"
          style={{
            fontSize: "1.5rem",
            animationDuration: "1s",
            animationDelay: "0.2s",
          }}
        />

        <FaCircle
          className="text-yellow-500 animate-bounce"
          style={{
            fontSize: "1.5rem",
            animationDuration: "1.2s",
            animationDelay: "0.2s",
          }}
        />
      </div>

      <p className="text-gray-400 text-center text-sm sm:text-base animate-fade-in delay-400">
        Waiting for someone to connect...
      </p>
    </div>
  );
}
