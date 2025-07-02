// Usage in page: app/nosotros/page.tsx
import React from 'react';
import NosotrosHero from '@/components/section_nosotros/NosotrosHero';
import {FinalCTASection,QuienesSomosSection, MisionSection, VisionSection,ValoresSection} from '@/components/section_nosotros/NosotrosSection';

export default function NosotrosPage() {
  return (
    <main className="font-sans text-gray-800">
      <NosotrosHero />
      <QuienesSomosSection />
      <MisionSection />
      <VisionSection />
      <ValoresSection />
      <FinalCTASection />
    </main>
  );
}
