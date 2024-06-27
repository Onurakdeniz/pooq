import React from "react";
import { Header } from "./header";
import { LeftSide } from "./left-side";
import { RightSide } from "./right-side";

export default function LayoutWrapper({
  children,
 
}: {
  children: React.ReactNode;

}) {
  return (
    <div className="container mx-auto relative" style={{ zIndex: 1 }}> 
      <div className="relative min-h-screen flex justify-center">
        {/* Left Sidebar */}
        <aside className="sticky top-0 hidden h-screen shrink-0 sm:block lg:w-[300px] xl:w-[380px]" style={{ zIndex: 2 }}>
          <LeftSide   />
        </aside>

        {/* Center Feed */}
        <main className="h-full w-full shrink-0 justify-center sm:w-[500px] xl:w-[620px] relative" style={{ zIndex: 3 }}>
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="sticky top-0 hidden h-screen border-l flex-shrink-0 flex-grow flex-col sm:flex sm:max-w-[360px]" style={{ zIndex: 2 }}>
          <RightSide />
        </aside>
      </div>
    </div>
  );
}