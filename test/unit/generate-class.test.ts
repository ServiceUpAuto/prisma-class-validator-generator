import generateClass from '../../src/generate-class';
import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

describe('generateClass', () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        outDir: 'test-output',
      },
    });
  });

  test('generates a class with scalar fields', async () => {
    const model: DMMF.Model = {
      name: 'User',
      dbName: null,
      fields: [
        {
          name: 'id',
          kind: 'scalar',
          type: 'Int',
          isRequired: true,
          isList: false,
          isId: true,
          isReadOnly: false,
          isGenerated: false,
          isUpdatedAt: false,
          default: { name: 'autoincrement', args: [] },
          relationName: undefined,
          documentation: 'User ID',
          hasDefaultValue: true,
        },
        {
          name: 'email',
          kind: 'scalar',
          type: 'String',
          isRequired: true,
          isList: false,
          isId: false,
          isReadOnly: false,
          isGenerated: false,
          isUpdatedAt: false,
          relationName: undefined,
          documentation: 'User email',
          hasDefaultValue: false,
        },
        {
          name: 'name',
          kind: 'scalar',
          type: 'String',
          isRequired: false,
          isList: false,
          isId: false,
          isReadOnly: false,
          isGenerated: false,
          isUpdatedAt: false,
          relationName: undefined,
          documentation: 'User name',
          hasDefaultValue: false,
        },
      ],
      isGenerated: false,
      idFields: ['id'],
      uniqueFields: [],
      uniqueIndexes: [],
      primaryKey: null,
      documentation: 'User model',
    };

    // Create the output directory structure first
    project.createDirectory('test-output/models');
    
    await generateClass(project, 'test-output', model);
    
    const sourceFile = project.getSourceFile('test-output/models/User.model.ts');
    expect(sourceFile).toBeTruthy();
    
    const classDeclaration = sourceFile.getClassOrThrow('User');
    
    expect(classDeclaration.getName()).toBe('User');
    
    // Check properties
    const properties = classDeclaration.getProperties();
    expect(properties.length).toBe(3);
    
    const idProperty = classDeclaration.getPropertyOrThrow('id');
    expect(idProperty.getType().getText()).toBe('number');
    expect(idProperty.hasExclamationToken()).toBe(true);
    
    const emailProperty = classDeclaration.getPropertyOrThrow('email');
    expect(emailProperty.getType().getText()).toBe('string');
    expect(emailProperty.hasExclamationToken()).toBe(true);
    
    const nameProperty = classDeclaration.getPropertyOrThrow('name');
    expect(nameProperty.getType().getText()).toBe('string | null');
    expect(nameProperty.hasQuestionToken()).toBe(true);
  });

  test('generates a class with enum fields', async () => {
    const model: DMMF.Model = {
      name: 'User',
      dbName: null,
      fields: [
        {
          name: 'id',
          kind: 'scalar',
          type: 'Int',
          isRequired: true,
          isList: false,
          isId: true,
          isReadOnly: false,
          isGenerated: false,
          isUpdatedAt: false,
          default: { name: 'autoincrement', args: [] },
          relationName: undefined,
          hasDefaultValue: true,
        },
        {
          name: 'role',
          kind: 'enum',
          type: 'Role',
          isRequired: true,
          isList: false,
          isId: false,
          isReadOnly: false,
          isGenerated: false,
          isUpdatedAt: false,
          relationName: undefined,
          hasDefaultValue: true,
          default: { name: 'enum', args: ['USER'] },
        }
      ],
      isGenerated: false,
      idFields: ['id'],
      uniqueFields: [],
      uniqueIndexes: [],
      primaryKey: null,
    };

    // Create the output directory structure first
    project.createDirectory('test-output/models');
    
    await generateClass(project, 'test-output', model);
    
    const sourceFile = project.getSourceFile('test-output/models/User.model.ts');
    expect(sourceFile).toBeTruthy();
    
    const importDeclarations = sourceFile.getImportDeclarations();
    
    // Check imports for enum
    const enumImportDeclaration = importDeclarations.find(i =>
      i.getModuleSpecifierValue().includes('enums')
    );
    
    expect(enumImportDeclaration).toBeTruthy();
    
    // Check enum property
    const roleProperty = sourceFile.getClassOrThrow('User').getPropertyOrThrow('role');
    expect(roleProperty.getType().getText()).toBe('Role');
    expect(roleProperty.hasExclamationToken()).toBe(true);
  });
});