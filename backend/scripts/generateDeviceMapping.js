#!/usr/bin/env node

/**
 * Generate User ID Mapping from Database
 * This script fetches all employees from the database and creates a mapping
 * for the biometric device user IDs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function generateMapping() {
  try {
    console.log('📥 Fetching employees from database...');

    // Get all employees sorted by ID
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        employeeId: 'asc',
      },
    });

    if (employees.length === 0) {
      console.error('❌ No employees found in database');
      process.exit(1);
    }

    console.log(`✅ Found ${employees.length} employees\n`);

    // Create mapping (device user ID starts from 1)
    const mapping = {};
    const details = [];

    employees.forEach((emp, index) => {
      const deviceId = index + 1; // Device IDs start from 1
      mapping[deviceId] = emp.employeeId;
      details.push({
        deviceId,
        employeeCode: emp.employeeId,
        name: `${emp.firstName} ${emp.lastName}`,
      });
    });

    // Display mapping
    console.log('📋 Generated Mapping:\n');
    console.log('Device ID | Employee Code | Name');
    console.log('----------|---------------|-----');
    details.forEach((d) => {
      console.log(`${String(d.deviceId).padEnd(9)} | ${d.employeeCode.padEnd(13)} | ${d.name}`);
    });

    // Save to JSON file
    const configPath = path.join(
      process.cwd(),
      'src/config/biometricDeviceMapping.json'
    );

    fs.writeFileSync(
      configPath,
      JSON.stringify({ mapping, details, generatedAt: new Date().toISOString() }, null, 2)
    );

    console.log(`\n✅ Mapping saved to: ${configPath}`);

    // Generate TypeScript config
    const tsConfigPath = path.join(
      process.cwd(),
      'src/config/generateMappingConfig.ts'
    );

    const tsContent = `// Auto-generated on ${new Date().toISOString()}
// Run: npm run generate-device-mapping

export const userIdMapping = ${JSON.stringify(mapping, null, 2)};

export const userIdMappingDetails = ${JSON.stringify(details, null, 2)};
`;

    fs.writeFileSync(tsConfigPath, tsContent);
    console.log(`✅ TypeScript config saved to: ${tsConfigPath}`);

    // Copy to config file
    const configUpdatePath = path.join(
      process.cwd(),
      'src/config/biometricDeviceConfig.ts'
    );

    let configContent = fs.readFileSync(configUpdatePath, 'utf-8');

    // Replace the userIdMapping section
    configContent = configContent.replace(
      /userIdMapping: \{[\s\S]*?\},/,
      `userIdMapping: ${JSON.stringify(mapping, null, 4)},`
    );

    fs.writeFileSync(configUpdatePath, configContent);
    console.log(`✅ Updated biometricDeviceConfig.ts with new mapping`);

    console.log('\n📝 Next Steps:');
    console.log('1. Verify the mapping above matches your device user assignments');
    console.log('2. Enroll users in device with numeric IDs 1-' + employees.length);
    console.log('3. Restart backend server: npm run dev');
    console.log('4. Test connection: curl http://localhost:5000/api/device/status\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateMapping();
