"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./SideBar";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";

  return (
    <div className="w-full min-h-screen bg-[#080c12] text-[#e8edf5] font-sans">
      {!isLanding && (
        <Sidebar currentPage={pathname as any} onNavigate={(p: string) => router.push(p === "landing" ? "/" : `/${p}`)} />
      )}
      <main className={`flex-1 flex flex-col min-h-screen ${!isLanding ? "lg:ml-72" : "w-full"}`}>
        {children}
      </main>
    </div>
  );
}