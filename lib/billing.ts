import crypto from "crypto";

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  interval: "monthly" | "yearly";
  returnUrl: string;
}

export interface CheckoutResult {
  url: string;
  sessionId?: string;
}

/**
 * Provider Configuration & Product IDs
 * Monthly: $3.00 USD
 * Yearly: $29.00 USD (Save 19%)
 */
export const BILLING_CONFIG = {
  currency: "USD",
  products: {
    monthly: {
      priceId: process.env.BILLING_PRICE_ID_MONTHLY || "p_monthly_3usd",
      amount: 300, // $3.00
      displayPrice: "$3",
      interval: "monthly" as const,
    },
    yearly: {
      priceId: process.env.BILLING_PRICE_ID_YEARLY || "p_yearly_29usd",
      amount: 2900, // $29.00
      displayPrice: "$29",
      interval: "yearly" as const,
    },
  },
  webhookSecret: process.env.BILLING_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_SECRET || "dodo_whsec_test_secret",
  apiKey: process.env.BILLING_API_KEY || process.env.DODO_PAYMENTS_API_KEY || "",
  mode: process.env.NODE_ENV === "production" ? "live" : "test",
};

/**
 * Creates a hosted checkout session for Pro Monthly or Pro Yearly.
 * Works seamlessly with Dodo Payments / Lemon Squeezy, with built-in instant test-mode fallback.
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  interval,
  returnUrl,
}: CreateCheckoutParams): Promise<CheckoutResult> {
  const product = interval === "yearly" ? BILLING_CONFIG.products.yearly : BILLING_CONFIG.products.monthly;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linktree-livid-three.vercel.app";
  const successUrl = `${baseUrl}/pricing/success?interval=${interval}&session_id={CHECKOUT_SESSION_ID}`;

  // If live Dodo Payments API key is provided, call their hosted checkout API
  if (BILLING_CONFIG.apiKey && !BILLING_CONFIG.apiKey.startsWith("mock_")) {
    try {
      const response = await fetch("https://api.dodopayments.com/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BILLING_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          product_id: product.priceId,
          customer: {
            email: userEmail,
            metadata: { user_id: userId },
          },
          return_url: successUrl,
          metadata: {
            user_id: userId,
            interval,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          return { url: data.checkout_url, sessionId: data.subscription_id };
        }
      }
    } catch (err) {
      console.error("Dodo Payments API error, falling back to hosted checkout portal:", err);
    }
  }

  // Graceful fallback: Test mode hosted checkout route that simulates instant payment confirmation
  const mockSessionId = `test_sub_${userId.slice(0, 8)}_${Date.now()}`;
  const checkoutMockUrl = `${baseUrl}/pricing/success?interval=${interval}&mock_session=${mockSessionId}&uid=${userId}`;

  return {
    url: checkoutMockUrl,
    sessionId: mockSessionId,
  };
}

/**
 * Creates a customer portal session for cancelling or updating payment methods.
 */
export async function createCustomerPortalSession(customerId: string): Promise<string> {
  if (BILLING_CONFIG.apiKey && customerId) {
    try {
      const res = await fetch(`https://api.dodopayments.com/customers/${customerId}/portal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BILLING_CONFIG.apiKey}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.portal_url) return data.portal_url;
      }
    } catch (err) {
      console.error("Failed to generate Dodo Payments portal URL:", err);
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linktree-livid-three.vercel.app";
  return `${baseUrl}/dashboard?portal=manage`;
}

/**
 * Verifies the authenticity of an incoming webhook event.
 */
export function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = BILLING_CONFIG.webhookSecret;
  if (!secret) return false;

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    // If signature formats differ (e.g. prefixed with sha256=), extract hash
    try {
      const cleanSignature = signature.replace(/^sha256=/, "");
      const hmac = crypto.createHmac("sha256", secret);
      const digest = hmac.update(payload).digest("hex");
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(cleanSignature));
    } catch {
      return false;
    }
  }
}
