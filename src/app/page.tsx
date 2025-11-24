"use client";

import { useState } from "react";
import { Upload, Camera, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveImage } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (selectedImage) {
      try {
        // Store image with compression and IndexedDB fallback
        await saveImage("referenceImage", selectedImage);
        router.push("/choose");
      } catch (error) {
        console.error("Failed to save image:", error);
        alert("Erro ao salvar imagem. Por favor, tente com uma imagem menor.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-geist-sans font-bold text-white">
              PoseMaster
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007BFF]/10 border border-[#007BFF]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#007BFF]" />
              <span className="text-sm text-[#007BFF] font-medium">
                Tecnologia Premium
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-geist-sans font-bold text-white mb-4">
              Replique Poses com
              <span className="text-[#007BFF]"> Precisão Profissional</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Importe uma foto de referência e deixe nossa IA guiar você para
              replicar poses e cenários perfeitamente
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
            {!selectedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? "border-[#007BFF] bg-[#007BFF]/10"
                    : "border-white/20 hover:border-[#007BFF]/50 hover:bg-white/5"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#007BFF]/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-[#007BFF]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-2">
                      Arraste sua foto de referência aqui
                    </p>
                    <p className="text-white/60">
                      ou clique para selecionar do seu dispositivo
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <span>PNG, JPG, WEBP até 10MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-black/50">
                  <img
                    src={selectedImage}
                    alt="Referência selecionada"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 px-4 py-2 bg-black/80 hover:bg-black text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Trocar foto
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleContinue}
                    className="flex-1 px-8 py-4 bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-[#007BFF]/20"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Camera,
                title: "Análise IA",
                description: "Tecnologia avançada para detectar poses e cenários",
              },
              {
                icon: Sparkles,
                title: "Guia em Tempo Real",
                description: "Feedback instantâneo para ajustar sua posição",
              },
              {
                icon: Upload,
                title: "Resultados Pro",
                description: "Compare e salve suas criações com qualidade",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#007BFF]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#007BFF]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          <p>PoseMaster © 2024 - Tecnologia Premium para Fotografia</p>
        </div>
      </footer>
    </div>
  );
}
