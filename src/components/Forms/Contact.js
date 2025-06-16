import React from "react"
import { navigate } from "gatsby"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import styled from "styled-components"
import Grid from "../Layout/Grid"
import {
  TextInput,
  TextAreaInput,
  CheckboxInput,
  InputGroup,
  Submit,
} from "./Inputs"
import { H2 } from "../Elements/H2"
import { P } from "../Elements/P"

const Intro = styled.section`
  padding: 80px 0 20px;

  a {
    color: #000000;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    text-decoration: none;
  }
`

const ContactForm = styled(Form)`
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

const Disclaimer = styled(P)`
  color: #767676;
  font-size: 11px;
  line-height: 22px;
  letter-spacing: 0.61px;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 11px;
    line-height: 22px;
  }
`

const Contact = () => {
  // helper function for Netlify Form Submission
  const encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

  return (
    <Grid>
      <Intro>
        <H2 as="h1" style={{ textAlign: "center" }}>
          Contact Us
        </H2>
        <P style={{ textAlign: "center" }}>
          Let's talk! Send us a message at{" "}
          <a href="mailto:hello@vieren.co">hello@vieren.co</a> or fill in the
          form below.
        </P>
      </Intro>

      <Formik
        initialValues={{
          "bot-field": "",
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          marketing: false,
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          email: Yup.string()
            .email("Invalid Email Address")
            .required("Required"),
          message: Yup.string().required("Required"),
          marketing: Yup.boolean(),
        })}
        onSubmit={(values, actions) => {
          fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact", ...values }),
          })
            .then(() => {
              actions.resetForm()
            })
            .catch(() => {
              console.log("Error submitting form")
            })
            .finally(() => {
              actions.setSubmitting(false)
              navigate("/success")
            })
        }}
      >
        {formik => (
          <ContactForm
            name="contact"
            netlify-honeypot="bot-field"
            data-netlify={true}
          >
            <Field type="hidden" name="bot-field" />
            <InputGroup>
              <TextInput
                label="First Name"
                name="firstName"
                type="text"
                placeholder="First Name*"
                aria-label="First Name"
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Last Name*"
                aria-label="Last Name"
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="Email*"
                aria-label="Email"
              />
            </InputGroup>
            <InputGroup>
              <TextAreaInput
                label="Message"
                name="message"
                placeholder="Message*"
                rows="5"
                aria-label="Message"
              />
            </InputGroup>
            <InputGroup>
              <CheckboxInput
                label="Yes, please send me emails about future product releases."
                type="checkbox"
                name="marketing"
                id="marketing"
              />
            </InputGroup>
            <Disclaimer>*Required fields</Disclaimer>
            <Submit type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Sending..." : "Submit"}
            </Submit>
          </ContactForm>
        )}
      </Formik>
    </Grid>
  )
}

export default Contact
