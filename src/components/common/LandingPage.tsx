import React from 'react';
import {
  Recycle,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  BarChart3,
  CalendarCheck,
  ChevronRight,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (initialMode: 'login' | 'signup', initialRole: 'user' | 'organization') => void;
  onExploreDirectory: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreDirectory }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Public Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-xl text-stone-900 tracking-tight leading-none">
                FindBin <span className="text-emerald-600">♻️</span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium tracking-tight">
                Find the right place for what you no longer need
              </div>
            </div>
          </div>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenAuth('login', 'user')}
              className="text-stone-700 hover:text-stone-950 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup', 'user')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-linear-to-b from-stone-100/60 via-stone-50 to-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Two-Sided Waste & Material Recovery Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto select-none">
            You don't need to figure out who will take your unwanted material.{' '}
            <span className="text-emerald-700">
              FindBin connects you.
            </span>
          </h1>

          <p className="text-stone-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have electronics, old textiles, scrap metal, sorted plastics, cartons, or hazardous inverter cells — find certified organizations to collect, buy, recycle, or donate responsibly.
          </p>

          {/* Interactive Role Switch Cards */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
            {/* User Option */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-200 hover:border-emerald-600 hover:shadow-lg transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">For Individuals & Households</span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">I have unwanted materials</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Request doorstep pickup or depot drop-off. Sell for scrap value or give away for ethical recycling and donation.
                </p>
                <div className="text-xs text-stone-500 space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free pickups & verified scrap buyers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Live request tracking & collector updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clear destination transparency for all waste</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup', 'user')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Join as User</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('login', 'user')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  User Login
                </button>
              </div>
            </div>

            {/* Organization Option */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-200 hover:border-emerald-700 hover:shadow-lg transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">For Recyclers & Collectors</span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">I am a collection organization</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Receive pre-segregated material requests, manage pickup schedules, assign field drivers, and expand your procurement pipeline.
                </p>
                <div className="text-xs text-stone-500 space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Define accepted categories & scrap rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manage field collectors & daily route schedules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fulfillment metrics & customer ratings</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup', 'organization')}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register Facility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('login', 'organization')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Org Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The Core Journey */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The FindBin Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              From unwanted waste to verified recovery in 5 simple steps
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              A transparent, closed-loop process designed for convenience and zero landfill leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Declare Waste',
                desc: 'Select material type, quantity, and whether you want to sell or donate/dispose.',
                icon: '📦',
              },
              {
                step: '02',
                title: 'Match Handler',
                desc: 'Find certified organizations that specialize in your exact waste category.',
                icon: '🏢',
              },
              {
                step: '03',
                title: 'Schedule Pickup',
                desc: 'Choose doorstep pickup or depot drop-off with preferred day & time window.',
                icon: '📅',
              },
              {
                step: '04',
                title: 'Collector Arrives',
                desc: 'Assigned staff weighs material on certified digital scales and logs handover.',
                icon: '🚚',
              },
              {
                step: '05',
                title: 'Eco-Recovery & Rating',
                desc: 'Material reaches recycling/repair; you receive confirmation and leave feedback.',
                icon: '♻️',
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="bg-stone-50 p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all space-y-2 relative"
              >
                <div className="flex items-center justify-between text-stone-400 font-mono text-xs font-bold">
                  <span>STEP {item.step}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h4 className="font-extrabold text-stone-900 text-sm">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Handled Categories Grid */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Comprehensive Segregation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                What can you hand over on FindBin?
              </h2>
            </div>
            <button
              onClick={onExploreDirectory}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Explore certified directory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'E-Waste', icon: '💻', desc: 'Computers, gadgets & cables' },
              { label: 'Battery / Hazardous', icon: '⚡', desc: 'Inverters, lithium & cells' },
              { label: 'Textile', icon: '👕', desc: 'Clean clothes & fabric rolls' },
              { label: 'Plastic', icon: '🧴', desc: 'PET bottles & HDPE cans' },
              { label: 'Paper & Cardboard', icon: '📦', desc: 'Cartons, archives & books' },
              { label: 'Metal', icon: '🔧', desc: 'Copper, aluminum & brass' },
              { label: 'Glass', icon: '🍾', desc: 'Jars, cullet & bottles' },
              { label: 'Wet / Organic', icon: '🍎', desc: 'Compost & food scraps' },
              { label: 'Mixed Dry Waste', icon: '🗑️', desc: 'Pre-sorted household dry' },
              { label: 'Other Materials', icon: '♻️', desc: 'Specialty industrial scrap' },
            ].map((cat) => (
              <div
                key={cat.label}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xs transition-all space-y-1"
              >
                <div className="text-2xl">{cat.icon}</div>
                <h4 className="font-extrabold text-stone-900 text-xs">{cat.label}</h4>
                <p className="text-[11px] text-stone-500 leading-tight">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Guarantee: "What happens to your material?" */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-6">
            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-800">
                Guaranteed Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                No blind handovers. You always know where your material ends up.
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Unlike informal waste dumping, every organization on FindBin must disclose their audited processing narrative — whether dismantling microchips for rare-earth metals, shredding textiles into acoustic insulation, or composting organic kitchen waste into certified bio-fertilizer.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 relative z-10">
              <button
                onClick={() => onOpenAuth('signup', 'user')}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Start Recycling Now
              </button>
              <button
                onClick={() => onOpenAuth('signup', 'organization')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all border border-white/20 cursor-pointer"
              >
                Register as Recovery Facility
              </button>
            </div>

            <div className="absolute right-4 -bottom-10 opacity-10 text-[240px] pointer-events-none select-none">
              ♻️
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-8 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              ♻️
            </div>
            <span className="font-extrabold text-stone-100 text-sm">FindBin</span>
            <span className="text-stone-500">· Find the right place for what you no longer need.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => onOpenAuth('login', 'user')} className="hover:text-white transition-colors cursor-pointer">
              User Sign In
            </button>
            <span>•</span>
            <button onClick={() => onOpenAuth('login', 'organization')} className="hover:text-white transition-colors cursor-pointer">
              Organization Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
