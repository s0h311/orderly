import type Stripe from 'stripe'
import { Subscription } from '~~/server/database/schemas/public'

type ProductDetails = {
  isMetered: boolean
  mode: Stripe.Checkout.Session.Mode // 'payment' for one time payment, 'subscription' for subscriptions
  subscriptionType: Subscription['type']
  paymentPeriod: Subscription['paymentPeriod']
}

const productDetailsTest: Record<string, ProductDetails> = {
  // TODO add your test price ids here
  price_1PSPTTKDXBGuYX0kpVOpSB6t: {
    isMetered: false,
    subscriptionType: 'premium',
    mode: 'payment',
    paymentPeriod: 'lifetime',
  },
}

const productDetailsLive: Record<string, ProductDetails> = {
  // TODO add your live price ids here
  price_1PSPTTKDXBGuYX0kpVOpSB6t: {
    isMetered: false,
    subscriptionType: 'premium',
    mode: 'payment',
    paymentPeriod: 'lifetime',
  },
}

export function getProductDetails(priceId: string): ProductDetails {
  return process.env.NODE_ENV === 'development' ? productDetailsTest[priceId] : productDetailsLive[priceId]
}
