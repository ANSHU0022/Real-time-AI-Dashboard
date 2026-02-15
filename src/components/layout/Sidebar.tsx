import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Megaphone, 
  DollarSign, 
  Users, 
  Headphones,
  Menu,
  X,
  Activity,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Home, description: 'Hero Overview' },
  { name: 'Sales', href: '/sales', icon: BarChart3, description: 'Revenue & Performance' },
  { name: 'Marketing', href: '/marketing', icon: Megaphone, description: 'Campaigns & ROI' },
  { name: 'Finance', href: '/finance', icon: DollarSign, description: 'Financial Analytics' },
  { name: 'HR', href: '/hr', icon: Users, description: 'Employee Insights' },
  { name: 'Support', href: '/support', icon: Headphones, description: 'Customer Service' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background/90 backdrop-blur-sm border-border/50 hover:bg-muted/50"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-card/95 backdrop-blur-sm border-r border-border/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-lg rounded-r-3xl",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Company
                </h2>
                <p className="text-xs text-muted-foreground">
                  Food Data AI
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md transform scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:transform hover:scale-[1.01]"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
                  )} />
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium",
                      isActive ? "text-primary-foreground" : ""
                    )}>
                      {item.name}
                    </div>
                    <div className={cn(
                      "text-xs opacity-70",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1 h-8 bg-primary-foreground/30 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/20">
            <div className="text-xs text-muted-foreground text-center">
              <p className="font-medium">(c) 2026 Company</p>
              <p className="mt-1 opacity-70">Real-time Analytics Platform</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
