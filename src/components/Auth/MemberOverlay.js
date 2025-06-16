import React, { useState } from "react"
import { navigate } from "gatsby"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  createClientProfile,
  createClientSubscription,
  trackDirectMarketingOptin,
  trackDirectGenerateLead,
} from "../../utils/analytics/klaviyo"
import {
  trackGenerateLead,
  trackMarketingOptin,
} from "../../utils/analytics/gtag"
import styled from "styled-components"
import { motion } from "framer-motion"
import { H2 } from "../Elements/H2"
import { P } from "../Elements/P"
import { ButtonAsButton } from "../Elements/Button"
import { Message, Error, InputGroup, TextInput } from "../Forms/Inputs"
import LogoSmall from "../../images/logos/logo_modal_black.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

const Background = styled(motion.div)`
  background-color: var(--black);
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
`

const Container = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;

  @media (min-width: 768px) {
    top: 50%;
    left: 50%;
    width: 680px;
    transform: translate3d(-50%, -50%, 0);
  }

  @media (min-width: 1280px) {
    width: 740px;
    max-width: 740px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  padding: 55px 0 30px;
`

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 25px;
  right: 25px;

  svg {
    display: block;
    height: 20px;
    width: 20px;

    g {
      fill: var(--black);
    }
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 25px 100px;
  @media (min-width: 768px) {
    padding: 70px 130px 85px;
  }
`

const CTA = styled.div`
  max-width: 335px;
`

export default function MemberOverlay({ setOpen }) {
  const [result, setResult] = useState()
  const [msg, setMsg] = useState()

  return (
    <>
      <Background onClick={() => setOpen(false)} />
      <Container>
        <CloseButton type="button" onClick={() => setOpen(false)}>
          <CloseIcon />
        </CloseButton>
        <Header>
          <LogoSmall style={{ height: "25px", marginBottom: "40px" }} />
        </Header>
        {result === "success" && (
          <Body style={{ padding: "100px 25px 150px" }}>
            <H2>Check Your Email</H2>
            <P style={{ margin: "0", textAlign: "center" }} as="p">
              Your access code has been sent for you to preview our new special
              edition timepiece
            </P>
          </Body>
        )}
        {result !== "success" && (
          <Body>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
              })}
              onSubmit={async (values, actions) => {
                /**
                  Hybrid Direct + sGTM implementation
                */

                const createProfileResponse = await createClientProfile(
                  values.email
                )

                if (createProfileResponse.status !== 202) {
                  const createProfileResult = await createProfileResponse.json()

                  if (createProfileResult.errors) {
                    const [error, ..._rest] = createProfileResult.errors

                    setResult("error")
                    actions.setFieldError(
                      "email",
                      `${error.title} ${error.detail}`
                    )

                    return
                  }
                }

                const createSubscriptionResponse = await createClientSubscription(
                  values.email,
                  "Waitlist",
                  process.env.GATSBY_KLAVIYO_LIST_ID
                )

                if (createSubscriptionResponse.status !== 202) {
                  const createSubscriptionResult = await createSubscriptionResponse.json()

                  if (createSubscriptionResult.errors) {
                    const [error, ..._rest] = createSubscriptionResult.errors

                    setResult("error")
                    actions.setFieldError(
                      "email",
                      `${error.title} ${error.detail}`
                    )

                    return
                  }
                }

                if (
                  !(
                    window.google_tag_manager &&
                    window.google_tag_manager.dataLayer
                  )
                ) {
                  await trackDirectMarketingOptin(values.email)
                  await trackDirectGenerateLead(values.email)
                }

                trackMarketingOptin(values.email)
                trackGenerateLead()

                actions.resetForm()
                setTimeout(() => navigate("/gold-mirror-waitlist/thanks"), 1000)
              }}
            >
              {({ isSubmitting }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <H2 style={{ textAlign: "center" }}>Become a Member</H2>
                  <P style={{ textAlign: "center", margin: "0 0 25px" }} as="p">
                    Sign up to receive an Access Code to preview the new special
                    edition timepiece
                  </P>
                  <CTA>
                    <InputGroup>
                      <TextInput
                        name="email"
                        label="Email"
                        type="text"
                        placeholder="Email"
                        disabled={isSubmitting}
                      />
                    </InputGroup>
                    <InputGroup>
                      <ButtonAsButton
                        flex
                        type="submit"
                        style={{ backgroundColor: "var(--gray)" }}
                      >
                        {isSubmitting ? `Signing up...` : `Sign Up`}
                      </ButtonAsButton>
                    </InputGroup>
                    <InputGroup>
                      <Message
                        style={{ color: "var(--gray)", lineHeight: "15px" }}
                      >
                        By joining the list you agree to receive emails from
                        VIEREN
                      </Message>
                      {result !== "success" && (
                        <Error dangerouslySetInnerHTML={{ __html: msg }} />
                      )}
                    </InputGroup>
                  </CTA>
                </Form>
              )}
            </Formik>
          </Body>
        )}
      </Container>
    </>
  )
}
