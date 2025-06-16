import { useMutation } from "@apollo/client"
import GET_CART from "../components/Cart/Cart.query.graphql"
import UPDATE_ITEM_QUANTITY from "./UpdateItemQuantity.mutation.graphql"

const updateDeleteItem = function(
  cache,
  {
    data: {
      updateItemQuantities: { removed, cart: newCart },
    },
  }
) {
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
          nodes: newCart.isEmpty
            ? null
            : existingCart.contents.nodes.filter(
                item => item.key !== removed[0].key
              ),
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
}

export default function useDeleteFromCart({ variables, ...options }) {
  const [deleteCartItem, { loading, error }] = useMutation(
    UPDATE_ITEM_QUANTITY,
    {
      variables,
      update: updateDeleteItem,
      ...options,
    }
  )

  return [deleteCartItem, { loading, error }]
}
