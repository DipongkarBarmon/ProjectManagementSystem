
import express, { Application, Request, Response } from 'express'
import cors  from 'cors'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
import { AuthRouter } from './app/module/auth/auth.route'
import cookieParser from 'cookie-parser'
import config from './app/config'
import { InvitationRouter } from './app/module/invitation/invitation.route'
import { OrganizationRouter } from './app/module/organization/organization.route'
import { ProjectRouter } from './app/module/project/project.route'
import { TeamRoutes } from './app/module/team/team.route'
import { SprintRoutes } from './app/module/sprint/sprint.route'
import { TaskRoutes } from './app/module/task/task.route'
import { LabelRoutes } from './app/module/label/label.route'
import { CommentRoutes } from './app/module/comment/comment.route'
import { AttachmentRoutes } from './app/module/attachment/attachment.route'
import { ActivityRoutes } from './app/module/activity/activity.route'
import { NotificationRoutes } from './app/module/notification/notification.route'
import { OrganizationBillingRoutes } from './app/module/organizationbilling/organizationbilling.route'
import { AdminBillingRoutes } from './app/module/adminbilling/adminbilling.route'

const app  : Application=express()
app.use(
	cors({
		origin:config.frontend_url ,
		credentials: true,
	}),
);
app.use(express.urlencoded({extended : true}))
app.use(express.raw())
app.use(express.json())
app.use(cookieParser())


app.get('/',(req : Request, res : Response)=>{
   res.send("Hello Dip!")
})

app.use('/api/v1/auth',AuthRouter)
app.use('/api/v1/invitations', InvitationRouter)
app.use('/api/v1/organizations',OrganizationRouter)
app.use('/api/v1/projects', ProjectRouter)
app.use('/api/v1/teams', TeamRoutes)
app.use('/api/v1/sprints', SprintRoutes)
app.use('/api/v1/tasks', TaskRoutes)

app.use('/api/v1/labels', LabelRoutes)
app.use('/api/v1/comments', CommentRoutes)
app.use('/api/v1/attachments', AttachmentRoutes)
app.use('/api/v1/activities', ActivityRoutes)
app.use('/api/v1/organizations/:organizationId/notifications', NotificationRoutes)
app.use('/api/v1/billing', OrganizationBillingRoutes)
app.use('/api/v1/billing', AdminBillingRoutes)

app.use(notFound)
app.use(globalErrorHandler)

export default app
 
