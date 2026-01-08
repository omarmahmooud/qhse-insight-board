import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type InsertInspection = Database['public']['Tables']['inspections']['Insert'];

interface AddInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (inspection: InsertInspection) => Promise<any>;
}

export function AddInspectionDialog({ open, onOpenChange, onAdd }: AddInspectionDialogProps) {
  const [formData, setFormData] = useState<InsertInspection>({
    inspection_no: '',
    items: '',
    description: '',
    location: '',
    inspection_date: null,
    risk_level: 'M',
    due_date: null,
    action_by: '',
    status: 'Open',
    remarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await onAdd({
      ...formData,
      inspection_date: formData.inspection_date || null,
      due_date: formData.due_date || null,
    });
    setIsLoading(false);
    
    if (result) {
      setFormData({
        inspection_no: '',
        items: '',
        description: '',
        location: '',
        inspection_date: null,
        risk_level: 'M',
        due_date: null,
        action_by: '',
        status: 'Open',
        remarks: '',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Inspection</DialogTitle>
          <DialogDescription>
            Add a new inspection record to the database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inspection_no">Inspection No *</Label>
              <Input
                id="inspection_no"
                value={formData.inspection_no}
                onChange={(e) => setFormData({ ...formData, inspection_no: e.target.value })}
                placeholder="HSE-0254"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Items *</Label>
              <Input
                id="items"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                placeholder="CGM-01, PRMS, etc."
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the inspection finding..."
              required
              className="bg-background min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Grand Mills, Dana Steel, etc."
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_by">Action By *</Label>
              <Input
                id="action_by"
                value={formData.action_by}
                onChange={(e) => setFormData({ ...formData, action_by: e.target.value })}
                placeholder="Gas Supply, Logistics, etc."
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inspection_date">Inspection Date</Label>
              <Input
                id="inspection_date"
                type="date"
                value={formData.inspection_date || ''}
                onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value || null })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level *</Label>
              <Select
                value={formData.risk_level}
                onValueChange={(value: 'H' | 'M' | 'L') => setFormData({ ...formData, risk_level: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="H">High</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Open' | 'Closed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks || ''}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              className="bg-background"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Inspection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
