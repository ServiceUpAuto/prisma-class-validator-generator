# Prisma Class Validator Generator

Automatically generate typescript models of your database with class validator validations ready, from your [Prisma](https://github.com/prisma/prisma) Schema. Updates every time `npx prisma generate` runs.

## Table of Contents

- [Supported Prisma Versions](#supported-prisma-versions)
- [Installation](#installing)
- [Usage](#usage)
- [Additional Options](#additional-options)
- [Development](#development)
- [Running Tests](#running-tests)

## Installation

```bash
 npm install prisma-generator-class-validator
```

# Usage

1- Add the generator to your Prisma schema

```prisma
generator class_validator {
  provider = "prisma-generator-class-validator"
}
```

3- Running `npx prisma generate` for the following schema.prisma

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  rating    Float
}
```

will generate classes as follows:

`User`:

```ts
import { IsInt, IsDefined, IsString, IsOptional } from 'class-validator';
import { Post } from './';

export class User {
  @IsDefined()
  @IsInt()
  id!: number;

  @IsDefined()
  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsDefined()
  posts!: Post[];
}
```

## Additional Options

| Option   |  Description                              | Type     |  Default      |
| -------- | ----------------------------------------- | -------- | ------------- |
| `output` | Output directory for the generated models | `string` | `./generated` |

Use additional options in the `schema.prisma`

```prisma
generator class_validator {
  provider   = "prisma-generator-class-validator"
  output     = "./generated-models"
}
```

## Development

This is a Prisma generator that creates TypeScript class models with class-validator decorators based on your Prisma schema.

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Test the generator: `npm test`

## Running Tests

The project includes tests for the helper functions:

```bash
# Run helper function tests (most reliable)
npm test

# Run all tests (including integration tests - may require a valid Prisma schema) 
npm run test:all

# Run tests with watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Build and run tests
npm run build:test
```

### Testing Notes

Integration tests require a valid Prisma schema and can be more fragile. They're best run in a controlled environment where all dependencies are properly set up.

For regular development, stick to the helper tests (`npm test`) which are faster and more reliable.