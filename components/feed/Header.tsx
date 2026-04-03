"use client";

import { Bell, Home, Users } from "lucide-react";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white h-[70px] shadow-sm z-50 flex items-center">
      
      <div className="max-w-[1300px] mx-auto w-full flex items-center justify-between px-4">

        {/* LOGO */}
        <div className="font-bold text-blue-500 text-lg">
          Buddy<span className="text-gray-800">Script</span>
        </div>

        {/* SEARCH */}
        <div className="w-[400px] hidden md:block">
          <input
            className="w-full bg-[#F5F5F5] rounded-full px-5 py-2 text-sm outline-none"
            placeholder="input search text"
          />
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6">
          <Home className="text-gray-600" />
          <Users className="text-gray-600" />
          
          <div className="relative">
            <Bell className="text-gray-600" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              6
            </span>
          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-2">
            <img src="/avatar.png" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-medium">Dylan Field</span>
          </div>
        </div>

      </div>
    </div>
  );
}