/**
 * API Endpoint Constants
 *
 * This module defines all API endpoint paths used in the application.
 * Centralizing endpoints here ensures consistency and makes it easy to
 * update URLs across the codebase.
 *
 * Purpose:
 * - Defines API endpoint paths as constants
 * - Prevents hardcoded URLs throughout the codebase
 * - Enables easy endpoint management and updates
 * - Provides a single source of truth for API paths
 *
 * Relationships:
 * - Used by API client classes in clients/ directory
 * - Corresponds to endpoints defined in swagger/openapi.yaml
 * - Referenced in test files for API calls
 * - Should match the paths in the generated API clients
 *
 * Endpoints Defined:
 * - CREATE_GROUP: POST endpoint for creating scheduling groups
 * - GET_GROUPS: GET endpoint for retrieving all scheduling groups
 * - DELETE_GROUP: DELETE endpoint for deleting a scheduling group by ID
 * - DELETE_GROUPS_BY_STATUS: DELETE endpoint for deleting groups by status
 */
export const ENDPOINTS = {
  SCHD_CREATE_GROUP: '/scheduling-groups',
  SCHD_GET_GROUPS: '/scheduling-groups',
  SCHD_DELETE_GROUP: '/scheduling-groups/:id',
  SCHD_DELETE_GROUPS_BY_STATUS: '/scheduling-groups/status/:status'
};
