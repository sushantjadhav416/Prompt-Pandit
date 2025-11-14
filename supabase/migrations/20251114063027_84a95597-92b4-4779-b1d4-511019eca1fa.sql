-- Create template_likes table for like functionality
CREATE TABLE IF NOT EXISTS public.template_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.template_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for template_likes
CREATE POLICY "Anyone can view likes"
  ON public.template_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like templates"
  ON public.template_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike templates"
  ON public.template_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add likes_count column to templates table
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_template_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.templates
  SET likes_count = (
    SELECT COUNT(*)
    FROM public.template_likes
    WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)
  )
  WHERE id = COALESCE(NEW.template_id, OLD.template_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to auto-update likes count
CREATE TRIGGER update_template_likes_trigger
  AFTER INSERT OR DELETE ON public.template_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_template_likes();

-- Enable realtime for templates table
ALTER PUBLICATION supabase_realtime ADD TABLE public.templates;