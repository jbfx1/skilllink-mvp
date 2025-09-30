import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { handleSubscription, PRICING_PLANS } from '@/lib/stripe'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export const PricingPlans = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(null)

  const handleSelectPlan = async (planKey, priceId) => {
    if (!user) {
      toast.error('Please sign in to subscribe')
      return
    }

    if (planKey === 'free') {
      toast.info('You are already on the free plan')
      return
    }

    setLoading(planKey)
    try {
      await handleSubscription({
        planId: priceId,
        userId: user.id
      })
    } catch (error) {
      toast.error('Failed to process subscription')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Unlock your learning potential with our flexible pricing
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Card
            key={key}
            className={key === 'learner' ? 'border-primary shadow-lg' : ''}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {key === 'learner' && (
                  <Badge variant="default">Popular</Badge>
                )}
              </div>
              <CardDescription>
                <div className="text-3xl font-bold text-foreground">
                  ${plan.price}
                  {plan.interval && (
                    <span className="text-base font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={key === 'learner' ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(key, plan.priceId)}
                disabled={loading === key || key === 'free'}
              >
                {loading === key ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : key === 'free' ? (
                  'Current Plan'
                ) : (
                  'Get Started'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>All plans include a 14-day money-back guarantee</p>
        <p className="mt-2">Need a custom enterprise plan? <a href="/contact" className="text-primary hover:underline">Contact us</a></p>
      </div>
    </div>
  )
}