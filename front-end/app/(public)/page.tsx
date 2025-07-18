"use client";

import { About } from "@/components/home/About";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <ScrollToTopButton />
    </div>
  );
}
