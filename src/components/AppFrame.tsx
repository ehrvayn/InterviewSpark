"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./SideBar";
import LogoutModal from "./modal/LogoutModal";
import PaymentModal from "./modal/PaymentModal";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";

  return (
    <div className="w-full min-h-screen bg-[#080c12] text-[#e8edf5] font-sans">
      {!isLanding && (
        <>
          <Sidebar
            currentPage={pathname as any}
            onNavigate={(p: string) =>
              router.push(p === "landing" ? "/" : `/${p}`)
            }
          />
          <LogoutModal />
          <PaymentModal />
        </>
      )}
      <main className={`flex-1 flex flex-col min-h-screen ${!isLanding ? "lg:ml-80" : "w-full"}`}>
        {children}
      </main>
    </div>
  );
}