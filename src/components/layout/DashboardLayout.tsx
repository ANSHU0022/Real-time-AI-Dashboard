import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  isUsingLiveData: boolean;
  recordCount: number;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  isUsingLiveData, 
  recordCount 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-[1800px] mx-auto">
            <DashboardHeader
              title={title}
              subtitle={subtitle}
              isUsingLiveData={isUsingLiveData}
              recordCount={recordCount}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}