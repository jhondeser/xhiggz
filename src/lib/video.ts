// src/lib/video.ts
//
// Vídeos de módulo alojados como "no listados" en YouTube. El admin pega
// cualquier formato de link (o solo el ID) y esto extrae el videoId real
// para construir el iframe de embed.

/**
 * Extrae el ID de vídeo de YouTube de una URL en cualquier formato común,
 * o lo devuelve tal cual si ya parece ser un ID (11 caracteres, sin barras).
 * Devuelve null si no se pudo reconocer.
 */
export function extractYoutubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Ya es un ID "pelado" (11 chars típico, sin espacios ni barras)
  if (/^[a-zA-Z0-9_-]{10,12}$/.test(value) && !value.includes('/')) {
    return value;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1);
      return id || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v');
      }
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.replace('/embed/', '');
      }
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.replace('/shorts/', '');
      }
    }
  } catch {
    // No era una URL válida — no reconocido
    return null;
  }

  return null;
}

/** URL de embed lista para usar en un <iframe>, o null si el input no es válido. */
export function toYoutubeEmbedUrl(input: string): string | null {
  const id = extractYoutubeId(input);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
