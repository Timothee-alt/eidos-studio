import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Services } from "@/components/services";
import { Processus } from "@/components/processus";
import { Projects } from "@/components/projets";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <Services />
      <Processus />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
