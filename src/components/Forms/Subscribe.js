import React, { useState } from "react"
import { navigate } from "gatsby"
import { Formik, Form } from "formik"
import { TextInput, InputGroup, Submit } from "./Inputs"
import * as Yup from "yup"
import styled from "styled-components"
import { useLayout } from "../../hooks/useLayout"
import {
  createClientProfile,
  createClientSubscription,
  trackDirectDownloadConfirmation,
  trackDirectMarketingOptin,
  trackDirectGenerateLead,
} from "../../utils/analytics/klaviyo"
import {
  trackDownloadConfirmation,
  trackGenerateLead,
  trackMarketingOptin,
} from "../../utils/analytics/gtag"

const SubscribeForm = styled(Form)`
  /* css goes here */
`

const CmsSubmit = styled(Submit)`
  background-color: ${({ background }) =>
    background.colour.mobile || "var(--gray)"};
  color: ${({ text }) => text.colour.mobile || "var(--white)"};

  &:hover {
    background-color: ${({ background }) =>
      background.hoverColour.mobile || "var(--black)"};

    color: ${({ text }) => text.hoverColour.mobile || "var(--white)"};
  }

  @media (min-width: 800px) {
    background-color: ${({ background }) =>
      background.colour.desktop || "var(--gray)"};
    color: ${({ text }) => text.colour.desktop || "var(--white)"};

    &:hover {
      background-color: ${({ background }) =>
        background.hoverColour.desktop || "var(--black)"};

      color: ${({ text }) => text.hoverColour.desktop || "var(--white)"};
    }
  }
`

const Disclaimer = styled.div`
  color: ${props =>
    props.textColourMobile ? props.textColourMobile : "#ffffff"};
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 2;
  letter-spacing: 0.61px;
  margin: 1em 0;
  text-align: center;

  @media (min-width: 800px) {
    color: ${props =>
      props.textColourDesktop ? props.textColourDesktop : "#ffffff"};
  }
`

const Result = styled.div`
  /* Formatting */
  display: flex;
  flex-direction: column;
  /* Styling */
  color: ${props => (props.result === "error" ? "var(--red)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 2;
  letter-spacing: 0.61px;
  margin: 1em 0;
  text-align: center;

  a {
    color: ${({ result }) =>
      result === "error" ? "var(--red)" : "var(--white)"};
  }
`

const Subscribe = ({ isPdp = true, disclaimer, button, tag, successPage }) => {
  const [result, setResult] = useState("")
  const [msg, setMsg] = useState("")
  const { dispatchLayout } = useLayout()

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid Email Address")
          .required("Required"),
      })}
      onSubmit={async (values, actions) => {
        /**
          Hybrid Direct + sGTM implementation
         */

        const createProfileResponse = await createClientProfile(values.email)

        if (createProfileResponse.status !== 202) {
          const createProfileResult = await createProfileResponse.json()

          if (createProfileResult.errors) {
            const [error, ..._rest] = createProfileResult.errors

            setResult("error")
            actions.setFieldError("email", `${error.title} ${error.detail}`)

            return
          }
        }

        const createSubscriptionResponse = await createClientSubscription(
          values.email,
          tag || "Subscribe Form",
          process.env.GATSBY_KLAVIYO_LIST_ID
        )

        if (createSubscriptionResponse.status !== 202) {
          const createSubscriptionResult = await createSubscriptionResponse.json()

          if (createSubscriptionResult.errors) {
            const [error, ..._rest] = createSubscriptionResult.errors

            setResult("error")
            actions.setFieldError("email", `${error.title} ${error.detail}`)

            return
          }
        }

        if (
          !(window.google_tag_manager && window.google_tag_manager.dataLayer)
        ) {
          await trackDirectMarketingOptin(values.email)

          if (tag === "PDF") {
            await trackDirectDownloadConfirmation(values.email)
          } else {
            await trackDirectGenerateLead(values.email)
          }
        }

        trackMarketingOptin(values.email)

        if (tag === "PDF") {
          trackDownloadConfirmation()
        } else {
          trackGenerateLead()
        }

        actions.resetForm()
        dispatchLayout({ type: "reset" })
        setTimeout(() => navigate(successPage?.uri || `/thanks`), 1000)
      }}
    >
      {formik => (
        <SubscribeForm>
          <InputGroup {...(isPdp && { style: { marginBottom: "15px" } })}>
            <TextInput
              label="Email"
              name="email"
              type="text"
              placeholder="Email"
              aria-label="Subscribe"
              {...(isPdp && { style: { height: "45px", padding: "0 13px" } })}
            />
          </InputGroup>
          <InputGroup>
            <CmsSubmit
              background={button.background}
              text={button.text}
              {...(isPdp && { style: { height: "45px" } })}
            >
              {formik.isSubmitting ? "Sending..." : button.text.content}
            </CmsSubmit>
            <Disclaimer
              textColourMobile={disclaimer.colour.mobile || "#4d4d4d"}
              textColourDesktop={disclaimer.colour.desktop || "#4d4d4d"}
              dangerouslySetInnerHTML={{ __html: disclaimer.text }}
            />
          </InputGroup>
          {result && (
            <Result result={result} dangerouslySetInnerHTML={{ __html: msg }} />
          )}
        </SubscribeForm>
      )}
    </Formik>
  )
}

export default Subscribe
