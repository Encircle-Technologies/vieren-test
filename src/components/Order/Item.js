import React from "react"
// import { Image, ImgSkeleton, TextSkeleton } from "../Elements"
import OrderItem from "../Checkout/Item"

export default function Item({ data, currency }) {
  return <OrderItem data={data} currency={currency} isOrder />
}
