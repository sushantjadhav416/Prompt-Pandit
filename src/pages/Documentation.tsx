import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wand2, FileEdit, Layers, Save } from "lucide-react";

export function Documentation() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">PromptPandit Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Complete guide to using PromptPandit effectively
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn how to start using PromptPandit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Sign Up / Login</h3>
                <p className="text-muted-foreground">
                  Create an account or log in to access all features. Click on "Get Started" button in the navigation bar to begin.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">2. Choose Your Tool</h3>
                <p className="text-muted-foreground">
                  PromptPandit offers three main tools: Prompt Wizard, Templates, and Prompt Rewriter. Select the one that best fits your needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Wizard */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <CardTitle>Prompt Wizard</CardTitle>
              </div>
              <CardDescription>
                Standard Operating Procedure for creating prompts from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Navigate to Prompt Wizard</h3>
                <p className="text-muted-foreground mb-2">
                  Click on "Prompt Wizard" in the navigation menu or from the home page.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 2: Fill in the Form</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Task Description:</strong> Describe what you want the AI to do</li>
                  <li><strong>Context:</strong> Provide relevant background information</li>
                  <li><strong>Target Audience:</strong> Specify who the output is for</li>
                  <li><strong>Tone:</strong> Select the desired communication style</li>
                  <li><strong>Output Format:</strong> Choose how you want the result structured</li>
                  <li><strong>Constraints:</strong> Add any limitations or requirements</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 3: Generate Prompt</h3>
                <p className="text-muted-foreground">
                  Click the "Generate Prompt" button to create your optimized prompt.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 4: Save or Copy</h3>
                <p className="text-muted-foreground">
                  Use the "Save" button to store the prompt in your library, or "Copy" to use it immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>Templates</CardTitle>
              </div>
              <CardDescription>
                Using pre-built prompt templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Browse Templates</h3>
                <p className="text-muted-foreground">
                  Navigate to the Templates page to view available prompt templates organized by category.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 2: Search and Filter</h3>
                <p className="text-muted-foreground">
                  Use the search bar to find specific templates or browse by category tags.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 3: Select Template</h3>
                <p className="text-muted-foreground">
                  Click "Use Template" to load the template into the editor.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 4: Customize</h3>
                <p className="text-muted-foreground">
                  Modify the template to fit your specific needs and save or copy the result.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Rewriter */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-primary" />
                <CardTitle>Prompt Rewriter</CardTitle>
              </div>
              <CardDescription>
                Improving existing prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Access Rewriter</h3>
                <p className="text-muted-foreground">
                  Click on "Rewriter" in the navigation menu.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 2: Input Your Prompt</h3>
                <p className="text-muted-foreground">
                  Paste or type the prompt you want to improve in the input field.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 3: Specify Improvements</h3>
                <p className="text-muted-foreground">
                  Describe what aspects you want to improve (clarity, specificity, structure, etc.).
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 4: Rewrite</h3>
                <p className="text-muted-foreground">
                  Click "Rewrite Prompt" to get an enhanced version of your prompt.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 5: Save or Use</h3>
                <p className="text-muted-foreground">
                  Save the rewritten prompt to your library or copy it for immediate use.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* My Prompts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-primary" />
                <CardTitle>My Prompts</CardTitle>
              </div>
              <CardDescription>
                Managing your prompt library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Access Your Library</h3>
                <p className="text-muted-foreground">
                  Click on "My Prompts" in the navigation menu to view all saved prompts.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 2: Search Prompts</h3>
                <p className="text-muted-foreground">
                  Use the search bar to find specific prompts by title or content.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 3: View Details</h3>
                <p className="text-muted-foreground">
                  Click "View" to see the complete prompt details.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 4: Edit or Delete</h3>
                <p className="text-muted-foreground">
                  Use the "Edit" button to modify prompts or "Delete" to remove them from your library.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Step 5: Copy Prompts</h3>
                <p className="text-muted-foreground">
                  Click the "Copy" button to copy any saved prompt to your clipboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>
                Tips for getting the most out of PromptPandit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Be specific and clear in your descriptions</li>
                <li>Provide adequate context for better results</li>
                <li>Use constraints to guide the AI output</li>
                <li>Save successful prompts for future reference</li>
                <li>Iterate and refine prompts using the Rewriter</li>
                <li>Organize prompts with descriptive titles</li>
                <li>Test prompts with different AI models to find what works best</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
