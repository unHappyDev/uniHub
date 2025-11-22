import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/home/Header";
import { About } from "@/components/home/About";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Cards } from "@/components/home/Cards.";


export default function Home(){
  return(
    <div>
      <Header />
      <Hero />
      <About />
      <Cards />
      <ScrollToTopButton />
    </div>
    
  )
}