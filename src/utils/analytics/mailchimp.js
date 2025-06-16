import { getWooSession } from "../session"

export const createAbandonedCart = async (cart, currency, customer) =>
  await fetch("/.netlify/functions/abandon", {
    method: "POST",
    body: JSON.stringify({
      type: "create",
      sessionId: getWooSession(),
      cart,
      currency,
      customer,
    }),
  })

export const getAbandonedCart = async sessionId =>
  await fetch("/.netlify/functions/abandon", {
    method: "POST",
    body: JSON.stringify({
      type: "get",
      sessionId,
    }),
  })

export const deleteAbandonedCart = async sessionId =>
  await fetch("/.netlify/functions/abandon", {
    method: "POST",
    body: JSON.stringify({
      type: "delete",
      sessionId,
    }),
  })

export const sendOrder = async (order, currency) =>
  await fetch("/.netlify/functions/abandon", {
    method: "POST",
    body: JSON.stringify({ type: "send", order, currency }),
  })
