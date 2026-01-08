-- Create enum for risk levels
CREATE TYPE public.risk_level AS ENUM ('H', 'M', 'L');

-- Create enum for inspection status
CREATE TYPE public.inspection_status AS ENUM ('Open', 'Closed');

-- Create inspections table
CREATE TABLE public.inspections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    inspection_no TEXT NOT NULL,
    items TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    inspection_date DATE,
    risk_level risk_level NOT NULL DEFAULT 'M',
    due_date DATE,
    action_by TEXT NOT NULL,
    status inspection_status NOT NULL DEFAULT 'Open',
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view inspections)
CREATE POLICY "Anyone can view inspections" 
ON public.inspections 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert inspections" 
ON public.inspections 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update inspections" 
ON public.inspections 
FOR UPDATE 
TO authenticated
USING (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete inspections" 
ON public.inspections 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inspections_updated_at
BEFORE UPDATE ON public.inspections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for inspections table
ALTER PUBLICATION supabase_realtime ADD TABLE public.inspections;