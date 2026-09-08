import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Landmark,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: FileText,
    title: 'Industrial Applications',
    description:
      'Submit and manage industrial approval applications through a single digital platform.',
  },
  {
    icon: FileCheck2,
    title: 'Document Verification',
    description:
      'Upload, manage and verify the documents required for industrial approvals and compliance.',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance Tracking',
    description:
      'Track regulatory requirements, pending actions and compliance status in one place.',
  },
  {
    icon: Landmark,
    title: 'Government Schemes',
    description:
      'Discover relevant government schemes and support opportunities for your business.',
  },
  {
    icon: LayoutDashboard,
    title: 'Central Dashboard',
    description:
      'Get a complete overview of applications, approvals, documents and pending actions.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Transparent',
    description:
      'Provide secure role-based access and transparent tracking between stakeholders.',
  },
];

const benefits = [
  'Reduced approval turnaround time',
  'Fewer incomplete applications',
  'Lower compliance effort',
  'Centralized document management',
  'Transparent application tracking',
  'Better access to government schemes',
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 size={19} />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight">
                Industria<span className="text-blue-600">Connect</span>
              </div>

              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Industrial Approvals
              </div>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              About
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#benefits"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Benefits
            </a>
          </nav>

          {/* Desktop login */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-2">

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                About
              </a>

              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#benefits"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Benefits
              </a>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Login
                <ArrowRight size={16} />
              </Link>

            </div>
          </div>
        )}
      </header>

      <main>

        {/* ================= HERO ================= */}
        <section
          id="home"
          className="overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-16"
        >
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">

            {/* Dashboard removed.
                Hero content is now centered/left-aligned. */}
            <div className="max-w-4xl">

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Simplifying
                <span className="text-blue-600">
                  {' '}
                  Industrial Approvals
                </span>
                <br />
                for a Faster India
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                IndustriaConnect is a unified digital platform connecting
                businesses and government authorities to streamline industrial
                approvals, document verification, compliance and access to
                government support schemes.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Login to Platform
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Explore Platform
                </a>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  'Unified platform',
                  'Transparent tracking',
                  'Secure access',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600"
                    />
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>


        {/* ================= ABOUT ================= */}
        <section
          id="about"
          className="scroll-mt-20 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Why IndustriaConnect?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                One platform for the complete industrial approval journey.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Businesses often have to interact with multiple departments,
                manage different documents and track separate approval
                processes. IndustriaConnect brings these activities together
                into one connected digital ecosystem.
              </p>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 p-6">
                <Building2 className="text-blue-600" size={25} />

                <h3 className="mt-4 font-bold">
                  For Businesses
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Simplify applications, document submission, compliance and
                  approval tracking.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <Landmark className="text-blue-600" size={25} />

                <h3 className="mt-4 font-bold">
                  For Government
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enable structured verification and transparent processing of
                  industrial applications.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <BadgeCheck className="text-blue-600" size={25} />

                <h3 className="mt-4 font-bold">
                  For the Ecosystem
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Reduce friction, improve transparency and encourage faster
                  industrial growth.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="text-center">

              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything in one place.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                A unified workspace designed around the complete industrial
                approval and compliance lifecycle.
              </p>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {features.map(
                ({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-5 font-bold text-slate-900">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                ),
              )}

            </div>
          </div>
        </section>


        {/* ================= BENEFITS ================= */}
        <section
          id="benefits"
          className="scroll-mt-20 bg-[#0f2040] py-20 text-white sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
                  Expected Impact
                </p>

                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Faster approvals with less friction.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                  IndustriaConnect aims to reduce approval delays, minimize
                  incomplete submissions and improve transparency across the
                  industrial approval ecosystem.
                </p>

                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50"
                >
                  Access Platform
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-blue-300"
                    />

                    <span className="text-sm leading-6 text-slate-200">
                      {benefit}
                    </span>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </section>


        {/* ================= CTA ================= */}
        <section className="px-5 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-14 text-center text-white shadow-xl sm:px-12">

            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to simplify industrial approvals?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Access IndustriaConnect and manage applications, documents,
              approvals and compliance from a single platform.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Login to IndustriaConnect
              <ArrowRight size={17} />
            </Link>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-blue-600" />

            <span className="text-sm font-bold">
              Industria<span className="text-blue-600">Connect</span>
            </span>
          </div>



        </div>

      </footer>

    </div>
  );
}