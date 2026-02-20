import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Code2,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Web3 Verified",
    desc: "Course purchases verified on Solana blockchain. Your learning credentials are tamper-proof.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Access",
    desc: "Pay with SOL or INR and get instant access. No waiting, no middlemen.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Learn Anywhere",
    desc: "Access courses on any device. Content available 24/7 with lifetime access.",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Project Based",
    desc: "Build real-world projects. Not just theory — actual code you can ship.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Full Stack Curriculum",
    desc: "From fundamentals to production. Frontend, backend, DevOps, and Web3.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Community",
    desc: "Join thousands of developers. Get help, share projects, and grow together.",
  },
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "50+", label: "Courses" },
  { value: "4.9", label: "Rating" },
  { value: "95%", label: "Completion" },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Web3 Powered Learning Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 animate-slide-up">
              Learn to Code.
              <br />
              <span className="gradient-text">Build the Future.</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Master full-stack development, blockchain, and Web3 with
              project-based courses. Pay with crypto or card. Own your education
              on-chain.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/courses"
                className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="btn-secondary text-lg !px-8 !py-4"
              >
                Start for Free
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl font-black gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why <span className="gradient-text">CourseChain</span>?
            </h2>
            <p className="text-dark-300 max-w-xl mx-auto">
              The best of Web2 and Web3 combined into a seamless learning
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 group hover:glow-blue"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to <span className="gradient-text">Level Up</span>?
              </h2>
              <p className="text-dark-300 mb-8 max-w-lg mx-auto">
                Join thousands of developers who are building the future with
                CourseChain.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2"
                >
                  Get Started Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
