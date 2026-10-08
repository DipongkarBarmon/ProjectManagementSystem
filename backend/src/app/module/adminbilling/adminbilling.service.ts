import { prisma } from "../../lib/prisma";
import { InvoiceStatus, PaymentStatus, SubscriptionStatus, ActivityAction, BillingInterval } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { executeBkashPayment } from "../../lib/bkash";
import { redisClient } from "../../lib/redis";

export class AdminBillingService {
  static async getPlans() {
    return prisma.plan.findMany();
  }

  static async getAllSubscriptions() {
    return prisma.subscription.findMany({ include: { plan: true, organization: true } });
  }

  static async getPendingPayments() {
    return prisma.payment.findMany({ where: { status: PaymentStatus.PENDING }, include: { invoice: true, organization: true } });
  }

  static async getPaymentById(paymentId: string) {
    return prisma.payment.findUnique({ where: { id: paymentId }, include: { invoice: true, organization: true } });
  }

  static async getAllPayments() {
    return prisma.payment.findMany({ include: { invoice: true, organization: true }, orderBy: { createdAt: 'desc' } });
  }



  static async executeBkashCallback(paymentID: string, status: string) {
    if (status === 'cancel' || status === 'failure') {
      await prisma.payment.updateMany({
        where: { transactionId: paymentID },
        data: { status: PaymentStatus.FAILED, failureReason: "User cancelled or failed" }
      });
      return { success: false, message: "Payment cancelled or failed" };
    }

    if (status === 'success') {
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

      // Fetch intent metadata from Redis
      let planId: string | undefined;
      let interval: string | undefined;
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
          data: { status: PaymentStatus.SUCCESS, verifiedAt: new Date(), transactionId: executeResult.trxID }
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
              planId: planId,
              interval: (interval as BillingInterval) || BillingInterval.MONTHLY
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
}
