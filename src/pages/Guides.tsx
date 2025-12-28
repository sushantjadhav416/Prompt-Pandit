import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, Lightbulb } from "lucide-react";

export function Guides() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learning Guides</h1>
          <p className="text-xl text-muted-foreground">
            Essential resources for mastering prompt engineering
          </p>
        </div>

        <div className="space-y-8">
          {/* Prompt Engineering Guide */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Prompt Engineering</CardTitle>
              </div>
              <CardDescription>
                Learn the fundamentals and advanced techniques of prompt engineering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">What is Prompt Engineering?</h3>
                <p className="text-muted-foreground mb-4">
                  Prompt engineering is the practice of designing and refining inputs to get the best possible outputs from AI language models. It involves understanding how to structure requests, provide context, and guide AI behavior effectively.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Essential Resources</h3>
                <div className="space-y-3">
                  <a
                    href="https://www.promptingguide.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Prompt Engineering Guide - Comprehensive guide with techniques and examples
                  </a>
                  <a
                    href="https://platform.openai.com/docs/guides/prompt-engineering"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    OpenAI Prompt Engineering Guide - Official best practices
                  </a>
                  <a
                    href="https://www.anthropic.com/index/prompting-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Anthropic Prompt Engineering - Claude-specific techniques
                  </a>
                  <a
                    href="https://github.com/dair-ai/Prompt-Engineering-Guide"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub: Prompt Engineering Guide - Open-source collection
                  </a>
                  <a
                    href="https://learnprompting.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Learn Prompting - Free course on prompt engineering
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Key Concepts</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Clear and specific instructions</li>
                  <li>Providing relevant context and examples</li>
                  <li>Defining roles and personas</li>
                  <li>Using delimiters and structure</li>
                  <li>Few-shot and zero-shot prompting</li>
                  <li>Chain-of-thought reasoning</li>
                  <li>Temperature and parameter tuning</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Structural Design */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Prompt Structural Design</CardTitle>
              </div>
              <CardDescription>
                Master the art of structuring prompts for optimal results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Understanding Prompt Structure</h3>
                <p className="text-muted-foreground mb-4">
                  Effective prompt structure involves organizing information in a way that AI models can process efficiently. A well-structured prompt includes clear sections for context, instructions, examples, and constraints.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Recommended Resources</h3>
                <div className="space-y-3">
                  <a
                    href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Anthropic: Prompt Structure Overview - Detailed structural patterns
                  </a>
                  <a
                    href="https://www.promptingguide.ai/techniques/prompt_structure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Prompting Guide: Structural Techniques
                  </a>
                  <a
                    href="https://arxiv.org/abs/2312.16171"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Research Paper: Prompt Design and Engineering
                  </a>
                  <a
                    href="https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    OpenAI: Best Practices for Prompt Structure
                  </a>
                  <a
                    href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    DeepLearning.AI: Prompt Engineering Course
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Structural Elements</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">1. Role/Persona</h4>
                    <p className="text-sm text-muted-foreground">
                      Define who the AI should act as (e.g., "You are an expert copywriter")
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">2. Context</h4>
                    <p className="text-sm text-muted-foreground">
                      Provide background information necessary for the task
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">3. Task/Instruction</h4>
                    <p className="text-sm text-muted-foreground">
                      Clear, specific description of what you want done
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">4. Examples</h4>
                    <p className="text-sm text-muted-foreground">
                      Show desired input-output patterns (few-shot learning)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">5. Constraints</h4>
                    <p className="text-sm text-muted-foreground">
                      Specify limitations, format requirements, or boundaries
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">6. Output Format</h4>
                    <p className="text-sm text-muted-foreground">
                      Define how the response should be structured
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Prompt Templates</h3>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium mb-1">Basic Structure Template:</p>
                    <code className="text-sm text-muted-foreground block">
                      [Role] + [Context] + [Task] + [Format] + [Constraints]
                    </code>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Advanced Structure Template:</p>
                    <code className="text-sm text-muted-foreground block">
                      [Role/Persona] + [Context/Background] + [Task/Instruction] + [Examples] + [Output Format] + [Constraints] + [Tone/Style]
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
              <CardDescription>
                Advanced strategies for prompt optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Start simple and iterate - begin with basic prompts and refine based on results</li>
                <li>Use delimiters (###, """, ---) to clearly separate different sections</li>
                <li>Be explicit about what you don't want to avoid unwanted outputs</li>
                <li>Test prompts across different scenarios to ensure consistency</li>
                <li>Use system messages to set persistent behavior across conversations</li>
                <li>Leverage the PromptPandit tools to structure and optimize your prompts</li>
                <li>Keep a library of successful prompts for future reference</li>
                <li>Study and adapt prompts from the community and resources above</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
