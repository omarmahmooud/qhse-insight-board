import { useState } from 'react';
import { 
  GraduationCap,
  CheckCircle2,
  Clock,
  Plus,
  LogIn,
  LogOut,
  Database,
  Users,
  Building2
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrainingTable } from "@/components/dashboard/TrainingTable";
import { AddTrainingDialog } from "@/components/dashboard/AddTrainingDialog";
import { EditTrainingDialog } from "@/components/dashboard/EditTrainingDialog";
import { TrainingExcelImportDialog } from "@/components/dashboard/TrainingExcelImportDialog";
import { TraineeByTypeChart } from "@/components/dashboard/TraineeByTypeChart";
import { TraineeByCompanyChart } from "@/components/dashboard/TraineeByCompanyChart";
import { Button } from "@/components/ui/button";
import { useTrainings } from "@/hooks/useTrainings";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import type { Database as DB } from "@/integrations/supabase/types";

type Training = DB['public']['Tables']['trainings']['Row'];

const Index = () => {
  const { trainings, loading, summary, addTraining, addTrainings, updateTraining, deleteTraining, refetch } = useTrainings();
  const { user, isAuthenticated, signOut } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [excelImportOpen, setExcelImportOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setEditDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const uniqueCompanies = Object.keys(summary.byCompany).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-border/50 p-6 md:p-8 mb-6 shadow-lg">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                      <GraduationCap className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                      QHSE Training Dashboard
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                  </div>
                </div>
                <p className="text-muted-foreground text-base md:text-lg ml-[60px] mt-2">
                  Track and manage HSE inductions and training records
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Database Connected Banner */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Connected to Lovable Cloud
                </p>
                <p className="text-xs text-muted-foreground">
                  {trainings.length} training records synced • Real-time updates enabled
                </p>
              </div>
            </div>
            {isAuthenticated && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setExcelImportOpen(true)}>
                  <Database className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Training
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Trainings"
            value={summary.total}
            subtitle="Training records"
            icon={GraduationCap}
            variant="default"
          />
          <StatCard
            title="Completed"
            value={summary.completed}
            subtitle="Successfully completed"
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Scheduled"
            value={summary.scheduled}
            subtitle="Upcoming sessions"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Companies"
            value={uniqueCompanies}
            subtitle="Organizations trained"
            icon={Building2}
            variant="default"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TraineeByTypeChart data={summary.byType} />
          <TraineeByCompanyChart data={summary.byCompany} />
        </div>

        {/* Training Table */}
        <div className="mb-6">
          <TrainingTable 
            trainings={trainings}
            loading={loading}
            onEdit={handleEdit}
            onDelete={deleteTraining}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            CEG QHSE Training Dashboard • Data from Lovable Cloud Database
          </p>
        </footer>
      </main>

      {/* Dialogs */}
      <AddTrainingDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAdd={addTraining}
      />
      <EditTrainingDialog
        training={editingTraining}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={updateTraining}
      />
      <TrainingExcelImportDialog
        open={excelImportOpen}
        onOpenChange={setExcelImportOpen}
        onImport={addTrainings}
      />
    </div>
  );
};

export default Index;
