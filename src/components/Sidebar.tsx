"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
// import LogoutButton from "./Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-lg font-bold">
                𝖎❤️𝕯𝖊𝖊𝖕𝖚
              </Link>
            </div>
            <div className="hidden md:flex md:ml-4">
              <Link
                href="/"
                className="text-white hover:bg-pink-600 hover:text-white rounded-lg p-2 transition duration-200"
              >
                Notes
              </Link>
              <Link
                href="/"
                className="text-white hover:bg-pink-600 hover:text-white rounded-lg p-2 transition duration-200"
              >
                Chats
              </Link>
              <Link
                href="/"
                className="text-white hover:bg-pink-600 hover:text-white rounded-lg p-2 transition duration-200"
              >
                Add
              </Link>
              <Link
                href="/"
                className="text-white hover:bg-pink-600 hover:text-white rounded-lg p-2 transition duration-200"
              >
                Logout
              </Link>
            </div>
            <div className="md:hidden">
              <button
                className="flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleNavbar}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <HiMenuAlt3 size={25} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-x-0 top-0 bg-pink-500 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          } z-50`}
        >
          <div className="flex flex-col h-full px-4 pt-5 pb-3 space-y-1 text-center">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-white text-lg font-bold">
                𝖎❤️𝕯𝖊𝖊𝖕𝖚
              </Link>
              <button
                className="text-white"
                onClick={toggleNavbar}
                aria-label="Close menu"
              >
                <IoClose size={25} />
              </button>
            </div>
            <Link
              href="/show-notes"
              className="text-white font-mono font-bold block hover:bg-pink-700 rounded-lg p-2 transition duration-200 text-lg"
              onClick={toggleNavbar}
            >
              Notes
            </Link>
            <Link
              href="/chats"
              className="text-white font-mono font-bold block hover:bg-pink-700 rounded-lg p-2 transition duration-200 text-lg"
              onClick={toggleNavbar}
            >
              Chats
            </Link>
            <Link
              href="/add-notes"
              className="text-white font-mono font-bold block hover:bg-pink-700 rounded-lg p-2 transition duration-200 text-lg"
              onClick={toggleNavbar}
            >
              Add
            </Link>
            <Link
              href="/"
              className="text-white font-mono font-bold bg-red-600 hover:bg-red-700 rounded-full p-2 transition duration-200 text-lg w-full"
              onClick={toggleNavbar}
            >
              <div
        // onClick={handleLogout}
        className="text-[16px] cursor-pointer"
      >
        Logout
      </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
          onClick={toggleNavbar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;