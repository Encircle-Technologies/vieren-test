import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { v4 as uuidv4 } from "uuid"
import APPLY_COUPON from "./ApplyCoupon.mutation.graphql"
import REMOVE_COUPON from "./RemoveCoupon.mutation.graphql"
import GET_CART from "./Cart.query.graphql"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { InlineTextInputWithSubmit } from "../Forms/Inputs"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Button, body, contents } from "../Sections/Accordion"

const Accordion = styled.div`
  border-bottom: 1px solid #bbbbbb;
  margin: 0 0 30px;
`

const AccordionHeader = styled.div``

const AccordionTitle = styled.h4`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin: 0;
  text-align: left;
`

const AccordionBody = styled(motion.div)``

const CouponForm = styled(Form)`
  margin: 0 0 12px;
  width: 100%;
`

const AppliedCoupon = styled.div`
  background: #4d4d4d;
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.86px;
  margin: 0 0 12px;
  padding: 0.25em 4em 0.25em 1em;
  position: relative;
  text-transform: uppercase;

  &::before,
  &::after {
    background-color: var(--white);
    content: "";
    display: block;
    width: 10px;
    height: 1px;

    position: absolute;
    top: 50%;
    right: 10px;
  }

  &::before {
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    transform: translateY(-50%) rotate(135deg);
  }
`

const updateRemove = function(
  cache,
  {
    data: {
      removeCoupons: { cart: newCart },
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
        appliedCoupons: newCart.appliedCoupons,
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

const updateAdd = function(
  cache,
  {
    data: {
      applyCoupon: { cart: newCart },
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
        appliedCoupons: newCart.appliedCoupons,
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

export default function Coupon({ appliedCoupons = [] }) {
  const [applyCoupon] = useMutation(APPLY_COUPON)
  const [removeCoupon] = useMutation(REMOVE_COUPON)
  const [open, setOpen] = useState(false)

  return (
    <>
      {appliedCoupons?.map(coupon => (
        <AppliedCoupon
          key={coupon.code}
          onClick={async () => {
            await removeCoupon({
              variables: {
                input: {
                  clientMutationId: uuidv4(),
                  codes: [coupon.code],
                },
              },
              update: updateRemove,
            })
          }}
        >
          {coupon.code}
        </AppliedCoupon>
      ))}
      {
        <Accordion>
          <AccordionHeader>
            <Button colour={""} $open={open} onClick={() => setOpen(!open)}>
              <AccordionTitle>Member Code</AccordionTitle>
            </Button>
          </AccordionHeader>
          <AnimatePresence>
            {open && (
              <AccordionBody
                initial="closed"
                animate="open"
                exit="closed"
                variants={body}
              >
                <motion.div variants={contents}>
                  {!appliedCoupons?.length && (
                    <Formik
                      initialValues={{ code: "" }}
                      validationSchema={Yup.object({
                        code: Yup.string().required("Required"),
                      })}
                      onSubmit={async ({ code }, actions) => {
                        try {
                          // transform the coupon code to lowercase
                          const formattedCode = code.toLowerCase()

                          const { data } = await applyCoupon({
                            variables: {
                              input: {
                                clientMutationId: uuidv4(),
                                code: formattedCode,
                              },
                            },
                            update: updateAdd,
                          })

                          if (data.applyCoupon) {
                            actions.resetForm()
                          }
                        } catch (err) {
                          actions.setFieldError("code", err.message)
                        }
                      }}
                    >
                      {formik => (
                        <CouponForm>
                          <InlineTextInputWithSubmit
                            light
                            label="Apply Promotion"
                            name="code"
                            type="text"
                            placeholder="Apply promotion code"
                            aria-label="Apply"
                          />
                        </CouponForm>
                      )}
                    </Formik>
                  )}
                </motion.div>
              </AccordionBody>
            )}
          </AnimatePresence>
        </Accordion>
      }
    </>
  )
}
