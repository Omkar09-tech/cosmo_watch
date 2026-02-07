// HPI 1.7-G
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Rocket, Shield, Bell, Eye, Activity, Globe, Radio, ChevronRight, Cpu, AlertTriangle } from 'lucide-react';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import { Image } from '@/components/ui/image';

// --- Utility Components ---

const SectionDivider = () => (
  <div className="w-full flex items-center justify-center py-12 opacity-30">
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
    <div className="mx-4 text-primary text-[10px] tracking-[0.3em] font-mono">SYSTEM CHECK</div>
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
  </div>
);

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-magenta opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-teal opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  const { isAuthenticated, member, actions } = useMember();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Rocket,
      title: 'Real-Time Tracking',
      description: 'Monitor near-Earth asteroids with live data from NASA NeoWs API. Precision trajectory analysis.',
      stat: 'LIVE FEED',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Risk Analysis',
      description: 'Advanced algorithms classify threats as Low, Medium, or High risk based on velocity and diameter.',
      stat: 'ACTIVE',
      color: 'text-accent-magenta'
    },
    {
      icon: Bell,
      title: 'Close Approach Alerts',
      description: 'Get notified about asteroids making close passes to Earth. Early warning systems operational.',
      stat: 'STANDBY',
      color: 'text-accent-teal'
    },
    {
      icon: Eye,
      title: 'Personal Watchlist',
      description: 'Track specific asteroids and monitor their trajectories. Custom orbital parameters.',
      stat: 'SECURE',
      color: 'text-glow-blue'
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative overflow-clip selection:bg-primary/30 selection:text-primary-foreground">
      <style>{`
        .radar-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }
        .scan-line {
          background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.5), transparent);
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .clip-tech-corner {
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            0 100%
          );
        }
      `}</style>

      <StarfieldBackground />
      
      {/* Global Scan Line Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 scan-line" />

      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] border border-primary/10 rounded-full absolute animate-[spin_60s_linear_infinite]" />
          <div className="w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] border border-dashed border-primary/20 rounded-full absolute animate-[spin_40s_linear_infinite_reverse]" />
          <div className="w-[90vw] h-[90vw] md:w-[40vw] md:h-[40vw] border border-accent-teal/10 rounded-full absolute animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 radar-grid opacity-20" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <motion.div 
            style={{ y: yHero, opacity: opacityHero }}
            className="lg:col-span-8 lg:col-start-2 text-center lg:text-left space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
                Orbital Command Center
              </span>
              <div className="px-2 py-0.5 bg-primary/10 border border-primary/30 text-[10px] text-primary font-mono rounded">
                V.1.7.0
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50"
            >
              COSMIC<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-teal">WATCH</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-paragraph text-xl md:text-2xl text-muted-gray max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Advanced planetary defense system. Monitoring Near-Earth Objects in real-time. 
              <span className="text-primary block mt-2">Your mission control is ready.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 pt-8 justify-center lg:justify-start"
            >
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="group relative">
                    <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                    <button className="relative px-8 py-4 bg-primary text-primary-foreground font-heading font-bold text-lg tracking-wide clip-tech-corner hover:bg-white transition-colors duration-300 flex items-center gap-3">
                      <Radio className="w-5 h-5 animate-pulse" />
                      LAUNCH DASHBOARD
                    </button>
                  </Link>
                  <Link to="/watchlist">
                    <button className="px-8 py-4 bg-transparent border border-primary/30 text-primary font-heading font-bold text-lg tracking-wide clip-tech-corner hover:bg-primary/10 transition-colors duration-300">
                      ACCESS WATCHLIST
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={actions.login}
                    className="group relative px-8 py-4 bg-primary text-primary-foreground font-heading font-bold text-lg tracking-wide clip-tech-corner hover:bg-white transition-colors duration-300 flex items-center gap-3"
                  >
                    <Cpu className="w-5 h-5" />
                    INITIALIZE SYSTEM
                  </button>
                  <Link to="/dashboard">
                    <button className="px-8 py-4 bg-transparent border border-primary/30 text-primary font-heading font-bold text-lg tracking-wide clip-tech-corner hover:bg-primary/10 transition-colors duration-300">
                      EXPLORE DATA
                    </button>
                  </Link>
                </>
              )}
            </motion.div>

            {isAuthenticated && member?.profile?.nickname && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-4 font-mono text-sm text-accent-teal flex items-center gap-2 justify-center lg:justify-start"
              >
                <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" />
                COMMANDER {member.profile.nickname.toUpperCase()} ON DECK
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary">SCROLL TO SCAN</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* --- SYSTEM TICKER --- */}
      <div className="w-full bg-primary/5 border-y border-primary/20 overflow-hidden py-3 backdrop-blur-sm z-20 relative">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="text-xs font-mono text-primary/70 tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3" /> SYSTEM STATUS: ONLINE
              </span>
              <span className="text-xs font-mono text-accent-magenta/70 tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> NEO SENSORS: ACTIVE
              </span>
              <span className="text-xs font-mono text-accent-teal/70 tracking-widest flex items-center gap-2">
                <Radio className="w-3 h-3" /> DATA STREAM: STABLE
              </span>
              <span className="text-xs font-mono text-white/50 tracking-widest">
                COORD: {Math.floor(Math.random() * 99)}.{Math.floor(Math.random() * 999)} / -{Math.floor(Math.random() * 99)}.{Math.floor(Math.random() * 999)}
              </span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* --- STICKY FEATURES SECTION --- */}
      <section className="relative w-full max-w-[120rem] mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent-magenta/50 rounded-full bg-accent-magenta/10">
                <div className="w-2 h-2 bg-accent-magenta rounded-full animate-pulse" />
                <span className="text-xs font-mono text-accent-magenta tracking-widest">CAPABILITIES</span>
              </div>
              
              <h2 className="font-heading text-5xl lg:text-7xl font-bold text-white leading-tight">
                Mission<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-teal">Modules</span>
              </h2>
              
              <p className="font-paragraph text-lg text-muted-gray max-w-md">
                Deploying advanced telemetry and risk assessment algorithms. 
                Our suite of tools provides comprehensive situational awareness for planetary defense.
              </p>

              <div className="hidden lg:block pt-12">
                <div className="w-32 h-32 border-l border-t border-primary/30 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-primary" />
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  <div className="absolute right-0 bottom-0 w-px h-full bg-gradient-to-t from-primary/30 to-transparent" />
                  <div className="p-4 font-mono text-[10px] text-primary/50 leading-loose">
                    MODULE_LOAD: 100%<br/>
                    SYNC_RATE: 40ms<br/>
                    ENCRYPTION: AES-256
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Cards */}
          <div className="lg:w-2/3 space-y-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --- PARALLAX VISUAL BREATHER --- */}
      <section className="relative w-full h-[80vh] overflow-clip flex items-center justify-center my-24">
        <ParallaxImage />
        <div className="absolute inset-0 bg-background/60 z-10" />
        <div className="relative z-20 text-center space-y-6 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              CONSTANT VIGILANCE
            </h2>
            <p className="font-paragraph text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              "The probability of a major impact is low, but the consequences are high. We watch the skies so you don't have to."
            </p>
            <div className="mt-12 inline-block border border-white/20 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full">
              <span className="font-mono text-primary tracking-widest">THREAT LEVEL: LOW</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- GLOBAL NETWORK (New Section) --- */}
      <section className="relative w-full max-w-[100rem] mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-square rounded-full border border-primary/20 relative flex items-center justify-center overflow-hidden bg-primary/5">
               {/* Abstract Globe Representation */}
               <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                 {[...Array(36)].map((_, i) => (
                   <div key={i} className="border border-primary/5" />
                 ))}
               </div>
               <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl absolute" />
               <div className="relative z-10 grid grid-cols-2 gap-4">
                 <div className="p-4 bg-background/80 border border-primary/30 backdrop-blur-sm rounded">
                   <div className="text-2xl font-heading font-bold text-white">127</div>
                   <div className="text-xs font-mono text-primary">OBSERVATORIES</div>
                 </div>
                 <div className="p-4 bg-background/80 border border-primary/30 backdrop-blur-sm rounded translate-y-8">
                   <div className="text-2xl font-heading font-bold text-white">24/7</div>
                   <div className="text-xs font-mono text-primary">COVERAGE</div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
              Global Defense <br/>
              <span className="text-primary">Network</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-gray">
              Cosmic Watch aggregates data from a worldwide network of telescopes and radar systems. 
              We process gigabytes of telemetry daily to ensure no object goes unnoticed.
            </p>
            <ul className="space-y-4">
              {['Automated Trajectory Calculation', 'Multi-Spectral Analysis', 'Crowdsourced Observation Data'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground/80">
                  <div className="w-1.5 h-1.5 bg-accent-teal rounded-full" />
                  <span className="font-mono text-sm tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* --- CTA SECTION --- */}
      <section className="relative w-full max-w-[100rem] mx-auto px-6 py-32 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-primary/30 bg-gradient-to-b from-background to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="relative z-10 px-8 py-24 text-center space-y-8">
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-white">
              Ready to Join the Watch?
            </h2>
            <p className="font-paragraph text-xl text-muted-gray max-w-2xl mx-auto">
              Access the full database, configure custom alerts, and contribute to the safety of our planet.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              {!isAuthenticated && (
                <button 
                  onClick={actions.login}
                  className="px-10 py-5 bg-primary text-primary-foreground font-heading font-bold text-xl rounded-none clip-tech-corner hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                >
                  INITIATE SIGNUP
                </button>
              )}
              <Link to="/dashboard">
                <button className="px-10 py-5 bg-transparent border border-white/20 text-white font-heading font-bold text-xl rounded-none clip-tech-corner hover:bg-white/10 transition-all duration-300">
                  VIEW PUBLIC DATA
                </button>
              </Link>
            </div>
          </div>

          {/* Decorative Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- Sub-Components ---

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative p-8 bg-background/40 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-500 rounded-xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className={`font-mono text-xs tracking-widest ${feature.color} border border-current px-2 py-1 rounded`}>
          {feature.stat}
        </span>
      </div>
      
      <div className="flex items-start gap-6 relative z-10">
        <div className={`p-4 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
          <feature.icon className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-2xl font-bold text-white group-hover:text-primary transition-colors">
            <GlitchText text={feature.title} />
          </h3>
          <p className="font-paragraph text-muted-gray group-hover:text-white/80 transition-colors">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

function ParallaxImage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-[120%] -top-[10%]">
      <motion.div style={{ y }} className="w-full h-full">
        <Image
          src="https://static.wixstatic.com/media/c56e8d_3a7da71bbafa4fe291604cfb799d07ae~mv2.png?originWidth=1280&originHeight=704"
          alt="Asteroid Field"
          className="w-full h-full object-cover opacity-60 mix-blend-screen grayscale contrast-125"
        />
      </motion.div>
    </div>
  );
}