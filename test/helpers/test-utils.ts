import { DMMF } from '@prisma/generator-helper';
import * as path from 'path';
import * as fs from 'fs';
import { generate } from '../../src/prisma-generator';

/**
 * Gets the DMMF from a Prisma schema file
 */
export async function getDMMF(schemaPath: string): Promise<DMMF.Document> {
  const { getDMMF } = require('@prisma/internals');
  const datamodel = fs.readFileSync(schemaPath, 'utf-8');
  return getDMMF({ datamodel });
}

/**
 * Helper function to run the generator against a test schema
 */
export async function runGenerator(
  schemaPath: string,
  outputPath: string,
): Promise<void> {
  const dmmf = await getDMMF(schemaPath);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Run the generator
  await generate({
    dmmf,
    generator: {
      config: {},
      name: 'test-generator',
      output: { value: outputPath, fromEnvVar: null },
      provider: { value: '', fromEnvVar: null },
      binaryTargets: [],
    },
    datasources: [],
    schemaPath,
    otherGenerators: [],
    datamodel: fs.readFileSync(schemaPath, 'utf-8'),
  });
}

/**
 * Checks if a file exists and returns its content
 */
export function getFileContent(filePath: string): string | null {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
}

/**
 * Cleans up the output directory after tests
 */
export function cleanupOutputDir(outputPath: string): void {
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true, force: true });
  }
}