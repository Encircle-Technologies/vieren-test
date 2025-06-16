import { useMutation } from "@apollo/client"
import GET_CART from "../components/Cart/Cart.query.graphql"
import UPDATE_ITEM_QUANTITY from "./UpdateItemQuantity.mutation.graphql"

const updateCartQuantity = function(
  cache,
  {
    data: {
      updateItemQuantities: { updated, cart: newCart },
    },
  }
) {
  // create an identifier for the updated item
  const modifiedItem = {
    __typename: "CartItem",
    key: updated[0].key,
  }
  // modify the cache directly with the new quantity and subtotal
  cache.modify({
    id: cache.identify(modifiedItem),
    fields: {
      quantity: updated.quantity,
      subtotal: updated.subtotal,
    },
  })

  // get the existing cart object
  const { cart: existingCart } = cache.readQuery({
    query: GET_CART,
  })
  // update the cart summary with new totals
  cache.writeQuery({
    query: GET_CART,
    data: {
      cart: {
        ...existingCart,
        isEmpty: newCart.isEmpty,
        contents: {
          ...existingCart.contents,
          itemCount: newCart.contents.itemCount,
        },
        subtotalTax: newCart.subtotalTax,
        discountTax: newCart.discountTax,
        contentsTax: newCart.contentsTax,
        feeTax: newCart.feeTax,
        shippingTax: newCart.shippingTax,
        totalTax: newCart.totalTax,
        subtotal: newCart.subtotal,
        discountTotal: newCart.discountTotal,
        contentsTotal: newCart.contentsTotal,
        feeTotal: newCart.feeTotal,
        shippingTotal: newCart.shippingTotal,
        total: newCart.total,
      },
    },
  })
  // wishful thinking: write directly to the subfields of the identified cart in the cache
  // cache.modify({
  //   id: cache.identify(existingCart),
  //   fields: {
  //     subtotal: newCart.subtotal,
  //     shippingTotal: newCart.shippingTotal,
  //     totalTax: newCart.totalTax,
  //     feeTotal: newCart.feeTotal,
  //     total: newCart.total,
  //   },
  // })
}

export default function useUpdateCart({ variables, ...options }) {
  const [updateCartItemQuantity, { loading, error }] = useMutation(
    UPDATE_ITEM_QUANTITY,
    {
      variables,
      update: updateCartQuantity,
      ...options,
    }
  )

  return [updateCartItemQuantity, { loading, error }]
}
