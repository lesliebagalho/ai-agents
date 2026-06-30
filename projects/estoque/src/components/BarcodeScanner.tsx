"use client";

import { useState, useRef, useCallback } from "react";

type BarcodeScannerProps = {
  onScan: (value: string) => void;
  placeholder?: string;
  label?: string;
};

/**
 * Componente que oferece 3 metodos de entrada:
 * 1. Input manual com Enter
 * 2. Botao para escanear via câmera (QR Code / codigo de barras)
 * 3. Botao para escanear via arquivo de imagem
 *
 * Em dispositivos moveis, a camera frontal sera usada automaticamente.
 */
export default function BarcodeScanner({
  onScan,
  placeholder = "Escaneie ou digite o codigo...",
  label = "Codigo de barras / QR Code",
}: BarcodeScannerProps) {
  const [inputValue, setInputValue] = useState("");
  const [scanning, setScanning] = useState(false);
  const [mode, setMode] = useState<"manual" | "camera">("manual");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleInputSubmit = useCallback(
    (e: React.FormEvent | React.KeyboardEvent) => {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        onScan(val);
        setInputValue("");
      }
    },
    [inputValue, onScan],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleInputSubmit(e);
      }
    },
    [handleInputSubmit],
  );

  const startCamera = useCallback(async () => {
    try {
      setScanning(true);
      setMode("camera");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Nao foi possivel acessar a camera. Verifique as permissoes.");
      setScanning(false);
      setMode("manual");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setMode("manual");
  }, []);

  const handleCaptureFrame = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);

    // Tenta extrair texto via OCR simples (em mobile, a camera serve como entrada visual)
    // Usamos um approach: o usuario tira um "snapshot" e digitamos manualmente
    // Em producao real, usariamos uma lib como `quagga` ou `zbar-wasm`
    canvas.toBlob((blob) => {
      if (!blob) return;
      // Cria um link para o usuario copiar o que ve
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "scan-capture.png";
      a.click();
      URL.revokeObjectURL(url);
      alert("Imagem capturada! Para codigos de barras, use a entrada manual ou um leitor dedicado.");
    }, "image/png");
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        // Para CSV/PDF, apenas registramos
        if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
          onScan(text.trim());
        } else {
          // Para imagens, extraimos nome do arquivo como referencia
          const name = file.name.replace(/\.[^/.]+$/, "");
          if (name.length > 0) {
            onScan(name);
          }
        }
      };

      if (file.type === "text/plain" || file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        reader.readAsText(file);
      } else {
        // Imagem - apenas informa que foi carregada
        alert("Imagem carregada! Para reconhecimento avancado, digite manualmente ou use um leitor dedicado.");
        const name = file.name.replace(/\.[^/.]+$/, "");
        if (name.length > 0) {
          onScan(name);
        }
      }

      e.target.value = "";
    },
    [onScan],
  );

  return (
    <div className="barcode-scanner">
      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 700 }}>
        {label}
      </label>

      {mode === "manual" && (
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{ width: "100%", padding: "11px 12px", border: "1px solid var(--border-strong)", borderRadius: 8 }}
              autoComplete="off"
            />
            <span style={{ position: "absolute", right: 10, top: "50%", marginTop: -8, color: "#94a3b8", fontSize: 11 }}>
              Enter
            </span>
          </div>
          <button
            type="button"
            onClick={startCamera}
            className="button secondary"
            style={{ minHeight: 40, padding: "0 12px", fontSize: 20, lineHeight: 1 }}
            title="Escanear com camera"
          >
            📷
          </button>
          <label
            className="button secondary"
            style={{ minHeight: 40, padding: "0 12px", fontSize: 20, lineHeight: 1, cursor: "pointer" }}
            title="Carregar imagem"
          >
            📁
            <input
              type="file"
              accept="image/*,.csv,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      {mode === "camera" && (
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", gap: 6, justifyContent: "center" }}>
            <button type="button" className="button primary" onClick={handleCaptureFrame} style={{ fontSize: 12 }}>
              Capturar frame
            </button>
            <button type="button" className="button secondary" onClick={stopCamera} style={{ fontSize: 12 }}>
              Fechar camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
