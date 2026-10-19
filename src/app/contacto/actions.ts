"use server";

import nodemailer from "nodemailer";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "xhiggscreation@gmail.com";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot anti-spam: los humanos no ven este campo.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: "¡Mensaje enviado! Te responderemos pronto." };
  }

  const nombre = String(formData.get("nombre") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const asunto = String(formData.get("asunto") ?? "").trim().slice(0, 200);
  const mensaje = String(formData.get("mensaje") ?? "").trim().slice(0, 5000);

  if (!nombre || !email || !asunto || !mensaje) {
    return { status: "error", message: "Por favor, rellena todos los campos." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "El correo electrónico no parece válido." };
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[contacto] Faltan GMAIL_USER / GMAIL_APP_PASSWORD en el entorno");
    return {
      status: "error",
      message:
        "No hemos podido enviar el mensaje. Escríbenos a xhiggscreation@gmail.com o por WhatsApp.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Web Xhiggs" <${user}>`,
      to: CONTACT_TO,
      replyTo: `"${nombre.replace(/"/g, "")}" <${email}>`,
      subject: `[Web] ${asunto}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nAsunto: ${asunto}\n\n${mensaje}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Asunto:</strong> ${escapeHtml(asunto)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(mensaje)}</p>
      `,
    });

    return { status: "success", message: "¡Mensaje enviado! Te responderemos pronto." };
  } catch (err) {
    console.error("[contacto] Error enviando email:", err);
    return {
      status: "error",
      message:
        "No hemos podido enviar el mensaje. Escríbenos a xhiggscreation@gmail.com o por WhatsApp.",
    };
  }
}
