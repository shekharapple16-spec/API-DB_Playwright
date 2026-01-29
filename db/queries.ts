export const DB_QUERIES = {
  // CREATE operations
  INSERT_GROUP: `
    INSERT INTO scheduling_groups 
    (group_name, created_by, status, area, notes, allocations_menu, last_amended_by, last_amended_date) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
    RETURNING *
  `,

  // READ operations
  GET_ALL_GROUPS: "SELECT * FROM scheduling_groups",
  
  GET_GROUP_BY_ID: "SELECT * FROM scheduling_groups WHERE id = $1",
  
  GET_GROUPS_BY_STATUS: "SELECT * FROM scheduling_groups WHERE status = $1",
  
  GET_GROUPS_BY_AREA: "SELECT * FROM scheduling_groups WHERE area = $1",
  
  GET_GROUP_WITH_TEAMS: `
    SELECT sg.*, json_agg(st.*) as associated_teams
    FROM scheduling_groups sg
    LEFT JOIN scheduling_group_teams sgt ON sg.id = sgt.group_id
    LEFT JOIN scheduling_teams st ON sgt.team_id = st.id
    WHERE sg.id=$1
    GROUP BY sg.id
  `,

  // UPDATE operations
  UPDATE_GROUP: `
    UPDATE scheduling_groups 
    SET 
      group_name = COALESCE($1, group_name),
      status = COALESCE($2, status),
      area = COALESCE($3, area),
      notes = COALESCE($4, notes),
      allocations_menu = COALESCE($5, allocations_menu),
      last_amended_by = $6,
      last_amended_date = NOW()
    WHERE id = $7 
    RETURNING *
  `,

  // DELETE operations
  DELETE_GROUP_BY_ID: "DELETE FROM scheduling_groups WHERE id = $1 RETURNING *",
  
  DELETE_GROUPS_BY_STATUS: "DELETE FROM scheduling_groups WHERE status = $1",

  // AUDIT operations
  INSERT_AUDIT_LOG: `
    INSERT INTO scheduling_groups_audit 
    (group_id, action, old_values, new_values, changed_by, changed_at) 
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *
  `,

  GET_GROUP_AUDIT_HISTORY: `
    SELECT * FROM scheduling_groups_audit 
    WHERE group_id = $1 
    ORDER BY changed_at ASC
  `,

  DELETE_AUDIT_BY_GROUP_ID: "DELETE FROM scheduling_groups_audit WHERE group_id = $1",
};
