import ContactForm from './ContactForm';

export default function Contactanos() {
  return (
    <section id="contacto" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Contáctanos</h2>
        <p className="text-center text-gray-600 mb-12">
          En xhiggs estamos encantados de resolver tus dudas o escuchar tus sugerencias. ¡Escríbenos y te responderemos lo antes posible!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <div className="flex items-start mb-6">
              <span className="text-2xl mr-4">📞</span>
              <div>
                <h3 className="text-lg font-medium mb-1">Teléfono</h3>
                <a href="tel:+34615120270" className="text-gray-700 hover:text-blue-600">
                  +34 615 12 02 70
                </a>
                <a
                  href="https://wa.me/34615120270"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-green-600 hover:underline"
                >
                  Escríbenos por WhatsApp
                </a>
                <p className="text-gray-500 text-sm">Lun–Vie, 9:00–18:00 (CET)</p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <span className="text-2xl mr-4">📧</span>
              <div>
                <h3 className="text-lg font-medium mb-1">Email</h3>
                <a href="mailto:xhiggscreation@gmail.com" className="text-gray-700 hover:text-blue-600">
                  xhiggscreation@gmail.com
                </a>
                <p className="text-gray-500 text-sm">Te respondemos en <strong>24h</strong></p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
