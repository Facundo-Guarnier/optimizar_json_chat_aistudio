/**
 * Limpia un JSON de chat de AI Studio:
 * - Elimina chunks con isThought (cadenas de pensamiento)
 * - Conserva solo role y text de cada chunk
 */
export function cleanChatJson(data) {
  if (!data?.chunkedPrompt?.chunks) {
    throw new Error(
      "El formato del JSON no es el esperado (no se encontró chunkedPrompt.chunks).",
    );
  }

  const originalChunks = data.chunkedPrompt.chunks;
  const cleanedChunks = originalChunks
    .filter((chunk) => !chunk.isThought)
    .map((chunk) => ({
      role: chunk.role,
      text: chunk.text,
    }));

  const result = structuredClone(data);
  result.chunkedPrompt.chunks = cleanedChunks;

  return {
    result,
    stats: {
      original: originalChunks.length,
      cleaned: cleanedChunks.length,
      removed: originalChunks.length - cleanedChunks.length,
    },
  };
}
