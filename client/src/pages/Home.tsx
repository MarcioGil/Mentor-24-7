import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { BookOpen, Brain, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {APP_TITLE}
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Meu Aprendizado</Button>
                </Link>
                <Link href="/explore">
                  <Button variant="default">Explorar</Button>
                </Link>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Tutoria Personalizada com IA
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Aprenda no Seu Ritmo,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Com um Mentor 24/7
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma de aprendizado adaptativo que se ajusta ao seu desempenho em tempo real. 
            Não apenas assista aulas — tenha um tutor pessoal que identifica suas dificuldades e cria 
            conteúdo personalizado para você.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Link href="/create">
                <Button size="lg" className="text-lg px-8">
                  <Brain className="w-5 h-5 mr-2" />
                  Começar a Aprender
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="text-lg px-8" asChild>
                <a href={getLoginUrl()}>
                  <Brain className="w-5 h-5 mr-2" />
                  Começar Grátis
                </a>
              </Button>
            )}
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Ver Cursos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Adaptação em Tempo Real</CardTitle>
              <CardDescription>
                A IA analisa suas respostas e ajusta o currículo automaticamente, 
                focando nas suas dificuldades específicas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Conteúdo Personalizado</CardTitle>
              <CardDescription>
                Exercícios e explicações gerados especificamente para você, 
                baseados no seu estilo de aprendizagem e progresso.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Progresso Visível</CardTitle>
              <CardDescription>
                Acompanhe seu desenvolvimento com mapas de aprendizado dinâmicos 
                que mostram suas conquistas e próximos passos.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Defina seu Objetivo</h4>
                <p className="text-gray-600">
                  Diga o que você quer aprender (ex: "Python para Análise de Dados") e a IA cria um currículo personalizado.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Aprenda e Pratique</h4>
                <p className="text-gray-600">
                  Cada módulo apresenta conceitos claros seguidos de exercícios práticos para validar seu entendimento.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Receba Feedback Inteligente</h4>
                <p className="text-gray-600">
                  Se você errar, a IA identifica exatamente qual conceito você não entendeu e cria conteúdo de reforço antes de avançar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-3xl md:text-4xl">
              Pronto para Transformar seu Aprendizado?
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Comece agora e tenha um mentor pessoal disponível 24 horas por dia, 7 dias por semana.
            </CardDescription>
            <div className="pt-4">
              {isAuthenticated ? (
                <Link href="/create">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Criar Meu Primeiro Curso
                  </Button>
                </Link>
              ) : (
                <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                  <a href={getLoginUrl()}>Começar Gratuitamente</a>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 {APP_TITLE}. Educação personalizada com inteligência artificial.</p>
        </div>
      </footer>
    </div>
  );
}

