import { useMutation } from "@apollo/client"
import GET_CART from "../components/Cart/Cart.query.graphql"
import ADD_TO_CART from "./AddToCart.mutation.graphql"

const update = function(
  cache,
  {
    data: {
      addToCart: { cart: newCart },
    },
  }
) {
  const { cart: existingCart } = cache.readQuery({
    query: GET_CART,
  })

  cache.writeQuery({
    query: GET_CART,
    data: {
      cart: {
        ...existingCart,
        contents: {
          ...existingCart.contents,
          itemCount: newCart.contents.itemCount,
        },
      },
    },
  })
}

export default function useAddToCart(props) {
  const [addToCart, { data, loading, error }] = useMutation(ADD_TO_CART, {
    update,
    ...props,
  })

  return [addToCart, { data, loading, error }]
}
