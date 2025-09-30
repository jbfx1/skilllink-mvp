import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

/**
 * Get Stripe instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured')
      return null
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

/**
 * Create checkout session for a product
 * @param {Object} params - Checkout parameters
 * @param {string} params.productId - Product/price ID
 * @param {string} params.userId - User ID
 * @param {string} params.successUrl - Success redirect URL
 * @param {string} params.cancelUrl - Cancel redirect URL
 */
export const createCheckoutSession = async ({
  productId,
  userId,
  successUrl,
  cancelUrl,
  metadata = {}
}) => {
  try {
    // This would typically call your backend API
    // which then calls Stripe to create a checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: productId,
        userId,
        successUrl,
        cancelUrl,
        metadata
      })
    })

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

/**
 * Redirect to Stripe Checkout
 * @param {string} sessionId - Checkout session ID
 */
export const redirectToCheckout = async (sessionId) => {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe not initialized')
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

/**
 * Handle subscription purchase
 * @param {Object} params - Subscription parameters
 * @param {string} params.planId - Plan ID
 * @param {string} params.userId - User ID
 */
export const handleSubscription = async ({ planId, userId }) => {
  try {
    const session = await createCheckoutSession({
      productId: planId,
      userId,
      successUrl: `${window.location.origin}/subscription/success`,
      cancelUrl: `${window.location.origin}/subscription/cancel`,
      metadata: {
        type: 'subscription',
        planId
      }
    })

    await redirectToCheckout(session.id)
  } catch (error) {
    console.error('Error handling subscription:', error)
    throw error
  }
}

/**
 * Handle one-time payment
 * @param {Object} params - Payment parameters
 * @param {string} params.priceId - Price ID
 * @param {string} params.userId - User ID
 * @param {string} params.itemName - Item name
 */
export const handleOneTimePayment = async ({ priceId, userId, itemName }) => {
  try {
    const session = await createCheckoutSession({
      productId: priceId,
      userId,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
      metadata: {
        type: 'one-time',
        itemName
      }
    })

    await redirectToCheckout(session.id)
  } catch (error) {
    console.error('Error handling one-time payment:', error)
    throw error
  }
}

/**
 * Pricing plans configuration
 */
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Access to public topic rooms',
      'Basic Q&A access',
      'Community support',
      '5 messages per day'
    ]
  },
  learner: {
    name: 'Learner Pro',
    price: 9.99,
    interval: 'month',
    priceId: 'price_learner_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited messaging',
      'Access to all topic rooms',
      'Book mentorship sessions',
      'Join live classes',
      'Project collaboration',
      'Priority support'
    ]
  },
  mentor: {
    name: 'Mentor Premium',
    price: 29.99,
    interval: 'month',
    priceId: 'price_mentor_monthly', // Replace with actual Stripe price ID
    features: [
      'All Learner Pro features',
      'Host live classes',
      'Monetize your expertise',
      'Advanced analytics',
      'Custom branding',
      'Premium support'
    ]
  }
}

export default {
  getStripe,
  createCheckoutSession,
  redirectToCheckout,
  handleSubscription,
  handleOneTimePayment,
  PRICING_PLANS
}