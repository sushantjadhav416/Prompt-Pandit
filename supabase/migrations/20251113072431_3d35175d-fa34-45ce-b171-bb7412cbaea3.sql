-- Create table to track individual user ratings
CREATE TABLE public.template_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Enable RLS on template_ratings
ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all ratings
CREATE POLICY "Anyone can view ratings"
  ON public.template_ratings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own ratings
CREATE POLICY "Authenticated users can rate templates"
  ON public.template_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON public.template_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON public.template_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update template rating average
CREATE OR REPLACE FUNCTION public.update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.templates
  SET rating = (
    SELECT COALESCE(AVG(rating)::numeric(3,2), 0)
    FROM public.template_ratings
    WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)
  )
  WHERE id = COALESCE(NEW.template_id, OLD.template_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update template rating
CREATE TRIGGER update_template_rating_on_change
  AFTER INSERT OR UPDATE OR DELETE ON public.template_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_template_rating();

-- Create function to increment template uses
CREATE OR REPLACE FUNCTION public.increment_template_uses(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.templates
  SET uses = uses + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add trigger for updated_at on template_ratings
CREATE TRIGGER update_template_ratings_updated_at
  BEFORE UPDATE ON public.template_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();