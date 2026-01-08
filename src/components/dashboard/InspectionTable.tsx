import { inspectionData, Inspection } from "@/data/qhseData";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const riskBadgeStyles = {
  H: "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30",
  M: "bg-warning/20 text-warning border-warning/30 hover:bg-warning/30",
  L: "bg-success/20 text-success border-success/30 hover:bg-success/30",
};

const riskLabels = {
  H: "High",
  M: "Medium",
  L: "Low",
};

const statusStyles = {
  Open: "bg-warning/20 text-warning border-warning/30",
  Closed: "bg-success/20 text-success border-success/30",
};

export function InspectionTable() {
  // Get the latest 15 inspections
  const recentInspections = [...inspectionData]
    .reverse()
    .slice(0, 15);

  return (
    <div className="stat-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Inspections</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest safety findings and observations</p>
        </div>
        <Badge variant="outline" className="bg-card border-border">
          {inspectionData.length} Total
        </Badge>
      </div>
      
      <ScrollArea className="h-[400px] rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">ID</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Description</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Location</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Risk</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentInspections.map((inspection) => (
              <TableRow 
                key={inspection.id} 
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono text-sm text-primary">
                  {inspection.inspectionNo}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-sm text-foreground truncate" title={inspection.description}>
                    {inspection.description}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {inspection.location}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {inspection.inspectionDate}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs font-medium", riskBadgeStyles[inspection.riskLevel])}
                  >
                    {riskLabels[inspection.riskLevel]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs font-medium", statusStyles[inspection.status])}
                  >
                    {inspection.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
