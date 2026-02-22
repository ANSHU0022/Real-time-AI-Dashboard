import { Link } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Dashboards", href: "/sales" },
  { label: "Features", href: "/features" },
  { label: "Marketing", href: "/marketing" },
  { label: "Finance", href: "/finance" },
  { label: "HR", href: "/hr" },
  { label: "Support", href: "/support" },
];

export default function Header() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Company
            </p>
            <p className="text-lg font-semibold text-foreground">SAAS Data AI</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="transition-colors hover:text-foreground">
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
  );
}
