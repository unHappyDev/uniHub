"use client";

import { About } from "@/components/home/About";
import { Cards } from "@/components/home/Cards.";
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
      <Cards />
      <ScrollToTopButton />
    </div>
  );
}
