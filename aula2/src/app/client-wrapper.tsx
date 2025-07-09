'use client';

import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('./provider'), {
  ssr: false,
});

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}