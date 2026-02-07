import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Satellite } from 'lucide-react';
import { useMember } from '@/integrations';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, member, actions } = useMember();
  const location = useLocation();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/alerts', label: 'Alerts' },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: '/watchlist', label: 'Watchlist' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20">
      <nav className="max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-foreground">Cosmic Watch</span>
              <span className="font-paragraph text-xs text-primary">Orbital Command</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-heading font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoading ? (
              <div className="w-24 h-10 bg-muted-gray/20 rounded animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className={`font-heading font-semibold transition-all duration-300 ${
                    isActive('/profile')
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-primary'
                  }`}
                >
                  {member?.profile?.nickname || 'Profile'}
                </Link>
                <button
                  onClick={actions.logout}
                  className="px-5 py-2 bg-transparent border-2 border-secondary text-secondary font-heading font-semibold rounded transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={actions.login}
                className="px-5 py-2 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block font-heading font-semibold transition-all duration-300 ${
                      isActive(link.href)
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isLoading ? (
                  <div className="w-full h-10 bg-muted-gray/20 rounded animate-pulse" />
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block font-heading font-semibold transition-all duration-300 ${
                        isActive('/profile')
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {member?.profile?.nickname || 'Profile'}
                    </Link>
                    <button
                      onClick={() => {
                        actions.logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-2 bg-transparent border-2 border-secondary text-secondary font-heading font-semibold rounded transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      actions.login();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-5 py-2 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
