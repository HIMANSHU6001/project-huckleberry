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
      {children}
    </>
  );
}
