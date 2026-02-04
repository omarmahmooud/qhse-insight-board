// Training requirements based on CEG Training Calendar
// Defines which trainings are required for each role

export type EmployeeRole = 'Driver' | 'Fabricator' | 'CNG Technician' | 'Staff';

export interface TrainingRequirement {
  name: string;
  required: boolean;
  category: 'New Joiner' | 'Refresher' | 'Additional';
}

export const TRAINING_REQUIREMENTS: Record<EmployeeRole, TrainingRequirement[]> = {
  Driver: [
    // New Joiner Trainings
    { name: 'CEG QHSE Induction & Orientation', required: true, category: 'New Joiner' },
    { name: 'Heat Stress', required: true, category: 'New Joiner' },
    { name: 'General Safety Information & Manual Handling', required: true, category: 'New Joiner' },
    { name: 'Basic Inspection & Reporting', required: true, category: 'New Joiner' },
    { name: 'Gas Test & Soap Bubble Test', required: true, category: 'New Joiner' },
    { name: 'Emergency Evacuation Plan & Gas leak Arrest', required: true, category: 'New Joiner' },
    { name: 'Trem Card', required: true, category: 'New Joiner' },
    { name: 'CNG MSDS', required: true, category: 'New Joiner' },
    { name: 'Basic Tire Presentation', required: true, category: 'New Joiner' },
    { name: 'Driving Checklist Presentation', required: true, category: 'New Joiner' },
    { name: 'CEG Driving Policy', required: true, category: 'New Joiner' },
    { name: '5th wheel lock safety', required: true, category: 'New Joiner' },
    { name: 'Changeover Simulation', required: true, category: 'New Joiner' },
    // Refresher Trainings
    { name: 'General Safety Information', required: true, category: 'Refresher' },
  ],
  Fabricator: [
    // New Joiner Trainings
    { name: 'CEG QHSE Induction & Orientation', required: true, category: 'New Joiner' },
    { name: 'Heat Stress', required: true, category: 'New Joiner' },
    { name: 'General Safety Information & Manual Handling', required: true, category: 'New Joiner' },
    { name: 'Basic Inspection & Reporting', required: true, category: 'New Joiner' },
    { name: 'Gas Test & Soap Bubble Test', required: true, category: 'New Joiner' },
    { name: 'Emergency Evacuation Plan & Gas leak Arrest', required: true, category: 'New Joiner' },
    { name: 'CNG MSDS', required: true, category: 'New Joiner' },
    // Refresher Trainings
    { name: 'General Safety Information', required: true, category: 'Refresher' },
  ],
  'CNG Technician': [
    // New Joiner Trainings
    { name: 'CEG QHSE Induction & Orientation', required: true, category: 'New Joiner' },
    { name: 'Heat Stress', required: true, category: 'New Joiner' },
    { name: 'General Safety Information & Manual Handling', required: true, category: 'New Joiner' },
    { name: 'Basic Inspection & Reporting', required: true, category: 'New Joiner' },
    { name: 'Gas Test & Soap Bubble Test', required: true, category: 'New Joiner' },
    { name: 'Emergency Evacuation Plan & Gas leak Arrest', required: true, category: 'New Joiner' },
    { name: 'CNG MSDS', required: true, category: 'New Joiner' },
    { name: 'Changeover Simulation', required: true, category: 'New Joiner' },
    // Refresher Trainings
    { name: 'General Safety Information', required: true, category: 'Refresher' },
  ],
  Staff: [
    // New Joiner Trainings
    { name: 'CEG QHSE Induction & Orientation', required: true, category: 'New Joiner' },
    { name: 'Heat Stress', required: true, category: 'New Joiner' },
    { name: 'General Safety Information & Manual Handling', required: true, category: 'New Joiner' },
    { name: 'Basic Inspection & Reporting', required: true, category: 'New Joiner' },
    { name: 'Emergency Evacuation Plan & Gas leak Arrest', required: true, category: 'New Joiner' },
    { name: 'Office Safety Awareness', required: true, category: 'New Joiner' },
    // Refresher Trainings
    { name: 'General Safety Information', required: true, category: 'Refresher' },
  ],
};

// Additional trainings for all employees
export const ADDITIONAL_TRAININGS: TrainingRequirement[] = [
  { name: 'Permit to Work (General, Hot, Isolation & Excavation)', required: true, category: 'Additional' },
  { name: 'Work at Height (Ladders, Scaffolding, MEWP\'s)', required: true, category: 'Additional' },
  { name: 'LOTO (lock out & Tag out)', required: true, category: 'Additional' },
  { name: 'Defensive Driving', required: true, category: 'Additional' },
  { name: 'Fire Fighting Training', required: true, category: 'Additional' },
  { name: 'Mock Drill', required: true, category: 'Additional' },
  { name: 'Drug & Alcohol in the workplace', required: true, category: 'Additional' },
  { name: 'Heat Stress awareness training (Beat The Heat)', required: true, category: 'Additional' },
];

// Helper to get all required trainings for a role
export function getRequiredTrainings(role: EmployeeRole): TrainingRequirement[] {
  return [...TRAINING_REQUIREMENTS[role], ...ADDITIONAL_TRAININGS];
}

// Helper to detect role from position string
export function detectRoleFromPosition(position: string | null): EmployeeRole | null {
  if (!position) return null;
  const pos = position.toLowerCase();
  
  if (pos.includes('driver')) return 'Driver';
  if (pos.includes('fabricat')) return 'Fabricator';
  if (pos.includes('technician') || pos.includes('cng')) return 'CNG Technician';
  if (pos.includes('staff') || pos.includes('office') || pos.includes('admin') || 
      pos.includes('manager') || pos.includes('engineer') || pos.includes('accountant') ||
      pos.includes('hr') || pos.includes('hse')) return 'Staff';
  
  return null;
}

// Check if company is Cloud Energi (CEG)
export function isCloudEnergiEmployee(company: string): boolean {
  const comp = company.toLowerCase();
  return comp.includes('cloud energi') || 
         comp.includes('cloud energy') || 
         comp.includes('ceg') ||
         comp === 'cloudenergy' ||
         comp === 'cloudenergi';
}

// Check if person is a visitor (based on purpose of visit)
export function isVisitor(remarks: string | null): boolean {
  if (!remarks) return false;
  const r = remarks.toLowerCase();
  return r.includes('visit') || r.includes('contractor') || r.includes('visitor');
}
