import { useState } from 'react';
import { ChartCard } from './ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Inspection = Database['public']['Tables']['inspections']['Row'];

interface DatabaseInspectionTableProps {
  inspections: Inspection[];
  loading: boolean;
  onEdit: (inspection: Inspection) => void;
  onDelete: (id: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

export function DatabaseInspectionTable({ 
  inspections, 
  loading, 
  onEdit, 
  onDelete,
  isAuthenticated 
}: DatabaseInspectionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'H':
        return <Badge variant="destructive">High</Badge>;
      case 'M':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'L':
        return <Badge className="bg-success text-success-foreground">Low</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Closed' ? (
      <Badge className="bg-success/20 text-success border border-success/30">Closed</Badge>
    ) : (
      <Badge className="bg-warning/20 text-warning border border-warning/30">Open</Badge>
    );
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  if (loading) {
    return (
      <ChartCard title="Inspection Records" subtitle="Loading from database...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Inspection Records" 
      subtitle={`${inspections.length} records from database • Real-time updates enabled`}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Inspection No</TableHead>
              <TableHead className="text-muted-foreground">Items</TableHead>
              <TableHead className="text-muted-foreground max-w-[250px]">Description</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Risk</TableHead>
              <TableHead className="text-muted-foreground">Action By</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              {isAuthenticated && (
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAuthenticated ? 9 : 8} className="text-center py-8 text-muted-foreground">
                  No inspection records found. Add your first inspection above.
                </TableCell>
              </TableRow>
            ) : (
              inspections.slice(0, 20).map((inspection) => (
                <TableRow key={inspection.id} className="border-border/30">
                  <TableCell className="font-mono text-sm text-primary">
                    {inspection.inspection_no}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {inspection.items}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                    {inspection.description}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {inspection.location}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(inspection.inspection_date)}
                  </TableCell>
                  <TableCell>
                    {getRiskBadge(inspection.risk_level)}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {inspection.action_by}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(inspection.status)}
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(inspection)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(inspection.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {inspections.length > 20 && (
          <p className="text-sm text-muted-foreground text-center py-3 border-t border-border/30">
            Showing 20 of {inspections.length} records
          </p>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inspection record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ChartCard>
  );
}
