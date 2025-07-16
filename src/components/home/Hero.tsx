"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export function Hero() {
  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-3 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white w-full lg:w-1/2"
        >
          <div className={`flex flex-col gap-10 ${poppins.variable}`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-tight font-poppins">
              Sua jornada acadêmica transformada
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              Nosso sistema acadêmico completo conecta alunos, professores e
              administradores em uma plataforma integrada e moderna. Se você já
              é nosso parceiro, aproveite ao máximo todas as funcionalidades. Se
              ainda não é, entre em contato e descubra como podemos transformar
              a gestão e o aprendizado na sua instituição.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="py-4 px-6 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-md transition duration-300 ease-in-out">
                Acessar Portal
              </Button>
              <Button
                variant="outline"
                className="py-4 px-6 border-white cursor-pointer text-white hover:bg-white hover:text-black font-bold text-sm rounded-md transition duration-300 ease-in-out"
              >
                Entrar em contato
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative w-full lg:w-1/2"
        >
          <motion.div
            className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-xl -z-10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.img
            src="/imagens/hero_banner.jpg"
            alt="Dashboard acadêmico"
            className="w-full h-auto rounded-xl shadow-2xl relative z-10"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
