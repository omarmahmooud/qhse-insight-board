import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';
import { Constants } from '@/integrations/supabase/types';

type Training = Database['public']['Tables']['trainings']['Row'];
type TrainingUpdate = Database['public']['Tables']['trainings']['Update'];

interface EditTrainingDialogProps {
  training: Training | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: TrainingUpdate) => Promise<boolean>;
}

export function EditTrainingDialog({ training, open, onOpenChange, onUpdate }: EditTrainingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TrainingUpdate>({});

  useEffect(() => {
    if (training) {
      setForm({
        trainee_name: training.trainee_name,
        company: training.company,
        position: training.position,
        training_type: training.training_type,
        training_date: training.training_date,
        instructor: training.instructor,
        location: training.location,
        status: training.status,
      });
    }
  }, [training]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!training) return;

    setLoading(true);
    const success = await onUpdate(training.id, form);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  if (!training) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Training Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee_name">Trainee Name</Label>
            <Input
              id="trainee_name"
              value={form.trainee_name || ''}
              onChange={(e) => setForm({ ...form, trainee_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.company || ''}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={form.position || ''}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="training_type">Training Type</Label>
            <Select
              value={form.training_type}
              onValueChange={(value) => setForm({ ...form, training_type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Constants.public.Enums.training_type.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="training_date">Training Date</Label>
            <Input
              id="training_date"
              type="date"
              value={form.training_date || ''}
              onChange={(e) => setForm({ ...form, training_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={form.instructor || ''}
              onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Constants.public.Enums.training_status.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
