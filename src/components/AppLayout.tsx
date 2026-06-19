import { type ReactNode } from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNav />
      <main className="pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
