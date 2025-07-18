"use client";

import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="py-8">
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">
            Example of Authentication Web App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advance your career with our comprehensive authentication pattern
          </p>
        </section>
      </main>
    </div>
  );
}
