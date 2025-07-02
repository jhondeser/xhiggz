"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    area: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    alert("¡Gracias por tu interés! Te contactaremos pronto.");
    setForm({ name: "", email: "", area: "", message: "" });
  };

  return (
    <section className="py-24 sm:py-32 bg-white text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          ¿Quieres ser parte de Xhiggz?
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Rellena el formulario y te contactaremos pronto para ayudarte a comenzar tu camino creativo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl bg-white text-gray-800"
          >
            <option value="">Área de interés</option>
            <option value="programacion">Programación</option>
            <option value="videojuegos">Creación de Videojuegos</option>
            <option value="arte">Arte Digital</option>
            <option value="arquitectura">Arquitectura Digital</option>
          </select>
          <textarea
            name="message"
            placeholder="Cuéntanos más sobre ti o tus dudas..."
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Enviar ✉️
          </button>
        </form>
      </motion.div>
    </section>
  );
}
