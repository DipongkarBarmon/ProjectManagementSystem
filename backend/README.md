# Project Management SaaS Backend

REST API for multi-tenant project management, team collaboration, task tracking, notifications, and subscription billing.

## Project Links

- Live application: https://project-management-saas-lemon.vercel.app/
- GitHub repository: https://github.com/DipongkarBarmon/projectmanagementsaasBackend
- Database schema: https://drawsql.app/teams/dipongkor-barman/diagrams/projectmanagementsaas
- API collection/documentation: https://documenter.getpostman.com/view/49229029/2sBYB4LSM1
- Demo videos: https://drive.google.com/drive/folders/1rz3BCEiFlrWSWmwzdHE9QaZ3RC0AfNDL?usp=sharing

## Features

- JWT access and refresh token authentication
- Email verification, password reset, and Google authentication
- Multi-tenant organizations with role-based access control
- Organization invitations, teams, project members, sprints, and tasks
- Task comments, labels, file attachments, activities, and notifications
- Subscription plans, usage limits, invoices, and payment history
- bKash Tokenized Checkout integration
- PostgreSQL persistence through Prisma ORM 7
- Redis, Cloudinary, SMTP, and Vercel support

## Technology Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Validation | Zod |
| Authentication | JWT and bcryptjs |
| File storage | Cloudinary |
| Cache | Redis |
| Email | Nodemailer and SMTP |
| Payments | bKash Tokenized Checkout |
| Deployment | Vercel |

## Roles

- `SUPER_ADMIN`: platform-level billing and payment administration.
- `ORG_ADMIN`: organization administration, members, projects, teams, and billing.
- `PROJECT_MANAGER`: project delivery, teams, sprints, tasks, and labels.
- `TEAM_LEAD`: team management and project collaboration.
- `MEMBER`: assigned work and organization collaboration.
- `GUEST`: limited access where supported by the authorization layer.

Protected requests use:

```http
Authorization: Bearer <access-token>
```

## Project Structure

```text
.
├── biome.json
├── package.json
├── prisma7.config.ts
├── README.md
├── tsconfig.json
├── tsup.config.ts
├── vercel.json
├── generated/
│   └── prisma/
│       ├── browser.ts
│       ├── client.ts
│       ├── commonInputTypes.ts
│       ├── enums.ts
│       ├── models.ts
│       ├── internal/
│       └── models/
prisma/
├── migrations/
│   ├── migration_lock.toml
│   └── <timestamped migration directories>/
└── schema/
    ├── schema.prisma
    ├── enum.prisma
    ├── user.prisma
    ├── organization.prisma
    ├── organizationMamber.prisma
    ├── project.prisma
    ├── projectMember.prisma
    ├── team.prisma
    ├── teamMember.prisma
    ├── sprint.prisma
    ├── task.prisma
    ├── taskLabel.prisma
    ├── label.prisma
    ├── comment.prisma
    ├── attachment.prisma
    ├── activity.prisma
    ├── notification.prisma
    ├── invitation.prisma
    ├── oauthAccount.prisma
    ├── plan.prisma
    ├── subscription.prisma
    ├── invoice.prisma
    └── payment.prisma
src/
├── app.ts
├── server.ts
└── app/
    ├── config/
    │   └── index.ts
    ├── lib/
    │   ├── bkash.ts
    │   ├── cloudinary.ts
    │   ├── googleOAuth.ts
    │   ├── multer.ts
    │   ├── nodemailer.ts
    │   ├── prisma.ts
    │   └── redis.ts
    ├── middleware/
    │   ├── checkAuth.ts
    │   ├── globalErrorHandler.ts
    │   ├── notFound.ts
    │   └── validationRequest.ts
    ├── module/
    │   ├── activity/
    │   │   ├── activity.controller.ts
    │   │   ├── activity.interface.ts
    │   │   ├── activity.route.ts
    │   │   └── activity.service.ts
    │   ├── adminbilling/
    │   │   ├── adminbilling.controller.ts
    │   │   ├── adminbilling.route.ts
    │   │   └── adminbilling.service.ts
    │   ├── attachment/
    │   │   ├── attachment.controller.ts
    │   │   ├── attachment.interface.ts
    │   │   ├── attachment.repository.ts
    │   │   ├── attachment.route.ts
    │   │   ├── attachment.service.ts
    │   │   └── attachment.validation.ts
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.interface.ts
    │   │   ├── auth.repository.ts
    │   │   ├── auth.route.ts
    │   │   ├── auth.service.ts
    │   │   └── auth.validation.ts
    │   ├── comment/
    │   │   ├── comment.controller.ts
    │   │   ├── comment.interface.ts
    │   │   ├── comment.route.ts
    │   │   ├── comment.service.ts
    │   │   └── comment.validation.ts
    │   ├── invitation/
    │   │   ├── invitation.controller.ts
    │   │   ├── invitation.interface.ts
    │   │   ├── invitation.route.ts
    │   │   ├── invitation.service.ts
    │   │   └── invitation.validation.ts
    │   ├── label/
    │   │   ├── label.controller.ts
    │   │   ├── label.interface.ts
    │   │   ├── label.route.ts
    │   │   ├── label.service.ts
    │   │   └── label.validation.ts
    │   ├── notification/
    │   │   ├── notification.controller.ts
    │   │   ├── notification.interface.ts
    │   │   ├── notification.route.ts
    │   │   ├── notification.service.ts
    │   │   └── notification.validation.ts
    │   ├── organization/
    │   │   ├── organization.controller.ts
    │   │   ├── organization.interface.ts
    │   │   ├── organization.route.ts
    │   │   ├── organization.service.ts
    │   │   └── organization.validation.ts
    │   ├── organizationbilling/
    │   │   ├── organizationbilling.controller.ts
    │   │   ├── organizationbilling.interface.ts
    │   │   ├── organizationbilling.route.ts
    │   │   ├── organizationbilling.service.ts
    │   │   └── organizationbilling.validation.ts
    │   ├── project/
    │   │   ├── project.controller.ts
    │   │   ├── project.interface.ts
    │   │   ├── project.route.ts
    │   │   ├── project.service.ts
    │   │   └── project.validation.ts
    │   ├── sprint/
    │   │   ├── sprint.controller.ts
    │   │   ├── sprint.interface.ts
    │   │   ├── sprint.route.ts
    │   │   ├── sprint.service.ts
    │   │   └── sprint.validation.ts
    │   ├── task/
    │   │   ├── task.controller.ts
    │   │   ├── task.interface.ts
    │   │   ├── task.route.ts
    │   │   ├── task.service.ts
    │   │   └── task.validation.ts
    │   ├── team/
    │   │   ├── team.controller.ts
    │   │   ├── team.interface.ts
    │   │   ├── team.route.ts
    │   │   ├── team.service.ts
    │   │   └── team.validation.ts
    │   └── user/
    │       ├── user.controller.ts
    │       ├── user.interface.ts
    │       ├── user.route.ts
    │       ├── user.service.ts
    │       └── user.validation.ts
    ├── templates/
    │   ├── forget-password-otp.ejs
    │   ├── invitation-mail.ejs
    │   ├── register-otp-email.ejs
    │   ├── reset-password-email.ejs
    │   └── user-welcome-email.ejs
    └── utils/
        ├── catchAsync.ts
        ├── cloudinary.ts
        ├── jwt.ts
        ├── seed.ts
        ├── sendResponse.ts
        └── ...
```

## Local Setup

### Prerequisites

- Node.js 20 or newer
- PostgreSQL database
- Redis instance
- Cloudinary account for uploads
- SMTP account for email flows
- bKash credentials for payment flows

### Install and run

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API starts on `http://localhost:5000` by default. The root endpoint returns a simple health response.

Useful commands:

```bash
npm run build
npm start
npm run lint:check
npm run format:check
```

## Environment Variables

Create a root `.env` file. Do not commit it or publish its values.

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/project_management_saas
FRONTEND_URL=http://localhost:3000

BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d

GOOGLE_CLIENT_ID=your-google-client-id

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

REDIS_USERNAME=default
REDIS_PASSWORD=your-redis-password
REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_USER=your-smtp-user
SMTP_SENDER=your-sender-email
SMTP_PASSWORD=your-smtp-password

BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_CALLBACK_URL=http://localhost:5000/api/v1/billing/bkash/callback
BKASH_MERCHANT_NUMBER=your-merchant-number

SUPER_ADMIN_NAME =Dipongkar Barman
SUPER_ADMIN_EMAIL =dip@gmail.com
SUPER_ADMIN_PASSWORD =super@admin123
```

The application configuration reads `JWT_ACCESS_EXPIRATION` and `JWT_REFRESH_EXPIRATION`. Keep those names consistent with the source configuration.

The configured super-admin account is used for platform billing endpoints. Set `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in the deployment environment; never place the real values in this README.

## API Reference

All API routes are prefixed with `/api/v1`. Unless marked `Public`, endpoints require a Bearer access token. The complete request and response examples are available in the [Postman documentation](https://documenter.getpostman.com/view/49229029/2sBYB4LSM1).

### System

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Returns the basic API health response. |

### Authentication: `/api/v1/auth`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Registers a user. Supports multipart `avatar` upload. |
| `POST` | `/verify-email` | Public | Verifies a user's email address. |
| `POST` | `/login` | Public | Authenticates a user and returns authentication tokens. |
| `POST` | `/google` | Public | Authenticates with Google. |
| `POST` | `/refresh-token` | Public | Issues a new access token from a refresh token. |
| `POST` | `/forget-password` | Public | Starts the password recovery flow. |
| `POST` | `/reset-password` | Public | Sets a new password using the recovery flow. |

### Invitations: `/api/v1/invitations`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/:organizationId/sent-invitation` | `ORG_ADMIN` | Sends an organization invitation. |
| `GET` | `/:token` | Public | Gets invitation details by token. |
| `POST` | `/:token/accept` | Authenticated user | Accepts an invitation. |
| `GET` | `/:organizationId/invitations` | `ORG_ADMIN` | Lists organization invitations. |
| `GET` | `/:organizationId/invitations/:invitationId` | `ORG_ADMIN` | Gets one invitation. |
| `PATCH` | `/:organizationId/invitations/:invitationId/cancel` | `ORG_ADMIN` | Cancels an invitation. |

### Organizations: `/api/v1/organizations`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-organization` | Authenticated | Creates an organization. Supports multipart `logo` upload. |
| `POST` | `/:organizationId/update-logo` | `ORG_ADMIN` | Updates the organization logo. |
| `POST` | `/:organizationId/update-OrganizationInfo` | `ORG_ADMIN` | Updates organization information. |
| `GET` | `/get-all-organizations` | Public route | Lists organizations according to the request filters. |
| `GET` | `/:organizationId` | Public route | Gets an organization by ID. |
| `DELETE` | `/:organizationId` | `ORG_ADMIN` | Deletes an organization. |

### Projects: `/api/v1/projects`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/:organizationId/create-project` | `ORG_ADMIN` | Creates a project. |
| `GET` | `/:organizationId/getAllprojects` | `ORG_ADMIN` | Lists organization projects. |
| `GET` | `/:organizationId/projects/:projectId` | `ORG_ADMIN`, `PROJECT_MANAGER`, `MEMBER`, `TEAM_LEAD` | Gets a project. |
| `PATCH` | `/:organizationId/projects/:projectId` | `ORG_ADMIN` | Updates a project. |
| `DELETE` | `/:organizationId/projects/:projectId` | `ORG_ADMIN` | Deletes a project. |
| `PATCH` | `/:organizationId/projects/:projectId/manager` | `ORG_ADMIN` | Assigns a project manager. |
| `PATCH` | `/:organizationId/projects/:projectId/members` | `ORG_ADMIN` | Adds a project member. |
| `DELETE` | `/:organizationId/projects/:projectId/members/:userId` | Authenticated | Removes a project member. |

### Teams: `/api/v1/teams`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/:organizationId/create-teams` | `ORG_ADMIN` | Creates a team. |
| `GET` | `/:organizationId/get-all-teams` | Organization roles | Lists organization teams. |
| `GET` | `/:organizationId/get-team/:teamId` | Organization roles | Gets a team. |
| `PATCH` | `/:organizationId/update-team/:teamId` | `ORG_ADMIN`, `TEAM_LEAD` | Updates a team. |
| `DELETE` | `/:organizationId/delete-team/:teamId` | `ORG_ADMIN` | Deletes a team. |
| `POST` | `/:organizationId/add-team-leader/:teamId` | `ORG_ADMIN` | Assigns a team leader. |
| `POST` | `/:organizationId/add-team-member/:teamId` | `ORG_ADMIN`, `TEAM_LEAD` | Adds a team member. |
| `DELETE` | `/:organizationId/:teamId/delete-member/:userId` | `ORG_ADMIN`, `TEAM_LEAD` | Removes a team member. |
| `GET` | `/:organizationId/:teamId/view-members` | Organization roles | Lists team members. |

### Sprints: `/api/v1/sprints`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/projects/:projectId/create-sprint` | `ORG_ADMIN`, `PROJECT_MANAGER` | Creates a sprint. |
| `GET` | `/organizations/:organizationId/projects/:projectId/get-all-sprints` | Organization roles | Lists project sprints. |
| `GET` | `/organizations/:organizationId/projects/:projectId/get-sprint/:sprintId` | Organization roles | Gets a sprint. |
| `PATCH` | `/organizations/:organizationId/projects/:projectId/update-sprint/:sprintId` | `ORG_ADMIN`, `PROJECT_MANAGER` | Updates a sprint. |
| `DELETE` | `/organizations/:organizationId/projects/:projectId/delete-sprint/:sprintId` | `ORG_ADMIN`, `PROJECT_MANAGER` | Deletes a sprint. |

### Tasks: `/api/v1/tasks`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/projects/:projectId/create-tasks` | `ORG_ADMIN`, `PROJECT_MANAGER` | Creates a task. |
| `GET` | `/organizations/:organizationId/projects/:projectId/get-all-tasks` | Organization roles | Lists project tasks. |
| `GET` | `/organizations/:organizationId/projects/:projectId/get-task/:taskId` | Organization roles | Gets a task. |
| `PATCH` | `/organizations/:organizationId/projects/:projectId/update-task/:taskId` | Organization roles | Updates a task. |
| `DELETE` | `/organizations/:organizationId/projects/:projectId/delete-task/:taskId` | `ORG_ADMIN`, `PROJECT_MANAGER` | Deletes a task. |

### Labels: `/api/v1/labels`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/create-labels` | `ORG_ADMIN`, `PROJECT_MANAGER` | Creates a label. |
| `GET` | `/organizations/:organizationId/get-all-labels` | Organization roles | Lists labels. |
| `PATCH` | `/organizations/:organizationId/update-label/:labelId` | `ORG_ADMIN`, `PROJECT_MANAGER` | Updates a label. |
| `DELETE` | `/organizations/:organizationId/labels/:labelId` | `ORG_ADMIN`, `PROJECT_MANAGER` | Deletes a label. |
| `POST` | `/organizations/:organizationId/labels/:labelId/assign` | Organization roles | Assigns a label to a task. |
| `DELETE` | `/organizations/:organizationId/labels/:labelId/tasks/:taskId/remove` | Organization roles | Removes a label from a task. |

### Comments: `/api/v1/comments`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/projects/:projectId/tasks/:taskId/create-comments` | Organization roles | Creates a task comment. |
| `GET` | `/organizations/:organizationId/projects/:projectId/tasks/:taskId/get-comments` | Organization roles | Lists task comments. |
| `PATCH` | `/organizations/:organizationId/projects/:projectId/update-comments/:commentId` | Organization roles | Updates a comment. |
| `DELETE` | `/organizations/:organizationId/projects/:projectId/delete-comments/:commentId` | Organization roles | Deletes a comment. |

### Attachments: `/api/v1/attachments`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments` | Organization roles | Uploads multipart `files` to a task. |
| `GET` | `/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments` | Organization roles | Lists task attachments. |
| `DELETE` | `/organizations/:organizationId/projects/:projectId/tasks/attachments/:attachmentId` | Organization roles | Deletes an attachment. |

### Activities: `/api/v1/activities`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/organizations/:organizationId/get-activities` | Organization roles | Lists organization activity records. |
| `GET` | `/organizations/:organizationId/activities/:entityType/:entityId` | Organization roles | Lists activity for an entity. |

### Notifications: `/api/v1/organizations/:organizationId/notifications`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Organization roles | Lists the current user's notifications. |
| `PATCH` | `/read` | Organization roles | Marks selected notifications as read. |
| `PATCH` | `/read-all` | Organization roles | Marks all notifications as read. |

### Organization billing: `/api/v1/billing`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/organizations/:organizationId/upgrade-billing` | `ORG_ADMIN` | Starts a plan upgrade and payment flow. |
| `GET` | `/organizations/:organizationId/get-billing` | `ORG_ADMIN`, `PROJECT_MANAGER` | Gets billing overview. |
| `GET` | `/organizations/:organizationId/usage` | `ORG_ADMIN`, `PROJECT_MANAGER` | Gets plan usage and limits. |
| `GET` | `/organizations/:organizationId/invoices` | `ORG_ADMIN` | Lists organization invoices. |
| `GET` | `/organizations/:organizationId/payments` | `ORG_ADMIN` | Lists organization payments. |
| `POST` | `/organizations/:organizationId/downgrade` | `ORG_ADMIN` | Starts a plan downgrade. |
| `POST` | `/organizations/:organizationId/cancel` | `ORG_ADMIN` | Cancels the subscription. |
| `POST` | `/organizations/:organizationId/resume` | `ORG_ADMIN` | Resumes a canceled subscription. |

### Platform billing: `/api/v1/billing`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/plans` | `SUPER_ADMIN` | Lists all subscription plans. |
| `GET` | `/subscriptions` | `SUPER_ADMIN` | Lists all subscriptions. |
| `GET` | `/payments/pending` | `SUPER_ADMIN` | Lists pending payments. |
| `GET` | `/payments` | `SUPER_ADMIN` | Lists all payments. |
| `GET` | `/payments/:paymentId` | `SUPER_ADMIN` | Gets one payment. |
| `GET` | `/bkash/callback` | bKash | Handles the bKash payment callback. |

## Request and Response Conventions

- JSON requests use `Content-Type: application/json`.
- Upload requests use `multipart/form-data` with the field names documented above.
- Date values should be ISO 8601 strings.
- UUID route parameters must be valid PostgreSQL UUIDs.
- Successful responses use an envelope similar to:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": {}
}
```

Errors are normalized by the global error handler.

## Data Model

The Prisma schema is split into files under `prisma/schema/` and generated client code is written to `generated/prisma/`. Important enum groups include:

- `PlatformRole`: `USER`, `SUPER_ADMIN`
- `OrganizationRole`: `ORG_ADMIN`, `PROJECT_MANAGER`, `TEAM_LEAD`, `MEMBER`, `GUEST`
- `ProjectStatus`: `PLANNING`, `ACTIVE`, `COMPLETED`, `ON_HOLD`, `ARCHIVED`
- `SprintStatus`: `PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED`
- `TaskStatus`: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`
- `SubscriptionStatus`: `ACTIVE`, `PAST_DUE`, `CANCELED`, `UNPAID`
- `BillingInterval`: `MONTHLY`, `YEARLY`
- `PaymentStatus`: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`

## Deployment

The repository includes `vercel.json` and builds the API bundle with `tsup`.

1. Configure all environment variables in the Vercel project.
2. Use a production PostgreSQL database, Redis instance, Cloudinary account, SMTP provider, and bKash credentials.
3. Set `FRONTEND_URL` to the allowed frontend origin.
4. Set `BKASH_CALLBACK_URL` to the deployed HTTPS callback URL.
5. Run `npm run build` to verify the production bundle before deployment.

## Security

- Never commit `.env` or provider credentials.
- Rotate any credentials that have been pasted into chats, tickets, public repositories, or documentation.
- Use separate secrets for development and production.
- Use HTTPS for production API traffic and payment callbacks.
- Restrict platform billing endpoints to trusted `SUPER_ADMIN` accounts.