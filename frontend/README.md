# TaskFlow Frontend

Next.js frontend for TaskFlow, a multi-tenant project management application.
It provides the public landing page, authentication flows, workspace dashboard,
project and task management, teams, sprints, labels, comments, member
invitations, notifications, billing pages, and the super-admin console.

## Technology Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query for server-state fetching and mutations
- Zustand for authentication and workspace state
- `next-themes` for light/dark mode
- Sonner and Lucide React for notifications and UI icons

## Prerequisites

- Node.js 20 or newer
- The TaskFlow backend running locally or a deployed API
- A Google OAuth client if Google sign-in is enabled

## Local Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application runs at [http://localhost:3000](http://localhost:3000).
The backend should normally be available at
[http://localhost:5000](http://localhost:5000).

Useful commands:

```bash
npm run build
npm start
npm run lint
```

## Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Optional: demo-only credentials matching the seeded backend users.
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=demo-password
NEXT_PUBLIC_DEMO_PROJECT_MANAGER_EMAIL=project-manager@example.com
NEXT_PUBLIC_DEMO_PROJECT_MANAGER_PASSWORD=demo-password
NEXT_PUBLIC_DEMO_TEAM_LEADER_EMAIL=team-leader@example.com
NEXT_PUBLIC_DEMO_TEAM_LEADER_PASSWORD=demo-password
NEXT_PUBLIC_DEMO_MEMBER_EMAIL=member@example.com
NEXT_PUBLIC_DEMO_MEMBER_PASSWORD=demo-password
```

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api/v1` when omitted.
The demo variables are optional and should only contain non-production demo
credentials. Never put private production credentials in a `NEXT_PUBLIC_*`
variable.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Public TaskFlow homepage |
| `/login` | Email/password and Google sign-in |
| `/register` | Account registration |
| `/dashboard` | Authenticated workspace dashboard |
| `/projects` | Project list and project management |
| `/tasks` | Task list and task details |
| `/teams` | Team management |
| `/sprints` | Sprint management |
| `/members` | Organization members and invitations |
| `/organizations` | Organization settings and member overview |
| `/settings` | User, workspace, and billing settings |
| `/admin` | Super-admin dashboard |

After login, users return to the homepage. Authenticated users can open their
workspace from the profile menu in the top-right navbar. Super admins are sent
to `/admin`; regular users are sent to `/dashboard`.

## Application Structure

```text
app/
├── page.tsx                 # Public homepage
├── login/ and register/     # Authentication pages
├── dashboard/               # Workspace overview
├── projects/, tasks/        # Core work management
├── teams/, sprints/         # Collaboration and planning
├── members/, invitations/  # Organization membership
├── settings/                # User, workspace, and billing settings
├── payment/                 # Payment result pages
└── admin/                   # Super-admin routes
components/
├── auth-provider.tsx        # Auth initialization and route guards
├── workspace-provider.tsx   # Organization loading and selection
├── workspace-shell.tsx     # Authenticated workspace layout
└── admin-shell.tsx         # Admin layout
lib/
├── api-client.ts            # Typed API request client
└── store/                   # Zustand auth and workspace stores
```

## Backend

See [the backend README](../backend/README.md) for database setup, API
endpoints, authentication, billing configuration, and deployment notes.
