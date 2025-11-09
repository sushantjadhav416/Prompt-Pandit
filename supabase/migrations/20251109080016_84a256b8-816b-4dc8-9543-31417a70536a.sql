-- Create templates table
CREATE TABLE public.templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  rating numeric DEFAULT 0,
  uses integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read templates
CREATE POLICY "Templates are viewable by everyone"
ON public.templates
FOR SELECT
USING (true);

-- Only authenticated users can create templates (for admin purposes)
CREATE POLICY "Authenticated users can create templates"
ON public.templates
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update templates (for admin purposes)
CREATE POLICY "Authenticated users can update templates"
ON public.templates
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete templates (for admin purposes)
CREATE POLICY "Authenticated users can delete templates"
ON public.templates
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on category filtering
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_featured ON public.templates(featured);
CREATE INDEX idx_templates_tags ON public.templates USING GIN(tags);