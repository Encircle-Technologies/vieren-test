import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import styled from "styled-components"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  createClientProfile,
  createClientSubscription,
  trackDirectGenerateLead,
  trackDirectMarketingOptin,
} from "../../utils/analytics/klaviyo"
import { trackGenerateLead, trackMarketingOptin } from "../../utils/analytics/gtag"
import { TextInputWithSubmit } from "./Inputs"

const Wrapper = styled.div`
  flex: 1 1 100%;
  margin: 0 0 40px;

  @media (min-width: 1024px) {
    flex: 0 1 350px;
    margin: 0 80px 0 0;
  }

  @media (min-width: 1920px) {
    margin: 0 120px 0 0;
  }
`

const SignupForm = styled(Form)`
  margin: 0 0 10px;
`

const Title = styled.h3`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 1px;
  margin: 0 0 2px;
  /* text-transform: uppercase; */
  text-align: center;

  @media (min-width: 800px) {
    text-align: left;
  }
 
  @media (max-width: 1024px) {
    font-size: 20px;
    line-height: 25px;
  }
`

const Description = styled.p`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 26px;
  letter-spacing: 0.88px;
  margin: 0 0 27px;
  text-align: center;

  @media (min-width: 800px) {
    text-align: left;
  }

  @media (max-width: 1024px) {
    line-height: 24px;
  }
`

const Disclaimer = styled.span`
  color: var(--white);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
`

const Result = styled.div`
  /* Formatting */
  display: flex;
  flex-direction: column;
  /* Styling */
  color: ${({ result }) => (result === "error" ? "#F35858" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 2;
  letter-spacing: 0.61px;
  margin: 1em 0;

  a {
    color: ${({ result }) => (result === "error" ? "#F35858" : "var(--white)")};
  }
`

export default function FooterEmail() {
  const [result, setResult] = useState("")
  const [msg, setMsg] = useState("")
  const { pathname } = useLocation()

  useEffect(() => {
    setResult("")
    setMsg("")
  }, [pathname])

  return (
    <Wrapper>
      <Title>JOIN THE MOVEMENT</Title>
      <Description>Unlock early access to new Swiss masterpieces</Description>
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
            "Website Footer",
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
            await trackDirectGenerateLead(values.email)
          }

          trackMarketingOptin(values.email)
          trackGenerateLead()

          actions.resetForm()
          setTimeout(() => navigate("/thanks"), 250)
        }}
      >
        {formik => (
          <SignupForm>
            <TextInputWithSubmit
              label="Email Address"
              name="email"
              type="text"
              placeholder="Email*"
              aria-label="Subscribe"
            />
            {result && (
              <Result
                result={result}
                dangerouslySetInnerHTML={{ __html: msg }}
              />
            )}
          </SignupForm>
        )}
      </Formik>
      {/* <Disclaimer>
        By joining the list you agree to receive emails from VIEREN
      </Disclaimer> */}
    </Wrapper>
  )
}
