import pino from 'pino'

const p = pino({})

export default {
  debug: (message: unknown, source = 'Unknown Source') => {
    p.debug(`[${source}] ${JSON.stringify(message)}`)
  },

  info: (message: unknown, source = 'Unknown Source') => {
    p.info(`[${source}] ${JSON.stringify(message)}`)
  },

  warn: (message: unknown, source = 'Unknown Source') => {
    p.warn(`[${source}] ${JSON.stringify(message)}`)
  },

  error: (message: unknown, source = 'Unknown Source', data: Record<string, unknown> = {}) => {
    p.error(`[${source}] ${JSON.stringify(message)}`)

    return createError({
      statusCode: 500,
      statusMessage: JSON.stringify(message),
      data,
    })
  },
}
