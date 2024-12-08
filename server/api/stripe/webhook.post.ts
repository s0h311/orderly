import { handleWebhook, type StripeWebhookServiceResponse } from './webhookService'

export default defineEventHandler(async (event): Promise<StripeWebhookServiceResponse> => {
  const rawEvent = await readRawBody(event)
  const stripeSignatureHeader = getRequestHeader(event, 'stripe-signature')

  if (rawEvent === undefined) {
    setResponseStatus(event, 400)
    return { received: true }
  }

  if (stripeSignatureHeader === undefined) {
    setResponseStatus(event, 401)
    return { received: true }
  }

  return await handleWebhook({ rawEvent, stripeSignatureHeader })
})
