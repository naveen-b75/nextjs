'use client';

import CustomBuilderSection from 'components/builderSection/builderBlock';

import { Suspense, useMemo } from 'react';

const { SITE_NAME } = process.env;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const builderLinksSection = useMemo(() => {
    return (
      <Suspense fallback={null}>
        <CustomBuilderSection modal="footer" path="/?footer" />
      </Suspense>
    );
  }, []);

  return (
    <footer className="relative z-20">
      <Suspense fallback={null}>
        <CustomBuilderSection modal="footer" path="/?footer" />
      </Suspense>
    </footer>
  );
}
