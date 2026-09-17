import React from "react";
import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import HeaderNav from "./header-nav";

export default async function Header() {
  await checkUser();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080C14]/80 border-b border-white/10 shadow-2xl shadow-black/50 transition-all">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Client Navigation with Active Page Indicators */}
        <HeaderNav />
      </nav>
    </header>
  );
}
