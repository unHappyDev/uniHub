import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniHub",
  description: "Sistema de gerenciamento acadêmico",};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-roboto",     
  display: "swap",               
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className}, ${roboto.className} bg-[#0a0a0a]`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
