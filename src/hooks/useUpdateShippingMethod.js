import { useMutation } from "@apollo/client"
import UPDATE_SHIPPING_METHOD from "../components/Checkout/Shipping.mutation.graphql"
import GET_CART_FOR_CHECKOUT from "../components/Checkout/Checkout.query.graphql"

export default function useUpdateShippingMethod(options = {}) {
  const [updateShippingMethod, { data, loading, error }] = useMutation(
    UPDATE_SHIPPING_METHOD,
    {
      update: (cache, mutationResult) => {
        const { cart: existingCart } = cache.readQuery({
          query: GET_CART_FOR_CHECKOUT,
        })

        const { cart: newCart } = mutationResult.data.updateShippingMethod

        cache.writeQuery({
          query: GET_CART_FOR_CHECKOUT,
          data: {
            cart: {
              ...existingCart,
              needsShippingAddress: newCart.needsShippingAddress,
              availableShippingMethods: newCart.availableShippingMethods,
              chosenShippingMethods: newCart.chosenShippingMethods,
              shippingTax: newCart.shippingTax,
              shippingTotal: newCart.shippingTotal,
              totalTax: newCart.totalTax,
              totalTaxes: newCart.totalTaxes,
              total: newCart.total,
            },
          },
        })
      },
      ...options,
    }
  )

  return [updateShippingMethod, { data, loading, error }]
}
