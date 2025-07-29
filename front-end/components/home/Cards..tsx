"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpenText, CodeXml, University } from "lucide-react";
import { motion } from "framer-motion";

export function Cards() {
  return (
    <section className="container mx-auto px-4 py-12  text-white">
      <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl font-poppins font-extrabold uppercase text-center mb-25"
        >
          SERVIÇOS
        </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col justify-between bg-zinc-900 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform duration-300 p-6 border-orange-500 cursor-pointer">
            <div>
              <CardHeader>
                <CardDescription><BookOpenText className="text-orange-500 w-10 h-10"/></CardDescription>
                <CardTitle className="text-2xl font-semibold">Gestão Acadêmica Completa</CardTitle>
              </CardHeader>
              <CardFooter className="mt-4 text-sm leading-relaxed text-zinc-300">
                Soluções integradas para administrar matrículas, notas, faltas e horários, proporcionando uma gestão eficiente e simplificada.
              </CardFooter>
            </div>
          </Card>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col justify-between bg-zinc-900 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform duration-300 p-6 border-orange-500 cursor-pointer">
            <div>
              <CardHeader>
                <CardDescription><University className="text-orange-500 w-10 h-10"/></CardDescription>
                <CardTitle className="text-2xl font-semibold">Comunicação Institucional</CardTitle>
              </CardHeader>
              <CardFooter className="mt-4 text-sm leading-relaxed text-zinc-300">
                Ferramentas para facilitar a comunicação entre alunos, professores e administradores, promovendo um ambiente educacional mais colaborativo.
              </CardFooter>
            </div>
          </Card>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="h-full flex flex-col justify-between bg-zinc-900 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform duration-300 p-6 border-orange-500 cursor-pointer">
            <div>
              <CardHeader>
                <CardDescription><CodeXml className="text-orange-500 w-10 h-10"/></CardDescription>
                <CardTitle className="text-2xl font-semibold">Tecnologia e Frameworks utilizados</CardTitle>
              </CardHeader>
              <CardFooter className="mt-4 text-sm leading-relaxed text-zinc-300">
                Desenvolvimento customizado e moderno com JavaScript, HTML, CSS; interfaces otimizadas e de alta qualidade com os frameworks Tailwind CSS, React e Spring Boot; integração de dados e serviços para máxima eficiência com PostgreSQL.
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
