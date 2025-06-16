import React from "react"
import Head from "../components/Layout/Head"
import FormSuccess from "../components/Layout/FormSuccess"

const SuccessPage = () => {
  return (
    <>
      <Head pageTitle={"Success - Thank you for your submission."} />
      <FormSuccess />
    </>
  )
}

export default SuccessPage
