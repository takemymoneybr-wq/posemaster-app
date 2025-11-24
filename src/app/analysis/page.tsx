"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

export default function AnalysisPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Carregando imagem...");

  useEffect(() => {
    const stages = [
      { progress: 20, message: "Carregando imagem...", duration: 800 },
      { progress: 40, message: "Detectando elementos...", duration: 1200 },
      { progress: 60, message: "Analisando pose...", duration: 1500 },
      { progress: 80, message: "Processando cenário...", duration: 1000 },
      { progress: 95, message: "Finalizando análise...", duration: 800 },
      { progress: 100, message: "Análise completa!", duration: 500 },
    ];

    let currentStage = 0;

    const runStages = () => {
      if (currentStage < stages.length) {
        const current = stages[currentStage];
        setProgress(current.progress);
        setStage(current.message);

        setTimeout(() => {
          currentStage++;
          runStages();
        }, current.duration);
      } else {
        setTimeout(() => {
          router.push("/camera");
        }, 1000);
      }
    };

    runStages();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center">
                {progress < 100 ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-white" />
                )}
              </div>
              {progress < 100 && (
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-[#007BFF] animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-geist-sans font-bold text-white text-center mb-4">
            {progress < 100 ? "Analisando sua foto..." : "Análise Completa!"}
          </h2>

          {/* Stage Message */}
          <p className="text-lg text-white/60 text-center mb-8">{stage}</p>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Progress Percentage */}
          <p className="text-center text-white/80 font-semibold text-lg">
            {progress}%
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: "Precisão", value: "98%" },
              { label: "Elementos", value: "12" },
              { label: "Tempo", value: "5s" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
              >
                <p className="text-2xl font-bold text-[#007BFF] mb-1">
                  {item.value}
                </p>
                <p className="text-sm text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white/40 text-sm mt-6">
          Nossa IA está processando sua imagem com tecnologia de ponta
        </p>
      </div>
    </div>
  );
}
