import { Link } from 'react-router-dom';
import { Satellite, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-primary/20">
      <div className="max-w-[100rem] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold text-foreground">Cosmic Watch</span>
                <span className="font-paragraph text-xs text-primary">Orbital Command</span>
              </div>
            </div>
            <p className="font-paragraph text-sm text-foreground/70">
              Advanced asteroid tracking and risk analysis powered by NASA NeoWs API. 
              Protecting Earth through data-driven planetary defense.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                  Alerts
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://api.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  NASA NeoWs API
                </a>
              </li>
              <li>
                <a 
                  href="https://cneos.jpl.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  CNEOS Database
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nasa.gov/planetarydefense" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  Planetary Defense
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300"
              >
                <Github className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a
                href="mailto:contact@cosmicwatch.space"
                className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-primary" />
              </a>
            </div>
            <p className="font-paragraph text-xs text-foreground/70 mt-4">
              Data provided by NASA's Near Earth Object Web Service
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-foreground/60">
              © {currentYear} Cosmic Watch. Built for planetary defense. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-paragraph text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="font-paragraph text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
