import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CreatePath() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const generateMutation = trpc.learningPath.generate.useMutation({
    onSuccess: (data) => {
      toast.success("Currículo criado com sucesso!");
      setLocation(`/learn/${data.learningPath.id}`);
    },
    onError: (error) => {
      toast.error("Erro ao criar currículo: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      toast.error("Por favor, descreva o que você quer aprender");
      return;
    }
    generateMutation.mutate({ goal, level });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para criar um curso.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Criação Inteligente de Currículo
            </div>
            <h1 className="text-4xl font-bold mb-4">Crie Seu Plano de Aprendizado</h1>
            <p className="text-gray-600 text-lg">
              Nossa IA vai criar um currículo personalizado baseado no seu objetivo e nível de conhecimento.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>O que você quer aprender?</CardTitle>
              <CardDescription>
                Seja específico sobre seu objetivo de aprendizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">Seu Objetivo de Aprendizado</Label>
                  <Input
                    id="goal"
                    placeholder="Ex: Python para Análise de Dados, Cálculo I, História da Arte Moderna..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={generateMutation.isPending}
                    className="text-base"
                  />
                  <p className="text-sm text-gray-500">
                    Quanto mais específico, melhor será o currículo gerado
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Qual é o seu nível atual?</Label>
                  <RadioGroup
                    value={level}
                    onValueChange={(value) => setLevel(value as any)}
                    disabled={generateMutation.isPending}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="font-normal cursor-pointer">
                        <span className="font-semibold">Iniciante</span> - Estou começando do zero
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="font-normal cursor-pointer">
                        <span className="font-semibold">Intermediário</span> - Tenho conhecimento básico
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="font-normal cursor-pointer">
                        <span className="font-semibold">Avançado</span> - Quero aprofundar meus conhecimentos
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Gerando Currículo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Gerar Meu Currículo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Dica</h3>
            <p className="text-blue-800 text-sm">
              Após criar seu currículo, você começará a aprender imediatamente. A IA vai adaptar 
              o conteúdo baseado no seu desempenho, criando exercícios personalizados e conteúdo 
              de reforço quando necessário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

