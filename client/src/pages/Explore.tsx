import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Explore() {
  const { data: learningPaths, isLoading } = trpc.learningPath.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar Cursos</h1>
          <p className="text-gray-600">Descubra cursos criados pela comunidade</p>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando cursos...</p>
          </div>
        ) : learningPaths && learningPaths.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const curriculum = path.curriculumJson as any;
              const moduleCount = curriculum?.modules?.length || 0;
              const totalMinutes = curriculum?.modules?.reduce(
                (acc: number, m: any) => acc + (m.estimatedMinutes || 0),
                0
              ) || 0;

              return (
                <Card key={path.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {path.level}
                      </Badge>
                      <Badge variant="secondary">{path.topic}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{moduleCount} módulos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(totalMinutes / 60)}h {totalMinutes % 60}min</span>
                      </div>
                    </div>

                    <Link href={`/learn/${path.id}`}>
                      <Button className="w-full">Começar Curso</Button>
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
              <h3 className="text-lg font-semibold mb-2">Nenhum curso disponível ainda</h3>
              <p className="text-gray-600 mb-6">
                Seja o primeiro a criar um curso e compartilhar conhecimento!
              </p>
              <Link href="/create">
                <Button size="lg">Criar Curso</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

