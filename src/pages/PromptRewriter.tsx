import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Wand2, Copy, RefreshCw, ArrowRight } from "lucide-react";

export function PromptRewriter() {
  const { toast } = useToast();
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [role, setRole] = useState("general");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [outputFormat, setOutputFormat] = useState("detailed");
  const [rewrittenPrompt, setRewrittenPrompt] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);

  const roles = [
    { value: "general", label: "General Purpose" },
    { value: "developer", label: "Expert Developer" },
    { value: "marketer", label: "Marketing Professional" },
    { value: "writer", label: "Content Writer" },
    { value: "analyst", label: "Data Analyst" },
    { value: "designer", label: "UX/UI Designer" },
    { value: "teacher", label: "Educator/Teacher" },
    { value: "researcher", label: "Academic Researcher" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
    { value: "persuasive", label: "Persuasive" },
    { value: "friendly", label: "Friendly" },
  ];

  const formats = [
    { value: "detailed", label: "Detailed" },
    { value: "concise", label: "Concise" },
    { value: "structured", label: "Structured (with sections)" },
    { value: "step-by-step", label: "Step-by-Step" },
  ];

  const handleRewrite = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to rewrite.",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    try {
      const { data, error } = await supabase.functions.invoke('rewrite-prompt', {
        body: {
          originalPrompt,
          role: roles.find(r => r.value === role)?.label || "General Purpose",
          context,
          tone: tones.find(t => t.value === tone)?.label || "Professional",
          outputFormat: formats.find(f => f.value === outputFormat)?.label || "Detailed"
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setRewrittenPrompt(data.rewrittenPrompt);
      toast({
        title: "Success!",
        description: "Your prompt has been rewritten with improvements.",
      });
    } catch (error) {
      console.error('Error rewriting prompt:', error);
      toast({
        title: "Error",
        description: "Failed to rewrite prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setOriginalPrompt("");
    setRole("general");
    setContext("");
    setTone("professional");
    setOutputFormat("detailed");
    setRewrittenPrompt("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Prompt Rewriter
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your existing prompts with context-aware improvements and role-based enhancements
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Original Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="original-prompt">Your Prompt</Label>
                <Textarea
                  id="original-prompt"
                  placeholder="Enter the prompt you want to improve..."
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="role">Role/Persona</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="context">Additional Context (Optional)</Label>
                <Input
                  id="context"
                  placeholder="Add any relevant context..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="format" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleRewrite} 
                  disabled={isRewriting || !originalPrompt.trim()}
                  className="flex-1"
                >
                  {isRewriting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Rewrite Prompt
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Rewritten Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rewrittenPrompt ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={rewrittenPrompt}
                      readOnly
                      className="min-h-[400px] bg-muted/50"
                    />
                    <Button
                      onClick={() => handleCopy(rewrittenPrompt)}
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <div>
                      <span className="font-medium">Original:</span> {originalPrompt.length} chars
                    </div>
                    <div>
                      <span className="font-medium">Rewritten:</span> {rewrittenPrompt.length} chars
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[400px] text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <Wand2 className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Your rewritten prompt will appear here after you click "Rewrite Prompt"
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}