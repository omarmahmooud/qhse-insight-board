// Training requirements based on CEG QHSE Internal Training Matrix 2026

export type EmployeeRole = 
  | 'Managers'
  | 'Engineers & Officers'
  | 'Office Staff'
  | 'Drivers & Asst. Drivers'
  | 'Mechanics & Helpers'
  | 'Welders, Fabricators & Helpers'
  | 'Technician & CNG Operators'
  | 'Interns';

export type OutsiderCategory = 'Contractors' | 'Suppliers' | 'Visitors' | 'VIP';

// All internal training topics from the matrix
export const INTERNAL_TRAINING_TOPICS = [
  'QHSE Induction & General Disciplinary Actions',
  'General Safety information & Basic Inspection',
  'TREM card',
  'CNG MSDS',
  'Basic Tires Safety',
  'Gas Detector & Soap Test Procedure',
  'Gas leak arrest & Emergency Evacuation',
  'CEG Drivers Checklist',
  'CEG Driving Policy',
  '5th wheel safety & Practical',
  'Changeover Simulation',
  'Office Safety',
  'Manual handling & Heat Stress',
] as const;

// Sessional training topics
export const SESSIONAL_TRAINING_TOPICS = [
  'QHSE M.S Safety Orientation',
  'PTW System',
  'LOTO - Lock Out Tag Out',
  'Driver Safety Guidelines & Training awareness',
  '10 Golden Saving Life Rules',
  'Emergency preparedness & Response duties & Responsibilities',
  'Defensive Driving',
] as const;

// Combined list for dropdowns
export const ALL_TRAINING_TOPICS = [
  ...INTERNAL_TRAINING_TOPICS,
  ...SESSIONAL_TRAINING_TOPICS,
  'Other',
] as const;

// Outsider-only training (only QHSE M.S Safety Orientation)
export const OUTSIDER_TRAINING = 'QHSE M.S Safety Orientation';

// Training requirements per internal role
export const TRAINING_REQUIREMENTS: Record<EmployeeRole, string[]> = {
  'Managers': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Office Safety',
    'Manual handling & Heat Stress',
  ],
  'Engineers & Officers': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Gas Detector & Soap Test Procedure',
    'Gas leak arrest & Emergency Evacuation',
    'Office Safety',
    'Manual handling & Heat Stress',
  ],
  'Office Staff': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Office Safety',
    'Manual handling & Heat Stress',
  ],
  'Drivers & Asst. Drivers': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'TREM card',
    'CNG MSDS',
    'Basic Tires Safety',
    'Gas Detector & Soap Test Procedure',
    'Gas leak arrest & Emergency Evacuation',
    'CEG Drivers Checklist',
    'CEG Driving Policy',
    '5th wheel safety & Practical',
    'Changeover Simulation',
    'Manual handling & Heat Stress',
  ],
  'Mechanics & Helpers': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Basic Tires Safety',
    'Gas Detector & Soap Test Procedure',
    'Gas leak arrest & Emergency Evacuation',
    'Manual handling & Heat Stress',
  ],
  'Welders, Fabricators & Helpers': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Gas Detector & Soap Test Procedure',
    'Gas leak arrest & Emergency Evacuation',
    'Manual handling & Heat Stress',
  ],
  'Technician & CNG Operators': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Gas Detector & Soap Test Procedure',
    'Gas leak arrest & Emergency Evacuation',
    'Changeover Simulation',
    'Manual handling & Heat Stress',
  ],
  'Interns': [
    'QHSE Induction & General Disciplinary Actions',
    'General Safety information & Basic Inspection',
    'CNG MSDS',
    'Office Safety',
    'Manual handling & Heat Stress',
  ],
};

// Sessional trainings required for all CEG employees
export const CEG_SESSIONAL_TRAININGS = [
  'PTW System',
  'LOTO - Lock Out Tag Out',
  'Driver Safety Guidelines & Training awareness',
  '10 Golden Saving Life Rules',
  'Emergency preparedness & Response duties & Responsibilities',
  'Defensive Driving',
];

// Outsider requirements (only orientation)
export const OUTSIDER_REQUIREMENTS: Record<OutsiderCategory, string[]> = {
  'Contractors': ['QHSE M.S Safety Orientation'],
  'Suppliers': ['QHSE M.S Safety Orientation'],
  'Visitors': ['QHSE M.S Safety Orientation'],
  'VIP': ['QHSE M.S Safety Orientation'],
};

// Get all required trainings for a role (internal + sessional)
export function getRequiredTrainings(role: EmployeeRole): string[] {
  return [...TRAINING_REQUIREMENTS[role], ...CEG_SESSIONAL_TRAININGS];
}

// Detect role from position string
export function detectRoleFromPosition(position: string | null): EmployeeRole | null {
  if (!position) return null;
  const pos = position.toLowerCase();

  if (pos.includes('manager') || pos.includes('director') || pos.includes('ceo') || pos.includes('gm')) return 'Managers';
  if (pos.includes('engineer') || pos.includes('officer') || pos.includes('supervisor') || pos.includes('hse')) return 'Engineers & Officers';
  if (pos.includes('driver')) return 'Drivers & Asst. Drivers';
  if (pos.includes('mechanic') || pos.includes('helper')) return 'Mechanics & Helpers';
  if (pos.includes('welder') || pos.includes('fabricat')) return 'Welders, Fabricators & Helpers';
  if (pos.includes('technician') || pos.includes('cng') || pos.includes('operator')) return 'Technician & CNG Operators';
  if (pos.includes('intern') || pos.includes('trainee')) return 'Interns';
  if (pos.includes('staff') || pos.includes('office') || pos.includes('admin') || 
      pos.includes('accountant') || pos.includes('hr') || pos.includes('clerk') ||
      pos.includes('secretary') || pos.includes('receptionist')) return 'Office Staff';

  return null;
}

// Classify a person as employee or outsider based on their training types
// If they have any internal training topics, they're an employee
// If they only have outsider trainings (QHSE M.S Safety Orientation), they're outsiders
export function isEmployee(trainingTypes: string[]): boolean {
  const internalTopics = new Set([
    ...INTERNAL_TRAINING_TOPICS,
    ...CEG_SESSIONAL_TRAININGS.filter(t => t !== OUTSIDER_TRAINING),
  ]);
  
  return trainingTypes.some(t => {
    const tLower = t.toLowerCase();
    return Array.from(internalTopics).some(topic => 
      tLower.includes(topic.toLowerCase().substring(0, 15)) || 
      topic.toLowerCase().includes(tLower.substring(0, 15))
    );
  });
}

// Check if a training type is an outsider-only training
export function isOutsiderTraining(trainingType: string): boolean {
  return trainingType.toLowerCase().includes('orientation') || 
         trainingType.toLowerCase() === OUTSIDER_TRAINING.toLowerCase();
}

// Legacy compatibility
export function isCloudEnergiEmployee(company: string): boolean {
  const comp = company.toLowerCase();
  return comp.includes('cloud energi') || 
         comp.includes('cloud energy') || 
         comp.includes('ceg') ||
         comp === 'cloudenergy' ||
         comp === 'cloudenergi';
}
