"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessagesSquare, GraduationCap } from "lucide-react";
import { sendContactMessage } from "@/app/contacto/actions";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    area: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const areaLabel =
      areas.find((a) => a.value === form.area)?.label.replace(/^\S+\s/, "") || form.area;

    const data = new FormData();
    data.set("nombre", form.name);
    data.set("email", form.email);
    data.set("asunto", `Solicitud desde la home · ${areaLabel}`);
    data.set(
      "mensaje",
      `Área de interés: ${areaLabel}\n\n${form.message.trim() || "(Sin mensaje adicional)"}`,
    );
    const honeypot = (e.currentTarget as HTMLFormElement).elements.namedItem("website");
    data.set("website", honeypot instanceof HTMLInputElement ? honeypot.value : "");

    try {
      const res = await sendContactMessage({ status: "idle", message: "" }, data);
      if (res.status === "success") {
        setIsSubmitted(true);
        setForm({ name: "", email: "", area: "", message: "" });
      } else {
        setError(res.message);
      }
    } catch {
      setError(
        "No hemos podido enviar el mensaje. Escríbenos a xhiggscreation@gmail.com o por WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const areas = [
    { value: "programacion", label: "🚀 Programación y Desarrollo Web", emoji: "🚀" },
    { value: "ia", label: "🤖 Inteligencia Artificial y Machine Learning", emoji: "🤖" },
    { value: "videojuegos", label: "🎮 Desarrollo de Videojuegos", emoji: "🎮" },
    { value: "robotica", label: "⚡ Robótica y Electrónica", emoji: "⚡" },
    { value: "diseno", label: "🎨 Diseño UX/UI y Gráfico", emoji: "🎨" },
    { value: "minecraft", label: "🏗️ Minecraft y Creación de Mundos", emoji: "🏗️" },
    { value: "otros", label: "💡 Otro interés", emoji: "💡" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-24 sm:py-32 bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h2>
          <p className="text-xl text-gray-700 mb-8">
            Gracias por tu interés en xhiggs. Te contactaremos en menos de 24 horas.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Enviar Otro Mensaje
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Comienza Tu Viaje
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Únete a la{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Revolución
              </span>{" "}
              Creativa
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ¿Listo para transformar tu curiosidad en habilidades del futuro? 
              Cuéntanos sobre tus intereses y te guiaremos hacia el camino perfecto.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Información lateral */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué unirte a xhiggs?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Profes que crean de verdad</h4>
                      <p className="text-gray-600 text-sm">Te enseñan desarrolladores en activo, no solo teoría</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Grupos reducidos</h4>
                      <p className="text-gray-600 text-sm">Atención cercana: el profe conoce a cada alumno</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MessagesSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Comunidad Xhiggs</h4>
                      <p className="text-gray-600 text-sm">Comparte tus proyectos con otros creadores</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-cyan-600">24h</div>
                  <div className="text-sm text-gray-600">Respuesta</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-cyan-600">4.6/5</div>
                  <div className="text-sm text-gray-600">Valoración de familias</div>
                </div>
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 space-y-6"
            >
              {/* Honeypot anti-spam (oculto) */}
              <div className="hidden" aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre completo"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  />
                </div>

                <div className="relative">
                  <GraduationCap className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 appearance-none"
                  >
                    <option value="">Selecciona tu área de interés</option>
                    {areas.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MessagesSquare className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                  <textarea
                    name="message"
                    placeholder="Cuéntanos más sobre tus objetivos, experiencia previa o cualquier pregunta que tengas..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 resize-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    🚀 Enviar Solicitud
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </motion.button>

              {error && (
                <p role="alert" className="text-center text-sm text-red-600">
                  {error}
                </p>
              )}

              <p className="text-center text-sm text-gray-500">
                Al enviar, aceptas nuestra política de privacidad. No spam, prometido.
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}