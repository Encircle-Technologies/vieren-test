import React from "react"
import { gql, useMutation } from "@apollo/client"
import { v4 as uuidv4 } from "uuid"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { InlineInputGroup, InlineTextInputWithSubmit } from "../Forms/Inputs"

export default function ForgotPassword() {
  const [sendEmail] = useMutation(ForgotPassword.mutations.FORGOT_PASSWORD)

  return (
    <Formik
      initialValues={{
        username: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .email("Invalid email address")
          .required("Email address is required to reset password"),
      })}
      onSubmit={async (values, actions) => {
        const { username } = values

        const {
          sendResetPasswordEmail: { user },
        } = await sendEmail({
          variables: { input: { clientMutationId: uuidv4(), username } },
        })

        if (user) {
          console.log("Password reset email has been sent to: ", user.email)
        }
      }}
    >
      {formik => (
        <Form>
          <InlineInputGroup>
            <InlineTextInputWithSubmit
              light
              name="username"
              placeholder="Enter an email address to reset password"
              aria-label="Enter your email address to receive a password reset email"
            />
          </InlineInputGroup>
        </Form>
      )}
    </Formik>
  )
}

ForgotPassword.mutations = {
  FORGOT_PASSWORD: gql`
    mutation FORGOT_PASSWORD($input: SendPasswordResetEmailInput!) {
      sendPasswordResetEmail(input: $input) {
        user {
          email
        }
      }
    }
  `,
}
