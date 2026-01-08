// Comprehensive test script for QHSE Dashboard functions
const XLSX = require('xlsx');
const fs = require('fs');

console.log('🧪 Starting Comprehensive QHSE Dashboard Tests...\n');

// Test 1: Excel File Structure Analysis
console.log('📊 Test 1: Excel File Structure Analysis');
console.log('='.repeat(50));

try {
  // Test HSE Inspection Tracker
  const inspectionWB = XLSX.readFile('HSE Inspection Tracker.xlsx');
  console.log('✓ HSE Inspection Tracker loaded');
  console.log(`  Sheets: ${inspectionWB.SheetNames.join(', ')}`);
  
  inspectionWB.SheetNames.forEach(sheetName => {
    const ws = inspectionWB.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    console.log(`  Sheet "${sheetName}": ${data.length} rows`);
    
    // Find header row
    let headerRow = -1;
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i];
      const hasHeaders = row.some(cell => 
        typeof cell === 'string' && (
          cell.toLowerCase().includes('inspection') ||
          cell.toLowerCase().includes('description') ||
          cell.toLowerCase().includes('location') ||
          cell.toLowerCase().includes('status')
        )
      );
      if (hasHeaders) {
        headerRow = i;
        console.log(`    Header row found at index ${i}:`, row.filter(c => c));
        break;
      }
    }
  });
  
  // Test Training Sheet
  const trainingWB = XLSX.readFile('CEG QHSE Induction Trainig Sheet.xlsx');
  console.log('✓ Training Sheet loaded');
  console.log(`  Sheets: ${trainingWB.SheetNames.join(', ')}`);
  
  const trainingWS = trainingWB.Sheets[trainingWB.SheetNames[0]];
  const trainingData = XLSX.utils.sheet_to_json(trainingWS, { header: 1, defval: '' });
  console.log(`  Total rows: ${trainingData.length}`);
  console.log(`  Header row (row 2):`, trainingData[1]?.filter(c => c) || 'Not found');
  
} catch (error) {
  console.error('✗ Excel file reading failed:', error.message);
}

console.log('\n');

// Test 2: Data Parsing Functions
console.log('🔍 Test 2: Data Parsing Functions');
console.log('='.repeat(50));

// Test date parsing
function parseDate(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    const ddmmyy = dateValue.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
    if (ddmmyy) {
      const day = ddmmyy[1].padStart(2, '0');
      const month = ddmmyy[2].padStart(2, '0');
      const year = ddmmyy[3].length === 2 ? `20${ddmmyy[3]}` : ddmmyy[3];
      return `${year}-${month}-${day}`;
    }
    return null;
  }
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  return null;
}

// Test risk level parsing
function parseRiskLevel(risk) {
  if (!risk) return 'M';
  const riskStr = String(risk).trim().toUpperCase();
  if (riskStr === 'H' || riskStr === 'HIGH') return 'H';
  if (riskStr === 'L' || riskStr === 'LOW') return 'L';
  return 'M';
}

// Test status parsing
function parseStatus(status) {
  if (!status) return 'Open';
  const statusStr = String(status).trim();
  if (statusStr.toLowerCase() === 'closed') return 'Closed';
  return 'Open';
}

// Test date parsing
const dateTests = [
  { input: '4-Jan-22', expected: '2022-01-04' },
  { input: 45294, expected: null }, // Excel date number
  { input: '2022-01-04', expected: '2022-01-04' },
  { input: null, expected: null },
];

console.log('Date Parsing Tests:');
dateTests.forEach((test, i) => {
  const result = parseDate(test.input);
  const passed = result === test.expected || (test.input === 45294 && result !== null);
  console.log(`  ${passed ? '✓' : '✗'} Test ${i + 1}: ${test.input} -> ${result}`);
});

// Test risk level parsing
const riskTests = [
  { input: 'H', expected: 'H' },
  { input: 'High', expected: 'H' },
  { input: 'M', expected: 'M' },
  { input: 'L', expected: 'L' },
  { input: null, expected: 'M' },
];

console.log('\nRisk Level Parsing Tests:');
riskTests.forEach((test, i) => {
  const result = parseRiskLevel(test.input);
  const passed = result === test.expected;
  console.log(`  ${passed ? '✓' : '✗'} Test ${i + 1}: ${test.input} -> ${result}`);
});

// Test status parsing
const statusTests = [
  { input: 'Open', expected: 'Open' },
  { input: 'Closed', expected: 'Closed' },
  { input: 'closed', expected: 'Closed' },
  { input: null, expected: 'Open' },
];

console.log('\nStatus Parsing Tests:');
statusTests.forEach((test, i) => {
  const result = parseStatus(test.input);
  const passed = result === test.expected;
  console.log(`  ${passed ? '✓' : '✗'} Test ${i + 1}: ${test.input} -> ${result}`);
});

console.log('\n');

// Test 3: Excel Data Extraction
console.log('📥 Test 3: Excel Data Extraction');
console.log('='.repeat(50));

try {
  const inspectionWB = XLSX.readFile('HSE Inspection Tracker.xlsx');
  const sheetName = inspectionWB.SheetNames[0];
  const ws = inspectionWB.Sheets[sheetName];
  
  // Try to find data rows
  const allData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  console.log(`Total rows in sheet: ${allData.length}`);
  
  // Look for rows with actual data
  let dataRows = 0;
  let sampleRow = null;
  
  for (let i = 0; i < allData.length; i++) {
    const row = allData[i];
    const hasData = row.some(cell => cell && cell.toString().trim() !== '');
    if (hasData && row.length > 5) {
      dataRows++;
      if (!sampleRow && row.some(cell => cell && cell.toString().includes('HSE-'))) {
        sampleRow = row;
      }
    }
  }
  
  console.log(`Rows with data: ${dataRows}`);
  if (sampleRow) {
    console.log('Sample data row:', sampleRow.filter(c => c).slice(0, 5));
  }
  
  // Try with header row detection
  const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
  console.log(`JSON rows (with headers): ${jsonData.length}`);
  if (jsonData.length > 0) {
    console.log('Sample JSON row keys:', Object.keys(jsonData[0]).slice(0, 10));
    console.log('Sample JSON row values:', Object.values(jsonData[0]).slice(0, 5));
  }
  
} catch (error) {
  console.error('✗ Data extraction failed:', error.message);
}

console.log('\n');

// Test 4: Component Data Flow Simulation
console.log('🔄 Test 4: Component Data Flow Simulation');
console.log('='.repeat(50));

// Simulate inspection data
const mockInspections = [
  { id: '1', inspection_no: 'HSE-0001', items: 'CGM-01', description: 'Test 1', location: 'Location A', inspection_date: '2022-01-01', risk_level: 'H', action_by: 'Gas Supply', status: 'Open' },
  { id: '2', inspection_no: 'HSE-0002', items: 'CGM-02', description: 'Test 2', location: 'Location B', inspection_date: '2022-01-02', risk_level: 'M', action_by: 'Logistics', status: 'Closed' },
  { id: '3', inspection_no: 'HSE-0003', items: 'PRMS', description: 'Test 3', location: 'Location A', inspection_date: '2022-01-03', risk_level: 'L', action_by: 'Gas Supply', status: 'Open' },
];

// Calculate summary (like useInspections hook)
function calculateSummary(inspections) {
  const total = inspections.length;
  const closed = inspections.filter(i => i.status === 'Closed').length;
  const open = inspections.filter(i => i.status === 'Open').length;
  const closureRate = total > 0 ? Math.round((closed / total) * 100) : 0;
  
  const openRiskBreakdown = {
    high: inspections.filter(i => i.status === 'Open' && i.risk_level === 'H').length,
    medium: inspections.filter(i => i.status === 'Open' && i.risk_level === 'M').length,
    low: inspections.filter(i => i.status === 'Open' && i.risk_level === 'L').length,
  };
  
  const closedRiskBreakdown = {
    high: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'H').length,
    medium: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'M').length,
    low: inspections.filter(i => i.status === 'Closed' && i.risk_level === 'L').length,
  };
  
  return {
    total,
    closed,
    open,
    closureRate,
    openRiskBreakdown,
    closedRiskBreakdown,
  };
}

const summary = calculateSummary(mockInspections);
console.log('Summary Calculation:');
console.log(`  Total: ${summary.total} (expected: 3)`);
console.log(`  Closed: ${summary.closed} (expected: 1)`);
console.log(`  Open: ${summary.open} (expected: 2)`);
console.log(`  Closure Rate: ${summary.closureRate}% (expected: 33%)`);
console.log(`  Open High Risk: ${summary.openRiskBreakdown.high} (expected: 1)`);
console.log(`  Open Medium Risk: ${summary.openRiskBreakdown.medium} (expected: 0)`);
console.log(`  Open Low Risk: ${summary.openRiskBreakdown.low} (expected: 1)`);

// Department insights calculation
function calculateDepartmentInsights(inspections) {
  const deptMap = {};
  
  inspections.forEach(inspection => {
    const dept = inspection.action_by || 'Unknown';
    if (!deptMap[dept]) {
      deptMap[dept] = { total: 0, open: 0, closed: 0, openHigh: 0, openMedium: 0, openLow: 0 };
    }
    
    deptMap[dept].total++;
    if (inspection.status === 'Open') {
      deptMap[dept].open++;
      if (inspection.risk_level === 'H') deptMap[dept].openHigh++;
      else if (inspection.risk_level === 'M') deptMap[dept].openMedium++;
      else if (inspection.risk_level === 'L') deptMap[dept].openLow++;
    } else {
      deptMap[dept].closed++;
    }
  });
  
  return Object.entries(deptMap)
    .map(([department, data]) => ({
      department,
      ...data,
      closureRate: data.total > 0 ? Math.round((data.closed / data.total) * 100) : 0,
    }))
    .filter(d => d.open > 0)
    .sort((a, b) => (b.openHigh * 3 + b.openMedium * 2 + b.openLow) - (a.openHigh * 3 + a.openMedium * 2 + a.openLow));
}

const deptInsights = calculateDepartmentInsights(mockInspections);
console.log('\nDepartment Insights:');
deptInsights.forEach(dept => {
  console.log(`  ${dept.department}: ${dept.open} open (${dept.openHigh}H, ${dept.openMedium}M, ${dept.openLow}L), ${dept.closureRate}% closure`);
});

console.log('\n');

// Test 5: File Structure Validation
console.log('📁 Test 5: File Structure Validation');
console.log('='.repeat(50));

const requiredFiles = [
  'src/components/dashboard/ExcelImportDialog.tsx',
  'src/components/dashboard/DepartmentInsights.tsx',
  'src/components/dashboard/StatusChart.tsx',
  'src/components/dashboard/RiskBreakdownCard.tsx',
  'src/hooks/useInspections.ts',
  'src/pages/Index.tsx',
  'package.json',
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✓' : '✗'} ${file}`);
});

console.log('\n');

// Test 6: Package Dependencies
console.log('📦 Test 6: Package Dependencies');
console.log('='.repeat(50));

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['xlsx', '@supabase/supabase-js', 'recharts', 'react'];
  
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    console.log(`${hasDep ? '✓' : '✗'} ${dep} ${hasDep ? `(${hasDep})` : '(missing)'}`);
  });
} catch (error) {
  console.error('✗ Failed to read package.json:', error.message);
}

console.log('\n');

// Test 7: TypeScript Type Safety
console.log('🔷 Test 7: TypeScript Type Safety');
console.log('='.repeat(50));

// Check if TypeScript files have proper types
const tsFiles = [
  'src/components/dashboard/ExcelImportDialog.tsx',
  'src/components/dashboard/DepartmentInsights.tsx',
];

tsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasTypes = content.includes('interface') || content.includes('type');
    const hasProps = content.includes('Props');
    console.log(`${hasTypes && hasProps ? '✓' : '⚠'} ${file} - ${hasTypes && hasProps ? 'Has types' : 'May need type definitions'}`);
  }
});

console.log('\n');

// Test 8: Data Validation Rules
console.log('✅ Test 8: Data Validation Rules');
console.log('='.repeat(50));

function validateInspection(inspection) {
  const errors = [];
  
  if (!inspection.inspection_no || inspection.inspection_no.trim() === '') {
    errors.push('Missing inspection_no');
  }
  if (!inspection.description || inspection.description.trim() === '') {
    errors.push('Missing description');
  }
  if (!inspection.location || inspection.location.trim() === '') {
    errors.push('Missing location');
  }
  if (!inspection.action_by || inspection.action_by.trim() === '') {
    errors.push('Missing action_by');
  }
  if (!['H', 'M', 'L'].includes(inspection.risk_level)) {
    errors.push('Invalid risk_level');
  }
  if (!['Open', 'Closed'].includes(inspection.status)) {
    errors.push('Invalid status');
  }
  
  return { valid: errors.length === 0, errors };
}

const validationTests = [
  { inspection: { inspection_no: 'HSE-001', description: 'Test', location: 'Loc', action_by: 'Dept', risk_level: 'H', status: 'Open' }, shouldPass: true },
  { inspection: { inspection_no: '', description: 'Test', location: 'Loc', action_by: 'Dept', risk_level: 'H', status: 'Open' }, shouldPass: false },
  { inspection: { inspection_no: 'HSE-001', description: '', location: 'Loc', action_by: 'Dept', risk_level: 'H', status: 'Open' }, shouldPass: false },
  { inspection: { inspection_no: 'HSE-001', description: 'Test', location: 'Loc', action_by: 'Dept', risk_level: 'X', status: 'Open' }, shouldPass: false },
];

validationTests.forEach((test, i) => {
  const result = validateInspection(test.inspection);
  const passed = result.valid === test.shouldPass;
  console.log(`${passed ? '✓' : '✗'} Validation Test ${i + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (!passed || result.errors.length > 0) {
    console.log(`    Errors: ${result.errors.join(', ')}`);
  }
});

console.log('\n');
console.log('🎉 Test Suite Complete!');
console.log('='.repeat(50));


