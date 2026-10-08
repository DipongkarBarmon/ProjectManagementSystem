const fs = require('fs');
const path = require('path');

const modulePath = path.join(__dirname, 'src', 'app', 'module');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

const allFiles = walkSync(modulePath);
const routeFiles = allFiles.filter(f => f.endsWith('.route.ts'));

for (const file of routeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Add Permissions import
  if (!content.includes('Permissions') && content.includes('auth(')) {
    content = content.replace(
      /import \{ auth \} from ['"]\.\.\/\.\.\/middleware\/checkAuth['"];?/g,
      `import { auth } from "../../middleware/checkAuth";\nimport { Permissions } from "../../config/permissions";`
    );
  }

  // Remove ALL_ROLES
  content = content.replace(/const ALL_ROLES = \[.*?\];\n?/g, '');
  
  // OrganizationRole import might be unused now, but we'll leave it or remove it
  content = content.replace(/import \{ OrganizationRole \} from ['"]\.\.\/\.\.\/\.\.\/\.\.\/generated\/prisma\/enums['"];?\n?/g, '');
  content = content.replace(/import \{ PlatformRole, OrganizationRole \} from ['"]\.\.\/\.\.\/\.\.\/\.\.\/generated\/prisma\/enums['"];?\n?/g, 'import { PlatformRole } from "../../../../generated/prisma/enums";\n');

  // Replace auth calls based on keywords
  // Activity
  if (file.includes('activity')) {
    content = content.replace(/auth\(\{ organizationRoles: .*? \}\)/g, 'auth({ permissions: [Permissions.ACTIVITY_READ] })');
  }
  // Attachment
  if (file.includes('attachment')) {
    content = content.replace(/auth\(\{ organizationRoles: .*? \}\)/g, 'auth({ permissions: [Permissions.PROJECT_READ] })');
  }
  // Comment
  if (file.includes('comment')) {
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?createComment/g, 'auth({ permissions: [Permissions.COMMENT_CREATE] }), validationRequest(createCommentSchema), CommentController.createComment');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getComments/g, 'auth({ permissions: [Permissions.PROJECT_READ] }), CommentController.getComments');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?updateComment/g, 'auth({ permissions: [Permissions.COMMENT_UPDATE] }), validationRequest(updateCommentSchema), CommentController.updateComment');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?deleteComment/g, 'auth({ permissions: [Permissions.COMMENT_DELETE] }), CommentController.deleteComment');
  }
  // Invitation
  if (file.includes('invitation')) {
    content = content.replace(/auth\(\{organizationRoles: \[OrganizationRole\.ORG_ADMIN\]\}\).*?sentInvitations/g, 'auth({ permissions: [Permissions.MEMBER_INVITE] }), validationRequest(InvitationValidation.sentInvitationZodSchema), InvitationController.sentInvitations');
    content = content.replace(/auth\(\{organizationRoles: \[OrganizationRole\.ORG_ADMIN\]\}\).*?getAllInvitations/g, 'auth({ permissions: [Permissions.MEMBER_READ] }), validationRequest(InvitationValidation.GetAllInvitationsZodSchema), InvitationController.getAllInvitations');
    content = content.replace(/auth\(\{organizationRoles: \[OrganizationRole\.ORG_ADMIN\]\}\).*?getInvitationById/g, 'auth({ permissions: [Permissions.MEMBER_READ] }), InvitationController.getInvitationById');
    content = content.replace(/auth\(\{organizationRoles: \[OrganizationRole\.ORG_ADMIN\]\}\).*?cencelInvitation/g, 'auth({ permissions: [Permissions.MEMBER_REMOVE] }), InvitationController.cencelInvitation');
  }
  // Label
  if (file.includes('label')) {
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?createLabel/g, 'auth({ permissions: [Permissions.PROJECT_UPDATE] }), validationRequest(createLabelSchema), LabelController.createLabel');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getAllLabels/g, 'auth({ permissions: [Permissions.PROJECT_READ] }), LabelController.getAllLabels');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?updateLabel/g, 'auth({ permissions: [Permissions.PROJECT_UPDATE] }), validationRequest(updateLabelSchema), LabelController.updateLabel');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?deleteLabel/g, 'auth({ permissions: [Permissions.PROJECT_UPDATE] }), LabelController.deleteLabel');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?assignLabel/g, 'auth({ permissions: [Permissions.TASK_UPDATE] }), validationRequest(assignLabelSchema), LabelController.assignLabel');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?removeLabel/g, 'auth({ permissions: [Permissions.TASK_UPDATE] }), LabelController.removeLabel');
  }
  // Notification
  if (file.includes('notification')) {
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\)/g, 'auth()');
  }
  // Organization
  if (file.includes('organization.route')) {
    content = content.replace(/auth\(\{organizationRoles:\[OrganizationRole\.ORG_ADMIN\]\}\)/g, 'auth({ permissions: [Permissions.ORG_UPDATE] })');
  }
  // OrganizationBilling
  if (file.includes('organizationbilling')) {
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN\] \}\)/g, 'auth({ permissions: [Permissions.BILLING_MANAGE] })');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\)/g, 'auth({ permissions: [Permissions.BILLING_READ] })');
  }
  // Sprint
  if (file.includes('sprint')) {
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?createSprint/g, 'auth({ permissions: [Permissions.SPRINT_CREATE] }), validationRequest(SprintValidation.createSprintZodSchema), SprintController.createSprint');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getAllSprints/g, 'auth({ permissions: [Permissions.SPRINT_READ] }), SprintController.getAllSprints');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getSprintById/g, 'auth({ permissions: [Permissions.SPRINT_READ] }), SprintController.getSprintById');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?updateSprint/g, 'auth({ permissions: [Permissions.SPRINT_UPDATE] }), validationRequest(SprintValidation.updateSprintZodSchema), SprintController.updateSprint');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?deleteSprint/g, 'auth({ permissions: [Permissions.SPRINT_UPDATE] }), SprintController.deleteSprint');
  }
  // Task
  if (file.includes('task.route')) {
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?createTask/g, 'auth({ permissions: [Permissions.TASK_CREATE] }), validationRequest(createTaskSchema), TaskController.createTask');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getAllTasks/g, 'auth({ permissions: [Permissions.TASK_READ] }), TaskController.getAllTasks');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getTaskById/g, 'auth({ permissions: [Permissions.TASK_READ] }), TaskController.getTaskById');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?updateTask/g, 'auth({ permissions: [Permissions.TASK_UPDATE] }), validationRequest(updateTaskSchema), TaskController.updateTask');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?deleteTask/g, 'auth({ permissions: [Permissions.TASK_DELETE] }), TaskController.deleteTask');
  }
  // Team
  if (file.includes('team')) {
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?createTeam/g, 'auth({ permissions: [Permissions.TEAM_CREATE] }), validationRequest(createTeamSchema), TeamController.createTeam');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getAllTeams/g, 'auth({ permissions: [Permissions.TEAM_READ] }), TeamController.getAllTeams');
    content = content.replace(/auth\(\{ organizationRoles: ALL_ROLES \}\).*?getTeamById/g, 'auth({ permissions: [Permissions.TEAM_READ] }), TeamController.getTeamById');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?updateTeam/g, 'auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(updateTeamSchema), TeamController.updateTeam');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER\] \}\).*?deleteTeam/g, 'auth({ permissions: [Permissions.TEAM_DELETE] }), TeamController.deleteTeam');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER, OrganizationRole\.TEAM_LEAD\] \}\).*?addTeamMember/g, 'auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(addTeamMemberSchema), TeamController.addTeamMember');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER, OrganizationRole\.TEAM_LEAD\] \}\).*?removeTeamMember/g, 'auth({ permissions: [Permissions.TEAM_UPDATE] }), TeamController.removeTeamMember');
    content = content.replace(/auth\(\{ organizationRoles: \[OrganizationRole\.ORG_ADMIN, OrganizationRole\.PROJECT_MANAGER, OrganizationRole\.TEAM_LEAD\] \}\).*?updateTeamMemberRole/g, 'auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(updateTeamMemberRoleSchema), TeamController.updateTeamMemberRole');
  }

  // Ensure Project.route.ts has ALL_ROLES removed if present
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}
