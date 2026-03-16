import { Hero } from "@/components/hero";
import { Reel } from "@/components/reel";
import { Services } from "@/components/services";
import { Projects } from "@/components/projets";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Reel />
      <Services />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
