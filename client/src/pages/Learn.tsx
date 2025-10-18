import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Lightbulb, 
  AlertCircle,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { toast } from "sonner";

export default function Learn() {
  const [, params] = useRoute("/learn/:id");
  const pathId = params?.id || "";
  const { user, isAuthenticated } = useAuth();
  
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<any>(null);

  const { data: learningPath } = trpc.learningPath.get.useQuery({ id: pathId });
  const { data: progress, refetch: refetchProgress } = trpc.progress.get.useQuery(
    { learningPathId: pathId },
    { enabled: isAuthenticated }
  );

  const contentMutation = trpc.content.generate.useMutation();
  const submitMutation = trpc.exercise.submit.useMutation();
  const remedialMutation = trpc.exercise.generateRemedial.useMutation();

  const curriculum = useMemo(() => {
    return learningPath?.curriculumJson as any;
  }, [learningPath]);

  const currentModule = useMemo(() => {
    if (!curriculum || !progress) return null;
    return curriculum.modules?.find((m: any) => m.id === progress.currentModuleId);
  }, [curriculum, progress]);

  const completedModules = useMemo(() => {
    return (progress?.completedModules as string[]) || [];
  }, [progress]);

  const progressPercentage = useMemo(() => {
    if (!curriculum?.modules) return 0;
    return Math.round((completedModules.length / curriculum.modules.length) * 100);
  }, [curriculum, completedModules]);

  useEffect(() => {
    if (currentModule && isAuthenticated) {
      loadModuleContent();
    }
  }, [currentModule?.id]);

  const loadModuleContent = async () => {
    try {
      const result = await contentMutation.mutateAsync({
        learningPathId: pathId,
        moduleId: currentModule.id,
      });
      setCurrentExercise(result.exercise);
      setUserAnswer("");
      setShowHint(false);
    } catch (error: any) {
      toast.error("Erro ao carregar conteúdo: " + error.message);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentExercise || !currentModule) {
      toast.error("Por favor, escreva sua resposta");
      return;
    }

    try {
      const result = await submitMutation.mutateAsync({
        learningPathId: pathId,
        moduleId: currentModule.id,
        exerciseId: currentExercise.id || currentModule.id,
        userAnswer,
        correctAnswer: currentExercise.correctAnswer,
        question: currentExercise.question,
      });

      if (result.evaluation.isCorrect) {
        toast.success("Resposta correta! 🎉");
        await refetchProgress();
        
        // Move to next module
        const currentIndex = curriculum.modules.findIndex((m: any) => m.id === currentModule.id);
        if (currentIndex < curriculum.modules.length - 1) {
          setTimeout(() => loadModuleContent(), 1500);
        } else {
          toast.success("Parabéns! Você completou todo o curso! 🎓");
        }
      } else {
        toast.error("Não foi dessa vez. Veja o feedback abaixo.");
        
        // Generate remedial content if there's a weakness
        if (result.evaluation.identifiedWeakness) {
          const remedial = await remedialMutation.mutateAsync({
            learningPathId: pathId,
            weakness: result.evaluation.identifiedWeakness,
            originalModuleId: currentModule.id,
          });
          
          toast.info("Conteúdo de reforço criado para você!");
        }
      }
    } catch (error: any) {
      toast.error("Erro ao avaliar resposta: " + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar este curso.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{learningPath.title}</h1>
          <p className="text-gray-600">{learningPath.description}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progresso Geral</span>
                <span className="text-gray-600">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <Badge variant="outline" className="text-sm">
              {completedModules.length} / {curriculum?.modules?.length || 0} módulos
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Map */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Mapa de Aprendizado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {curriculum?.modules?.map((module: any, index: number) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isCurrent = module.id === currentModule?.id;
                  
                  return (
                    <div
                      key={module.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50"
                          : isCompleted
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{module.title}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {module.estimatedMinutes} min
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Module */}
            {currentModule && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <Badge>Módulo Atual</Badge>
                  </div>
                  <CardTitle>{currentModule.title}</CardTitle>
                  <CardDescription>{currentModule.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contentMutation.data?.explanation && (
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">📚 Explicação</h4>
                        <p className="text-gray-800 whitespace-pre-wrap">{contentMutation.data.explanation}</p>
                      </div>
                    </div>
                  )}

                  {currentExercise && (
                    <div className="space-y-4">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">✏️ Exercício Prático</h4>
                        <p className="text-gray-800 mb-4">{currentExercise.question}</p>
                        
                        <Textarea
                          placeholder="Digite sua resposta aqui..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="min-h-[120px] mb-3"
                          disabled={submitMutation.isPending}
                        />

                        <div className="flex gap-3">
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={submitMutation.isPending}
                            className="flex-1"
                          >
                            {submitMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Avaliando...
                              </>
                            ) : (
                              "Enviar Resposta"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowHint(!showHint)}
                            disabled={submitMutation.isPending}
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Dica
                          </Button>
                        </div>

                        {showHint && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-yellow-900">{currentExercise.hint}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {submitMutation.data && (
                        <div
                          className={`p-4 rounded-lg border-2 ${
                            submitMutation.data.evaluation.isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-orange-50 border-orange-300"
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            {submitMutation.data.evaluation.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {submitMutation.data.evaluation.isCorrect ? "Correto!" : "Feedback"}
                              </h4>
                              <p className="text-sm">{submitMutation.data.evaluation.feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {contentMutation.isPending && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Gerando conteúdo personalizado...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Weaknesses & Strengths */}
            {progress && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Áreas de Atenção
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(progress.weaknesses as string[]).length > 0 ? (
                      <div className="space-y-2">
                        {(progress.weaknesses as string[]).map((weakness, i) => (
                          <Badge key={i} variant="outline" className="mr-2">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma dificuldade identificada ainda</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(progress.strengths as string[]).length > 0 ? (
                      <div className="space-y-2">
                        {(progress.strengths as string[]).map((strength, i) => (
                          <Badge key={i} variant="outline" className="mr-2 border-green-300 text-green-700">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Continue praticando para identificar seus pontos fortes</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

