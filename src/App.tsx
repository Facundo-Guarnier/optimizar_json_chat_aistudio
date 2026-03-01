import {
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { cleanChatJson, type ChatData, type CleanStats } from "./cleanChat";
import BrandFooter from "./components/BrandFooter";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import { useTheme } from "@/context/ThemeContext";

interface ResultState {
  json: string;
  stats: CleanStats;
}

export default function App() {
  const { isDark } = useTheme();
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processJson = useCallback((text: string, name: string | null) => {
    setError(null);
    setResult(null);
    setCopied(false);

    if (!text.trim()) {
      setError("El texto está vacío.");
      return;
    }

    try {
      const parsed: ChatData = JSON.parse(text);
      const { result: cleaned, stats } = cleanChatJson(parsed, text);
      const outputText = JSON.stringify(cleaned, null, 2);
      setResult({ json: outputText, stats });
      if (name) setFileName(name);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  // --- File reading helper ---
  const readFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setRawText(text);
        processJson(text, file.name);
      };
      reader.readAsText(file);
    },
    [processJson],
  );

  // --- Drag & Drop ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    readFile(file);
  };

  // --- File input ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    readFile(e.target.files?.[0]);
  };

  // --- Paste / manual ---
  const handleProcess = () => {
    processJson(rawText, null);
  };

  // --- Download ---
  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const base = fileName ? fileName.replace(/\.json$/i, "") : "chat";
    a.download = `${base}_optimizado.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Copy ---
  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Reset ---
  const handleReset = () => {
    setRawText("");
    setResult(null);
    setError(null);
    setFileName(null);
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Optimizar JSON Chat AI Studio
        </h1>
        <p
          className={`mb-8 text-center text-sm md:text-base max-w-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Elimina cadenas de pensamiento y campos innecesarios del historial de
          chat exportado de AI Studio.
        </p>

        {/* ---------- INPUT ZONE ---------- */}
        {!result && (
          <div className="w-full max-w-2xl space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : isDark
                    ? "border-gray-600 hover:border-gray-400"
                    : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <svg
                className={`mx-auto mb-3 w-10 h-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p
                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Arrastrá un archivo JSON aquí o hacé click para seleccionar
              </p>
              <p
                className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Solo archivos .json
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div
                className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
              />
              <span
                className={`text-xs uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                o pegá el JSON
              </span>
              <div
                className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
              />
            </div>

            {/* Textarea */}
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder='{"chunkedPrompt": {"chunks": [...]}}'
              rows={8}
              className={`w-full rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-y border ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-600"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />

            {/* Process button */}
            <button
              onClick={handleProcess}
              disabled={!rawText.trim()}
              className="w-full py-3 rounded-lg font-semibold transition-colors bg-primary hover:opacity-90 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Optimizar JSON
            </button>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ---------- RESULT ZONE ---------- */}
        {result && (
          <div className="w-full max-w-2xl space-y-4">
            {/* Comparison table */}
            <ComparisonTable stats={result.stats} isDark={isDark} />

            {/* Preview */}
            <div className="relative">
              <pre
                className={`rounded-lg p-4 text-xs font-mono max-h-80 overflow-auto border ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-300"
                    : "bg-gray-50 border-gray-300 text-gray-700"
                }`}
              >
                {result.json.slice(0, 5000)}
                {result.json.length > 5000 &&
                  "\n\n... (truncado en la vista previa)"}
              </pre>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 rounded-lg font-semibold bg-primary hover:opacity-90 text-white transition-colors"
              >
                Descargar JSON
              </button>
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {copied ? "¡Copiado!" : "Copiar al portapapeles"}
              </button>
            </div>

            <button
              onClick={handleReset}
              className={`w-full py-2 rounded-lg text-sm transition-colors border ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 border-gray-700 hover:border-gray-500"
                  : "text-gray-500 hover:text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Procesar otro archivo
            </button>
          </div>
        )}
      </main>

      <BrandFooter compact />
      <FloatingThemeToggle />
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function pct(original: number, cleaned: number): string {
  if (original === 0) return "—";
  const diff = ((cleaned - original) / original) * 100;
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
}

function RoleBadges({
  breakdown,
  isDark,
}: {
  breakdown: Record<string, number>;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(breakdown).map(([role, count]) => (
        <span
          key={role}
          className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
          }`}
        >
          {role}: {count}
        </span>
      ))}
    </div>
  );
}

function ComparisonTable({
  stats,
  isDark,
}: {
  stats: CleanStats;
  isDark: boolean;
}) {
  const headerCls = `text-left text-xs font-semibold uppercase tracking-wide ${
    isDark ? "text-gray-400" : "text-gray-500"
  }`;
  const cellCls = `py-2 ${isDark ? "text-gray-200" : "text-gray-800"}`;
  const borderCls = isDark ? "border-gray-700" : "border-gray-200";

  const rows: {
    label: string;
    original: React.ReactNode;
    result: React.ReactNode;
    change: string;
  }[] = [
    {
      label: "Chunks",
      original: stats.originalChunks.toLocaleString(),
      result: stats.cleanedChunks.toLocaleString(),
      change: pct(stats.originalChunks, stats.cleanedChunks),
    },
    {
      label: "Tamaño",
      original: formatBytes(stats.originalSizeBytes),
      result: formatBytes(stats.cleanedSizeBytes),
      change: pct(stats.originalSizeBytes, stats.cleanedSizeBytes),
    },
    {
      label: "Caracteres",
      original: stats.totalCharsOriginal.toLocaleString(),
      result: stats.totalCharsCleaned.toLocaleString(),
      change: pct(stats.totalCharsOriginal, stats.totalCharsCleaned),
    },
  ];

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className={`border-b ${borderCls}`}>
            <th className={`${headerCls} pl-4 py-2`}>Métrica</th>
            <th className={`${headerCls} py-2`}>Original</th>
            <th className={`${headerCls} py-2`}>Resultado</th>
            <th className={`${headerCls} pr-4 py-2 text-right`}>Cambio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className={`border-b ${borderCls}`}>
              <td
                className={`pl-4 ${cellCls} font-medium ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {row.label}
              </td>
              <td className={cellCls}>{row.original}</td>
              <td className={cellCls}>{row.result}</td>
              <td
                className={`pr-4 ${cellCls} text-right font-semibold text-primary`}
              >
                {row.change}
              </td>
            </tr>
          ))}
          {/* Roles row spanning */}
          <tr>
            <td
              className={`pl-4 pt-2 pb-3 font-medium align-top ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Roles
            </td>
            <td className="pt-2 pb-3 align-top">
              <RoleBadges
                breakdown={stats.roleBreakdownOriginal}
                isDark={isDark}
              />
            </td>
            <td className="pt-2 pb-3 align-top">
              <RoleBadges
                breakdown={stats.roleBreakdownCleaned}
                isDark={isDark}
              />
            </td>
            <td className="pr-4 pt-2 pb-3 text-right font-semibold text-red-400 align-top">
              {stats.removedChunks > 0
                ? `−${stats.removedChunks} thought`
                : "—"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
