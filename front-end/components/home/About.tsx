"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section className="w-full py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl font-poppins font-extrabold uppercase text-center mb-25"
        >
          QUEM SOMOS
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-[55%]"
          >
            <motion.div
              className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-2xl -z-10"
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/imagens/about.jpg"
              alt="Dashboard acadêmico"
              className="w-full h-auto rounded-2xl shadow-2xl relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-[45%] max-w-3xl"
          >
            <p className="text-lg text-gray-300 leading-relaxed font-roboto">
              Somos uma instituição inovadora dedicada a transformar a educação por meio da tecnologia.
              Com um sistema acadêmico completo e integrado, conectamos alunos, professores e administradores
              em uma plataforma moderna, eficiente e fácil de usar.
              <br /><br />
              Nosso objetivo é elevar a gestão educacional, proporcionar uma experiência de aprendizado de
              qualidade e fortalecer a comunicação entre todas as partes envolvidas.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
