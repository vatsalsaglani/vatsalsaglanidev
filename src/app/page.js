import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Systems from "@/components/Systems";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Writing from "@/components/Writing";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Systems />
        <Work />
        <Experience />
        <Writing />
        <About />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
