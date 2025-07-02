// components/QuienesSomosSection.tsx
import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { LightBulbIcon, UsersIcon, GlobeAltIcon, RocketLaunchIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const QuienesSomosSection: React.FC = () => (
  <section id="quienes-somos" className="bg-white py-20">
    <div className="container mx-auto px-4 md:flex md:items-center md:gap-12">
      <div className="md:w-3/5">
        <h2 className="text-4xl font-bold mb-6">¿Quiénes somos?</h2>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Xhiggz es una escuela virtual nacida desde una idea sencilla pero poderosa: <strong>El poder de crear.</strong>
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Creamos Xhiggz porque creemos que el aprendizaje real no viene de las notas ni de las comparaciones,
          sino de la experiencia, de la curiosidad y de la culminación de proyectos con propósito.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4 italic">
          No enseñamos para que compitas. Enseñamos para que crees.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Queremos llegar a todas las personas —niños, jóvenes o adultos— que quieran aprender sobre el mundo IT y la tecnología,
          sin importar su nivel actual. Nuestra metodología se basa en desarrollar proyectos reales, con herramientas que se usan
          hoy en las industrias del mañana: desarrollo web, inteligencia artificial, robótica, videojuegos, diseño digital y más.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          Nuestro equipo está formado por jóvenes del mundo IT: programadores, diseñadores UX, analistas, traders, creadores de contenido,
          nómadas digitales, apasionados por la tecnología y el aprendizaje libre. Personas como tú, explorando el potencial de la inteligencia
          artificial, el código, la creatividad y la colaboración.
        </p>
      </div>
      <div className="md:w-2/5 mt-8 md:mt-0 flex justify-center">
        <AcademicCapIcon className="w-48 h-48 text-primary" />
      </div>
    </div>
  </section>
);

// components/MisionSection.tsx
const MisionSection: React.FC = () => (
  <section id="mision" className="bg-gray-50 py-20">
    <div className="container mx-auto px-4 max-w-3xl text-center">
      <h2 className="text-4xl font-bold mb-6">Misión</h2>
      <p className="text-base md:text-lg leading-relaxed mb-4">
        Nuestra misión es brindar a cada persona la oportunidad de aprender tecnología de forma creativa, divertida y significativa.
        Creamos experiencias educativas donde los estudiantes puedan explorar sus intereses, fortalecer sus talentos y aprender en comunidad.
      </p>
      <p className="text-base md:text-lg leading-relaxed mb-4">
        Queremos que cualquier persona con ganas —sin importar su contexto— tenga acceso a las herramientas del mundo IT y tecnológico.
        Y que al terminar cada curso, sientan orgullo de lo que crearon.
      </p>
      <p className="text-base md:text-lg leading-relaxed">
        Más allá de enseñar habilidades, buscamos despertar posibilidades:
        <br />🌍 Que nuestros estudiantes se den cuenta de que pueden viajar, trabajar desde cualquier lugar y conectar con una comunidad global que comparte sus pasiones.
      </p>
    </div>
  </section>
);

// components/VisionSection.tsx
const VisionSection: React.FC = () => (
  <section id="vision" className="bg-white py-20">
    <div className="container mx-auto px-4 md:flex md:items-center md:gap-12">
      <div className="md:w-2/5 hidden md:flex justify-center">
        <GlobeAltIcon className="w-48 h-48 text-primary" />
      </div>
      <div className="md:w-3/5">
        <h2 className="text-4xl font-bold mb-6">Visión</h2>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          En 5 años, imaginamos a Xhiggz como una comunidad educativa global, con miles de estudiantes de habla hispana creando proyectos reales,
          desarrollando su potencial y construyendo un futuro sin fronteras.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Soñamos con una escuela que llegue a todos los rincones, incluyendo zonas vulnerables de Latinoamérica, donde niños y jóvenes puedan acceder a
          una educación moderna, práctica y transformadora.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          Deseamos que cada estudiante recuerde Xhiggz como un espacio de libertad y autoconocimiento, como una familia internacional que le permitió descubrir
          su poder creativo y expandirse sin límites.
        </p>
      </div>
    </div>
  </section>
);

// components/ValoresSection.tsx
const valores = [
  { title: 'Creatividad', Icon: LightBulbIcon, description: 'Aprender es crear. En Xhiggz, cada estudiante da vida a ideas propias a través de proyectos reales.' },
  { title: 'Colaboración', Icon: UsersIcon, description: 'No creemos en competir, sino en construir juntos. Aquí, cada alumno aporta desde sus fortalezas y crece con su comunidad.' },
  { title: 'Visión de futuro', Icon: GlobeAltIcon, description: 'Enseñamos habilidades reales para el mundo moderno. La IA está integrada en todas nuestras rutas de aprendizaje.' },
  { title: 'Libertad y expansión', Icon: RocketLaunchIcon, description: 'No se trata solo de estudiar: se trata de expandirte.' },
  { title: 'Accesibilidad', Icon: LockClosedIcon, description: 'La tecnología no debe ser un privilegio. Defendemos una educación inclusiva para todos.' },
];

const ValoresSection: React.FC = () => (
  <section id="valores" className="bg-gray-50 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12"> Nuestros Valores</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {valores.map(({ title, Icon, description }) => (
          <div key={title} className="bg-white p-6 rounded-2xl shadow-md text-center">
            <Icon className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-base leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// components/FinalCTASection.tsx
const FinalCTASection: React.FC = () => (
  <section className="bg-primary text-black text-center py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-6">¿Listo para crear con nosotros?</h2>
      <p className="text-lg mb-8">Únete a Xhiggz hoy mismo y transforma tu aprendizaje en proyectos reales.</p>
      <Link href="/registro" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-6 rounded-xl font-semibold shadow-lg">
        Comenzar gratis
      </Link>
    </div>
  </section>
);

export {FinalCTASection,QuienesSomosSection, MisionSection, VisionSection,ValoresSection};