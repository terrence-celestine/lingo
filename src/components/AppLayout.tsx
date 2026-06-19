import { type ReactNode } from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import { AnimatePresence } from "framer-motion";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNav />
      <AnimatePresence mode="wait">
        <main className="pb-24 md:pb-0">{children}</main>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
