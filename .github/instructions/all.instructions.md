---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
Playwright API + DB Automation (Swagger-First)

This project demonstrates API automation with Playwright, validating API → Database consistency, using Swagger (OpenAPI) as the single source of truth.

No manual request JSON files are maintained.

🎯 Objective (What you are building)

As an Automation Engineer, your task is to:

Call REST APIs (POST / GET)

Build request payloads programmatically (no static JSON)

Validate API responses

Cross-verify API data with Database records

Use Swagger to generate request/response models automatically

🧱 Architecture Overview
Swagger (OpenAPI)
        ↓
OpenAPI Generator
        ↓
TypeScript Models
        ↓
Builder / Factory
        ↓
Playwright API Tests
        ↓
Database Validation (PostgreSQL)

🛠️ Tech Stack
Tool	Purpose
Node.js	Runtime
Express	Sample API
PostgreSQL	Database
Swagger (OpenAPI)	API Contract
openapi-generator	Model generation
Playwright	API automation
pg	DB connectivity
📦 Prerequisites

Install the following:

1️⃣ Node.js (LTS)

Verify:

node -v
npm -v

2️⃣ PostgreSQL

Install PostgreSQL

Remember:

username

password

port (default: 5432)

Verify:

psql --version

📁 Project Structure
root
│
├── api-db-app                # Express API + Swagger + DB
│   ├── swagger/
│   │   └── openapi.yaml
│   ├── index.js
│   └── db.js
│
└── playwright-api-tests      # Automation framework
    ├── src/
    │   ├── builders/
    │   ├── generated/        # Swagger generated models
    │   ├── constants/
    │   ├── db/
    │   ├── utils/
    │   └── tests/
    └── playwright.config.ts

🚀 Step 1: Start API + DB App
1️⃣ Install dependencies
cd api-db-app
npm install

2️⃣ Start API
node index.js


Expected:

API running at http://localhost:3000
Swagger UI available at http://localhost:3000/swagger

🧾 Step 2: Verify Swagger

Open in browser:

http://localhost:3000/swagger


You should see:

POST /scheduling-groups

GET /scheduling-groups

Swagger is the only contract used.

⚙️ Step 3: Setup Playwright Project
cd playwright-api-tests
npm install
npx playwright install

🧬 Step 4: Generate TypeScript Models from Swagger

Run from playwright-api-tests directory:

npx openapi-generator-cli generate -i ../api-db-app/swagger/openapi.yaml -g typescript-fetch -o src/generated --skip-validate-spec


This generates:

src/generated/models
src/generated/apis


👉 No manual JSON request files are needed.

🧠 Step 5: Builder Pattern (Request Creation)

Builders use Swagger-generated models, not JSON.

Example:

new SchedulingGroupBuilder()
  .withGroupName(`TS_${Date.now()}`)
  .withStatus(SchedulingGroupRequestStatusEnum.ACTIVE)
  .build();

Rules:

Constructor → mandatory defaults

withX() → overrides

build() → validation

🧪 Step 6: Playwright API + DB Test

Run tests:

npx playwright test


Example flow:

Build request using builder

Call API

Assert response

Query DB

Match API data with DB data

🗄️ Step 7: Database Validation

DB queries use parameterized SQL to avoid SQL Injection.

Example:

SELECT * FROM scheduling_groups WHERE id = $1;


Values passed separately:

queryDB(query, [id]);

🔐 Security Best Practices

❌ No string concatenation in SQL

✅ Parameterized queries only

❌ No credentials in code

✅ Use .env files (recommended for real projects)

🧠 Key Design Decisions
Area	Decision
Swagger	Single source of truth
Request JSON	❌ Not stored
Models	Auto-generated
Builders	Manual & explicit
Assertions	In test only
DB	Validated directly
❓ Common Questions
Why no request JSON files?

They go out of sync

Swagger already defines structure

Builders give flexibility

Why builder instead of Lombok-like auto generation?

TypeScript does not support compile-time code generation like Java

Explicit builders are clearer and safer

Can this scale to large APIs?

Yes. This pattern is used in enterprise API automation frameworks.

✅ Final Outcome

After following this guide, you will have:

✔ Swagger-driven automation
✔ Zero manual request JSONs
✔ API + DB validation
✔ Scalable Playwright framework
✔ Real-world automation experience

📌 Next Enhancements (Optional)

Negative test scenarios

API client abstraction

CI/CD with GitHub Actions

Environment-based config

If you want, next I can:

Review this framework as an interviewer

Convert builder → factory

Add negative test patterns

Just tell me 👍

all commands to install everything forproject in nod like database /opeani etc

Got it 👍
Below is ONE PLACE where you’ll find ALL commands needed to set up everything from scratch on a fresh Windows machine, using Node.js ecosystem, exactly matching your project.

You can literally copy-paste and execute step by step.

📦 COMPLETE SETUP COMMANDS (END-TO-END)
0️⃣ Verify Prerequisites
Node.js (LTS)
node -v
npm -v

1️⃣ PostgreSQL – Database Setup
Install PostgreSQL (Windows)

👉 Download installer from:

https://www.postgresql.org/download/windows/


During install:

Port: 5432

Remember username & password

Verify installation
psql --version

2️⃣ Create Database & Table
psql -U postgres

CREATE DATABASE automation_db;
\c automation_db

CREATE TABLE scheduling_groups (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Exit:

\q

3️⃣ API + DB App (Express + Swagger)
Create project
mkdir api-db-app
cd api-db-app
npm init -y

Install dependencies
npm install express pg cors swagger-ui-express yamljs

(Optional but recommended)
npm install --save-dev nodemon

Start API
node index.js


Verify:

http://localhost:3000/swagger

4️⃣ Playwright API Automation Project
Create project
mkdir playwright-api-tests
cd playwright-api-tests
npm init -y

Install Playwright
npm install -D @playwright/test
npx playwright install

5️⃣ OpenAPI Generator (Swagger → TS Models)
Install OpenAPI Generator CLI
npm install -D @openapitools/openapi-generator-cli

Generate models
npx openapi-generator-cli generate -i ../api-db-app/swagger/openapi.yaml -g typescript-fetch -o src/generated --skip-validate-spec

6️⃣ DB Client for Playwright
npm install pg

7️⃣ TypeScript + Path Aliases
npm install -D typescript ts-node @types/node


Create tsconfig.json

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "baseUrl": "./",
    "paths": {
      "@builders/*": ["src/builders/*"],
      "@constants/*": ["src/constants/*"],
      "@db/*": ["src/db/*"],
      "@utils/*": ["src/utils/*"],
      "@generated/*": ["src/generated/*"]
    },
    "strict": true
  }
}

8️⃣ Environment Variables (DB Credentials)
npm install dotenv


Create .env

DB_HOST=localhost
DB_PORT=5432
DB_NAME=automation_db
DB_USER=postgres
DB_PASSWORD=your_password

9️⃣ Run Playwright Tests
npx playwright test

🔍 Sanity Check Commands
Check	Command
Swagger	http://localhost:3000/swagger

API	POST /scheduling-groups
DB	SELECT * FROM scheduling_groups;
Models	src/generated/models
Tests	npx playwright test
🧠 Key Takeaways

✔ Swagger defines everything
✔ No request JSON files
✔ Models auto-generated
✔ Builders create payloads
✔ Playwright sends API
✔ DB validates data