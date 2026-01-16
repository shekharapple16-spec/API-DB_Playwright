# Playwright API + DB Automation Framework

This project demonstrates API automation with Playwright, validating API → Database consistency using a Swagger-First approach. It serves as a scalable framework for testing REST APIs while ensuring data integrity between the API layer and the underlying database.

## 🎯 What This Project Does

- **API Testing**: Automated testing of REST API endpoints using Playwright
- **Database Validation**: Cross-verification of API responses against PostgreSQL database records
- **Swagger-Driven Development**: Uses OpenAPI specification as the single source of truth
- **Type Safety**: Full TypeScript support with auto-generated models
- **Builder Pattern**: Programmatic payload creation without manual JSON files

## 🧱 Architecture Overview

```
Swagger (OpenAPI)
    ↓
OpenAPI Generator
    ↓
TypeScript Models
    ↓
Builder Pattern
    ↓
Playwright API Tests
    ↓
Database Validation
```

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js | JavaScript/TypeScript execution |
| API Testing | Playwright | HTTP request automation |
| API Specification | OpenAPI/Swagger | Contract definition |
| Model Generation | OpenAPI Generator | TypeScript model creation |
| Database | PostgreSQL | Data persistence |
| Database Client | pg (node-postgres) | Database connectivity |
| Language | TypeScript | Type-safe development |

## 📦 Prerequisites

### Required Software
- **Node.js** (LTS version) - Runtime environment
- **PostgreSQL** - Database server
- **npm** - Package manager

### Database Setup
Create a PostgreSQL database with the following table:

```sql
CREATE DATABASE automation_db;

\c automation_db;

CREATE TABLE scheduling_groups (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# API Configuration
BASE_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=automation_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Generate TypeScript Models
```bash
npm run generate:scheduling
```

### 4. Run Tests
```bash
npm test
```

## 📁 Project Structure

```
playwright-api-tests/
├── .env                          # Environment variables (not committed)
├── .github/instructions/         # Project documentation and guidelines
├── clients/                      # API client classes
│   ├── BaseApiClient.ts         # Base class for API clients
│   └── SchedulingGroupClient.ts # Client for scheduling group operations
├── config/                       # Configuration files
│   ├── db.config.ts             # Database connection configuration
│   └── env.config.ts            # Environment variable access
├── constants/                    # Application constants
│   └── endpoint.ts              # API endpoint definitions
├── db/                          # Database related files
│   └── queries.ts               # SQL query definitions
├── payloads/                    # Request payload management
│   ├── builders/                # Builder pattern implementations
│   │   └── SchedulingGroupBuilder.ts
│   └── templates/               # JSON templates (legacy/not used)
├── src/generated/               # Auto-generated files from Swagger
│   ├── apis/                    # Generated API client classes
│   ├── docs/                    # API documentation
│   ├── models/                  # TypeScript interfaces and types
│   ├── index.ts                 # Main export file
│   └── runtime.ts               # Runtime utilities
├── swagger/                     # OpenAPI specifications
│   └── openapi.yaml             # API contract definition
├── tests/                       # Playwright test files
│   └── scheduling-groups.spec.ts # Test suite for scheduling groups
├── utils/                       # Utility functions
│   └── dbClient.ts              # Database client wrapper
├── package.json                 # Node.js dependencies and scripts
├── playwright.config.ts         # Playwright configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔄 How It Works: The Flow

### 1. API Contract Definition (`swagger/openapi.yaml`)
The OpenAPI specification defines the API contract:
- Endpoints: `POST /scheduling-groups`, `GET /scheduling-groups`
- Request/Response schemas with validation rules
- This serves as the single source of truth

### 2. Model Generation (`src/generated/`)
OpenAPI Generator creates TypeScript interfaces from the Swagger spec:
- `SchedulingGroupRequest.ts` - Request payload interface
- `SchedulingGroupResponse.ts` - Response payload interface
- Includes enums, validation, and JSON serialization methods

### 3. Request Building (`payloads/builders/`)
The Builder Pattern creates request payloads programmatically:
```typescript
const payload = new SchedulingGroupBuilder()
  .withGroupName(`TS_${Date.now()}`)
  .withStatus(SchedulingGroupRequestStatusEnum.ACTIVE)
  .build();
```
- Constructor sets sensible defaults
- Fluent API for customization
- Validation in `build()` method
- No manual JSON files needed

### 4. API Testing (`tests/`)
Playwright tests execute the API calls:
```typescript
const client = new SchedulingGroupClient(request);
const responseBody = await client.createGroup(payload);
```
- Uses Playwright's `APIRequestContext` for HTTP requests
- Custom client classes provide domain-specific methods
- Inherits from `BaseApiClient` for common functionality

### 5. Database Validation (`db/`, `utils/`)
Tests verify data consistency:
```typescript
const dbResult = await queryDB(DB_QUERIES.GET_GROUP_BY_ID, [responseBody.id]);
expect(dbResult[0].group_name).toBe(payload.groupName);
```
- Parameterized SQL queries prevent injection
- Connection pooling via `pg.Pool`
- Direct database queries for validation

## 🔧 Key Components Explained

### API Clients (`clients/`)
- **BaseApiClient**: Abstract base class wrapping Playwright's request context
- **SchedulingGroupClient**: Domain-specific client for scheduling group operations
- Provides typed methods for API interactions

### Builders (`payloads/builders/`)
- Implement Builder Pattern for request creation
- Use generated TypeScript models for type safety
- Fluent interface with method chaining
- Built-in validation and defaults

### Database Layer (`db/`, `utils/`)
- **queries.ts**: Centralized SQL query definitions
- **dbClient.ts**: Connection pooling and query execution
- **db.config.ts**: Database configuration from environment variables

### Configuration (`config/`)
- Environment-based configuration
- Separation of concerns for different config types
- Type-safe access to configuration values

### Generated Code (`src/generated/`)
- Auto-generated from OpenAPI spec
- Includes models, API clients, and documentation
- Should not be manually edited
- Regenerated when API spec changes

## 🧪 Test Execution

Tests follow this pattern:
1. **Arrange**: Build request payload using Builder
2. **Act**: Call API via Client
3. **Assert**: Verify API response structure
4. **Validate**: Query database and compare data

Example test flow:
```
Builder → API Call → Response Validation → DB Query → Data Comparison
```

## 🔒 Security Best Practices

- **Parameterized Queries**: All database queries use parameters to prevent SQL injection
- **Environment Variables**: Sensitive data stored in `.env` files
- **No Hardcoded Credentials**: Configuration externalized
- **Type Safety**: TypeScript prevents runtime errors

## 🎯 Design Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Swagger | Single source of truth | Eliminates sync issues between docs and code |
| Request JSON | Not stored manually | Builders provide flexibility and maintainability |
| Models | Auto-generated | Ensures consistency with API spec |
| Builders | Manual implementation | Clearer and safer than auto-generation |
| Assertions | In tests only | Separation of concerns |
| DB Validation | Direct queries | Immediate feedback on data consistency |

## 🚀 Scaling the Framework

This pattern scales to large APIs by:
- Adding new OpenAPI specs for different domains
- Creating domain-specific clients and builders
- Extending the base classes for common functionality
- Maintaining type safety across the entire stack

## 📋 Development Workflow

1. **Update API Spec**: Modify `swagger/openapi.yaml`
2. **Regenerate Models**: Run `npm run generate:scheduling`
3. **Create Builders**: Implement builder classes for new endpoints
4. **Add Clients**: Create client classes for API interactions
5. **Write Tests**: Add Playwright tests with DB validation
6. **Configure DB**: Add new queries and table validations

## 🔧 Available Scripts

- `npm run generate:scheduling` - Generate TypeScript models from OpenAPI spec
- `npm test` - Run Playwright test suite

## 📚 Further Reading

- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)</content>
<parameter name="filePath">e:\playwright-api-tests\README.md