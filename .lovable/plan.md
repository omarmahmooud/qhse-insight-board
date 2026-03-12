

## Problem Analysis

The user wants two key changes:

1. **Update training requirements** based on the new matrix they uploaded (`CEG_QHSE_Internal_Training_Matrix_2026.xlsx`) which has more roles (Managers, Engineers & Officers, Office Staff, Drivers & Asst. Drivers, Mechanics & Helpers, Welders/Fabricators & Helpers, Technician & CNG Operators, Interns) plus sessional trainings and outsider categories (Contractors, Suppliers, Visitors, VIP).

2. **Classification by training type, not company** — Currently, the system uses `isCloudEnergiEmployee(company)` to decide if someone is an employee or outsider. The user wants this based on **training type** instead. Looking at the matrix, the training type column in the Excel data is "HSE Induction" (the `training_type` enum). The real distinction should be based on the **training topic** the person received — the matrix shows that outsiders (Contractors, Suppliers, Visitors, VIP) only get "QHSE M.S Safety Orientation", while CEG employees get the full internal training matrix.

Additionally, the current `training_type` enum is too limited. It doesn't reflect the actual training topics from the matrix. We need to either expand the enum or change `training_type` to a text field to accommodate all training topics.

## Plan

### 1. Update database — change `training_type` from enum to text
The current enum only has 10 values that don't match the real training topics. Change to a text column so any training topic name can be stored directly.

- Migration: ALTER the `training_type` column from enum to text to support all training names from the matrix.

### 2. Update `src/data/trainingRequirements.ts`
Rewrite with the new matrix data:
- **Internal roles**: Managers, Engineers & Officers, Office Staff, Drivers & Asst. Drivers, Mechanics & Helpers, Welders/Fabricators & Helpers, Technician & CNG Operators, Interns
- **Each role's required trainings** from the matrix (both regular and sessional)
- **Outsider categories**: Contractors, Suppliers, Visitors, VIP — only need "QHSE M.S Safety Orientation"
- **Classification logic**: Instead of checking company name, define which training types are "internal-only" vs "outsider". If a person has only outsider trainings (e.g., QHSE M.S Safety Orientation), they're classified as outsider. If they have internal trainings, they're employees.

### 3. Update `src/components/dashboard/EmployeeTrainingStatus.tsx`
- Remove `isCloudEnergiEmployee` company check
- Use training-type-based classification: if person has any internal training topics, show them as employee
- Match against new role definitions from updated matrix

### 4. Update `src/components/dashboard/VisitorTrainingSummary.tsx`
- Remove company-based filtering
- Classify as visitor based on training types (only has outsider-level trainings like QHSE orientation)

### 5. Update `src/pages/Index.tsx`
- Update stat card calculations to use training-type-based classification instead of `isCloudEnergiEmployee`

### 6. Update `src/components/dashboard/TrainingExcelImportDialog.tsx`
- Remove the enum mapping logic for `training_type` — store the raw training topic name directly since it's now a text field
- Better column detection for "Training Type" or use the training topic names from the sheet

### 7. Update `src/components/dashboard/AddTrainingDialog.tsx` and `EditTrainingDialog.tsx`
- Update training type dropdown to show all training topics from the matrix instead of the old enum values

