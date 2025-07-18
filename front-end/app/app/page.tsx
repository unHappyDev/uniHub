import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/home/Header";
import { About } from "@/components/home/About";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";


export default function Home(){
  return(
    <div>
      <Header />
      <Hero />
      <About />
      <ScrollToTopButton />
    </div>
    
  )
}