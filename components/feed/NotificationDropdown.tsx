"use client";

import { useState } from "react";

export default function NotificationDropdown({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          <h4 className="font-semibold mb-3">Notifications</h4>

          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <img src="/avatar.png" className="w-8 h-8 rounded-full" />
              <p>
                <span className="font-medium">Steve Jobs</span> posted a link
              </p>
            </div>

            <div className="text-gray-500 text-xs">42 minutes ago</div>
          </div>
        </div>
      )}
    </div>
  );
}