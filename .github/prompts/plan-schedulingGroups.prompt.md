# Plan: Implement BBC Scheduling Groups Feature (Full Phase 1 with Audit History)

**TL;DR**  
Extend the existing Scheduling Groups API to support all BBC requirements: add 4 new fields (area, notes, allocations_menu, last_amended_by), implement audit history tracking via a separate audit table, add PUT/PATCH update endpoints, and extend tests to cover happy path + error scenarios. Follow Swagger-first approach: update OpenAPI spec → regenerate models → extend builders → implement backend endpoints → write tests.

## Steps

### 1. Update OpenAPI Specification [swagger/openapi.yaml](swagger/openapi.yaml)
   - Add new fields to request/response models: `area`, `notes`, `allocations_menu` (boolean with default false), `lastAmendedBy`
   - Add `lastAmendedDate` (auto-generated timestamp) to response only
   - Convert `status` to enum type with options: `ACTIVE`, `INACTIVE`
   - Add PUT endpoint: `/scheduling-groups/{id}` (update existing group)
   - Add GET endpoint: `/scheduling-groups/{id}` (fetch single group)
   - Add GET endpoint: `/scheduling-groups/{id}/history` (fetch audit trail for a group)
   - Add request model `UpdateSchedulingGroupRequest` with same fields as Create (all optional for PATCH semantics)
   - Add response model `SchedulingGroupHistory` with fields: `id`, `groupId`, `action` (CREATE/UPDATE/DELETE), `changes` (JSON), `changedBy`, `changedAt`

### 2. Extend Database Schema (Migration task for DB team, but specify here)
   - Add columns to `scheduling_groups` table:
     - `area VARCHAR(100)` - required, non-nullable
     - `notes TEXT` - optional
     - `allocations_menu BOOLEAN DEFAULT false`
     - `last_amended_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
     - `last_amended_by VARCHAR(100)` - required, non-nullable
   - Create new audit table `scheduling_groups_audit`:
     - `id SERIAL PRIMARY KEY`
     - `group_id INTEGER FK → scheduling_groups(id)`
     - `action VARCHAR(20)` (CREATE/UPDATE/DELETE)
     - `changes JSONB` - store before/after values
     - `changed_by VARCHAR(100)`
     - `changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
   - Create triggers or insert-based audit logging (decide on approach)

### 3. Regenerate TypeScript Models from Updated Swagger
   - Run: `npx openapi-generator-cli generate -i ../api-db-app/swagger/openapi.yaml -g typescript-fetch -o src/generated --skip-validate-spec`
   - Verify new models created in [src/generated/models/](src/generated/models/): `UpdateSchedulingGroupRequest.ts`, `SchedulingGroupHistory.ts`
   - Verify new API methods appear in [src/generated/apis/SchedulingGroupsApi.ts](src/generated/apis/SchedulingGroupsApi.ts)

### 4. Extend Builder Pattern [payloads/builders/SchedulingGroupBuilder.ts](payloads/builders/SchedulingGroupBuilder.ts)
   - Add withers: `.withArea()`, `.withNotes()`, `.withAllocationsMenu()`, `.withLastAmendedBy()`
   - Update defaults in constructor: `lastAmendedBy = 'automation'` (test default)
   - Ensure `build()` validates mandatory fields: `groupName`, `area`, `lastAmendedBy`
   - Create new builder `UpdateSchedulingGroupBuilder` for PUT requests (similar structure)

### 5. Extend API Client [clients/SchedulingGroupClient.ts](clients/SchedulingGroupClient.ts)
   - Add method: `updateGroup(id: number, payload)` - calls PUT `/scheduling-groups/{id}`
   - Add method: `getGroupById(id: number)` - calls GET `/scheduling-groups/{id}`
   - Add method: `getGroupHistory(id: number)` - calls GET `/scheduling-groups/{id}/history`
   - Add method: `getGroupsByArea(area: string)` - filters by area (optional, nice-to-have)
   - All methods use inherited Playwright `request` context from `BaseApiClient`

### 6. Add DB Query Functions [db/queries.ts](db/queries.ts)
   - Add: `INSERT_GROUP` - with new columns
   - Add: `UPDATE_GROUP` - parameterized UPDATE query
   - Add: `GET_GROUP_BY_ID` - already exists, verify it returns all columns
   - Add: `GET_GROUPS_BY_AREA` - filter by area
   - Add: `GET_GROUP_AUDIT_HISTORY` - fetch from audit table
   - Add: `INSERT_AUDIT_LOG` - write to audit table
   - All use parameterized queries to prevent SQL injection

### 7. Implement Database Utility Helper [utils/dbClient.ts](utils/dbClient.ts) (or extend it)
   - Add helper: `logAudit(groupId, action, changes, userId)` - inserts into audit table
   - Helper should capture before/after values as JSON

### 8. Create Test Suite [tests/scheduling-groups.spec.ts](tests/scheduling-groups.spec.ts)
   - **Happy Path Tests:**
     - Create group with all required fields → Assert 201 + response structure → Verify DB insert + audit log created
     - Get all groups (by area) → Assert 200 + array structure
     - Get group by ID → Assert 200 + correct group returned
     - Update group (change name, notes, allocations_menu) → Assert 200 + DB updated + audit log created with changes
     - Delete group → Assert 204 + DB deleted + audit log shows DELETE action
     - Fetch audit history for group → Assert array of audit records with correct action/changes
   
   - **Error Cases:**
     - Create without required field (area) → Assert 400 with validation error
     - Update non-existent group → Assert 404
     - Delete non-existent group → Assert 404
     - Get history for non-existent group → Assert 404
     - Invalid status enum → Assert 400
   
   - **Cross-check Tests:**
     - Create → Verify API response matches DB record
     - Update → Verify before/after values in audit history JSON
     - Delete → Verify cannot GET deleted group (404)

### 9. Constants/Enums [constants/endpoint.ts](constants/endpoint.ts) (new file if needed)
   - Define `STATUS_ENUM = { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' }`
   - Define `AUDIT_ACTIONS = { CREATE: 'CREATE', UPDATE: 'UPDATE', DELETE: 'DELETE' }`
   - Define area constants if applicable (e.g., list of valid areas)

### 10. Documentation Updates
   - Update [README.md](README.md) with new fields, endpoints, and audit logging behavior
   - Document how to run tests with examples

## Verification Checklist

- ✅ **Swagger UI** (http://localhost:3000/swagger): All 6 endpoints visible with correct parameters/responses
- ✅ **Model Generation**: Re-run `openapi-generator-cli` and confirm no errors; 9 models should exist
- ✅ **Database Schema**: Run migration; verify `scheduling_groups` has 7 columns; `scheduling_groups_audit` table created
- ✅ **Unit/API Tests**: Run `npx playwright test` → all tests pass (happy + error scenarios)
- ✅ **Audit Trail**: Create group → update it → delete it → Run `SELECT * FROM scheduling_groups_audit WHERE group_id=X` → Verify 3 records with correct actions and changed_by values
- ✅ **API + DB Cross-Check**: For each test, assert both API response AND DB state match expected values

## Key Decisions

- **Audit Approach**: Use `scheduling_groups_audit` table (INSERT-based logging) rather than triggers, for simplicity and testability
- **Change Tracking**: Store before/after values as `JSONB` columns for full audit trail
- **Soft Delete**: Not implementing in Phase 1 (hard delete only per current implementation; can add in Phase 2)
- **Associated Scheduling Teams**: Assume Teams API exists and DB joins work; not implementing team management for Phase 1
- **Area Field**: Will be a required string field; no role-based filtering yet (backend responsibility)
- **Status Enum**: Converted to proper enum to prevent invalid values
- **Test Coverage**: Both happy + error paths to catch validation/permission issues early

## Implementation Order Recommendation

1. Update Swagger/OpenAPI spec (drives everything else)
2. Regenerate models (confirms spec is correct)
3. Update database schema (needs to be done before backend work)
4. Extend builders & API client (easy once models exist)
5. Add DB query functions and audit utilities
6. Implement backend endpoints (if backend is your responsibility)
7. Write comprehensive test suite
8. Verify end-to-end with cross-checks

---

**Next: Ready for implementation? Any adjustments to the plan?**
