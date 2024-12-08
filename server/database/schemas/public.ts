import { timestamp, text, pgEnum, pgTable } from 'drizzle-orm/pg-core'

export const subscriptionTypeEnum = pgEnum('subscription_type', [
  // TODO add your own subscription types here
  'free',
  'premium',
])

export const paymentPeriodEnum = pgEnum('payment_period', [
  // TODO add your own payment periods here
  'monthly',
  'yearly',
  'lifetime',
])

export const subscription = pgTable('subscription', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 2,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  lastPaymentAt: timestamp('last_payment_at', {
    mode: 'date',
    precision: 2,
    withTimezone: true,
  }),
  type: subscriptionTypeEnum('type').notNull(),
  paymentPeriod: paymentPeriodEnum('payment_period').notNull(),
  deactivatedAt: timestamp('deactivated_at', {
    mode: 'date',
    precision: 2,
    withTimezone: true,
  }),
})

export type Subscription = typeof subscription.$inferSelect
