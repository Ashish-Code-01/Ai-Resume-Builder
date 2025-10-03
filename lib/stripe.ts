import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    name: 'Pro Plan',
    price: 9.99,
    interval: 'month' as const,
    features: [
      'Unlimited resumes',
      'AI-powered content generation',
      'Advanced canvas customization',
      'PDF export',
      'Public resume links',
      'Priority support',
    ],
  },
};

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string,
  customerId?: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: !customerId ? userEmail : undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return session;
}

export async function getSubscriptionStatus(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}
