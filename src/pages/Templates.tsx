import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Mail, 
  BookOpen,
  Briefcase,
  Heart,
  TrendingUp
} from "lucide-react";

const categories = [
  { id: "all", name: "All Templates", icon: BookOpen, count: 47 },
  { id: "writing", name: "Writing", icon: PenTool, count: 12 },
  { id: "coding", name: "Coding", icon: Code, count: 8 },
  { id: "marketing", name: "Marketing", icon: Megaphone, count: 10 },
  { id: "research", name: "Research", icon: FileSearch, count: 7 },
  { id: "image", name: "Image Generation", icon: Image, count: 6 },
  { id: "business", name: "Business", icon: Briefcase, count: 4 }
];

const templates = [
  {
    id: 1,
    title: "Blog Post Writer",
    description: "Create engaging blog posts with proper structure, SEO optimization, and compelling content.",
    category: "writing",
    rating: 4.8,
    uses: 2847,
    tags: ["SEO", "Content", "Blog"],
    featured: true
  },
  {
    id: 2,
    title: "Python Code Generator",
    description: "Generate clean, documented Python code for data analysis, web development, and automation.",
    category: "coding",
    rating: 4.9,
    uses: 1923,
    tags: ["Python", "Programming", "Documentation"],
    featured: true
  },
  {
    id: 3,
    title: "Product Description",
    description: "Write compelling product descriptions that convert visitors into customers.",
    category: "marketing",
    rating: 4.7,
    uses: 3241,
    tags: ["E-commerce", "Sales", "Conversion"],
    featured: false
  },
  {
    id: 4,
    title: "Research Summary",
    description: "Summarize complex research papers and academic content into digestible insights.",
    category: "research",
    rating: 4.6,
    uses: 892,
    tags: ["Academic", "Analysis", "Summary"],
    featured: false
  },
  {
    id: 5,
    title: "Social Media Posts",
    description: "Create engaging social media content optimized for different platforms.",
    category: "marketing",
    rating: 4.8,
    uses: 4156,
    tags: ["Social", "Engagement", "Viral"],
    featured: true
  },
  {
    id: 6,
    title: "Email Campaign",
    description: "Design effective email campaigns with subject lines, body content, and CTAs.",
    category: "marketing",
    rating: 4.5,
    uses: 1687,
    tags: ["Email", "Campaign", "CTA"],
    featured: false
  },
  {
    id: 7,
    title: "Creative Story Writer",
    description: "Generate creative stories, character development, and narrative structures.",
    category: "writing",
    rating: 4.7,
    uses: 2134,
    tags: ["Creative", "Fiction", "Narrative"],
    featured: false
  },
  {
    id: 8,
    title: "Code Review Assistant",
    description: "Analyze code quality, suggest improvements, and identify potential issues.",
    category: "coding",
    rating: 4.8,
    uses: 1456,
    tags: ["Review", "Quality", "Debugging"],
    featured: false
  },
  {
    id: 9,
    title: "AI Art Prompt",
    description: "Create detailed prompts for AI image generators like DALL-E, Midjourney, and Stable Diffusion.",
    category: "image",
    rating: 4.9,
    uses: 5678,
    tags: ["AI Art", "Visual", "Creative"],
    featured: true
  }
];

export function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredTemplates = templates.filter(template => template.featured);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || BookOpen;
  };

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
            <Filter className="h-4 w-4" />
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
                        <Button size="sm" variant="default">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                <TrendingUp className="h-4 w-4" />
                Sort by Popular
              </Button>
            </div>

            {filteredTemplates.length === 0 ? (
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
                          <Button size="sm" variant="default">
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