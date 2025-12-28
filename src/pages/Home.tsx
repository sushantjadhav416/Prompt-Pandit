import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Wand2, 
  Sparkles, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  ArrowRight,
  CheckCircle,
  Brain,
  Layers,
  RefreshCw
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Wizard",
    description: "Guided step-by-step prompt creation with intelligent suggestions and optimization.",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    icon: BookOpen,
    title: "Rich Template Library",
    description: "Pre-built templates for writing, coding, marketing, research, and creative projects.",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    icon: RefreshCw,
    title: "Smart Rewriting",
    description: "Transform existing prompts with context-aware improvements and role-based enhancements.",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Define audiences, goals, and output types for maximum prompt effectiveness.",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Brain,
    title: "Model Optimization",
    description: "Tailored prompts optimized for different AI models and use cases.",
    gradient: "from-pink-500 to-purple-600"
  },
  {
    icon: Layers,
    title: "Organized Library",
    description: "Save, categorize, and manage your prompt collection with advanced search.",
    gradient: "from-indigo-500 to-blue-600"
  }
];

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Craft Perfect
              <span className="gradient-text block">AI Prompts</span>
              <span className="text-muted-foreground text-2xl lg:text-4xl font-normal">
                Every Time
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your ideas into powerful, effective prompts with our intelligent writing agent. 
              Get better results from any AI model with professionally crafted prompts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild variant="hero" size="xl" className="min-w-[200px]">
                <Link to="/wizard">
                  <Sparkles className="h-5 w-5" />
                  Start Prompt Wizard
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="min-w-[200px]">
                <Link to="/templates">
                  <BookOpen className="h-5 w-5" />
                  Browse Templates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features for
              <span className="gradient-text"> Perfect Prompts</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, optimize, and manage AI prompts that deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="feature-card border-0 shadow-md animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-indigo-500/10 rounded-3xl p-12 lg:p-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Create Amazing Prompts?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators, developers, and marketers who trust PromptPandit 
              to craft their perfect AI prompts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/wizard">
                  <Zap className="h-5 w-5" />
                  Start Free Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/templates">
                  <Users className="h-5 w-5" />
                  View Examples
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center mt-8 space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>No credit card required</span>
              <span>•</span>
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Free templates included</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}