/**
 * SERVICIO — Notificaciones WhatsApp via Fonnte
 *
 * Fonnte conecta tu propio número de WhatsApp y envía mensajes
 * a CUALQUIER número sin que el destinatario tenga que hacer nada.
 * Plan gratuito: 500 mensajes/mes — suficiente para proyectos académicos.
 *
 * Documentación: https://fonnte.com/docs
 *
 * Requiere en .env:
 *   FONNTE_TOKEN=xxxxxxxxxxxxxxxxxxxx   ← Token del panel de Fonnte
 */

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const FONNTE_URL   = "https://api.fonnte.com/send";

/**
 * Envía un mensaje de WhatsApp via Fonnte.
 * @param {string} phone - Número en formato E.164: +593XXXXXXXXX
 * @param {string} message - Texto del mensaje
 */
async function sendMessage(phone, message) {
  if (!FONNTE_TOKEN) {
    console.warn("[WhatsApp] FONNTE_TOKEN no configurado — mensaje no enviado.");
    return;
  }
  if (!phone || !phone.startsWith("+")) {
    console.warn("[WhatsApp] Número inválido o vacío:", phone);
    return;
  }

  try {
    // Fonnte requiere el número SIN el '+' para números internacionales
    const formattedPhone = phone.startsWith("+") ? phone.slice(1) : phone;

    const res = await fetch(FONNTE_URL, {
      method:  "POST",
      headers: {
        "Authorization": FONNTE_TOKEN,
        "Content-Type":  "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target:      formattedPhone,
        message,
        countryCode: "593",
        typing:      false,
        delay:       0,
      }).toString(),
    });

    const data = await res.json();

    if (data.status) {
      console.log(`[WhatsApp] ✅ Mensaje enviado a ${phone}`);
    } else {
      console.error(`[WhatsApp] ❌ Error Fonnte:`, data);
    }
  } catch (err) {
    console.error(`[WhatsApp] ❌ Error al enviar a ${phone}:`, err.message);
  }
}

// ── Mensajes predefinidos ────────────────────────────────────────────────────

/**
 * Notificación al crear una cita nueva.
 */
export async function sendAppointmentCreated({ telefono, patientName, fecha, hora, doctorName, specialty }) {
  const message =
    `🏥 *Fi-Citas — Confirmación de Cita*\n\n` +
    `Hola, *${patientName}*. Tu cita ha sido agendada exitosamente.\n\n` +
    `📅 Fecha: *${fecha}*\n` +
    `⏰ Hora: *${hora}*\n` +
    `👨‍⚕️ Doctor: *${doctorName}*\n` +
    `🩺 Especialidad: *${specialty}*\n\n` +
    `Por favor llega 10 minutos antes. ¡Te esperamos!`;

  await sendMessage(telefono, message);
}

/**
 * Notificación al confirmar una cita (estado → "confirmada").
 */
export async function sendAppointmentConfirmed({ telefono, patientName, fecha, hora, doctorName }) {
  const message =
    `✅ *Fi-Citas — Cita Confirmada*\n\n` +
    `Hola, *${patientName}*. Tu cita ha sido *confirmada*.\n\n` +
    `📅 Fecha: *${fecha}*\n` +
    `⏰ Hora: *${hora}*\n` +
    `👨‍⚕️ Doctor: *${doctorName}*\n\n` +
    `¡Recuerda asistir puntualmente!`;

  await sendMessage(telefono, message);
}

/**
 * Notificación al cancelar una cita.
 */
export async function sendAppointmentCancelled({ telefono, patientName, fecha, hora }) {
  const message =
    `❌ *Fi-Citas — Cita Cancelada*\n\n` +
    `Hola, *${patientName}*. Tu cita del *${fecha}* a las *${hora}* ha sido cancelada.\n\n` +
    `Si deseas reagendar, comunícate con nosotros.`;

  await sendMessage(telefono, message);
}

/**
 * Notificación al completar una cita.
 */
export async function sendAppointmentCompleted({ telefono, patientName, doctorName }) {
  const message =
    `🏥 *Fi-Citas — Cita Completada*\n\n` +
    `Hola, *${patientName}*. Tu cita con el/la Dr/a. *${doctorName}* ha concluido con éxito.\n\n` +
    `¡Gracias por confiar en nosotros!`;

  await sendMessage(telefono, message);
}
