
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FibonacciVisualizer } from "@/components/FibonacciVisualizer";
import { MusicAnalysis } from "@/components/MusicAnalysis";
import { EducationalSection } from "@/components/EducationalSection";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after initial render
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark text-foreground">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-24 mx-auto">
          <div className={`max-w-4xl mx-auto text-center animate-stagger ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-wider">
              TOOL <span className="text-golden">×</span> FIBONACCI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Exploring the mathematical patterns and golden ratios in the music of Tool
            </p>
            <div className="fibonacci-divider" />
          </div>
        </section>

        {/* Fibonacci Visualizer Section */}
        <section id="visualizer" className="glass-panel container mx-auto px-4 py-16 my-12">
          <h2 className="section-title text-center">Fibonacci Visualizer</h2>
          <p className="section-subtitle text-center mb-12">Interactive visualization of the Fibonacci sequence and golden ratio</p>
          <FibonacciVisualizer />
        </section>

        {/* Music Analysis Section */}
        <section id="analysis" className="container mx-auto px-4 py-16 my-12">
          <h2 className="section-title text-center">Music Analysis</h2>
          <p className="section-subtitle text-center mb-12">Explore how Tool incorporates mathematical patterns in their compositions</p>
          <MusicAnalysis />
        </section>

        {/* Educational Section */}
        <section id="learn" className="glass-panel container mx-auto px-4 py-16 my-12">
          <h2 className="section-title text-center">Mathematical Foundations</h2>
          <p className="section-subtitle text-center mb-12">Understanding Fibonacci sequences and the golden ratio in music</p>
          <EducationalSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
