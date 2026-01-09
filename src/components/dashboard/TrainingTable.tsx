import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Search, GraduationCap } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type Training = Database['public']['Tables']['trainings']['Row'];

interface TrainingTableProps {
  trainings: Training[];
  loading: boolean;
  onEdit: (training: Training) => void;
  onDelete: (id: string) => void;
  isAuthenticated: boolean;
}

export function TrainingTable({ trainings, loading, onEdit, onDelete, isAuthenticated }: TrainingTableProps) {
  const [search, setSearch] = useState('');

  const filteredTrainings = trainings.filter((t) =>
    t.trainee_name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase()) ||
    t.training_type.toLowerCase().includes(search.toLowerCase()) ||
    (t.instructor?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success/10 text-success border-success/30';
      case 'Scheduled': return 'bg-primary/10 text-primary border-primary/30';
      case 'In Progress': return 'bg-warning/10 text-warning border-warning/30';
      case 'Cancelled': return 'bg-muted text-muted-foreground border-border';
      case 'Expired': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Training Records
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search trainings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredTrainings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {search ? 'No trainings match your search' : 'No training records found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Training Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  {isAuthenticated && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.trainee_name}</TableCell>
                    <TableCell>{training.company}</TableCell>
                    <TableCell>{training.position || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{training.training_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(training.training_date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{training.instructor || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                    </TableCell>
                    {isAuthenticated && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(training)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(training.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
