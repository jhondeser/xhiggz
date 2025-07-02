import React from 'react';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const NosotrosHero: React.FC<HeroProps> = ({
  title = 'Conoce quiénes somos en Xhiggz',
  subtitle = 'Aprende más sobre nuestra misión, visión y valores que mueven nuestra comunidad.',
  ctaText = 'Descubre más',
  ctaLink = '#nosotros'
}) => {
  return (
    <section className="relative flex flex-col items-center text-center px-4 sm:px-6 py-20 bg-gradient-to-br from-black via-indigo-900 to-blue-950 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4"> Nosotros</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8"> ¿Quiénes somos? </p>
          <Link
            href="#quienes-somos"
            className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
          >
            Descubre más
          </Link>
        </div>
    </section>
  );
};

export default NosotrosHero;
