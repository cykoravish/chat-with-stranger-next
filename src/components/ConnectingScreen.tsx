"use client";
import React from "react";
import { useAppContext } from "@/context";

export default function ConnectingScreen() {
  const { name } = useAppContext();
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
        <p className="text-xl mb-6">You are in the waiting area...</p>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-400"></div>
        </div>
        <p className="text-gray-400 mt-4">Waiting for someone to connect...</p>
      </div>
    </div>
  );
}
