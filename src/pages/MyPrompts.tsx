import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Trash2, Edit, Copy, FileText, Wand2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

type Prompt = {
  id: string;
  title: string;
  content: string;
  prompt_type: string;
  metadata: any;
  created_at: string;
  updated_at: string;
};

export function MyPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();

    // Set up realtime subscription
    const channel = supabase
      .channel('prompts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prompts'
        },
        () => {
          fetchPrompts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading prompts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPrompts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deletePromptId) return;

    const { error } = await supabase
      .from("prompts")
      .delete()
      .eq("id", deletePromptId);

    if (error) {
      toast({
        title: "Error deleting prompt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully",
      });
      setPrompts(prompts.filter(p => p.id !== deletePromptId));
    }
    setDeletePromptId(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditTitle(prompt.title);
    setEditContent(prompt.content);
  };

  const handleSaveEdit = async () => {
    if (!editingPrompt) return;

    const { error } = await supabase
      .from("prompts")
      .update({
        title: editTitle,
        content: editContent,
      })
      .eq("id", editingPrompt.id);

    if (error) {
      toast({
        title: "Error updating prompt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated successfully",
      });
      setPrompts(prompts.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, title: editTitle, content: editContent }
          : p
      ));
      setEditingPrompt(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard",
    });
  };

  const getPromptIcon = (type: string) => {
    switch (type) {
      case 'wizard':
        return <Wand2 className="h-4 w-4" />;
      case 'rewriter':
        return <RefreshCw className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Prompts</h1>
          <p className="text-muted-foreground">Manage your saved prompts and prompt history</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No prompts yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No prompts match your search" : "Start creating prompts with the Wizard or Rewriter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getPromptIcon(prompt.prompt_type)}
                      <Badge variant="secondary" className="capitalize">
                        {prompt.prompt_type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{prompt.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {format(new Date(prompt.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.content}
                  </p>
                </CardContent>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(prompt.content)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(prompt)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletePromptId(prompt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletePromptId} onOpenChange={() => setDeletePromptId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this prompt? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Prompt</DialogTitle>
              <DialogDescription>
                Make changes to your prompt below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Prompt title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Prompt content"
                  rows={12}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPrompt(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
