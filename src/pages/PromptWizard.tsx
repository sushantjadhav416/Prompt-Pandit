import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ArrowRight, 
  Wand2, 
  Target, 
  Users, 
  FileOutput, 
  Brain,
  Sparkles,
  CheckCircle,
  Copy,
  Loader2
} from "lucide-react";

interface WizardData {
  goal: string;
  context: string;
  audience: string;
  outputType: string;
  model: string;
  tone: string;
  length: string;
  additionalRequirements: string;
}

const steps = [
  { id: 1, title: "Define Goal", icon: Target, description: "What do you want to achieve?" },
  { id: 2, title: "Set Context", icon: Brain, description: "Provide background information" },
  { id: 3, title: "Target Audience", icon: Users, description: "Who is this for?" },
  { id: 4, title: "Output & Model", icon: FileOutput, description: "Format and AI model" },
  { id: 5, title: "Review & Generate", icon: Sparkles, description: "Finalize your prompt" }
];

const outputTypes = [
  { value: "text", label: "Text Content" },
  { value: "code", label: "Code Generation" },
  { value: "analysis", label: "Analysis/Research" },
  { value: "creative", label: "Creative Writing" },
  { value: "marketing", label: "Marketing Copy" },
  { value: "email", label: "Email Content" },
  { value: "social", label: "Social Media" },
  { value: "technical", label: "Technical Documentation" }
];

const aiModels = [
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro - Best for complex reasoning" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash - Balanced & fast (Recommended)" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite - Fastest & most efficient" }
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "creative", label: "Creative" },
  { value: "persuasive", label: "Persuasive" },
  { value: "informative", label: "Informative" },
  { value: "conversational", label: "Conversational" }
];

const lengths = [
  { value: "short", label: "Short (1-2 paragraphs)" },
  { value: "medium", label: "Medium (3-5 paragraphs)" },
  { value: "long", label: "Long (6+ paragraphs)" },
  { value: "variable", label: "Variable length" }
];

export function PromptWizard() {
  const { toast } = useToast();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [wizardData, setWizardData] = useState<WizardData>({
    goal: "",
    context: "",
    audience: "",
    outputType: "",
    model: "google/gemini-2.5-flash",
    tone: "professional",
    length: "medium",
    additionalRequirements: ""
  });

  // Pre-fill wizard data from template if passed via navigation
  useEffect(() => {
    if (location.state) {
      const templateData = location.state as Partial<WizardData>;
      setWizardData(prev => ({
        ...prev,
        ...templateData
      }));
      
      if (templateData.goal || templateData.context || templateData.outputType) {
        toast({
          title: "Template Loaded",
          description: "The wizard has been pre-filled with template data. You can modify it as needed."
        });
      }
    }
  }, [location.state, toast]);

  const progress = (currentStep / steps.length) * 100;

  const updateData = (field: keyof WizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-prompt", {
        body: {
          goal: wizardData.goal,
          context: wizardData.context,
          audience: wizardData.audience,
          outputType: wizardData.outputType,
          aiModel: wizardData.model,
          tone: wizardData.tone,
          length: wizardData.length
        }
      });

      if (error) {
        console.error("Error generating prompt:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate prompt. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.prompt) {
        setGeneratedPrompt(data.prompt);
        toast({
          title: "Success!",
          description: "Your optimized prompt has been generated."
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setGeneratedPrompt("");
    setWizardData({
      goal: "",
      context: "",
      audience: "",
      outputType: "",
      model: "google/gemini-2.5-flash",
      tone: "professional",
      length: "medium",
      additionalRequirements: ""
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="goal" className="text-base font-medium">
                What is your main goal? *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Describe what you want to accomplish with this prompt.
              </p>
              <Textarea
                id="goal"
                placeholder="e.g., Create compelling product descriptions for an e-commerce website, Generate Python code for data analysis, Write a blog post about sustainable technology..."
                value={wizardData.goal}
                onChange={(e) => updateData("goal", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="context" className="text-base font-medium">
                Provide context and background
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Share relevant details, constraints, or specific requirements.
              </p>
              <Textarea
                id="context"
                placeholder="e.g., This is for a tech startup selling smart home devices. The products are premium quality and eco-friendly. Target market is tech-savvy homeowners aged 25-45..."
                value={wizardData.context}
                onChange={(e) => updateData("context", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="audience" className="text-base font-medium">
                Who is your target audience? *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Describe who will consume or interact with the generated content.
              </p>
              <Input
                id="audience"
                placeholder="e.g., Software developers, Marketing professionals, College students, General consumers..."
                value={wizardData.audience}
                onChange={(e) => updateData("audience", e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Output Type *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  What type of content should be generated?
                </p>
                <Select value={wizardData.outputType} onValueChange={(value) => updateData("outputType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output type" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">AI Model</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Which AI model will you use?
                </p>
                <Select value={wizardData.model} onValueChange={(value) => updateData("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Tone</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  What tone should the output have?
                </p>
                <Select value={wizardData.tone} onValueChange={(value) => updateData("tone", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Length</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  How long should the output be?
                </p>
                <Select value={wizardData.length} onValueChange={(value) => updateData("length", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="additional" className="text-base font-medium">
                Additional Requirements
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Any specific instructions, format requirements, or constraints?
              </p>
              <Textarea
                id="additional"
                placeholder="e.g., Include specific keywords, avoid certain topics, use bullet points, include examples..."
                value={wizardData.additionalRequirements}
                onChange={(e) => updateData("additionalRequirements", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {!generatedPrompt ? (
              <>
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Review Your Prompt Configuration</h3>
                  <p className="text-muted-foreground">
                    Verify the details below before generating your optimized prompt.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-2">Goal</h4>
                    <p className="text-sm text-muted-foreground">{wizardData.goal || "Not specified"}</p>
                  </div>

                  {wizardData.context && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">Context</h4>
                      <p className="text-sm text-muted-foreground">{wizardData.context}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">Audience</h4>
                      <p className="text-sm text-muted-foreground">{wizardData.audience || "Not specified"}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">Output Type</h4>
                      <p className="text-sm text-muted-foreground">
                        {outputTypes.find(t => t.value === wizardData.outputType)?.label || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">AI Model</h4>
                      <p className="text-sm text-muted-foreground">
                        {aiModels.find(m => m.value === wizardData.model)?.label || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">Tone & Length</h4>
                      <p className="text-sm text-muted-foreground">
                        {tones.find(t => t.value === wizardData.tone)?.label || "Default"} • {lengths.find(l => l.value === wizardData.length)?.label || "Variable"}
                      </p>
                    </div>
                  </div>

                  {wizardData.additionalRequirements && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">Additional Requirements</h4>
                      <p className="text-sm text-muted-foreground">{wizardData.additionalRequirements}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-success/10 mb-4">
                    <Sparkles className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold">Your Optimized Prompt</h3>
                  <p className="text-muted-foreground">
                    Generated using {aiModels.find(m => m.value === wizardData.model)?.label}
                  </p>
                </div>

                <div className="relative">
                  <div className="p-6 rounded-lg bg-muted/50 border-2 border-primary/20">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">{generatedPrompt}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetWizard}>
                    Create Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return wizardData.goal.trim().length > 0;
      case 2:
        return true; // Context is optional
      case 3:
        return wizardData.audience.trim().length > 0;
      case 4:
        return wizardData.outputType.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Prompt Wizard
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's create the perfect prompt for your needs
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center min-w-0 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-colors
                  ${currentStep === step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > step.id 
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-border mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              variant="default"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : !generatedPrompt ? (
            <Button
              onClick={generatePrompt}
              disabled={!isStepValid() || isGenerating}
              variant="hero"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Prompt
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}