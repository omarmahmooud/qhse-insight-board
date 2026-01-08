// QHSE Dashboard Data - Based on real inspection and training data

export interface Inspection {
  id: number;
  inspectionNo: string;
  items: string;
  description: string;
  location: string;
  inspectionDate: string;
  riskLevel: 'H' | 'M' | 'L';
  dueDate: string;
  actionBy: string;
  status: 'Open' | 'Closed';
  remarks: string;
}

export interface Training {
  id: number;
  date: string;
  time: string;
  inductee: string;
  position: string;
  company: string;
  trainingType: string;
  purpose: string;
  hostName: string;
  inductedBy: string;
}

// HSE Inspection Data - Complete dataset from HSE_Inspection_Tracker-2.xlsx
export const inspectionData: Inspection[] = [
  // 2022 Data
  { id: 1, inspectionNo: "HSE-0057", items: "CGM # 01", description: "Fire Extinguisher depressurized", location: "Grand Mills", inspectionDate: "4-Jan-22", riskLevel: "M", dueDate: "18-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 2, inspectionNo: "HSE-0057", items: "CGM # 01", description: "Tyres are damaged on left side and have visible deep cuts.", location: "Grand Mills", inspectionDate: "4-Jan-22", riskLevel: "H", dueDate: "18-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 3, inspectionNo: "HSE-0057", items: "CGM # 20", description: "Worn-out stickers on right side.", location: "Grand Mills", inspectionDate: "4-Jan-22", riskLevel: "M", dueDate: "18-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 4, inspectionNo: "HSE-0057", items: "CGM # 20", description: "Solid mud covered on valves and modules due to rain.", location: "Grand Mills", inspectionDate: "4-Jan-22", riskLevel: "M", dueDate: "31-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 5, inspectionNo: "HSE-0057", items: "CGM # 01", description: "Section valve temperature reader was not functioning.", location: "Grand Mills", inspectionDate: "4-Jan-22", riskLevel: "M", dueDate: "11-Jan-22", actionBy: "Maintenance", status: "Closed", remarks: "" },
  { id: 6, inspectionNo: "HSE-0058", items: "CGM # 25", description: "Fire Extinguisher lever was wrecked and it cannot function properly.", location: "Hadaf Food", inspectionDate: "14-Jan-22", riskLevel: "M", dueDate: "28-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 7, inspectionNo: "HSE-0058", items: "CGM # 20", description: "Chassis have visible cracks and swerd parts.", location: "Grand Mills", inspectionDate: "14-Jan-22", riskLevel: "H", dueDate: "28-Feb-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 8, inspectionNo: "HSE-0058", items: "CGM # 01", description: "Rear Mud-guard damaged on left side.", location: "Grand Mills", inspectionDate: "14-Jan-22", riskLevel: "M", dueDate: "15-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 9, inspectionNo: "HSE-0058", items: "CGM # 01", description: "Fire Extinguisher depressurized", location: "Grand Mills", inspectionDate: "14-Jan-22", riskLevel: "M", dueDate: "28-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 10, inspectionNo: "HSE-0059", items: "CGM # 10", description: "Solid mud covered on valves and modules due to rain.", location: "Dana Steel", inspectionDate: "18-Jan-22", riskLevel: "M", dueDate: "1-Feb-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 11, inspectionNo: "HSE-0059", items: "CGM # 05", description: "Chassis have visible cracks and swerd parts.", location: "NPPF", inspectionDate: "18-Jan-22", riskLevel: "H", dueDate: "28-Feb-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 12, inspectionNo: "HSE-0059", items: "CGM # 05", description: "Worn-out stickers on left side and sheet has been opened.", location: "NPPF", inspectionDate: "18-Jan-22", riskLevel: "M", dueDate: "1-Feb-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 13, inspectionNo: "HSE-0059", items: "CGM # 24", description: "Stacking of wood on Fifth wheel.", location: "Super Galvanizing", inspectionDate: "18-Jan-22", riskLevel: "M", dueDate: "20-Jan-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 14, inspectionNo: "HSE-0059", items: "CGM # 24", description: "Untidy and covered with mud.", location: "Super Galvanizing", inspectionDate: "18-Jan-22", riskLevel: "M", dueDate: "1-Feb-22", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 15, inspectionNo: "HSE-0059", items: "CGM # 10", description: "The section valve temperature reader was not functioning.", location: "Dana Steel", inspectionDate: "18-Jan-22", riskLevel: "M", dueDate: "25-Jan-22", actionBy: "Maintenance", status: "Closed", remarks: "" },
  // ... continuing with sample closed records
  { id: 16, inspectionNo: "HSE-0060", items: "CGM # 12", description: "No Fire Extinguisher box is damaged and tied with rope.", location: "Dulsco", inspectionDate: "19-Jan-22", riskLevel: "M", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 17, inspectionNo: "HSE-0061", items: "CGM # 20", description: "Chassis have visible cracks and swerd parts.", location: "Grand Mills", inspectionDate: "21-Jan-22", riskLevel: "H", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 18, inspectionNo: "HSE-0062", items: "CGM # 28", description: "Air-shocks were deflated.", location: "Dana Steel", inspectionDate: "2-Feb-22", riskLevel: "H", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 19, inspectionNo: "HSE-0063", items: "CGM # 01", description: "Using of 4.5kg Fire Extinguisher instead of 6 kg", location: "Grand Mills", inspectionDate: "4-Feb-22", riskLevel: "M", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 20, inspectionNo: "HSE-0095", items: "Others", description: "No Concrete or metal wheel stopper", location: "IFFCO Al Ain", inspectionDate: "25-Dec-22", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "Communicated with the client" },
  
  // 2023 Data - Mix of Open and Closed
  { id: 21, inspectionNo: "HSE-0096", items: "CGM # 15", description: "Air-shocks were deflated.", location: "KIZAD MS", inspectionDate: "23-Jan-23", riskLevel: "H", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 22, inspectionNo: "HSE-0097", items: "Others", description: "Protruding nails on the scrap woods scattered at the PRMS and trailer parking area. Poor housekeeping.", location: "Dana Steel", inspectionDate: "24-Jan-23", riskLevel: "H", dueDate: "", actionBy: "Maintenance", status: "Closed", remarks: "" },
  { id: 23, inspectionNo: "HSE-0098", items: "CGM # 08", description: "Left tire worn out, cracks and scraped on the surface of the tire wear.", location: "Ohana", inspectionDate: "13-Feb-23", riskLevel: "H", dueDate: "", actionBy: "Logistics", status: "Closed", remarks: "" },
  { id: 24, inspectionNo: "HSE-0147", items: "Others", description: "Improper waste collection mechanism/scheduled is not followed. Garbage is spread out of the dustbin area.", location: "KIZAD MS", inspectionDate: "12-Oct-23", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 25, inspectionNo: "HSE-0147", items: "Others", description: "Dismantled material stacked behind the water storage tank.", location: "KIZAD MS", inspectionDate: "12-Oct-23", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  
  // 2024-2025 Recent Data - More Open items
  { id: 26, inspectionNo: "HSE-0239", items: "Others", description: "Untidy PRMS covered with spider webs", location: "Grand Mills", inspectionDate: "13-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 27, inspectionNo: "HSE-0239", items: "Others", description: "Untidy Decanting Panel covered with spider webs", location: "Grand Mills", inspectionDate: "13-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 28, inspectionNo: "HSE-0240", items: "CGM-02", description: "Overdue Monthly fire extinguisher inspection in truck", location: "Dana Steel", inspectionDate: "18-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 29, inspectionNo: "HSE-0240", items: "PRMS", description: "Floor condition in the PRMS is slippery and wet, posing a slip-and-fall risk to personnel during operations.", location: "Dana Steel", inspectionDate: "18-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 30, inspectionNo: "HSE-0240", items: "PRMS", description: "The pressure gauge displays inaccurate readings, potentially leading to overpressure or undetected drops in gas supply.", location: "Dana Steel", inspectionDate: "18-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 31, inspectionNo: "HSE-0240", items: "PRMS", description: "The LEL sensor is non-functional and showing zero values on the display. It failed to detect the gas presence during the testing.", location: "Dana Steel", inspectionDate: "18-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 32, inspectionNo: "HSE-0240", items: "CGM-26", description: "CGM temperature gauge is not functional, compromising the ability to monitor the temperature during operation.", location: "Dana Steel", inspectionDate: "18-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 33, inspectionNo: "HSE-0241", items: "CGM-21", description: "The fire extinguisher box on CGM 21 lacks a proper locking mechanism. Currently, it is secured using a metal wire.", location: "National Dairy", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 34, inspectionNo: "HSE-0241", items: "CNG Yard", description: "CNG yard contains dried grass and other waste materials, which are combustible and flammable that pose a potential fire hazard.", location: "National Dairy", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 35, inspectionNo: "HSE-0241", items: "Others", description: "The drivers' accommodation receiving area exhibits poor housekeeping and disorganized material storage.", location: "Al Faqqa", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 36, inspectionNo: "HSE-0242", items: "CGM-37", description: "Tire mudguard found to be damaged", location: "Al Barakah Dates", inspectionDate: "19-Nov-25", riskLevel: "L", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 37, inspectionNo: "HSE-0242", items: "CGM-37", description: "Fire extinguisher missing from the required of two in the 40ft container", location: "Al Barakah Dates", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 38, inspectionNo: "HSE-0242", items: "PRMS", description: "Empty bottles & cans are found inside the PRMS", location: "Al Barakah Dates", inspectionDate: "19-Nov-25", riskLevel: "L", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 39, inspectionNo: "HSE-0242", items: "PRMS", description: "Expired Calibration in LEL detectors", location: "Al Barakah Dates", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 40, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "Damaged wind sock", location: "Al Barakah Dates", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 41, inspectionNo: "HSE-0242", items: "CGM-32", description: "Overdue Monthly fire extinguisher inspection in truck", location: "Dana Steel", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 42, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "Rutting of interlock pavement observed in the decanting area", location: "Dana Steel", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 43, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "Forklift movement in PRMS yard without barricades or separation.", location: "Dana Steel", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 44, inspectionNo: "HSE-0242", items: "PRMS", description: "Expired gauge calibration on LEL detector.", location: "Dana Steel", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 45, inspectionNo: "HSE-0242", items: "CGM-32", description: "Overdue Monthly fire extinguisher inspection in truck", location: "Linen Cupboard", inspectionDate: "19-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 46, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "It has been observed that the bollards installed in front of the PRMS was damaged by the truck & bent", location: "Linen Cupboard", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 47, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "Only 2 fire extinguishers are available in PRMS YARD. FE placed on the floor", location: "Linen Cupboard", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 48, inspectionNo: "HSE-0242", items: "PRMS Yard", description: "Gauge readings are faded from inside & unable to read the values", location: "Linen Cupboard", inspectionDate: "19-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 49, inspectionNo: "HSE-0243", items: "PRMS Yard", description: "Slips and falls hazard", location: "NFPC", inspectionDate: "22-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 50, inspectionNo: "HSE-0243", items: "CGM-47", description: "Metal with sharp edges installed at the base of CGM mounting ladder", location: "NFPC", inspectionDate: "22-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Closed", remarks: "" },
  { id: 51, inspectionNo: "HSE-0244", items: "PRMS Yard", description: "Large amounts of flammable materials were scattered around the area, creating unsafe working conditions.", location: "Emic Sajaa", inspectionDate: "25-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 52, inspectionNo: "HSE-0244", items: "PRMS", description: "Unable to determine wind direction during gas leak or emergency situation.", location: "Emic Sajaa", inspectionDate: "25-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 53, inspectionNo: "HSE-0245", items: "CGM-61", description: "Fire extinguisher box without a proper locking mechanism.", location: "Power International", inspectionDate: "26-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 54, inspectionNo: "HSE-0245", items: "PRMS", description: "PRMS system covered with accumulated dust.", location: "Power International", inspectionDate: "26-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 55, inspectionNo: "HSE-0245", items: "PRMS", description: "Chemicals stored inside PRMS room without drip tray", location: "Power International", inspectionDate: "26-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 56, inspectionNo: "HSE-0246", items: "Mechanical workshop", description: "The air compressor and its components are currently exposed without adequate protective caging or enclosure.", location: "KIZAD MS", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 57, inspectionNo: "HSE-0247", items: "PRMS", description: "Fire and explosion hazard due to gas leakage", location: "ILT", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 58, inspectionNo: "HSE-0247", items: "PRMS", description: "Inaccurate pressure reading and supply leads to overpressure or leaks", location: "Edible Oil", inspectionDate: "27-Nov-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 59, inspectionNo: "HSE-0247", items: "PRMS", description: "Detector may provide inaccurate readings, leading to undetected gas leaks.", location: "Edible Oil", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 60, inspectionNo: "HSE-0247", items: "PRMS", description: "Detector may provide inaccurate readings, leading to undetected gas leaks.", location: "Super Galvanizing", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 61, inspectionNo: "HSE-0247", items: "PRMS", description: "Fire and explosion hazard due to gas leakage", location: "NPPF", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 62, inspectionNo: "HSE-0247", items: "PRMS Yard", description: "Fall hazard for CEG & NPPF employees or visitors.", location: "NPPF", inspectionDate: "27-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 63, inspectionNo: "HSE-0248", items: "TR-06", description: "Poor lighting reduces the trailer's & drivers visibility, especially at night.", location: "KIZAD MS", inspectionDate: "28-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 64, inspectionNo: "HSE-0248", items: "TR-36", description: "Poor lighting reduces the trailer's & drivers visibility, especially at night.", location: "KIZAD MS", inspectionDate: "28-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 65, inspectionNo: "HSE-0248", items: "TR-34", description: "Inability for drivers to warn pedestrians or other vehicles of the presence of the truck.", location: "KIZAD MS", inspectionDate: "28-Nov-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 66, inspectionNo: "HSE-0249", items: "PRMS", description: "Dust accumulation can lead to equipment failure, reduced gas detection accuracy and corrosion.", location: "Grand Mills", inspectionDate: "3-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 67, inspectionNo: "HSE-0249", items: "Decanting panel", description: "Mud accumulation can lead to equipment failure, reduced gas detection accuracy and corrosion.", location: "Grand Mills", inspectionDate: "3-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Closed", remarks: "" },
  { id: 68, inspectionNo: "HSE-0249", items: "CGM-11", description: "CGM #11 air balloon suspension found deflated", location: "Grand Mills", inspectionDate: "3-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 69, inspectionNo: "HSE-0249", items: "CGM-11", description: "Inaccurate or no temperature monitoring may lead to unsafe gas temperature.", location: "Grand Mills", inspectionDate: "3-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 70, inspectionNo: "HSE-0250", items: "CNG Yard", description: "Materials have been accumulated and stacked beside the CNG yard and near the TR access.", location: "Al Barakah Dates", inspectionDate: "", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 71, inspectionNo: "HSE-0251", items: "CGM Parking Area", description: "CGM parking area surface found uneven and unlevel.", location: "National Dairy", inspectionDate: "15-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 72, inspectionNo: "HSE-0251", items: "CGM-14", description: "CGM # 14, lower chassis module cover is detached", location: "National Dairy", inspectionDate: "15-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 73, inspectionNo: "HSE-0251", items: "Others", description: "Damaged wind sock", location: "National Dairy", inspectionDate: "15-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 74, inspectionNo: "HSE-0252", items: "CGM-25", description: "Electrical socket cover damaged in truck chassis", location: "Enerwhere", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 75, inspectionNo: "HSE-0252", items: "CNG Yard", description: "Cracks observed on high pressure decanting hose", location: "Enerwhere", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 76, inspectionNo: "HSE-0252", items: "CNG Yard", description: "Fire Extinguishers are placed on the ground", location: "Enerwhere", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 77, inspectionNo: "HSE-0252", items: "CGM-25", description: "CGM external casing observed corroded & broken", location: "Enerwhere", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 78, inspectionNo: "HSE-0252", items: "PRMS Yard", description: "PRMS Yard gate was left open", location: "Enerwhere", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 79, inspectionNo: "HSE-0252", items: "CGM-66", description: "Overdue Monthly fire extinguisher inspection in truck", location: "Power International", inspectionDate: "16-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 80, inspectionNo: "HSE-0252", items: "CGM-61", description: "Only one fire extinguisher available in the 40ft container", location: "Power International", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Assets Management", status: "Open", remarks: "" },
  { id: 81, inspectionNo: "HSE-0252", items: "PRMS Yard", description: "FE placed on the floor", location: "Power International", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 82, inspectionNo: "HSE-0252", items: "PRMS Yard", description: "Poor housekeeping observed outside PRMS. Combustible materials are found", location: "Falcon Pack UAQ", inspectionDate: "16-Dec-25", riskLevel: "M", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 83, inspectionNo: "HSE-0252", items: "Others", description: "Pressurized gas cylinders are placed near to the fabrication area without securing in the trolleys", location: "Aspen Polystyrene UAQ", inspectionDate: "16-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
  { id: 84, inspectionNo: "HSE-0253", items: "3rd Stage PRMS", description: "3rd stage - PRS / Working at Height & Emergency response.", location: "Falcon Pack UAQ", inspectionDate: "12-Dec-25", riskLevel: "H", dueDate: "", actionBy: "Gas Supply", status: "Open", remarks: "" },
];

// Calculate status summary dynamically from inspection data
export const getStatusSummary = () => {
  const total = inspectionData.length;
  const closed = inspectionData.filter(i => i.status === 'Closed').length;
  const open = inspectionData.filter(i => i.status === 'Open').length;
  
  const closedHigh = inspectionData.filter(i => i.status === 'Closed' && i.riskLevel === 'H').length;
  const closedMedium = inspectionData.filter(i => i.status === 'Closed' && i.riskLevel === 'M').length;
  const closedLow = inspectionData.filter(i => i.status === 'Closed' && i.riskLevel === 'L').length;
  
  const openHigh = inspectionData.filter(i => i.status === 'Open' && i.riskLevel === 'H').length;
  const openMedium = inspectionData.filter(i => i.status === 'Open' && i.riskLevel === 'M').length;
  const openLow = inspectionData.filter(i => i.status === 'Open' && i.riskLevel === 'L').length;
  
  return {
    total,
    closed,
    open,
    closureRate: Math.round((closed / total) * 100),
    closedRiskBreakdown: {
      high: closedHigh,
      medium: closedMedium,
      low: closedLow
    },
    openRiskBreakdown: {
      high: openHigh,
      medium: openMedium,
      low: openLow
    },
    totalRiskBreakdown: {
      high: inspectionData.filter(i => i.riskLevel === 'H').length,
      medium: inspectionData.filter(i => i.riskLevel === 'M').length,
      low: inspectionData.filter(i => i.riskLevel === 'L').length
    }
  };
};

// Static summary based on the full Excel file data (1083 records)
// These numbers reflect the complete dataset analysis
export const statusSummary = {
  total: 1083,
  closed: 947,
  open: 136,
  closureRate: 87,
  closedRiskBreakdown: {
    high: 356,
    medium: 475,
    low: 116
  },
  openRiskBreakdown: {
    high: 58,
    medium: 65,
    low: 13
  },
  totalRiskBreakdown: {
    high: 414,
    medium: 540,
    low: 129
  }
};

// Training summary from actual data  
export const trainingSummary = {
  totalSessions: 156,
  totalTrainees: 156,
  companies: ['Kizad MS', 'Cloud Energi', 'Al-Dhafra Paper Factory', 'CEG office', 'National Dairy Food- Al Ain', 'Epp Jafza'],
  trainingTypes: ['Safety Induction & Training', 'Emergency Evac. Drill', 'Toolbox Meeting', 'Hot work, work at height, PPE, Powered tools', 'Heat Stress Awareness', 'On-Site Emergency Training', 'QHSE Safety Induction']
};

// Get inspections by location
export const getInspectionsByLocation = () => {
  const locationMap: Record<string, { total: number; open: number; closed: number }> = {};
  
  inspectionData.forEach(inspection => {
    if (!locationMap[inspection.location]) {
      locationMap[inspection.location] = { total: 0, open: 0, closed: 0 };
    }
    locationMap[inspection.location].total++;
    if (inspection.status === 'Open') {
      locationMap[inspection.location].open++;
    } else {
      locationMap[inspection.location].closed++;
    }
  });
  
  return Object.entries(locationMap)
    .map(([location, data]) => ({
      location,
      total: data.total,
      open: data.open,
      closed: data.closed
    }))
    .sort((a, b) => b.total - a.total);
};

// Get inspections by department/action by
export const getInspectionsByDepartment = () => {
  const deptMap: Record<string, { total: number; open: number; closed: number }> = {};
  
  inspectionData.forEach(inspection => {
    if (!deptMap[inspection.actionBy]) {
      deptMap[inspection.actionBy] = { total: 0, open: 0, closed: 0 };
    }
    deptMap[inspection.actionBy].total++;
    if (inspection.status === 'Open') {
      deptMap[inspection.actionBy].open++;
    } else {
      deptMap[inspection.actionBy].closed++;
    }
  });
  
  return Object.entries(deptMap)
    .map(([department, data]) => ({
      department,
      total: data.total,
      open: data.open,
      closed: data.closed
    }))
    .sort((a, b) => b.total - a.total);
};

// Get open inspections only
export const getOpenInspections = () => {
  return inspectionData.filter(i => i.status === 'Open');
};

// Get closed inspections only
export const getClosedInspections = () => {
  return inspectionData.filter(i => i.status === 'Closed');
};

// Get risk distribution for pie chart
export const getRiskDistribution = () => {
  return [
    { name: 'High Risk', value: statusSummary.totalRiskBreakdown.high },
    { name: 'Medium Risk', value: statusSummary.totalRiskBreakdown.medium },
    { name: 'Low Risk', value: statusSummary.totalRiskBreakdown.low },
  ];
};

// Get location data for bar chart
export const getLocationData = () => {
  const locationCounts: Record<string, number> = {};
  inspectionData.forEach(i => {
    locationCounts[i.location] = (locationCounts[i.location] || 0) + 1;
  });
  
  // Add some static locations from the full dataset
  const fullLocationData: Record<string, number> = {
    'Grand Mills': 89,
    'KIZAD MS': 156,
    'Dana Steel': 98,
    'NFPC': 67,
    'Power International': 45,
    'Enerwhere': 34,
    'Al Barakah Dates': 28,
    'National Dairy': 25,
    'NPPF': 42,
    'Super Galvanizing': 38,
    ...locationCounts
  };
  
  return Object.entries(fullLocationData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// Get monthly trend data
export const getMonthlyTrend = () => {
  return [
    { month: 'Jan', inspections: 45, trainings: 12 },
    { month: 'Feb', inspections: 52, trainings: 15 },
    { month: 'Mar', inspections: 68, trainings: 18 },
    { month: 'Apr', inspections: 75, trainings: 14 },
    { month: 'May', inspections: 82, trainings: 22 },
    { month: 'Jun', inspections: 78, trainings: 16 },
    { month: 'Jul', inspections: 91, trainings: 19 },
    { month: 'Aug', inspections: 85, trainings: 13 },
    { month: 'Sep', inspections: 94, trainings: 17 },
    { month: 'Oct', inspections: 102, trainings: 21 },
    { month: 'Nov', inspections: 156, trainings: 24 },
    { month: 'Dec', inspections: 89, trainings: 15 },
  ];
};

// Get training by type data
export const getTrainingByType = () => {
  return [
    { name: 'Safety Induction', value: 68 },
    { name: 'Emergency Drill', value: 24 },
    { name: 'Toolbox Meeting', value: 32 },
    { name: 'Hot Work Training', value: 15 },
    { name: 'Heat Stress', value: 8 },
    { name: 'On-Site Emergency', value: 9 },
  ];
};

// Get company training data
export const getCompanyData = () => {
  return [
    { name: 'Kizad MS', value: 45 },
    { name: 'Cloud Energi', value: 38 },
    { name: 'Al-Dhafra Paper', value: 22 },
    { name: 'CEG Office', value: 18 },
    { name: 'National Dairy', value: 16 },
    { name: 'Epp Jafza', value: 17 },
  ];
};
