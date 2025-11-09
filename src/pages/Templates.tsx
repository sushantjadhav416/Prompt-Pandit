import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Star, 
  Eye,
  Code, 
  PenTool, 
  Megaphone, 
  FileSearch, 
  Image, 
  BookOpen,
  Briefcase,
  Heart,
  TrendingUp
} from "lucide-react";

type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  uses: number;
  tags: string[];
  featured: boolean;
};

const categoryConfig = [
  { id: "all", name: "All Templates", icon: BookOpen },
  { id: "writing", name: "Writing", icon: PenTool },
  { id: "coding", name: "Coding", icon: Code },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "research", name: "Research", icon: FileSearch },
  { id: "image", name: "Image Generation", icon: Image },
  { id: "business", name: "Business", icon: Briefcase }
];

export function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch templates from backend
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('uses', { ascending: false });
      
      if (error) throw error;
      return data as Template[];
    }
  });

  // Calculate dynamic category counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      all: templates.length,
      writing: 0,
      coding: 0,
      marketing: 0,
      research: 0,
      image: 0,
      business: 0
    };

    templates.forEach(template => {
      if (counts[template.category] !== undefined) {
        counts[template.category]++;
      }
    });

    return categoryConfig.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0
    }));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const featuredTemplates = useMemo(() => {
    return templates.filter(template => template.featured);
  }, [templates]);

  const getCategoryIcon = (categoryId: string) => {
    const category = categoryConfig.find(cat => cat.id === categoryId);
    return category?.icon || BookOpen;
  };

  const handleUseTemplate = (template: Template) => {
    // Map category to output type
    const outputTypeMap: Record<string, string> = {
      writing: "creative",
      coding: "code",
      marketing: "marketing",
      research: "analysis",
      image: "creative",
      business: "text"
    };

    navigate("/wizard", {
      state: {
        goal: template.title,
        context: `${template.description}\n\nTags: ${template.tags.join(", ")}`,
        outputType: outputTypeMap[template.category] || "text"
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Failed to load templates</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Prompt Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover professionally crafted prompt templates for every use case. 
            Save time and get better results with our curated collection.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Featured Templates */}
        {selectedCategory === "all" && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Featured Templates</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full mb-4" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => {
                  const CategoryIcon = getCategoryIcon(template.category);
                  return (
                    <Card key={template.id} className="feature-card border-0 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <CategoryIcon className="h-4 w-4 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {template.rating}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {template.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {template.uses.toLocaleString()} uses
                          </div>
                          <Button size="sm" variant="default" onClick={() => handleUseTemplate(template)}>
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    {categoryConfig.map((cat) => (
                      <Skeleton key={cat.id} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <category.icon className="h-4 w-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge 
                          variant={selectedCategory === category.id ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {categories.find(cat => cat.id === selectedCategory)?.name || "Templates"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sort by Popular
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full mb-4" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search query or browse different categories.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => {
                  const CategoryIcon = getCategoryIcon(template.category);
                  return (
                    <Card key={template.id} className="feature-card border-0 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <CategoryIcon className="h-4 w-4 text-primary" />
                            </div>
                            {template.featured && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {template.rating}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {template.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {template.uses.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {Math.floor(template.uses * 0.1)}
                            </div>
                          </div>
                          <Button size="sm" variant="default" onClick={() => handleUseTemplate(template)}>
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}