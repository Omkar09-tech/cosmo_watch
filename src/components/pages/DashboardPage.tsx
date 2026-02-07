import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Asteroids } from '@/entities';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import AsteroidCard from '@/components/AsteroidCard';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
  const { isAuthenticated } = useMember();
  const [asteroids, setAsteroids] = useState<Asteroids[]>([]);
  const [filteredAsteroids, setFilteredAsteroids] = useState<Asteroids[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const loadAsteroids = async (skipValue: number = 0) => {
    try {
      const result = await BaseCrudService.getAll<Asteroids>('asteroids', {}, { limit: 50, skip: skipValue });
      
      if (skipValue === 0) {
        setAsteroids(result.items);
      } else {
        setAsteroids(prev => [...prev, ...result.items]);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);

      // Calculate stats
      const high = result.items.filter(a => a.riskLevel === 'High').length;
      const medium = result.items.filter(a => a.riskLevel === 'Medium').length;
      const low = result.items.filter(a => a.riskLevel === 'Low').length;
      
      setStats({
        total: result.totalCount,
        high,
        medium,
        low,
      });
    } catch (error) {
      console.error('Failed to load asteroids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAsteroids();
  }, []);

  useEffect(() => {
    let filtered = asteroids;

    // Filter by risk level
    if (selectedRisk !== 'all') {
      filtered = filtered.filter(a => a.riskLevel === selectedRisk);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.designation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAsteroids(filtered);
  }, [asteroids, selectedRisk, searchQuery]);

  const riskFilters = [
    { value: 'all', label: 'All Asteroids', color: 'primary' },
    { value: 'High', label: 'High Risk', color: 'destructive' },
    { value: 'Medium', label: 'Medium Risk', color: 'secondary' },
    { value: 'Low', label: 'Low Risk', color: 'accent-teal' },
  ];

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
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-4">
              Mission Dashboard
            </h1>
            <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
              Real-time monitoring of near-Earth objects. Track asteroids, analyze threats, and stay informed.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-paragraph text-sm text-foreground/70">Total Tracked</span>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-destructive/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-paragraph text-sm text-foreground/70">High Risk</span>
              </div>
              <p className="font-heading text-3xl font-bold text-destructive">{stats.high}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-secondary/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-secondary" />
                <span className="font-paragraph text-sm text-foreground/70">Medium Risk</span>
              </div>
              <p className="font-heading text-3xl font-bold text-secondary">{stats.medium}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-accent-teal/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-accent-teal" />
                <span className="font-paragraph text-sm text-foreground/70">Low Risk</span>
              </div>
              <p className="font-heading text-3xl font-bold text-accent-teal">{stats.low}</p>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Risk Filters */}
            <div className="flex flex-wrap gap-3">
              {riskFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedRisk(filter.value)}
                  className={`px-5 py-2 font-heading font-semibold rounded transition-all duration-300 ${
                    selectedRisk === filter.value
                      ? `bg-${filter.color} text-${filter.color === 'primary' ? 'primary-foreground' : filter.color === 'destructive' ? 'destructive-foreground' : 'secondary-foreground'} shadow-[0_0_20px_rgba(0,255,255,0.4)]`
                      : `bg-transparent border-2 border-${filter.color} text-${filter.color} hover:bg-${filter.color} hover:text-${filter.color === 'primary' ? 'primary-foreground' : filter.color === 'destructive' ? 'destructive-foreground' : 'secondary-foreground'}`
                  }`}
                  style={
                    selectedRisk === filter.value
                      ? {
                          backgroundColor: filter.color === 'primary' ? '#00FFFF' : filter.color === 'destructive' ? '#FF4136' : filter.color === 'secondary' ? '#FF00FF' : '#00FFCC',
                          color: filter.color === 'primary' ? '#000000' : '#FFFFFF',
                        }
                      : {
                          borderColor: filter.color === 'primary' ? '#00FFFF' : filter.color === 'destructive' ? '#FF4136' : filter.color === 'secondary' ? '#FF00FF' : '#00FFCC',
                          color: filter.color === 'primary' ? '#00FFFF' : filter.color === 'destructive' ? '#FF4136' : filter.color === 'secondary' ? '#FF00FF' : '#00FFCC',
                        }
                  }
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <Input
                type="text"
                placeholder="Search asteroids..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/70 backdrop-blur-xl border-primary/20 text-foreground placeholder:text-foreground/50"
              />
            </div>
          </div>
        </section>

        {/* Asteroids Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-8">
          <div className="min-h-[600px]">
            {isLoading ? null : filteredAsteroids.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAsteroids.map((asteroid, index) => (
                    <motion.div
                      key={asteroid._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <AsteroidCard asteroid={asteroid} isAuthenticated={isAuthenticated} />
                    </motion.div>
                  ))}
                </div>

                {hasNext && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => loadAsteroids(skip)}
                      className="px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                    >
                      Load More Asteroids
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <AlertTriangle className="w-16 h-16 text-muted-gray mb-4" />
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  No Asteroids Found
                </h3>
                <p className="font-paragraph text-foreground/70">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
