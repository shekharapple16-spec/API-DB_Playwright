export const DB_QUERIES = {
  GET_GROUP_BY_ID: "SELECT group_name FROM scheduling_groups WHERE id = $1",
  GET_GROUPS_BY_STATUS: "SELECT * FROM scheduling_groups WHERE status = $1",
  DELETE_GROUPS_BY_STATUS: "DELETE FROM scheduling_groups WHERE status = $1",
  GET_ALL_GROUPS: "SELECT * FROM scheduling_groups",
};
