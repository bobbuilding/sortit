"use client";
import { usePathname } from "next/navigation";
import { SideNavBar } from "@/components/ui/SideNavBar";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { AIDrawer } from "@/components/ui/AIDrawer";
import { AllocationModal } from "@/components/ui/AllocationModal";

const EXCLUDED = ["/", "/login", "/onboarding"];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (EXCLUDED.includes(pathname)) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <TopAppBar />
      <AIDrawer />
      <div className="flex flex-1 pt-[52px]">
        <SideNavBar />
        <main className="flex-1 ml-16 overflow-y-auto h-[calc(100vh-52px)]">
          {children}
        </main>
      </div>
      <AllocationModal />
    </div>
  );
}
