import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';
import { Constants } from '@/integrations/supabase/types';

type TrainingInsert = Database['public']['Tables']['trainings']['Insert'];

interface AddTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (training: TrainingInsert) => Promise<boolean>;
}

export function AddTrainingDialog({ open, onOpenChange, onAdd }: AddTrainingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<TrainingInsert>>({
    trainee_name: '',
    company: '',
    position: '',
    training_type: 'HSE Induction',
    training_date: new Date().toISOString().split('T')[0],
    instructor: '',
    location: '',
    status: 'Completed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.trainee_name || !form.company || !form.training_date) return;

    setLoading(true);
    const success = await onAdd(form as TrainingInsert);
    setLoading(false);

    if (success) {
      onOpenChange(false);
      setForm({
        trainee_name: '',
        company: '',
        position: '',
        training_type: 'HSE Induction',
        training_date: new Date().toISOString().split('T')[0],
        instructor: '',
        location: '',
        status: 'Completed',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Training Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee_name">Trainee Name *</Label>
            <Input
              id="trainee_name"
              value={form.trainee_name}
              onChange={(e) => setForm({ ...form, trainee_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
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
            <Label htmlFor="training_date">Training Date *</Label>
            <Input
              id="training_date"
              type="date"
              value={form.training_date}
              onChange={(e) => setForm({ ...form, training_date: e.target.value })}
              required
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
              {loading ? 'Adding...' : 'Add Training'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
