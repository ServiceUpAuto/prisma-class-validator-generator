import * as path from 'path';
import * as fs from 'fs';
import { 
  runGenerator, 
  cleanupOutputDir, 
  getFileContent,
  getDMMF
} from '../helpers/test-utils';
import { DMMF } from '@prisma/generator-helper';

// Define unusual schema cases
const edgeCaseSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ComplexModel {
  id              Int       @id @default(autoincrement())
  bigNumber       BigInt    @default(0)
  jsonData        Json?
  dateTime        DateTime?
  bytes           Bytes?
  decimal         Decimal   @db.Decimal(10, 2)
  nativeType      Int       @db.Integer
  scalarList      Int[]     @default([1, 2, 3])
  uniqueConstraint String    @unique
  customName      String    @map("custom_column_name")
  otherMappedModel OtherMappedModel? @relation(fields: [otherMappedModelId], references: [id])
  otherMappedModelId Int?
  @@map("complex_table")
}

model OtherMappedModel {
  id         Int           @id @default(autoincrement())
  complex    ComplexModel?
  @@map("other_mapped_table")
}

enum MixedCaseEnum {
  OptionOne
  option_two
  OPTION_THREE
}
`;

const schemaPath = path.resolve(__dirname, '../temp-edge-case-schema.prisma');
const outputPath = path.resolve(__dirname, '../edge-case-output');

describe('Edge Cases', () => {
  beforeAll(async () => {
    // Write temp schema file
    fs.writeFileSync(schemaPath, edgeCaseSchema);
    
    // Run the generator
    await runGenerator(schemaPath, outputPath);
  });

  afterAll(() => {
    // Clean up
    if (fs.existsSync(schemaPath)) {
      fs.unlinkSync(schemaPath);
    }
    cleanupOutputDir(outputPath);
  });

  test('handles BigInt type correctly', () => {
    const modelFile = getFileContent(path.join(outputPath, 'models', 'ComplexModel.ts'));
    expect(modelFile).toBeTruthy();
    expect(modelFile).toMatch(/bigNumber!:\s*bigint/);
    expect(modelFile).toContain('@IsInt()');
  });

  test('handles Json type correctly', () => {
    const modelFile = getFileContent(path.join(outputPath, 'models', 'ComplexModel.ts'));
    expect(modelFile).toBeTruthy();
    expect(modelFile).toMatch(/jsonData\?:\s*JsonValue\s*\|\s*null/);
    expect(modelFile).toContain('@IsJSON()');
    expect(modelFile).toContain('import { JsonValue } from \'@prisma/client/runtime/library\'');
  });

  test('handles Bytes type correctly', () => {
    const modelFile = getFileContent(path.join(outputPath, 'models', 'ComplexModel.ts'));
    expect(modelFile).toBeTruthy();
    expect(modelFile).toMatch(/bytes\?:\s*Buffer\s*\|\s*null/);
  });

  test('handles Decimal type correctly', () => {
    const modelFile = getFileContent(path.join(outputPath, 'models', 'ComplexModel.ts'));
    expect(modelFile).toBeTruthy();
    expect(modelFile).toMatch(/decimal!:\s*(Decimal|number)/);
    expect(modelFile).toContain('@IsNumber()');
  });

  test('handles model mapping correctly', () => {
    const modelFile = getFileContent(path.join(outputPath, 'models', 'ComplexModel.ts'));
    expect(modelFile).toBeTruthy();
    // The model name should be ComplexModel despite DB mapping to complex_table
    expect(modelFile).toContain('export class ComplexModel');
  });

  test('handles mixed case enum values', () => {
    const enumFile = getFileContent(path.join(outputPath, 'enums', 'MixedCaseEnum.ts'));
    expect(enumFile).toBeTruthy();
    expect(enumFile).toContain('OptionOne');
    expect(enumFile).toContain('option_two');
    expect(enumFile).toContain('OPTION_THREE');
  });
});