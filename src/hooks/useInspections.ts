import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Inspection = Database['public']['Tables']['inspections']['Row'];
type InsertInspection = Database['public']['Tables']['inspections']['Insert'];
type UpdateInspection = Database['public']['Tables']['inspections']['Update'];

export function useInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInspections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inspections:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inspections',
        variant: 'destructive',
      });
    } else {
      setInspections(data || []);
    }
    setLoading(false);
  };

  const addInspection = async (inspection: InsertInspection) => {
    const { data, error } = await supabase
      .from('inspections')
      .insert(inspection)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding inspection:', error);
      toast({
        title: 'Error',
        description: 'Failed to add inspection. Make sure you are logged in.',
        variant: 'destructive',
      });
      return null;
    }
    
    toast({
      title: 'Success',
      description: 'Inspection added successfully',
    });
    return data;
  };

  const updateInspection = async (id: string, updates: UpdateInspection) => {
    const { data, error } = await supabase
      .from('inspections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating inspection:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inspection. Make sure you are logged in.',
        variant: 'destructive',
      });
      return null;
    }
    
    toast({
      title: 'Success',
      description: 'Inspection updated successfully',
    });
    return data;
  };

  const deleteInspection = async (id: string) => {
    const { error } = await supabase
      .from('inspections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting inspection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete inspection. Make sure you are logged in.',
        variant: 'destructive',
      });
      return false;
    }
    
    toast({
      title: 'Success',
      description: 'Inspection deleted successfully',
    });
    return true;
  };

  // Set up realtime subscription
  useEffect(() => {
    fetchInspections();

    const channel = supabase
      .channel('inspections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inspections',
        },
        () => {
          fetchInspections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate summary stats
  const summary = {
    total: inspections.length,
    closed: inspections.filter(i => i.status === 'Closed').length,
    open: inspections.filter(i => i.status === 'Open').length,
    closureRate: inspections.length > 0 
      ? Math.round((inspections.filter(i => i.status === 'Closed').length / inspections.length) * 100) 
      : 0,
    openRiskBreakdown: {
      high: inspections.filter(i => i.status === 'Open' && i.risk_level === 'H').length,
      medium: inspections.filter(i => i.status === 'Open' && i.risk_level === 'M').length,
      low: inspections.filter(i => i.status === 'Open' && i.risk_level === 'L').length,
    },
    closedRiskBreakdown: {
      high: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'H').length,
      medium: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'M').length,
      low: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'L').length,
    },
    totalRiskBreakdown: {
      high: inspections.filter(i => i.risk_level === 'H').length,
      medium: inspections.filter(i => i.risk_level === 'M').length,
      low: inspections.filter(i => i.risk_level === 'L').length,
    },
  };

  return {
    inspections,
    loading,
    summary,
    addInspection,
    updateInspection,
    deleteInspection,
    refetch: fetchInspections,
  };
}
