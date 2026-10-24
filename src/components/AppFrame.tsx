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
    <div className="w-full min-h-screen bg-black text-white font-sans">
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
      <main className={`flex-1 px-20flex flex-col min-h-screen mx-auto w-full`}>
        {children}
      </main>
    </div>
  );
}


