"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ArrowLeft,
  Grid3x3,
  Eye,
  EyeOff,
  Circle,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import { getImage, saveImage } from "@/lib/storage";

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [overlayType, setOverlayType] = useState<"grid" | "silhouette">(
    "silhouette"
  );
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get reference image from storage
    const loadImage = async () => {
      const storedImage = await getImage("referenceImage");
      if (storedImage) {
        setReferenceImage(storedImage);
      }
    };
    loadImage();

    // Start camera
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Seu navegador não suporta acesso à câmera");
      }

      // Try to get available devices first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error("Nenhuma câmera encontrada no dispositivo");
      }

      // Request camera access with fallback options
      let mediaStream: MediaStream | null = null;
      
      try {
        // Try with facingMode first (mobile)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });
      } catch (err) {
        // Fallback: try without facingMode (desktop)
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
          });
        } catch (err2) {
          // Last resort: basic video request
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }
      }

      if (mediaStream) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Erro ao acessar câmera:", error);
      setIsLoading(false);
      
      // Set user-friendly error messages
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError("Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.");
      } else if (error.name === "NotFoundError" || error.message.includes("não encontrada")) {
        setCameraError("Nenhuma câmera encontrada. Verifique se seu dispositivo possui uma câmera conectada.");
      } else if (error.name === "NotReadableError") {
        setCameraError("Câmera está sendo usada por outro aplicativo. Feche outros apps que possam estar usando a câmera.");
      } else if (error.message.includes("não suporta")) {
        setCameraError("Seu navegador não suporta acesso à câmera. Tente usar Chrome, Firefox ou Safari.");
      } else {
        setCameraError("Erro ao acessar a câmera. Tente novamente ou use outro dispositivo.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      // Create canvas to capture photo
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const capturedImage = canvas.toDataURL('image/jpeg', 0.8);
        await saveImage("capturedPhoto", capturedImage);
        router.push("/result");
      }
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      // Fallback to reference image if capture fails
      if (referenceImage) {
        await saveImage("capturedPhoto", referenceImage);
      }
      router.push("/result");
    }
  };

  const retryCamera = () => {
    setCameraError(null);
    startCamera();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm absolute top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                stopCamera();
                router.back();
              }}
              className="w-10 h-10 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOverlayEnabled(!overlayEnabled)}
                disabled={!!cameraError}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm ${
                  overlayEnabled
                    ? "bg-[#007BFF] text-white"
                    : "bg-black/50 text-white/60"
                } ${cameraError ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {overlayEnabled ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Overlay</span>
              </button>

              <button
                onClick={() =>
                  setOverlayType(
                    overlayType === "grid" ? "silhouette" : "grid"
                  )
                }
                disabled={!!cameraError}
                className={`w-10 h-10 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                  cameraError ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {overlayType === "grid" ? (
                  <Grid3x3 className="w-5 h-5 text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Camera View */}
      <main className="flex-1 relative overflow-hidden">
        {/* Loading State */}
        {isLoading && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#007BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Iniciando câmera...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D] p-6">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-red-500/30">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Erro ao Acessar Câmera
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {cameraError}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={retryCamera}
                    className="w-full px-6 py-3 bg-[#007BFF] hover:bg-[#0066DD] text-white rounded-xl font-medium transition-all duration-200"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => {
                      stopCamera();
                      router.back();
                    }}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Stream */}
        {!cameraError && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Reference Image Overlay */}
            {overlayEnabled && referenceImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={referenceImage}
                  alt="Referência"
                  className={`max-w-full max-h-full object-contain ${
                    overlayType === "silhouette" ? "opacity-30" : "opacity-20"
                  }`}
                  style={{
                    mixBlendMode: overlayType === "silhouette" ? "screen" : "normal",
                  }}
                />
              </div>
            )}

            {/* Grid Overlay */}
            {overlayEnabled && overlayType === "grid" && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  {/* Vertical lines */}
                  <line
                    x1="33.33%"
                    y1="0"
                    x2="33.33%"
                    y2="100%"
                    stroke="rgba(0, 123, 255, 0.3)"
                    strokeWidth="1"
                  />
                  <line
                    x1="66.66%"
                    y1="0"
                    x2="66.66%"
                    y2="100%"
                    stroke="rgba(0, 123, 255, 0.3)"
                    strokeWidth="1"
                  />
                  {/* Horizontal lines */}
                  <line
                    x1="0"
                    y1="33.33%"
                    x2="100%"
                    y2="33.33%"
                    stroke="rgba(0, 123, 255, 0.3)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="66.66%"
                    x2="100%"
                    y2="66.66%"
                    stroke="rgba(0, 123, 255, 0.3)"
                    strokeWidth="1"
                  />
                  {/* Center crosshair */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="5"
                    fill="none"
                    stroke="rgba(0, 123, 255, 0.5)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}

            {/* Feedback Messages */}
            <div className="absolute top-24 left-0 right-0 flex justify-center px-4 z-10">
              <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-3 border border-[#007BFF]/30">
                <p className="text-white text-sm font-medium text-center">
                  Ajuste sua posição para corresponder à referência
                </p>
              </div>
            </div>

            {/* Alignment Indicators */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-4 px-4">
              {[
                { label: "Cabeça", status: "good" },
                { label: "Braços", status: "adjust" },
                { label: "Pernas", status: "good" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "good" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-white text-xs font-medium">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Bottom Controls */}
      {!cameraError && (
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className={`relative w-20 h-20 rounded-full bg-white hover:bg-white/90 transition-all duration-200 hover:scale-110 shadow-2xl ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="absolute inset-2 rounded-full border-4 border-[#0D0D0D]"></div>
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-center text-white/60 text-sm mt-4">
              Toque no botão para capturar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
