"use client";

import Dashboard from "@/views/Dashboard";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <Dashboard onNavigate={(p: string) => router.push(p === "landing" ? "/" : `/${p}`)} />;
}