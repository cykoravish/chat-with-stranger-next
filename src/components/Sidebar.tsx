import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { User } from "@/app/chat/page";
import { GoDotFill } from "react-icons/go";

export default function Sidebar({ data }: { data: User[] }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 shadow-md transition-all duration-300 backdrop-blur-md ${
        isMobileMenuOpen ? "bg-black" : "bg-opacity-30"
      }`}
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8"
        ref={menuRef}
      >
        {/* Logo */}
        <div>
          <div className="sm:h-16 sm:w-12">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              className="h-full w-full"
              alt="logo"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md"
          aria-label="Toggle menu"
        >
          {!isMobileMenuOpen ? (
            <RxHamburgerMenu size={25} className="text-darkgreen" />
          ) : (
            <RxCross2 size={25} className="text-darkgreen" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden transform transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="flex flex-col space-y-6 px-6 py-4 bg- shadow-lg rounded-lg">
          {/* Online and Waiting Users */}
          <div className="text-center space-y-2">
            <div className="text-sm font-semibold text-blue-400">
              User Statistics
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-green-400">
                Online Users:
              </span>
              <span className="font-medium text-green-400">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-yellow-400">
                Waiting Users:
              </span>
              <span className="font-medium text-yellow-400">
                {data.length % 2 === 0 ? 0 : 1}
              </span>
            </div>
          </div>

          {/* Connected Users */}
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-2">
              Connected Users (Online):
            </h3>
            <ul className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {data.map((e, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="block w-3 h-3 bg-green-400 rounded-full"></span>
                  <span className="text-sm font-semibold text-gray-100">
                    {e.username}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Talking Users */}
          <div>
            <ul className="space-y-1 flex">
              {data.length % 2 === 0 ? (
                <li className="text-sm font-semibold text-red-400">
                  No one is in waiting area.
                </li>
              ) : (
                <li className="text-sm font-semibold text-green-500 flex items-center">
                  Someone is in waiting area
                  <span className="ml-2 flex space-x-1">
                    <GoDotFill
                      className="inline text-green-500 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <GoDotFill
                      className="inline text-green-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <GoDotFill
                      className="inline text-green-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </span>
                </li>
              )}
            </ul>
          </div>
        </ul>
      </nav>
    </header>
  );
}
