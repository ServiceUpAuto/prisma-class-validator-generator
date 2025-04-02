import { 
  getTSDataTypeFromFieldType,
  getDecoratorsByFieldType,
  getDecoratorsImportsByType
} from '../../src/helpers';
import { DMMF } from '@prisma/generator-helper';

describe('helpers', () => {
  describe('getTSDataTypeFromFieldType', () => {
    test('returns correct type for Int', () => {
      const field = { 
        name: 'id',
        type: 'Int', 
        kind: 'scalar',
        isRequired: true,
        isList: false
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('number');
    });

    test('returns correct type for String', () => {
      const field = { 
        name: 'name',
        type: 'String', 
        kind: 'scalar',
        isRequired: true,
        isList: false
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('string');
    });

    test('returns correct type for Boolean', () => {
      const field = { 
        name: 'isActive',
        type: 'Boolean', 
        kind: 'scalar',
        isRequired: true,
        isList: false
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('boolean');
    });

    test('returns correct type for DateTime', () => {
      const field = { 
        name: 'createdAt',
        type: 'DateTime', 
        kind: 'scalar',
        isRequired: true,
        isList: false
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('Date');
    });

    test('handles list types', () => {
      const field = { 
        name: 'tags',
        type: 'String', 
        kind: 'scalar',
        isRequired: true,
        isList: true
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('string[]');
    });

    test('handles enum types', () => {
      const field = { 
        name: 'role',
        type: 'Role', 
        kind: 'enum',
        isRequired: true,
        isList: false
      } as DMMF.Field;
      
      expect(getTSDataTypeFromFieldType(field)).toBe('Role');
    });
  });

  describe('getDecoratorsByFieldType', () => {
    test('returns correct decorators for Int type', () => {
      const field = {
        name: 'id',
        kind: 'scalar',
        type: 'Int',
        isRequired: true,
        isList: false,
      } as DMMF.Field;

      const decorators = getDecoratorsByFieldType(field);
      expect(decorators).toContainEqual({ name: 'IsInt', arguments: [] });
      expect(decorators).toContainEqual({ name: 'IsDefined', arguments: [] });
    });

    test('returns correct decorators for String type', () => {
      const field = {
        name: 'name',
        kind: 'scalar',
        type: 'String',
        isRequired: true,
        isList: false,
      } as DMMF.Field;

      const decorators = getDecoratorsByFieldType(field);
      expect(decorators).toContainEqual({ name: 'IsString', arguments: [] });
      expect(decorators).toContainEqual({ name: 'IsDefined', arguments: [] });
    });

    test('returns correct decorators for optional fields', () => {
      const field = {
        name: 'description',
        kind: 'scalar',
        type: 'String',
        isRequired: false,
        isList: false,
      } as DMMF.Field;

      const decorators = getDecoratorsByFieldType(field);
      expect(decorators).toContainEqual({ name: 'IsOptional', arguments: [] });
      expect(decorators).toContainEqual({ name: 'IsString', arguments: [] });
    });
  });

  describe('getDecoratorsImportsByType', () => {
    test('returns correct imports for given fields', () => {
      const field = { 
        name: 'id',
        kind: 'scalar', 
        type: 'Int', 
        isRequired: true, 
        isList: false 
      } as DMMF.Field;

      const imports = getDecoratorsImportsByType(field);
      
      expect(imports).toContain('IsInt');
      expect(imports).toContain('IsDefined');
    });

    test('returns IsOptional for optional fields', () => {
      const field = { 
        name: 'name',
        kind: 'scalar', 
        type: 'String', 
        isRequired: false, 
        isList: false 
      } as DMMF.Field;

      const imports = getDecoratorsImportsByType(field);
      
      expect(imports).toContain('IsString');
      expect(imports).toContain('IsOptional');
    });

    test('returns IsIn for enum fields', () => {
      const field = { 
        name: 'role',
        kind: 'enum', 
        type: 'Role', 
        isRequired: true, 
        isList: false 
      } as DMMF.Field;

      const imports = getDecoratorsImportsByType(field);
      
      expect(imports).toContain('IsIn');
      expect(imports).toContain('IsDefined');
    });
  });
});