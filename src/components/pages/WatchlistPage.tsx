import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, AlertTriangle } from 'lucide-react';
import { BaseCrudService, useMember } from '@/integrations';
import { Watchlist, Asteroids } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import AsteroidCard from '@/components/AsteroidCard';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

function WatchlistPageContent() {
  const { member } = useMember();
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroids[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWatchlist = async () => {
    if (!member) return;

    try {
      const watchlistResult = await BaseCrudService.getAll<Watchlist>('watchlist');
      const userWatchlist = watchlistResult.items.filter(
        w => w.userId === (member.loginEmail || member._id)
      );
      setWatchlist(userWatchlist);

      // Load full asteroid data for watchlist items
      if (userWatchlist.length > 0) {
        const asteroidsResult = await BaseCrudService.getAll<Asteroids>('asteroids');
        const watchedAsteroids = asteroidsResult.items.filter(a =>
          userWatchlist.some(w => w.asteroidId === a._id)
        );
        setAsteroids(watchedAsteroids);
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, [member]);

  const handleRemoveFromWatchlist = async (asteroidId: string) => {
    if (!member) return;

    const itemToRemove = watchlist.find(w => w.asteroidId === asteroidId);
    if (!itemToRemove) return;

    // Optimistic update
    setWatchlist(prev => prev.filter(w => w.asteroidId !== asteroidId));
    setAsteroids(prev => prev.filter(a => a._id !== asteroidId));

    try {
      await BaseCrudService.delete('watchlist', itemToRemove._id);
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      loadWatchlist();
    }
  };

  const getRiskCount = (risk: string) => {
    return watchlist.filter(w => w.riskLevel === risk).length;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <StarfieldBackground />
      
      <Header />

      <main className="relative pt-24 pb-16">
        {/* Hero Section */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground">
                  My Watchlist
                </h1>
                <p className="font-paragraph text-lg text-foreground/70 mt-2">
                  Track your monitored asteroids
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Watching</p>
              <p className="font-heading text-3xl font-bold text-foreground">{watchlist.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-destructive/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">High Risk</p>
              <p className="font-heading text-3xl font-bold text-destructive">{getRiskCount('High')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-secondary/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Medium Risk</p>
              <p className="font-heading text-3xl font-bold text-secondary">{getRiskCount('Medium')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-accent-teal/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Low Risk</p>
              <p className="font-heading text-3xl font-bold text-accent-teal">{getRiskCount('Low')}</p>
            </motion.div>
          </div>
        </section>

        {/* Watchlist Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-8">
          <div className="min-h-[600px]">
            {isLoading ? null : asteroids.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {asteroids.map((asteroid, index) => (
                  <motion.div
                    key={asteroid._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="relative"
                  >
                    <AsteroidCard asteroid={asteroid} isAuthenticated={true} />
                    
                    <button
                      onClick={() => handleRemoveFromWatchlist(asteroid._id)}
                      className="absolute bottom-6 right-6 w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center hover:bg-destructive/30 hover:shadow-[0_0_20px_rgba(255,65,54,0.3)] transition-all duration-300 z-10"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <Eye className="w-16 h-16 text-muted-gray mb-4" />
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  No Asteroids in Watchlist
                </h3>
                <p className="font-paragraph text-foreground/70 mb-8 text-center max-w-md">
                  Start tracking asteroids by adding them to your watchlist from the dashboard
                </p>
                <a href="/dashboard">
                  <button className="px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]">
                    Explore Dashboard
                  </button>
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to access your watchlist">
      <WatchlistPageContent />
    </MemberProtectedRoute>
  );
}
