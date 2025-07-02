import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0e1b] text-white py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Columna 1: Sobre Xhiggz */}
        <div>
          <h4 className="text-lg font-bold mb-2">Xhiggz</h4>
          <p className="text-gray-400">
            Educación, tecnología y creatividad desde el corazón del universo.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div>
          <h4 className="text-lg font-bold mb-2">Navegación</h4>
          <ul className="space-y-1 text-gray-300">
            <li><Link href="/cursos" className="hover:text-cyan-400">Cursos</Link></li>
            <li><Link href="/nosotros" className="hover:text-cyan-400">Nosotros</Link></li>
            <li><Link href="/comunidad" className="hover:text-cyan-400">Comunidad</Link></li>
            <li><Link href="/contacto" className="hover:text-cyan-400">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3: Legal */}
        <div>
          <h4 className="text-lg font-bold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-300">
            <li><Link href="/privacidad" className="hover:text-cyan-400">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-cyan-400">Términos y Condiciones</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} Xhiggz. Todos los derechos reservados.
      </div>
    </footer>
  );
}
