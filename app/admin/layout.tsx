import AdminFooter from '@/components/shared/admin-footer';
import BackgroundElements from '@/components/shared/background-elements';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundElements />
      <main className="min-h-[85dvh] bg-gradient-to-br from-white to-blue-50">
        {children}
      </main>
      <AdminFooter />
    </>
  );
}
