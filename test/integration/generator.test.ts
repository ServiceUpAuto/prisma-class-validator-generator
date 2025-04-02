import * as path from 'path';
import * as fs from 'fs';
import { 
  runGenerator, 
  cleanupOutputDir, 
  getFileContent 
} from '../helpers/test-utils';

const schemaPath = path.resolve(__dirname, '../fixtures/schema.prisma');
const outputPath = path.resolve(__dirname, '../output');

describe('Prisma Class Validator Generator', () => {
  beforeAll(async () => {
    // Run the generator before all tests
    await runGenerator(schemaPath, outputPath);
  });

  afterAll(() => {
    // Clean up the output directory after tests
    cleanupOutputDir(outputPath);
  });

  test('generates an index file', () => {
    const indexFile = getFileContent(path.join(outputPath, 'index.ts'));
    expect(indexFile).toBeTruthy();
    expect(indexFile).toContain('export * from \'./models\'');
    expect(indexFile).toContain('export * from \'./enums\'');
  });

  test('generates enum files', () => {
    const roleEnumFile = getFileContent(path.join(outputPath, 'enums', 'Role.enum.ts'));
    expect(roleEnumFile).toBeTruthy();
    expect(roleEnumFile).toContain('export enum Role {');
    expect(roleEnumFile).toContain('USER');
    expect(roleEnumFile).toContain('ADMIN');
    expect(roleEnumFile).toContain('EDITOR');
  });

  test('generates enum index file', () => {
    const enumIndexFile = getFileContent(path.join(outputPath, 'enums', 'index.ts'));
    expect(enumIndexFile).toBeTruthy();
    expect(enumIndexFile).toContain('export { Role } from "./Role.enum"');
  });

  test('generates model files for each model', () => {
    const modelFiles = [
      'User.model.ts',
      'Profile.model.ts',
      'Post.model.ts',
      'Category.model.ts',
      'Comment.model.ts'
    ];

    for (const file of modelFiles) {
      const modelFile = getFileContent(path.join(outputPath, 'models', file));
      expect(modelFile).toBeTruthy();
      expect(modelFile).toContain(`export class ${file.replace('.model.ts', '')}`);
    }
  });

  test('generates model index file', () => {
    const modelIndexFile = getFileContent(path.join(outputPath, 'models', 'index.ts'));
    expect(modelIndexFile).toBeTruthy();
    
    const expectedModels = [
      'User',
      'Profile',
      'Post',
      'Category',
      'Comment'
    ];

    for (const model of expectedModels) {
      expect(modelIndexFile).toContain(`export { ${model} } from "./${model}.model"`);
    }
  });

  test('adds class-validator decorators', () => {
    const userModelFile = getFileContent(path.join(outputPath, 'models', 'User.model.ts'));
    expect(userModelFile).toBeTruthy();
    
    // Check imports
    expect(userModelFile).toContain('import { IsInt, IsDefined, IsString, IsBoolean, IsOptional, IsDate, IsJSON } from \'class-validator\'');
    
    // Check ID field
    expect(userModelFile).toContain('@IsDefined()');
    expect(userModelFile).toContain('@IsInt()');
    expect(userModelFile).toContain('id!: number');
    
    // Check email field (required)
    expect(userModelFile).toContain('@IsString()');
    expect(userModelFile).toContain('email!: string');
    
    // Check optional fields
    expect(userModelFile).toContain('@IsOptional()');
    expect(userModelFile).toMatch(/name\?:\s*string\s*\|\s*null/);
    
    // Check boolean field
    expect(userModelFile).toContain('@IsBoolean()');
    
    // Check enum field
    expect(userModelFile).toContain('role!: Role');
    
    // Check relation field
    expect(userModelFile).toContain('posts!: Post[]');
  });

  test('handles optional and nullable fields correctly', () => {
    const postModelFile = getFileContent(path.join(outputPath, 'models', 'Post.model.ts'));
    expect(postModelFile).toBeTruthy();
    
    // Check optional content field
    expect(postModelFile).toMatch(/content\?:\s*string\s*\|\s*null/);
    
    // Check optional float field
    expect(postModelFile).toMatch(/@IsOptional\(\)[\s\n]*@IsNumber\(\)[\s\n]*rating\?:\s*number\s*\|\s*null/);
  });

  test('adds correct imports for related models', () => {
    const postModelFile = getFileContent(path.join(outputPath, 'models', 'Post.model.ts'));
    expect(postModelFile).toBeTruthy();
    
    // Check User import for relation
    expect(postModelFile).toContain('import type { User, Category, Comment } from \'./\'');
  });

  test('handles JSON fields correctly', () => {
    const userModelFile = getFileContent(path.join(outputPath, 'models', 'User.model.ts'));
    expect(userModelFile).toBeTruthy();
    
    // Check JSON field
    expect(userModelFile).toMatch(/@IsOptional\(\)[\s\n]*@IsJSON\(\)[\s\n]*metadata\?:\s*JsonValue\s*\|\s*null/);
    expect(userModelFile).toContain('import { Prisma } from \'@prisma/client\'');
  });
});