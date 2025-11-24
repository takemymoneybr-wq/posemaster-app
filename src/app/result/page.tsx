"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Share2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getImage } from "@/lib/storage";

export default function ResultPage() {
  const router = useRouter();
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [postProcess, setPostProcess] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const reference = await getImage("referenceImage");
      const captured = await getImage("capturedPhoto");

      if (reference) setReferenceImage(reference);
      if (captured) setCapturedImage(captured);
    };

    loadImages();
  }, []);

  const handleSave = () => {
    alert("Foto salva com sucesso!");
  };

  const handleShare = () => {
    alert("Compartilhar em redes sociais");
  };

  const handleRetry = () => {
    router.push("/camera");
  };

  const handleNewPhoto = () => {
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-geist-sans font-bold text-white">
                  Resultado
                </h1>
                <p className="text-sm text-white/60">
                  Compare e salve sua criação
                </p>
              </div>
            </div>

            <button
              onClick={handleNewPhoto}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-all duration-200"
            >
              Nova Foto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Captura Concluída!
                </h3>
                <p className="text-white/60 text-sm">
                  Sua foto foi capturada com sucesso
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-500">94%</p>
                <p className="text-xs text-white/60">Similaridade</p>
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-geist-sans font-bold text-white">
                Comparação
              </h2>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 bg-[#007BFF]/10 hover:bg-[#007BFF]/20 rounded-xl text-[#007BFF] text-sm font-medium transition-all duration-200"
              >
                {showComparison ? "Ver Separado" : "Ver Comparação"}
              </button>
            </div>

            <div
              className={`grid ${
                showComparison ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              } gap-6`}
            >
              {/* Reference Image */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium text-white/80">
                    Foto Referência
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-[3/4]">
                  {referenceImage && (
                    <img
                      src={referenceImage}
                      alt="Referência"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Captured Image */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium text-white/80">
                    Sua Captura
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-[3/4]">
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captura"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pose", value: "96%", icon: TrendingUp, color: "green" },
              { label: "Cenário", value: "92%", icon: Sparkles, color: "blue" },
              { label: "Iluminação", value: "88%", icon: Sparkles, color: "yellow" },
              { label: "Composição", value: "94%", icon: TrendingUp, color: "purple" },
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 text-${metric.color}-500`} />
                    <p className="text-sm text-white/60">{metric.label}</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                </div>
              );
            })}
          </div>

          {/* Post-Processing Option */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={postProcess}
                onChange={(e) => setPostProcess(e.target.checked)}
                className="w-6 h-6 rounded-lg border-2 border-white/20 bg-transparent checked:bg-[#007BFF] checked:border-[#007BFF] transition-all duration-200"
              />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">
                  Aplicar Pós-Processamento
                </p>
                <p className="text-white/60 text-sm">
                  Melhore automaticamente cores, contraste e nitidez
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[#007BFF]" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Tentar Novamente
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#007BFF] hover:bg-[#0056b3] rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-[#007BFF]/20"
            >
              <Download className="w-5 h-5" />
              Salvar Foto
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
