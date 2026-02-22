import { Link } from "react-router-dom";
import { Activity, ArrowRight, BarChart3, Bot, FileBarChart, LineChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FeaturesSection } from "@/components/FeaturesSection";

const navLinks = [
  { label: "Dashboards", href: "/sales" },
  { label: "Features", href: "/features" },
  { label: "Marketing", href: "/marketing" },
  { label: "Finance", href: "/finance" },
  { label: "HR", href: "/hr" },
  { label: "Support", href: "/support" },
];

export default function Home() {
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [marketingValue, setMarketingValue] = useState(0);
  const [hrValue, setHrValue] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsHeroLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHeroLoading) return;

    const duration = 3200;
    const start = performance.now();
    const targetMarketing = 24;
    const targetHr = 92;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      setMarketingValue(Math.round(targetMarketing * eased));
      setHrValue(Math.round(targetHr * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isHeroLoading]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-info/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(120, 90, 40, 0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <header className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</p>
                <p className="text-lg font-semibold text-foreground">SAAS Data AI</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/support">Contact</Link>
              </Button>
              <Button asChild className="shadow-lg shadow-primary/20">
                <Link to="/sales">
                  View Dashboards
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-28">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_12px_rgba(22,163,74,0.65)]" />
                SaaS Analytics Suite
              </div>
              <div className="space-y-5">
                <h1 className="-mt-2 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Department wide real-time analytics
                  <span className="text-primary"> for </span>
                  <span className="text-primary inline-block align-baseline dept-rotator-wrap">
                    <span className="dept-rotator" style={{ "--i": 0 } as React.CSSProperties}>Sales</span>
                    <span className="dept-rotator" style={{ "--i": 1 } as React.CSSProperties}>Marketing</span>
                    <span className="dept-rotator" style={{ "--i": 2 } as React.CSSProperties}>Finance</span>
                    <span className="dept-rotator" style={{ "--i": 3 } as React.CSSProperties}>Support</span>
                    <span className="dept-rotator" style={{ "--i": 4 } as React.CSSProperties}>HR</span>
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Company unifies sales, marketing, finance, support, and HR into a multi
                  real-time analytics layer. Every team moves faster with shared insight
                  and instant visibility.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="shadow-xl shadow-primary/20">
                  Ai Chatting
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Report Make
                </Button>
              </div>
              <div className="grid items-stretch gap-4 sm:grid-cols-3">
                <div className="hero-feature-card group h-full rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Real-time data</p>
                  </div>
                </div>
                <div className="hero-feature-card group h-full rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">AI data assistant</p>
                  </div>
                </div>
                <div className="hero-feature-card group h-full rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileBarChart className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">AI reporting</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
              <div className={`relative aspect-[4/3] w-full ${isHeroLoading ? "hero-loading" : "hero-loaded"}`}>
                <div className="float-slow absolute inset-0 tilt-card">
                  <div className="absolute inset-0 tilt-card-inner">
                    <div
                      className="tilt-card-layer layer-1 absolute inset-0 rounded-[32px] border border-border/30 bg-card/40 shadow-md"
                      style={{ transform: "translate(64px, 64px)" }}
                    />
                    <div
                      className="tilt-card-layer layer-2 absolute inset-0 rounded-[32px] border border-border/30 bg-card/50 shadow-lg"
                      style={{ transform: "translate(48px, 48px)" }}
                    />
                    <div
                      className="tilt-card-layer layer-3 absolute inset-0 rounded-[32px] border border-border/40 bg-card/60 shadow-xl"
                      style={{ transform: "translate(32px, 32px)" }}
                    />
                    <div
                      className="tilt-card-layer layer-4 absolute inset-0 rounded-[32px] border border-border/50 bg-card/70 shadow-2xl"
                      style={{ transform: "translate(16px, 16px)" }}
                    />
                    <div className="relative h-full rounded-[32px] border border-border/60 bg-card/90 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Company Pulse</p>
                          <p className="text-lg font-semibold text-foreground">Dept Signal Map</p>
                        </div>
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                          Live
                        </span>
                      </div>
                      <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                        <div className="subcard-tilt rounded-2xl bg-muted/40 p-4 pb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Sales Momentum</span>
                            <TrendingUp className="h-4 w-4 text-success" />
                          </div>
                          <div className="bar-group mt-3 flex h-16 items-end gap-2">
                            <div className="chart-bar h-7 w-2 rounded-full bg-primary/50" />
                            <div className="chart-bar h-12 w-2 rounded-full bg-primary/70" />
                            <div className="chart-bar h-9 w-2 rounded-full bg-primary/60" />
                            <div className="chart-bar h-14 w-2 rounded-full bg-primary" />
                            <div className="chart-bar h-10 w-2 rounded-full bg-primary/70" />
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground">Pipeline velocity up 18%</p>
                        </div>
                        <div className="subcard-tilt rounded-2xl bg-muted/40 p-4 pb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Support Load</span>
                            <LineChart className="h-4 w-4 text-success" />
                          </div>
                          <div className="mt-0 -ml-3">
                            <svg
                              viewBox="0 0 200 70"
                              className="hero-chart h-20 w-full"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 10 V64 M6 64 H194"
                                stroke="hsl(var(--border))"
                                strokeWidth="1"
                              />
                              <path
                                d="M6 52 C 20 32, 34 58, 50 36 C 66 14, 84 42, 100 28 C 116 16, 134 30, 150 24 C 166 18, 184 26, 194 22"
                                className="chart-line"
                                stroke="hsl(var(--success))"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6 60 C 22 44, 38 54, 54 32 C 70 12, 88 26, 104 20 C 120 14, 138 18, 154 28 C 170 38, 186 34, 194 36"
                                className="chart-line"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <p className="mt-0 text-xs text-muted-foreground">Resolution time down 9%</p>
                        </div>
                      </div>
                      <div className="px-6 pb-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="subcard-tilt rounded-xl border border-border/40 bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground">Marketing ROI</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">+{marketingValue}%</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-border/60">
                              <div className="metric-bar h-2 w-[70%] rounded-full bg-primary/70" />
                            </div>
                          </div>
                          <div className="subcard-tilt rounded-xl border border-border/40 bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground">Finance Health</p>
                            <div className="mt-2 flex items-center justify-center">
                              <svg viewBox="0 0 120 70" className="h-12 w-full" fill="none" aria-hidden="true">
                                <path
                                  d="M10 60 A50 50 0 0 1 110 60"
                                  stroke="hsl(var(--border))"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M10 60 A50 50 0 0 1 76 16"
                                  className="gauge-fill"
                                  pathLength="100"
                                  stroke="hsl(var(--success))"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  style={{ "--gauge-value": 74 } as React.CSSProperties}
                                />
                                <g
                                  className="gauge-needle"
                                  style={{ "--gauge-angle": "43deg" } as React.CSSProperties}
                                >
                                  <line
                                    x1="60"
                                    y1="60"
                                    x2="30"
                                    y2="40"
                                    stroke="hsl(var(--foreground))"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                  <circle cx="60" cy="60" r="4" fill="hsl(var(--foreground))" />
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div className="subcard-tilt rounded-xl border border-border/40 bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground">HR Capacity</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{hrValue}% coverage</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-border/60">
                              <div className="metric-bar h-2 w-[70%] rounded-full bg-primary/70" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
               
              </div>
            </div>
          </div>
        </main>
        <div className="relative z-10 border-t border-border/60 bg-background/70">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
