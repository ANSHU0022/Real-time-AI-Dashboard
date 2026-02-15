import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { FeaturesSection } from "@/components/FeaturesSection";

export default function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-[360px] w-[360px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[360px] w-[360px] rounded-full bg-info/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(120, 90, 40, 0.12) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <header className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</p>
                <p className="text-lg font-semibold text-foreground">SAAS Data AI</p>
              </div>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </header>

        <main className="relative z-10">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-4 pb-6 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Feature Overview
              </p>
              <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
                Built for every department, designed for speed
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Explore the four pillars that power your analytics, AI workflows, and reporting.
              </p>
            </div>
          </div>
          <FeaturesSection />
        </main>
      </div>
    </div>
  );
}
