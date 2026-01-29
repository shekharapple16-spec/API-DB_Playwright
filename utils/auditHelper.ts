/**
 * Audit Helper Utilities
 *
 * This module provides audit logging functionality for tracking changes to scheduling groups.
 * It logs CREATE, UPDATE, and DELETE operations to the audit table for historical tracking.
 *
 * Purpose:
 * - Log all changes to scheduling groups to audit table
 * - Track before/after values for updates
 * - Record who made changes and when
 * - Support audit trail queries
 *
 * Relationships:
 * - Uses queryDB from utils/dbClient.ts for database operations
 * - Executes queries from db/queries.ts (INSERT_AUDIT_LOG, GET_GROUP_AUDIT_HISTORY)
 * - Called by test files and API handlers after create/update/delete operations
 * - Depends on scheduling_groups_audit table in PostgreSQL
 *
 * Key Functions:
 * - logCreate: Log group creation
 * - logUpdate: Log group update with before/after values
 * - logDelete: Log group deletion
 *
 * Usage:
 * import { logAudit } from '@utils/auditHelper';
 * 
 * // After creating a group
 * await logCreate(groupId, userId);
 * 
 * // After updating a group
 * await logUpdate(groupId, oldValues, newValues, userId);
 * 
 * // After deleting a group
 * await logDelete(groupId, userId);
 */

import { queryDB } from './dbClient';
import { DB_QUERIES } from '../db/queries';

interface AuditEntry {
  id: number;
  group_id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_by: string;
  changed_at: Date;
}

/**
 * Log a group creation event
 * @param groupId - ID of the created group
 * @param userId - User who created the group
 */
export async function logCreate(groupId: number, userId: string): Promise<AuditEntry> {
  const result = await queryDB<AuditEntry>(
    DB_QUERIES.INSERT_AUDIT_LOG,
    [groupId, 'CREATE', null, null, userId]
  );
  return result[0];
}

/**
 * Log a group update event with before/after values
 * @param groupId - ID of the updated group
 * @param oldValues - Values before update
 * @param newValues - Values after update
 * @param userId - User who made the update
 */
export async function logUpdate(
  groupId: number,
  oldValues: Record<string, any>,
  newValues: Record<string, any>,
  userId: string
): Promise<AuditEntry> {
  const result = await queryDB<AuditEntry>(
    DB_QUERIES.INSERT_AUDIT_LOG,
    [groupId, 'UPDATE', JSON.stringify(oldValues), JSON.stringify(newValues), userId]
  );
  return result[0];
}

/**
 * Log a group deletion event
 * @param groupId - ID of the deleted group
 * @param userId - User who deleted the group
 */
export async function logDelete(groupId: number, userId: string): Promise<AuditEntry> {
  const result = await queryDB<AuditEntry>(
    DB_QUERIES.INSERT_AUDIT_LOG,
    [groupId, 'DELETE', null, null, userId]
  );
  return result[0];
}

/**
 * Retrieve audit history for a group
 * @param groupId - ID of the group
 * @returns Array of audit entries in chronological order
 */
export async function getAuditHistory(groupId: number): Promise<AuditEntry[]> {
  return queryDB<AuditEntry>(
    DB_QUERIES.GET_GROUP_AUDIT_HISTORY,
    [groupId]
  );
}

/**
 * Helper to extract changed fields from update
 * Compares old and new values and returns only fields that changed
 * @param oldValues - Original values
 * @param newValues - Updated values
 * @returns Object with only changed fields
 */
export function getChangedFields(
  oldValues: Record<string, any>,
  newValues: Record<string, any>
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {};

  for (const key in newValues) {
    if (oldValues[key] !== newValues[key]) {
      changes[key] = {
        old: oldValues[key],
        new: newValues[key]
      };
    }
  }

  return changes;
}
