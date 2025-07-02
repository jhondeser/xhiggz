import React from 'react';

export default function Contactanos() {
  return (
    <section id="contacto" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Contáctanos</h2>
        <p className="text-center text-gray-600 mb-12">
          En Xhiggz estamos encantados de resolver tus dudas o escuchar tus sugerencias. ¡Escríbenos y te responderemos lo antes posible!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <div className="flex items-start mb-6">
              <span className="text-2xl mr-4">📞</span>
              <div>
                <h3 className="text-lg font-medium mb-1">Teléfono</h3>
                <p className="text-gray-700">+34 661 4096 58</p>
                <p className="text-gray-500 text-sm">Lun–Vie, 9:00–18:00 (CET)</p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <span className="text-2xl mr-4">📧</span>
              <div>
                <h3 className="text-lg font-medium mb-1">Email</h3>
                <p className="text-gray-700">hola@xhiggz.com</p>
                <p className="text-gray-500 text-sm">Te respondemos en <strong>24h</strong></p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <form className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
                Asunto
              </label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Escribe tu mensaje aquí…"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
