import { BillingInterval } from "../../../../generated/prisma/enums";



export interface IUpgradePlanPayload {
  planId: string;
  interval: BillingInterval;
}
