import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, TrendingUp, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: progressList } = trpc.progress.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar o dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Aprendizado</h1>
          <p className="text-gray-600">Acompanhe seu progresso e continue de onde parou</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Cursos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progressList?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Módulos Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {progressList?.reduce((acc, p) => acc + (p.completedModules as string[]).length, 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {progressList?.reduce((acc, p) => acc + (p.strengths as string[]).length, 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Courses */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Meus Cursos</h2>
          <Link href="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </Link>
        </div>

        {progressList && progressList.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {progressList.map((progress) => {
              const completedCount = (progress.completedModules as string[]).length;
              const weaknessCount = (progress.weaknesses as string[]).length;
              
              return (
                <Card key={progress.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">Curso #{progress.learningPathId.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          Iniciado em {new Date(progress.startedAt!).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {completedCount} módulos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">{completedCount} completados</span>
                      </div>
                      <Progress value={completedCount * 10} className="h-2" />
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">
                          {(progress.strengths as string[]).length} pontos fortes
                        </span>
                      </div>
                      {weaknessCount > 0 && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-600">{weaknessCount} em revisão</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Última atividade: {new Date(progress.lastActivityAt!).toLocaleDateString('pt-BR')}
                    </div>

                    <Link href={`/learn/${progress.learningPathId}`}>
                      <Button className="w-full">Continuar Aprendendo</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum curso iniciado ainda</h3>
              <p className="text-gray-600 mb-6">
                Comece sua jornada de aprendizado criando seu primeiro curso personalizado
              </p>
              <Link href="/create">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Meu Primeiro Curso
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

