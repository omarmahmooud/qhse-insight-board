import { useState } from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Users,
  GraduationCap,
  ShieldAlert,
  Shield,
  Clock,
  Plus,
  LogIn,
  LogOut,
  Database
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { RiskBreakdownCard } from "@/components/dashboard/RiskBreakdownCard";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { LocationBarChart } from "@/components/dashboard/LocationBarChart";
import { TrainingTypeChart } from "@/components/dashboard/TrainingTypeChart";
import { CompanyChart } from "@/components/dashboard/CompanyChart";
import { DatabaseInspectionTable } from "@/components/dashboard/DatabaseInspectionTable";
import { AddInspectionDialog } from "@/components/dashboard/AddInspectionDialog";
import { EditInspectionDialog } from "@/components/dashboard/EditInspectionDialog";
import { ExcelImportDialog } from "@/components/dashboard/ExcelImportDialog";
import { DepartmentInsights } from "@/components/dashboard/DepartmentInsights";
import { Button } from "@/components/ui/button";
import { trainingSummary, statusSummary as staticSummary } from "@/data/qhseData";
import { useInspections } from "@/hooks/useInspections";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import type { Database as DB } from "@/integrations/supabase/types";

type Inspection = DB['public']['Tables']['inspections']['Row'];

const Index = () => {
  const { inspections, loading, summary, addInspection, updateInspection, deleteInspection, refetch } = useInspections();
  const { user, isAuthenticated, signOut } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [excelImportOpen, setExcelImportOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);

  // Use database data if available, otherwise fall back to static
  const displaySummary = inspections.length > 0 ? summary : staticSummary;

  const handleEdit = (inspection: Inspection) => {
    setEditingInspection(inspection);
    setEditDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-border/50 p-6 md:p-8 mb-6 shadow-lg">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                      <ShieldAlert className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      Safety Performance Overview
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                  </div>
                </div>
                <p className="text-muted-foreground text-base md:text-lg ml-[60px] mt-2">
                  Real-time insights from HSE Inspection Tracker & Training Records
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Enhanced Closure Rate Badge */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-success/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-success/15 to-success/5 border border-success/30 shadow-lg backdrop-blur-sm">
                    <div className="relative">
                      <div className="absolute inset-0 bg-success/30 rounded-full blur-sm animate-pulse" />
                      <CheckCircle2 className="relative w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-success/80 uppercase tracking-wider">Closure Rate</p>
                      <p className="text-2xl font-bold text-success">
                        {displaySummary.closureRate}%
                      </p>
                    </div>
                  </div>
                </div>
                
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
                  {inspections.length} records synced • Real-time updates enabled
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
                  Add Inspection
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Inspection Points"
            value={displaySummary.total}
            subtitle="HSE findings recorded"
            icon={ClipboardCheck}
            variant="default"
          />
          <StatCard
            title="Closed Points"
            value={displaySummary.closed}
            subtitle="Successfully resolved"
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Open Points"
            value={displaySummary.open}
            subtitle="Pending action"
            icon={Clock}
            variant={displaySummary.open > 0 ? "warning" : "success"}
          />
          <StatCard
            title="Training Sessions"
            value={trainingSummary.totalSessions}
            subtitle={`${trainingSummary.companies.length} companies trained`}
            icon={GraduationCap}
            variant="default"
          />
        </div>

        {/* Risk Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="High Risk (Open)"
            value={displaySummary.openRiskBreakdown.high}
            subtitle={displaySummary.open > 0 ? `${Math.round((displaySummary.openRiskBreakdown.high / displaySummary.open) * 100)}% of open points` : '0% of open points'}
            icon={ShieldAlert}
            variant="danger"
          />
          <StatCard
            title="Medium Risk (Open)"
            value={displaySummary.openRiskBreakdown.medium}
            subtitle={displaySummary.open > 0 ? `${Math.round((displaySummary.openRiskBreakdown.medium / displaySummary.open) * 100)}% of open points` : '0% of open points'}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Low Risk (Open)"
            value={displaySummary.openRiskBreakdown.low}
            subtitle={displaySummary.open > 0 ? `${Math.round((displaySummary.openRiskBreakdown.low / displaySummary.open) * 100)}% of open points` : '0% of open points'}
            icon={Users}
            variant="success"
          />
        </div>

        {/* Open/Closed Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StatusChart summary={displaySummary} />
          <RiskBreakdownCard summary={displaySummary} />
        </div>

        {/* Department Insights */}
        <div className="mb-6">
          <DepartmentInsights inspections={inspections} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyTrendChart />
          <LocationBarChart />
        </div>

        {/* Training Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TrainingTypeChart />
          <CompanyChart />
        </div>

        {/* Database Inspection Table */}
        <div className="mb-6">
          <DatabaseInspectionTable 
            inspections={inspections}
            loading={loading}
            onEdit={handleEdit}
            onDelete={deleteInspection}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Summary Banner */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-warning/10 via-primary/5 to-success/10 border border-warning/30 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/20">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Safety Status Summary</h3>
                <p className="text-muted-foreground">
                  {displaySummary.closed} of {displaySummary.total} inspection points closed ({displaySummary.closureRate}% closure rate). 
                  {displaySummary.open} points require action. {trainingSummary.totalSessions} training sessions conducted.
                </p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-success">{displaySummary.closed}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Closed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">{displaySummary.open}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Open</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            CEG QHSE Dashboard • Data from Lovable Cloud Database • December 2025
          </p>
        </footer>
      </main>

      {/* Dialogs */}
      <AddInspectionDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAdd={addInspection}
      />
      <EditInspectionDialog
        inspection={editingInspection}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={updateInspection}
      />
      <ExcelImportDialog
        open={excelImportOpen}
        onOpenChange={setExcelImportOpen}
        onImportComplete={refetch}
      />
    </div>
  );
};

export default Index;