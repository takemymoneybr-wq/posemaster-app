"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  TrendingUp,
  Camera,
} from "lucide-react";

type FeedbackType = "success" | "warning" | "info";

interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  message: string;
  timestamp: Date;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Simulate real-time feedback
    const feedbackSequence = [
      {
        type: "info" as FeedbackType,
        message: "Posicione-se em frente à câmera",
        delay: 500,
      },
      {
        type: "warning" as FeedbackType,
        message: "Ajuste a posição do braço direito",
        delay: 2000,
      },
      {
        type: "success" as FeedbackType,
        message: "Braço direito alinhado!",
        delay: 3500,
      },
      {
        type: "warning" as FeedbackType,
        message: "Incline levemente a cabeça",
        delay: 5000,
      },
      {
        type: "success" as FeedbackType,
        message: "Posição da cabeça perfeita!",
        delay: 6500,
      },
      {
        type: "info" as FeedbackType,
        message: "Mantenha essa pose por 3 segundos",
        delay: 8000,
      },
      {
        type: "success" as FeedbackType,
        message: "Excelente! Pose replicada com sucesso",
        delay: 11000,
      },
    ];

    feedbackSequence.forEach((feedback) => {
      setTimeout(() => {
        const newMessage: FeedbackMessage = {
          id: Math.random().toString(),
          type: feedback.type,
          message: feedback.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);

        // Update score
        if (feedback.type === "success") {
          setScore((prev) => Math.min(prev + 15, 100));
        }
      }, feedback.delay);
    });

    // Redirect to result after sequence
    setTimeout(() => {
      router.push("/result");
    }, 12000);
  }, [router]);

  const getIcon = (type: FeedbackType) => {
    switch (type) {
      case "success":
        return CheckCircle2;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
    }
  };

  const getColor = (type: FeedbackType) => {
    switch (type) {
      case "success":
        return "green";
      case "warning":
        return "yellow";
      case "info":
        return "blue";
    }
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
                  Feedback em Tempo Real
                </h1>
                <p className="text-sm text-white/60">
                  Ajuste sua pose conforme as orientações
                </p>
              </div>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#007BFF]/10 rounded-xl border border-[#007BFF]/20">
              <TrendingUp className="w-4 h-4 text-[#007BFF]" />
              <span className="text-lg font-bold text-[#007BFF]">{score}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Camera Preview Placeholder */}
          <div className="bg-black/50 rounded-3xl border border-white/10 aspect-video mb-8 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF]/10 to-transparent"></div>
            <Camera className="w-24 h-24 text-white/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Precisão Atual</span>
                  <span className="text-white font-semibold">{score}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#007BFF] to-green-500 transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          <div className="space-y-4">
            <h2 className="text-xl font-geist-sans font-bold text-white mb-4">
              Orientações
            </h2>

            {messages.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                <Info className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">
                  Aguardando análise da sua posição...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const Icon = getIcon(msg.type);
                  const color = getColor(msg.type);

                  return (
                    <div
                      key={msg.id}
                      className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-${color}-500/20 p-4 animate-in slide-in-from-right duration-300`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-5 h-5 text-${color}-500`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            {msg.message}
                          </p>
                          <p className="text-white/40 text-xs">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="mt-8 bg-gradient-to-br from-[#007BFF]/10 to-purple-500/10 rounded-2xl border border-[#007BFF]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Dicas para Melhor Resultado
            </h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007BFF] mt-0.5 flex-shrink-0" />
                <span>Mantenha boa iluminação no ambiente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007BFF] mt-0.5 flex-shrink-0" />
                <span>Posicione-se a uma distância adequada da câmera</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007BFF] mt-0.5 flex-shrink-0" />
                <span>Siga as orientações em tempo real para ajustes</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
