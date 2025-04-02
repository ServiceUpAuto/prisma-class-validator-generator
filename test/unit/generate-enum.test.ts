import generateEnum from '../../src/generate-enum';
import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

describe('generateEnum', () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        outDir: 'test-output',
      },
    });
  });

  test('generates a valid enum', () => {
    const enumInfo: DMMF.DatamodelEnum = {
      name: 'UserRole',
      values: [
        { name: 'ADMIN', dbName: null },
        { name: 'USER', dbName: null },
        { name: 'GUEST', dbName: null },
      ],
      dbName: null,
      documentation: 'User role enum',
    };

    // Create the output directory structure first
    project.createDirectory('test-output/enums');
    
    generateEnum(project, 'test-output', enumInfo);
    
    const sourceFile = project.getSourceFile('test-output/enums/UserRole.enum.ts');
    expect(sourceFile).toBeTruthy();
    const enumDeclaration = sourceFile.getEnumOrThrow('UserRole');
    
    expect(enumDeclaration.getName()).toBe('UserRole');
    
    const members = enumDeclaration.getMembers();
    expect(members.length).toBe(3);
    
    expect(members[0].getName()).toBe('ADMIN');
    expect(members[1].getName()).toBe('USER');
    expect(members[2].getName()).toBe('GUEST');
  });

  test('handles enums with dbName values', () => {
    const enumInfo: DMMF.DatamodelEnum = {
      name: 'PostStatus',
      values: [
        { name: 'DRAFT', dbName: 'draft' },
        { name: 'PUBLISHED', dbName: 'published' },
        { name: 'ARCHIVED', dbName: 'archived' },
      ],
      dbName: 'post_status',
      documentation: null,
    };

    // Create the output directory structure first
    project.createDirectory('test-output/enums');
    
    generateEnum(project, 'test-output', enumInfo);
    
    const sourceFile = project.getSourceFile('test-output/enums/PostStatus.enum.ts');
    expect(sourceFile).toBeTruthy();
    const enumDeclaration = sourceFile.getEnumOrThrow('PostStatus');
    
    expect(enumDeclaration.getName()).toBe('PostStatus');
    
    const members = enumDeclaration.getMembers();
    expect(members.length).toBe(3);
    
    expect(members[0].getName()).toBe('DRAFT');
    expect(members[1].getName()).toBe('PUBLISHED');
    expect(members[2].getName()).toBe('ARCHIVED');
  });
});