import { useState, useEffect } from 'react';
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

type Inspection = Database['public']['Tables']['inspections']['Row'];
type UpdateInspection = Database['public']['Tables']['inspections']['Update'];

interface EditInspectionDialogProps {
  inspection: Inspection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: UpdateInspection) => Promise<any>;
}

export function EditInspectionDialog({ inspection, open, onOpenChange, onUpdate }: EditInspectionDialogProps) {
  const [formData, setFormData] = useState<UpdateInspection>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inspection) {
      setFormData({
        inspection_no: inspection.inspection_no,
        items: inspection.items,
        description: inspection.description,
        location: inspection.location,
        inspection_date: inspection.inspection_date,
        risk_level: inspection.risk_level,
        due_date: inspection.due_date,
        action_by: inspection.action_by,
        status: inspection.status,
        remarks: inspection.remarks,
      });
    }
  }, [inspection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspection) return;
    
    setIsLoading(true);
    const result = await onUpdate(inspection.id, formData);
    setIsLoading(false);
    
    if (result) {
      onOpenChange(false);
    }
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Inspection</DialogTitle>
          <DialogDescription>
            Update the inspection record details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_inspection_no">Inspection No *</Label>
              <Input
                id="edit_inspection_no"
                value={formData.inspection_no || ''}
                onChange={(e) => setFormData({ ...formData, inspection_no: e.target.value })}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_items">Items *</Label>
              <Input
                id="edit_items"
                value={formData.items || ''}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_description">Description *</Label>
            <Textarea
              id="edit_description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-background min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_location">Location *</Label>
              <Input
                id="edit_location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_action_by">Action By *</Label>
              <Input
                id="edit_action_by"
                value={formData.action_by || ''}
                onChange={(e) => setFormData({ ...formData, action_by: e.target.value })}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_inspection_date">Inspection Date</Label>
              <Input
                id="edit_inspection_date"
                type="date"
                value={formData.inspection_date || ''}
                onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value || null })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_due_date">Due Date</Label>
              <Input
                id="edit_due_date"
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_risk_level">Risk Level *</Label>
              <Select
                value={formData.risk_level || 'M'}
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
              <Label htmlFor="edit_status">Status *</Label>
              <Select
                value={formData.status || 'Open'}
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
            <Label htmlFor="edit_remarks">Remarks</Label>
            <Textarea
              id="edit_remarks"
              value={formData.remarks || ''}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="bg-background"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
