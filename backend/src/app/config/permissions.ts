export const Permissions = {
  // Organization
  ORG_READ: "organization.read",
  ORG_UPDATE: "organization.update",
  ORG_DELETE: "organization.delete",

  // Members
  MEMBER_READ: "member.read",
  MEMBER_INVITE: "member.invite",
  MEMBER_UPDATE: "member.update",
  MEMBER_REMOVE: "member.remove",

  // Teams
  TEAM_CREATE: "team.create",
  TEAM_READ: "team.read",
  TEAM_UPDATE: "team.update",
  TEAM_DELETE: "team.delete",

  // Projects
  PROJECT_CREATE: "project.create",
  PROJECT_READ: "project.read",
  PROJECT_UPDATE: "project.update",
  PROJECT_ARCHIVE: "project.archive",

  // Sprints
  SPRINT_CREATE: "sprint.create",
  SPRINT_READ: "sprint.read",
  SPRINT_UPDATE: "sprint.update",

  // Tasks
  TASK_CREATE: "task.create",
  TASK_READ: "task.read",
  TASK_UPDATE: "task.update",
  TASK_DELETE: "task.delete",
  TASK_ASSIGN: "task.assign",

  // Comments
  COMMENT_CREATE: "comment.create",
  COMMENT_UPDATE: "comment.update",
  COMMENT_DELETE: "comment.delete",

  // Activity
  ACTIVITY_READ: "activity.read",

  // Billing
  BILLING_READ: "billing.read",
  BILLING_MANAGE: "billing.manage",
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];
