import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Training = Database['public']['Tables']['trainings']['Row'];
type TrainingInsert = Database['public']['Tables']['trainings']['Insert'];
type TrainingUpdate = Database['public']['Tables']['trainings']['Update'];

export interface TrainingSummary {
  total: number;
  completed: number;
  scheduled: number;
  inProgress: number;
  cancelled: number;
  expired: number;
  byType: Record<string, number>;
  byCompany: Record<string, number>;
}

export function useTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trainings')
      .select('*')
      .order('training_date', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching trainings',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setTrainings(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTrainings();

    // Set up realtime subscription
    const channel = supabase
      .channel('trainings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trainings' },
        () => {
          fetchTrainings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTrainings]);

  const addTraining = async (training: TrainingInsert) => {
    const { error } = await supabase.from('trainings').insert(training);
    if (error) {
      toast({
        title: 'Error adding training',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    toast({ title: 'Training added successfully' });
    return true;
  };

  const addTrainings = async (trainingsToAdd: TrainingInsert[]) => {
    const { error } = await supabase.from('trainings').insert(trainingsToAdd);
    if (error) {
      toast({
        title: 'Error importing trainings',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    toast({ title: `${trainingsToAdd.length} trainings imported successfully` });
    return true;
  };

  const updateTraining = async (id: string, updates: TrainingUpdate) => {
    const { error } = await supabase
      .from('trainings')
      .update(updates)
      .eq('id', id);
    if (error) {
      toast({
        title: 'Error updating training',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    toast({ title: 'Training updated successfully' });
    return true;
  };

  const deleteTraining = async (id: string) => {
    const { error } = await supabase.from('trainings').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting training',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    toast({ title: 'Training deleted successfully' });
    return true;
  };

  const summary: TrainingSummary = {
    total: trainings.length,
    completed: trainings.filter((t) => t.status === 'Completed').length,
    scheduled: trainings.filter((t) => t.status === 'Scheduled').length,
    inProgress: trainings.filter((t) => t.status === 'In Progress').length,
    cancelled: trainings.filter((t) => t.status === 'Cancelled').length,
    expired: trainings.filter((t) => t.status === 'Expired').length,
    byType: trainings.reduce((acc, t) => {
      acc[t.training_type] = (acc[t.training_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCompany: trainings.reduce((acc, t) => {
      acc[t.company] = (acc[t.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    trainings,
    loading,
    summary,
    addTraining,
    addTrainings,
    updateTraining,
    deleteTraining,
    refetch: fetchTrainings,
  };
}
