import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarfieldBackground from '@/components/StarfieldBackground';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

function ProfilePageContent() {
  const { member } = useMember();

  const profileData = [
    {
      icon: User,
      label: 'Display Name',
      value: member?.profile?.nickname || 'Not set',
    },
    {
      icon: Mail,
      label: 'Email',
      value: member?.loginEmail || 'Not available',
      verified: member?.loginEmailVerified,
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: member?._createdDate 
        ? format(new Date(member._createdDate), 'MMMM dd, yyyy')
        : 'Unknown',
    },
    {
      icon: Shield,
      label: 'Account Status',
      value: member?.status || 'Unknown',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <StarfieldBackground />
      
      <Header />

      <main className="relative pt-24 pb-16">
        <div className="w-full max-w-[100rem] mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                {member?.profile?.photo?.url ? (
                  <Image src={member.profile.photo.url} alt={member.profile.nickname || 'Profile'} className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/30 shadow-[0_0_40px_rgba(0,255,255,0.3)]" />
                ) : (
                  <div className="w-32 h-32 bg-primary/20 rounded-2xl flex items-center justify-center border-4 border-primary/30 shadow-[0_0_40px_rgba(0,255,255,0.3)]">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-teal rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-background" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-2">
                  {member?.profile?.nickname || 'Commander'}
                </h1>
                <p className="font-paragraph text-lg text-foreground/70">
                  Mission Control Operator
                </p>
                {member?.profile?.title && (
                  <p className="font-paragraph text-sm text-primary mt-2">
                    {member.profile.title}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {profileData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">{item.label}</p>
                    <p className="font-heading text-xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    {item.verified !== undefined && (
                      <div className="mt-2">
                        {item.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-teal/20 border border-accent-teal/40 rounded text-accent-teal text-xs font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/20 border border-secondary/40 rounded text-secondary text-xs font-semibold">
                            Not Verified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-8 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
              Mission Access
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-primary/10">
                <span className="font-paragraph text-foreground/80">Dashboard Access</span>
                <span className="px-3 py-1 bg-accent-teal/20 border border-accent-teal/40 rounded-full text-accent-teal text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-primary/10">
                <span className="font-paragraph text-foreground/80">Watchlist Management</span>
                <span className="px-3 py-1 bg-accent-teal/20 border border-accent-teal/40 rounded-full text-accent-teal text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-primary/10">
                <span className="font-paragraph text-foreground/80">Alert Notifications</span>
                <span className="px-3 py-1 bg-accent-teal/20 border border-accent-teal/40 rounded-full text-accent-teal text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-paragraph text-foreground/80">Real-Time Data Feed</span>
                <span className="px-3 py-1 bg-accent-teal/20 border border-accent-teal/40 rounded-full text-accent-teal text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          {(member?.contact?.firstName || member?.contact?.lastName || member?.contact?.phones) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 p-8 bg-background/70 backdrop-blur-xl rounded-2xl border border-primary/20"
            >
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                {(member.contact.firstName || member.contact.lastName) && (
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">Full Name</p>
                    <p className="font-paragraph text-lg text-foreground">
                      {[member.contact.firstName, member.contact.lastName].filter(Boolean).join(' ')}
                    </p>
                  </div>
                )}
                {member.contact.phones && member.contact.phones.length > 0 && (
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">Phone</p>
                    {member.contact.phones.map((phone, idx) => (
                      <p key={idx} className="font-paragraph text-lg text-foreground">
                        {phone}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
      <ProfilePageContent />
    </MemberProtectedRoute>
  );
}
