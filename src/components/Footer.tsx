import React from 'react';
import { Heart, Github, Twitter, Youtube, Mail, Music, Sigma } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 mt-20 border-t border-silver/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-golden/20 rounded-full animate-pulse-soft"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sigma className="w-5 h-5 text-golden transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              <span className="text-lg font-heading font-light tracking-wider text-white">
                Tool <span className="text-golden">Fibonacci</span>
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Exploring the mathematical patterns in Tool's music, focusing on Fibonacci sequences 
              and golden ratio proportions. An educational resource for music enthusiasts and math lovers.
            </p>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <a 
                href="#" 
                className="hover:text-golden transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-golden transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-golden transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-golden transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#music" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300 flex items-center"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Music Analysis
                </a>
              </li>
              <li>
                <a 
                  href="#fibonacci" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300 flex items-center"
                >
                  <Sigma className="w-4 h-4 mr-2" />
                  Fibonacci Patterns
                </a>
              </li>
              <li>
                <a 
                  href="#education" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300 flex items-center"
                >
                  <Sigma className="w-4 h-4 mr-2" />
                  Educational Resources
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300 flex items-center"
                >
                  <Sigma className="w-4 h-4 mr-2" />
                  About Project
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300"
                >
                  Tool Official Website
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300"
                >
                  Fibonacci Foundation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300"
                >
                  Music Theory Archives
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-golden transition-colors duration-300"
                >
                  Mathematical Music Project
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="fibonacci-divider my-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tool Fibonacci Project. Developed by Daniel González Amat. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span>Created with</span>
            <Heart className="w-4 h-4 mx-1 text-golden" />
            <span>for math and music enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
