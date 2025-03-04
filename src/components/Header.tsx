
import React, { useState, useEffect } from 'react';
import { Menu, X, Music, Sigma, BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Music Analysis", icon: <Music className="w-4 h-4 mr-2" />, href: "#music" },
    { name: "Fibonacci", icon: <Sigma className="w-4 h-4 mr-2" />, href: "#fibonacci" },
    { name: "Education", icon: <BookOpen className="w-4 h-4 mr-2" />, href: "#education" },
    { name: "About", icon: <Info className="w-4 h-4 mr-2" />, href: "#about" }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-dark/90 backdrop-blur-md border-b border-silver/10" : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a 
          href="#" 
          className="flex items-center justify-center space-x-2 group"
        >
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-golden/20 rounded-full animate-pulse-soft"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sigma className="w-5 h-5 text-golden transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <span className="text-lg font-heading font-light tracking-wider text-white">
            Tool <span className="text-golden">Fibonacci</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center text-sm text-silver hover:text-golden transition-colors duration-300 link-underline py-1"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-dark-secondary border border-silver/10 text-silver hover:text-golden transition-colors duration-300"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 top-[72px] bg-dark/95 backdrop-blur-lg z-40 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-xl text-silver hover:text-golden transition-colors duration-300 py-2"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
