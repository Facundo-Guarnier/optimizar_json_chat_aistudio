export interface Chunk {
  role?: string;
  text?: string;
  isThought?: boolean;
  [key: string]: unknown;
}

export interface ChatData {
  chunkedPrompt?: {
    chunks: Chunk[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface RoleBreakdown {
  [role: string]: number;
}

export interface CleanStats {
  originalChunks: number;
  cleanedChunks: number;
  removedChunks: number;
  originalSizeBytes: number;
  cleanedSizeBytes: number;
  reductionPercent: number;
  roleBreakdownOriginal: RoleBreakdown;
  roleBreakdownCleaned: RoleBreakdown;
  totalCharsOriginal: number;
  totalCharsCleaned: number;
}

export interface CleanResult {
  result: ChatData;
  stats: CleanStats;
}

/**
 * Limpia un JSON de chat de AI Studio:
 * - Elimina chunks con isThought (cadenas de pensamiento)
 * - Conserva solo role y text de cada chunk
 */
export function cleanChatJson(data: ChatData, rawInput?: string): CleanResult {
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

  const result: ChatData = structuredClone(data);
  result.chunkedPrompt!.chunks = cleanedChunks;

  // Size metrics
  const originalSizeBytes = rawInput
    ? new Blob([rawInput]).size
    : new Blob([JSON.stringify(data)]).size;
  const cleanedJson = JSON.stringify(result, null, 2);
  const cleanedSizeBytes = new Blob([cleanedJson]).size;
  const reductionPercent =
    originalSizeBytes > 0
      ? Math.round(
          ((originalSizeBytes - cleanedSizeBytes) / originalSizeBytes) * 100,
        )
      : 0;

  // Role breakdown - original
  const roleBreakdownOriginal: RoleBreakdown = {};
  for (const chunk of originalChunks) {
    const role = chunk.isThought
      ? "thought"
      : ((chunk.role as string) ?? "unknown");
    roleBreakdownOriginal[role] = (roleBreakdownOriginal[role] ?? 0) + 1;
  }

  // Role breakdown - cleaned
  const roleBreakdownCleaned: RoleBreakdown = {};
  for (const chunk of cleanedChunks) {
    const role = chunk.role ?? "unknown";
    roleBreakdownCleaned[role] = (roleBreakdownCleaned[role] ?? 0) + 1;
  }

  // Total chars
  const totalCharsOriginal = originalChunks.reduce(
    (sum, c) => sum + ((c.text as string)?.length ?? 0),
    0,
  );
  const totalCharsCleaned = cleanedChunks.reduce(
    (sum, c) => sum + (c.text?.length ?? 0),
    0,
  );

  return {
    result,
    stats: {
      originalChunks: originalChunks.length,
      cleanedChunks: cleanedChunks.length,
      removedChunks: originalChunks.length - cleanedChunks.length,
      originalSizeBytes,
      cleanedSizeBytes,
      reductionPercent,
      roleBreakdownOriginal,
      roleBreakdownCleaned,
      totalCharsOriginal,
      totalCharsCleaned,
    },
  };
}
