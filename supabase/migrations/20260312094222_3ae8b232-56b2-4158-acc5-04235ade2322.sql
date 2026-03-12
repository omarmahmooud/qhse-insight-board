-- Change training_type from enum to text to support all training topic names
ALTER TABLE public.trainings ALTER COLUMN training_type TYPE text USING training_type::text;
ALTER TABLE public.trainings ALTER COLUMN training_type SET DEFAULT 'QHSE Induction & General Disciplinary Actions';

-- Drop the old enum type
DROP TYPE IF EXISTS public.training_type;