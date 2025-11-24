"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image, Layers, ArrowLeft, Check } from "lucide-react";
import { saveData } from "@/lib/storage";

type ReproductionType = "pose" | "scenario" | "both";

export default function ChoosePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ReproductionType | null>(
    null
  );

  const options = [
    {
      id: "pose" as ReproductionType,
      icon: Camera,
      title: "Replicar Pose",
      description: "Foque apenas na posição e postura do corpo",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "scenario" as ReproductionType,
      icon: Image,
      title: "Replicar Cenário",
      description: "Reproduza o ambiente e composição da cena",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "both" as ReproductionType,
      icon: Layers,
      title: "Pose + Cenário",
      description: "Replique tanto a pose quanto o cenário completo",
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      saveData("reproductionType", selectedType);
      router.push("/analysis");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-geist-sans font-bold text-white">
                Escolha o Tipo
              </h1>
              <p className="text-sm text-white/60">
                Selecione o que deseja replicar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-full bg-[#007BFF] flex items-center justify-center text-white text-sm font-semibold">
              1
            </div>
            <div className="w-16 h-1 bg-[#007BFF]"></div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
              2
            </div>
            <div className="w-16 h-1 bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
              3
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedType(option.id)}
                  className={`relative bg-white/5 backdrop-blur-sm rounded-3xl border-2 p-8 text-left transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "border-[#007BFF] bg-[#007BFF]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#007BFF] flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {option.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                selectedType
                  ? "bg-[#007BFF] hover:bg-[#0056b3] text-white hover:scale-105 hover:shadow-2xl hover:shadow-[#007BFF]/20"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              }`}
            >
              Continuar para Análise
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
