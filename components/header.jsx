import React from "react";
import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import HeaderNav from "./header-nav";

export default async function Header() {
  await checkUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-[#0b1220]/95 shadow-[0_8px_24px_rgba(2,6,23,0.24)] backdrop-blur-md transition-colors">
      <nav className="container mx-auto flex h-[68px] items-center justify-between px-5 lg:px-6">
        {/* Logo */}
        <Link href="/" className="ml-2 flex items-center gap-2 rounded-md transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Client Navigation with Active Page Indicators */}
        <HeaderNav />
      </nav>
    </header>
  );
}
