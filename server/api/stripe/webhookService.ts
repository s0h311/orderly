import Stripe from 'stripe'
import logger from '~~/utils/logger'
import { getProductDetails } from './productData'
import { subscription } from '~~/server/database/schemas/public'
import { db } from '~~/server/database/client'
import { useCache } from '~~/server/cache'
import { eq } from 'drizzle-orm'

type StripeWebhookServiceQuery = {
  rawEvent: string
  stripeSignatureHeader: string
}

export type StripeWebhookServiceResponse = {
  received: boolean
}

const { payment } = useRuntimeConfig()
const stripe = new Stripe(payment.stripe.secretKey)

const cache = useCache()

export async function handleWebhook({
  rawEvent,
  stripeSignatureHeader,
}: StripeWebhookServiceQuery): Promise<StripeWebhookServiceResponse> {
  const event = getVerifiedEvent(rawEvent, stripeSignatureHeader)

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event)
  }

  return { received: true }
}

async function handleCheckoutCompleted(event: Stripe.CheckoutSessionCompletedEvent): Promise<void> {
  const eventData = event.data.object

  const session = await stripe.checkout.sessions.retrieve(eventData.id, {
    expand: ['line_items'],
  })

  const customerId = session.customer as string

  if (customerId === null) {
    throw logger.error('No customerId found', 'StripeWebhookService', { sessionId: session.id })
  }

  const customer = await stripe.customers.retrieve(customerId)
  const priceId = session.line_items?.data[0].price?.id

  if (priceId === undefined) {
    throw logger.error('No priceId found', 'StripeWebhookService', { sessionId: session.id })
  }

  const { paymentPeriod, subscriptionType } = getProductDetails(priceId)

  const hasUserId = await cache.hasItem(session.id)

  if (!hasUserId) {
    throw logger.error('No userId found', 'StripeWebhookService', { sessionId: session.id })
  }

  const userId = (await cache.getItem(session.id)) as string

  await db.insert(subscription).values({
    userId,
    paymentPeriod,
    type: subscriptionType,
    stripeCustomerId: customer.id,
  })

  await cache.removeItem(session.id)
}

async function handleSubscriptionDeleted(event: Stripe.CustomerSubscriptionDeletedEvent): Promise<void> {
  const eventData = event.data.object

  const stripeSubscription = await stripe.subscriptions.retrieve(eventData.id)

  await db
    .update(subscription)
    .set({
      deactivatedAt: new Date(),
    })
    .where(eq(subscription.stripeCustomerId, stripeSubscription.customer as string))
}

function getVerifiedEvent(rawEvent: string, stripeSignatureHeader: string): Stripe.Event {
  const whsec = payment.stripe.whsec

  try {
    return stripe.webhooks.constructEvent(rawEvent, stripeSignatureHeader, whsec)
  } catch (err) {
    throw logger.error('Stripe event could not be verified', 'StripeWebhookService - getVerifiedEvent', {
      error: err,
    })
  }
}
