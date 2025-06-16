import { useStripe, useElements } from "@stripe/react-stripe-js"

export default function usePayment() {
  const stripe = useStripe()
  const elements = useElements()

  const createPaymentSource = async ({
    element,
    billing,
    amount,
    currency,
  }) => {
    if (stripe && elements) {
      const { source, error } = await stripe.createSource(element, {
        type: "card",
        usage: "single_use",
        amount: Math.round(parseFloat(amount.replace(/\$|,/g, "") * 100)), // strip out the dollar sign,
        currency,
        owner: {
          address: {
            city: billing.city,
            country: billing.country,
            line1: billing.address1,
            line2: billing.address2,
            postal_code: billing.postcode,
            state: billing.state,
          },
          email: billing.email,
          name: `${billing.firstName} ${billing.lastName}`,
          phone: billing.phone,
        },
      })

      return { source, error }
    }

    return { source: null, error: "Stripe is not properly loaded." }
  }

  const createPaymentMethod = async ({ billing, cardElement }) => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: `${billing.firstName} ${billing.lastName}` || null,
        email: billing.email || null,
        address: {
          line1: billing.address1 || null,
          line2: billing.address2 || null,
          city: billing.city || null,
          state: billing.state || null,
          country: billing.country || null,
          postal_code: billing.postcode || null,
        },
        phone: billing.phone || null,
      },
    })

    return { paymentMethod, error }
  }

  const createPaymentIntent = async ({
    amount,
    currency,
    paymentMethod,
    customer,
  }) => {
    const data = await fetch("/.netlify/functions/StripePaymentIntentCreate", {
      method: "POST",
      body: JSON.stringify({
        amount: amount.replace(/\$|,/g, ""), // strip out the dollar sign
        currency,
        paymentMethod,
        customer,
      }),
    })
    const { clientSecret } = await data.json()

    return clientSecret
  }

  const confirmCardPayment = async ({
    clientSecret,
    paymentMethod,
    savedPaymentCard,
    billing,
    shipping,
  }) => {
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id,
        save_payment_method: savedPaymentCard,
        setup_future_usage: "on_session", // hard coded for this application
        receipt_email: billing.email,
        shipping: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          address: {
            line1: shipping.address1,
            line2: shipping.address2,
            city: shipping.city,
            state: shipping.state,
            country: shipping.country,
            postal_code: shipping.postcode,
          },
          // phone: checkout.shipping.phone, // doesn't exist in WC
          // not currently used in this implementation
          // carrier: null,
          // tracking_number: null,
        },
      }
    )

    return { paymentIntent, error }
  }

  return {
    stripe,
    elements,
    createPaymentSource,
    createPaymentMethod,
    createPaymentIntent,
    confirmCardPayment,
  }
}
