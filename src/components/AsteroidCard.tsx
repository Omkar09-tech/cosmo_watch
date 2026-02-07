import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Calendar, Gauge, AlertTriangle } from 'lucide-react';
import { Asteroids } from '@/entities';
import { BaseCrudService, useMember } from '@/integrations';
import { Watchlist } from '@/entities';
import { format } from 'date-fns';

interface AsteroidCardProps {
  asteroid: Asteroids;
  isAuthenticated: boolean;
}

export default function AsteroidCard({ asteroid, isAuthenticated }: AsteroidCardProps) {
  const { member } = useMember();
  const [isWatched, setIsWatched] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'accent-teal';
      default:
        return 'muted-gray';
    }
  };

  const getRiskStyles = (risk?: string) => {
    switch (risk) {
      case 'High':
        return { bg: 'bg-destructive/20', border: 'border-destructive/40', text: 'text-destructive' };
      case 'Medium':
        return { bg: 'bg-secondary/20', border: 'border-secondary/40', text: 'text-secondary' };
      case 'Low':
        return { bg: 'bg-accent-teal/20', border: 'border-accent-teal/40', text: 'text-accent-teal' };
      default:
        return { bg: 'bg-muted-gray/20', border: 'border-muted-gray/40', text: 'text-muted-gray' };
    }
  };

  const handleWatchToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !member) return;

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

  const riskStyles = getRiskStyles(asteroid.riskLevel);
  const formattedDate = asteroid.closeApproachDate 
    ? format(new Date(asteroid.closeApproachDate), 'MMM dd, yyyy')
    : 'Unknown';

  return (
    <Link to={`/asteroid/${asteroid._id}`}>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="h-full p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group relative"
      >
        {/* Risk Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 ${riskStyles.bg} ${riskStyles.border} border rounded-full flex items-center gap-2`}>
            <AlertTriangle className={`w-4 h-4 ${riskStyles.text}`} />
            <span className={`font-heading text-xs font-semibold ${riskStyles.text}`}>
              {asteroid.riskLevel || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Watch Button */}
        {isAuthenticated && (
          <button
            onClick={handleWatchToggle}
            disabled={isUpdating}
            className="absolute top-4 left-4 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 z-10"
          >
            {isWatched ? (
              <Eye className="w-5 h-5 text-primary" />
            ) : (
              <EyeOff className="w-5 h-5 text-primary/60" />
            )}
          </button>
        )}

        <div className="mt-12 space-y-4">
          {/* Name */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {asteroid.name || 'Unknown Asteroid'}
            </h3>
            {asteroid.designation && (
              <p className="font-paragraph text-sm text-foreground/60 mt-1">
                {asteroid.designation}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="font-paragraph text-xs text-foreground/60">Close Approach</p>
                <p className="font-paragraph text-sm text-foreground font-semibold">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Gauge className="w-4 h-4 text-primary" />
              <div>
                <p className="font-paragraph text-xs text-foreground/60">Velocity</p>
                <p className="font-paragraph text-sm text-foreground font-semibold">
                  {asteroid.relativeVelocity 
                    ? `${asteroid.relativeVelocity.toLocaleString()} km/h`
                    : 'Unknown'}
                </p>
              </div>
            </div>

            {asteroid.estimatedDiameterMin && asteroid.estimatedDiameterMax && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-paragraph text-xs text-foreground/60">Diameter</p>
                  <p className="font-paragraph text-sm text-foreground font-semibold">
                    {asteroid.estimatedDiameterMin.toFixed(0)} - {asteroid.estimatedDiameterMax.toFixed(0)} m
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hazardous Badge */}
          {asteroid.isPotentiallyHazardous && (
            <div className="pt-3 border-t border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="font-paragraph text-xs text-destructive font-semibold">
                  Potentially Hazardous
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
