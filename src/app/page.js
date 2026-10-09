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
import JsonLd from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/seo";

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
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
