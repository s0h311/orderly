import { getServerSession, getToken } from '#auth'
import { initCheckout } from './checkoutService'

export default defineEventHandler(async (event): Promise<string | void> => {
  const requestOrigin = getRequestHeader(event, 'origin')

  if (requestOrigin === undefined) {
    return setResponseStatus(event, 400)
  }

  const checkoutOptions = await readBody(event)

  const session = await getServerSession(event)

  if (!session || !session.user) {
    return setResponseStatus(event, 401)
  }

  return await initCheckout({ requestOrigin, checkoutOptions, userId: session.user.id })
})
