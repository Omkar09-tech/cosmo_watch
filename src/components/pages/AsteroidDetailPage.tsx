import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Gauge, Ruler, Target, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { BaseCrudService, useMember } from '@/integrations';
import { Asteroids, Watchlist } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function AsteroidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, member } = useMember();
  const [asteroid, setAsteroid] = useState<Asteroids | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadAsteroid = async () => {
      if (!id) return;
      
      try {
        const data = await BaseCrudService.getById<Asteroids>('asteroids', id);
        setAsteroid(data);

        // Check if asteroid is in watchlist
        if (isAuthenticated && member) {
          const watchlistItems = await BaseCrudService.getAll<Watchlist>('watchlist');
          const isInWatchlist = watchlistItems.items.some(
            w => w.asteroidId === id && w.userId === (member.loginEmail || member._id)
          );
          setIsWatched(isInWatchlist);
        }
      } catch (error) {
        console.error('Failed to load asteroid:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsteroid();
  }, [id, isAuthenticated, member]);

  const handleWatchToggle = async () => {
    if (!isAuthenticated || !member || !asteroid) return;

    setIsUpdating(true);
    const newWatchedState = !isWatched;
    setIsWatched(newWatchedState);

    try {
      if (newWatchedState) {
        await BaseCrudService.create<Watchlist>('watchlist', {
          _id: crypto.randomUUID(),
          userId: member.loginEmail || member._id,
          asteroidId: asteroid._id,
          asteroidName: asteroid.name,
          addedDate: new Date().toISOString(),
          riskLevel: asteroid.riskLevel,
        });
      } else {
        const watchlistItems = await BaseCrudService.getAll<Watchlist>('watchlist');
        const itemToRemove = watchlistItems.items.find(
          w => w.asteroidId === asteroid._id && w.userId === (member.loginEmail || member._id)
        );
        if (itemToRemove) {
          await BaseCrudService.delete('watchlist', itemToRemove._id);
        }
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      setIsWatched(!newWatchedState);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRiskStyles = (risk?: string) => {
    switch (risk) {
      case 'High':
        return { bg: 'bg-destructive/20', border: 'border-destructive/40', text: 'text-destructive', glow: 'shadow-[0_0_40px_rgba(255,65,54,0.3)]' };
      case 'Medium':
        return { bg: 'bg-secondary/20', border: 'border-secondary/40', text: 'text-secondary', glow: 'shadow-[0_0_40px_rgba(255,0,255,0.3)]' };
      case 'Low':
        return { bg: 'bg-accent-teal/20', border: 'border-accent-teal/40', text: 'text-accent-teal', glow: 'shadow-[0_0_40px_rgba(0,255,204,0.3)]' };
      default:
        return { bg: 'bg-muted-gray/20', border: 'border-muted-gray/40', text: 'text-muted-gray', glow: '' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <StarfieldBackground />
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!asteroid) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <StarfieldBackground />
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[600px] px-6">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Asteroid Not Found</h2>
          <p className="font-paragraph text-foreground/70 mb-8">The requested asteroid could not be located in our database.</p>
          <Link to="/dashboard">
            <button className="px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]">
              Return to Dashboard
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const riskStyles = getRiskStyles(asteroid.riskLevel);
  const formattedDate = asteroid.closeApproachDate 
    ? format(new Date(asteroid.closeApproachDate), 'MMMM dd, yyyy')
    : 'Unknown';

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <StarfieldBackground />
      
      <Header />

      <main className="relative pt-24 pb-16">
        <div className="w-full max-w-[100rem] mx-auto px-6">
          {/* Back Button */}
          <Link to="/dashboard">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-heading font-semibold">Back to Dashboard</span>
            </motion.button>
          </Link>

          {/* Header Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-2">
                      {asteroid.name || 'Unknown Asteroid'}
                    </h1>
                    {asteroid.designation && (
                      <p className="font-paragraph text-xl text-foreground/60">
                        Designation: {asteroid.designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className={`px-6 py-3 ${riskStyles.bg} ${riskStyles.border} border rounded-xl flex items-center gap-3 ${riskStyles.glow}`}>
                    <AlertTriangle className={`w-6 h-6 ${riskStyles.text}`} />
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60">Risk Level</p>
                      <p className={`font-heading text-lg font-bold ${riskStyles.text}`}>
                        {asteroid.riskLevel || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {asteroid.isPotentiallyHazardous && (
                    <div className="px-6 py-3 bg-destructive/20 border border-destructive/40 rounded-xl flex items-center gap-3">
                      <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                      <span className="font-heading text-sm font-semibold text-destructive">
                        Potentially Hazardous Object
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Watch Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start justify-end"
            >
              {isAuthenticated ? (
                <button
                  onClick={handleWatchToggle}
                  disabled={isUpdating}
                  className={`px-8 py-4 font-heading font-semibold rounded-xl transition-all duration-300 ${
                    isWatched
                      ? 'bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                      : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {isWatched ? (
                    <>
                      <Eye className="w-5 h-5 inline mr-2" />
                      Watching
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-5 h-5 inline mr-2" />
                      Add to Watchlist
                    </>
                  )}
                </button>
              ) : (
                <div className="text-right">
                  <p className="font-paragraph text-sm text-foreground/60 mb-2">Sign in to track this asteroid</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Data Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-foreground/60">Close Approach Date</p>
                  <p className="font-heading text-xl font-bold text-foreground">{formattedDate}</p>
                </div>
              </div>
              {asteroid.closeApproachTime && (
                <p className="font-paragraph text-sm text-foreground/70">
                  Time: {asteroid.closeApproachTime}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-foreground/60">Relative Velocity</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {asteroid.relativeVelocity 
                      ? `${asteroid.relativeVelocity.toLocaleString()} km/h`
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-foreground/60">Miss Distance</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {asteroid.missDistance 
                      ? `${asteroid.missDistance.toLocaleString()} km`
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-foreground/60">Estimated Diameter</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {asteroid.estimatedDiameterMin && asteroid.estimatedDiameterMax
                      ? `${asteroid.estimatedDiameterMin.toFixed(0)} - ${asteroid.estimatedDiameterMax.toFixed(0)} m`
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-foreground/60">Absolute Magnitude</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {asteroid.absoluteMagnitude !== undefined
                      ? asteroid.absoluteMagnitude.toFixed(2)
                      : 'Unknown'}
                  </p>
                </div>
              </div>
              <p className="font-paragraph text-xs text-foreground/60">
                Measure of intrinsic brightness
              </p>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="p-8 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">About This Asteroid</h2>
            <div className="space-y-4 font-paragraph text-foreground/80">
              <p>
                This near-Earth object has been classified with a <span className={`font-semibold ${riskStyles.text}`}>{asteroid.riskLevel || 'Unknown'}</span> risk level 
                based on its trajectory, size, and proximity to Earth.
              </p>
              {asteroid.isPotentiallyHazardous && (
                <p className="text-destructive">
                  ⚠️ This asteroid is classified as a Potentially Hazardous Asteroid (PHA) due to its size and close approach distance to Earth.
                </p>
              )}
              <p>
                The asteroid will make its closest approach to Earth on <span className="font-semibold text-primary">{formattedDate}</span>, 
                passing at a distance of approximately <span className="font-semibold text-primary">{asteroid.missDistance?.toLocaleString() || 'Unknown'} kilometers</span>.
              </p>
              <p className="text-sm text-foreground/60 pt-4 border-t border-primary/10">
                Data provided by NASA's Near Earth Object Web Service (NeoWs). All measurements are estimates based on observational data.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
