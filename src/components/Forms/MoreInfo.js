import React from "react"
import { navigate } from "gatsby"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import styled from "styled-components"
import Grid from "../Layout/Grid"
import { TextInput, DateInput, InputGroup, Submit } from "./Inputs"
import Jess from "../../images/icons/jess.svg"
import Sun from "../../images/icons/sun.svg"

const Intro = styled.section`
  padding: 50px 0 20px;
  max-width: 600px;
  margin: 0 auto;

  h1 {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 28px;
    letter-spacing: 0.37px;
    text-transform: uppercase;

    @media (min-width: 800px) {
      font-size: 38px;
    }
  }

  h2 {
    /* font-family: "Lato", sans-serif;
    font-weight: 300; */
    font-size: 24px;
    line-height: 34px;
    letter-spacing: 0.32px;
    margin-bottom: 20px;
    text-align: center;
    text-transform: none;

    @media (min-width: 800px) {
      font-size: 30px;
      line-height: 40px;
      letter-spacing: 0.39px;
      margin-bottom: 26px;
    }
  }

  a {
    color: #000000;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    text-decoration: none;
  }

  h1,
  p {
    text-align: center;
  }
`

const Outro = styled(Intro)`
  padding: 0;

  .signatures {
    display: flex;
    justify-content: center;
    padding: 50px 0 20px;
  }

  .names {
    color: #3b3b3b;
    font-size: 11px;
  }
`

const MoreInfoForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 0 100px;
  width: calc(10 / 12 * 100vw);

  @media (min-width: 800px) {
    width: 454px;
  }
`

const Disclaimer = styled.p`
  color: #3b3b3b;
  font-size: 11px;
  line-height: 22px;
  letter-spacing: 0.61px;
  text-align: center;
`

const MoreInfo = ({ email }) => {
  const encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

  return (
    <Grid>
      <Intro>
        <h2>
          Let us know a bit more about you, so we can give you the best
          experience.
        </h2>
      </Intro>
      <Formik
        initialValues={{
          "bot-field": "",
          email: email,
          fullName: "",
          birthday: "",
        }}
        validationSchema={Yup.object({
          fullName: Yup.string().required("Required"),
          birthday: Yup.date(),
        })}
        onSubmit={(values, actions) => {
          fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "more-info", ...values }),
          })
            .then(() => {
              actions.resetForm()
            })
            .catch(() => {
              console.log("Error submitting form")
            })
            .finally(() => {
              actions.setSubmitting(false)
              navigate("/")
            })
        }}
      >
        {formik => (
          <MoreInfoForm
            name="more-info"
            netlify-honeypot="bot-field"
            data-netlify={true}
          >
            <Field type="hidden" name="bot-field" />
            <Field type="hidden" name="email" />
            <InputGroup>
              <TextInput
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Full Name"
                aria-label="Full Name"
              />
            </InputGroup>
            <InputGroup>
              <DateInput
                label="Birthday"
                name="birthday"
                type="date"
                placeholder="Birthday (YYYY-MM-DD)"
                aria-label="Birthday"
              />
            </InputGroup>
            <Disclaimer>*We celebrate birthdays (optional)</Disclaimer>

            <Submit type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Sending..." : "Submit"}
            </Submit>
          </MoreInfoForm>
        )}
      </Formik>

      <Outro>
        <p>
          Thank you for joining our list. You'll be receiving an email with
          details of our launch.
        </p>
        <span className="signatures">
          <Jess />
          <Sun />
        </span>
        <p className="names">Jess & Sunny</p>
      </Outro>
    </Grid>
  )
}

export default MoreInfo
