"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function Page() {
  const { name, setName } = useAppContext();
  const [inputName, setInputName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!name) {
      document.cookie =
        "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, [name]);

  const submitNameHandler = async() => {
     if (!inputName.trim()) {
      alert('Please enter a name');
      return;
    }
    try {
       // Send POST request to your API route
       const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputName })
      });

      // Parse the response
      const result = await response.json();

      if(result.success){

        setName(inputName);
        document.cookie = `username=${inputName}; path=/;`; //should i use useEffect here
        router.replace("/chat");
      }else{
        alert(result.message || 'Failed to submit name');
      }

    } catch (error) {
      console.error('Error submitting name:', error);
      alert('Failed to submit name. Please try again.');
    }
    
   
  };
  return (
    <div>
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
                width={150}
                height={150}
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
                onChange={(e) => setInputName(e.target.value)}
                value={inputName}
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
      <Footer />
    </div>
  );
}
