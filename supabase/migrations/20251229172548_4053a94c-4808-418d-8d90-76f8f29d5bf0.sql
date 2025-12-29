-- Enable REPLICA IDENTITY FULL for complete row data in realtime updates
ALTER TABLE public.templates REPLICA IDENTITY FULL;