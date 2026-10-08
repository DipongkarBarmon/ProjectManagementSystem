

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";

// src/app/config/index.ts
import dotenv from "dotenv";
import path from "path";
var Path = path.join(process.cwd(), ".env");
dotenv.config({ path: Path });
var config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
  smtp_user: process.env.SMTP_USER,
  smtp_sender: process.env.SMTP_SENDER,
  smtp_password: process.env.SMTP_PASSWORD,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL,
  bkash_merchant_number: process.env.BKASH_MERCHANT_NUMBER,
  super_admin_name: process.env.SUPER_ADMIN_NAME,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD
};
var config_default = config;

// src/app/middleware/globalErrorHandler.ts
import httpStatus from "http-status";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Activity {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n  actorId        String @db.Uuid\n\n  action ActivityAction\n\n  entityType String\n  entityId   String\n\n  description String?\n  metadata    Json?\n\n  createdAt DateTime @default(now())\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  actor        User         @relation(fields: [actorId], references: [id], onDelete: Cascade)\n\n  @@index([organizationId, createdAt])\n  @@index([actorId, createdAt])\n  @@index([entityType, entityId])\n  @@map("activities")\n}\n\nmodel Attachment {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n  taskId         String @db.Uuid\n  uploadedById   String @db.Uuid\n\n  originalName String\n  fileName     String\n  mimeType     String\n  size         Int\n\n  url        String\n  storageKey String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  task         Task         @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  uploadedBy   User         @relation(fields: [uploadedById], references: [id], onDelete: Cascade)\n\n  @@index([taskId])\n  @@index([organizationId])\n  @@map("attachments")\n}\n\nmodel Comment {\n  id     String @id @default(uuid()) @db.Uuid\n  taskId String @db.Uuid\n  userId String @db.Uuid\n\n  content String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([taskId])\n  @@index([userId])\n  @@map("comments")\n}\n\nenum PlatformRole {\n  SUPER_ADMIN\n  USER\n}\n\nenum OrganizationRole {\n  ORG_ADMIN\n  PROJECT_MANAGER\n  TEAM_LEAD\n  MEMBER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum AuthProvider {\n  CREDENTIALS\n  GOOGLE\n  GITHUB\n  FACEBOOK\n}\n\nenum ProjectStatus {\n  PLANNING\n  ACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n\nenum SprintStatus {\n  PLANNED\n  ACTIVE\n  COMPLETED\n  CANCELLED\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  IN_REVIEW\n  BLOCKED\n  DONE\n  CANCELLED\n}\n\nenum Priority {\n  LOW\n  MEDIUM\n  HIGH\n  URGENT\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  EXPIRED\n  CANCELLED\n}\n\nenum NotificationType {\n  TASK_ASSIGNED\n  TASK_MENTIONED\n  COMMENT_ADDED\n  TASK_STATUS_CHANGED\n  PROJECT_INVITATION\n  TEAM_INVITATION\n  SPRINT_STARTED\n  SPRINT_COMPLETED\n  DEADLINE_APPROACHING\n  SYSTEM\n}\n\nenum SubscriptionStatus {\n  TRIALING\n  ACTIVE\n  PAST_DUE\n  CANCELLED\n  EXPIRED\n}\n\nenum BillingInterval {\n  MONTHLY\n  YEARLY\n}\n\nenum InvoiceStatus {\n  DRAFT\n  OPEN\n  PAID\n  VOID\n  UNCOLLECTIBLE\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  BKASH\n}\n\nenum ActivityAction {\n  CREATED\n  UPDATED\n  DELETED\n  ASSIGNED\n  UNASSIGNED\n  STATUS_CHANGED\n  PRIORITY_CHANGED\n  MEMBER_ADDED\n  MEMBER_REMOVED\n  COMMENTED\n  ATTACHED\n  DETACHED\n  INVITED\n  LOGIN\n  LOGOUT\n  SPRINT_STARTED\n  SPRINT_COMPLETED\n  SUBSCRIPTION_CREATED\n  PAYMENT_SUBMITTED\n  PAYMENT_APPROVED\n  PAYMENT_REJECTED\n  PLAN_UPGRADED\n  PLAN_DOWNGRADED\n  SUBSCRIPTION_CANCELLED\n  SUBSCRIPTION_RESUMED\n}\n\nmodel Invitation {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n  invitedById    String @db.Uuid\n\n  email            String\n  organizationRole OrganizationRole\n\n  token  String           @unique\n  status InvitationStatus @default(PENDING)\n\n  expiresAt  DateTime\n  acceptedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id])\n\n  invitedBy User @relation(fields: [invitedById], references: [id])\n\n  @@index([organizationId])\n  @@index([email])\n  @@index([status])\n  @@index([expiresAt])\n  @@map("invitations")\n}\n\nmodel Invoice {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n  subscriptionId String @db.Uuid\n\n  invoiceNumber String @unique\n\n  subtotal Decimal @db.Decimal(10, 2)\n  tax      Decimal @default(0) @db.Decimal(10, 2)\n  total    Decimal @db.Decimal(10, 2)\n\n  status InvoiceStatus\n\n  periodStart DateTime\n  periodEnd   DateTime\n\n  dueDate DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)\n  payments     Payment[]\n\n  @@map("invoices")\n}\n\nmodel Label {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n\n  name  String\n  color String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  taskLabels   TaskLabel[]\n\n  @@unique([organizationId, name])\n  @@index([organizationId])\n  @@map("labels")\n}\n\nmodel Notification {\n  id             String @id @default(uuid()) @db.Uuid\n  userId         String @db.Uuid\n  organizationId String @db.Uuid\n\n  type NotificationType\n\n  title   String\n  message String\n\n  entityType String?\n  entityId   String?\n\n  metadata Json?\n\n  readAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n\n  @@index([userId, createdAt])\n  @@index([userId, readAt])\n  @@index([organizationId])\n  @@map("notifications")\n}\n\nmodel OAuthAccount {\n  id     String @id @default(uuid()) @db.Uuid\n  userId String @db.Uuid\n\n  provider          AuthProvider\n  providerAccountId String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerAccountId])\n  @@index([userId])\n  @@map("oauthaccounts")\n}\n\nmodel Organization {\n  id           String  @id @default(uuid()) @db.Uuid\n  name         String\n  slug         String  @unique\n  logo         String?\n  logoPublicId String?\n  description  String?\n\n  createdAt DateTime             @default(now())\n  updatedAt DateTime             @updatedAt\n  deletedAt DateTime?\n  members   OrganizationMember[]\n\n  invitations Invitation[]\n\n  teams Team[]\n\n  projects Project[]\n\n  labels        Label[]\n  attachments   Attachment[]\n  activities    Activity[]\n  notifications Notification[]\n  subscription  Subscription?\n  invoices      Invoice[]\n  payments      Payment[]\n}\n\nmodel OrganizationMember {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n  userId         String @db.Uuid\n\n  organizationRole OrganizationRole @default(MEMBER)\n\n  joinedAt DateTime @default(now())\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([organizationId, userId])\n  @@index([organizationId])\n  @@index([userId])\n  @@index([organizationId, organizationRole])\n}\n\nmodel Payment {\n  id             String @id @default(uuid()) @db.Uuid\n  invoiceId      String @db.Uuid\n  organizationId String @db.Uuid\n\n  paymentMethod PaymentMethod\n  amount        Decimal       @db.Decimal(10, 2)\n  transactionId String?       @unique\n  senderNumber  String?\n\n  status PaymentStatus @default(PENDING)\n\n  verifiedAt    DateTime?\n  verifiedById  String?   @db.Uuid\n  failureReason String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  invoice      Invoice      @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  verifiedBy   User?        @relation(fields: [verifiedById], references: [id])\n\n  @@map("payments")\n}\n\nmodel Plan {\n  id          String  @id @default(uuid()) @db.Uuid\n  name        String  @unique\n  description String?\n\n  priceMonthly Decimal @db.Decimal(10, 2)\n  priceYearly  Decimal @db.Decimal(10, 2)\n\n  maxMembers      Int?\n  maxTeams        Int?\n  maxProjects     Int?\n  maxStorageBytes BigInt?\n\n  isActive Boolean @default(true)\n\n  subscriptions Subscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("plans")\n}\n\nmodel Project {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n\n  name        String\n  slug        String\n  description String?\n\n  status ProjectStatus @default(PLANNING)\n\n  startDate DateTime?\n  endDate   DateTime?\n\n  createdById String @db.Uuid\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  organization Organization @relation(fields: [organizationId], references: [id])\n  createdBy    User         @relation(fields: [createdById], references: [id])\n\n  projectMembers ProjectMember[]\n  sprints        Sprint[]\n  tasks          Task[]\n\n  @@unique([organizationId, slug])\n  @@index([organizationId])\n  @@index([status])\n  @@index([createdById])\n  @@map("projects")\n}\n\nmodel ProjectMember {\n  projectId String @db.Uuid\n  userId    String @db.Uuid\n\n  joinedAt DateTime @default(now())\n\n  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@id([projectId, userId])\n  @@index([userId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Sprint {\n  id        String @id @default(uuid()) @db.Uuid\n  projectId String @db.Uuid\n\n  name String\n  goal String?\n\n  startDate DateTime?\n  endDate   DateTime?\n\n  status SprintStatus @default(PLANNED)\n\n  createdById String @db.Uuid\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  createdBy User    @relation(fields: [createdById], references: [id], onDelete: Cascade)\n  tasks     Task[]\n\n  @@index([projectId])\n  @@index([status])\n  @@index([startDate])\n  @@index([endDate])\n  @@map("sprints")\n}\n\nmodel Subscription {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @unique @db.Uuid\n\n  planId String @db.Uuid\n\n  status   SubscriptionStatus @default(TRIALING)\n  interval BillingInterval    @default(MONTHLY)\n\n  currentPeriodStart DateTime\n  currentPeriodEnd   DateTime\n\n  cancelAtPeriodEnd Boolean   @default(false)\n  cancelledAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  plan         Plan         @relation(fields: [planId], references: [id])\n  invoices     Invoice[]\n\n  @@map("subscriptions")\n}\n\nmodel Task {\n  id String @id @default(uuid()) @db.Uuid\n\n  projectId String  @db.Uuid\n  sprintId  String? @db.Uuid\n\n  parentTaskId String? @db.Uuid\n\n  title       String\n  description String?\n\n  status   TaskStatus @default(TODO)\n  priority Priority   @default(MEDIUM)\n\n  assigneeId  String? @db.Uuid\n  createdById String  @db.Uuid\n\n  dueDate        DateTime?\n  estimatedHours Decimal?  @db.Decimal(8, 2)\n\n  position Int @default(0)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  sprint Sprint? @relation(fields: [sprintId], references: [id], onDelete: SetNull)\n\n  parentTask Task? @relation("TaskHierarchy", fields: [parentTaskId], references: [id], onDelete: Cascade)\n\n  subtasks Task[] @relation("TaskHierarchy")\n\n  assignee User? @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)\n\n  createdBy  User        @relation("TaskCreator", fields: [createdById], references: [id], onDelete: Cascade)\n  taskLabels TaskLabel[]\n\n  comments    Comment[]\n  attachments Attachment[]\n\n  @@index([projectId])\n  @@index([sprintId])\n  @@index([parentTaskId])\n  @@index([assigneeId])\n  @@index([createdById])\n  @@index([status])\n  @@index([priority])\n  @@index([dueDate])\n  @@index([projectId, status])\n  @@index([projectId, assigneeId])\n  @@map("tasks")\n}\n\nmodel TaskLabel {\n  taskId  String @db.Uuid\n  labelId String @db.Uuid\n\n  task  Task  @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  label Label @relation(fields: [labelId], references: [id], onDelete: Cascade)\n\n  @@id([taskId, labelId])\n  @@index([labelId])\n  @@map("task_labels")\n}\n\nmodel Team {\n  id             String @id @default(uuid()) @db.Uuid\n  organizationId String @db.Uuid\n\n  name        String\n  description String?\n\n  createdById String  @db.Uuid\n  teamLeadId  String? @db.Uuid\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organization Organization @relation(fields: [organizationId], references: [id])\n  createdBy    User         @relation("TeamCreator", fields: [createdById], references: [id])\n  teamLead     User?        @relation("TeamLead", fields: [teamLeadId], references: [id])\n\n  members TeamMember[]\n\n  @@unique([organizationId, name])\n  @@index([organizationId])\n  @@index([createdById])\n  @@index([teamLeadId])\n  @@map("teams")\n}\n\nmodel TeamMember {\n  teamId String @db.Uuid\n  userId String @db.Uuid\n\n  joinedAt DateTime @default(now())\n\n  team Team @relation(fields: [teamId], references: [id])\n  user User @relation(fields: [userId], references: [id])\n\n  @@id([teamId, userId])\n  @@index([userId])\n  @@map("team_members")\n}\n\nmodel User {\n  id             String       @id @default(uuid()) @db.Uuid\n  name           String\n  email          String       @unique\n  password       String?\n  avatar         String?\n  avatarPublicId String?\n  platformRole   PlatformRole @default(USER)\n  isActive       Boolean      @default(true)\n  emailVerified  Boolean      @default(false)\n  status         UserStatus   @default(ACTIVE)\n  isDeleted      Boolean      @default(false)\n  deletedAt      DateTime?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  oauthAccounts  OAuthAccount[]\n  memberships    OrganizationMember[]\n  invitations    Invitation[]\n  teamMembers    TeamMember[]\n  teams          Team[]               @relation("TeamCreator")\n  ledTeams       Team[]               @relation("TeamLead")\n  projects       Project[]\n  projectMembers ProjectMember[]\n  sprints        Sprint[]\n\n  tasks        Task[] @relation("TaskAssignee")\n  taskcreators Task[] @relation("TaskCreator")\n\n  comments         Comment[]\n  attachments      Attachment[]\n  activities       Activity[]\n  notifications    Notification[]\n  verifiedPayments Payment[]\n\n  @@index([email])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"Activity":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"action","kind":"enum","type":"ActivityAction"},{"name":"entityType","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"ActivityToOrganization"},{"name":"actor","kind":"object","type":"User","relationName":"ActivityToUser"}],"dbName":"activities","schema":null},"Attachment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"uploadedById","kind":"scalar","type":"String"},{"name":"originalName","kind":"scalar","type":"String"},{"name":"fileName","kind":"scalar","type":"String"},{"name":"mimeType","kind":"scalar","type":"String"},{"name":"size","kind":"scalar","type":"Int"},{"name":"url","kind":"scalar","type":"String"},{"name":"storageKey","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"AttachmentToOrganization"},{"name":"task","kind":"object","type":"Task","relationName":"AttachmentToTask"},{"name":"uploadedBy","kind":"object","type":"User","relationName":"AttachmentToUser"}],"dbName":"attachments","schema":null},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"user","kind":"object","type":"User","relationName":"CommentToUser"}],"dbName":"comments","schema":null},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"invitedById","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"organizationRole","kind":"enum","type":"OrganizationRole"},{"name":"token","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"InvitationToOrganization"},{"name":"invitedBy","kind":"object","type":"User","relationName":"InvitationToUser"}],"dbName":"invitations","schema":null},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"invoiceNumber","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"InvoiceStatus"},{"name":"periodStart","kind":"scalar","type":"DateTime"},{"name":"periodEnd","kind":"scalar","type":"DateTime"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"InvoiceToOrganization"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"InvoiceToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"InvoiceToPayment"}],"dbName":"invoices","schema":null},"Label":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"LabelToOrganization"},{"name":"taskLabels","kind":"object","type":"TaskLabel","relationName":"LabelToTaskLabel"}],"dbName":"labels","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"entityType","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"NotificationToOrganization"}],"dbName":"notifications","schema":null},"OAuthAccount":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"AuthProvider"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OAuthAccountToUser"}],"dbName":"oauthaccounts","schema":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"logoPublicId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"members","kind":"object","type":"OrganizationMember","relationName":"OrganizationToOrganizationMember"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToOrganization"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"labels","kind":"object","type":"Label","relationName":"LabelToOrganization"},{"name":"attachments","kind":"object","type":"Attachment","relationName":"AttachmentToOrganization"},{"name":"activities","kind":"object","type":"Activity","relationName":"ActivityToOrganization"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToOrganization"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"},{"name":"invoices","kind":"object","type":"Invoice","relationName":"InvoiceToOrganization"},{"name":"payments","kind":"object","type":"Payment","relationName":"OrganizationToPayment"}],"dbName":null,"schema":null},"OrganizationMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"organizationRole","kind":"enum","type":"OrganizationRole"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMember"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMemberToUser"}],"dbName":null,"schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"invoiceId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"senderNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"verifiedById","kind":"scalar","type":"String"},{"name":"failureReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToPayment"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToPayment"},{"name":"verifiedBy","kind":"object","type":"User","relationName":"PaymentToUser"}],"dbName":"payments","schema":null},"Plan":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"priceMonthly","kind":"scalar","type":"Decimal"},{"name":"priceYearly","kind":"scalar","type":"Decimal"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"maxTeams","kind":"scalar","type":"Int"},{"name":"maxProjects","kind":"scalar","type":"Int"},{"name":"maxStorageBytes","kind":"scalar","type":"BigInt"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"PlanToSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"plans","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ProjectStatus"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"createdBy","kind":"object","type":"User","relationName":"ProjectToUser"},{"name":"projectMembers","kind":"object","type":"ProjectMember","relationName":"ProjectToProjectMember"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectMember":{"fields":[{"name":"projectId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectMember"},{"name":"user","kind":"object","type":"User","relationName":"ProjectMemberToUser"}],"dbName":null,"schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"createdBy","kind":"object","type":"User","relationName":"SprintToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"planId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"interval","kind":"enum","type":"BillingInterval"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"},{"name":"plan","kind":"object","type":"Plan","relationName":"PlanToSubscription"},{"name":"invoices","kind":"object","type":"Invoice","relationName":"InvoiceToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"sprintId","kind":"scalar","type":"String"},{"name":"parentTaskId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"Priority"},{"name":"assigneeId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"estimatedHours","kind":"scalar","type":"Decimal"},{"name":"position","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"TaskHierarchy"},{"name":"subtasks","kind":"object","type":"Task","relationName":"TaskHierarchy"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"createdBy","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"taskLabels","kind":"object","type":"TaskLabel","relationName":"TaskToTaskLabel"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"},{"name":"attachments","kind":"object","type":"Attachment","relationName":"AttachmentToTask"}],"dbName":"tasks","schema":null},"TaskLabel":{"fields":[{"name":"taskId","kind":"scalar","type":"String"},{"name":"labelId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskLabel"},{"name":"label","kind":"object","type":"Label","relationName":"LabelToTaskLabel"}],"dbName":"task_labels","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"teamLeadId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"createdBy","kind":"object","type":"User","relationName":"TeamCreator"},{"name":"teamLead","kind":"object","type":"User","relationName":"TeamLead"},{"name":"members","kind":"object","type":"TeamMember","relationName":"TeamToTeamMember"}],"dbName":"teams","schema":null},"TeamMember":{"fields":[{"name":"teamId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMember"},{"name":"user","kind":"object","type":"User","relationName":"TeamMemberToUser"}],"dbName":"team_members","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"avatarPublicId","kind":"scalar","type":"String"},{"name":"platformRole","kind":"enum","type":"PlatformRole"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"oauthAccounts","kind":"object","type":"OAuthAccount","relationName":"OAuthAccountToUser"},{"name":"memberships","kind":"object","type":"OrganizationMember","relationName":"OrganizationMemberToUser"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToUser"},{"name":"teamMembers","kind":"object","type":"TeamMember","relationName":"TeamMemberToUser"},{"name":"teams","kind":"object","type":"Team","relationName":"TeamCreator"},{"name":"ledTeams","kind":"object","type":"Team","relationName":"TeamLead"},{"name":"projects","kind":"object","type":"Project","relationName":"ProjectToUser"},{"name":"projectMembers","kind":"object","type":"ProjectMember","relationName":"ProjectMemberToUser"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"SprintToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"taskcreators","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"attachments","kind":"object","type":"Attachment","relationName":"AttachmentToUser"},{"name":"activities","kind":"object","type":"Activity","relationName":"ActivityToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"verifiedPayments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","user","oauthAccounts","memberships","invitedBy","invitations","createdBy","teamLead","members","_count","team","teamMembers","teams","ledTeams","project","projectMembers","sprint","parentTask","subtasks","assignee","task","taskLabels","label","comments","uploadedBy","attachments","tasks","sprints","projects","taskcreators","activities","notifications","subscriptions","plan","invoices","subscription","payments","invoice","verifiedBy","verifiedPayments","labels","actor","Activity.findUnique","Activity.findUniqueOrThrow","Activity.findFirst","Activity.findFirstOrThrow","Activity.findMany","data","Activity.createOne","Activity.createMany","Activity.createManyAndReturn","Activity.updateOne","Activity.updateMany","Activity.updateManyAndReturn","create","update","Activity.upsertOne","Activity.deleteOne","Activity.deleteMany","having","_min","_max","Activity.groupBy","Activity.aggregate","Attachment.findUnique","Attachment.findUniqueOrThrow","Attachment.findFirst","Attachment.findFirstOrThrow","Attachment.findMany","Attachment.createOne","Attachment.createMany","Attachment.createManyAndReturn","Attachment.updateOne","Attachment.updateMany","Attachment.updateManyAndReturn","Attachment.upsertOne","Attachment.deleteOne","Attachment.deleteMany","_avg","_sum","Attachment.groupBy","Attachment.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Invoice.findUnique","Invoice.findUniqueOrThrow","Invoice.findFirst","Invoice.findFirstOrThrow","Invoice.findMany","Invoice.createOne","Invoice.createMany","Invoice.createManyAndReturn","Invoice.updateOne","Invoice.updateMany","Invoice.updateManyAndReturn","Invoice.upsertOne","Invoice.deleteOne","Invoice.deleteMany","Invoice.groupBy","Invoice.aggregate","Label.findUnique","Label.findUniqueOrThrow","Label.findFirst","Label.findFirstOrThrow","Label.findMany","Label.createOne","Label.createMany","Label.createManyAndReturn","Label.updateOne","Label.updateMany","Label.updateManyAndReturn","Label.upsertOne","Label.deleteOne","Label.deleteMany","Label.groupBy","Label.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","OAuthAccount.findUnique","OAuthAccount.findUniqueOrThrow","OAuthAccount.findFirst","OAuthAccount.findFirstOrThrow","OAuthAccount.findMany","OAuthAccount.createOne","OAuthAccount.createMany","OAuthAccount.createManyAndReturn","OAuthAccount.updateOne","OAuthAccount.updateMany","OAuthAccount.updateManyAndReturn","OAuthAccount.upsertOne","OAuthAccount.deleteOne","OAuthAccount.deleteMany","OAuthAccount.groupBy","OAuthAccount.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","OrganizationMember.findUnique","OrganizationMember.findUniqueOrThrow","OrganizationMember.findFirst","OrganizationMember.findFirstOrThrow","OrganizationMember.findMany","OrganizationMember.createOne","OrganizationMember.createMany","OrganizationMember.createManyAndReturn","OrganizationMember.updateOne","OrganizationMember.updateMany","OrganizationMember.updateManyAndReturn","OrganizationMember.upsertOne","OrganizationMember.deleteOne","OrganizationMember.deleteMany","OrganizationMember.groupBy","OrganizationMember.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Plan.findUnique","Plan.findUniqueOrThrow","Plan.findFirst","Plan.findFirstOrThrow","Plan.findMany","Plan.createOne","Plan.createMany","Plan.createManyAndReturn","Plan.updateOne","Plan.updateMany","Plan.updateManyAndReturn","Plan.upsertOne","Plan.deleteOne","Plan.deleteMany","Plan.groupBy","Plan.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectMember.findUnique","ProjectMember.findUniqueOrThrow","ProjectMember.findFirst","ProjectMember.findFirstOrThrow","ProjectMember.findMany","ProjectMember.createOne","ProjectMember.createMany","ProjectMember.createManyAndReturn","ProjectMember.updateOne","ProjectMember.updateMany","ProjectMember.updateManyAndReturn","ProjectMember.upsertOne","ProjectMember.deleteOne","ProjectMember.deleteMany","ProjectMember.groupBy","ProjectMember.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskLabel.findUnique","TaskLabel.findUniqueOrThrow","TaskLabel.findFirst","TaskLabel.findFirstOrThrow","TaskLabel.findMany","TaskLabel.createOne","TaskLabel.createMany","TaskLabel.createManyAndReturn","TaskLabel.updateOne","TaskLabel.updateMany","TaskLabel.updateManyAndReturn","TaskLabel.upsertOne","TaskLabel.deleteOne","TaskLabel.deleteMany","TaskLabel.groupBy","TaskLabel.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMember.findUnique","TeamMember.findUniqueOrThrow","TeamMember.findFirst","TeamMember.findFirstOrThrow","TeamMember.findMany","TeamMember.createOne","TeamMember.createMany","TeamMember.createManyAndReturn","TeamMember.updateOne","TeamMember.updateMany","TeamMember.updateManyAndReturn","TeamMember.upsertOne","TeamMember.deleteOne","TeamMember.deleteMany","TeamMember.groupBy","TeamMember.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","avatar","avatarPublicId","PlatformRole","platformRole","isActive","emailVerified","UserStatus","status","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","joinedAt","organizationId","description","createdById","teamLeadId","taskId","labelId","projectId","sprintId","parentTaskId","title","TaskStatus","Priority","priority","assigneeId","dueDate","estimatedHours","position","planId","SubscriptionStatus","BillingInterval","interval","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","cancelledAt","goal","startDate","endDate","SprintStatus","slug","ProjectStatus","priceMonthly","priceYearly","maxMembers","maxTeams","maxProjects","maxStorageBytes","invoiceId","PaymentMethod","paymentMethod","amount","transactionId","senderNumber","PaymentStatus","verifiedAt","verifiedById","failureReason","OrganizationRole","organizationRole","logo","logoPublicId","AuthProvider","provider","providerAccountId","NotificationType","type","message","entityType","entityId","metadata","readAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","color","subscriptionId","invoiceNumber","subtotal","tax","total","InvoiceStatus","periodStart","periodEnd","invitedById","token","InvitationStatus","expiresAt","acceptedAt","content","uploadedById","originalName","fileName","mimeType","size","url","storageKey","actorId","ActivityAction","action","organizationId_name","taskId_labelId","projectId_userId","organizationId_slug","teamId_userId","provider_providerAccountId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "2g29AdACDgMAAPoFACAsAACNBgAghQMAAI4GADCGAwAATgAQhwMAAI4GADCIAwEAAAABlgNAAI0FACGpAwEAyQUAIaoDAQCIBQAh4gMBAIcFACHjAwEAhwUAIeQDAACMBgAgggQBAMkFACGEBAAAjwaEBCIBAAAAAQAgCgMAAPoFACAEAACNBgAghQMAALEGADCGAwAAAwAQhwMAALEGADCIAwEAyQUAIacDAQDJBQAhqANAAI0FACGpAwEAyQUAIdkDAACrBtkDIgIDAADiCwAgBAAA5gsAIAsDAAD6BQAgBAAAjQYAIIUDAACxBgAwhgMAAAMAEIcDAACxBgAwiAMBAAAAAacDAQDJBQAhqANAAI0FACGpAwEAyQUAIdkDAACrBtkDIosEAACwBgAgAwAAAAMAIAEAAAQAMAIAAAUAIAoEAACNBgAghQMAAK4GADCGAwAABwAQhwMAAK4GADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGnAwEAyQUAId0DAACvBt0DIt4DAQCHBQAhAQQAAOYLACALBAAAjQYAIIUDAACuBgAwhgMAAAcAEIcDAACuBgAwiAMBAAAAAZYDQACNBQAhlwNAAI0FACGnAwEAyQUAId0DAACvBt0DIt4DAQCHBQAhigQAAK0GACADAAAABwAgAQAACAAwAgAACQAgAwAAAAMAIAEAAAQAMAIAAAUAIBADAAD6BQAgBwAAjQYAIIUDAACqBgAwhgMAAAwAEIcDAACqBgAwiAMBAMkFACGKAwEAhwUAIZMDAACsBvgDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIdkDAACrBtkDIvUDAQDJBQAh9gMBAIcFACH4A0AAjQUAIfkDQACMBQAhAwMAAOILACAHAADmCwAg-QMAALIGACAQAwAA-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_AMBAIcFACH9AwEAhwUAIf4DAQCHBQAh_wMCAJEGACGABAEAhwUAIYEEAQCHBQAhAwMAAOILACAXAADnCwAgGwAA5gsAIBIDAAD6BQAgFwAAkgYAIBsAAI0GACCFAwAAkAYAMIYDAAA7ABCHAwAAkAYAMIgDAQAAAAGWA0AAjQUAIZcDQACNBQAhqQMBAMkFACGtAwEAyQUAIfsDAQDJBQAh_AMBAIcFACH9AwEAhwUAIf4DAQCHBQAh_wMCAJEGACGABAEAhwUAIYEEAQCHBQAhAwAAADsAIAEAADwAMAIAAD0AIAEAAAApACABAAAAMQAgAQAAADcAIAEAAAA7ACABAAAAKQAgAwAAACkAIAEAACoAMAIAACsAIAEAAAAhACABAAAAJQAgAQAAACkAIAMAAAAhACABAAAiADACAAAjACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACkAIAEAACoAMAIAACsAIAMAAAApACABAAAqADACAAArACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADsAIAEAADwAMAIAAD0AIA4DAAD6BQAgLAAAjQYAIIUDAACOBgAwhgMAAE4AEIcDAACOBgAwiAMBAMkFACGWA0AAjQUAIakDAQDJBQAhqgMBAIgFACHiAwEAhwUAIeMDAQCHBQAh5AMAAIwGACCCBAEAyQUAIYQEAACPBoQEIgQDAADiCwAgLAAA5gsAIKoDAACyBgAg5AMAALIGACADAAAATgAgAQAATwAwAgAAAQAgEQMAAPoFACAEAACNBgAghQMAAIoGADCGAwAAUQAQhwMAAIoGADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGnAwEAyQUAIakDAQDJBQAhsgMBAIcFACHgAwAAiwbgAyLhAwEAhwUAIeIDAQCIBQAh4wMBAIgFACHkAwAAjAYAIOUDQACMBQAhBgMAAOILACAEAADmCwAg4gMAALIGACDjAwAAsgYAIOQDAACyBgAg5QMAALIGACARAwAA-gUAIAQAAI0GACCFAwAAigYAMIYDAABRABCHAwAAigYAMIgDAQAAAAGWA0AAjQUAIZcDQACNBQAhpwMBAMkFACGpAwEAyQUAIbIDAQCHBQAh4AMAAIsG4AMi4QMBAIcFACHiAwEAiAUAIeMDAQCIBQAh5AMAAIwGACDlA0AAjAUAIQMAAABRACABAABSADACAABTACATAwAA-gUAICgAAIcGACApAACIBgAghQMAAIMGADCGAwAAVQAQhwMAAIMGADCIAwEAyQUAIZMDAACFBtUDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIc4DAQDJBQAh0AMAAIQG0AMi0QMQAMoFACHSAwEAiAUAIdMDAQCIBQAh1QNAAIwFACHWAwEAhgYAIdcDAQCIBQAhCAMAAOILACAoAADlCwAgKQAA5gsAINIDAACyBgAg0wMAALIGACDVAwAAsgYAINYDAACyBgAg1wMAALIGACATAwAA-gUAICgAAIcGACApAACIBgAghQMAAIMGADCGAwAAVQAQhwMAAIMGADCIAwEAAAABkwMAAIUG1QMilgNAAI0FACGXA0AAjQUAIakDAQDJBQAhzgMBAMkFACHQAwAAhAbQAyLRAxAAygUAIdIDAQAAAAHTAwEAiAUAIdUDQACMBQAh1gMBAIYGACHXAwEAiAUAIQMAAABVACABAABWADACAABXACARAwAA-gUAICQAAIIGACAlAADeBQAghQMAAP8FADCGAwAAWQAQhwMAAP8FADCIAwEAyQUAIZMDAACABrwDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIboDAQDJBQAhvQMAAIEGvQMivgNAAI0FACG_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_AMBAAAAAf0DAQAAAAH-AwEAAAAB_wMCAAAAAYAEAQAAAAGBBAEAAAABATIAAKcBACAMiAMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAa0DAQAAAAH7AwEAAAAB_AMBAAAAAf0DAQAAAAH-AwEAAAAB_wMCAAAAAYAEAQAAAAGBBAEAAAABATIAAKkBADABMgAAqQEAMA8DAACKBwAgFwAAiwcAIBsAALsHACCIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIa0DAQC2BgAh-wMBALYGACH8AwEAtgYAIf0DAQC2BgAh_gMBALYGACH_AwIAiAcAIYAEAQC2BgAhgQQBALYGACECAAAAPQAgMgAArAEAIAyIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIa0DAQC2BgAh-wMBALYGACH8AwEAtgYAIf0DAQC2BgAh_gMBALYGACH_AwIAiAcAIYAEAQC2BgAhgQQBALYGACECAAAAOwAgMgAArgEAIAIAAAA7ACAyAACuAQAgAwAAAD0AIDkAAKcBACA6AACsAQAgAQAAAD0AIAEAAAA7ACAFDAAA2gsAID8AAN0LACBAAADcCwAgUQAA2wsAIFIAAN4LACAPhQMAAPMFADCGAwAAtQEAEIcDAADzBQAwiAMBAO0EACGWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACGtAwEA7QQAIfsDAQDtBAAh_AMBAO4EACH9AwEA7gQAIf4DAQDuBAAh_wMCAKUFACGABAEA7gQAIYEEAQDuBAAhAwAAADsAIAEAALQBADA-AAC1AQAgAwAAADsAIAEAADwAMAIAAD0AIAEAAAA5ACABAAAAOQAgAwAAADcAIAEAADgAMAIAADkAIAMAAAA3ACABAAA4ADACAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgCAQAAMgHACAXAACcBwAgiAMBAAAAAZYDQAAAAAGXA0AAAAABpwMBAAAAAa0DAQAAAAH6AwEAAAABATIAAL0BACAGiAMBAAAAAZYDQAAAAAGXA0AAAAABpwMBAAAAAa0DAQAAAAH6AwEAAAABATIAAL8BADABMgAAvwEAMAgEAADGBwAgFwAAmgcAIIgDAQC2BgAhlgNAALwGACGXA0AAvAYAIacDAQC2BgAhrQMBALYGACH6AwEAtgYAIQIAAAA5ACAyAADCAQAgBogDAQC2BgAhlgNAALwGACGXA0AAvAYAIacDAQC2BgAhrQMBALYGACH6AwEAtgYAIQIAAAA3ACAyAADEAQAgAgAAADcAIDIAAMQBACADAAAAOQAgOQAAvQEAIDoAAMIBACABAAAAOQAgAQAAADcAIAMMAADXCwAgPwAA2QsAIEAAANgLACAJhQMAAPIFADCGAwAAywEAEIcDAADyBQAwiAMBAO0EACGWA0AA9AQAIZcDQAD0BAAhpwMBAO0EACGtAwEA7QQAIfoDAQDuBAAhAwAAADcAIAEAAMoBADA-AADLAQAgAwAAADcAIAEAADgAMAIAADkAIAEAAAAOACABAAAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACADAAAADAAgAQAADQAwAgAADgAgDQMAAJUJACAHAACqCwAgiAMBAAAAAYoDAQAAAAGTAwAAAPgDApYDQAAAAAGXA0AAAAABqQMBAAAAAdkDAAAA2QMC9QMBAAAAAfYDAQAAAAH4A0AAAAAB-QNAAAAAAQEyAADTAQAgC4gDAQAAAAGKAwEAAAABkwMAAAD4AwKWA0AAAAABlwNAAAAAAakDAQAAAAHZAwAAANkDAvUDAQAAAAH2AwEAAAAB-ANAAAAAAfkDQAAAAAEBMgAA1QEAMAEyAADVAQAwDQMAAJMJACAHAACoCwAgiAMBALYGACGKAwEAtgYAIZMDAACRCfgDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIdkDAACQCdkDIvUDAQC2BgAh9gMBALYGACH4A0AAvAYAIfkDQAC7BgAhAgAAAA4AIDIAANgBACALiAMBALYGACGKAwEAtgYAIZMDAACRCfgDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIdkDAACQCdkDIvUDAQC2BgAh9gMBALYGACH4A0AAvAYAIfkDQAC7BgAhAgAAAAwAIDIAANoBACACAAAADAAgMgAA2gEAIAMAAAAOACA5AADTAQAgOgAA2AEAIAEAAAAOACABAAAADAAgBAwAANQLACA_AADWCwAgQAAA1QsAIPkDAACyBgAgDoUDAADuBQAwhgMAAOEBABCHAwAA7gUAMIgDAQDtBAAhigMBAO4EACGTAwAA7wX4AyKWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACHZAwAA1wXZAyL1AwEA7QQAIfYDAQDuBAAh-ANAAPQEACH5A0AA8wQAIQMAAAAMACABAADgAQAwPgAA4QEAIAMAAAAMACABAAANADACAAAOACABAAAAYAAgAQAAAGAAIAMAAABeACABAABfADACAABgACADAAAAXgAgAQAAXwAwAgAAYAAgAwAAAF4AIAEAAF8AMAIAAGAAIBADAACBCgAgJgAA0goAICcAAIIKACCIAwEAAAABkwMAAADzAwKWA0AAAAABlwNAAAAAAakDAQAAAAG3A0AAAAAB7QMBAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQEyAADpAQAgDYgDAQAAAAGTAwAAAPMDApYDQAAAAAGXA0AAAAABqQMBAAAAAbcDQAAAAAHtAwEAAAAB7gMBAAAAAe8DEAAAAAHwAxAAAAAB8QMQAAAAAfMDQAAAAAH0A0AAAAABATIAAOsBADABMgAA6wEAMBADAADzCQAgJgAA0AoAICcAAPQJACCIAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIbcDQAC7BgAh7QMBALYGACHuAwEAtgYAIe8DEADYBgAh8AMQANgGACHxAxAA2AYAIfMDQAC8BgAh9ANAALwGACECAAAAYAAgMgAA7gEAIA2IAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIbcDQAC7BgAh7QMBALYGACHuAwEAtgYAIe8DEADYBgAh8AMQANgGACHxAxAA2AYAIfMDQAC8BgAh9ANAALwGACECAAAAXgAgMgAA8AEAIAIAAABeACAyAADwAQAgAwAAAGAAIDkAAOkBACA6AADuAQAgAQAAAGAAIAEAAABeACAGDAAAzwsAID8AANILACBAAADRCwAgUQAA0AsAIFIAANMLACC3AwAAsgYAIBCFAwAA6gUAMIYDAAD3AQAQhwMAAOoFADCIAwEA7QQAIZMDAADrBfMDIpYDQAD0BAAhlwNAAPQEACGpAwEA7QQAIbcDQADzBAAh7QMBAO0EACHuAwEA7gQAIe8DEAC_BQAh8AMQAL8FACHxAxAAvwUAIfMDQAD0BAAh9ANAAPQEACEDAAAAXgAgAQAA9gEAMD4AAPcBACADAAAAXgAgAQAAXwAwAgAAYAAgAQAAAHsAIAEAAAB7ACADAAAAeQAgAQAAegAwAgAAewAgAwAAAHkAIAEAAHoAMAIAAHsAIAMAAAB5ACABAAB6ADACAAB7ACAIAwAAzgsAIBgAAI0LACCIAwEAAAABiQMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAewDAQAAAAEBMgAA_wEAIAaIAwEAAAABiQMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAewDAQAAAAEBMgAAgQIAMAEyAACBAgAwCAMAAM0LACAYAACCCwAgiAMBALYGACGJAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIewDAQC3BgAhAgAAAHsAIDIAAIQCACAGiAMBALYGACGJAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIewDAQC3BgAhAgAAAHkAIDIAAIYCACACAAAAeQAgMgAAhgIAIAMAAAB7ACA5AAD_AQAgOgAAhAIAIAEAAAB7ACABAAAAeQAgBAwAAMoLACA_AADMCwAgQAAAywsAIOwDAACyBgAgCYUDAADpBQAwhgMAAI0CABCHAwAA6QUAMIgDAQDtBAAhiQMBAO4EACGWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACHsAwEA7wQAIQMAAAB5ACABAACMAgAwPgAAjQIAIAMAAAB5ACABAAB6ADACAAB7ACABAAAAUwAgAQAAAFMAIAMAAABRACABAABSADACAABTACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIA4DAADuBgAgBAAA4goAIIgDAQAAAAGWA0AAAAABlwNAAAAAAacDAQAAAAGpAwEAAAABsgMBAAAAAeADAAAA4AMC4QMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAeUDQAAAAAEBMgAAlQIAIAyIAwEAAAABlgNAAAAAAZcDQAAAAAGnAwEAAAABqQMBAAAAAbIDAQAAAAHgAwAAAOADAuEDAQAAAAHiAwEAAAAB4wMBAAAAAeQDgAAAAAHlA0AAAAABATIAAJcCADABMgAAlwIAMA4DAADsBgAgBAAA4AoAIIgDAQC2BgAhlgNAALwGACGXA0AAvAYAIacDAQC2BgAhqQMBALYGACGyAwEAtgYAIeADAADqBuADIuEDAQC2BgAh4gMBALcGACHjAwEAtwYAIeQDgAAAAAHlA0AAuwYAIQIAAABTACAyAACaAgAgDIgDAQC2BgAhlgNAALwGACGXA0AAvAYAIacDAQC2BgAhqQMBALYGACGyAwEAtgYAIeADAADqBuADIuEDAQC2BgAh4gMBALcGACHjAwEAtwYAIeQDgAAAAAHlA0AAuwYAIQIAAABRACAyAACcAgAgAgAAAFEAIDIAAJwCACADAAAAUwAgOQAAlQIAIDoAAJoCACABAAAAUwAgAQAAAFEAIAcMAADHCwAgPwAAyQsAIEAAAMgLACDiAwAAsgYAIOMDAACyBgAg5AMAALIGACDlAwAAsgYAIA-FAwAA4wUAMIYDAACjAgAQhwMAAOMFADCIAwEA7QQAIZYDQAD0BAAhlwNAAPQEACGnAwEA7QQAIakDAQDtBAAhsgMBAO4EACHgAwAA5AXgAyLhAwEA7gQAIeIDAQDvBAAh4wMBAO8EACHkAwAA5QUAIOUDQADzBAAhAwAAAFEAIAEAAKICADA-AACjAgAgAwAAAFEAIAEAAFIAMAIAAFMAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgBwQAAMYLACCIAwEAAAABlgNAAAAAAZcDQAAAAAGnAwEAAAAB3QMAAADdAwLeAwEAAAABATIAAKsCACAGiAMBAAAAAZYDQAAAAAGXA0AAAAABpwMBAAAAAd0DAAAA3QMC3gMBAAAAAQEyAACtAgAwATIAAK0CADAHBAAAxQsAIIgDAQC2BgAhlgNAALwGACGXA0AAvAYAIacDAQC2BgAh3QMAAK4J3QMi3gMBALYGACECAAAACQAgMgAAsAIAIAaIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGnAwEAtgYAId0DAACuCd0DIt4DAQC2BgAhAgAAAAcAIDIAALICACACAAAABwAgMgAAsgIAIAMAAAAJACA5AACrAgAgOgAAsAIAIAEAAAAJACABAAAABwAgAwwAAMILACA_AADECwAgQAAAwwsAIAmFAwAA3wUAMIYDAAC5AgAQhwMAAN8FADCIAwEA7QQAIZYDQAD0BAAhlwNAAPQEACGnAwEA7QQAId0DAADgBd0DIt4DAQDuBAAhAwAAAAcAIAEAALgCADA-AAC5AgAgAwAAAAcAIAEAAAgAMAIAAAkAIBcIAACQBQAgCwAAjwUAIA8AAJIFACAcAACYBQAgHwAAkwUAICEAAJkFACAiAACaBQAgJQAA3gUAICYAAN0FACAnAACbBQAgKwAA3AUAIIUDAADbBQAwhgMAAL8CABCHAwAA2wUAMIgDAQAAAAGJAwEAhwUAIZUDQACMBQAhlgNAAI0FACGXA0AAjQUAIaoDAQCIBQAhxgMBAAAAAdoDAQCIBQAh2wMBAIgFACEBAAAAvAIAIAEAAAC8AgAgFwgAAJAFACALAACPBQAgDwAAkgUAIBwAAJgFACAfAACTBQAgIQAAmQUAICIAAJoFACAlAADeBQAgJgAA3QUAICcAAJsFACArAADcBQAghQMAANsFADCGAwAAvwIAEIcDAADbBQAwiAMBAMkFACGJAwEAhwUAIZUDQACMBQAhlgNAAI0FACGXA0AAjQUAIaoDAQCIBQAhxgMBAIcFACHaAwEAiAUAIdsDAQCIBQAhDwgAAMMJACALAADCCQAgDwAAxQkAIBwAAMsJACAfAADGCQAgIQAAzAkAICIAAM0JACAlAADBCwAgJgAAwAsAICcAAM4JACArAAC_CwAglQMAALIGACCqAwAAsgYAINoDAACyBgAg2wMAALIGACADAAAAvwIAIAEAAMACADACAAC8AgAgAwAAAL8CACABAADAAgAwAgAAvAIAIAMAAAC_AgAgAQAAwAIAMAIAALwCACAUCAAAtQsAIAsAALQLACAPAAC2CwAgHAAAuQsAIB8AALcLACAhAAC6CwAgIgAAuwsAICUAAL0LACAmAAC8CwAgJwAAvgsAICsAALgLACCIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAEBMgAAxAIAIAmIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAEBMgAAxgIAMAEyAADGAgAwFAgAALUKACALAAC0CgAgDwAAtgoAIBwAALkKACAfAAC3CgAgIQAAugoAICIAALsKACAlAAC9CgAgJgAAvAoAICcAAL4KACArAAC4CgAgiAMBALYGACGJAwEAtgYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhxgMBALYGACHaAwEAtwYAIdsDAQC3BgAhAgAAALwCACAyAADJAgAgCYgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQIAAAC_AgAgMgAAywIAIAIAAAC_AgAgMgAAywIAIAMAAAC8AgAgOQAAxAIAIDoAAMkCACABAAAAvAIAIAEAAAC_AgAgBwwAALEKACA_AACzCgAgQAAAsgoAIJUDAACyBgAgqgMAALIGACDaAwAAsgYAINsDAACyBgAgDIUDAADaBQAwhgMAANICABCHAwAA2gUAMIgDAQDtBAAhiQMBAO4EACGVA0AA8wQAIZYDQAD0BAAhlwNAAPQEACGqAwEA7wQAIcYDAQDuBAAh2gMBAO8EACHbAwEA7wQAIQMAAAC_AgAgAQAA0QIAMD4AANICACADAAAAvwIAIAEAAMACADACAAC8AgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAHAwAAowkAIAQAALAKACCIAwEAAAABpwMBAAAAAagDQAAAAAGpAwEAAAAB2QMAAADZAwIBMgAA2gIAIAWIAwEAAAABpwMBAAAAAagDQAAAAAGpAwEAAAAB2QMAAADZAwIBMgAA3AIAMAEyAADcAgAwBwMAAKEJACAEAACvCgAgiAMBALYGACGnAwEAtgYAIagDQAC8BgAhqQMBALYGACHZAwAAkAnZAyICAAAABQAgMgAA3wIAIAWIAwEAtgYAIacDAQC2BgAhqANAALwGACGpAwEAtgYAIdkDAACQCdkDIgIAAAADACAyAADhAgAgAgAAAAMAIDIAAOECACADAAAABQAgOQAA2gIAIDoAAN8CACABAAAABQAgAQAAAAMAIAMMAACsCgAgPwAArgoAIEAAAK0KACAIhQMAANYFADCGAwAA6AIAEIcDAADWBQAwiAMBAO0EACGnAwEA7QQAIagDQAD0BAAhqQMBAO0EACHZAwAA1wXZAyIDAAAAAwAgAQAA5wIAMD4AAOgCACADAAAAAwAgAQAABAAwAgAABQAgAQAAAFcAIAEAAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAMAAABVACABAABWADACAABXACAQAwAA3wYAICgAAN4GACApAAD_CQAgiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAGpAwEAAAABzgMBAAAAAdADAAAA0AMC0QMQAAAAAdIDAQAAAAHTAwEAAAAB1QNAAAAAAdYDAQAAAAHXAwEAAAABATIAAPACACANiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAGpAwEAAAABzgMBAAAAAdADAAAA0AMC0QMQAAAAAdIDAQAAAAHTAwEAAAAB1QNAAAAAAdYDAQAAAAHXAwEAAAABATIAAPICADABMgAA8gIAMAEAAAAUACAQAwAA3AYAICgAANsGACApAAD9CQAgiAMBALYGACGTAwAA2QbVAyKWA0AAvAYAIZcDQAC8BgAhqQMBALYGACHOAwEAtgYAIdADAADXBtADItEDEADYBgAh0gMBALcGACHTAwEAtwYAIdUDQAC7BgAh1gMBALcGACHXAwEAtwYAIQIAAABXACAyAAD2AgAgDYgDAQC2BgAhkwMAANkG1QMilgNAALwGACGXA0AAvAYAIakDAQC2BgAhzgMBALYGACHQAwAA1wbQAyLRAxAA2AYAIdIDAQC3BgAh0wMBALcGACHVA0AAuwYAIdYDAQC3BgAh1wMBALcGACECAAAAVQAgMgAA-AIAIAIAAABVACAyAAD4AgAgAQAAABQAIAMAAABXACA5AADwAgAgOgAA9gIAIAEAAABXACABAAAAVQAgCgwAAKcKACA_AACqCgAgQAAAqQoAIFEAAKgKACBSAACrCgAg0gMAALIGACDTAwAAsgYAINUDAACyBgAg1gMAALIGACDXAwAAsgYAIBCFAwAAzwUAMIYDAACAAwAQhwMAAM8FADCIAwEA7QQAIZMDAADRBdUDIpYDQAD0BAAhlwNAAPQEACGpAwEA7QQAIc4DAQDtBAAh0AMAANAF0AMi0QMQAL8FACHSAwEA7wQAIdMDAQDvBAAh1QNAAPMEACHWAwEAngUAIdcDAQDvBAAhAwAAAFUAIAEAAP8CADA-AACAAwAgAwAAAFUAIAEAAFYAMAIAAFcAIBAjAADNBQAghQMAAMgFADCGAwAAhgMAEIcDAADIBQAwiAMBAAAAAYkDAQAAAAGQAyAAigUAIZYDQACNBQAhlwNAAI0FACGqAwEAiAUAIcgDEADKBQAhyQMQAMoFACHKAwIAywUAIcsDAgDLBQAhzAMCAMsFACHNAwQAzAUAIQEAAACDAwAgAQAAAIMDACAQIwAAzQUAIIUDAADIBQAwhgMAAIYDABCHAwAAyAUAMIgDAQDJBQAhiQMBAIcFACGQAyAAigUAIZYDQACNBQAhlwNAAI0FACGqAwEAiAUAIcgDEADKBQAhyQMQAMoFACHKAwIAywUAIcsDAgDLBQAhzAMCAMsFACHNAwQAzAUAIQYjAACmCgAgqgMAALIGACDKAwAAsgYAIMsDAACyBgAgzAMAALIGACDNAwAAsgYAIAMAAACGAwAgAQAAhwMAMAIAAIMDACADAAAAhgMAIAEAAIcDADACAACDAwAgAwAAAIYDACABAACHAwAwAgAAgwMAIA0jAAClCgAgiAMBAAAAAYkDAQAAAAGQAyAAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAAByAMQAAAAAckDEAAAAAHKAwIAAAABywMCAAAAAcwDAgAAAAHNAwQAAAABATIAAIsDACAMiAMBAAAAAYkDAQAAAAGQAyAAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAAByAMQAAAAAckDEAAAAAHKAwIAAAABywMCAAAAAcwDAgAAAAHNAwQAAAABATIAAI0DADABMgAAjQMAMA0jAACYCgAgiAMBALYGACGJAwEAtgYAIZADIAC5BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhyAMQANgGACHJAxAA2AYAIcoDAgCWCgAhywMCAJYKACHMAwIAlgoAIc0DBACXCgAhAgAAAIMDACAyAACQAwAgDIgDAQC2BgAhiQMBALYGACGQAyAAuQYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcgDEADYBgAhyQMQANgGACHKAwIAlgoAIcsDAgCWCgAhzAMCAJYKACHNAwQAlwoAIQIAAACGAwAgMgAAkgMAIAIAAACGAwAgMgAAkgMAIAMAAACDAwAgOQAAiwMAIDoAAJADACABAAAAgwMAIAEAAACGAwAgCgwAAJEKACA_AACUCgAgQAAAkwoAIFEAAJIKACBSAACVCgAgqgMAALIGACDKAwAAsgYAIMsDAACyBgAgzAMAALIGACDNAwAAsgYAIA-FAwAAvgUAMIYDAACZAwAQhwMAAL4FADCIAwEA7QQAIYkDAQDuBAAhkAMgAPEEACGWA0AA9AQAIZcDQAD0BAAhqgMBAO8EACHIAxAAvwUAIckDEAC_BQAhygMCAMAFACHLAwIAwAUAIcwDAgDABQAhzQMEAMEFACEDAAAAhgMAIAEAAJgDADA-AACZAwAgAwAAAIYDACABAACHAwAwAgAAgwMAIAEAAAAfACABAAAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgEQMAAMwIACAJAACQCgAgEgAAzQgAIB0AAM8IACAeAADOCAAgiAMBAAAAAYkDAQAAAAGTAwAAAMgDApUDQAAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAAcMDQAAAAAHEA0AAAAABxgMBAAAAAQEyAAChAwAgDIgDAQAAAAGJAwEAAAABkwMAAADIAwKVA0AAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAEBMgAAowMAMAEyAACjAwAwEQMAAKgIACAJAACPCgAgEgAAqQgAIB0AAKsIACAeAACqCAAgiAMBALYGACGJAwEAtgYAIZMDAACmCMgDIpUDQAC7BgAhlgNAALwGACGXA0AAvAYAIakDAQC2BgAhqgMBALcGACGrAwEAtgYAIcMDQAC7BgAhxANAALsGACHGAwEAtgYAIQIAAAAfACAyAACmAwAgDIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACECAAAAHQAgMgAAqAMAIAIAAAAdACAyAACoAwAgAwAAAB8AIDkAAKEDACA6AACmAwAgAQAAAB8AIAEAAAAdACAHDAAAjAoAID8AAI4KACBAAACNCgAglQMAALIGACCqAwAAsgYAIMMDAACyBgAgxAMAALIGACAPhQMAALoFADCGAwAArwMAEIcDAAC6BQAwiAMBAO0EACGJAwEA7gQAIZMDAAC7BcgDIpUDQADzBAAhlgNAAPQEACGXA0AA9AQAIakDAQDtBAAhqgMBAO8EACGrAwEA7QQAIcMDQADzBAAhxANAAPMEACHGAwEA7gQAIQMAAAAdACABAACuAwAwPgAArwMAIAMAAAAdACABAAAeADACAAAfACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAUEAADKCAAgEQAAmwgAIKcDAQAAAAGoA0AAAAABrwMBAAAAAQEyAAC3AwAgA6cDAQAAAAGoA0AAAAABrwMBAAAAAQEyAAC5AwAwATIAALkDADAFBAAAyAgAIBEAAJkIACCnAwEAtgYAIagDQAC8BgAhrwMBALYGACECAAAAIwAgMgAAvAMAIAOnAwEAtgYAIagDQAC8BgAhrwMBALYGACECAAAAIQAgMgAAvgMAIAIAAAAhACAyAAC-AwAgAwAAACMAIDkAALcDACA6AAC8AwAgAQAAACMAIAEAAAAhACADDAAAiQoAID8AAIsKACBAAACKCgAgBoUDAAC5BQAwhgMAAMUDABCHAwAAuQUAMKcDAQDtBAAhqANAAPQEACGvAwEA7QQAIQMAAAAhACABAADEAwAwPgAAxQMAIAMAAAAhACABAAAiADACAAAjACABAAAAJwAgAQAAACcAIAMAAAAlACABAAAmADACAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACUAIAEAACYAMAIAACcAIA0JAAC_CAAgEQAAjAgAIB0AAI0IACCIAwEAAAABiQMBAAAAAZMDAAAAxgMClgNAAAAAAZcDQAAAAAGrAwEAAAABrwMBAAAAAcIDAQAAAAHDA0AAAAABxANAAAAAAQEyAADNAwAgCogDAQAAAAGJAwEAAAABkwMAAADGAwKWA0AAAAABlwNAAAAAAasDAQAAAAGvAwEAAAABwgMBAAAAAcMDQAAAAAHEA0AAAAABATIAAM8DADABMgAAzwMAMA0JAAC9CAAgEQAAgAgAIB0AAIEIACCIAwEAtgYAIYkDAQC2BgAhkwMAAP4HxgMilgNAALwGACGXA0AAvAYAIasDAQC2BgAhrwMBALYGACHCAwEAtwYAIcMDQAC7BgAhxANAALsGACECAAAAJwAgMgAA0gMAIAqIAwEAtgYAIYkDAQC2BgAhkwMAAP4HxgMilgNAALwGACGXA0AAvAYAIasDAQC2BgAhrwMBALYGACHCAwEAtwYAIcMDQAC7BgAhxANAALsGACECAAAAJQAgMgAA1AMAIAIAAAAlACAyAADUAwAgAwAAACcAIDkAAM0DACA6AADSAwAgAQAAACcAIAEAAAAlACAGDAAAhgoAID8AAIgKACBAAACHCgAgwgMAALIGACDDAwAAsgYAIMQDAACyBgAgDYUDAAC1BQAwhgMAANsDABCHAwAAtQUAMIgDAQDtBAAhiQMBAO4EACGTAwAAtgXGAyKWA0AA9AQAIZcDQAD0BAAhqwMBAO0EACGvAwEA7QQAIcIDAQDvBAAhwwNAAPMEACHEA0AA8wQAIQMAAAAlACABAADaAwAwPgAA2wMAIAMAAAAlACABAAAmADACAAAnACABAAAAWwAgAQAAAFsAIAMAAABZACABAABaADACAABbACADAAAAWQAgAQAAWgAwAgAAWwAgAwAAAFkAIAEAAFoAMAIAAFsAIA4DAACDCgAgJAAAhAoAICUAAIUKACCIAwEAAAABkwMAAAC8AwKWA0AAAAABlwNAAAAAAakDAQAAAAG6AwEAAAABvQMAAAC9AwK-A0AAAAABvwNAAAAAAcADIAAAAAHBA0AAAAABATIAAOMDACALiAMBAAAAAZMDAAAAvAMClgNAAAAAAZcDQAAAAAGpAwEAAAABugMBAAAAAb0DAAAAvQMCvgNAAAAAAb8DQAAAAAHAAyAAAAABwQNAAAAAAQEyAADlAwAwATIAAOUDADAOAwAA5AkAICQAAOUJACAlAADmCQAgiAMBALYGACGTAwAA4gm8AyKWA0AAvAYAIZcDQAC8BgAhqQMBALYGACG6AwEAtgYAIb0DAADjCb0DIr4DQAC8BgAhvwNAALwGACHAAyAAuQYAIcEDQAC7BgAhAgAAAFsAIDIAAOgDACALiAMBALYGACGTAwAA4gm8AyKWA0AAvAYAIZcDQAC8BgAhqQMBALYGACG6AwEAtgYAIb0DAADjCb0DIr4DQAC8BgAhvwNAALwGACHAAyAAuQYAIcEDQAC7BgAhAgAAAFkAIDIAAOoDACACAAAAWQAgMgAA6gMAIAMAAABbACA5AADjAwAgOgAA6AMAIAEAAABbACABAAAAWQAgBAwAAN8JACA_AADhCQAgQAAA4AkAIMEDAACyBgAgDoUDAACuBQAwhgMAAPEDABCHAwAArgUAMIgDAQDtBAAhkwMAAK8FvAMilgNAAPQEACGXA0AA9AQAIakDAQDtBAAhugMBAO0EACG9AwAAsAW9AyK-A0AA9AQAIb8DQAD0BAAhwAMgAPEEACHBA0AA8wQAIQMAAABZACABAADwAwAwPgAA8QMAIAMAAABZACABAABaADACAABbACABAAAAKwAgAQAAACsAIAMAAAApACABAAAqADACAAArACADAAAAKQAgAQAAKgAwAgAAKwAgAwAAACkAIAEAACoAMAIAACsAIBkJAADlBwAgEQAA4QcAIBMAAOIHACAUAADqBwAgFQAA4wcAIBYAAOQHACAYAADmBwAgGgAA5wcAIBwAAOgHACCIAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAG1AwAAALUDArYDAQAAAAG3A0AAAAABuAMQAAAAAbkDAgAAAAEBMgAA-QMAIBCIAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAG1AwAAALUDArYDAQAAAAG3A0AAAAABuAMQAAAAAbkDAgAAAAEBMgAA-wMAMAEyAAD7AwAwAQAAACUAIAEAAAApACABAAAAFAAgGQkAAN8HACARAACrBwAgEwAArAcAIBQAAK0HACAVAACuBwAgFgAArwcAIBgAALAHACAaAACxBwAgHAAAsgcAIIgDAQC2BgAhkwMAAKcHtAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACGrAwEAtgYAIa8DAQC2BgAhsAMBALcGACGxAwEAtwYAIbIDAQC2BgAhtQMAAKgHtQMitgMBALcGACG3A0AAuwYAIbgDEACpBwAhuQMCAIgHACECAAAAKwAgMgAAgQQAIBCIAwEAtgYAIZMDAACnB7QDIpUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACGvAwEAtgYAIbADAQC3BgAhsQMBALcGACGyAwEAtgYAIbUDAACoB7UDIrYDAQC3BgAhtwNAALsGACG4AxAAqQcAIbkDAgCIBwAhAgAAACkAIDIAAIMEACACAAAAKQAgMgAAgwQAIAEAAAAlACABAAAAKQAgAQAAABQAIAMAAAArACA5AAD5AwAgOgAAgQQAIAEAAAArACABAAAAKQAgDAwAANoJACA_AADdCQAgQAAA3AkAIFEAANsJACBSAADeCQAglQMAALIGACCqAwAAsgYAILADAACyBgAgsQMAALIGACC2AwAAsgYAILcDAACyBgAguAMAALIGACAThQMAAKEFADCGAwAAjQQAEIcDAAChBQAwiAMBAO0EACGTAwAAogW0AyKVA0AA8wQAIZYDQAD0BAAhlwNAAPQEACGqAwEA7wQAIasDAQDtBAAhrwMBAO0EACGwAwEAngUAIbEDAQCeBQAhsgMBAO4EACG1AwAAowW1AyK2AwEAngUAIbcDQADzBAAhuAMQAKQFACG5AwIApQUAIQMAAAApACABAACMBAAwPgAAjQQAIAMAAAApACABAAAqADACAAArACABAAAAMwAgAQAAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIAQXAADZCQAgGQAA1gcAIK0DAQAAAAGuAwEAAAABATIAAJUEACACrQMBAAAAAa4DAQAAAAEBMgAAlwQAMAEyAACXBAAwBBcAANgJACAZAADUBwAgrQMBALYGACGuAwEAtgYAIQIAAAAzACAyAACaBAAgAq0DAQC2BgAhrgMBALYGACECAAAAMQAgMgAAnAQAIAIAAAAxACAyAACcBAAgAwAAADMAIDkAAJUEACA6AACaBAAgAQAAADMAIAEAAAAxACADDAAA1QkAID8AANcJACBAAADWCQAgBYUDAACgBQAwhgMAAKMEABCHAwAAoAUAMK0DAQDtBAAhrgMBAO0EACEDAAAAMQAgAQAAogQAMD4AAKMEACADAAAAMQAgAQAAMgAwAgAAMwAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAMAwAA7QgAIAkAAO4IACAKAAD6CAAgCwAA7wgAIIgDAQAAAAGJAwEAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABATIAAKsEACAIiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAAawDAQAAAAEBMgAArQQAMAEyAACtBAAwAQAAABQAIAwDAADbCAAgCQAA3AgAIAoAAPgIACALAADdCAAgiAMBALYGACGJAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACGsAwEAtwYAIQIAAAAaACAyAACxBAAgCIgDAQC2BgAhiQMBALYGACGWA0AAvAYAIZcDQAC8BgAhqQMBALYGACGqAwEAtwYAIasDAQC2BgAhrAMBALcGACECAAAAGAAgMgAAswQAIAIAAAAYACAyAACzBAAgAQAAABQAIAMAAAAaACA5AACrBAAgOgAAsQQAIAEAAAAaACABAAAAGAAgBQwAANIJACA_AADUCQAgQAAA0wkAIKoDAACyBgAgrAMAALIGACALhQMAAJ0FADCGAwAAuwQAEIcDAACdBQAwiAMBAO0EACGJAwEA7gQAIZYDQAD0BAAhlwNAAPQEACGpAwEA7QQAIaoDAQDvBAAhqwMBAO0EACGsAwEAngUAIQMAAAAYACABAAC6BAAwPgAAuwQAIAMAAAAYACABAAAZADACAAAaACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIAUEAADrCAAgDQAAhQkAIKYDAQAAAAGnAwEAAAABqANAAAAAAQEyAADDBAAgA6YDAQAAAAGnAwEAAAABqANAAAAAAQEyAADFBAAwATIAAMUEADAFBAAA6QgAIA0AAIMJACCmAwEAtgYAIacDAQC2BgAhqANAALwGACECAAAAEgAgMgAAyAQAIAOmAwEAtgYAIacDAQC2BgAhqANAALwGACECAAAAEAAgMgAAygQAIAIAAAAQACAyAADKBAAgAwAAABIAIDkAAMMEACA6AADIBAAgAQAAABIAIAEAAAAQACADDAAAzwkAID8AANEJACBAAADQCQAgBoUDAACcBQAwhgMAANEEABCHAwAAnAUAMKYDAQDtBAAhpwMBAO0EACGoA0AA9AQAIQMAAAAQACABAADQBAAwPgAA0QQAIAMAAAAQACABAAARADACAAASACAhBQAAjgUAIAYAAI8FACAIAACQBQAgDgAAkQUAIA8AAJIFACAQAACSBQAgEgAAlAUAIBoAAJcFACAcAACYBQAgHQAAlgUAIB4AAJUFACAfAACTBQAgIAAAlgUAICEAAJkFACAiAACaBQAgKgAAmwUAIIUDAACGBQAwhgMAABQAEIcDAACGBQAwiAMBAAAAAYkDAQCHBQAhigMBAAAAAYsDAQCIBQAhjAMBAIgFACGNAwEAiAUAIY8DAACJBY8DIpADIACKBQAhkQMgAIoFACGTAwAAiwWTAyKUAyAAigUAIZUDQACMBQAhlgNAAI0FACGXA0AAjQUAIQEAAADUBAAgAQAAANQEACAUBQAAwQkAIAYAAMIJACAIAADDCQAgDgAAxAkAIA8AAMUJACAQAADFCQAgEgAAxwkAIBoAAMoJACAcAADLCQAgHQAAyQkAIB4AAMgJACAfAADGCQAgIAAAyQkAICEAAMwJACAiAADNCQAgKgAAzgkAIIsDAACyBgAgjAMAALIGACCNAwAAsgYAIJUDAACyBgAgAwAAABQAIAEAANcEADACAADUBAAgAwAAABQAIAEAANcEADACAADUBAAgAwAAABQAIAEAANcEADACAADUBAAgHgUAALEJACAGAACyCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEAAAtgkAIBIAALgJACAaAAC8CQAgHAAAvQkAIB0AALoJACAeAAC5CQAgHwAAtwkAICAAALsJACAhAAC-CQAgIgAAvwkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABATIAANsEACAOiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQEyAADdBAAwATIAAN0EADAeBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQIAAADUBAAgMgAA4AQAIA6IAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACECAAAAFAAgMgAA4gQAIAIAAAAUACAyAADiBAAgAwAAANQEACA5AADbBAAgOgAA4AQAIAEAAADUBAAgAQAAABQAIAcMAACzBgAgPwAAtQYAIEAAALQGACCLAwAAsgYAIIwDAACyBgAgjQMAALIGACCVAwAAsgYAIBGFAwAA7AQAMIYDAADpBAAQhwMAAOwEADCIAwEA7QQAIYkDAQDuBAAhigMBAO4EACGLAwEA7wQAIYwDAQDvBAAhjQMBAO8EACGPAwAA8ASPAyKQAyAA8QQAIZEDIADxBAAhkwMAAPIEkwMilAMgAPEEACGVA0AA8wQAIZYDQAD0BAAhlwNAAPQEACEDAAAAFAAgAQAA6AQAMD4AAOkEACADAAAAFAAgAQAA1wQAMAIAANQEACARhQMAAOwEADCGAwAA6QQAEIcDAADsBAAwiAMBAO0EACGJAwEA7gQAIYoDAQDuBAAhiwMBAO8EACGMAwEA7wQAIY0DAQDvBAAhjwMAAPAEjwMikAMgAPEEACGRAyAA8QQAIZMDAADyBJMDIpQDIADxBAAhlQNAAPMEACGWA0AA9AQAIZcDQAD0BAAhCwwAAPYEACA_AACEBQAgQAAAhAUAIJgDAQAAAAGZAwEAAAAEmgMBAAAABJsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAhQUAIQ4MAAD2BAAgPwAAhAUAIEAAAIQFACCYAwEAAAABmQMBAAAABJoDAQAAAASbAwEAAAABnAMBAAAAAZ0DAQAAAAGeAwEAAAABnwMBAIMFACGgAwEAAAABoQMBAAAAAaIDAQAAAAEODAAA-QQAID8AAIIFACBAAACCBQAgmAMBAAAAAZkDAQAAAAWaAwEAAAAFmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCBBQAhoAMBAAAAAaEDAQAAAAGiAwEAAAABBwwAAPYEACA_AACABQAgQAAAgAUAIJgDAAAAjwMCmQMAAACPAwiaAwAAAI8DCJ8DAAD_BI8DIgUMAAD2BAAgPwAA_gQAIEAAAP4EACCYAyAAAAABnwMgAP0EACEHDAAA9gQAID8AAPwEACBAAAD8BAAgmAMAAACTAwKZAwAAAJMDCJoDAAAAkwMInwMAAPsEkwMiCwwAAPkEACA_AAD6BAAgQAAA-gQAIJgDQAAAAAGZA0AAAAAFmgNAAAAABZsDQAAAAAGcA0AAAAABnQNAAAAAAZ4DQAAAAAGfA0AA-AQAIQsMAAD2BAAgPwAA9wQAIEAAAPcEACCYA0AAAAABmQNAAAAABJoDQAAAAASbA0AAAAABnANAAAAAAZ0DQAAAAAGeA0AAAAABnwNAAPUEACELDAAA9gQAID8AAPcEACBAAAD3BAAgmANAAAAAAZkDQAAAAASaA0AAAAAEmwNAAAAAAZwDQAAAAAGdA0AAAAABngNAAAAAAZ8DQAD1BAAhCJgDAgAAAAGZAwIAAAAEmgMCAAAABJsDAgAAAAGcAwIAAAABnQMCAAAAAZ4DAgAAAAGfAwIA9gQAIQiYA0AAAAABmQNAAAAABJoDQAAAAASbA0AAAAABnANAAAAAAZ0DQAAAAAGeA0AAAAABnwNAAPcEACELDAAA-QQAID8AAPoEACBAAAD6BAAgmANAAAAAAZkDQAAAAAWaA0AAAAAFmwNAAAAAAZwDQAAAAAGdA0AAAAABngNAAAAAAZ8DQAD4BAAhCJgDAgAAAAGZAwIAAAAFmgMCAAAABZsDAgAAAAGcAwIAAAABnQMCAAAAAZ4DAgAAAAGfAwIA-QQAIQiYA0AAAAABmQNAAAAABZoDQAAAAAWbA0AAAAABnANAAAAAAZ0DQAAAAAGeA0AAAAABnwNAAPoEACEHDAAA9gQAID8AAPwEACBAAAD8BAAgmAMAAACTAwKZAwAAAJMDCJoDAAAAkwMInwMAAPsEkwMiBJgDAAAAkwMCmQMAAACTAwiaAwAAAJMDCJ8DAAD8BJMDIgUMAAD2BAAgPwAA_gQAIEAAAP4EACCYAyAAAAABnwMgAP0EACECmAMgAAAAAZ8DIAD-BAAhBwwAAPYEACA_AACABQAgQAAAgAUAIJgDAAAAjwMCmQMAAACPAwiaAwAAAI8DCJ8DAAD_BI8DIgSYAwAAAI8DApkDAAAAjwMImgMAAACPAwifAwAAgAWPAyIODAAA-QQAID8AAIIFACBAAACCBQAgmAMBAAAAAZkDAQAAAAWaAwEAAAAFmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCBBQAhoAMBAAAAAaEDAQAAAAGiAwEAAAABC5gDAQAAAAGZAwEAAAAFmgMBAAAABZsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAggUAIaADAQAAAAGhAwEAAAABogMBAAAAAQ4MAAD2BAAgPwAAhAUAIEAAAIQFACCYAwEAAAABmQMBAAAABJoDAQAAAASbAwEAAAABnAMBAAAAAZ0DAQAAAAGeAwEAAAABnwMBAIMFACGgAwEAAAABoQMBAAAAAaIDAQAAAAELmAMBAAAAAZkDAQAAAASaAwEAAAAEmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCEBQAhoAMBAAAAAaEDAQAAAAGiAwEAAAABCwwAAPYEACA_AACEBQAgQAAAhAUAIJgDAQAAAAGZAwEAAAAEmgMBAAAABJsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAhQUAISEFAACOBQAgBgAAjwUAIAgAAJAFACAOAACRBQAgDwAAkgUAIBAAAJIFACASAACUBQAgGgAAlwUAIBwAAJgFACAdAACWBQAgHgAAlQUAIB8AAJMFACAgAACWBQAgIQAAmQUAICIAAJoFACAqAACbBQAghQMAAIYFADCGAwAAFAAQhwMAAIYFADCIAwEAyQUAIYkDAQCHBQAhigMBAIcFACGLAwEAiAUAIYwDAQCIBQAhjQMBAIgFACGPAwAAiQWPAyKQAyAAigUAIZEDIACKBQAhkwMAAIsFkwMilAMgAIoFACGVA0AAjAUAIZYDQACNBQAhlwNAAI0FACELmAMBAAAAAZkDAQAAAASaAwEAAAAEmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCEBQAhoAMBAAAAAaEDAQAAAAGiAwEAAAABC5gDAQAAAAGZAwEAAAAFmgMBAAAABZsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAggUAIaADAQAAAAGhAwEAAAABogMBAAAAAQSYAwAAAI8DApkDAAAAjwMImgMAAACPAwifAwAAgAWPAyICmAMgAAAAAZ8DIAD-BAAhBJgDAAAAkwMCmQMAAACTAwiaAwAAAJMDCJ8DAAD8BJMDIgiYA0AAAAABmQNAAAAABZoDQAAAAAWbA0AAAAABnANAAAAAAZ0DQAAAAAGeA0AAAAABnwNAAPoEACEImANAAAAAAZkDQAAAAASaA0AAAAAEmwNAAAAAAZwDQAAAAAGdA0AAAAABngNAAAAAAZ8DQAD3BAAhA6MDAAAHACCkAwAABwAgpQMAAAcAIAOjAwAAAwAgpAMAAAMAIKUDAAADACADowMAAAwAIKQDAAAMACClAwAADAAgA6MDAAAQACCkAwAAEAAgpQMAABAAIAOjAwAAGAAgpAMAABgAIKUDAAAYACADowMAAB0AIKQDAAAdACClAwAAHQAgA6MDAAAhACCkAwAAIQAgpQMAACEAIAOjAwAAJQAgpAMAACUAIKUDAAAlACADowMAACkAIKQDAAApACClAwAAKQAgA6MDAAA3ACCkAwAANwAgpQMAADcAIAOjAwAAOwAgpAMAADsAIKUDAAA7ACADowMAAE4AIKQDAABOACClAwAATgAgA6MDAABRACCkAwAAUQAgpQMAAFEAIAOjAwAAVQAgpAMAAFUAIKUDAABVACAGhQMAAJwFADCGAwAA0QQAEIcDAACcBQAwpgMBAO0EACGnAwEA7QQAIagDQAD0BAAhC4UDAACdBQAwhgMAALsEABCHAwAAnQUAMIgDAQDtBAAhiQMBAO4EACGWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACGqAwEA7wQAIasDAQDtBAAhrAMBAJ4FACELDAAA-QQAID8AAIIFACBAAACCBQAgmAMBAAAAAZkDAQAAAAWaAwEAAAAFmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCfBQAhCwwAAPkEACA_AACCBQAgQAAAggUAIJgDAQAAAAGZAwEAAAAFmgMBAAAABZsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAnwUAIQWFAwAAoAUAMIYDAACjBAAQhwMAAKAFADCtAwEA7QQAIa4DAQDtBAAhE4UDAAChBQAwhgMAAI0EABCHAwAAoQUAMIgDAQDtBAAhkwMAAKIFtAMilQNAAPMEACGWA0AA9AQAIZcDQAD0BAAhqgMBAO8EACGrAwEA7QQAIa8DAQDtBAAhsAMBAJ4FACGxAwEAngUAIbIDAQDuBAAhtQMAAKMFtQMitgMBAJ4FACG3A0AA8wQAIbgDEACkBQAhuQMCAKUFACEHDAAA9gQAID8AAK0FACBAAACtBQAgmAMAAAC0AwKZAwAAALQDCJoDAAAAtAMInwMAAKwFtAMiBwwAAPYEACA_AACrBQAgQAAAqwUAIJgDAAAAtQMCmQMAAAC1AwiaAwAAALUDCJ8DAACqBbUDIg0MAAD5BAAgPwAAqQUAIEAAAKkFACBRAACpBQAgUgAAqQUAIJgDEAAAAAGZAxAAAAAFmgMQAAAABZsDEAAAAAGcAxAAAAABnQMQAAAAAZ4DEAAAAAGfAxAAqAUAIQ0MAAD2BAAgPwAA9gQAIEAAAPYEACBRAACnBQAgUgAA9gQAIJgDAgAAAAGZAwIAAAAEmgMCAAAABJsDAgAAAAGcAwIAAAABnQMCAAAAAZ4DAgAAAAGfAwIApgUAIQ0MAAD2BAAgPwAA9gQAIEAAAPYEACBRAACnBQAgUgAA9gQAIJgDAgAAAAGZAwIAAAAEmgMCAAAABJsDAgAAAAGcAwIAAAABnQMCAAAAAZ4DAgAAAAGfAwIApgUAIQiYAwgAAAABmQMIAAAABJoDCAAAAASbAwgAAAABnAMIAAAAAZ0DCAAAAAGeAwgAAAABnwMIAKcFACENDAAA-QQAID8AAKkFACBAAACpBQAgUQAAqQUAIFIAAKkFACCYAxAAAAABmQMQAAAABZoDEAAAAAWbAxAAAAABnAMQAAAAAZ0DEAAAAAGeAxAAAAABnwMQAKgFACEImAMQAAAAAZkDEAAAAAWaAxAAAAAFmwMQAAAAAZwDEAAAAAGdAxAAAAABngMQAAAAAZ8DEACpBQAhBwwAAPYEACA_AACrBQAgQAAAqwUAIJgDAAAAtQMCmQMAAAC1AwiaAwAAALUDCJ8DAACqBbUDIgSYAwAAALUDApkDAAAAtQMImgMAAAC1AwifAwAAqwW1AyIHDAAA9gQAID8AAK0FACBAAACtBQAgmAMAAAC0AwKZAwAAALQDCJoDAAAAtAMInwMAAKwFtAMiBJgDAAAAtAMCmQMAAAC0AwiaAwAAALQDCJ8DAACtBbQDIg6FAwAArgUAMIYDAADxAwAQhwMAAK4FADCIAwEA7QQAIZMDAACvBbwDIpYDQAD0BAAhlwNAAPQEACGpAwEA7QQAIboDAQDtBAAhvQMAALAFvQMivgNAAPQEACG_A0AA9AQAIcADIADxBAAhwQNAAPMEACEHDAAA9gQAID8AALQFACBAAAC0BQAgmAMAAAC8AwKZAwAAALwDCJoDAAAAvAMInwMAALMFvAMiBwwAAPYEACA_AACyBQAgQAAAsgUAIJgDAAAAvQMCmQMAAAC9AwiaAwAAAL0DCJ8DAACxBb0DIgcMAAD2BAAgPwAAsgUAIEAAALIFACCYAwAAAL0DApkDAAAAvQMImgMAAAC9AwifAwAAsQW9AyIEmAMAAAC9AwKZAwAAAL0DCJoDAAAAvQMInwMAALIFvQMiBwwAAPYEACA_AAC0BQAgQAAAtAUAIJgDAAAAvAMCmQMAAAC8AwiaAwAAALwDCJ8DAACzBbwDIgSYAwAAALwDApkDAAAAvAMImgMAAAC8AwifAwAAtAW8AyINhQMAALUFADCGAwAA2wMAEIcDAAC1BQAwiAMBAO0EACGJAwEA7gQAIZMDAAC2BcYDIpYDQAD0BAAhlwNAAPQEACGrAwEA7QQAIa8DAQDtBAAhwgMBAO8EACHDA0AA8wQAIcQDQADzBAAhBwwAAPYEACA_AAC4BQAgQAAAuAUAIJgDAAAAxgMCmQMAAADGAwiaAwAAAMYDCJ8DAAC3BcYDIgcMAAD2BAAgPwAAuAUAIEAAALgFACCYAwAAAMYDApkDAAAAxgMImgMAAADGAwifAwAAtwXGAyIEmAMAAADGAwKZAwAAAMYDCJoDAAAAxgMInwMAALgFxgMiBoUDAAC5BQAwhgMAAMUDABCHAwAAuQUAMKcDAQDtBAAhqANAAPQEACGvAwEA7QQAIQ-FAwAAugUAMIYDAACvAwAQhwMAALoFADCIAwEA7QQAIYkDAQDuBAAhkwMAALsFyAMilQNAAPMEACGWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACGqAwEA7wQAIasDAQDtBAAhwwNAAPMEACHEA0AA8wQAIcYDAQDuBAAhBwwAAPYEACA_AAC9BQAgQAAAvQUAIJgDAAAAyAMCmQMAAADIAwiaAwAAAMgDCJ8DAAC8BcgDIgcMAAD2BAAgPwAAvQUAIEAAAL0FACCYAwAAAMgDApkDAAAAyAMImgMAAADIAwifAwAAvAXIAyIEmAMAAADIAwKZAwAAAMgDCJoDAAAAyAMInwMAAL0FyAMiD4UDAAC-BQAwhgMAAJkDABCHAwAAvgUAMIgDAQDtBAAhiQMBAO4EACGQAyAA8QQAIZYDQAD0BAAhlwNAAPQEACGqAwEA7wQAIcgDEAC_BQAhyQMQAL8FACHKAwIAwAUAIcsDAgDABQAhzAMCAMAFACHNAwQAwQUAIQ0MAAD2BAAgPwAAxwUAIEAAAMcFACBRAADHBQAgUgAAxwUAIJgDEAAAAAGZAxAAAAAEmgMQAAAABJsDEAAAAAGcAxAAAAABnQMQAAAAAZ4DEAAAAAGfAxAAxgUAIQ0MAAD5BAAgPwAA-QQAIEAAAPkEACBRAADDBQAgUgAA-QQAIJgDAgAAAAGZAwIAAAAFmgMCAAAABZsDAgAAAAGcAwIAAAABnQMCAAAAAZ4DAgAAAAGfAwIAxQUAIQ0MAAD5BAAgPwAAxAUAIEAAAMQFACBRAADDBQAgUgAAxAUAIJgDBAAAAAGZAwQAAAAFmgMEAAAABZsDBAAAAAGcAwQAAAABnQMEAAAAAZ4DBAAAAAGfAwQAwgUAIQ0MAAD5BAAgPwAAxAUAIEAAAMQFACBRAADDBQAgUgAAxAUAIJgDBAAAAAGZAwQAAAAFmgMEAAAABZsDBAAAAAGcAwQAAAABnQMEAAAAAZ4DBAAAAAGfAwQAwgUAIQiYAwgAAAABmQMIAAAABZoDCAAAAAWbAwgAAAABnAMIAAAAAZ0DCAAAAAGeAwgAAAABnwMIAMMFACEImAMEAAAAAZkDBAAAAAWaAwQAAAAFmwMEAAAAAZwDBAAAAAGdAwQAAAABngMEAAAAAZ8DBADEBQAhDQwAAPkEACA_AAD5BAAgQAAA-QQAIFEAAMMFACBSAAD5BAAgmAMCAAAAAZkDAgAAAAWaAwIAAAAFmwMCAAAAAZwDAgAAAAGdAwIAAAABngMCAAAAAZ8DAgDFBQAhDQwAAPYEACA_AADHBQAgQAAAxwUAIFEAAMcFACBSAADHBQAgmAMQAAAAAZkDEAAAAASaAxAAAAAEmwMQAAAAAZwDEAAAAAGdAxAAAAABngMQAAAAAZ8DEADGBQAhCJgDEAAAAAGZAxAAAAAEmgMQAAAABJsDEAAAAAGcAxAAAAABnQMQAAAAAZ4DEAAAAAGfAxAAxwUAIRAjAADNBQAghQMAAMgFADCGAwAAhgMAEIcDAADIBQAwiAMBAMkFACGJAwEAhwUAIZADIACKBQAhlgNAAI0FACGXA0AAjQUAIaoDAQCIBQAhyAMQAMoFACHJAxAAygUAIcoDAgDLBQAhywMCAMsFACHMAwIAywUAIc0DBADMBQAhCJgDAQAAAAGZAwEAAAAEmgMBAAAABJsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAzgUAIQiYAxAAAAABmQMQAAAABJoDEAAAAASbAxAAAAABnAMQAAAAAZ0DEAAAAAGeAxAAAAABnwMQAMcFACEImAMCAAAAAZkDAgAAAAWaAwIAAAAFmwMCAAAAAZwDAgAAAAGdAwIAAAABngMCAAAAAZ8DAgD5BAAhCJgDBAAAAAGZAwQAAAAFmgMEAAAABZsDBAAAAAGcAwQAAAABnQMEAAAAAZ4DBAAAAAGfAwQAxAUAIQOjAwAAWQAgpAMAAFkAIKUDAABZACAImAMBAAAAAZkDAQAAAASaAwEAAAAEmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQDOBQAhEIUDAADPBQAwhgMAAIADABCHAwAAzwUAMIgDAQDtBAAhkwMAANEF1QMilgNAAPQEACGXA0AA9AQAIakDAQDtBAAhzgMBAO0EACHQAwAA0AXQAyLRAxAAvwUAIdIDAQDvBAAh0wMBAO8EACHVA0AA8wQAIdYDAQCeBQAh1wMBAO8EACEHDAAA9gQAID8AANUFACBAAADVBQAgmAMAAADQAwKZAwAAANADCJoDAAAA0AMInwMAANQF0AMiBwwAAPYEACA_AADTBQAgQAAA0wUAIJgDAAAA1QMCmQMAAADVAwiaAwAAANUDCJ8DAADSBdUDIgcMAAD2BAAgPwAA0wUAIEAAANMFACCYAwAAANUDApkDAAAA1QMImgMAAADVAwifAwAA0gXVAyIEmAMAAADVAwKZAwAAANUDCJoDAAAA1QMInwMAANMF1QMiBwwAAPYEACA_AADVBQAgQAAA1QUAIJgDAAAA0AMCmQMAAADQAwiaAwAAANADCJ8DAADUBdADIgSYAwAAANADApkDAAAA0AMImgMAAADQAwifAwAA1QXQAyIIhQMAANYFADCGAwAA6AIAEIcDAADWBQAwiAMBAO0EACGnAwEA7QQAIagDQAD0BAAhqQMBAO0EACHZAwAA1wXZAyIHDAAA9gQAID8AANkFACBAAADZBQAgmAMAAADZAwKZAwAAANkDCJoDAAAA2QMInwMAANgF2QMiBwwAAPYEACA_AADZBQAgQAAA2QUAIJgDAAAA2QMCmQMAAADZAwiaAwAAANkDCJ8DAADYBdkDIgSYAwAAANkDApkDAAAA2QMImgMAAADZAwifAwAA2QXZAyIMhQMAANoFADCGAwAA0gIAEIcDAADaBQAwiAMBAO0EACGJAwEA7gQAIZUDQADzBAAhlgNAAPQEACGXA0AA9AQAIaoDAQDvBAAhxgMBAO4EACHaAwEA7wQAIdsDAQDvBAAhFwgAAJAFACALAACPBQAgDwAAkgUAIBwAAJgFACAfAACTBQAgIQAAmQUAICIAAJoFACAlAADeBQAgJgAA3QUAICcAAJsFACArAADcBQAghQMAANsFADCGAwAAvwIAEIcDAADbBQAwiAMBAMkFACGJAwEAhwUAIZUDQACMBQAhlgNAAI0FACGXA0AAjQUAIaoDAQCIBQAhxgMBAIcFACHaAwEAiAUAIdsDAQCIBQAhA6MDAAB5ACCkAwAAeQAgpQMAAHkAIBMDAAD6BQAgJAAAggYAICUAAN4FACCFAwAA_wUAMIYDAABZABCHAwAA_wUAMIgDAQDJBQAhkwMAAIAGvAMilgNAAI0FACGXA0AAjQUAIakDAQDJBQAhugMBAMkFACG9AwAAgQa9AyK-A0AAjQUAIb8DQACNBQAhwAMgAIoFACHBA0AAjAUAIYwEAABZACCNBAAAWQAgA6MDAABeACCkAwAAXgAgpQMAAF4AIAmFAwAA3wUAMIYDAAC5AgAQhwMAAN8FADCIAwEA7QQAIZYDQAD0BAAhlwNAAPQEACGnAwEA7QQAId0DAADgBd0DIt4DAQDuBAAhBwwAAPYEACA_AADiBQAgQAAA4gUAIJgDAAAA3QMCmQMAAADdAwiaAwAAAN0DCJ8DAADhBd0DIgcMAAD2BAAgPwAA4gUAIEAAAOIFACCYAwAAAN0DApkDAAAA3QMImgMAAADdAwifAwAA4QXdAyIEmAMAAADdAwKZAwAAAN0DCJoDAAAA3QMInwMAAOIF3QMiD4UDAADjBQAwhgMAAKMCABCHAwAA4wUAMIgDAQDtBAAhlgNAAPQEACGXA0AA9AQAIacDAQDtBAAhqQMBAO0EACGyAwEA7gQAIeADAADkBeADIuEDAQDuBAAh4gMBAO8EACHjAwEA7wQAIeQDAADlBQAg5QNAAPMEACEHDAAA9gQAID8AAOgFACBAAADoBQAgmAMAAADgAwKZAwAAAOADCJoDAAAA4AMInwMAAOcF4AMiDwwAAPkEACA_AADmBQAgQAAA5gUAIJgDgAAAAAGbA4AAAAABnAOAAAAAAZ0DgAAAAAGeA4AAAAABnwOAAAAAAeYDAQAAAAHnAwEAAAAB6AMBAAAAAekDgAAAAAHqA4AAAAAB6wOAAAAAAQyYA4AAAAABmwOAAAAAAZwDgAAAAAGdA4AAAAABngOAAAAAAZ8DgAAAAAHmAwEAAAAB5wMBAAAAAegDAQAAAAHpA4AAAAAB6gOAAAAAAesDgAAAAAEHDAAA9gQAID8AAOgFACBAAADoBQAgmAMAAADgAwKZAwAAAOADCJoDAAAA4AMInwMAAOcF4AMiBJgDAAAA4AMCmQMAAADgAwiaAwAAAOADCJ8DAADoBeADIgmFAwAA6QUAMIYDAACNAgAQhwMAAOkFADCIAwEA7QQAIYkDAQDuBAAhlgNAAPQEACGXA0AA9AQAIakDAQDtBAAh7AMBAO8EACEQhQMAAOoFADCGAwAA9wEAEIcDAADqBQAwiAMBAO0EACGTAwAA6wXzAyKWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACG3A0AA8wQAIe0DAQDtBAAh7gMBAO4EACHvAxAAvwUAIfADEAC_BQAh8QMQAL8FACHzA0AA9AQAIfQDQAD0BAAhBwwAAPYEACA_AADtBQAgQAAA7QUAIJgDAAAA8wMCmQMAAADzAwiaAwAAAPMDCJ8DAADsBfMDIgcMAAD2BAAgPwAA7QUAIEAAAO0FACCYAwAAAPMDApkDAAAA8wMImgMAAADzAwifAwAA7AXzAyIEmAMAAADzAwKZAwAAAPMDCJoDAAAA8wMInwMAAO0F8wMiDoUDAADuBQAwhgMAAOEBABCHAwAA7gUAMIgDAQDtBAAhigMBAO4EACGTAwAA7wX4AyKWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACHZAwAA1wXZAyL1AwEA7QQAIfYDAQDuBAAh-ANAAPQEACH5A0AA8wQAIQcMAAD2BAAgPwAA8QUAIEAAAPEFACCYAwAAAPgDApkDAAAA-AMImgMAAAD4AwifAwAA8AX4AyIHDAAA9gQAID8AAPEFACBAAADxBQAgmAMAAAD4AwKZAwAAAPgDCJoDAAAA-AMInwMAAPAF-AMiBJgDAAAA-AMCmQMAAAD4AwiaAwAAAPgDCJ8DAADxBfgDIgmFAwAA8gUAMIYDAADLAQAQhwMAAPIFADCIAwEA7QQAIZYDQAD0BAAhlwNAAPQEACGnAwEA7QQAIa0DAQDtBAAh-gMBAO4EACEPhQMAAPMFADCGAwAAtQEAEIcDAADzBQAwiAMBAO0EACGWA0AA9AQAIZcDQAD0BAAhqQMBAO0EACGtAwEA7QQAIfsDAQDtBAAh_AMBAO4EACH9AwEA7gQAIf4DAQDuBAAh_wMCAKUFACGABAEA7gQAIYEEAQDuBAAhDIUDAAD0BQAwhgMAAJ8BABCHAwAA9AUAMIgDAQDtBAAhlgNAAPQEACGpAwEA7QQAIaoDAQDvBAAh4gMBAO4EACHjAwEA7gQAIeQDAADlBQAgggQBAO0EACGEBAAA9QWEBCIHDAAA9gQAID8AAPcFACBAAAD3BQAgmAMAAACEBAKZAwAAAIQECJoDAAAAhAQInwMAAPYFhAQiBwwAAPYEACA_AAD3BQAgQAAA9wUAIJgDAAAAhAQCmQMAAACEBAiaAwAAAIQECJ8DAAD2BYQEIgSYAwAAAIQEApkDAAAAhAQImgMAAACEBAifAwAA9wWEBCICiQMBAAAAAakDAQAAAAELAwAA-gUAIBgAAPsFACCFAwAA-QUAMIYDAAB5ABCHAwAA-QUAMIgDAQDJBQAhiQMBAIcFACGWA0AAjQUAIZcDQACNBQAhqQMBAMkFACHsAwEAiAUAIRkIAACQBQAgCwAAjwUAIA8AAJIFACAcAACYBQAgHwAAkwUAICEAAJkFACAiAACaBQAgJQAA3gUAICYAAN0FACAnAACbBQAgKwAA3AUAIIUDAADbBQAwhgMAAL8CABCHAwAA2wUAMIgDAQDJBQAhiQMBAIcFACGVA0AAjAUAIZYDQACNBQAhlwNAAI0FACGqAwEAiAUAIcYDAQCHBQAh2gMBAIgFACHbAwEAiAUAIYwEAAC_AgAgjQQAAL8CACADowMAADEAIKQDAAAxACClAwAAMQAgEwMAAPoFACAmAAD-BQAgJwAAmwUAIIUDAAD8BQAwhgMAAF4AEIcDAAD8BQAwiAMBAMkFACGTAwAA_QXzAyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG3A0AAjAUAIe0DAQDJBQAh7gMBAIcFACHvAxAAygUAIfADEADKBQAh8QMQAMoFACHzA0AAjQUAIfQDQACNBQAhBJgDAAAA8wMCmQMAAADzAwiaAwAAAPMDCJ8DAADtBfMDIhMDAAD6BQAgJAAAggYAICUAAN4FACCFAwAA_wUAMIYDAABZABCHAwAA_wUAMIgDAQDJBQAhkwMAAIAGvAMilgNAAI0FACGXA0AAjQUAIakDAQDJBQAhugMBAMkFACG9AwAAgQa9AyK-A0AAjQUAIb8DQACNBQAhwAMgAIoFACHBA0AAjAUAIYwEAABZACCNBAAAWQAgEQMAAPoFACAkAACCBgAgJQAA3gUAIIUDAAD_BQAwhgMAAFkAEIcDAAD_BQAwiAMBAMkFACGTAwAAgAa8AyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG6AwEAyQUAIb0DAACBBr0DIr4DQACNBQAhvwNAAI0FACHAAyAAigUAIcEDQACMBQAhBJgDAAAAvAMCmQMAAAC8AwiaAwAAALwDCJ8DAAC0BbwDIgSYAwAAAL0DApkDAAAAvQMImgMAAAC9AwifAwAAsgW9AyISIwAAzQUAIIUDAADIBQAwhgMAAIYDABCHAwAAyAUAMIgDAQDJBQAhiQMBAIcFACGQAyAAigUAIZYDQACNBQAhlwNAAI0FACGqAwEAiAUAIcgDEADKBQAhyQMQAMoFACHKAwIAywUAIcsDAgDLBQAhzAMCAMsFACHNAwQAzAUAIYwEAACGAwAgjQQAAIYDACATAwAA-gUAICgAAIcGACApAACIBgAghQMAAIMGADCGAwAAVQAQhwMAAIMGADCIAwEAyQUAIZMDAACFBtUDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIc4DAQDJBQAh0AMAAIQG0AMi0QMQAMoFACHSAwEAiAUAIdMDAQCIBQAh1QNAAIwFACHWAwEAhgYAIdcDAQCIBQAhBJgDAAAA0AMCmQMAAADQAwiaAwAAANADCJ8DAADVBdADIgSYAwAAANUDApkDAAAA1QMImgMAAADVAwifAwAA0wXVAyIImAMBAAAAAZkDAQAAAAWaAwEAAAAFmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCJBgAhFQMAAPoFACAmAAD-BQAgJwAAmwUAIIUDAAD8BQAwhgMAAF4AEIcDAAD8BQAwiAMBAMkFACGTAwAA_QXzAyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG3A0AAjAUAIe0DAQDJBQAh7gMBAIcFACHvAxAAygUAIfADEADKBQAh8QMQAMoFACHzA0AAjQUAIfQDQACNBQAhjAQAAF4AII0EAABeACAjBQAAjgUAIAYAAI8FACAIAACQBQAgDgAAkQUAIA8AAJIFACAQAACSBQAgEgAAlAUAIBoAAJcFACAcAACYBQAgHQAAlgUAIB4AAJUFACAfAACTBQAgIAAAlgUAICEAAJkFACAiAACaBQAgKgAAmwUAIIUDAACGBQAwhgMAABQAEIcDAACGBQAwiAMBAMkFACGJAwEAhwUAIYoDAQCHBQAhiwMBAIgFACGMAwEAiAUAIY0DAQCIBQAhjwMAAIkFjwMikAMgAIoFACGRAyAAigUAIZMDAACLBZMDIpQDIACKBQAhlQNAAIwFACGWA0AAjQUAIZcDQACNBQAhjAQAABQAII0EAAAUACAImAMBAAAAAZkDAQAAAAWaAwEAAAAFmwMBAAAAAZwDAQAAAAGdAwEAAAABngMBAAAAAZ8DAQCJBgAhEQMAAPoFACAEAACNBgAghQMAAIoGADCGAwAAUQAQhwMAAIoGADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGnAwEAyQUAIakDAQDJBQAhsgMBAIcFACHgAwAAiwbgAyLhAwEAhwUAIeIDAQCIBQAh4wMBAIgFACHkAwAAjAYAIOUDQACMBQAhBJgDAAAA4AMCmQMAAADgAwiaAwAAAOADCJ8DAADoBeADIgyYA4AAAAABmwOAAAAAAZwDgAAAAAGdA4AAAAABngOAAAAAAZ8DgAAAAAHmAwEAAAAB5wMBAAAAAegDAQAAAAHpA4AAAAAB6gOAAAAAAesDgAAAAAEjBQAAjgUAIAYAAI8FACAIAACQBQAgDgAAkQUAIA8AAJIFACAQAACSBQAgEgAAlAUAIBoAAJcFACAcAACYBQAgHQAAlgUAIB4AAJUFACAfAACTBQAgIAAAlgUAICEAAJkFACAiAACaBQAgKgAAmwUAIIUDAACGBQAwhgMAABQAEIcDAACGBQAwiAMBAMkFACGJAwEAhwUAIYoDAQCHBQAhiwMBAIgFACGMAwEAiAUAIY0DAQCIBQAhjwMAAIkFjwMikAMgAIoFACGRAyAAigUAIZMDAACLBZMDIpQDIACKBQAhlQNAAIwFACGWA0AAjQUAIZcDQACNBQAhjAQAABQAII0EAAAUACAOAwAA-gUAICwAAI0GACCFAwAAjgYAMIYDAABOABCHAwAAjgYAMIgDAQDJBQAhlgNAAI0FACGpAwEAyQUAIaoDAQCIBQAh4gMBAIcFACHjAwEAhwUAIeQDAACMBgAgggQBAMkFACGEBAAAjwaEBCIEmAMAAACEBAKZAwAAAIQECJoDAAAAhAQInwMAAPcFhAQiEgMAAPoFACAXAACSBgAgGwAAjQYAIIUDAACQBgAwhgMAADsAEIcDAACQBgAwiAMBAMkFACGWA0AAjQUAIZcDQACNBQAhqQMBAMkFACGtAwEAyQUAIfsDAQDJBQAh_AMBAIcFACH9AwEAhwUAIf4DAQCHBQAh_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-wgAMDoAAP8IADCOBAAA_AgAMI8EAAD9CAAwkAQAAP4IACCRBAAA4ggAMJIEAADiCAAwkwQAAOIIADCUBAAA4ggAMJUEAACACQAwlgQAAOUIADALOQAA8AgAMDoAAPQIADCOBAAA8QgAMI8EAADyCAAwkAQAAPMIACCRBAAA1AgAMJIEAADUCAAwkwQAANQIADCUBAAA1AgAMJUEAAD1CAAwlgQAANcIADALOQAA0AgAMDoAANUIADCOBAAA0QgAMI8EAADSCAAwkAQAANMIACCRBAAA1AgAMJIEAADUCAAwkwQAANQIADCUBAAA1AgAMJUEAADWCAAwlgQAANcIADALOQAAnAgAMDoAAKEIADCOBAAAnQgAMI8EAACeCAAwkAQAAJ8IACCRBAAAoAgAMJIEAACgCAAwkwQAAKAIADCUBAAAoAgAMJUEAACiCAAwlgQAAKMIADALOQAAjggAMDoAAJMIADCOBAAAjwgAMI8EAACQCAAwkAQAAJEIACCRBAAAkggAMJIEAACSCAAwkwQAAJIIADCUBAAAkggAMJUEAACUCAAwlgQAAJUIADALOQAA9AcAMDoAAPkHADCOBAAA9QcAMI8EAAD2BwAwkAQAAPcHACCRBAAA-AcAMJIEAAD4BwAwkwQAAPgHADCUBAAA-AcAMJUEAAD6BwAwlgQAAPsHADALOQAA6wcAMDoAAO8HADCOBAAA7AcAMI8EAADtBwAwkAQAAO4HACCRBAAAoQcAMJIEAAChBwAwkwQAAKEHADCUBAAAoQcAMJUEAADwBwAwlgQAAKQHADALOQAAnQcAMDoAAKIHADCOBAAAngcAMI8EAACfBwAwkAQAAKAHACCRBAAAoQcAMJIEAAChBwAwkwQAAKEHADCUBAAAoQcAMJUEAACjBwAwlgQAAKQHADALOQAAjwcAMDoAAJQHADCOBAAAkAcAMI8EAACRBwAwkAQAAJIHACCRBAAAkwcAMJIEAACTBwAwkwQAAJMHADCUBAAAkwcAMJUEAACVBwAwlgQAAJYHADALOQAA_gYAMDoAAIMHADCOBAAA_wYAMI8EAACABwAwkAQAAIEHACCRBAAAggcAMJIEAACCBwAwkwQAAIIHADCUBAAAggcAMJUEAACEBwAwlgQAAIUHADALOQAA7wYAMDoAAPQGADCOBAAA8AYAMI8EAADxBgAwkAQAAPIGACCRBAAA8wYAMJIEAADzBgAwkwQAAPMGADCUBAAA8wYAMJUEAAD1BgAwlgQAAPYGADALOQAA4AYAMDoAAOUGADCOBAAA4QYAMI8EAADiBgAwkAQAAOMGACCRBAAA5AYAMJIEAADkBgAwkwQAAOQGADCUBAAA5AYAMJUEAADmBgAwlgQAAOcGADALOQAAzQYAMDoAANIGADCOBAAAzgYAMI8EAADPBgAwkAQAANAGACCRBAAA0QYAMJIEAADRBgAwkwQAANEGADCUBAAA0QYAMJUEAADTBgAwlgQAANQGADAOAwAA3wYAICgAAN4GACCIAwEAAAABkwMAAADVAwKWA0AAAAABlwNAAAAAAakDAQAAAAHOAwEAAAAB0AMAAADQAwLRAxAAAAAB0gMBAAAAAdMDAQAAAAHVA0AAAAAB1wMBAAAAAQIAAABXACA5AADdBgAgAwAAAFcAIDkAAN0GACA6AADaBgAgATIAANoNADATAwAA-gUAICgAAIcGACApAACIBgAghQMAAIMGADCGAwAAVQAQhwMAAIMGADCIAwEAAAABkwMAAIUG1QMilgNAAI0FACGXA0AAjQUAIakDAQDJBQAhzgMBAMkFACHQAwAAhAbQAyLRAxAAygUAIdIDAQAAAAHTAwEAiAUAIdUDQACMBQAh1gMBAIYGACHXAwEAiAUAIQIAAABXACAyAADaBgAgAgAAANUGACAyAADWBgAgEIUDAADUBgAwhgMAANUGABCHAwAA1AYAMIgDAQDJBQAhkwMAAIUG1QMilgNAAI0FACGXA0AAjQUAIakDAQDJBQAhzgMBAMkFACHQAwAAhAbQAyLRAxAAygUAIdIDAQCIBQAh0wMBAIgFACHVA0AAjAUAIdYDAQCGBgAh1wMBAIgFACEQhQMAANQGADCGAwAA1QYAEIcDAADUBgAwiAMBAMkFACGTAwAAhQbVAyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACHOAwEAyQUAIdADAACEBtADItEDEADKBQAh0gMBAIgFACHTAwEAiAUAIdUDQACMBQAh1gMBAIYGACHXAwEAiAUAIQyIAwEAtgYAIZMDAADZBtUDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIc4DAQC2BgAh0AMAANcG0AMi0QMQANgGACHSAwEAtwYAIdMDAQC3BgAh1QNAALsGACHXAwEAtwYAIQGRBAAAANADAgWRBBAAAAABlwQQAAAAAZgEEAAAAAGZBBAAAAABmgQQAAAAAQGRBAAAANUDAg4DAADcBgAgKAAA2wYAIIgDAQC2BgAhkwMAANkG1QMilgNAALwGACGXA0AAvAYAIakDAQC2BgAhzgMBALYGACHQAwAA1wbQAyLRAxAA2AYAIdIDAQC3BgAh0wMBALcGACHVA0AAuwYAIdcDAQC3BgAhBTkAANINACA6AADYDQAgjgQAANMNACCPBAAA1w0AIJQEAABgACAFOQAA0A0AIDoAANUNACCOBAAA0Q0AII8EAADUDQAglAQAALwCACAOAwAA3wYAICgAAN4GACCIAwEAAAABkwMAAADVAwKWA0AAAAABlwNAAAAAAakDAQAAAAHOAwEAAAAB0AMAAADQAwLRAxAAAAAB0gMBAAAAAdMDAQAAAAHVA0AAAAAB1wMBAAAAAQM5AADSDQAgjgQAANMNACCUBAAAYAAgAzkAANANACCOBAAA0Q0AIJQEAAC8AgAgDAMAAO4GACCIAwEAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABsgMBAAAAAeADAAAA4AMC4QMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAeUDQAAAAAECAAAAUwAgOQAA7QYAIAMAAABTACA5AADtBgAgOgAA6wYAIAEyAADPDQAwEQMAAPoFACAEAACNBgAghQMAAIoGADCGAwAAUQAQhwMAAIoGADCIAwEAAAABlgNAAI0FACGXA0AAjQUAIacDAQDJBQAhqQMBAMkFACGyAwEAhwUAIeADAACLBuADIuEDAQCHBQAh4gMBAIgFACHjAwEAiAUAIeQDAACMBgAg5QNAAIwFACECAAAAUwAgMgAA6wYAIAIAAADoBgAgMgAA6QYAIA-FAwAA5wYAMIYDAADoBgAQhwMAAOcGADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGnAwEAyQUAIakDAQDJBQAhsgMBAIcFACHgAwAAiwbgAyLhAwEAhwUAIeIDAQCIBQAh4wMBAIgFACHkAwAAjAYAIOUDQACMBQAhD4UDAADnBgAwhgMAAOgGABCHAwAA5wYAMIgDAQDJBQAhlgNAAI0FACGXA0AAjQUAIacDAQDJBQAhqQMBAMkFACGyAwEAhwUAIeADAACLBuADIuEDAQCHBQAh4gMBAIgFACHjAwEAiAUAIeQDAACMBgAg5QNAAIwFACELiAMBALYGACGWA0AAvAYAIZcDQAC8BgAhqQMBALYGACGyAwEAtgYAIeADAADqBuADIuEDAQC2BgAh4gMBALcGACHjAwEAtwYAIeQDgAAAAAHlA0AAuwYAIQGRBAAAAOADAgwDAADsBgAgiAMBALYGACGWA0AAvAYAIZcDQAC8BgAhqQMBALYGACGyAwEAtgYAIeADAADqBuADIuEDAQC2BgAh4gMBALcGACHjAwEAtwYAIeQDgAAAAAHlA0AAuwYAIQU5AADKDQAgOgAAzQ0AII4EAADLDQAgjwQAAMwNACCUBAAAvAIAIAwDAADuBgAgiAMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAbIDAQAAAAHgAwAAAOADAuEDAQAAAAHiAwEAAAAB4wMBAAAAAeQDgAAAAAHlA0AAAAABAzkAAMoNACCOBAAAyw0AIJQEAAC8AgAgCQMAAP0GACCIAwEAAAABlgNAAAAAAakDAQAAAAGqAwEAAAAB4gMBAAAAAeMDAQAAAAHkA4AAAAABhAQAAACEBAICAAAAAQAgOQAA_AYAIAMAAAABACA5AAD8BgAgOgAA-gYAIAEyAADJDQAwDgMAAPoFACAsAACNBgAghQMAAI4GADCGAwAATgAQhwMAAI4GADCIAwEAAAABlgNAAI0FACGpAwEAyQUAIaoDAQCIBQAh4gMBAIcFACHjAwEAhwUAIeQDAACMBgAgggQBAMkFACGEBAAAjwaEBCICAAAAAQAgMgAA-gYAIAIAAAD3BgAgMgAA-AYAIAyFAwAA9gYAMIYDAAD3BgAQhwMAAPYGADCIAwEAyQUAIZYDQACNBQAhqQMBAMkFACGqAwEAiAUAIeIDAQCHBQAh4wMBAIcFACHkAwAAjAYAIIIEAQDJBQAhhAQAAI8GhAQiDIUDAAD2BgAwhgMAAPcGABCHAwAA9gYAMIgDAQDJBQAhlgNAAI0FACGpAwEAyQUAIaoDAQCIBQAh4gMBAIcFACHjAwEAhwUAIeQDAACMBgAgggQBAMkFACGEBAAAjwaEBCIIiAMBALYGACGWA0AAvAYAIakDAQC2BgAhqgMBALcGACHiAwEAtgYAIeMDAQC2BgAh5AOAAAAAAYQEAAD5BoQEIgGRBAAAAIQEAgkDAAD7BgAgiAMBALYGACGWA0AAvAYAIakDAQC2BgAhqgMBALcGACHiAwEAtgYAIeMDAQC2BgAh5AOAAAAAAYQEAAD5BoQEIgU5AADEDQAgOgAAxw0AII4EAADFDQAgjwQAAMYNACCUBAAAvAIAIAkDAAD9BgAgiAMBAAAAAZYDQAAAAAGpAwEAAAABqgMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAYQEAAAAhAQCAzkAAMQNACCOBAAAxQ0AIJQEAAC8AgAgDQMAAI0HACAXAACOBwAgiAMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAa0DAQAAAAH8AwEAAAAB_QMBAAAAAf4DAQAAAAH_AwIAAAABgAQBAAAAAYEEAQAAAAECAAAAPQAgOQAAjAcAIAMAAAA9ACA5AACMBwAgOgAAiQcAIAEyAADDDQAwEgMAAPoFACAXAACSBgAgGwAAjQYAIIUDAACQBgAwhgMAADsAEIcDAACQBgAwiAMBAAAAAZYDQACNBQAhlwNAAI0FACGpAwEAyQUAIa0DAQDJBQAh-wMBAMkFACH8AwEAhwUAIf0DAQCHBQAh_gMBAIcFACH_AwIAkQYAIYAEAQCHBQAhgQQBAIcFACECAAAAPQAgMgAAiQcAIAIAAACGBwAgMgAAhwcAIA-FAwAAhQcAMIYDAACGBwAQhwMAAIUHADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGpAwEAyQUAIa0DAQDJBQAh-wMBAMkFACH8AwEAhwUAIf0DAQCHBQAh_gMBAIcFACH_AwIAkQYAIYAEAQCHBQAhgQQBAIcFACEPhQMAAIUHADCGAwAAhgcAEIcDAACFBwAwiAMBAMkFACGWA0AAjQUAIZcDQACNBQAhqQMBAMkFACGtAwEAyQUAIfsDAQDJBQAh_AMBAIcFACH9AwEAhwUAIf4DAQCHBQAh_wMCAJEGACGABAEAhwUAIYEEAQCHBQAhC4gDAQC2BgAhlgNAALwGACGXA0AAvAYAIakDAQC2BgAhrQMBALYGACH8AwEAtgYAIf0DAQC2BgAh_gMBALYGACH_AwIAiAcAIYAEAQC2BgAhgQQBALYGACEFkQQCAAAAAZcEAgAAAAGYBAIAAAABmQQCAAAAAZoEAgAAAAENAwAAigcAIBcAAIsHACCIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIa0DAQC2BgAh_AMBALYGACH9AwEAtgYAIf4DAQC2BgAh_wMCAIgHACGABAEAtgYAIYEEAQC2BgAhBTkAALsNACA6AADBDQAgjgQAALwNACCPBAAAwA0AIJQEAAC8AgAgBTkAALkNACA6AAC-DQAgjgQAALoNACCPBAAAvQ0AIJQEAAArACANAwAAjQcAIBcAAI4HACCIAwEAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABrQMBAAAAAfwDAQAAAAH9AwEAAAAB_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-BwAwOgAAwgcAMI4EAAC_BwAwjwQAAMAHADCQBAAAwQcAIJEEAACTBwAwkgQAAJMHADCTBAAAkwcAMJQEAACTBwAwlQQAAMMHADCWBAAAlgcAMAs5AACzBwAwOgAAtwcAMI4EAAC0BwAwjwQAALUHADCQBAAAtgcAIJEEAACCBwAwkgQAAIIHADCTBAAAggcAMJQEAACCBwAwlQQAALgHADCWBAAAhQcAMA0DAACNBwAgGwAAvQcAIIgDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAH7AwEAAAAB_AMBAAAAAf0DAQAAAAH-AwEAAAAB_wMCAAAAAYAEAQAAAAGBBAEAAAABAgAAAD0AIDkAALwHACADAAAAPQAgOQAAvAcAIDoAALoHACABMgAApQ0AMAIAAAA9ACAyAAC6BwAgAgAAAIYHACAyAAC5BwAgC4gDAQC2BgAhlgNAALwGACGXA0AAvAYAIakDAQC2BgAh-wMBALYGACH8AwEAtgYAIf0DAQC2BgAh_gMBALYGACH_AwIAiAcAIYAEAQC2BgAhgQQBALYGACENAwAAigcAIBsAALsHACCIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIfsDAQC2BgAh_AMBALYGACH9AwEAtgYAIf4DAQC2BgAh_wMCAIgHACGABAEAtgYAIYEEAQC2BgAhBTkAAKANACA6AACjDQAgjgQAAKENACCPBAAAog0AIJQEAADUBAAgDQMAAI0HACAbAAC9BwAgiAMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAfsDAQAAAAH8AwEAAAAB_QMBAAAAAf4DAQAAAAH_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_BwAgATIAAIQNADAQCQAAjQYAIBEAAJsGACAdAACWBQAghQMAAJ4GADCGAwAAJQAQhwMAAJ4GADCIAwEAAAABiQMBAIcFACGTAwAAnwbGAyKWA0AAjQUAIZcDQACNBQAhqwMBAMkFACGvAwEAyQUAIcIDAQCIBQAhwwNAAIwFACHEA0AAjAUAIQIAAAAnACAyAAD_BwAgAgAAAPwHACAyAAD9BwAgDYUDAAD7BwAwhgMAAPwHABCHAwAA-wcAMIgDAQDJBQAhiQMBAIcFACGTAwAAnwbGAyKWA0AAjQUAIZcDQACNBQAhqwMBAMkFACGvAwEAyQUAIcIDAQCIBQAhwwNAAIwFACHEA0AAjAUAIQ2FAwAA-wcAMIYDAAD8BwAQhwMAAPsHADCIAwEAyQUAIYkDAQCHBQAhkwMAAJ8GxgMilgNAAI0FACGXA0AAjQUAIasDAQDJBQAhrwMBAMkFACHCAwEAiAUAIcMDQACMBQAhxANAAIwFACEJiAMBALYGACGJAwEAtgYAIZMDAAD-B8YDIpYDQAC8BgAhlwNAALwGACGvAwEAtgYAIcIDAQC3BgAhwwNAALsGACHEA0AAuwYAIQGRBAAAAMYDAgsRAACACAAgHQAAgQgAIIgDAQC2BgAhiQMBALYGACGTAwAA_gfGAyKWA0AAvAYAIZcDQAC8BgAhrwMBALYGACHCAwEAtwYAIcMDQAC7BgAhxANAALsGACEFOQAA_gwAIDoAAIINACCOBAAA_wwAII8EAACBDQAglAQAAB8AIAs5AACCCAAwOgAAhggAMI4EAACDCAAwjwQAAIQIADCQBAAAhQgAIJEEAAChBwAwkgQAAKEHADCTBAAAoQcAMJQEAAChBwAwlQQAAIcIADCWBAAApAcAMBcJAADlBwAgEQAA4QcAIBQAAOoHACAVAADjBwAgFgAA5AcAIBgAAOYHACAaAADnBwAgHAAA6AcAIIgDAQAAAAGTAwAAALQDApUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABrwMBAAAAAbEDAQAAAAGyAwEAAAABtQMAAAC1AwK2AwEAAAABtwNAAAAAAbgDEAAAAAG5AwIAAAABAgAAACsAIDkAAIoIACADAAAAKwAgOQAAiggAIDoAAIkIACABMgAAgA0AMAIAAAArACAyAACJCAAgAgAAAKUHACAyAACICAAgD4gDAQC2BgAhkwMAAKcHtAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACGrAwEAtgYAIa8DAQC2BgAhsQMBALcGACGyAwEAtgYAIbUDAACoB7UDIrYDAQC3BgAhtwNAALsGACG4AxAAqQcAIbkDAgCIBwAhFwkAAN8HACARAACrBwAgFAAArQcAIBUAAK4HACAWAACvBwAgGAAAsAcAIBoAALEHACAcAACyBwAgiAMBALYGACGTAwAApwe0AyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIasDAQC2BgAhrwMBALYGACGxAwEAtwYAIbIDAQC2BgAhtQMAAKgHtQMitgMBALcGACG3A0AAuwYAIbgDEACpBwAhuQMCAIgHACEXCQAA5QcAIBEAAOEHACAUAADqBwAgFQAA4wcAIBYAAOQHACAYAADmBwAgGgAA5wcAIBwAAOgHACCIAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGxAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQsRAACMCAAgHQAAjQgAIIgDAQAAAAGJAwEAAAABkwMAAADGAwKWA0AAAAABlwNAAAAAAa8DAQAAAAHCAwEAAAABwwNAAAAAAcQDQAAAAAEDOQAA_gwAII4EAAD_DAAglAQAAB8AIAQ5AACCCAAwjgQAAIMIADCQBAAAhQgAIJQEAAChBwAwAxEAAJsIACCoA0AAAAABrwMBAAAAAQIAAAAjACA5AACaCAAgAwAAACMAIDkAAJoIACA6AACYCAAgATIAAP0MADAJBAAAjQYAIBEAAJsGACCFAwAAoQYAMIYDAAAhABCHAwAAoQYAMKcDAQDJBQAhqANAAI0FACGvAwEAyQUAIYcEAACgBgAgAgAAACMAIDIAAJgIACACAAAAlggAIDIAAJcIACAGhQMAAJUIADCGAwAAlggAEIcDAACVCAAwpwMBAMkFACGoA0AAjQUAIa8DAQDJBQAhBoUDAACVCAAwhgMAAJYIABCHAwAAlQgAMKcDAQDJBQAhqANAAI0FACGvAwEAyQUAIQKoA0AAvAYAIa8DAQC2BgAhAxEAAJkIACCoA0AAvAYAIa8DAQC2BgAhBTkAAPgMACA6AAD7DAAgjgQAAPkMACCPBAAA-gwAIJQEAAAfACADEQAAmwgAIKgDQAAAAAGvAwEAAAABAzkAAPgMACCOBAAA-QwAIJQEAAAfACAPAwAAzAgAIBIAAM0IACAdAADPCAAgHgAAzggAIIgDAQAAAAGJAwEAAAABkwMAAADIAwKVA0AAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAcMDQAAAAAHEA0AAAAABxgMBAAAAAQIAAAAfACA5AADLCAAgAwAAAB8AIDkAAMsIACA6AACnCAAgATIAAPcMADAVAwAA-gUAIAkAAI0GACASAACUBQAgHQAAlgUAIB4AAJUFACCFAwAAowYAMIYDAAAdABCHAwAAowYAMIgDAQAAAAGJAwEAhwUAIZMDAACkBsgDIpUDQACMBQAhlgNAAI0FACGXA0AAjQUAIakDAQDJBQAhqgMBAIgFACGrAwEAyQUAIcMDQACMBQAhxANAAIwFACHGAwEAhwUAIYgEAACiBgAgAgAAAB8AIDIAAKcIACACAAAApAgAIDIAAKUIACAPhQMAAKMIADCGAwAApAgAEIcDAACjCAAwiAMBAMkFACGJAwEAhwUAIZMDAACkBsgDIpUDQACMBQAhlgNAAI0FACGXA0AAjQUAIakDAQDJBQAhqgMBAIgFACGrAwEAyQUAIcMDQACMBQAhxANAAIwFACHGAwEAhwUAIQ-FAwAAowgAMIYDAACkCAAQhwMAAKMIADCIAwEAyQUAIYkDAQCHBQAhkwMAAKQGyAMilQNAAIwFACGWA0AAjQUAIZcDQACNBQAhqQMBAMkFACGqAwEAiAUAIasDAQDJBQAhwwNAAIwFACHEA0AAjAUAIcYDAQCHBQAhC4gDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhwwNAALsGACHEA0AAuwYAIcYDAQC2BgAhAZEEAAAAyAMCDwMAAKgIACASAACpCAAgHQAAqwgAIB4AAKoIACCIAwEAtgYAIYkDAQC2BgAhkwMAAKYIyAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqQMBALYGACGqAwEAtwYAIcMDQAC7BgAhxANAALsGACHGAwEAtgYAIQU5AADlDAAgOgAA9QwAII4EAADmDAAgjwQAAPQMACCUBAAAvAIAIAs5AADACAAwOgAAxAgAMI4EAADBCAAwjwQAAMIIADCQBAAAwwgAIJEEAACSCAAwkgQAAJIIADCTBAAAkggAMJQEAACSCAAwlQQAAMUIADCWBAAAlQgAMAs5AAC1CAAwOgAAuQgAMI4EAAC2CAAwjwQAALcIADCQBAAAuAgAIJEEAAD4BwAwkgQAAPgHADCTBAAA-AcAMJQEAAD4BwAwlQQAALoIADCWBAAA-wcAMAs5AACsCAAwOgAAsAgAMI4EAACtCAAwjwQAAK4IADCQBAAArwgAIJEEAAChBwAwkgQAAKEHADCTBAAAoQcAMJQEAAChBwAwlQQAALEIADCWBAAApAcAMBcJAADlBwAgEwAA4gcAIBQAAOoHACAVAADjBwAgFgAA5AcAIBgAAOYHACAaAADnBwAgHAAA6AcAIIgDAQAAAAGTAwAAALQDApUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABtQMAAAC1AwK2AwEAAAABtwNAAAAAAbgDEAAAAAG5AwIAAAABAgAAACsAIDkAALQIACADAAAAKwAgOQAAtAgAIDoAALMIACABMgAA8wwAMAIAAAArACAyAACzCAAgAgAAAKUHACAyAACyCAAgD4gDAQC2BgAhkwMAAKcHtAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACGrAwEAtgYAIbADAQC3BgAhsQMBALcGACGyAwEAtgYAIbUDAACoB7UDIrYDAQC3BgAhtwNAALsGACG4AxAAqQcAIbkDAgCIBwAhFwkAAN8HACATAACsBwAgFAAArQcAIBUAAK4HACAWAACvBwAgGAAAsAcAIBoAALEHACAcAACyBwAgiAMBALYGACGTAwAApwe0AyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIasDAQC2BgAhsAMBALcGACGxAwEAtwYAIbIDAQC2BgAhtQMAAKgHtQMitgMBALcGACG3A0AAuwYAIbgDEACpBwAhuQMCAIgHACEXCQAA5QcAIBMAAOIHACAUAADqBwAgFQAA4wcAIBYAAOQHACAYAADmBwAgGgAA5wcAIBwAAOgHACCIAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQsJAAC_CAAgHQAAjQgAIIgDAQAAAAGJAwEAAAABkwMAAADGAwKWA0AAAAABlwNAAAAAAasDAQAAAAHCAwEAAAABwwNAAAAAAcQDQAAAAAECAAAAJwAgOQAAvggAIAMAAAAnACA5AAC-CAAgOgAAvAgAIAEyAADyDAAwAgAAACcAIDIAALwIACACAAAA_AcAIDIAALsIACAJiAMBALYGACGJAwEAtgYAIZMDAAD-B8YDIpYDQAC8BgAhlwNAALwGACGrAwEAtgYAIcIDAQC3BgAhwwNAALsGACHEA0AAuwYAIQsJAAC9CAAgHQAAgQgAIIgDAQC2BgAhiQMBALYGACGTAwAA_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_DAAgjgQAAL0MACCPBAAAvgwAIJQEAAC8AgAgBQMAAKMJACCIAwEAAAABqANAAAAAAakDAQAAAAHZAwAAANkDAgM5AAC8DAAgjgQAAL0MACCUBAAAvAIAIAWIAwEAAAABlgNAAAAAAZcDQAAAAAHdAwAAAN0DAt4DAQAAAAECAAAACQAgOQAAsAkAIAMAAAAJACA5AACwCQAgOgAArwkAIAEyAAC7DAAwCwQAAI0GACCFAwAArgYAMIYDAAAHABCHAwAArgYAMIgDAQAAAAGWA0AAjQUAIZcDQACNBQAhpwMBAMkFACHdAwAArwbdAyLeAwEAhwUAIYoEAACtBgAgAgAAAAkAIDIAAK8JACACAAAArAkAIDIAAK0JACAJhQMAAKsJADCGAwAArAkAEIcDAACrCQAwiAMBAMkFACGWA0AAjQUAIZcDQACNBQAhpwMBAMkFACHdAwAArwbdAyLeAwEAhwUAIQmFAwAAqwkAMIYDAACsCQAQhwMAAKsJADCIAwEAyQUAIZYDQACNBQAhlwNAAI0FACGnAwEAyQUAId0DAACvBt0DIt4DAQCHBQAhBYgDAQC2BgAhlgNAALwGACGXA0AAvAYAId0DAACuCd0DIt4DAQC2BgAhAZEEAAAA3QMCBYgDAQC2BgAhlgNAALwGACGXA0AAvAYAId0DAACuCd0DIt4DAQC2BgAhBYgDAQAAAAGWA0AAAAABlwNAAAAAAd0DAAAA3QMC3gMBAAAAAQQ5AACkCQAwjgQAAKUJADCQBAAApwkAIJQEAACoCQAwBDkAAJYJADCOBAAAlwkAMJAEAACZCQAglAQAAJoJADAEOQAAhgkAMI4EAACHCQAwkAQAAIkJACCUBAAAigkAMAQ5AAD7CAAwjgQAAPwIADCQBAAA_ggAIJQEAADiCAAwBDkAAPAIADCOBAAA8QgAMJAEAADzCAAglAQAANQIADAEOQAA0AgAMI4EAADRCAAwkAQAANMIACCUBAAA1AgAMAQ5AACcCAAwjgQAAJ0IADCQBAAAnwgAIJQEAACgCAAwBDkAAI4IADCOBAAAjwgAMJAEAACRCAAglAQAAJIIADAEOQAA9AcAMI4EAAD1BwAwkAQAAPcHACCUBAAA-AcAMAQ5AADrBwAwjgQAAOwHADCQBAAA7gcAIJQEAAChBwAwBDkAAJ0HADCOBAAAngcAMJAEAACgBwAglAQAAKEHADAEOQAAjwcAMI4EAACQBwAwkAQAAJIHACCUBAAAkwcAMAQ5AAD-BgAwjgQAAP8GADCQBAAAgQcAIJQEAACCBwAwBDkAAO8GADCOBAAA8AYAMJAEAADyBgAglAQAAPMGADAEOQAA4AYAMI4EAADhBgAwkAQAAOMGACCUBAAA5AYAMAQ5AADNBgAwjgQAAM4GADCQBAAA0AYAIJQEAADRBgAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFOQAAtgwAIDoAALkMACCOBAAAtwwAII8EAAC4DAAglAQAACsAIAM5AAC2DAAgjgQAALcMACCUBAAAKwAgAAAAAAAAAAABkQQAAAC8AwIBkQQAAAC9AwIFOQAAogwAIDoAALQMACCOBAAAowwAII8EAACzDAAglAQAALwCACAFOQAAoAwAIDoAALEMACCOBAAAoQwAII8EAACwDAAglAQAAIMDACALOQAA5wkAMDoAAOwJADCOBAAA6AkAMI8EAADpCQAwkAQAAOoJACCRBAAA6wkAMJIEAADrCQAwkwQAAOsJADCUBAAA6wkAMJUEAADtCQAwlgQAAO4JADAOAwAAgQoAICcAAIIKACCIAwEAAAABkwMAAADzAwKWA0AAAAABlwNAAAAAAakDAQAAAAG3A0AAAAAB7gMBAAAAAe8DEAAAAAHwAxAAAAAB8QMQAAAAAfMDQAAAAAH0A0AAAAABAgAAAGAAIDkAAIAKACADAAAAYAAgOQAAgAoAIDoAAPIJACABMgAArwwAMBMDAAD6BQAgJgAA_gUAICcAAJsFACCFAwAA_AUAMIYDAABeABCHAwAA_AUAMIgDAQAAAAGTAwAA_QXzAyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG3A0AAjAUAIe0DAQDJBQAh7gMBAAAAAe8DEADKBQAh8AMQAMoFACHxAxAAygUAIfMDQACNBQAh9ANAAI0FACECAAAAYAAgMgAA8gkAIAIAAADvCQAgMgAA8AkAIBCFAwAA7gkAMIYDAADvCQAQhwMAAO4JADCIAwEAyQUAIZMDAAD9BfMDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIbcDQACMBQAh7QMBAMkFACHuAwEAhwUAIe8DEADKBQAh8AMQAMoFACHxAxAAygUAIfMDQACNBQAh9ANAAI0FACEQhQMAAO4JADCGAwAA7wkAEIcDAADuCQAwiAMBAMkFACGTAwAA_QXzAyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG3A0AAjAUAIe0DAQDJBQAh7gMBAIcFACHvAxAAygUAIfADEADKBQAh8QMQAMoFACHzA0AAjQUAIfQDQACNBQAhDIgDAQC2BgAhkwMAAPEJ8wMilgNAALwGACGXA0AAvAYAIakDAQC2BgAhtwNAALsGACHuAwEAtgYAIe8DEADYBgAh8AMQANgGACHxAxAA2AYAIfMDQAC8BgAh9ANAALwGACEBkQQAAADzAwIOAwAA8wkAICcAAPQJACCIAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIbcDQAC7BgAh7gMBALYGACHvAxAA2AYAIfADEADYBgAh8QMQANgGACHzA0AAvAYAIfQDQAC8BgAhBTkAAKQMACA6AACtDAAgjgQAAKUMACCPBAAArAwAIJQEAAC8AgAgCzkAAPUJADA6AAD5CQAwjgQAAPYJADCPBAAA9wkAMJAEAAD4CQAgkQQAANEGADCSBAAA0QYAMJMEAADRBgAwlAQAANEGADCVBAAA-gkAMJYEAADUBgAwDgMAAN8GACApAAD_CQAgiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAGpAwEAAAAB0AMAAADQAwLRAxAAAAAB0gMBAAAAAdMDAQAAAAHVA0AAAAAB1gMBAAAAAdcDAQAAAAECAAAAVwAgOQAA_gkAIAMAAABXACA5AAD-CQAgOgAA_AkAIAEyAACrDAAwAgAAAFcAIDIAAPwJACACAAAA1QYAIDIAAPsJACAMiAMBALYGACGTAwAA2QbVAyKWA0AAvAYAIZcDQAC8BgAhqQMBALYGACHQAwAA1wbQAyLRAxAA2AYAIdIDAQC3BgAh0wMBALcGACHVA0AAuwYAIdYDAQC3BgAh1wMBALcGACEOAwAA3AYAICkAAP0JACCIAwEAtgYAIZMDAADZBtUDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIdADAADXBtADItEDEADYBgAh0gMBALcGACHTAwEAtwYAIdUDQAC7BgAh1gMBALcGACHXAwEAtwYAIQc5AACmDAAgOgAAqQwAII4EAACnDAAgjwQAAKgMACCSBAAAFAAgkwQAABQAIJQEAADUBAAgDgMAAN8GACApAAD_CQAgiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAGpAwEAAAAB0AMAAADQAwLRAxAAAAAB0gMBAAAAAdMDAQAAAAHVA0AAAAAB1gMBAAAAAdcDAQAAAAEDOQAApgwAII4EAACnDAAglAQAANQEACAOAwAAgQoAICcAAIIKACCIAwEAAAABkwMAAADzAwKWA0AAAAABlwNAAAAAAakDAQAAAAG3A0AAAAAB7gMBAAAAAe8DEAAAAAHwAxAAAAAB8QMQAAAAAfMDQAAAAAH0A0AAAAABAzkAAKQMACCOBAAApQwAIJQEAAC8AgAgBDkAAPUJADCOBAAA9gkAMJAEAAD4CQAglAQAANEGADADOQAAogwAII4EAACjDAAglAQAALwCACADOQAAoAwAII4EAAChDAAglAQAAIMDACAEOQAA5wkAMI4EAADoCQAwkAQAAOoJACCUBAAA6wkAMAAAAAAAAAAAAAU5AACbDAAgOgAAngwAII4EAACcDAAgjwQAAJ0MACCUBAAA1AQAIAM5AACbDAAgjgQAAJwMACCUBAAA1AQAIAAAAAAABZEEAgAAAAGXBAIAAAABmAQCAAAAAZkEAgAAAAGaBAIAAAABBZEEBAAAAAGXBAQAAAABmAQEAAAAAZkEBAAAAAGaBAQAAAABCzkAAJkKADA6AACeCgAwjgQAAJoKADCPBAAAmwoAMJAEAACcCgAgkQQAAJ0KADCSBAAAnQoAMJMEAACdCgAwlAQAAJ0KADCVBAAAnwoAMJYEAACgCgAwDAMAAIMKACAlAACFCgAgiAMBAAAAAZMDAAAAvAMClgNAAAAAAZcDQAAAAAGpAwEAAAABvQMAAAC9AwK-A0AAAAABvwNAAAAAAcADIAAAAAHBA0AAAAABAgAAAFsAIDkAAKQKACADAAAAWwAgOQAApAoAIDoAAKMKACABMgAAmgwAMBEDAAD6BQAgJAAAggYAICUAAN4FACCFAwAA_wUAMIYDAABZABCHAwAA_wUAMIgDAQAAAAGTAwAAgAa8AyKWA0AAjQUAIZcDQACNBQAhqQMBAAAAAboDAQDJBQAhvQMAAIEGvQMivgNAAI0FACG_A0AAjQUAIcADIACKBQAhwQNAAIwFACECAAAAWwAgMgAAowoAIAIAAAChCgAgMgAAogoAIA6FAwAAoAoAMIYDAAChCgAQhwMAAKAKADCIAwEAyQUAIZMDAACABrwDIpYDQACNBQAhlwNAAI0FACGpAwEAyQUAIboDAQDJBQAhvQMAAIEGvQMivgNAAI0FACG_A0AAjQUAIcADIACKBQAhwQNAAIwFACEOhQMAAKAKADCGAwAAoQoAEIcDAACgCgAwiAMBAMkFACGTAwAAgAa8AyKWA0AAjQUAIZcDQACNBQAhqQMBAMkFACG6AwEAyQUAIb0DAACBBr0DIr4DQACNBQAhvwNAAI0FACHAAyAAigUAIcEDQACMBQAhCogDAQC2BgAhkwMAAOIJvAMilgNAALwGACGXA0AAvAYAIakDAQC2BgAhvQMAAOMJvQMivgNAALwGACG_A0AAvAYAIcADIAC5BgAhwQNAALsGACEMAwAA5AkAICUAAOYJACCIAwEAtgYAIZMDAADiCbwDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIb0DAADjCb0DIr4DQAC8BgAhvwNAALwGACHAAyAAuQYAIcEDQAC7BgAhDAMAAIMKACAlAACFCgAgiAMBAAAAAZMDAAAAvAMClgNAAAAAAZcDQAAAAAGpAwEAAAABvQMAAAC9AwK-A0AAAAABvwNAAAAAAcADIAAAAAHBA0AAAAABBDkAAJkKADCOBAAAmgoAMJAEAACcCgAglAQAAJ0KADAAAAAAAAAAAAAFOQAAlQwAIDoAAJgMACCOBAAAlgwAII8EAACXDAAglAQAANQEACADOQAAlQwAII4EAACWDAAglAQAANQEACAAAAALOQAAqwsAMDoAAK8LADCOBAAArAsAMI8EAACtCwAwkAQAAK4LACCRBAAAmgkAMJIEAACaCQAwkwQAAJoJADCUBAAAmgkAMJUEAACwCwAwlgQAAJ0JADALOQAAoAsAMDoAAKQLADCOBAAAoQsAMI8EAACiCwAwkAQAAKMLACCRBAAAigkAMJIEAACKCQAwkwQAAIoJADCUBAAAigkAMJUEAAClCwAwlgQAAI0JADALOQAAlwsAMDoAAJsLADCOBAAAmAsAMI8EAACZCwAwkAQAAJoLACCRBAAA1AgAMJIEAADUCAAwkwQAANQIADCUBAAA1AgAMJUEAACcCwAwlgQAANcIADALOQAAjgsAMDoAAJILADCOBAAAjwsAMI8EAACQCwAwkAQAAJELACCRBAAAoAgAMJIEAACgCAAwkwQAAKAIADCUBAAAoAgAMJUEAACTCwAwlgQAAKMIADALOQAA9woAMDoAAPwKADCOBAAA-AoAMI8EAAD5CgAwkAQAAPoKACCRBAAA-woAMJIEAAD7CgAwkwQAAPsKADCUBAAA-woAMJUEAAD9CgAwlgQAAP4KADALOQAA7goAMDoAAPIKADCOBAAA7woAMI8EAADwCgAwkAQAAPEKACCRBAAAggcAMJIEAACCBwAwkwQAAIIHADCUBAAAggcAMJUEAADzCgAwlgQAAIUHADALOQAA4woAMDoAAOcKADCOBAAA5AoAMI8EAADlCgAwkAQAAOYKACCRBAAA8wYAMJIEAADzBgAwkwQAAPMGADCUBAAA8wYAMJUEAADoCgAwlgQAAPYGADALOQAA2AoAMDoAANwKADCOBAAA2QoAMI8EAADaCgAwkAQAANsKACCRBAAA5AYAMJIEAADkBgAwkwQAAOQGADCUBAAA5AYAMJUEAADdCgAwlgQAAOcGADAHOQAA0woAIDoAANYKACCOBAAA1AoAII8EAADVCgAgkgQAAFkAIJMEAABZACCUBAAAWwAgCzkAAMgKADA6AADMCgAwjgQAAMkKADCPBAAAygoAMJAEAADLCgAgkQQAAOsJADCSBAAA6wkAMJMEAADrCQAwlAQAAOsJADCVBAAAzQoAMJYEAADuCQAwCzkAAL8KADA6AADDCgAwjgQAAMAKADCPBAAAwQoAMJAEAADCCgAgkQQAANEGADCSBAAA0QYAMJMEAADRBgAwlAQAANEGADCVBAAAxAoAMJYEAADUBgAwDigAAN4GACApAAD_CQAgiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAHOAwEAAAAB0AMAAADQAwLRAxAAAAAB0gMBAAAAAdMDAQAAAAHVA0AAAAAB1gMBAAAAAdcDAQAAAAECAAAAVwAgOQAAxwoAIAMAAABXACA5AADHCgAgOgAAxgoAIAEyAACUDAAwAgAAAFcAIDIAAMYKACACAAAA1QYAIDIAAMUKACAMiAMBALYGACGTAwAA2QbVAyKWA0AAvAYAIZcDQAC8BgAhzgMBALYGACHQAwAA1wbQAyLRAxAA2AYAIdIDAQC3BgAh0wMBALcGACHVA0AAuwYAIdYDAQC3BgAh1wMBALcGACEOKAAA2wYAICkAAP0JACCIAwEAtgYAIZMDAADZBtUDIpYDQAC8BgAhlwNAALwGACHOAwEAtgYAIdADAADXBtADItEDEADYBgAh0gMBALcGACHTAwEAtwYAIdUDQAC7BgAh1gMBALcGACHXAwEAtwYAIQ4oAADeBgAgKQAA_wkAIIgDAQAAAAGTAwAAANUDApYDQAAAAAGXA0AAAAABzgMBAAAAAdADAAAA0AMC0QMQAAAAAdIDAQAAAAHTAwEAAAAB1QNAAAAAAdYDAQAAAAHXAwEAAAABDiYAANIKACAnAACCCgAgiAMBAAAAAZMDAAAA8wMClgNAAAAAAZcDQAAAAAG3A0AAAAAB7QMBAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQIAAABgACA5AADRCgAgAwAAAGAAIDkAANEKACA6AADPCgAgATIAAJMMADACAAAAYAAgMgAAzwoAIAIAAADvCQAgMgAAzgoAIAyIAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACG3A0AAuwYAIe0DAQC2BgAh7gMBALYGACHvAxAA2AYAIfADEADYBgAh8QMQANgGACHzA0AAvAYAIfQDQAC8BgAhDiYAANAKACAnAAD0CQAgiAMBALYGACGTAwAA8QnzAyKWA0AAvAYAIZcDQAC8BgAhtwNAALsGACHtAwEAtgYAIe4DAQC2BgAh7wMQANgGACHwAxAA2AYAIfEDEADYBgAh8wNAALwGACH0A0AAvAYAIQU5AACODAAgOgAAkQwAII4EAACPDAAgjwQAAJAMACCUBAAAWwAgDiYAANIKACAnAACCCgAgiAMBAAAAAZMDAAAA8wMClgNAAAAAAZcDQAAAAAG3A0AAAAAB7QMBAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQM5AACODAAgjgQAAI8MACCUBAAAWwAgDCQAAIQKACAlAACFCgAgiAMBAAAAAZMDAAAAvAMClgNAAAAAAZcDQAAAAAG6AwEAAAABvQMAAAC9AwK-A0AAAAABvwNAAAAAAcADIAAAAAHBA0AAAAABAgAAAFsAIDkAANMKACADAAAAWQAgOQAA0woAIDoAANcKACAOAAAAWQAgJAAA5QkAICUAAOYJACAyAADXCgAgiAMBALYGACGTAwAA4gm8AyKWA0AAvAYAIZcDQAC8BgAhugMBALYGACG9AwAA4wm9AyK-A0AAvAYAIb8DQAC8BgAhwAMgALkGACHBA0AAuwYAIQwkAADlCQAgJQAA5gkAIIgDAQC2BgAhkwMAAOIJvAMilgNAALwGACGXA0AAvAYAIboDAQC2BgAhvQMAAOMJvQMivgNAALwGACG_A0AAvAYAIcADIAC5BgAhwQNAALsGACEMBAAA4goAIIgDAQAAAAGWA0AAAAABlwNAAAAAAacDAQAAAAGyAwEAAAAB4AMAAADgAwLhAwEAAAAB4gMBAAAAAeMDAQAAAAHkA4AAAAAB5QNAAAAAAQIAAABTACA5AADhCgAgAwAAAFMAIDkAAOEKACA6AADfCgAgATIAAI0MADACAAAAUwAgMgAA3woAIAIAAADoBgAgMgAA3goAIAuIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGnAwEAtgYAIbIDAQC2BgAh4AMAAOoG4AMi4QMBALYGACHiAwEAtwYAIeMDAQC3BgAh5AOAAAAAAeUDQAC7BgAhDAQAAOAKACCIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGnAwEAtgYAIbIDAQC2BgAh4AMAAOoG4AMi4QMBALYGACHiAwEAtwYAIeMDAQC3BgAh5AOAAAAAAeUDQAC7BgAhBTkAAIgMACA6AACLDAAgjgQAAIkMACCPBAAAigwAIJQEAADUBAAgDAQAAOIKACCIAwEAAAABlgNAAAAAAZcDQAAAAAGnAwEAAAABsgMBAAAAAeADAAAA4AMC4QMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAeUDQAAAAAEDOQAAiAwAII4EAACJDAAglAQAANQEACAJLAAA7QoAIIgDAQAAAAGWA0AAAAABqgMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAYIEAQAAAAGEBAAAAIQEAgIAAAABACA5AADsCgAgAwAAAAEAIDkAAOwKACA6AADqCgAgATIAAIcMADACAAAAAQAgMgAA6goAIAIAAAD3BgAgMgAA6QoAIAiIAwEAtgYAIZYDQAC8BgAhqgMBALcGACHiAwEAtgYAIeMDAQC2BgAh5AOAAAAAAYIEAQC2BgAhhAQAAPkGhAQiCSwAAOsKACCIAwEAtgYAIZYDQAC8BgAhqgMBALcGACHiAwEAtgYAIeMDAQC2BgAh5AOAAAAAAYIEAQC2BgAhhAQAAPkGhAQiBTkAAIIMACA6AACFDAAgjgQAAIMMACCPBAAAhAwAIJQEAADUBAAgCSwAAO0KACCIAwEAAAABlgNAAAAAAaoDAQAAAAHiAwEAAAAB4wMBAAAAAeQDgAAAAAGCBAEAAAABhAQAAACEBAIDOQAAggwAII4EAACDDAAglAQAANQEACANFwAAjgcAIBsAAL0HACCIAwEAAAABlgNAAAAAAZcDQAAAAAGtAwEAAAAB-wMBAAAAAfwDAQAAAAH9AwEAAAAB_gMBAAAAAf8DAgAAAAGABAEAAAABgQQBAAAAAQIAAAA9ACA5AAD2CgAgAwAAAD0AIDkAAPYKACA6AAD1CgAgATIAAIEMADACAAAAPQAgMgAA9QoAIAIAAACGBwAgMgAA9AoAIAuIAwEAtgYAIZYDQAC8BgAhlwNAALwGACGtAwEAtgYAIfsDAQC2BgAh_AMBALYGACH9AwEAtgYAIf4DAQC2BgAh_wMCAIgHACGABAEAtgYAIYEEAQC2BgAhDRcAAIsHACAbAAC7BwAgiAMBALYGACGWA0AAvAYAIZcDQAC8BgAhrQMBALYGACH7AwEAtgYAIfwDAQC2BgAh_QMBALYGACH-AwEAtgYAIf8DAgCIBwAhgAQBALYGACGBBAEAtgYAIQ0XAACOBwAgGwAAvQcAIIgDAQAAAAGWA0AAAAABlwNAAAAAAa0DAQAAAAH7AwEAAAAB_AMBAAAAAf0DAQAAAAH-AwEAAAAB_wMCAAAAAYAEAQAAAAGBBAEAAAABBhgAAI0LACCIAwEAAAABiQMBAAAAAZYDQAAAAAGXA0AAAAAB7AMBAAAAAQIAAAB7ACA5AACMCwAgAwAAAHsAIDkAAIwLACA6AACBCwAgATIAAIAMADAMAwAA-gUAIBgAAPsFACCFAwAA-QUAMIYDAAB5ABCHAwAA-QUAMIgDAQAAAAGJAwEAhwUAIZYDQACNBQAhlwNAAI0FACGpAwEAyQUAIewDAQCIBQAhhQQAAPgFACACAAAAewAgMgAAgQsAIAIAAAD_CgAgMgAAgAsAIAmFAwAA_goAMIYDAAD_CgAQhwMAAP4KADCIAwEAyQUAIYkDAQCHBQAhlgNAAI0FACGXA0AAjQUAIakDAQDJBQAh7AMBAIgFACEJhQMAAP4KADCGAwAA_woAEIcDAAD-CgAwiAMBAMkFACGJAwEAhwUAIZYDQACNBQAhlwNAAI0FACGpAwEAyQUAIewDAQCIBQAhBYgDAQC2BgAhiQMBALYGACGWA0AAvAYAIZcDQAC8BgAh7AMBALcGACEGGAAAggsAIIgDAQC2BgAhiQMBALYGACGWA0AAvAYAIZcDQAC8BgAh7AMBALcGACELOQAAgwsAMDoAAIcLADCOBAAAhAsAMI8EAACFCwAwkAQAAIYLACCRBAAAzQcAMJIEAADNBwAwkwQAAM0HADCUBAAAzQcAMJUEAACICwAwlgQAANAHADACFwAA2QkAIK0DAQAAAAECAAAAMwAgOQAAiwsAIAMAAAAzACA5AACLCwAgOgAAigsAIAEyAAD_CwAwAgAAADMAIDIAAIoLACACAAAA0QcAIDIAAIkLACABrQMBALYGACECFwAA2AkAIK0DAQC2BgAhAhcAANkJACCtAwEAAAABBhgAAI0LACCIAwEAAAABiQMBAAAAAZYDQAAAAAGXA0AAAAAB7AMBAAAAAQQ5AACDCwAwjgQAAIQLADCQBAAAhgsAIJQEAADNBwAwDwkAAJAKACASAADNCAAgHQAAzwgAIB4AAM4IACCIAwEAAAABiQMBAAAAAZMDAAAAyAMClQNAAAAAAZYDQAAAAAGXA0AAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAECAAAAHwAgOQAAlgsAIAMAAAAfACA5AACWCwAgOgAAlQsAIAEyAAD-CwAwAgAAAB8AIDIAAJULACACAAAApAgAIDIAAJQLACALiAMBALYGACGJAwEAtgYAIZMDAACmCMgDIpUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACEPCQAAjwoAIBIAAKkIACAdAACrCAAgHgAAqggAIIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIasDAQC2BgAhwwNAALsGACHEA0AAuwYAIcYDAQC2BgAhDwkAAJAKACASAADNCAAgHQAAzwgAIB4AAM4IACCIAwEAAAABiQMBAAAAAZMDAAAAyAMClQNAAAAAAZYDQAAAAAGXA0AAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAEKCQAA7ggAIAoAAPoIACALAADvCAAgiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAQIAAAAaACA5AACfCwAgAwAAABoAIDkAAJ8LACA6AACeCwAgATIAAP0LADACAAAAGgAgMgAAngsAIAIAAADYCAAgMgAAnQsAIAeIAwEAtgYAIYkDAQC2BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACGsAwEAtwYAIQoJAADcCAAgCgAA-AgAIAsAAN0IACCIAwEAtgYAIYkDAQC2BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACGsAwEAtwYAIQoJAADuCAAgCgAA-ggAIAsAAO8IACCIAwEAAAABiQMBAAAAAZYDQAAAAAGXA0AAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABCwcAAKoLACCIAwEAAAABigMBAAAAAZMDAAAA-AMClgNAAAAAAZcDQAAAAAHZAwAAANkDAvUDAQAAAAH2AwEAAAAB-ANAAAAAAfkDQAAAAAECAAAADgAgOQAAqQsAIAMAAAAOACA5AACpCwAgOgAApwsAIAEyAAD8CwAwAgAAAA4AIDIAAKcLACACAAAAjgkAIDIAAKYLACAKiAMBALYGACGKAwEAtgYAIZMDAACRCfgDIpYDQAC8BgAhlwNAALwGACHZAwAAkAnZAyL1AwEAtgYAIfYDAQC2BgAh-ANAALwGACH5A0AAuwYAIQsHAACoCwAgiAMBALYGACGKAwEAtgYAIZMDAACRCfgDIpYDQAC8BgAhlwNAALwGACHZAwAAkAnZAyL1AwEAtgYAIfYDAQC2BgAh-ANAALwGACH5A0AAuwYAIQU5AAD3CwAgOgAA-gsAII4EAAD4CwAgjwQAAPkLACCUBAAA1AQAIAsHAACqCwAgiAMBAAAAAYoDAQAAAAGTAwAAAPgDApYDQAAAAAGXA0AAAAAB2QMAAADZAwL1AwEAAAAB9gMBAAAAAfgDQAAAAAH5A0AAAAABAzkAAPcLACCOBAAA-AsAIJQEAADUBAAgBQQAALAKACCIAwEAAAABpwMBAAAAAagDQAAAAAHZAwAAANkDAgIAAAAFACA5AACzCwAgAwAAAAUAIDkAALMLACA6AACyCwAgATIAAPYLADACAAAABQAgMgAAsgsAIAIAAACeCQAgMgAAsQsAIASIAwEAtgYAIacDAQC2BgAhqANAALwGACHZAwAAkAnZAyIFBAAArwoAIIgDAQC2BgAhpwMBALYGACGoA0AAvAYAIdkDAACQCdkDIgUEAACwCgAgiAMBAAAAAacDAQAAAAGoA0AAAAAB2QMAAADZAwIEOQAAqwsAMI4EAACsCwAwkAQAAK4LACCUBAAAmgkAMAQ5AACgCwAwjgQAAKELADCQBAAAowsAIJQEAACKCQAwBDkAAJcLADCOBAAAmAsAMJAEAACaCwAglAQAANQIADAEOQAAjgsAMI4EAACPCwAwkAQAAJELACCUBAAAoAgAMAQ5AAD3CgAwjgQAAPgKADCQBAAA-goAIJQEAAD7CgAwBDkAAO4KADCOBAAA7woAMJAEAADxCgAglAQAAIIHADAEOQAA4woAMI4EAADkCgAwkAQAAOYKACCUBAAA8wYAMAQ5AADYCgAwjgQAANkKADCQBAAA2woAIJQEAADkBgAwAzkAANMKACCOBAAA1AoAIJQEAABbACAEOQAAyAoAMI4EAADJCgAwkAQAAMsKACCUBAAA6wkAMAQ5AAC_CgAwjgQAAMAKADCQBAAAwgoAIJQEAADRBgAwAAQDAADiCwAgJAAA5AsAICUAAMELACDBAwAAsgYAIAAAAAAFOQAA8QsAIDoAAPQLACCOBAAA8gsAII8EAADzCwAglAQAANQEACADOQAA8QsAII4EAADyCwAglAQAANQEACAAAAAAAAAFOQAA7AsAIDoAAO8LACCOBAAA7QsAII8EAADuCwAglAQAALwCACADOQAA7AsAII4EAADtCwAglAQAALwCACAAAAAAAAAAAAAAAAAAAAAAAAAADwgAAMMJACALAADCCQAgDwAAxQkAIBwAAMsJACAfAADGCQAgIQAAzAkAICIAAM0JACAlAADBCwAgJgAAwAsAICcAAM4JACArAAC_CwAglQMAALIGACCqAwAAsgYAINoDAACyBgAg2wMAALIGACAABiMAAKYKACCqAwAAsgYAIMoDAACyBgAgywMAALIGACDMAwAAsgYAIM0DAACyBgAgBAMAAOILACAmAADACwAgJwAAzgkAILcDAACyBgAgFAUAAMEJACAGAADCCQAgCAAAwwkAIA4AAMQJACAPAADFCQAgEAAAxQkAIBIAAMcJACAaAADKCQAgHAAAywkAIB0AAMkJACAeAADICQAgHwAAxgkAICAAAMkJACAhAADMCQAgIgAAzQkAICoAAM4JACCLAwAAsgYAIIwDAACyBgAgjQMAALIGACCVAwAAsgYAIBAJAADmCwAgEQAA6QsAIBMAAOoLACAUAADnCwAgFQAAyQkAIBYAAOYLACAYAADjCwAgGgAAygkAIBwAAMsJACCVAwAAsgYAIKoDAACyBgAgsAMAALIGACCxAwAAsgYAILYDAACyBgAgtwMAALIGACC4AwAAsgYAIAMDAADiCwAgGAAA4wsAIOwDAACyBgAgCQMAAOILACAJAADmCwAgEgAAxwkAIB0AAMkJACAeAADICQAglQMAALIGACCqAwAAsgYAIMMDAACyBgAgxAMAALIGACAGCQAA5gsAIBEAAOkLACAdAADJCQAgwgMAALIGACDDAwAAsgYAIMQDAACyBgAgBgMAAOILACAJAADmCwAgCgAA5gsAIAsAAMQJACCqAwAAsgYAIKwDAACyBgAgEwgAALULACALAAC0CwAgDwAAtgsAIBwAALkLACAfAAC3CwAgIQAAugsAICIAALsLACAlAAC9CwAgJgAAvAsAICcAAL4LACCIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAECAAAAvAIAIDkAAOwLACADAAAAvwIAIDkAAOwLACA6AADwCwAgFQAAAL8CACAIAAC1CgAgCwAAtAoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgMgAA8AsAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIRMIAAC1CgAgCwAAtAoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgiAMBALYGACGJAwEAtgYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhxgMBALYGACHaAwEAtwYAIdsDAQC3BgAhHQYAALIJACAIAACzCQAgDgAAtAkAIA8AALUJACAQAAC2CQAgEgAAuAkAIBoAALwJACAcAAC9CQAgHQAAugkAIB4AALkJACAfAAC3CQAgIAAAuwkAICEAAL4JACAiAAC_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-wMBAAAAAfwDAQAAAAH9AwEAAAAB_gMBAAAAAf8DAgAAAAGABAEAAAABgQQBAAAAAR0FAACxCQAgBgAAsgkAIAgAALMJACAOAAC0CQAgDwAAtQkAIBAAALYJACASAAC4CQAgGgAAvAkAIBwAAL0JACAdAAC6CQAgHgAAuQkAIB8AALcJACAgAAC7CQAgIgAAvwkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABAgAAANQEACA5AACCDAAgAwAAABQAIDkAAIIMACA6AACGDAAgHwAAABQAIAUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAiAADLBgAgKgAAzAYAIDIAAIYMACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEdBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICIAAMsGACAqAADMBgAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhCIgDAQAAAAGWA0AAAAABqgMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAYIEAQAAAAGEBAAAAIQEAh0FAACxCQAgBgAAsgkAIAgAALMJACAOAAC0CQAgDwAAtQkAIBAAALYJACASAAC4CQAgGgAAvAkAIBwAAL0JACAdAAC6CQAgHgAAuQkAIB8AALcJACAgAAC7CQAgIQAAvgkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABAgAAANQEACA5AACIDAAgAwAAABQAIDkAAIgMACA6AACMDAAgHwAAABQAIAUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgKgAAzAYAIDIAAIwMACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEdBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAqAADMBgAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhC4gDAQAAAAGWA0AAAAABlwNAAAAAAacDAQAAAAGyAwEAAAAB4AMAAADgAwLhAwEAAAAB4gMBAAAAAeMDAQAAAAHkA4AAAAAB5QNAAAAAAQ0DAACDCgAgJAAAhAoAIIgDAQAAAAGTAwAAALwDApYDQAAAAAGXA0AAAAABqQMBAAAAAboDAQAAAAG9AwAAAL0DAr4DQAAAAAG_A0AAAAABwAMgAAAAAcEDQAAAAAECAAAAWwAgOQAAjgwAIAMAAABZACA5AACODAAgOgAAkgwAIA8AAABZACADAADkCQAgJAAA5QkAIDIAAJIMACCIAwEAtgYAIZMDAADiCbwDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIboDAQC2BgAhvQMAAOMJvQMivgNAALwGACG_A0AAvAYAIcADIAC5BgAhwQNAALsGACENAwAA5AkAICQAAOUJACCIAwEAtgYAIZMDAADiCbwDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIboDAQC2BgAhvQMAAOMJvQMivgNAALwGACG_A0AAvAYAIcADIAC5BgAhwQNAALsGACEMiAMBAAAAAZMDAAAA8wMClgNAAAAAAZcDQAAAAAG3A0AAAAAB7QMBAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQyIAwEAAAABkwMAAADVAwKWA0AAAAABlwNAAAAAAc4DAQAAAAHQAwAAANADAtEDEAAAAAHSAwEAAAAB0wMBAAAAAdUDQAAAAAHWAwEAAAAB1wMBAAAAAR0FAACxCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEAAAtgkAIBIAALgJACAaAAC8CQAgHAAAvQkAIB0AALoJACAeAAC5CQAgHwAAtwkAICAAALsJACAhAAC-CQAgIgAAvwkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABAgAAANQEACA5AACVDAAgAwAAABQAIDkAAJUMACA6AACZDAAgHwAAABQAIAUAAL0GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIDIAAJkMACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEdBQAAvQYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAgAADHBgAgIQAAygYAICIAAMsGACAqAADMBgAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhCogDAQAAAAGTAwAAALwDApYDQAAAAAGXA0AAAAABqQMBAAAAAb0DAAAAvQMCvgNAAAAAAb8DQAAAAAHAAyAAAAABwQNAAAAAAR0FAACxCQAgBgAAsgkAIAgAALMJACAOAAC0CQAgDwAAtQkAIBAAALYJACASAAC4CQAgGgAAvAkAIBwAAL0JACAdAAC6CQAgHgAAuQkAICAAALsJACAhAAC-CQAgIgAAvwkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABAgAAANQEACA5AACbDAAgAwAAABQAIDkAAJsMACA6AACfDAAgHwAAABQAIAUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIDIAAJ8MACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEdBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAgAADHBgAgIQAAygYAICIAAMsGACAqAADMBgAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhDIgDAQAAAAGJAwEAAAABkAMgAAAAAZYDQAAAAAGXA0AAAAABqgMBAAAAAcgDEAAAAAHJAxAAAAABygMCAAAAAcsDAgAAAAHMAwIAAAABzQMEAAAAAQIAAACDAwAgOQAAoAwAIBMIAAC1CwAgCwAAtAsAIA8AALYLACAcAAC5CwAgHwAAtwsAICEAALoLACAiAAC7CwAgJQAAvQsAICcAAL4LACArAAC4CwAgiAMBAAAAAYkDAQAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABxgMBAAAAAdoDAQAAAAHbAwEAAAABAgAAALwCACA5AACiDAAgEwgAALULACALAAC0CwAgDwAAtgsAIBwAALkLACAfAAC3CwAgIQAAugsAICIAALsLACAmAAC8CwAgJwAAvgsAICsAALgLACCIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAECAAAAvAIAIDkAAKQMACAdBQAAsQkAIAYAALIJACAIAACzCQAgDgAAtAkAIA8AALUJACAQAAC2CQAgEgAAuAkAIBoAALwJACAcAAC9CQAgHQAAugkAIB4AALkJACAfAAC3CQAgIAAAuwkAICEAAL4JACAiAAC_CQAgiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQIAAADUBAAgOQAApgwAIAMAAAAUACA5AACmDAAgOgAAqgwAIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAgAADHBgAgIQAAygYAICIAAMsGACAyAACqDAAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQyIAwEAAAABkwMAAADVAwKWA0AAAAABlwNAAAAAAakDAQAAAAHQAwAAANADAtEDEAAAAAHSAwEAAAAB0wMBAAAAAdUDQAAAAAHWAwEAAAAB1wMBAAAAAQMAAAC_AgAgOQAApAwAIDoAAK4MACAVAAAAvwIAIAgAALUKACALAAC0CgAgDwAAtgoAIBwAALkKACAfAAC3CgAgIQAAugoAICIAALsKACAmAAC8CgAgJwAAvgoAICsAALgKACAyAACuDAAgiAMBALYGACGJAwEAtgYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhxgMBALYGACHaAwEAtwYAIdsDAQC3BgAhEwgAALUKACALAAC0CgAgDwAAtgoAIBwAALkKACAfAAC3CgAgIQAAugoAICIAALsKACAmAAC8CgAgJwAAvgoAICsAALgKACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACEMiAMBAAAAAZMDAAAA8wMClgNAAAAAAZcDQAAAAAGpAwEAAAABtwNAAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQMAAACGAwAgOQAAoAwAIDoAALIMACAOAAAAhgMAIDIAALIMACCIAwEAtgYAIYkDAQC2BgAhkAMgALkGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHIAxAA2AYAIckDEADYBgAhygMCAJYKACHLAwIAlgoAIcwDAgCWCgAhzQMEAJcKACEMiAMBALYGACGJAwEAtgYAIZADIAC5BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhyAMQANgGACHJAxAA2AYAIcoDAgCWCgAhywMCAJYKACHMAwIAlgoAIc0DBACXCgAhAwAAAL8CACA5AACiDAAgOgAAtQwAIBUAAAC_AgAgCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAnAAC-CgAgKwAAuAoAIDIAALUMACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIRgJAADlBwAgEQAA4QcAIBMAAOIHACAUAADqBwAgFQAA4wcAIBYAAOQHACAaAADnBwAgHAAA6AcAIIgDAQAAAAGTAwAAALQDApUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQIAAAArACA5AAC2DAAgAwAAACkAIDkAALYMACA6AAC6DAAgGgAAACkAIAkAAN8HACARAACrBwAgEwAArAcAIBQAAK0HACAVAACuBwAgFgAArwcAIBoAALEHACAcAACyBwAgMgAAugwAIIgDAQC2BgAhkwMAAKcHtAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACGrAwEAtgYAIa8DAQC2BgAhsAMBALcGACGxAwEAtwYAIbIDAQC2BgAhtQMAAKgHtQMitgMBALcGACG3A0AAuwYAIbgDEACpBwAhuQMCAIgHACEYCQAA3wcAIBEAAKsHACATAACsBwAgFAAArQcAIBUAAK4HACAWAACvBwAgGgAAsQcAIBwAALIHACCIAwEAtgYAIZMDAACnB7QDIpUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACGvAwEAtgYAIbADAQC3BgAhsQMBALcGACGyAwEAtgYAIbUDAACoB7UDIrYDAQC3BgAhtwNAALsGACG4AxAAqQcAIbkDAgCIBwAhBYgDAQAAAAGWA0AAAAABlwNAAAAAAd0DAAAA3QMC3gMBAAAAARMIAAC1CwAgDwAAtgsAIBwAALkLACAfAAC3CwAgIQAAugsAICIAALsLACAlAAC9CwAgJgAAvAsAICcAAL4LACArAAC4CwAgiAMBAAAAAYkDAQAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABxgMBAAAAAdoDAQAAAAHbAwEAAAABAgAAALwCACA5AAC8DAAgAwAAAL8CACA5AAC8DAAgOgAAwAwAIBUAAAC_AgAgCAAAtQoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIDIAAMAMACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQSIAwEAAAABqANAAAAAAakDAQAAAAHZAwAAANkDAhMLAAC0CwAgDwAAtgsAIBwAALkLACAfAAC3CwAgIQAAugsAICIAALsLACAlAAC9CwAgJgAAvAsAICcAAL4LACArAAC4CwAgiAMBAAAAAYkDAQAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABxgMBAAAAAdoDAQAAAAHbAwEAAAABAgAAALwCACA5AADCDAAgAwAAAL8CACA5AADCDAAgOgAAxgwAIBUAAAC_AgAgCwAAtAoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIDIAAMYMACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCwAAtAoAIA8AALYKACAcAAC5CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQqIAwEAAAABigMBAAAAAZMDAAAA-AMClgNAAAAAAZcDQAAAAAGpAwEAAAAB2QMAAADZAwL2AwEAAAAB-ANAAAAAAfkDQAAAAAELAwAA7QgAIAkAAO4IACAKAAD6CAAgiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAAawDAQAAAAECAAAAGgAgOQAAyAwAIAMAAAAYACA5AADIDAAgOgAAzAwAIA0AAAAYACADAADbCAAgCQAA3AgAIAoAAPgIACAyAADMDAAgiAMBALYGACGJAwEAtgYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACGsAwEAtwYAIQsDAADbCAAgCQAA3AgAIAoAAPgIACCIAwEAtgYAIYkDAQC2BgAhlgNAALwGACGXA0AAvAYAIakDAQC2BgAhqgMBALcGACGrAwEAtgYAIawDAQC3BgAhAqYDAQAAAAGoA0AAAAABHQUAALEJACAGAACyCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEgAAuAkAIBoAALwJACAcAAC9CQAgHQAAugkAIB4AALkJACAfAAC3CQAgIAAAuwkAICEAAL4JACAiAAC_CQAgKgAAwAkAIIgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGTAwAAAJMDApQDIAAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAECAAAA1AQAIDkAAM4MACADAAAAFAAgOQAAzgwAIDoAANIMACAfAAAAFAAgBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACASAADEBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAgAADHBgAgIQAAygYAICIAAMsGACAqAADMBgAgMgAA0gwAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIR0FAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEHiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAGqAwEAAAABrAMBAAAAAR0FAACxCQAgBgAAsgkAIAgAALMJACAOAAC0CQAgEAAAtgkAIBIAALgJACAaAAC8CQAgHAAAvQkAIB0AALoJACAeAAC5CQAgHwAAtwkAICAAALsJACAhAAC-CQAgIgAAvwkAICoAAMAJACCIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkwMAAACTAwKUAyAAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABAgAAANQEACA5AADUDAAgEwgAALULACALAAC0CwAgHAAAuQsAIB8AALcLACAhAAC6CwAgIgAAuwsAICUAAL0LACAmAAC8CwAgJwAAvgsAICsAALgLACCIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAECAAAAvAIAIDkAANYMACAdBQAAsQkAIAYAALIJACAIAACzCQAgDwAAtQkAIBAAALYJACASAAC4CQAgGgAAvAkAIBwAAL0JACAdAAC6CQAgHgAAuQkAIB8AALcJACAgAAC7CQAgIQAAvgkAICIAAL8JACAqAADACQAgiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQIAAADUBAAgOQAA2AwAIAMAAAAUACA5AADYDAAgOgAA3AwAIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACAyAADcDAAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQKnAwEAAAABqANAAAAAAQMAAAAUACA5AADUDAAgOgAA4AwAIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACAyAADgDAAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAQAADCBgAgEgAAxAYAIBoAAMgGACAcAADJBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQMAAAC_AgAgOQAA1gwAIDoAAOMMACAVAAAAvwIAIAgAALUKACALAAC0CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAmAAC8CgAgJwAAvgoAICsAALgKACAyAADjDAAgiAMBALYGACGJAwEAtgYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhxgMBALYGACHaAwEAtwYAIdsDAQC3BgAhEwgAALUKACALAAC0CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAmAAC8CgAgJwAAvgoAICsAALgKACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACEHiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAARMIAAC1CwAgCwAAtAsAIA8AALYLACAcAAC5CwAgIQAAugsAICIAALsLACAlAAC9CwAgJgAAvAsAICcAAL4LACArAAC4CwAgiAMBAAAAAYkDAQAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABxgMBAAAAAdoDAQAAAAHbAwEAAAABAgAAALwCACA5AADlDAAgHQUAALEJACAGAACyCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEAAAtgkAIBoAALwJACAcAAC9CQAgHQAAugkAIB4AALkJACAfAAC3CQAgIAAAuwkAICEAAL4JACAiAAC_CQAgKgAAwAkAIIgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGTAwAAAJMDApQDIAAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAECAAAA1AQAIDkAAOcMACADAAAAFAAgOQAA5wwAIDoAAOsMACAfAAAAFAAgBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAgAADHBgAgIQAAygYAICIAAMsGACAqAADMBgAgMgAA6wwAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIR0FAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACECpwMBAAAAAagDQAAAAAEdBQAAsQkAIAYAALIJACAIAACzCQAgDgAAtAkAIA8AALUJACAQAAC2CQAgEgAAuAkAIBoAALwJACAcAAC9CQAgHQAAugkAIB8AALcJACAgAAC7CQAgIQAAvgkAICIAAL8JACAqAADACQAgiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQIAAADUBAAgOQAA7QwAIAMAAAAUACA5AADtDAAgOgAA8QwAIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACAyAADxDAAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQmIAwEAAAABiQMBAAAAAZMDAAAAxgMClgNAAAAAAZcDQAAAAAGrAwEAAAABwgMBAAAAAcMDQAAAAAHEA0AAAAABD4gDAQAAAAGTAwAAALQDApUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABtQMAAAC1AwK2AwEAAAABtwNAAAAAAbgDEAAAAAG5AwIAAAABAwAAAL8CACA5AADlDAAgOgAA9gwAIBUAAAC_AgAgCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIDIAAPYMACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQuIAwEAAAABiQMBAAAAAZMDAAAAyAMClQNAAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAaoDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAEQAwAAzAgAIAkAAJAKACAdAADPCAAgHgAAzggAIIgDAQAAAAGJAwEAAAABkwMAAADIAwKVA0AAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAECAAAAHwAgOQAA-AwAIAMAAAAdACA5AAD4DAAgOgAA_AwAIBIAAAAdACADAACoCAAgCQAAjwoAIB0AAKsIACAeAACqCAAgMgAA_AwAIIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACEQAwAAqAgAIAkAAI8KACAdAACrCAAgHgAAqggAIIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACECqANAAAAAAa8DAQAAAAEQAwAAzAgAIAkAAJAKACASAADNCAAgHQAAzwgAIIgDAQAAAAGJAwEAAAABkwMAAADIAwKVA0AAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAECAAAAHwAgOQAA_gwAIA-IAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGxAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQMAAAAdACA5AAD-DAAgOgAAgw0AIBIAAAAdACADAACoCAAgCQAAjwoAIBIAAKkIACAdAACrCAAgMgAAgw0AIIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACEQAwAAqAgAIAkAAI8KACASAACpCAAgHQAAqwgAIIgDAQC2BgAhiQMBALYGACGTAwAApgjIAyKVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGpAwEAtgYAIaoDAQC3BgAhqwMBALYGACHDA0AAuwYAIcQDQAC7BgAhxgMBALYGACEJiAMBAAAAAYkDAQAAAAGTAwAAAMYDApYDQAAAAAGXA0AAAAABrwMBAAAAAcIDAQAAAAHDA0AAAAABxANAAAAAAQ-IAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAG1AwAAALUDArcDQAAAAAG4AxAAAAABuQMCAAAAARgJAADlBwAgEQAA4QcAIBMAAOIHACAUAADqBwAgFgAA5AcAIBgAAOYHACAaAADnBwAgHAAA6AcAIIgDAQAAAAGTAwAAALQDApUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAGrAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQIAAAArACA5AACGDQAgHQUAALEJACAGAACyCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEAAAtgkAIBIAALgJACAaAAC8CQAgHAAAvQkAIB0AALoJACAeAAC5CQAgHwAAtwkAICEAAL4JACAiAAC_CQAgKgAAwAkAIIgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGTAwAAAJMDApQDIAAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAECAAAA1AQAIDkAAIgNACAdBQAAsQkAIAYAALIJACAIAACzCQAgDgAAtAkAIA8AALUJACAQAAC2CQAgEgAAuAkAIBoAALwJACAcAAC9CQAgHgAAuQkAIB8AALcJACAgAAC7CQAgIQAAvgkAICIAAL8JACAqAADACQAgiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQIAAADUBAAgOQAAig0AIAwJAAC_CAAgEQAAjAgAIIgDAQAAAAGJAwEAAAABkwMAAADGAwKWA0AAAAABlwNAAAAAAasDAQAAAAGvAwEAAAABwgMBAAAAAcMDQAAAAAHEA0AAAAABAgAAACcAIDkAAIwNACAQAwAAzAgAIAkAAJAKACASAADNCAAgHgAAzggAIIgDAQAAAAGJAwEAAAABkwMAAADIAwKVA0AAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAHDA0AAAAABxANAAAAAAcYDAQAAAAECAAAAHwAgOQAAjg0AIAMAAAAUACA5AACIDQAgOgAAkg0AIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgGgAAyAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAhAADKBgAgIgAAywYAICoAAMwGACAyAACSDQAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQ-IAwEAAAABkwMAAAC0AwKVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABqwMBAAAAAa8DAQAAAAGwAwEAAAABsgMBAAAAAbUDAAAAtQMCtgMBAAAAAbcDQAAAAAG4AxAAAAABuQMCAAAAAQcDAADOCwAgiAMBAAAAAYkDAQAAAAGWA0AAAAABlwNAAAAAAakDAQAAAAHsAwEAAAABAgAAAHsAIDkAAJQNACADAAAAeQAgOQAAlA0AIDoAAJgNACAJAAAAeQAgAwAAzQsAIDIAAJgNACCIAwEAtgYAIYkDAQC2BgAhlgNAALwGACGXA0AAvAYAIakDAQC2BgAh7AMBALcGACEHAwAAzQsAIIgDAQC2BgAhiQMBALYGACGWA0AAvAYAIZcDQAC8BgAhqQMBALYGACHsAwEAtwYAIQGuAwEAAAABHQUAALEJACAGAACyCQAgCAAAswkAIA4AALQJACAPAAC1CQAgEAAAtgkAIBIAALgJACAcAAC9CQAgHQAAugkAIB4AALkJACAfAAC3CQAgIAAAuwkAICEAAL4JACAiAAC_CQAgKgAAwAkAIIgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGTAwAAAJMDApQDIAAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAECAAAA1AQAIDkAAJoNACADAAAAFAAgOQAAmg0AIDoAAJ4NACAfAAAAFAAgBQAAvQYAIAYAAL4GACAIAAC_BgAgDgAAwAYAIA8AAMEGACAQAADCBgAgEgAAxAYAIBwAAMkGACAdAADGBgAgHgAAxQYAIB8AAMMGACAgAADHBgAgIQAAygYAICIAAMsGACAqAADMBgAgMgAAng0AIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIR0FAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgHAAAyQYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACCIAwEAtgYAIYkDAQC2BgAhigMBALYGACGLAwEAtwYAIYwDAQC3BgAhjQMBALcGACGPAwAAuAaPAyKQAyAAuQYAIZEDIAC5BgAhkwMAALoGkwMilAMgALkGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACEFiAMBAAAAAZYDQAAAAAGXA0AAAAABpwMBAAAAAfoDAQAAAAEdBQAAsQkAIAYAALIJACAIAACzCQAgDgAAtAkAIA8AALUJACAQAAC2CQAgEgAAuAkAIBoAALwJACAdAAC6CQAgHgAAuQkAIB8AALcJACAgAAC7CQAgIQAAvgkAICIAAL8JACAqAADACQAgiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZMDAAAAkwMClAMgAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAQIAAADUBAAgOQAAoA0AIAMAAAAUACA5AACgDQAgOgAApA0AIB8AAAAUACAFAAC9BgAgBgAAvgYAIAgAAL8GACAOAADABgAgDwAAwQYAIBAAAMIGACASAADEBgAgGgAAyAYAIB0AAMYGACAeAADFBgAgHwAAwwYAICAAAMcGACAhAADKBgAgIgAAywYAICoAAMwGACAyAACkDQAgiAMBALYGACGJAwEAtgYAIYoDAQC2BgAhiwMBALcGACGMAwEAtwYAIY0DAQC3BgAhjwMAALgGjwMikAMgALkGACGRAyAAuQYAIZMDAAC6BpMDIpQDIAC5BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhHQUAAL0GACAGAAC-BgAgCAAAvwYAIA4AAMAGACAPAADBBgAgEAAAwgYAIBIAAMQGACAaAADIBgAgHQAAxgYAIB4AAMUGACAfAADDBgAgIAAAxwYAICEAAMoGACAiAADLBgAgKgAAzAYAIIgDAQC2BgAhiQMBALYGACGKAwEAtgYAIYsDAQC3BgAhjAMBALcGACGNAwEAtwYAIY8DAAC4Bo8DIpADIAC5BgAhkQMgALkGACGTAwAAugaTAyKUAyAAuQYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIQuIAwEAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAAB-wMBAAAAAfwDAQAAAAH9AwEAAAAB_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_DQAgGgAAACkAIAkAAN8HACARAACrBwAgEwAArAcAIBQAAK0HACAVAACuBwAgFgAArwcAIBgAALAHACAaAACxBwAgMgAAvw0AIIgDAQC2BgAhkwMAAKcHtAMilQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACGrAwEAtgYAIa8DAQC2BgAhsAMBALcGACGxAwEAtwYAIbIDAQC2BgAhtQMAAKgHtQMitgMBALcGACG3A0AAuwYAIbgDEACpBwAhuQMCAIgHACEYCQAA3wcAIBEAAKsHACATAACsBwAgFAAArQcAIBUAAK4HACAWAACvBwAgGAAAsAcAIBoAALEHACCIAwEAtgYAIZMDAACnB7QDIpUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhqwMBALYGACGvAwEAtgYAIbADAQC3BgAhsQMBALcGACGyAwEAtgYAIbUDAACoB7UDIrYDAQC3BgAhtwNAALsGACG4AxAAqQcAIbkDAgCIBwAhAwAAAL8CACA5AAC7DQAgOgAAwg0AIBUAAAC_AgAgCAAAtQoAIAsAALQKACAPAAC2CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIDIAAMINACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIAsAALQKACAPAAC2CgAgHwAAtwoAICEAALoKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQuIAwEAAAABlgNAAAAAAZcDQAAAAAGpAwEAAAABrQMBAAAAAfwDAQAAAAH9AwEAAAAB_gMBAAAAAf8DAgAAAAGABAEAAAABgQQBAAAAARMIAAC1CwAgCwAAtAsAIA8AALYLACAcAAC5CwAgHwAAtwsAICIAALsLACAlAAC9CwAgJgAAvAsAICcAAL4LACArAAC4CwAgiAMBAAAAAYkDAQAAAAGVA0AAAAABlgNAAAAAAZcDQAAAAAGqAwEAAAABxgMBAAAAAdoDAQAAAAHbAwEAAAABAgAAALwCACA5AADEDQAgAwAAAL8CACA5AADEDQAgOgAAyA0AIBUAAAC_AgAgCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIDIAAMgNACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAiAAC7CgAgJQAAvQoAICYAALwKACAnAAC-CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQiIAwEAAAABlgNAAAAAAakDAQAAAAGqAwEAAAAB4gMBAAAAAeMDAQAAAAHkA4AAAAABhAQAAACEBAITCAAAtQsAIAsAALQLACAPAAC2CwAgHAAAuQsAIB8AALcLACAhAAC6CwAgJQAAvQsAICYAALwLACAnAAC-CwAgKwAAuAsAIIgDAQAAAAGJAwEAAAABlQNAAAAAAZYDQAAAAAGXA0AAAAABqgMBAAAAAcYDAQAAAAHaAwEAAAAB2wMBAAAAAQIAAAC8AgAgOQAAyg0AIAMAAAC_AgAgOQAAyg0AIDoAAM4NACAVAAAAvwIAIAgAALUKACALAAC0CgAgDwAAtgoAIBwAALkKACAfAAC3CgAgIQAAugoAICUAAL0KACAmAAC8CgAgJwAAvgoAICsAALgKACAyAADODQAgiAMBALYGACGJAwEAtgYAIZUDQAC7BgAhlgNAALwGACGXA0AAvAYAIaoDAQC3BgAhxgMBALYGACHaAwEAtwYAIdsDAQC3BgAhEwgAALUKACALAAC0CgAgDwAAtgoAIBwAALkKACAfAAC3CgAgIQAAugoAICUAAL0KACAmAAC8CgAgJwAAvgoAICsAALgKACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACELiAMBAAAAAZYDQAAAAAGXA0AAAAABqQMBAAAAAbIDAQAAAAHgAwAAAOADAuEDAQAAAAHiAwEAAAAB4wMBAAAAAeQDgAAAAAHlA0AAAAABEwgAALULACALAAC0CwAgDwAAtgsAIBwAALkLACAfAAC3CwAgIQAAugsAICIAALsLACAlAAC9CwAgJgAAvAsAICsAALgLACCIAwEAAAABiQMBAAAAAZUDQAAAAAGWA0AAAAABlwNAAAAAAaoDAQAAAAHGAwEAAAAB2gMBAAAAAdsDAQAAAAECAAAAvAIAIDkAANANACAPAwAAgQoAICYAANIKACCIAwEAAAABkwMAAADzAwKWA0AAAAABlwNAAAAAAakDAQAAAAG3A0AAAAAB7QMBAAAAAe4DAQAAAAHvAxAAAAAB8AMQAAAAAfEDEAAAAAHzA0AAAAAB9ANAAAAAAQIAAABgACA5AADSDQAgAwAAAL8CACA5AADQDQAgOgAA1g0AIBUAAAC_AgAgCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAmAAC8CgAgKwAAuAoAIDIAANYNACCIAwEAtgYAIYkDAQC2BgAhlQNAALsGACGWA0AAvAYAIZcDQAC8BgAhqgMBALcGACHGAwEAtgYAIdoDAQC3BgAh2wMBALcGACETCAAAtQoAIAsAALQKACAPAAC2CgAgHAAAuQoAIB8AALcKACAhAAC6CgAgIgAAuwoAICUAAL0KACAmAAC8CgAgKwAAuAoAIIgDAQC2BgAhiQMBALYGACGVA0AAuwYAIZYDQAC8BgAhlwNAALwGACGqAwEAtwYAIcYDAQC2BgAh2gMBALcGACHbAwEAtwYAIQMAAABeACA5AADSDQAgOgAA2Q0AIBEAAABeACADAADzCQAgJgAA0AoAIDIAANkNACCIAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIbcDQAC7BgAh7QMBALYGACHuAwEAtgYAIe8DEADYBgAh8AMQANgGACHxAxAA2AYAIfMDQAC8BgAh9ANAALwGACEPAwAA8wkAICYAANAKACCIAwEAtgYAIZMDAADxCfMDIpYDQAC8BgAhlwNAALwGACGpAwEAtgYAIbcDQAC7BgAh7QMBALYGACHuAwEAtgYAIe8DEADYBgAh8AMQANgGACHxAxAA2AYAIfMDQAC8BgAh9ANAALwGACEMiAMBAAAAAZMDAAAA1QMClgNAAAAAAZcDQAAAAAGpAwEAAAABzgMBAAAAAdADAAAA0AMC0QMQAAAAAdIDAQAAAAHTAwEAAAAB1QNAAAAAAdcDAQAAAAECAwACLAAEDAh2BgsGAwwAHw93CBx9Eh94CiF-ASJ_FiWBARgmgAEZJ4IBFyt8DwIDAAIEAAQRBQoFBgsDCA8GDAAeDhMHDxsIEBwIEkgLGkwRHE0SHUoNHkkMHyAKIEsNIVABIlQWKlgXAQQABAIDAAIHAAQCBAAEDQAIBQMAAgkABAoVBAsWBwwACQELFwAGAwACCQAEDAAVEiQLHUQNHigMAgQABBEACgQJAAQMABQRAAodLA0KCQAEDAATEQAKEy0MFC4NFS8NFjAEGDQOGjoRHD4SAhcADRkADwMDAAIMABAYNQ4BGDYAAgQABBcADQMDAAIXAA0bAAQEFT8AGEAAGkEAHEIAAR1DAAMSRQAdRwAeRgACAwACBAAEAwMAAigAGCllBAQDAAIMAB0mABknYxcEAwACDAAcJAAaJWEYAgwAGyNcGQEjXQABJWIAASdkABAFZgAGZwAIaAAOaQAPagAQawASbQAacQAccgAdbwAebgAfbAAgcAAhcwAidAAqdQAKCIQBAAuDAQAPhQEAHIgBAB-GAQAhiQEAIooBACWLAQAnjAEAK4cBAAACAwACLAAEAgMAAiwABAMMACQ_ACVAACYAAAADDAAkPwAlQAAmAwMAAhcADRsABAMDAAIXAA0bAAQFDAArPwAuQAAvUQAsUgAtAAAAAAAFDAArPwAuQAAvUQAsUgAtAgQABBcADQIEAAQXAA0DDAA0PwA1QAA2AAAAAwwAND8ANUAANgIDAAIHAAQCAwACBwAEAwwAOz8APEAAPQAAAAMMADs_ADxAAD0CAwACJgAZAgMAAiYAGQUMAEI_AEVAAEZRAENSAEQAAAAAAAUMAEI_AEVAAEZRAENSAEQBAwACAQMAAgMMAEs_AExAAE0AAAADDABLPwBMQABNAgMAAgQABAIDAAIEAAQDDABSPwBTQABUAAAAAwwAUj8AU0AAVAEEAAQBBAAEAwwAWT8AWkAAWwAAAAMMAFk_AFpAAFsAAAMMAGA_AGFAAGIAAAADDABgPwBhQABiAgMAAgQABAIDAAIEAAQDDABnPwBoQABpAAAAAwwAZz8AaEAAaQMDAAIoABgp9QIEAwMAAigAGCn7AgQFDABuPwBxQAByUQBvUgBwAAAAAAAFDABuPwBxQAByUQBvUgBwAAAFDAB3PwB6QAB7UQB4UgB5AAAAAAAFDAB3PwB6QAB7UQB4UgB5AgMAAgkABAIDAAIJAAQDDACAAT8AgQFAAIIBAAAAAwwAgAE_AIEBQACCAQIEAAQRAAoCBAAEEQAKAwwAhwE_AIgBQACJAQAAAAMMAIcBPwCIAUAAiQECCQAEEQAKAgkABBEACgMMAI4BPwCPAUAAkAEAAAADDACOAT8AjwFAAJABAgMAAiQAGgIDAAIkABoDDACVAT8AlgFAAJcBAAAAAwwAlQE_AJYBQACXAQUJAAQRAAoT_gMMFP8DDRaABAQFCQAEEQAKE4YEDBSHBA0WiAQEBQwAnAE_AJ8BQACgAVEAnQFSAJ4BAAAAAAAFDACcAT8AnwFAAKABUQCdAVIAngECFwANGQAPAhcADRkADwMMAKUBPwCmAUAApwEAAAADDAClAT8ApgFAAKcBAwMAAgkABAqwBAQDAwACCQAECrYEBAMMAKwBPwCtAUAArgEAAAADDACsAT8ArQFAAK4BAgQABA0ACAIEAAQNAAgDDACzAT8AtAFAALUBAAAAAwwAswE_ALQBQAC1AQAAAwwAugE_ALsBQAC8AQAAAAMMALoBPwC7AUAAvAEtAgEujQEBL44BATCPAQExkAEBM5IBATSUASA1lQEhNpcBATeZASA4mgEiO5sBATycAQE9nQEgQaABI0KhASdDogESRKMBEkWkARJGpQESR6YBEkioARJJqgEgSqsBKEutARJMrwEgTbABKU6xARJPsgESULMBIFO2ASpUtwEwVbgBEVa5ARFXugERWLsBEVm8ARFavgERW8ABIFzBATFdwwERXsUBIF_GATJgxwERYcgBEWLJASBjzAEzZM0BN2XOAQZmzwEGZ9ABBmjRAQZp0gEGatQBBmvWASBs1wE4bdkBBm7bASBv3AE5cN0BBnHeAQZy3wEgc-IBOnTjAT515AEYduUBGHfmARh45wEYeegBGHrqARh77AEgfO0BP33vARh-8QEgf_IBQIAB8wEYgQH0ARiCAfUBIIMB-AFBhAH5AUeFAfoBD4YB-wEPhwH8AQ-IAf0BD4kB_gEPigGAAg-LAYICIIwBgwJIjQGFAg-OAYcCII8BiAJJkAGJAg-RAYoCD5IBiwIgkwGOAkqUAY8CTpUBkAIWlgGRAhaXAZICFpgBkwIWmQGUAhaaAZYCFpsBmAIgnAGZAk-dAZsCFp4BnQIgnwGeAlCgAZ8CFqEBoAIWogGhAiCjAaQCUaQBpQJVpQGmAgWmAacCBacBqAIFqAGpAgWpAaoCBaoBrAIFqwGuAiCsAa8CVq0BsQIFrgGzAiCvAbQCV7ABtQIFsQG2AgWyAbcCILMBugJYtAG7Aly1Ab0CArYBvgICtwHBAgK4AcICArkBwwICugHFAgK7AccCILwByAJdvQHKAgK-AcwCIL8BzQJewAHOAgLBAc8CAsIB0AIgwwHTAl_EAdQCY8UB1QIDxgHWAgPHAdcCA8gB2AIDyQHZAgPKAdsCA8sB3QIgzAHeAmTNAeACA84B4gIgzwHjAmXQAeQCA9EB5QID0gHmAiDTAekCZtQB6gJq1QHrAhfWAewCF9cB7QIX2AHuAhfZAe8CF9oB8QIX2wHzAiDcAfQCa90B9wIX3gH5AiDfAfoCbOAB_AIX4QH9AhfiAf4CIOMBgQNt5AGCA3PlAYQDGuYBhQMa5wGIAxroAYkDGukBigMa6gGMAxrrAY4DIOwBjwN07QGRAxruAZMDIO8BlAN18AGVAxrxAZYDGvIBlwMg8wGaA3b0AZsDfPUBnAMK9gGdAwr3AZ4DCvgBnwMK-QGgAwr6AaIDCvsBpAMg_AGlA339AacDCv4BqQMg_wGqA36AAqsDCoECrAMKggKtAyCDArADf4QCsQODAYUCsgMLhgKzAwuHArQDC4gCtQMLiQK2AwuKArgDC4sCugMgjAK7A4QBjQK9AwuOAr8DII8CwAOFAZACwQMLkQLCAwuSAsMDIJMCxgOGAZQCxwOKAZUCyAMMlgLJAwyXAsoDDJgCywMMmQLMAwyaAs4DDJsC0AMgnALRA4sBnQLTAwyeAtUDIJ8C1gOMAaAC1wMMoQLYAwyiAtkDIKMC3AONAaQC3QORAaUC3gMZpgLfAxmnAuADGagC4QMZqQLiAxmqAuQDGasC5gMgrALnA5IBrQLpAxmuAusDIK8C7AOTAbAC7QMZsQLuAxmyAu8DILMC8gOUAbQC8wOYAbUC9AMNtgL1Aw23AvYDDbgC9wMNuQL4Aw26AvoDDbsC_AMgvAL9A5kBvQKCBA2-AoQEIL8ChQSaAcACiQQNwQKKBA3CAosEIMMCjgSbAcQCjwShAcUCkAQOxgKRBA7HApIEDsgCkwQOyQKUBA7KApYEDssCmAQgzAKZBKIBzQKbBA7OAp0EIM8CngSjAdACnwQO0QKgBA7SAqEEINMCpASkAdQCpQSoAdUCpgQI1gKnBAjXAqgECNgCqQQI2QKqBAjaAqwECNsCrgQg3AKvBKkB3QKyBAjeArQEIN8CtQSqAeACtwQI4QK4BAjiArkEIOMCvASrAeQCvQSvAeUCvgQH5gK_BAfnAsAEB-gCwQQH6QLCBAfqAsQEB-sCxgQg7ALHBLAB7QLJBAfuAssEIO8CzASxAfACzQQH8QLOBAfyAs8EIPMC0gSyAfQC0wS2AfUC1QQE9gLWBAT3AtgEBPgC2QQE-QLaBAT6AtwEBPsC3gQg_ALfBLcB_QLhBAT-AuMEIP8C5AS4AYAD5QQEgQPmBASCA-cEIIMD6gS5AYQD6wS9AQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  ActivityScalarFieldEnum: () => ActivityScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AttachmentScalarFieldEnum: () => AttachmentScalarFieldEnum,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  InvoiceScalarFieldEnum: () => InvoiceScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  LabelScalarFieldEnum: () => LabelScalarFieldEnum,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OAuthAccountScalarFieldEnum: () => OAuthAccountScalarFieldEnum,
  OrganizationMemberScalarFieldEnum: () => OrganizationMemberScalarFieldEnum,
  OrganizationScalarFieldEnum: () => OrganizationScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PlanScalarFieldEnum: () => PlanScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectMemberScalarFieldEnum: () => ProjectMemberScalarFieldEnum,
  ProjectScalarFieldEnum: () => ProjectScalarFieldEnum,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  SprintScalarFieldEnum: () => SprintScalarFieldEnum,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TaskLabelScalarFieldEnum: () => TaskLabelScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TeamMemberScalarFieldEnum: () => TeamMemberScalarFieldEnum,
  TeamScalarFieldEnum: () => TeamScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Activity: "Activity",
  Attachment: "Attachment",
  Comment: "Comment",
  Invitation: "Invitation",
  Invoice: "Invoice",
  Label: "Label",
  Notification: "Notification",
  OAuthAccount: "OAuthAccount",
  Organization: "Organization",
  OrganizationMember: "OrganizationMember",
  Payment: "Payment",
  Plan: "Plan",
  Project: "Project",
  ProjectMember: "ProjectMember",
  Sprint: "Sprint",
  Subscription: "Subscription",
  Task: "Task",
  TaskLabel: "TaskLabel",
  Team: "Team",
  TeamMember: "TeamMember",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var ActivityScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  actorId: "actorId",
  action: "action",
  entityType: "entityType",
  entityId: "entityId",
  description: "description",
  metadata: "metadata",
  createdAt: "createdAt"
};
var AttachmentScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  taskId: "taskId",
  uploadedById: "uploadedById",
  originalName: "originalName",
  fileName: "fileName",
  mimeType: "mimeType",
  size: "size",
  url: "url",
  storageKey: "storageKey",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CommentScalarFieldEnum = {
  id: "id",
  taskId: "taskId",
  userId: "userId",
  content: "content",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvitationScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  invitedById: "invitedById",
  email: "email",
  organizationRole: "organizationRole",
  token: "token",
  status: "status",
  expiresAt: "expiresAt",
  acceptedAt: "acceptedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvoiceScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  subscriptionId: "subscriptionId",
  invoiceNumber: "invoiceNumber",
  subtotal: "subtotal",
  tax: "tax",
  total: "total",
  status: "status",
  periodStart: "periodStart",
  periodEnd: "periodEnd",
  dueDate: "dueDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var LabelScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  color: "color",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  organizationId: "organizationId",
  type: "type",
  title: "title",
  message: "message",
  entityType: "entityType",
  entityId: "entityId",
  metadata: "metadata",
  readAt: "readAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OAuthAccountScalarFieldEnum = {
  id: "id",
  userId: "userId",
  provider: "provider",
  providerAccountId: "providerAccountId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganizationScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  logo: "logo",
  logoPublicId: "logoPublicId",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var OrganizationMemberScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  userId: "userId",
  organizationRole: "organizationRole",
  joinedAt: "joinedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  invoiceId: "invoiceId",
  organizationId: "organizationId",
  paymentMethod: "paymentMethod",
  amount: "amount",
  transactionId: "transactionId",
  senderNumber: "senderNumber",
  status: "status",
  verifiedAt: "verifiedAt",
  verifiedById: "verifiedById",
  failureReason: "failureReason",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PlanScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  priceMonthly: "priceMonthly",
  priceYearly: "priceYearly",
  maxMembers: "maxMembers",
  maxTeams: "maxTeams",
  maxProjects: "maxProjects",
  maxStorageBytes: "maxStorageBytes",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  slug: "slug",
  description: "description",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  createdById: "createdById",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var ProjectMemberScalarFieldEnum = {
  projectId: "projectId",
  userId: "userId",
  joinedAt: "joinedAt"
};
var SprintScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  name: "name",
  goal: "goal",
  startDate: "startDate",
  endDate: "endDate",
  status: "status",
  createdById: "createdById",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  planId: "planId",
  status: "status",
  interval: "interval",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  cancelledAt: "cancelledAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  sprintId: "sprintId",
  parentTaskId: "parentTaskId",
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  assigneeId: "assigneeId",
  createdById: "createdById",
  dueDate: "dueDate",
  estimatedHours: "estimatedHours",
  position: "position",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var TaskLabelScalarFieldEnum = {
  taskId: "taskId",
  labelId: "labelId"
};
var TeamScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  createdById: "createdById",
  teamLeadId: "teamLeadId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeamMemberScalarFieldEnum = {
  teamId: "teamId",
  userId: "userId",
  joinedAt: "joinedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  avatar: "avatar",
  avatarPublicId: "avatarPublicId",
  platformRole: "platformRole",
  isActive: "isActive",
  emailVerified: "emailVerified",
  status: "status",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var PlatformRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER"
};
var OrganizationRole = {
  ORG_ADMIN: "ORG_ADMIN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  TEAM_LEAD: "TEAM_LEAD",
  MEMBER: "MEMBER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var AuthProvider = {
  CREDENTIALS: "CREDENTIALS",
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  FACEBOOK: "FACEBOOK"
};
var ProjectStatus = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
};
var SprintStatus = {
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  BLOCKED: "BLOCKED",
  DONE: "DONE",
  CANCELLED: "CANCELLED"
};
var Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
var InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
};
var SubscriptionStatus = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED"
};
var BillingInterval = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY"
};
var InvoiceStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  PAID: "PAID",
  VOID: "VOID",
  UNCOLLECTIBLE: "UNCOLLECTIBLE"
};
var PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};
var PaymentMethod = {
  BKASH: "BKASH"
};
var ActivityAction = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  DELETED: "DELETED",
  ASSIGNED: "ASSIGNED",
  UNASSIGNED: "UNASSIGNED",
  STATUS_CHANGED: "STATUS_CHANGED",
  PRIORITY_CHANGED: "PRIORITY_CHANGED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  COMMENTED: "COMMENTED",
  ATTACHED: "ATTACHED",
  DETACHED: "DETACHED",
  INVITED: "INVITED",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SPRINT_STARTED: "SPRINT_STARTED",
  SPRINT_COMPLETED: "SPRINT_COMPLETED",
  SUBSCRIPTION_CREATED: "SUBSCRIPTION_CREATED",
  PAYMENT_SUBMITTED: "PAYMENT_SUBMITTED",
  PAYMENT_APPROVED: "PAYMENT_APPROVED",
  PAYMENT_REJECTED: "PAYMENT_REJECTED",
  PLAN_UPGRADED: "PLAN_UPGRADED",
  PLAN_DOWNGRADED: "PLAN_DOWNGRADED",
  SUBSCRIPTION_CANCELLED: "SUBSCRIPTION_CANCELLED",
  SUBSCRIPTION_RESUMED: "SUBSCRIPTION_RESUMED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (config_default.node_env === "development") {
    console.log("Error from Global Error Handler :", err);
  }
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  const errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode || "Internal Server Error",
    name: config_default.node_env === "development" ? errorName : "Internal Server Error",
    message: config_default.node_env === "development" ? errorMessage : "Internal Server Error",
    error: config_default.node_env === "development" ? err : void 0,
    stack: config_default.node_env === "development" ? err.stack : void 0
  });
};

// src/app/middleware/notFound.ts
import httpStatus2 from "http-status";
var notFound = (req, res) => {
  return res.status(httpStatus2.NOT_FOUND).json({
    message: "Router is Not Found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/module/auth/auth.controller.ts
import httpStatus3 from "http-status";

// src/app/module/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret,
  secure: true
});
var uploadToCloudinary = (fileBuffer, folderName = "uploads") => {
  return new Promise((resolve, reject) => {
    const cldStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto",
        format: "webp",
        //Forces Cloudinary to convert the incoming file into WebP
        transformation: [
          {
            quality: "auto"
            // Optional: balances file size and clear visual quality
          }
        ]
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("No result return from cloudinary!"));
        }
        return resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(cldStream);
  });
};
var deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error(`Failed to delete image with public ID: ${publicId}`);
    }
  } catch (error) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (jwtPayload, secret, expiresIn) => {
  const token = jwt.sign(jwtPayload, secret, expiresIn);
  return token;
};
var varifyToken = (token, secret) => {
  try {
    const varifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: varifiedToken
    };
  } catch (error) {
    console.log("Token varification failed :", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtiles = {
  createToken,
  varifyToken
};

// src/app/module/auth/auth.service.ts
import crypto from "crypto";

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: "default",
  password: "n4M4SUIBtca0wkkupsAX8zlgZz7cAm6s",
  socket: {
    host: "strategic-grip-cloth-10636.db.redis.io",
    port: 13979
  }
});

// src/app/module/auth/auth.service.ts
import path3 from "path";
import ejs from "ejs";

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config_default.smtp_user,
    // the email you used to create app password
    pass: config_default.smtp_password
    // your generated app password
  }
});

// src/app/lib/googleOAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/module/auth/auth.service.ts
var registerIntoDB = async (payload, fileBuffer) => {
  const { name, password } = payload;
  const email2 = payload.email.trim().toLowerCase();
  if (!email2 || !password) {
    throw new Error("Email and Password must be provided!");
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email2
    }
  });
  if (existingUser) {
    throw new Error("All ready exist user with this email");
  }
  const hashedPasword = await bcrypt.hash(password, Number(config_default.bcrypt_salt_rounds));
  let cloudinaryResult;
  try {
    cloudinaryResult = await uploadToCloudinary(fileBuffer, "user-avatars");
  } catch (uploadError) {
    throw new Error("Failed to upload avatar image to Cloudinary.");
  }
  if (!cloudinaryResult || !cloudinaryResult.secure_url) {
    throw new Error("Avatar upload completed but secure URL was not generated.");
  }
  const otpKey = `register-otp:${email2}`;
  const otp = crypto.randomInt(1e5, 1e6).toString();
  const expiration = 60 * 5;
  await redisClient.set(otpKey, otp, {
    expiration: {
      "type": "EX",
      "value": expiration
    }
  });
  const registerPayloadKey = `register-data:${email2}`;
  const registerPayload = {
    name,
    email: email2,
    password: hashedPasword,
    avatar: cloudinaryResult.secure_url,
    avatarPublicId: cloudinaryResult.public_id
  };
  await redisClient.set(registerPayloadKey, JSON.stringify(registerPayload), {
    expiration: {
      "type": "EX",
      "value": expiration
    }
  });
  const templatePath = path3.join(process.cwd(), "src/app/templates/register-otp-email.ejs");
  const templateData = {
    name,
    otp,
    expiresIn: expiration / 60
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `Dipongkar <${config_default.smtp_sender}>`,
    to: email2,
    subject: "Verification OTP sent",
    html
  });
};
var verifyEmail = async (payload) => {
  const { email: email2, otp } = payload;
  if (!otp) {
    throw new Error("OTP not found.Please provide opt!");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: email2
    }
  });
  if (user) {
    throw new Error("User all ready registered with this email");
  }
  const otpKey = `register-otp:${email2}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new Error("Redis otp not found in redis");
  }
  if (otp !== redisOtp) {
    throw new Error("Opt is not correct,Please provide correct otp!");
  }
  await redisClient.del(otpKey);
  const registerPayloadKey = `register-data:${email2}`;
  const registerDataPayload = await redisClient.get(registerPayloadKey);
  if (!registerDataPayload) {
    throw new Error("Register data not found in Redis!");
  }
  const userData = JSON.parse(registerDataPayload);
  const createUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar,
      avatarPublicId: userData.avatarPublicId,
      emailVerified: true
    },
    omit: {
      password: true
    }
  });
  if (!createUser) {
    throw new Error("User create fail!");
  }
  await redisClient.del(registerPayloadKey);
  const templatePath = path3.join(process.cwd(), "src/app/templates/user-welcome-email.ejs");
  const templateData = {
    name: createUser.name,
    email: email2,
    dashboardUrl: `${config_default.frontend_url}/dashboard`
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `TaskFlow <${config_default.smtp_sender}>`,
    to: email2,
    subject: "Welcome to Project Managment Saas \u{1F389}",
    html
  });
  const jwtPayload = {
    userId: createUser.id,
    neme: createUser.name,
    email: createUser.email,
    role: createUser.platformRole
  };
  const accessToken = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  const refreshToken3 = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    createUser
  };
};
var userloginFromBD = async (payload) => {
  const password = payload.password;
  const email2 = payload.email.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: email2 }
  });
  if (!user) {
    throw new Error("User in not found!");
  }
  if (user.emailVerified === false) {
    throw new Error("Email is not verified!");
  }
  if (user.status === "BLOCKED") {
    throw new Error("User is Blocked!");
  }
  if (user.status === "DELETED" || user.isDeleted === true) {
    throw new Error("User Id is deleted");
  }
  if (!user.password) {
    throw new Error(
      "This account does not have password login enabled.Try with Google ,Facebook or others"
    );
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    userId: user.id,
    neme: user.name,
    email: user.email,
    role: user.platformRole
  };
  const accessToken = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  const refreshToken3 = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const Ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = Ticket.getPayload();
  } catch (error) {
    throw new Error("Invalid Google id Token!");
  }
  if (!googleIdTokenPayload) {
    throw new Error("Invalid Google id Token!");
  }
  if (!googleIdTokenPayload.email) {
    throw new Error("Invalid Google user Email!");
  }
  if (!googleIdTokenPayload.name) {
    throw new Error("Invalid Google  user name!");
  }
  const isExistUser = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: AuthProvider.GOOGLE,
        providerAccountId: googleIdTokenPayload.sub
      }
    }
  });
  if (!isExistUser) {
    const cradentialUser = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email
      }
    });
    if (cradentialUser) {
      if (cradentialUser.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked");
      }
      if (cradentialUser.isDeleted === true || cradentialUser.status === UserStatus.DELETED) {
        throw new Error("User is Deleted");
      }
      await prisma.oAuthAccount.create({
        data: {
          userId: cradentialUser.id,
          provider: AuthProvider.GOOGLE,
          providerAccountId: googleIdTokenPayload.sub
        }
      });
      await prisma.user.update({
        where: {
          id: cradentialUser.id
        },
        data: {
          emailVerified: true
        }
      });
    } else {
      const user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          emailVerified: true
        }
      });
      await prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: AuthProvider.GOOGLE,
          providerAccountId: googleIdTokenPayload.sub
        }
      });
    }
  }
  const { name, email: email2 } = googleIdTokenPayload;
  const templatePath = path3.join(process.cwd(), "src/app/templates/user-welcome-email.ejs");
  const templateData = {
    name,
    email: email2,
    dashboardUrl: `${config_default.frontend_url}/dashboard`
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `TaskFlow <${config_default.smtp_sender}>`,
    to: email2,
    subject: "Welcome to Project Managment Saas \u{1F389}",
    html
  });
  const newuser = await prisma.user.findUnique({
    where: {
      email: email2
    }
  });
  if (!newuser) {
    throw new Error("User is not found");
  }
  const authAccount = await prisma.oAuthAccount.findMany({
    where: {
      userId: newuser.id
    }
  });
  if (!authAccount) {
    throw new Error("User AuthAccount Not Found");
  }
  const jwtPayload = {
    userId: newuser.id,
    neme: newuser.name,
    email: newuser.email,
    role: newuser.platformRole
  };
  const accessToken = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  const refreshToken3 = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    createUser: newuser,
    authAccount
  };
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtiles.varifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new Error("User is inactive or not found");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.platformRole
  };
  const accessToken = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expiration
  );
  const refreshToken3 = jwtUtiles.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expiration
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var forgetPassword = async (payload) => {
  const email2 = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: email2
    }
  });
  if (!user) {
    throw new Error("User is not found!");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked!");
  }
  if (user.status === UserStatus.DELETED || user.isDeleted === true) {
    throw new Error("User is Deleted!");
  }
  const otp = crypto.randomInt(1e5, 1e6).toString();
  const otpKey = `forget-password-otp:${email2}`;
  const expiration = 60 * 5;
  await redisClient.set(otpKey, otp, {
    expiration: {
      "type": "EX",
      "value": expiration
    }
  });
  const templatePath = path3.join(process.cwd(), "src/app/templates/forget-password-otp.ejs");
  const templateData = {
    name: user.name,
    email: email2,
    otp,
    expiresIn: expiration / 60
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `Project Managment Saas <${config_default.smtp_sender}>`,
    to: email2,
    subject: "Reset Your TaskFlow Password",
    html
  });
};
var resetPassword = async (payload) => {
  const email2 = payload.email.trim().toLowerCase();
  const { newPassword, otp } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email: email2
    }
  });
  if (!user) {
    throw new Error("User is Not Found");
  }
  const otpKey = `forget-password-otp:${email2}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new Error("Otp is Not Found in Redis");
  }
  if (otp !== redisOtp) {
    throw new Error("Otp is not Correct,Please provide correct otp");
  }
  const hashedPasword = await bcrypt.hash(newPassword, Number(config_default.bcrypt_salt_rounds));
  console.log(hashedPasword);
  const updateUser = await prisma.user.update({
    where: {
      email: email2
    },
    data: {
      password: hashedPasword
    }
  });
  await redisClient.del(otpKey);
  const templatePath = path3.join(process.cwd(), "src/app/templates/reset-password-email.ejs");
  const templateData = {
    name: updateUser.name
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `Project Managment Saas <${config_default.smtp_sender}>`,
    to: email2,
    subject: "Your TaskFlow Password Was Reset Successfully",
    html
  });
};
var AuthService = {
  registerIntoDB,
  verifyEmail,
  userloginFromBD,
  googleLogin,
  refreshToken,
  forgetPassword,
  resetPassword
};

// src/app/module/auth/auth.controller.ts
var register = catchAsync(async (req, res, next) => {
  const body = req.body;
  const payload = req.file;
  if (!payload) {
    throw new Error("No File Provided!");
  }
  await AuthService.registerIntoDB(body, payload?.buffer);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "Email verification otp send successfully!",
    data: null
  });
});
var verifyEmail2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  const result = await AuthService.verifyEmail(body);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1e3 * 60 * 60 * 24
    // 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    //7d
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "Email verify successfully!",
    data: result
  });
});
var userLogin = catchAsync(async (req, res, next) => {
  const body = req.body;
  const result = await AuthService.userloginFromBD(body);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1e3 * 60 * 60 * 24
    // 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    //7d
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "User login successfully!",
    data: result
  });
});
var googleLogin2 = catchAsync(async (req, res, next) => {
  const idToken = req.body;
  const result = await AuthService.googleLogin(idToken);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1e3 * 60 * 60 * 24
    // 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    //7d
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "User login successfully!",
    data: result
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  const result = await AuthService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var forgetPassword2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  await AuthService.forgetPassword(body);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: `Otp sent to Email :${body.email}`,
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  await AuthService.resetPassword(body);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Reset password successfully",
    data: null
  });
});
var AuthController = {
  register,
  verifyEmail: verifyEmail2,
  userLogin,
  googleLogin: googleLogin2,
  refreshToken: refreshToken2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2
};

// src/app/middleware/validationRequest.ts
var validationRequest = (zodSchema) => {
  return catchAsync(async (req, res, next) => {
    const bodyData = req.body || {};
    const dataToValidate = {
      body: bodyData,
      file: req.file || void 0,
      files: req.files || void 0
      // Optional: handle multi-file uploads if using multer
    };
    const result = zodSchema.safeParse(dataToValidate);
    if (!result.success) {
      console.log(result.error.issues);
      throw new Error(result.error.issues[0].message);
    }
    req.body = result.data.body;
    next();
  });
};

// src/app/module/auth/auth.validation.ts
import z from "zod";
var ALLOWED_MULTI_TYPES = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4"],
  video: ["video/mp4", "video/quicktime", "video/x-matroska"]
};
var singleFileEngine = (allowedTypes, maxMB) => {
  return z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
      (type) => allowedTypes.includes(type),
      { message: `Invalid format. Expected: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}` }
    ),
    size: z.number().max(maxMB * 1024 * 1024, `Size exceeds limit of ${maxMB}MB`)
  });
};
var registerZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(32, { message: "Password cannot exceed 32 characters" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }).regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
  }),
  file: z.object({
    avatar: z.array(singleFileEngine(ALLOWED_MULTI_TYPES.image, 10)).max(1, "Only 1 avatar allowed").optional()
  }).optional()
});
var verifyEmailZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z.string()
  })
});
var loginZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(32, { message: "Password cannot exceed 32 characters" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }).regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
  })
});
var forgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" })
  })
});
var resetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(32, { message: "Password cannot exceed 32 characters" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }).regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    otp: z.string()
  })
});
var AuthValidation = {
  registerZodSchema,
  verifyEmailZodSchema,
  loginZodSchema,
  forgetPasswordZodSchema,
  resetPasswordZodSchema
};

// src/app/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage });

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  upload.single("avatar"),
  validationRequest(AuthValidation.registerZodSchema),
  AuthController.register
);
router.post("/verify-email", validationRequest(AuthValidation.verifyEmailZodSchema), AuthController.verifyEmail);
router.post("/login", validationRequest(AuthValidation.loginZodSchema), AuthController.userLogin);
router.post("/google", AuthController.googleLogin);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/forget-password", validationRequest(AuthValidation.forgetPasswordZodSchema), AuthController.forgetPassword);
router.post("/reset-password", validationRequest(AuthValidation.resetPasswordZodSchema), AuthController.resetPassword);
var AuthRouter = router;

// src/app.ts
import cookieParser from "cookie-parser";

// src/app/module/invitation/invitation.route.ts
import Router2 from "express";

// src/app/module/invitation/invitation.controller.ts
import httpStatus4 from "http-status";

// src/app/module/invitation/invitation.service.ts
import path4 from "path";
import crypto2 from "crypto";
import ejs2 from "ejs";

// src/app/module/activity/activity.service.ts
var createActivity = async (payload) => {
  try {
    return await prisma.activity.create({
      data: {
        organizationId: payload.organizationId,
        actorId: payload.actorId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        description: payload.description,
        metadata: payload.metadata ? JSON.parse(JSON.stringify(payload.metadata)) : void 0
      }
    });
  } catch (error) {
    console.error("Failed to create activity log", error);
  }
};
var getOrganizationActivities = async (organizationId, user) => {
  if (user.organizationId !== organizationId) {
    throw new Error("User does not belong to this organization");
  }
  const organizationExists = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  if (!organizationExists) {
    throw new Error("Organization not found");
  }
  const activities = await prisma.activity.findMany({
    where: {
      organizationId
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { id: true, name: true, avatar: true } }
    }
  });
  return activities;
};
var getEntityActivities = async (organizationId, entityType, entityId, user) => {
  if (user.organizationId !== organizationId) {
    throw new Error("User does not belong to this organization");
  }
  const organizationExists = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  if (!organizationExists) {
    throw new Error("Organization not found");
  }
  const activities = await prisma.activity.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { id: true, name: true, avatar: true } }
    }
  });
  return activities;
};
var ActivityService = {
  createActivity,
  getOrganizationActivities,
  getEntityActivities
};

// src/app/module/invitation/invitation.service.ts
var hashInvitationToken = (token) => crypto2.createHash("sha256").update(token).digest("hex");
var sentInvitations = async (payload, organizationId, userId) => {
  if (!payload.email || !payload.organizationRole) {
    throw new Error("Email and organization role are required");
  }
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });
  if (user) {
    const existingMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id
        }
      }
    });
    if (existingMembership) {
      throw new Error("You are already a member of this organization");
    }
  }
  const token = crypto2.randomBytes(32).toString("hex");
  console.log("Generated token:", token);
  const tokenHash = hashInvitationToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3 * 7);
  const invitation = await prisma.invitation.create({
    data: {
      email: payload.email,
      organizationRole: payload.organizationRole,
      invitedById: userId,
      organizationId,
      token: tokenHash,
      expiresAt
    }
  });
  if (!invitation) {
    throw new Error("Fail to create invitation,Please try again");
  }
  const invitatedUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!invitatedUser) {
    throw new Error("Invitated user not found");
  }
  const templatePath = path4.join(process.cwd(), "src/app/templates/invitation-mail.ejs");
  const templateData = {
    organizationName: organization.name,
    invitedByName: invitatedUser.name,
    roleName: payload.organizationRole,
    invitationUrl: `${config_default.frontend_url}/invitation/accept/${token}`,
    expiresAt,
    year: (/* @__PURE__ */ new Date()).getFullYear()
  };
  const html = await ejs2.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `TaskFlow <${config_default.smtp_sender}>`,
    to: payload.email,
    subject: `${invitatedUser.name} invited you to join ${organization.name} on TaskFlow`,
    html
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.INVITED,
    entityType: "ORGANIZATION",
    entityId: organizationId,
    metadata: { invitedEmail: payload.email, role: payload.organizationRole },
    description: `Sent invitation to ${payload.email}`
  });
};
var getInvitationByToken = async (token) => {
  if (!token) {
    throw new Error("Invitation token is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: {
      token: hashInvitationToken(token)
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true
        }
      },
      invitedBy: {
        select: {
          name: true
        }
      }
    }
  });
  if (!invitation) {
    throw new Error("Invalid invitation");
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error(`Invitation is ${invitation.status.toLowerCase()}`);
  }
  if (invitation.expiresAt < /* @__PURE__ */ new Date()) {
    await prisma.invitation.update({
      where: {
        id: invitation.id
      },
      data: {
        status: InvitationStatus.EXPIRED
      }
    });
    throw new Error("Invitation expired");
  }
  return {
    email: invitation.email,
    organizationId: invitation.organizationId,
    organizationRole: invitation.organizationRole,
    expiresAt: invitation.expiresAt,
    organization: invitation.organization,
    invitedBy: invitation.invitedBy
  };
};
var acceptInvitation = async (token, userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: {
      token: hashInvitationToken(token)
    }
  });
  if (!invitation) {
    throw new Error("Invalid invitation");
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error(`Invitation is ${invitation.status.toLowerCase()}`);
  }
  if (invitation.expiresAt < /* @__PURE__ */ new Date()) {
    throw new Error("Invitation expired");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    throw new Error("This invitation belongs to a different email address");
  }
  const result = await prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: invitation.organizationId,
          userId
        }
      },
      update: {
        organizationRole: invitation.organizationRole
      },
      create: {
        organizationId: invitation.organizationId,
        userId,
        organizationRole: invitation.organizationRole
      }
    });
    await tx.invitation.update({
      where: { id: invitation.id },
      data: {
        status: InvitationStatus.ACCEPTED,
        acceptedAt: /* @__PURE__ */ new Date()
      }
    });
    return membership;
  });
  await ActivityService.createActivity({
    organizationId: invitation.organizationId,
    actorId: userId,
    action: ActivityAction.MEMBER_ADDED,
    entityType: "ORGANIZATION",
    entityId: invitation.organizationId,
    description: `Accepted invitation and joined organization`
  });
  return result;
};
var getAllInvitations = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const addConditions = [];
  if (query.searchTerm) {
    addConditions.push({
      OR: [
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.email) {
    addConditions.push({
      email: query.email
    });
  }
  if (query.organizationRole) {
    addConditions.push({
      organizationRole: {
        equals: query.organizationRole
      }
    });
  }
  if (query.status) {
    addConditions.push({
      status: {
        equals: query.status
      }
    });
  }
  if (query.acceptedAt) {
    addConditions.push({
      acceptedAt: {
        gte: query.acceptedAt
      }
    });
  }
  if (query.expiresAt) {
    addConditions.push({
      expiresAt: {
        gte: query.expiresAt
      }
    });
  }
  const invitations = await prisma.invitation.findMany({
    where: {
      AND: addConditions
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  return invitations;
};
var getInvitationById = async (invitationId) => {
  if (!invitationId) {
    throw new Error("Invitation ID is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: {
      id: invitationId
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true
        }
      },
      invitedBy: {
        select: {
          name: true
        }
      }
    }
  });
  if (!invitation) {
    throw new Error("Invitation not found");
  }
  return invitation;
};
var cencelInvitation = async (invitationId) => {
  if (!invitationId) {
    throw new Error("Invitation ID is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: {
      id: invitationId
    }
  });
  if (!invitation) {
    throw new Error("Invitation not found");
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error(`Invitation is ${invitation.status.toLowerCase()}`);
  }
  const updatedInvitation = await prisma.invitation.update({
    where: {
      id: invitationId
    },
    data: {
      status: InvitationStatus.CANCELLED
    }
  });
  return updatedInvitation;
};
var deleteInvitation = async (invitationId) => {
  if (!invitationId) {
    throw new Error("Invitation ID is required");
  }
  const invitation = await prisma.invitation.delete({
    where: {
      id: invitationId
    }
  });
  return invitation;
};
var InvitationService = {
  sentInvitations,
  getInvitationByToken,
  acceptInvitation,
  getAllInvitations,
  getInvitationById,
  cencelInvitation,
  deleteInvitation
};

// src/app/module/invitation/invitation.controller.ts
var sentInvitations2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user?.userId;
  const organizationId = req.params.organizationId;
  const result = await InvitationService.sentInvitations(body, organizationId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.CREATED,
    message: "Invitation sent successfully!",
    data: result
  });
});
var getInvitationByToken2 = catchAsync(async (req, res) => {
  const result = await InvitationService.getInvitationByToken(req.params.token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Invitation is valid",
    data: result
  });
});
var acceptInvitation2 = catchAsync(async (req, res) => {
  const result = await InvitationService.acceptInvitation(
    req.params.token,
    req.user?.userId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Invitation accepted successfully",
    data: result
  });
});
var getAllInvitations2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await InvitationService.getAllInvitations(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "All invitations fetched successfully",
    data: result
  });
});
var getInvitationById2 = catchAsync(async (req, res) => {
  const invitationId = req.params.invitationId;
  const result = await InvitationService.getInvitationById(invitationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Invitation fetched successfully",
    data: result
  });
});
var cencelInvitation2 = catchAsync(async (req, res) => {
  const invitationId = req.params.invitationId;
  const result = await InvitationService.cencelInvitation(invitationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Invitation cancelled successfully",
    data: result
  });
});
var deleteInvitation2 = catchAsync(async (req, res) => {
  const invitationId = req.params.invitationId;
  const result = await InvitationService.deleteInvitation(invitationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Invitation deleted successfully",
    data: result
  });
});
var InvitationController = {
  sentInvitations: sentInvitations2,
  getInvitationByToken: getInvitationByToken2,
  acceptInvitation: acceptInvitation2,
  getAllInvitations: getAllInvitations2,
  getInvitationById: getInvitationById2,
  cencelInvitation: cencelInvitation2,
  deleteInvitation: deleteInvitation2
};

// src/app/middleware/checkAuth.ts
var auth = (options = {}) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifiedToken = jwtUtiles.varifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { email: email2, name, userId, role } = verifiedToken.data;
    if (options.platformRoles?.length && !options.platformRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email: email2,
        name,
        platformRole: role
      }
    });
    if (!user) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.status === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support.");
    }
    let organizationId;
    let organizationRole;
    if (options.organizationRoles?.length) {
      organizationId = req.params.organizationId;
      if (!organizationId) {
        throw new Error("Organization Id is required!");
      }
      console.log("Organization Id:", organizationId, "User Id:", userId);
      const membership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId
          }
        }
      });
      if (!membership) {
        throw new Error("You are not a member of this organization");
      }
      organizationRole = membership.organizationRole;
      if (!options.organizationRoles.includes(organizationRole)) {
        throw new Error(
          "Forbidden. You don't have permission to access this organization resource."
        );
      }
    }
    req.user = {
      email: email2,
      name,
      userId,
      platformRole: user.platformRole,
      organizationId,
      organizationRole
    };
    next();
  });
};

// src/app/module/invitation/invitation.validation.ts
import z2 from "zod";
var sentInvitationZodSchema = z2.object({
  body: z2.object({
    email: z2.string().email({ message: "Invalid email address" }),
    organizationRole: z2.string().min(3, { message: "Role must be at least 3 characters long" })
  })
});
var GetAllInvitationsZodSchema = z2.object({
  body: z2.object({
    searchTerm: z2.string().optional(),
    page: z2.string().optional(),
    limit: z2.string().optional(),
    sortOrder: z2.string().optional(),
    sortBy: z2.string().optional(),
    email: z2.string().optional(),
    organizationRole: z2.string().optional(),
    status: z2.string().optional(),
    acceptedAt: z2.coerce.date().optional(),
    expiresAt: z2.coerce.date().optional()
  }).optional()
});
var InvitationValidation = {
  sentInvitationZodSchema,
  GetAllInvitationsZodSchema
};

// src/app/module/invitation/invitation.route.ts
var router2 = Router2();
router2.post("/:organizationId/sent-invitation", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(InvitationValidation.sentInvitationZodSchema), InvitationController.sentInvitations);
router2.get("/:token", InvitationController.getInvitationByToken);
router2.post("/:token/accept", auth({ platformRoles: [PlatformRole.USER] }), InvitationController.acceptInvitation);
router2.get("/:organizationId/invitations", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(InvitationValidation.GetAllInvitationsZodSchema), InvitationController.getAllInvitations);
router2.get("/:organizationId/invitations/:invitationId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), InvitationController.getInvitationById);
router2.patch("/:organizationId/invitations/:invitationId/cancel", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), InvitationController.cencelInvitation);
var InvitationRouter = router2;

// src/app/module/organization/organization.route.ts
import Rounter from "express";

// src/app/module/organization/organization.controller.ts
import httpStatus5 from "http-status";

// src/app/module/organization/organization.service.ts
var createOrganization = async (payload, fileBuffer, userId) => {
  const { name, slug, description } = payload;
  if (!slug) {
    throw new Error("Slug is required");
  }
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("Plaese login to create an organization");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.emailVerified === false) {
    throw new Error("Please verify your email before creating an organization");
  }
  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }
  if (user.status === "DELETED" || user.isDeleted === true) {
    throw new Error("Your account has been deleted. Please contact support.");
  }
  if (user.isActive === false) {
    throw new Error("Your account is not active. Please contact support.");
  }
  const isEexistOrganization = await prisma.organization.findFirst({
    where: {
      OR: [
        { name },
        { slug }
      ]
    }
  });
  if (isEexistOrganization) {
    throw new Error("Organization already exists");
  }
  let cloudinaryResult;
  try {
    cloudinaryResult = await uploadToCloudinary(fileBuffer, "organization-logo");
  } catch (error) {
    throw new Error("Fail to upload logo in cloudinary!");
  }
  if (!cloudinaryResult) {
    throw new Error("Does not upload logo in cloudinary,Please try again");
  }
  const freePlan = await prisma.plan.findUnique({ where: { name: "FREE" } });
  if (!freePlan) {
    throw new Error("Free plan not found in the system. Contact support.");
  }
  const { organization, organizationMember } = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name,
        slug,
        description,
        logo: cloudinaryResult.secure_url,
        logoPublicId: cloudinaryResult.public_id
      }
    });
    const member = await tx.organizationMember.create({
      data: {
        userId,
        organizationId: org.id,
        organizationRole: OrganizationRole.ORG_ADMIN
      }
    });
    await tx.subscription.create({
      data: {
        organizationId: org.id,
        planId: freePlan.id,
        status: "ACTIVE",
        interval: "MONTHLY",
        currentPeriodStart: /* @__PURE__ */ new Date(),
        currentPeriodEnd: new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 120))
        // 10 years for Free by default
      }
    });
    return { organization: org, organizationMember: member };
  });
  if (!organization || !organizationMember) {
    throw new Error("Fail to create organization and member. Please try again.");
  }
  const organizationWithMembers = await prisma.organization.findUnique({
    where: {
      id: organization.id
    },
    include: {
      members: true
    }
  });
  if (!organizationWithMembers) {
    throw new Error("Fail to fetch organization with members,Please try again");
  }
  await ActivityService.createActivity({
    organizationId: organization.id,
    actorId: userId,
    action: ActivityAction.CREATED,
    entityType: "ORGANIZATION",
    entityId: organization.id,
    description: `Organization ${organization.name} created`
  });
  return { organizationWithMembers };
};
var updateLogo = async (fileBuffer, userId, organizationId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  const currentOrganization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!currentOrganization) {
    throw new Error("Organization not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (user.emailVerified === false) {
    throw new Error("Please verify your email before updating organization logo");
  }
  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }
  if (user.status === "DELETED" || user.isDeleted === true) {
    throw new Error("Your account has been deleted. Please contact support.");
  }
  if (user.isActive === false) {
    throw new Error("Your account is not active. Please contact support.");
  }
  let cloudinaryResult;
  try {
    cloudinaryResult = await uploadToCloudinary(fileBuffer, "organization-logo");
  } catch (error) {
    throw new Error("Fail to upload logo in cloudinary!");
  }
  if (!cloudinaryResult) {
    throw new Error("Does not upload logo in cloudinary,Please try again");
  }
  const organization = await prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      logo: cloudinaryResult.secure_url,
      logoPublicId: cloudinaryResult.public_id
    },
    include: {
      members: true
    }
  });
  if (currentOrganization.logoPublicId && currentOrganization.logo) {
    try {
      await deleteFromCloudinary(currentOrganization.logoPublicId);
    } catch (error) {
      console.error("Failed to delete old logo from Cloudinary:", error);
    }
  }
  await ActivityService.createActivity({
    organizationId: organization.id,
    actorId: userId,
    action: ActivityAction.UPDATED,
    entityType: "ORGANIZATION",
    entityId: organization.id,
    description: `Organization logo updated`
  });
  return {
    data: organization
  };
};
var updateOrganizationInfo = async (payload, userId, organizationId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.emailVerified === false) {
    throw new Error("Please verify your email before updating organization info");
  }
  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }
  if (user.status === "DELETED" || user.isDeleted === true) {
    throw new Error("Your account has been deleted. Please contact support.");
  }
  if (user.isActive === false) {
    throw new Error("Your account is not active. Please contact support.");
  }
  const organization = await prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      ...payload
    },
    include: {
      members: true
    }
  });
  await ActivityService.createActivity({
    organizationId: organization.id,
    actorId: userId,
    action: ActivityAction.UPDATED,
    entityType: "ORGANIZATION",
    entityId: organization.id,
    description: `Organization info updated`
  });
  return { organization };
};
var getOrganizationById = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    },
    include: {
      members: true,
      subscription: {
        include: { plan: true }
      }
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  return {
    data: organization
  };
};
var getAllOrganizations = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const addConditions = [];
  if (query.searchTerm) {
    addConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          slug: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.name) {
    addConditions.push({
      name: query.name
    });
  }
  if (query.slug) {
    addConditions.push({
      slug: query.slug
    });
  }
  if (query.description) {
    addConditions.push({
      description: query.description
    });
  }
  const organizations = await prisma.organization.findMany({
    where: {
      AND: addConditions
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      subscription: {
        include: { plan: true }
      }
    }
  });
  const totalOrganizations = await prisma.organization.count({
    where: {
      AND: addConditions
    }
  });
  const totalPages = Math.ceil(totalOrganizations / limit);
  return {
    data: organizations,
    meta: {
      page,
      limit,
      total: totalOrganizations,
      totalPages
    }
  };
};
var deleteOrganization = async (organizationId, userId) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const deletedOrganization = await prisma.organization.delete({
    where: {
      id: organizationId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.DELETED,
    entityType: "ORGANIZATION",
    entityId: organizationId,
    description: `Organization ${organization.name} deleted`
  });
  return {
    data: deletedOrganization
  };
};
var OrganizationService = {
  createOrganization,
  updateLogo,
  updateOrganizationInfo,
  getOrganizationById,
  getAllOrganizations,
  deleteOrganization
};

// src/app/module/organization/organization.controller.ts
var createOrganization2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  const payload = req.file;
  const userId = req.user?.userId;
  console.log("userId", userId);
  if (!payload) {
    throw new Error("No File Provided!");
  }
  const result = await OrganizationService.createOrganization(body, payload?.buffer, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.CREATED,
    message: "Organization created successfully!",
    data: result
  });
});
var updateLogo2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const payload = req.file;
  const userId = req.user?.userId;
  if (!payload) {
    throw new Error("No File Provided!");
  }
  const result = await OrganizationService.updateLogo(payload?.buffer, userId, organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.CREATED,
    message: "Organization logo updated successfully!",
    data: result.data
  });
});
var updateOrganizationInfo2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const body = req.body;
  const userId = req.user?.userId;
  const result = await OrganizationService.updateOrganizationInfo(body, userId, organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.CREATED,
    message: "Organization info updated successfully!",
    data: result
  });
});
var getOrganizationById2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const result = await OrganizationService.getOrganizationById(organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Organization fetched successfully!",
    data: result.data
  });
});
var getAllOrganizations2 = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await OrganizationService.getAllOrganizations(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Organizations fetched successfully!",
    data: result.data,
    meta: result.meta
  });
});
var deleteOrganization2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const userId = req.user?.userId;
  const result = await OrganizationService.deleteOrganization(organizationId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Organization deleted successfully!",
    data: result.data
  });
});
var OrganizationController = {
  createOrganization: createOrganization2,
  updateLogo: updateLogo2,
  updateOrganizationInfo: updateOrganizationInfo2,
  getOrganizationById: getOrganizationById2,
  getAllOrganizations: getAllOrganizations2,
  deleteOrganization: deleteOrganization2
};

// src/app/module/organization/organization.validation.ts
import z3 from "zod";
var ALLOWED_MULTI_TYPES2 = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4"],
  video: ["video/mp4", "video/quicktime", "video/x-matroska"]
};
var singleFileEngine2 = (allowedTypes, maxMB) => {
  return z3.object({
    fieldname: z3.string(),
    originalname: z3.string(),
    encoding: z3.string(),
    mimetype: z3.string().refine(
      (type) => allowedTypes.includes(type),
      { message: `Invalid format. Expected: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}` }
    ),
    size: z3.number().max(maxMB * 1024 * 1024, `Size exceeds limit of ${maxMB}MB`)
  });
};
var CreateOrganizationSchema = z3.object({
  body: z3.object({
    name: z3.string().min(3, { message: "Name must be at least 3 characters long" }),
    slug: z3.string().min(3, { message: "Slug must be at least 3 characters long" }),
    description: z3.string().optional()
  }),
  file: z3.object({
    logo: z3.array(singleFileEngine2(ALLOWED_MULTI_TYPES2.image, 10)).max(1, "Only 1 logo allowed").optional()
  }).optional()
});
var UpdateLogoZodSchema = z3.object({
  file: z3.object({
    logo: z3.array(singleFileEngine2(ALLOWED_MULTI_TYPES2.image, 10)).max(1, "Only 1 logo allowed").optional()
  }).optional()
});
var UpdateOrganizationInfoZodSchema = z3.object({
  body: z3.object({
    name: z3.string().min(3, { message: "Name must be at least 3 characters long" }).optional(),
    slug: z3.string().min(3, { message: "Slug must be at least 3 characters long" }).optional(),
    description: z3.string().optional()
  })
});
var GetAllOrganizationZodSchema = z3.object({
  body: z3.object({
    searchTerm: z3.string().optional(),
    page: z3.string().optional(),
    limit: z3.string().optional(),
    sortOrder: z3.string().optional(),
    sortBy: z3.string().optional(),
    name: z3.string().optional(),
    slug: z3.string().optional(),
    description: z3.string().optional()
  }).optional()
});
var OrganizationValidation = {
  CreateOrganizationSchema,
  UpdateLogoZodSchema,
  UpdateOrganizationInfoZodSchema,
  GetAllOrganizationZodSchema
};

// src/app/module/organization/organization.route.ts
var router3 = Rounter();
router3.post("/create-organization", auth({ platformRoles: [PlatformRole.USER, PlatformRole.SUPER_ADMIN] }), upload.single("logo"), validationRequest(OrganizationValidation.CreateOrganizationSchema), OrganizationController.createOrganization);
router3.post("/:organizationId/update-logo", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), upload.single("logo"), OrganizationController.updateLogo);
router3.post("/:organizationId/update-OrganizationInfo", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(OrganizationValidation.UpdateOrganizationInfoZodSchema), OrganizationController.updateOrganizationInfo);
router3.get("/get-all-organizations", validationRequest(OrganizationValidation.GetAllOrganizationZodSchema), OrganizationController.getAllOrganizations);
router3.get("/:organizationId", OrganizationController.getOrganizationById);
router3.delete("/:organizationId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationController.deleteOrganization);
var OrganizationRouter = router3;

// src/app/module/project/project.route.ts
import Router3 from "express";

// src/app/module/project/project.controller.ts
import httpStatus6 from "http-status";

// src/app/lib/bkash.ts
var getBkashToken = async () => {
  try {
    const idTokenKey = "bkash:idToekn";
    const refreshTokenKey = "bkash:refreshToken";
    let bkashIdToken = await redisClient.get(idTokenKey);
    let bkashRefreshToken = await redisClient.get(refreshTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(idTokenKey);
    const bkashRefreshTokenTTL = await redisClient.ttl(refreshTokenKey);
    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshTokenTTL > 600) {
      const refreshTokenResponse = await fetch(`${config_default.bkash_base_url}/tokenized/checkout/token/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "username": config_default.bkash_username,
          "password": config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret,
          refresh_token: bkashRefreshToken
        })
      });
      if (!refreshTokenResponse.ok) {
        throw new Error("Bkash Access Token Grant Failed.");
      }
      const result2 = await refreshTokenResponse.json();
      await redisClient.set(idTokenKey, result2.id_token, {
        EX: 60 * 60
        // 1 hour
      });
      bkashIdToken = result2.id_token;
      return bkashIdToken;
    }
    if (bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    const response = await fetch(`${config_default.bkash_base_url}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "username": config_default.bkash_username,
        "password": config_default.bkash_password
      },
      body: JSON.stringify({
        app_key: config_default.bkash_app_key,
        app_secret: config_default.bkash_app_secret
      })
    });
    if (!response.ok) {
      throw new Error("Bkash Access Token Grant Failed.");
    }
    const result = await response.json();
    await redisClient.set(idTokenKey, result.id_token, {
      EX: 60 * 60
      // 1 hour
    });
    await redisClient.set(refreshTokenKey, result.refresh_token, {
      EX: 60 * 60 * 24 * 28
      // 28 day
    });
    bkashIdToken = result.id_token;
    return bkashIdToken;
  } catch (error) {
    throw new Error("Error getting bKash token: " + error);
  }
};
var createBkashPayment = async (amount, invoiceNumber) => {
  const token = await getBkashToken();
  const response = await fetch(`${config_default.bkash_base_url}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": token,
      "x-app-key": config_default.bkash_app_key
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: "TaskFlow Subscription",
      callbackURL: config_default.bkash_callback_url,
      amount: amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoiceNumber
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error("Failed to create bKash payment: " + errorBody);
  }
  const result = await response.json();
  if (result.statusCode !== "0000") {
    throw new Error("bKash create API error: " + result.statusMessage);
  }
  return {
    paymentID: result.paymentID,
    bkashURL: result.bkashURL
  };
};
var executeBkashPayment = async (paymentID) => {
  const token = await getBkashToken();
  const response = await fetch(`${config_default.bkash_base_url}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": token,
      "x-app-key": config_default.bkash_app_key
    },
    body: JSON.stringify({
      paymentID
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error("Failed to execute bKash payment: " + errorBody);
  }
  const result = await response.json();
  if (result.statusCode !== "0000" && result.statusCode !== "2062") {
    throw new Error("bKash execute API error: " + result.statusMessage);
  }
  return result;
};

// src/app/module/organizationbilling/organizationbilling.service.ts
var OrganizationBillingService = class {
  static async checkLimit(organizationId, resource) {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
    if (!subscription || !subscription.plan) {
      throw new Error("No active subscription found");
    }
    const { plan } = subscription;
    if (resource === "PROJECT") {
      if (plan.maxProjects !== null) {
        const count = await prisma.project.count({
          where: { organizationId, deletedAt: null }
        });
        if (count >= plan.maxProjects) {
          throw new Error("your limit finished , upgrade your plan");
        }
      }
    } else if (resource === "MEMBER") {
      if (plan.maxMembers !== null) {
        const count = await prisma.organizationMember.count({
          where: { organizationId }
        });
        if (count >= plan.maxMembers) {
          throw new Error("Member limit reached for your current plan.");
        }
      }
    } else if (resource === "TEAM") {
      if (plan.maxTeams !== null) {
        const count = await prisma.team.count({
          where: { organizationId }
        });
        if (count >= plan.maxTeams) {
          throw new Error("Team limit reached for your current plan.");
        }
      }
    }
  }
  static async getBillingOverview(organizationId) {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
    return subscription;
  }
  static async getUsage(organizationId) {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
    if (!subscription || !subscription.plan) {
      throw new Error("No active subscription found");
    }
    const { plan } = subscription;
    const projects = await prisma.project.count({
      where: { organizationId, deletedAt: null }
    });
    const members = await prisma.organizationMember.count({
      where: { organizationId }
    });
    const teams = await prisma.team.count({
      where: { organizationId }
    });
    return {
      plan: {
        name: plan.name,
        maxProjects: plan.maxProjects,
        maxMembers: plan.maxMembers,
        maxTeams: plan.maxTeams
      },
      usage: {
        projects,
        members,
        teams
      }
    };
  }
  static async requestUpgrade(organizationId, payload, userId) {
    const newPlan = await prisma.plan.findUnique({ where: { id: payload.planId } });
    if (!newPlan) throw new Error("Plan not found");
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
    if (!subscription) throw new Error("Subscription not found");
    const amount = payload.interval === BillingInterval.YEARLY ? newPlan.priceYearly : newPlan.priceMonthly;
    const invoice = await prisma.invoice.create({
      data: {
        organizationId,
        subscriptionId: subscription.id,
        invoiceNumber: `INV-${Date.now()}`,
        subtotal: amount,
        total: amount,
        status: InvoiceStatus.OPEN,
        periodStart: /* @__PURE__ */ new Date(),
        periodEnd: new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + (payload.interval === BillingInterval.YEARLY ? 12 : 1)))
      }
    });
    const bkashPayment = await createBkashPayment(Number(amount), invoice.invoiceNumber);
    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        organizationId,
        paymentMethod: PaymentMethod.BKASH,
        amount,
        transactionId: bkashPayment.paymentID,
        status: PaymentStatus.PENDING
      }
    });
    await redisClient.setEx(
      `bkash_intent:${bkashPayment.paymentID}`,
      3600,
      JSON.stringify({ planId: payload.planId, interval: payload.interval })
    );
    await ActivityService.createActivity({
      organizationId,
      actorId: userId,
      action: ActivityAction.PLAN_UPGRADED,
      entityType: "ORGANIZATION",
      entityId: organizationId,
      metadata: { newPlan: newPlan.name, paymentID: bkashPayment.paymentID },
      description: `Requested upgrade to ${newPlan.name} via automated bKash`
    });
    return { invoice, bkashURL: bkashPayment.bkashURL };
  }
  static async requestDowngrade(organizationId, payload, userId) {
    const newPlan = await prisma.plan.findUnique({ where: { id: payload.planId } });
    if (!newPlan) throw new Error("Plan not found");
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
    if (!subscription) throw new Error("Subscription not found");
    const amount = payload.interval === BillingInterval.YEARLY ? newPlan.priceYearly : newPlan.priceMonthly;
    if (Number(amount) === 0) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId: newPlan.id,
          interval: payload.interval || BillingInterval.MONTHLY,
          status: SubscriptionStatus.ACTIVE
        }
      });
      await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.PLAN_DOWNGRADED,
        entityType: "ORGANIZATION",
        entityId: organizationId,
        metadata: { newPlan: newPlan.name, amount: 0 },
        description: `Downgraded to ${newPlan.name} instantly (Free)`
      });
      return { success: true, message: `Successfully downgraded to ${newPlan.name}` };
    }
    const invoice = await prisma.invoice.create({
      data: {
        organizationId,
        subscriptionId: subscription.id,
        invoiceNumber: `INV-${Date.now()}`,
        subtotal: amount,
        total: amount,
        status: InvoiceStatus.OPEN,
        periodStart: /* @__PURE__ */ new Date(),
        periodEnd: new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + (payload.interval === BillingInterval.YEARLY ? 12 : 1)))
      }
    });
    const bkashPayment = await createBkashPayment(Number(amount), invoice.invoiceNumber);
    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        organizationId,
        paymentMethod: PaymentMethod.BKASH,
        amount,
        transactionId: bkashPayment.paymentID,
        status: PaymentStatus.PENDING
      }
    });
    await redisClient.setEx(
      `bkash_intent:${bkashPayment.paymentID}`,
      3600,
      JSON.stringify({ planId: payload.planId, interval: payload.interval || BillingInterval.MONTHLY })
    );
    await ActivityService.createActivity({
      organizationId,
      actorId: userId,
      action: ActivityAction.PLAN_DOWNGRADED,
      entityType: "ORGANIZATION",
      entityId: organizationId,
      metadata: { newPlan: newPlan.name, paymentID: bkashPayment.paymentID },
      description: `Requested downgrade to ${newPlan.name} via bKash`
    });
    return { invoice, bkashURL: bkashPayment.bkashURL };
  }
  static async cancelSubscription(organizationId, userId) {
    const subscription = await prisma.subscription.update({
      where: { organizationId },
      data: { cancelAtPeriodEnd: true }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: userId,
      action: ActivityAction.SUBSCRIPTION_CANCELLED,
      entityType: "ORGANIZATION",
      entityId: organizationId,
      description: `Cancelled subscription at period end`
    });
    return subscription;
  }
  static async resumeSubscription(organizationId, userId) {
    const subscription = await prisma.subscription.update({
      where: { organizationId },
      data: { cancelAtPeriodEnd: false }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: userId,
      action: ActivityAction.SUBSCRIPTION_RESUMED,
      entityType: "ORGANIZATION",
      entityId: organizationId,
      description: `Resumed subscription`
    });
    return subscription;
  }
  static async getInvoices(organizationId) {
    return prisma.invoice.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });
  }
  static async getPayments(organizationId) {
    return prisma.payment.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });
  }
};

// src/app/module/project/project.service.ts
var createProjectSlug = (name) => {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug;
};
var createProject = async (organizationId, userId, payload) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    }
  });
  if (!member) {
    throw new Error("You are not a member of this organization");
  }
  await OrganizationBillingService.checkLimit(organizationId, "PROJECT");
  const result = await prisma.$transaction(async (transaction) => {
    const project = await transaction.project.create({
      data: {
        organizationId,
        createdById: userId,
        name: payload.name,
        slug: payload.slug || createProjectSlug(payload.name),
        description: payload.description,
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return project;
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.CREATED,
    entityType: "PROJECT",
    entityId: result.id,
    description: `Project ${result.name} created`
  });
  return result;
};
var getAllProjects = async (organizationId, query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const addConditions = [];
  if (query.searchTerm) {
    addConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          slug: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.name) {
    addConditions.push({
      name: query.name
    });
  }
  if (query.slug) {
    addConditions.push({
      slug: query.slug
    });
  }
  if (query.description) {
    addConditions.push({
      description: query.description
    });
  }
  if (query.startDate) {
    addConditions.push({
      startDate: new Date(query.startDate)
    });
  }
  if (query.endDate) {
    addConditions.push({
      endDate: new Date(query.endDate)
    });
  }
  addConditions.push({
    organizationId
  });
  const projects = await prisma.project.findMany({
    where: {
      AND: addConditions
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      projectMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  const total = await prisma.project.count({
    where: {
      AND: addConditions
    }
  });
  const totalPages = Math.ceil(total / limit);
  return {
    data: projects,
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  };
};
var getProject = async (organizationId, projectId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      projectMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
var updateProject = async (organizationId, projectId, userId, payload) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const isxistingProject = await prisma.project.findUnique({
    where: {
      id: projectId
    }
  });
  if (!isxistingProject) {
    throw new Error("Project not found");
  }
  const updateData = {};
  if (payload.name !== void 0) {
    updateData.name = payload.name;
  }
  if (payload.description !== void 0) {
    updateData.description = payload.description;
  }
  if (payload.status !== void 0) {
    updateData.status = payload.status;
  }
  if (payload.startDate !== void 0) {
    updateData.startDate = payload.startDate ? new Date(payload.startDate) : null;
  }
  if (payload.endDate !== void 0) {
    updateData.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  const project = await prisma.project.update({
    where: {
      id: projectId
    },
    data: updateData,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      projectMembers: true
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.UPDATED,
    entityType: "PROJECT",
    entityId: project.id,
    description: `Project updated`
  });
  return project;
};
var deleteProject = async (organizationId, projectId, userId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  const existingProject = await prisma.project.findUnique({
    where: {
      id: projectId
    }
  });
  if (!existingProject) {
    throw new Error("Project not found");
  }
  const project = await prisma.project.delete({
    where: {
      id: projectId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.DELETED,
    entityType: "PROJECT",
    entityId: projectId,
    description: `Project ${existingProject.name} deleted`
  });
  return project;
};
var assignProjectManager = async (organizationId, projectId, memberId, userId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!memberId) {
    throw new Error("Member ID is required");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: memberId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (user.status === UserStatus.DELETED || user.isDeleted === true) {
    throw new Error("User is deleted");
  }
  if (user.emailVerified === false) {
    throw new Error("User email is not verified");
  }
  const isExistingProject = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId
    }
  });
  if (!isExistingProject) {
    throw new Error("Project not found");
  }
  const manager = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId
      }
    }
  });
  if (!manager) {
    throw new Error("Member not found in the organization");
  }
  const updateOrganizationMember = await prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId
      }
    },
    data: {
      organizationRole: OrganizationRole.PROJECT_MANAGER
    }
  });
  const projectManager = await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId,
        userId: manager.userId
      }
    },
    update: {
      projectId,
      userId: manager.userId
    },
    create: {
      projectId,
      userId: manager.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.UPDATED,
    entityType: "PROJECT",
    entityId: projectId,
    metadata: { targetUserId: memberId },
    description: `Assigned project manager`
  });
  return projectManager;
};
var addMember = async (organizationId, projectId, memberId, userId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!memberId) {
    throw new Error("Member ID is required");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: memberId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (user.status === UserStatus.DELETED || user.isDeleted === true) {
    throw new Error("User is deleted");
  }
  if (user.emailVerified === false) {
    throw new Error("User email is not verified");
  }
  const isExistingProject = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId
    }
  });
  if (!isExistingProject) {
    throw new Error("Project not found");
  }
  const manager = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId
      }
    }
  });
  if (!manager) {
    throw new Error("Member not found in the organization");
  }
  const updateOrganizationMember = await prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId
      }
    },
    data: {
      organizationRole: OrganizationRole.MEMBER
    }
  });
  const projectMember = await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId,
        userId: manager.userId
      }
    },
    update: {
      projectId,
      userId: manager.userId
    },
    create: {
      projectId,
      userId: manager.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.MEMBER_ADDED,
    entityType: "PROJECT",
    entityId: projectId,
    metadata: { targetUserId: memberId },
    description: `Added member to project`
  });
  return projectMember;
};
var removeMember = async (organizationId, projectId, memberId, userId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!memberId) {
    throw new Error("Member ID is required");
  }
  const isExistingProject = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId
    }
  });
  if (!isExistingProject) {
    throw new Error("Project not found");
  }
  const isExistingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: memberId
      }
    }
  });
  if (!isExistingMember) {
    throw new Error("Member not found in the project");
  }
  const projectMember = await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId: memberId
      }
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: userId,
    action: ActivityAction.MEMBER_REMOVED,
    entityType: "PROJECT",
    entityId: projectId,
    metadata: { targetUserId: memberId },
    description: `Removed member from project`
  });
  return projectMember;
};
var ProjectService = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  assignProjectManager,
  addMember,
  removeMember
};

// src/app/module/project/project.controller.ts
var createProject2 = catchAsync(async (req, res, next) => {
  const body = req.body;
  const organizationId = req.params.organizationId;
  const userId = req.user?.userId;
  const result = await ProjectService.createProject(organizationId, userId, body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Project created successfully!",
    data: result
  });
});
var getAllProjects2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const query = req.query;
  const result = await ProjectService.getAllProjects(
    organizationId,
    query
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Projects fetched successfully!",
    data: result.data,
    meta: result.meta
  });
});
var getProject2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const userId = req.user?.userId;
  const result = await ProjectService.getProject(
    organizationId,
    projectId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Project fetched successfully!",
    data: result
  });
});
var updateProject2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const userId = req.user?.userId;
  const body = req.body;
  const result = await ProjectService.updateProject(
    organizationId,
    projectId,
    userId,
    body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Project updated successfully!",
    data: result
  });
});
var deleteProject2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const userId = req.user?.userId;
  const result = await ProjectService.deleteProject(organizationId, projectId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Project deleted successfully!",
    data: result
  });
});
var assignProjectManager2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const memberId = req.body.memberId;
  const userId = req.user?.userId;
  console.log("memberId", memberId);
  const result = await ProjectService.assignProjectManager(organizationId, projectId, memberId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Project manager assigned successfully!",
    data: result
  });
});
var addMember2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const memberId = req.body.memberId;
  const userId = req.user?.userId;
  const result = await ProjectService.addMember(
    organizationId,
    projectId,
    memberId,
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Project member added successfully!",
    data: result
  });
});
var removeMember2 = catchAsync(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const memberId = req.params.userId;
  const userId = req.user?.userId;
  const result = await ProjectService.removeMember(
    organizationId,
    projectId,
    memberId,
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Project member removed successfully!",
    data: result
  });
});
var ProjectController = {
  createProject: createProject2,
  getAllProjects: getAllProjects2,
  getProject: getProject2,
  updateProject: updateProject2,
  deleteProject: deleteProject2,
  assignProjectManager: assignProjectManager2,
  addMember: addMember2,
  removeMember: removeMember2
};

// src/app/module/project/project.validation.ts
import z4 from "zod";
var createProjectSchema = z4.object({
  body: z4.object({
    name: z4.string().min(1),
    description: z4.string().optional(),
    slug: z4.string().min(3).optional(),
    startDate: z4.union([z4.string(), z4.date()]).nullable().optional(),
    endDate: z4.union([z4.string(), z4.date()]).nullable().optional()
  })
});
var updateProjectSchema = z4.object({
  body: z4.object({
    name: z4.string().min(1).optional(),
    description: z4.string().optional(),
    status: z4.enum(ProjectStatus).optional(),
    startDate: z4.union([z4.string(), z4.date()]).nullable().optional(),
    endDate: z4.union([z4.string(), z4.date()]).nullable().optional()
  })
});
var projectMemberSchema = z4.object({
  body: z4.object({
    memberId: z4.string().uuid()
  })
});
var GetAllOrganizationProjectsZodSchema = z4.object({
  body: z4.object({
    searchTerm: z4.string().optional(),
    page: z4.string().optional(),
    limit: z4.string().optional(),
    sortOrder: z4.string().optional(),
    sortBy: z4.string().optional(),
    name: z4.string().optional(),
    description: z4.string().optional(),
    slug: z4.string().optional(),
    startDate: z4.string().optional(),
    endDate: z4.string().optional(),
    organizationId: z4.string().uuid("Invalid organization ID format").optional()
  }).optional()
});
var assignProjectManagerSchema = projectMemberSchema;
var ProjectValidation = {
  createProjectSchema,
  GetAllOrganizationProjectsZodSchema,
  updateProjectSchema,
  projectMemberSchema,
  assignProjectManagerSchema
};

// src/app/module/project/project.route.ts
var router4 = Router3();
router4.post("/:organizationId/create-project", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(ProjectValidation.createProjectSchema), ProjectController.createProject);
router4.get("/:organizationId/getAllprojects", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(ProjectValidation.GetAllOrganizationProjectsZodSchema), ProjectController.getAllProjects);
router4.get("/:organizationId/projects/:projectId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.MEMBER, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD] }), ProjectController.getProject);
router4.patch("/:organizationId/projects/:projectId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(ProjectValidation.updateProjectSchema), ProjectController.updateProject);
router4.delete("/:organizationId/projects/:projectId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), ProjectController.deleteProject);
router4.patch("/:organizationId/projects/:projectId/manager", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(ProjectValidation.assignProjectManagerSchema), ProjectController.assignProjectManager);
router4.patch("/:organizationId/projects/:projectId/members", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(ProjectValidation.projectMemberSchema), ProjectController.addMember);
router4.delete("/:organizationId/projects/:projectId/members/:userId", auth(), ProjectController.removeMember);
var ProjectRouter = router4;

// src/app/module/team/team.route.ts
import { Router as Router4 } from "express";

// src/app/module/team/team.service.ts
var createTeam = async (payload, user, organizationId) => {
  if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
    throw new Error("Only organization admins can create teams.");
  }
  const existingTeam = await prisma.team.findUnique({
    where: {
      organizationId_name: {
        organizationId,
        name: payload.name
      }
    }
  });
  if (existingTeam) {
    throw new Error("A team with this name already exists in the organization.");
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!existingUser) {
    throw new Error("User not found");
  }
  if (existingUser.status === UserStatus.BLOCKED) {
    throw new Error("Blocked users cannot create teams.");
  }
  if (existingUser.status === UserStatus.DELETED || existingUser.isDeleted === true) {
    throw new Error("Deleted users cannot create teams.");
  }
  if (existingUser.emailVerified === false) {
    throw new Error("Email not verified. Please verify your email to create a team.");
  }
  const existingOrgMember = await prisma.organizationMember.findFirst({
    where: {
      userId: user.userId,
      organizationId
    }
  });
  if (!existingOrgMember) {
    throw new Error("User is not a member of this organization.");
  }
  const existOrganization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!existOrganization) {
    throw new Error("Organization not found.");
  }
  const team = await prisma.team.create({
    data: {
      ...payload,
      organizationId,
      createdById: user.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.CREATED,
    entityType: "TEAM",
    entityId: team.id,
    description: `Team ${team.name} created`
  });
  return team;
};
var getAllTeams = async (query, user, organizationId) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const addConditions = [];
  if (query.searchTerm) {
    addConditions.push({
      OR: [
        { name: {
          contains: query.searchTerm,
          mode: "insensitive"
        } },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.name) {
    addConditions.push({
      name: query.name
    });
  }
  if (query.description) {
    addConditions.push({
      description: query.description
    });
  }
  if (query.organizationId) {
    addConditions.push({
      organizationId: query.organizationId
    });
  }
  const whereCondition = {
    organizationId,
    AND: addConditions.length > 0 ? addConditions : void 0
  };
  const totalTeams = await prisma.team.count({
    where: whereCondition
  });
  const teams = await prisma.team.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      teamLead: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true } }
    }
  });
  return {
    data: teams,
    meta: {
      total: totalTeams,
      page,
      limit
    }
  };
};
var getTeamById = async (teamId, user, organizationId) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId },
    include: {
      teamLead: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const isManagerOrAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN || user.organizationRole === OrganizationRole.PROJECT_MANAGER;
  if (!isManagerOrAdmin) {
    const isMember = team.members.some((m) => m.userId === user.userId);
    if (!isMember) {
      throw new Error("You don't have permission to view this team");
    }
  }
  return team;
};
var updateTeam = async (teamId, payload, user, organizationId) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;
  if (!isOrgAdmin && !isTeamLead) {
    throw new Error("You don't have permission to update this team");
  }
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: payload
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.UPDATED,
    entityType: "TEAM",
    entityId: team.id,
    description: `Team updated`
  });
  return updatedTeam;
};
var deleteTeam = async (teamId, user, organizationId) => {
  if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
    throw new Error("Only organization admins can delete teams.");
  }
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId }
  });
  if (!team) throw new Error("Team not found");
  await prisma.team.delete({
    where: { id: teamId }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.DELETED,
    entityType: "TEAM",
    entityId: teamId,
    description: `Team ${team.name} deleted`
  });
  return team;
};
var assignTeamLead = async (teamId, payload, user, organizationId) => {
  if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
    throw new Error("Only organization admins can assign team leads.");
  }
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId }
  });
  if (!team) throw new Error("Team not found");
  const orgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: payload.userId
      }
    }
  });
  if (!orgMember) {
    throw new Error("Target user is not a member of this organization");
  }
  if (orgMember.organizationRole === OrganizationRole.MEMBER) {
    throw new Error("Target user must have at least TEAM_LEAD organization role.");
  }
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: payload.userId
      }
    }
  });
  if (!existingMember) {
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: payload.userId
      }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.MEMBER_ADDED,
      entityType: "TEAM",
      entityId: team.id,
      metadata: { targetUserId: payload.userId },
      description: `Added a new member to team`
    });
    return teamMember;
  }
  return existingMember;
};
var addTeamMember = async (teamId, payload, user, organizationId) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId }
  });
  if (!team) throw new Error("Team not found");
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;
  if (!isOrgAdmin && !isTeamLead) {
    throw new Error("You don't have permission to add members to this team");
  }
  const orgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: payload.userId
      }
    }
  });
  if (!orgMember) {
    throw new Error("Target user is not a member of this organization");
  }
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: payload.userId
      }
    }
  });
  if (existingMember) {
    throw new Error("User is already a member of this team");
  }
  const teamMember = await prisma.teamMember.create({
    data: {
      teamId,
      userId: payload.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.MEMBER_ADDED,
    entityType: "TEAM",
    entityId: team.id,
    metadata: { targetUserId: payload.userId },
    description: `Added a new member to team`
  });
  return teamMember;
};
var removeTeamMember = async (teamId, targetUserId, user, organizationId) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId }
  });
  if (!team) throw new Error("Team not found");
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;
  if (!isOrgAdmin && !isTeamLead) {
    throw new Error("You don't have permission to remove members from this team");
  }
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: targetUserId
      }
    }
  });
  if (!existingMember) {
    throw new Error("User is not a member of this team");
  }
  await prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId: targetUserId
      }
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.MEMBER_REMOVED,
    entityType: "TEAM",
    entityId: team.id,
    metadata: { targetUserId },
    description: `Removed a member from team`
  });
  return existingMember;
};
var viewTeamMembers = async (teamId, organizationId) => {
  if (!teamId || !organizationId) {
    throw new Error("Team ID and Organization ID are required");
  }
  const existingOrganization = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  if (!existingOrganization) {
    throw new Error("Organization not found");
  }
  const team = await prisma.team.findUnique({
    where: { id: teamId, organizationId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!team) throw new Error("Team not found");
  return team.members.map((member) => member.user);
};
var TeamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  assignTeamLead,
  addTeamMember,
  removeTeamMember,
  viewTeamMembers
};

// src/app/module/team/team.controller.ts
import httpStatus7 from "http-status";
var createTeam2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.createTeam(req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.CREATED,
    message: "Team created successfully",
    data: result
  });
});
var getAllTeams2 = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await TeamService.getAllTeams(query, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Teams retrieved successfully",
    data: result
  });
});
var getTeamById2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.getTeamById(req.params.teamId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Team retrieved successfully",
    data: result
  });
});
var updateTeam2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.updateTeam(req.params.teamId, req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Team updated successfully",
    data: result
  });
});
var deleteTeam2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.deleteTeam(req.params.teamId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Team deleted successfully",
    data: result
  });
});
var addTeamMember2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.addTeamMember(req.params.teamId, req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.CREATED,
    message: "Member added successfully",
    data: result
  });
});
var removeTeamMember2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.removeTeamMember(req.params.teamId, req.params.userId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Member removed successfully",
    data: result
  });
});
var assignTeamLead2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.assignTeamLead(req.params.teamId, req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Team lead assigned successfully",
    data: result
  });
});
var viewTeamMembers2 = catchAsync(async (req, res, next) => {
  const result = await TeamService.viewTeamMembers(req.params.teamId, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Team members retrieved successfully",
    data: result
  });
});
var TeamController = {
  createTeam: createTeam2,
  getAllTeams: getAllTeams2,
  getTeamById: getTeamById2,
  updateTeam: updateTeam2,
  deleteTeam: deleteTeam2,
  addTeamMember: addTeamMember2,
  removeTeamMember: removeTeamMember2,
  assignTeamLead: assignTeamLead2,
  viewTeamMembers: viewTeamMembers2
};

// src/app/module/team/team.validation.ts
import { z as z5 } from "zod";
var createTeamSchema = z5.object({
  body: z5.object({
    name: z5.string().min(2, "Team name must be at least 2 characters").max(100),
    description: z5.string().max(500).optional()
  })
});
var updateTeamSchema = z5.object({
  body: z5.object({
    name: z5.string().min(2).max(100).optional(),
    description: z5.string().max(500).optional()
  })
});
var GetAllTeamsZodSchema = z5.object({
  body: z5.object({
    searchTerm: z5.string().optional(),
    page: z5.string().optional(),
    limit: z5.string().optional(),
    sortOrder: z5.string().optional(),
    sortBy: z5.string().optional(),
    name: z5.string().optional(),
    description: z5.string().optional(),
    organizationId: z5.string().uuid("Invalid organization ID format").optional()
  }).optional()
});
var assignTeamLeadSchema = z5.object({
  body: z5.object({
    userId: z5.string().uuid("Invalid user ID format")
  })
});
var addTeamMemberSchema = assignTeamLeadSchema;
var GetAllTeamsMembersZodSchema = z5.object({
  body: z5.object({
    searchTerm: z5.string().optional(),
    page: z5.string().optional(),
    limit: z5.string().optional(),
    sortOrder: z5.string().optional(),
    sortBy: z5.string().optional(),
    userId: z5.string().uuid("Invalid user ID format").optional()
  }).optional()
});
var TeamValidation = {
  createTeamSchema,
  updateTeamSchema,
  assignTeamLeadSchema,
  addTeamMemberSchema,
  GetAllTeamsZodSchema,
  GetAllTeamsMembersZodSchema
};

// src/app/module/team/team.route.ts
var router5 = Router4({ mergeParams: true });
var ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router5.post("/:organizationId/create-teams", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(TeamValidation.createTeamSchema), TeamController.createTeam);
router5.get("/:organizationId/get-all-teams", auth({ organizationRoles: ALL_ROLES }), TeamController.getAllTeams);
router5.get("/:organizationId/get-team/:teamId", auth({ organizationRoles: ALL_ROLES }), TeamController.getTeamById);
router5.patch("/:organizationId/update-team/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), validationRequest(TeamValidation.updateTeamSchema), TeamController.updateTeam);
router5.delete("/:organizationId/delete-team/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), TeamController.deleteTeam);
router5.post("/:organizationId/add-team-leader/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(TeamValidation.assignTeamLeadSchema), TeamController.assignTeamLead);
router5.post("/:organizationId/add-team-member/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), validationRequest(TeamValidation.addTeamMemberSchema), TeamController.addTeamMember);
router5.delete("/:organizationId/:teamId/delete-member/:userId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), TeamController.removeTeamMember);
router5.get("/:organizationId/:teamId/view-members", auth({ organizationRoles: ALL_ROLES }), TeamController.viewTeamMembers);
var TeamRoutes = router5;

// src/app/module/sprint/sprint.route.ts
import { Router as Router5 } from "express";

// src/app/module/sprint/sprint.controller.ts
import httpStatus8 from "http-status";

// src/app/module/sprint/sprint.service.ts
var createSprint = async (projectId, payload, user, organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const orgnizationRole = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });
  if (!orgnizationRole) {
    throw new Error("Organization not found");
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const existUser = await prisma.user.findUnique({
    where: { id: user.userId }
  });
  if (!existUser) {
    throw new Error("User not found");
  }
  if (existUser.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;
  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (membership) {
      isProjectManager = true;
    }
  }
  if (!isOrgAdmin && !isProjectManager) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  }
  const sprint = await prisma.sprint.create({
    data: {
      ...payload,
      projectId,
      createdById: user.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.CREATED,
    entityType: "SPRINT",
    entityId: sprint.id,
    description: `Sprint ${sprint.name} created`
  });
  return sprint;
};
var getAllSprints = async (projectId, user, organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprints = await prisma.sprint.findMany({
    where: {
      projectId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return sprints;
};
var getSrintById = async (projectId, sprintId, user, organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId, projectId },
    include: {
      tasks: true
      // might need pagination later
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  return sprint;
};
var updateSprint = async (projectId, sprintId, payload, user, organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const orgnization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });
  if (!orgnization) {
    throw new Error("Organization not found");
  }
  const existUser = await prisma.user.findUnique({
    where: { id: user.userId }
  });
  if (!existUser) {
    throw new Error("User not found");
  }
  if (existUser.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (existUser.status === UserStatus.DELETED || existUser.isDeleted === true) {
    throw new Error("User is deleted");
  }
  if (existUser.isActive === false) {
    throw new Error("User is inactive");
  }
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;
  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (membership) {
      isProjectManager = true;
    }
  }
  if (!isOrgAdmin && !isProjectManager) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  }
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
      projectId
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const updatedSprint = await prisma.sprint.update({
    where: {
      id: sprintId,
      projectId
    },
    data: {
      ...payload,
      projectId,
      createdById: user.userId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.UPDATED,
    entityType: "SPRINT",
    entityId: updatedSprint.id,
    description: `Sprint ${updatedSprint.name} updated`
  });
  return updatedSprint;
};
var deleteSprint = async (projectId, sprintId, user, organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
  const orgnization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });
  if (!orgnization) {
    throw new Error("Organization not found");
  }
  const existUser = await prisma.user.findUnique({
    where: { id: user.userId }
  });
  if (!existUser) {
    throw new Error("User not found");
  }
  if (existUser.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (existUser.status === UserStatus.DELETED || existUser.isDeleted === true) {
    throw new Error("User is deleted");
  }
  if (existUser.isActive === false) {
    throw new Error("User is inactive");
  }
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;
  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (membership) {
      isProjectManager = true;
    }
  }
  if (!isOrgAdmin && !isProjectManager) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId
        }
      }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  }
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
      projectId
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const result = await prisma.sprint.delete({
    where: {
      id: sprintId,
      projectId
    }
  });
  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.DELETED,
    entityType: "SPRINT",
    entityId: sprintId,
    description: `Sprint ${sprint.name} deleted`
  });
  return result;
};
var SprintService = {
  createSprint,
  getSrintById,
  updateSprint,
  deleteSprint,
  getAllSprints
};

// src/app/module/sprint/sprint.controller.ts
var createSprint2 = catchAsync(async (req, res) => {
  const result = await SprintService.createSprint(req.params.projectId, req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.CREATED,
    message: "Sprint created successfully",
    data: result
  });
});
var getAllSprints2 = catchAsync(async (req, res) => {
  const result = await SprintService.getAllSprints(req.params.projectId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Sprints retrieved successfully",
    data: result
  });
});
var getSprintById = catchAsync(async (req, res) => {
  const result = await SprintService.getSrintById(req.params.projectId, req.params.sprintId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Sprint retrieved successfully",
    data: result
  });
});
var updateSprint2 = catchAsync(async (req, res) => {
  const result = await SprintService.updateSprint(req.params.projectId, req.params.sprintId, req.body, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Sprint updated successfully",
    data: result
  });
});
var deleteSprint2 = catchAsync(async (req, res) => {
  const result = await SprintService.deleteSprint(req.params.projectId, req.params.sprintId, req.user, req.params.organizationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Sprint deleted successfully",
    data: result
  });
});
var SprintController = {
  createSprint: createSprint2,
  getAllSprints: getAllSprints2,
  getSprintById,
  updateSprint: updateSprint2,
  deleteSprint: deleteSprint2
};

// src/app/module/sprint/sprint.validation.ts
import { z as z6 } from "zod";
var createSprintZodSchema = z6.object({
  body: z6.object({
    name: z6.string().min(1, "Name must be at least 1 character").max(255),
    goal: z6.string().max(1e3).optional(),
    startDate: z6.string().datetime().optional(),
    endDate: z6.string().datetime().optional()
  })
});
var updateSprintZodSchema = z6.object({
  body: z6.object({
    name: z6.string().min(1).max(255).optional(),
    goal: z6.string().max(1e3).optional(),
    startDate: z6.string().datetime().optional(),
    endDate: z6.string().datetime().optional(),
    status: z6.nativeEnum(SprintStatus).optional()
  })
});
var SprintValidation = {
  createSprintZodSchema,
  updateSprintZodSchema
};

// src/app/module/sprint/sprint.route.ts
var router6 = Router5({ mergeParams: true });
var ALL_ROLES2 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router6.post("/organizations/:organizationId/projects/:projectId/create-sprint", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(SprintValidation.createSprintZodSchema), SprintController.createSprint);
router6.get("/organizations/:organizationId/projects/:projectId/get-all-sprints", auth({ organizationRoles: ALL_ROLES2 }), SprintController.getAllSprints);
router6.get("/organizations/:organizationId/projects/:projectId/get-sprint/:sprintId", auth({ organizationRoles: ALL_ROLES2 }), SprintController.getSprintById);
router6.patch("/organizations/:organizationId/projects/:projectId/update-sprint/:sprintId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(SprintValidation.updateSprintZodSchema), SprintController.updateSprint);
router6.delete("/organizations/:organizationId/projects/:projectId/delete-sprint/:sprintId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), SprintController.deleteSprint);
var SprintRoutes = router6;

// src/app/module/task/task.route.ts
import { Router as Router6 } from "express";

// src/app/module/task/task.service.ts
var TaskService = class {
  static async verifyProjectAccess(projectId, organizationId, user) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, organizationId }
    });
    if (!project) {
      throw new Error("Project not found");
    }
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    let isProjectManager = false;
    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.userId } }
      });
      if (membership) {
        isProjectManager = true;
      }
    }
    if (!isOrgAdmin && !isProjectManager) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.userId } }
      });
      if (!membership) {
        throw new Error("You do not have access to this project");
      }
    }
    return { project, isOrgAdmin, isProjectManager };
  }
  static async createTask(projectId, payload, user, organizationId) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);
    if (!isOrgAdmin && !isProjectManager) {
      throw new Error("Only organization admins and project managers can create tasks");
    }
    if (payload.assigneeId) {
      const assigneeMembership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: payload.assigneeId } }
      });
      if (!assigneeMembership) {
        throw new Error("Assignee is not a member of this project");
      }
    }
    if (payload.sprintId) {
      const sprint = await prisma.sprint.findUnique({
        where: { id: payload.sprintId, projectId }
      });
      if (!sprint) {
        throw new Error("Sprint not found in this project");
      }
    }
    const task = await prisma.task.create({
      data: {
        ...payload,
        projectId,
        createdById: user.userId
      }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.CREATED,
      entityType: "TASK",
      entityId: task.id,
      description: `Task created`
    });
    if (payload.assigneeId) {
      await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: ActivityAction.ASSIGNED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { assigneeId: payload.assigneeId },
        description: `Task assigned upon creation`
      });
    }
    return task;
  }
  static async getAllTasks(projectId, user, organizationId) {
    await this.verifyProjectAccess(projectId, organizationId, user);
    return await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });
  }
  static async getTaskById(projectId, taskId, user, organizationId) {
    await this.verifyProjectAccess(projectId, organizationId, user);
    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        subtasks: true
      }
    });
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }
  static async updateTask(projectId, taskId, payload, user, organizationId) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);
    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId }
    });
    if (!task) {
      throw new Error("Task not found");
    }
    const isAssignee = task.assigneeId === user.userId;
    const canManage = isOrgAdmin || isProjectManager;
    if (!canManage && !isAssignee) {
      throw new Error("You don't have permission to update this task");
    }
    if (!canManage) {
      if (payload.assigneeId !== void 0 && payload.assigneeId !== task.assigneeId) {
        throw new Error("You don't have permission to reassign this task");
      }
      if (payload.sprintId !== void 0 && payload.sprintId !== task.sprintId) {
        throw new Error("You don't have permission to move this task to a different sprint");
      }
    } else {
      if (payload.assigneeId && payload.assigneeId !== task.assigneeId) {
        const assigneeMembership = await prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId, userId: payload.assigneeId } }
        });
        if (!assigneeMembership) {
          throw new Error("Assignee is not a member of this project");
        }
      }
      if (payload.sprintId && payload.sprintId !== task.sprintId) {
        const sprint = await prisma.sprint.findUnique({
          where: { id: payload.sprintId, projectId }
        });
        if (!sprint) {
          throw new Error("Sprint not found in this project");
        }
      }
    }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: payload
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.UPDATED,
      entityType: "TASK",
      entityId: task.id,
      description: `Task updated`
    });
    if (payload.status !== void 0 && payload.status !== task.status) {
      await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: ActivityAction.STATUS_CHANGED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { oldStatus: task.status, newStatus: payload.status },
        description: `Task status changed`
      });
    }
    if (payload.assigneeId !== void 0 && payload.assigneeId !== task.assigneeId) {
      await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: payload.assigneeId ? ActivityAction.ASSIGNED : ActivityAction.UNASSIGNED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { newAssigneeId: payload.assigneeId, oldAssigneeId: task.assigneeId },
        description: `Task assignment changed`
      });
    }
    return updatedTask;
  }
  static async deleteTask(projectId, taskId, user, organizationId) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);
    if (!isOrgAdmin && !isProjectManager) {
      throw new Error("Only organization admins and project managers can delete tasks");
    }
    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId }
    });
    if (!task) {
      throw new Error("Task not found");
    }
    await prisma.task.delete({
      where: { id: taskId }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.DELETED,
      entityType: "TASK",
      entityId: taskId,
      description: `Task ${task.title} deleted`
    });
    return task;
  }
};

// src/app/module/task/task.controller.ts
import httpStatus9 from "http-status";
var createTask = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.params.projectId, req.body, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus9.CREATED, message: "Task created successfully", data: result });
});
var getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskService.getAllTasks(req.params.projectId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus9.OK, message: "Tasks retrieved successfully", data: result });
});
var getTaskById = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskById(req.params.projectId, req.params.taskId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus9.OK, message: "Task retrieved successfully", data: result });
});
var updateTask = catchAsync(async (req, res) => {
  const result = await TaskService.updateTask(req.params.projectId, req.params.taskId, req.body, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus9.OK, message: "Task updated successfully", data: result });
});
var deleteTask = catchAsync(async (req, res) => {
  const result = await TaskService.deleteTask(req.params.projectId, req.params.taskId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus9.OK, message: "Task deleted successfully", data: result });
});
var TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};

// src/app/module/task/task.validation.ts
import { z as z7 } from "zod";
var createTaskSchema = z7.object({
  body: z7.object({
    sprintId: z7.string().uuid().optional(),
    parentTaskId: z7.string().uuid().optional(),
    title: z7.string().min(1).max(255),
    description: z7.string().max(2e3).optional(),
    status: z7.nativeEnum(TaskStatus).optional(),
    priority: z7.nativeEnum(Priority).optional(),
    assigneeId: z7.string().uuid().optional(),
    position: z7.number().optional(),
    dueDate: z7.string().datetime().optional(),
    estimatedHours: z7.number().min(0).optional()
  })
});
var updateTaskSchema = z7.object({
  body: z7.object({
    sprintId: z7.string().uuid().optional().nullable(),
    parentTaskId: z7.string().uuid().optional().nullable(),
    title: z7.string().min(1).max(255).optional(),
    description: z7.string().max(2e3).optional().nullable(),
    status: z7.nativeEnum(TaskStatus).optional(),
    priority: z7.nativeEnum(Priority).optional(),
    assigneeId: z7.string().uuid().optional().nullable(),
    dueDate: z7.string().datetime().optional().nullable(),
    position: z7.number().optional(),
    estimatedHours: z7.number().min(0).optional().nullable()
  })
});

// src/app/module/task/task.route.ts
var router7 = Router6({ mergeParams: true });
var ALL_ROLES3 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router7.post("/organizations/:organizationId/projects/:projectId/create-tasks", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(createTaskSchema), TaskController.createTask);
router7.get("/organizations/:organizationId/projects/:projectId/get-all-tasks", auth({ organizationRoles: ALL_ROLES3 }), TaskController.getAllTasks);
router7.get("/organizations/:organizationId/projects/:projectId/get-task/:taskId", auth({ organizationRoles: ALL_ROLES3 }), TaskController.getTaskById);
router7.patch("/organizations/:organizationId/projects/:projectId/update-task/:taskId", auth({ organizationRoles: ALL_ROLES3 }), validationRequest(updateTaskSchema), TaskController.updateTask);
router7.delete("/organizations/:organizationId/projects/:projectId/delete-task/:taskId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), TaskController.deleteTask);
var TaskRoutes = router7;

// src/app/module/label/label.route.ts
import { Router as Router7 } from "express";

// src/app/module/label/label.service.ts
var LabelService = class {
  static async createLabel(organizationId, payload, user) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can create labels");
    }
    const existingLabel = await prisma.label.findUnique({
      where: { organizationId_name: { organizationId, name: payload.name } }
    });
    if (existingLabel) {
      throw new Error("Label with this name already exists in the organization");
    }
    return await prisma.label.create({
      data: {
        ...payload,
        organizationId
      }
    });
  }
  static async getAllLabels(organizationId) {
    return await prisma.label.findMany({
      where: { organizationId },
      orderBy: { name: "asc" }
    });
  }
  static async updateLabel(organizationId, labelId, payload, user) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can update labels");
    }
    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });
    if (!label) throw new Error("Label not found");
    if (payload.name && payload.name !== label.name) {
      const existingLabel = await prisma.label.findUnique({
        where: { organizationId_name: { organizationId, name: payload.name } }
      });
      if (existingLabel) {
        throw new Error("Label with this name already exists");
      }
    }
    return await prisma.label.update({
      where: { id: labelId },
      data: payload
    });
  }
  static async deleteLabel(organizationId, labelId, user) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can delete labels");
    }
    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });
    if (!label) throw new Error("Label not found");
    return await prisma.label.delete({
      where: { id: labelId }
    });
  }
  static async assignLabelToTask(organizationId, labelId, payload, user) {
    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });
    if (!label) throw new Error("Label not found");
    const task = await prisma.task.findUnique({
      where: { id: payload.taskId },
      include: { project: true }
    });
    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    let isProjectManager = false;
    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
      });
      if (membership) {
        isProjectManager = true;
      }
    }
    const canManage = isOrgAdmin || isProjectManager;
    const isAssignee = task.assigneeId === user.userId;
    if (!canManage && !isAssignee) {
      throw new Error("You do not have permission to assign labels to this task");
    }
    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId: task.id, labelId } }
    });
    if (existingTaskLabel) return existingTaskLabel;
    return await prisma.taskLabel.create({
      data: {
        taskId: task.id,
        labelId
      }
    });
  }
  static async removeLabelFromTask(organizationId, labelId, taskId, user) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });
    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    let isProjectManager = false;
    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
      });
      if (membership) {
        isProjectManager = true;
      }
    }
    const canManage = isOrgAdmin || isProjectManager;
    const isAssignee = task.assigneeId === user.userId;
    if (!canManage && !isAssignee) {
      throw new Error("You do not have permission to remove labels from this task");
    }
    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } }
    });
    if (!existingTaskLabel) {
      throw new Error("Label is not assigned to this task");
    }
    return await prisma.taskLabel.delete({
      where: { taskId_labelId: { taskId, labelId } }
    });
  }
};

// src/app/module/label/label.controller.ts
import httpStatus10 from "http-status";
var createLabel = catchAsync(async (req, res) => {
  const result = await LabelService.createLabel(req.params.organizationId, req.body, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus10.CREATED, message: "Label created successfully", data: result });
});
var getAllLabels = catchAsync(async (req, res) => {
  const result = await LabelService.getAllLabels(req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus10.OK, message: "Labels retrieved successfully", data: result });
});
var updateLabel = catchAsync(async (req, res) => {
  const result = await LabelService.updateLabel(req.params.organizationId, req.params.labelId, req.body, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus10.OK, message: "Label updated successfully", data: result });
});
var deleteLabel = catchAsync(async (req, res) => {
  const result = await LabelService.deleteLabel(req.params.organizationId, req.params.labelId, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus10.OK, message: "Label deleted successfully", data: result });
});
var assignLabel = catchAsync(async (req, res) => {
  const result = await LabelService.assignLabelToTask(req.params.organizationId, req.params.labelId, req.body, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus10.CREATED, message: "Label assigned successfully", data: result });
});
var removeLabel = catchAsync(async (req, res) => {
  const result = await LabelService.removeLabelFromTask(req.params.organizationId, req.params.labelId, req.params.taskId, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus10.OK, message: "Label removed successfully", data: result });
});
var LabelController = {
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
  assignLabel,
  removeLabel
};

// src/app/module/label/label.validation.ts
import { z as z8 } from "zod";
var createLabelSchema = z8.object({
  body: z8.object({
    name: z8.string().min(1).max(50),
    color: z8.string().max(20).optional()
  })
});
var updateLabelSchema = z8.object({
  body: z8.object({
    name: z8.string().min(1).max(50).optional(),
    color: z8.string().max(20).optional()
  })
});
var assignLabelSchema = z8.object({
  body: z8.object({
    taskId: z8.string().uuid()
  })
});

// src/app/module/label/label.route.ts
var router8 = Router7({ mergeParams: true });
var ALL_ROLES4 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router8.post("/organizations/:organizationId/create-labels", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(createLabelSchema), LabelController.createLabel);
router8.get("/organizations/:organizationId/get-all-labels", auth({ organizationRoles: ALL_ROLES4 }), LabelController.getAllLabels);
router8.patch("/organizations/:organizationId/update-label/:labelId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(updateLabelSchema), LabelController.updateLabel);
router8.delete("/organizations/:organizationId/labels/:labelId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), LabelController.deleteLabel);
router8.post("/organizations/:organizationId/labels/:labelId/assign", auth({ organizationRoles: ALL_ROLES4 }), validationRequest(assignLabelSchema), LabelController.assignLabel);
router8.delete("/organizations/:organizationId/labels/:labelId/tasks/:taskId/remove", auth({ organizationRoles: ALL_ROLES4 }), LabelController.removeLabel);
var LabelRoutes = router8;

// src/app/module/comment/comment.route.ts
import { Router as Router8 } from "express";

// src/app/module/comment/comment.service.ts
var CommentService = class {
  static async verifyTaskAccess(taskId, organizationId, user) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });
    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    let isProjectManager = false;
    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
      });
      if (membership) {
        isProjectManager = true;
      }
    }
    if (!isOrgAdmin && !isProjectManager) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
      });
      if (!membership) {
        throw new Error("You do not have access to this project's tasks");
      }
    }
    return { task, isOrgAdmin, isProjectManager };
  }
  static async createComment(taskId, payload, user, organizationId) {
    const { task } = await this.verifyTaskAccess(taskId, organizationId, user);
    const comment = await prisma.comment.create({
      data: {
        content: payload.content,
        taskId,
        userId: user.userId
      }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.COMMENTED,
      entityType: "TASK",
      entityId: taskId,
      metadata: { commentId: comment.id },
      description: `Added a comment to task`
    });
    return comment;
  }
  static async getComments(taskId, user, organizationId) {
    await this.verifyTaskAccess(taskId, organizationId, user);
    return await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
  }
  static async updateComment(commentId, payload, user, organizationId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true }
    });
    if (!comment) throw new Error("Comment not found");
    await this.verifyTaskAccess(comment.taskId, organizationId, user);
    if (comment.userId !== user.userId) {
      throw new Error("You can only edit your own comments");
    }
    return await prisma.comment.update({
      where: { id: commentId },
      data: payload
    });
  }
  static async deleteComment(commentId, user, organizationId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true }
    });
    if (!comment) throw new Error("Comment not found");
    const { isOrgAdmin, isProjectManager } = await this.verifyTaskAccess(comment.taskId, organizationId, user);
    const canDelete = comment.userId === user.userId || isOrgAdmin || isProjectManager;
    if (!canDelete) {
      throw new Error("You do not have permission to delete this comment");
    }
    return await prisma.comment.delete({
      where: { id: commentId }
    });
  }
};

// src/app/module/comment/comment.controller.ts
import httpStatus11 from "http-status";
var createComment = catchAsync(async (req, res) => {
  const result = await CommentService.createComment(req.params.taskId, req.body, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus11.CREATED, message: "Comment created successfully", data: result });
});
var getComments = catchAsync(async (req, res) => {
  const result = await CommentService.getComments(req.params.taskId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus11.OK, message: "Comments retrieved successfully", data: result });
});
var updateComment = catchAsync(async (req, res) => {
  const result = await CommentService.updateComment(req.params.commentId, req.body, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus11.OK, message: "Comment updated successfully", data: result });
});
var deleteComment = catchAsync(async (req, res) => {
  const result = await CommentService.deleteComment(req.params.commentId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus11.OK, message: "Comment deleted successfully", data: result });
});
var CommentController = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};

// src/app/module/comment/comment.validation.ts
import { z as z9 } from "zod";
var createCommentSchema = z9.object({
  body: z9.object({
    content: z9.string().min(1, "Content cannot be empty").max(5e3)
  })
});
var updateCommentSchema = z9.object({
  body: z9.object({
    content: z9.string().min(1).max(5e3).optional()
  })
});

// src/app/module/comment/comment.route.ts
var router9 = Router8({ mergeParams: true });
var ALL_ROLES5 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router9.post("/organizations/:organizationId/projects/:projectId/tasks/:taskId/create-comments", auth({ organizationRoles: ALL_ROLES5 }), validationRequest(createCommentSchema), CommentController.createComment);
router9.get("/organizations/:organizationId/projects/:projectId/tasks/:taskId/get-comments", auth({ organizationRoles: ALL_ROLES5 }), CommentController.getComments);
router9.patch("/organizations/:organizationId/projects/:projectId/update-comments/:commentId", auth({ organizationRoles: ALL_ROLES5 }), validationRequest(updateCommentSchema), CommentController.updateComment);
router9.delete("/organizations/:organizationId/projects/:projectId/delete-comments/:commentId", auth({ organizationRoles: ALL_ROLES5 }), CommentController.deleteComment);
var CommentRoutes = router9;

// src/app/module/attachment/attachment.route.ts
import { Router as Router9 } from "express";

// src/app/utils/cloudinary.ts
import { v2 as cloudinary2 } from "cloudinary";
import multer2 from "multer";
import streamifier2 from "streamifier";
cloudinary2.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var uploadToCloudinary2 = (fileBuffer, folder = "attachments") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary2.uploader.upload_stream(
      {
        folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier2.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
var deleteFromCloudinary2 = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary2.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
var storage2 = multer2.memoryStorage();
var upload2 = multer2({ storage: storage2 });

// src/app/module/attachment/attachment.service.ts
var AttachmentService = class {
  /**
   * Verify if the user has view/upload access to the task's attachments.
   * Enforces: Task access -> Project access -> Organization membership
   */
  static async verifyTaskAccess(taskId, organizationId, user) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });
    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    const projectMembership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
    });
    if (!isOrgAdmin && !projectMembership) {
      throw new Error("You do not have access to this project's tasks");
    }
    const isProjectManager = user.organizationRole === OrganizationRole.PROJECT_MANAGER && !!projectMembership;
    const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD;
    return { task, isOrgAdmin, isProjectManager, isTeamLead };
  }
  static async uploadAttachments(taskId, files, user, organizationId) {
    await this.verifyTaskAccess(taskId, organizationId, user);
    const attachments = await Promise.all(
      files.map(async (file) => {
        const cloudinaryResult = await uploadToCloudinary2(file.buffer);
        return prisma.attachment.create({
          data: {
            originalName: file.originalname,
            fileName: cloudinaryResult.original_filename || file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: cloudinaryResult.secure_url,
            storageKey: cloudinaryResult.public_id,
            taskId,
            organizationId,
            uploadedById: user.userId
          }
        });
      })
    );
    const fileNames = attachments.map((a) => a.originalName).join(", ");
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.ATTACHED,
      entityType: "TASK",
      entityId: taskId,
      description: `Uploaded attachments: ${fileNames}`
    });
    return attachments;
  }
  static async getAttachments(taskId, user, organizationId) {
    await this.verifyTaskAccess(taskId, organizationId, user);
    return await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, avatar: true } }
      }
    });
  }
  static async deleteAttachment(attachmentId, user, organizationId) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId, organizationId }
    });
    if (!attachment) throw new Error("Attachment not found");
    const { isOrgAdmin, isProjectManager, isTeamLead } = await this.verifyTaskAccess(attachment.taskId, organizationId, user);
    let canDelete = false;
    if (attachment.uploadedById === user.userId) {
      canDelete = true;
    } else if (isOrgAdmin) {
      canDelete = true;
    } else if (isProjectManager) {
      canDelete = true;
    } else if (isTeamLead) {
      const uploaderTeams = await prisma.teamMember.findMany({
        where: { userId: attachment.uploadedById },
        include: { team: true }
      });
      const leadsUploaderTeam = uploaderTeams.some((tm) => tm.team.teamLeadId === user.userId);
      if (leadsUploaderTeam) {
        canDelete = true;
      }
    }
    if (!canDelete) {
      throw new Error("You do not have permission to delete this attachment");
    }
    if (attachment.storageKey) {
      await deleteFromCloudinary2(attachment.storageKey);
    }
    const deleted = await prisma.attachment.delete({
      where: { id: attachmentId }
    });
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.DETACHED,
      entityType: "TASK",
      entityId: attachment.taskId,
      description: `Deleted attachment ${attachment.originalName}`
    });
    return deleted;
  }
};

// src/app/module/attachment/attachment.controller.ts
import httpStatus12 from "http-status";
var uploadAttachments = catchAsync(async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new Error("Files are required");
  }
  const result = await AttachmentService.uploadAttachments(req.params.taskId, req.files, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus12.CREATED, message: "Attachments uploaded successfully", data: result });
});
var getAttachments = catchAsync(async (req, res) => {
  const result = await AttachmentService.getAttachments(req.params.taskId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus12.OK, message: "Attachments retrieved successfully", data: result });
});
var deleteAttachment = catchAsync(async (req, res) => {
  const result = await AttachmentService.deleteAttachment(req.params.attachmentId, req.user, req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus12.OK, message: "Attachment deleted successfully", data: result });
});
var AttachmentController = {
  uploadAttachments,
  getAttachments,
  deleteAttachment
};

// src/app/module/attachment/attachment.validation.ts
import { z as z10 } from "zod";
var ALLOWED_MULTI_TYPES3 = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4"],
  video: ["video/mp4", "video/quicktime", "video/x-matroska"]
};
var singleFileEngine3 = (allowedTypes, maxMB) => {
  return z10.object({
    fieldname: z10.string(),
    originalname: z10.string(),
    encoding: z10.string(),
    mimetype: z10.string().refine(
      (type) => allowedTypes.includes(type),
      { message: `Invalid format. Expected: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}` }
    ),
    size: z10.number().max(maxMB * 1024 * 1024, `Size exceeds limit of ${maxMB}MB`)
  });
};
var createAttachmentSchema = z10.object({
  files: z10.array(singleFileEngine3([...ALLOWED_MULTI_TYPES3.image, ...ALLOWED_MULTI_TYPES3.pdf, ...ALLOWED_MULTI_TYPES3.document, ...ALLOWED_MULTI_TYPES3.audio, ...ALLOWED_MULTI_TYPES3.video], 10)).max(10, "Only 10 files allowed")
});
var AttachmentValidation = {
  createAttachmentSchema
};

// src/app/module/attachment/attachment.route.ts
var router10 = Router9({ mergeParams: true });
var ALL_ROLES6 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router10.post(
  "/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments",
  auth({ organizationRoles: ALL_ROLES6 }),
  upload2.array("files"),
  validationRequest(AttachmentValidation.createAttachmentSchema),
  AttachmentController.uploadAttachments
);
router10.get("/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments", auth({ organizationRoles: ALL_ROLES6 }), AttachmentController.getAttachments);
router10.delete("/organizations/:organizationId/projects/:projectId/tasks/attachments/:attachmentId", auth({ organizationRoles: ALL_ROLES6 }), AttachmentController.deleteAttachment);
var AttachmentRoutes = router10;

// src/app/module/activity/activity.route.ts
import { Router as Router10 } from "express";

// src/app/module/activity/activity.controller.ts
import httpStatus13 from "http-status";
var getOrganizationActivities2 = catchAsync(async (req, res, next) => {
  const result = await ActivityService.getOrganizationActivities(req.params.organizationId, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus13.OK,
    message: "Activities retrieved successfully",
    data: result
  });
});
var getEntityActivities2 = catchAsync(async (req, res, next) => {
  const result = await ActivityService.getEntityActivities(req.params.organizationId, req.params.entityType, req.params.entityId, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus13.OK,
    message: "Activities retrieved successfully",
    data: result
  });
});
var ActivityController = {
  getOrganizationActivities: getOrganizationActivities2,
  getEntityActivities: getEntityActivities2
};

// src/app/module/activity/activity.route.ts
var router11 = Router10({ mergeParams: true });
var ALL_ROLES7 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router11.get("/organizations/:organizationId/get-activities", auth({ organizationRoles: ALL_ROLES7 }), ActivityController.getOrganizationActivities);
router11.get("/organizations/:organizationId/activities/:entityType/:entityId", auth({ organizationRoles: ALL_ROLES7 }), ActivityController.getEntityActivities);
var ActivityRoutes = router11;

// src/app/module/notification/notification.route.ts
import { Router as Router11 } from "express";

// src/app/module/notification/notification.service.ts
var NotificationService = class {
  static async createNotification(payload) {
    try {
      return await prisma.notification.create({
        data: {
          ...payload,
          metadata: payload.metadata ? JSON.parse(JSON.stringify(payload.metadata)) : void 0
        }
      });
    } catch (error) {
      console.error("Failed to create notification", error);
    }
  }
  static async getMyNotifications(organizationId, user) {
    return await prisma.notification.findMany({
      where: { organizationId, userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
  static async markAsRead(organizationId, notificationIds, user) {
    return await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: user.userId,
        organizationId
      },
      data: {
        readAt: /* @__PURE__ */ new Date()
      }
    });
  }
  static async markAllAsRead(organizationId, user) {
    return await prisma.notification.updateMany({
      where: {
        userId: user.userId,
        organizationId,
        readAt: null
      },
      data: {
        readAt: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/app/module/notification/notification.controller.ts
import httpStatus14 from "http-status";
var getMyNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getMyNotifications(req.params.organizationId, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus14.OK, message: "Notifications retrieved successfully", data: result });
});
var markAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAsRead(req.params.organizationId, req.body.notificationIds, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus14.OK, message: "Notifications marked as read", data: result });
});
var markAllAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAllAsRead(req.params.organizationId, req.user);
  sendResponse(res, { success: true, statusCode: httpStatus14.OK, message: "All notifications marked as read", data: result });
});
var NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead
};

// src/app/module/notification/notification.validation.ts
import { z as z11 } from "zod";
var markReadSchema = z11.object({
  body: z11.object({
    notificationIds: z11.array(z11.string().uuid())
  })
});

// src/app/module/notification/notification.route.ts
var router12 = Router11({ mergeParams: true });
var ALL_ROLES8 = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];
router12.get("/", auth({ organizationRoles: ALL_ROLES8 }), NotificationController.getMyNotifications);
router12.patch("/read", auth({ organizationRoles: ALL_ROLES8 }), validationRequest(markReadSchema), NotificationController.markAsRead);
router12.patch("/read-all", auth({ organizationRoles: ALL_ROLES8 }), NotificationController.markAllAsRead);
var NotificationRoutes = router12;

// src/app/module/organizationbilling/organizationbilling.route.ts
import { Router as Router12 } from "express";

// src/app/module/organizationbilling/organizationbilling.controller.ts
import httpStatus15 from "http-status";
var getBillingOverview = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.getBillingOverview(req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Billing overview retrieved", data: result });
});
var getUsage = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.getUsage(req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Usage retrieved", data: result });
});
var getInvoices = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.getInvoices(req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Invoices retrieved", data: result });
});
var getPayments = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.getPayments(req.params.organizationId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Payments retrieved", data: result });
});
var requestUpgrade = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.requestUpgrade(req.params.organizationId, req.body, req.user.userId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Upgrade requested", data: result });
});
var requestDowngrade = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.requestDowngrade(req.params.organizationId, req.body, req.user.userId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Downgrade requested", data: result });
});
var cancelSubscription = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.cancelSubscription(req.params.organizationId, req.user.userId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Subscription cancelled", data: result });
});
var resumeSubscription = catchAsync(async (req, res) => {
  const result = await OrganizationBillingService.resumeSubscription(req.params.organizationId, req.user.userId);
  sendResponse(res, { success: true, statusCode: httpStatus15.OK, message: "Subscription resumed", data: result });
});
var OrganizationBillingController = {
  getBillingOverview,
  getUsage,
  getInvoices,
  getPayments,
  requestUpgrade,
  requestDowngrade,
  cancelSubscription,
  resumeSubscription
};

// src/app/module/organizationbilling/organizationbilling.validation.ts
import { z as z12 } from "zod";
var upgradePlanSchema = z12.object({
  body: z12.object({
    planId: z12.string().min(1, "Plan ID is required"),
    interval: z12.nativeEnum(BillingInterval).optional()
  })
});

// src/app/module/organizationbilling/organizationbilling.route.ts
var router13 = Router12({ mergeParams: true });
router13.post("/organizations/:organizationId/upgrade-billing", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestUpgrade);
router13.get("/organizations/:organizationId/get-billing", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), OrganizationBillingController.getBillingOverview);
router13.get("/organizations/:organizationId/usage", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), OrganizationBillingController.getUsage);
router13.get("/organizations/:organizationId/invoices", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.getInvoices);
router13.get("/organizations/:organizationId/payments", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.getPayments);
router13.post("/organizations/:organizationId/downgrade", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestDowngrade);
router13.post("/organizations/:organizationId/cancel", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.cancelSubscription);
router13.post("/organizations/:organizationId/resume", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.resumeSubscription);
var OrganizationBillingRoutes = router13;

// src/app/module/adminbilling/adminbilling.route.ts
import { Router as Router13 } from "express";

// src/app/module/adminbilling/adminbilling.service.ts
var AdminBillingService = class {
  static async getPlans() {
    return prisma.plan.findMany();
  }
  static async getAllSubscriptions() {
    return prisma.subscription.findMany({ include: { plan: true, organization: true } });
  }
  static async getPendingPayments() {
    return prisma.payment.findMany({ where: { status: PaymentStatus.PENDING }, include: { invoice: true, organization: true } });
  }
  static async getPaymentById(paymentId) {
    return prisma.payment.findUnique({ where: { id: paymentId }, include: { invoice: true, organization: true } });
  }
  static async getAllPayments() {
    return prisma.payment.findMany({ include: { invoice: true, organization: true }, orderBy: { createdAt: "desc" } });
  }
  static async executeBkashCallback(paymentID, status) {
    if (status === "cancel" || status === "failure") {
      await prisma.payment.updateMany({
        where: { transactionId: paymentID },
        data: { status: PaymentStatus.FAILED, failureReason: "User cancelled or failed" }
      });
      return { success: false, message: "Payment cancelled or failed" };
    }
    if (status === "success") {
      const executeResult = await executeBkashPayment(paymentID);
      const payment = await prisma.payment.findUnique({
        where: { transactionId: paymentID },
        include: { invoice: true }
      });
      if (!payment) throw new Error("Payment not found for transaction: " + paymentID);
      const invoice = payment.invoice;
      const subscription = await prisma.subscription.findUnique({
        where: { id: invoice.subscriptionId }
      });
      if (!subscription) throw new Error("Subscription not found");
      let planId;
      let interval;
      const intentRaw = await redisClient.get(`bkash_intent:${paymentID}`);
      console.log(`[bKash Callback] Fetched intent from Redis for payment ${paymentID}:`, intentRaw);
      if (intentRaw) {
        const intent = JSON.parse(intentRaw);
        planId = intent.planId;
        interval = intent.interval;
        console.log(`[bKash Callback] Parsed intent - planId: ${planId}, interval: ${interval}`);
      }
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.SUCCESS, verifiedAt: /* @__PURE__ */ new Date(), transactionId: executeResult.trxID }
        });
        await tx.invoice.update({
          where: { id: invoice.id },
          data: { status: InvoiceStatus.PAID }
        });
        if (planId) {
          console.log(`[bKash Callback] Updating subscription to planId: ${planId}`);
          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              status: SubscriptionStatus.ACTIVE,
              planId,
              interval: interval || BillingInterval.MONTHLY
            }
          });
        } else {
          console.log(`[bKash Callback] WARNING: No planId found to update subscription!`);
          await tx.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.ACTIVE }
          });
        }
      });
      return { success: true, message: "Payment successful" };
    }
    return { success: false, message: "Unknown status" };
  }
};

// src/app/module/adminbilling/adminbilling.controller.ts
import httpStatus16 from "http-status";
var getPlans = catchAsync(async (req, res) => {
  const result = await AdminBillingService.getPlans();
  sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: "Plans retrieved", data: result });
});
var getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await AdminBillingService.getAllSubscriptions();
  sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: "Subscriptions retrieved", data: result });
});
var getPendingPayments = catchAsync(async (req, res) => {
  const result = await AdminBillingService.getPendingPayments();
  sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: "Pending payments retrieved", data: result });
});
var getPaymentById = catchAsync(async (req, res) => {
  const result = await AdminBillingService.getPaymentById(req.params.paymentId);
  sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: "Payment retrieved", data: result });
});
var getAllPayments = catchAsync(async (req, res) => {
  const result = await AdminBillingService.getAllPayments();
  sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: "All payments retrieved", data: result });
});
var bkashCallback = catchAsync(async (req, res) => {
  const { paymentID, status } = req.query;
  const result = await AdminBillingService.executeBkashCallback(paymentID, status);
  if (result.success) {
    sendResponse(res, { success: true, statusCode: httpStatus16.OK, message: result.message, data: result });
  } else {
    sendResponse(res, { success: false, statusCode: httpStatus16.BAD_REQUEST, message: result.message, data: result });
  }
});
var AdminBillingController = {
  getPlans,
  getAllSubscriptions,
  getPendingPayments,
  getAllPayments,
  getPaymentById,
  bkashCallback
};

// src/app/module/adminbilling/adminbilling.route.ts
var adminRouter = Router13();
adminRouter.get("/plans", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPlans);
adminRouter.get("/subscriptions", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllSubscriptions);
adminRouter.get("/payments/pending", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPendingPayments);
adminRouter.get("/payments", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllPayments);
adminRouter.get("/payments/:paymentId", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPaymentById);
adminRouter.get("/bkash/callback", AdminBillingController.bkashCallback);
var AdminBillingRoutes = adminRouter;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello Dip!");
});
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/invitations", InvitationRouter);
app.use("/api/v1/organizations", OrganizationRouter);
app.use("/api/v1/projects", ProjectRouter);
app.use("/api/v1/teams", TeamRoutes);
app.use("/api/v1/sprints", SprintRoutes);
app.use("/api/v1/tasks", TaskRoutes);
app.use("/api/v1/labels", LabelRoutes);
app.use("/api/v1/comments", CommentRoutes);
app.use("/api/v1/attachments", AttachmentRoutes);
app.use("/api/v1/activities", ActivityRoutes);
app.use("/api/v1/organizations/:organizationId/notifications", NotificationRoutes);
app.use("/api/v1/billing", OrganizationBillingRoutes);
app.use("/api/v1/billing", AdminBillingRoutes);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/app/utils/seed.ts
import bcrypt2 from "bcryptjs";
var seedPlans = async () => {
  try {
    const existingPlans = await prisma.plan.findMany();
    if (existingPlans.length > 0) {
      console.log("Plans already exist. Skipping seeding.");
      return;
    }
    console.log("Start seeding...");
    const freePlan = await prisma.plan.upsert({
      where: { name: "FREE" },
      update: {},
      create: {
        name: "FREE",
        description: "Free tier with basic limits",
        priceMonthly: 0,
        priceYearly: 0,
        maxMembers: 5,
        maxTeams: 2,
        maxProjects: 2,
        maxStorageBytes: 1073741824,
        // 1 GB
        isActive: true
      }
    });
    console.log(`Created plan: ${freePlan.name}`);
    const proPlan = await prisma.plan.upsert({
      where: { name: "PRO" },
      update: {},
      create: {
        name: "PRO",
        description: "Professional tier with higher limits",
        priceMonthly: 15,
        // e.g., 1500 BDT
        priceYearly: 150,
        maxMembers: 20,
        maxTeams: 10,
        maxProjects: 10,
        maxStorageBytes: 10737418240,
        // 10 GB
        isActive: true
      }
    });
    console.log(`Created plan: ${proPlan.name}`);
    const businessPlan = await prisma.plan.upsert({
      where: { name: "BUSINESS" },
      update: {},
      create: {
        name: "BUSINESS",
        description: "Business tier with no limits",
        priceMonthly: 50,
        // e.g., 5000 BDT
        priceYearly: 500,
        maxMembers: null,
        maxTeams: null,
        maxProjects: null,
        maxStorageBytes: 53687091200,
        // 50 GB
        isActive: true
      }
    });
    console.log(`Created plan: ${businessPlan.name}`);
    console.log("Seeding finished.");
  } catch (error) {
    console.error("Error seeding plans:", error);
  }
};
var seedSupperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        platformRole: PlatformRole.SUPER_ADMIN
      }
    });
    if (isExistSuperAdmin) {
      console.log("Super Admin already exists. Skipping seeding.");
      return;
    }
    const name = config_default.super_admin_name;
    const email2 = config_default.super_admin_email;
    const password = config_default.super_admin_password;
    if (!name || !email2 || !password) {
      throw new Error("Super Admin name, email and password must be provided in the environment variables");
    }
    const hashedPassword = await bcrypt2.hash(password, Number(config_default.bcrypt_salt_rounds));
    const createSuperAdmin = await prisma.user.create({
      data: {
        name,
        email: email2,
        password: hashedPassword,
        platformRole: PlatformRole.SUPER_ADMIN,
        emailVerified: true
      },
      omit: {
        password: true
      }
    });
    console.log("Super Admin created successfully", createSuperAdmin);
  } catch (error) {
    console.log("Error while seeding super admin", error);
    await prisma.user.delete({
      where: {
        email: config_default.super_admin_email
      }
    });
  }
};

// src/server.ts
BigInt.prototype.toJSON = function() {
  return this.toString();
};
var PORT = config_default.port;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    await redisClient.connect();
    console.log("Connected to the redis successfully");
    await seedPlans();
    await seedSupperAdmin();
    app_default.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.js.map