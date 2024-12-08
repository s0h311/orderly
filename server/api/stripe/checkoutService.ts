import Stripe from 'stripe'
import logger from '~~/utils/logger'
import { getProductDetails } from './productData'
import { useCache } from '~~/server/cache'
import { User } from '~~/server/database/schemas/auth'

type StripeCheckoutQuery = {
  requestOrigin: string
  checkoutOptions: {
    priceId: string
    isAddressRequired?: boolean
    allowPromotionCodes?: boolean
    additionalData: Record<string, string>
  }
  userId: User['id']
}

const { payment } = useRuntimeConfig()
const stripe = new Stripe(payment.stripe.secretKey)

const cache = useCache()

export async function initCheckout({
  requestOrigin,
  userId,
  checkoutOptions: { priceId, isAddressRequired = false, allowPromotionCodes = false, additionalData },
}: StripeCheckoutQuery): Promise<string> {
  const { isMetered, mode } = getProductDetails(priceId)

  const successUrl = requestOrigin + '/checkout/success'
  const cancelUrl = requestOrigin

  try {
    const item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price: priceId,
    }

    if (!isMetered) {
      item.quantity = 1
    }

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      line_items: [item],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: [
        // TODO add your own payment methods here. Make sure to activate them in Stripe Settings
        'paypal',
        'card',
      ],
      customer_creation: 'always',
    }

    if (isAddressRequired) {
      sessionOptions.billing_address_collection = 'required'
    }

    if (allowPromotionCodes) {
      sessionOptions.allow_promotion_codes = true
    }

    if (additionalData) {
      sessionOptions.metadata = additionalData
    }

    const session = await stripe.checkout.sessions.create(sessionOptions)

    cache.setItem(session.id, userId)

    if (!session.url) {
      throw logger.error('Unable to find stripe session url', 'StripeCheckoutService')
    }

    return session.url
  } catch (e) {
    logger.error(e, 'StripeCheckoutService')
    return '/checkout/error'
  }
}
