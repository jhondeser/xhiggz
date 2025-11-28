import React from 'react';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const NosotrosHero: React.FC<HeroProps> = ({
  title = 'Nosotros',
  subtitle = '¿Quiénes somos?',
  ctaText = 'Descubre más',
  ctaLink = '#quienes-somos'
}) => {
  return (
    <section className="relative flex flex-col items-center text-center px-4 sm:px-6 py-20 bg-gradient-to-br from-black via-indigo-900 to-blue-950 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">{subtitle}</p>
          <Link
            href={ctaLink}
            className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
          >
            {ctaText}
          </Link>
        </div>
    </section>
  );
};

export default NosotrosHero;