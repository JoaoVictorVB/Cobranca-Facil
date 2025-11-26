import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ResellersManagement } from '@/components/dashboard/ResellersManagement';
import { useEffect } from 'react';

export default function Distribution() {
  useEffect(() => {
    console.log('📍 Distribution page mounted');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <ResellersManagement />
      </div>
    </div>
  );
}
