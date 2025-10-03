import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (userId) {
            await User.findByIdAndUpdate(userId, {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionTier: 'pro',
              subscriptionStatus: 'active',
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });

        if (user) {
          let status: 'active' | 'inactive' | 'cancelled' = 'inactive';

          if (subscription.status === 'active') {
            status = 'active';
          } else if (subscription.status === 'canceled') {
            status = 'cancelled';
          }

          await User.findByIdAndUpdate(user._id, {
            subscriptionStatus: status,
            subscriptionTier: subscription.status === 'active' ? 'pro' : 'free',
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });

        if (user) {
          await User.findByIdAndUpdate(user._id, {
            subscriptionStatus: 'cancelled',
            subscriptionTier: 'free',
            stripeSubscriptionId: null,
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
