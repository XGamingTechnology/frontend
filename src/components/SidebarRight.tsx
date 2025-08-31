// src/components/SidebarRight.tsx
"use client";

import SidebarRightControl from "@/components/panels/SidebarRightControl";

export default function SidebarRight() {
  return (
    <div className="absolute top-0 right-0 w-96 h-full z-40">
      <SidebarRightControl />
    </div>
  );
}
