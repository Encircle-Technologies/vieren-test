import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"
import { SubsectionTitle } from "./Elements"
import Address from "../Account/Address"

const Container = styled.section`
  margin: 50px 0 0;
`

export default function Billing() {
  const {
    watch,
    setValue,

    formState: { isSubmitting },
  } = useFormContext()
  const billingSame = watch("billingSame")
  const shipping = watch("shipping")

  useEffect(() => {
    process.env.NODE_ENV === "development" &&
      console.log(`[DEBUG] shipping object is: `, shipping)
    // if the "same as shipping address" checkbox is checked, copy data from the shipping
    // run this update anytime the shipping values change
    if (billingSame) {
      setValue("billing", shipping)
    }
  }, [billingSame, shipping, setValue])

  if (billingSame) {
    return null
  }

  return (
    <Container>
      <SubsectionTitle>Billing Address</SubsectionTitle>

      {!billingSame && <Address type={Address.types.BILLING} />}
    </Container>
  )
}
