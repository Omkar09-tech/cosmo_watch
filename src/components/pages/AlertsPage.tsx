import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Alerts } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import { format } from 'date-fns';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alerts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);

  const loadAlerts = async (skipValue: number = 0) => {
    try {
      const result = await BaseCrudService.getAll<Alerts>('alerts', {}, { limit: 50, skip: skipValue });
      
      if (skipValue === 0) {
        setAlerts(result.items);
      } else {
        setAlerts(prev => [...prev, ...result.items]);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getSeverityStyles = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { 
          bg: 'bg-destructive/20', 
          border: 'border-destructive/40', 
          text: 'text-destructive',
          glow: 'shadow-[0_0_30px_rgba(255,65,54,0.3)]'
        };
      case 'high':
        return { 
          bg: 'bg-secondary/20', 
          border: 'border-secondary/40', 
          text: 'text-secondary',
          glow: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]'
        };
      case 'medium':
        return { 
          bg: 'bg-accent-teal/20', 
          border: 'border-accent-teal/40', 
          text: 'text-accent-teal',
          glow: 'shadow-[0_0_30px_rgba(0,255,204,0.3)]'
        };
      case 'low':
        return { 
          bg: 'bg-primary/20', 
          border: 'border-primary/40', 
          text: 'text-primary',
          glow: ''
        };
      default:
        return { 
          bg: 'bg-muted-gray/20', 
          border: 'border-muted-gray/40', 
          text: 'text-muted-gray',
          glow: ''
        };
    }
  };

  const getAlertTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'close approach':
        return Calendar;
      case 'risk update':
        return AlertTriangle;
      default:
        return Bell;
    }
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
              <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,65,54,0.3)]">
                <Bell className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground">
                  Alert Center
                </h1>
                <p className="font-paragraph text-lg text-foreground/70 mt-2">
                  Close approach notifications and risk updates
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
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Alerts</p>
              <p className="font-heading text-3xl font-bold text-foreground">{alerts.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-destructive/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Critical</p>
              <p className="font-heading text-3xl font-bold text-destructive">
                {alerts.filter(a => a.severity?.toLowerCase() === 'critical').length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-secondary/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">High Priority</p>
              <p className="font-heading text-3xl font-bold text-secondary">
                {alerts.filter(a => a.severity?.toLowerCase() === 'high').length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-accent-teal/20"
            >
              <p className="font-paragraph text-sm text-foreground/70 mb-2">Close Approaches</p>
              <p className="font-heading text-3xl font-bold text-accent-teal">
                {alerts.filter(a => a.alertType?.toLowerCase() === 'close approach').length}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Alerts List */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-8">
          <div className="min-h-[600px]">
            {isLoading ? null : alerts.length > 0 ? (
              <>
                <div className="space-y-6">
                  {alerts.map((alert, index) => {
                    const severityStyles = getSeverityStyles(alert.severity);
                    const AlertIcon = getAlertTypeIcon(alert.alertType);
                    const formattedDate = alert.eventTimestamp 
                      ? format(new Date(alert.eventTimestamp), 'MMM dd, yyyy HH:mm')
                      : 'Unknown';

                    return (
                      <motion.div
                        key={alert._id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={`p-6 bg-background/70 backdrop-blur-xl rounded-2xl border ${severityStyles.border} ${severityStyles.glow} hover:scale-[1.02] transition-all duration-300`}
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Icon and Severity */}
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 ${severityStyles.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <AlertIcon className={`w-7 h-7 ${severityStyles.text}`} />
                            </div>
                            <div className="lg:hidden">
                              <div className={`px-3 py-1 ${severityStyles.bg} ${severityStyles.border} border rounded-full inline-block mb-2`}>
                                <span className={`font-heading text-xs font-semibold ${severityStyles.text} uppercase`}>
                                  {alert.severity || 'Unknown'}
                                </span>
                              </div>
                              {alert.alertType && (
                                <div className="text-xs font-paragraph text-foreground/60">
                                  {alert.alertType}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                                  {alert.title || 'Alert Notification'}
                                </h3>
                                {alert.description && (
                                  <p className="font-paragraph text-foreground/80">
                                    {alert.description}
                                  </p>
                                )}
                              </div>

                              {/* Desktop Severity Badge */}
                              <div className="hidden lg:block flex-shrink-0">
                                <div className={`px-4 py-2 ${severityStyles.bg} ${severityStyles.border} border rounded-xl`}>
                                  <span className={`font-heading text-sm font-semibold ${severityStyles.text} uppercase`}>
                                    {alert.severity || 'Unknown'}
                                  </span>
                                </div>
                                {alert.alertType && (
                                  <div className="text-xs font-paragraph text-foreground/60 text-right mt-2">
                                    {alert.alertType}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-primary/10">
                              <div className="flex items-center gap-2 text-foreground/60">
                                <Calendar className="w-4 h-4" />
                                <span className="font-paragraph text-sm">{formattedDate}</span>
                              </div>

                              {alert.asteroidDetailsUrl && (
                                <a
                                  href={alert.asteroidDetailsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300"
                                >
                                  <span className="font-heading text-sm font-semibold">View Details</span>
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {hasNext && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => loadAlerts(skip)}
                      className="px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                    >
                      Load More Alerts
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <Bell className="w-16 h-16 text-muted-gray mb-4" />
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  No Alerts Available
                </h3>
                <p className="font-paragraph text-foreground/70 mb-8 text-center max-w-md">
                  All systems nominal. Check back later for close approach notifications and risk updates.
                </p>
                <Link to="/dashboard">
                  <button className="px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]">
                    Return to Dashboard
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
