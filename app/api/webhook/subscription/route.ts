import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/billing";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:webhook:${clientIp}`, 60, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const rawBody = await req.text();
    const signature =
      req.headers.get("webhook-signature") ||
      req.headers.get("x-signature") ||
      req.headers.get("dodo-signature") ||
      "";
    const webhookId = req.headers.get("webhook-id") || null;
    const webhookTimestamp = req.headers.get("webhook-timestamp") || null;

    // 1. Verify signature if webhook secret is set
    const isValid = verifyWebhookSignature(rawBody, signature, {
      id: webhookId,
      timestamp: webhookTimestamp,
    });
    // In production with secret configured, strictly reject unauthorized requests
    if (!isValid && process.env.BILLING_WEBHOOK_SECRET) {
      console.warn("Invalid webhook signature rejected from IP:", clientIp);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody || "{}");
    const eventType: string = payload.type || payload.event || payload.action || "";
    const eventData = payload.data || payload;

    const supabaseAdmin = createAdminSupabaseClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin database unavailable" }, { status: 503 });
    }

    // Extract identifiers
    const userId: string | null =
      eventData.metadata?.user_id ||
      eventData.customer?.metadata?.user_id ||
      eventData.user_id ||
      null;

    const customerId: string | null =
      eventData.customer_id || eventData.customer?.id || null;
    const subscriptionId: string | null =
      eventData.subscription_id || eventData.id || null;
    const billingInterval: "monthly" | "yearly" =
      eventData.metadata?.interval === "monthly" || eventData.billing_cycle === "month"
        ? "monthly"
        : "yearly";

    if (!userId) {
      // If no direct userId, try looking up by customerId or email
      const customerEmail = eventData.customer?.email || eventData.email;
      if (!customerEmail) {
        return NextResponse.json({ received: true, note: "No user identifiable" });
      }

      const { data: userRecord } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("username", customerEmail.split("@")[0].toLowerCase())
        .maybeSingle();

      if (!userRecord) {
        return NextResponse.json({ received: true, note: "User not found" });
      }
    }

    const targetUserId = userId;

    // Idempotent Event Handlers
    switch (eventType.toLowerCase()) {
      case "subscription.active":
      case "subscription.created":
      case "subscription_created":
      case "payment.succeeded": {
        // Calculate current_period_end: 1 month or 1 year from now
        const periodEnd = eventData.current_period_end
          ? new Date(eventData.current_period_end * (eventData.current_period_end < 10000000000 ? 1000 : 1)).toISOString()
          : new Date(Date.now() + (billingInterval === "yearly" ? 365 : 30) * 86400000).toISOString();

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_status: "active",
            billing_interval: billingInterval,
            current_period_end: periodEnd,
            provider_customer_id: customerId,
            provider_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        break;
      }

      case "subscription.renewed":
      case "subscription_renewed": {
        const periodEnd = eventData.current_period_end
          ? new Date(eventData.current_period_end * (eventData.current_period_end < 10000000000 ? 1000 : 1)).toISOString()
          : new Date(Date.now() + 30 * 86400000).toISOString();

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_status: "active",
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        break;
      }

      case "subscription.cancelled":
      case "subscription_cancelled": {
        // Keeps Pro until current_period_end, then drops to Free
        await supabaseAdmin
          .from("profiles")
          .update({
            plan_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        break;
      }

      case "subscription.expired":
      case "subscription_expired":
      case "subscription.deleted":
      case "refund.created": {
        // Downgrade to Free: keep links in DB, reset default theme to notebook, turn off spotlight
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            plan_status: "expired",
            theme: "notebook",
            spotlight_enabled: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        break;
      }

      case "payment.failed": {
        await supabaseAdmin
          .from("profiles")
          .update({
            plan_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message || "Webhook error" }, { status: 500 });
  }
}
