-- Add likes_count column to templates table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'templates' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE public.templates ADD COLUMN likes_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create template_likes table if not exists
CREATE TABLE IF NOT EXISTS public.template_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.template_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Anyone can view likes" ON public.template_likes;
DROP POLICY IF EXISTS "Authenticated users can like templates" ON public.template_likes;
DROP POLICY IF EXISTS "Users can unlike templates" ON public.template_likes;

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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_template_likes_trigger ON public.template_likes;

CREATE TRIGGER update_template_likes_trigger
  AFTER INSERT OR DELETE ON public.template_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_template_likes();