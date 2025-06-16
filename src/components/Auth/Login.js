import React from "react"
import { navigate } from "gatsby"
import { useMutation } from "@apollo/client"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  Message,
  InlineInputGroup,
  InlineTextInput,
  InlinePasswordInput,
} from "../Forms/Inputs"
import { LinkAsButton } from "../Elements/Link"

import LoginUserMutation from "./Login.mutation.graphql"
import GetViewerQuery from "./Viewer.query.graphql"

export default function Login({ onForgotPassword }) {
  const [loginUser] = useMutation(LoginUserMutation, {
    fetchPolicy: "no-cache",
    refetchQueries: [{ query: GetViewerQuery }],
    awaitRefetchQueries: true,
    onCompleted: data => {
      if (data?.loginWithCookies?.status === "SUCCESS") {
        // returns the user to the auth prompting resource
        navigate(-1)
      }
    },
  })

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .email("Invalid email address")
          .required("Email is required to sign in"),
        password: Yup.string().required("Password is required to sign in"),
      })}
      onSubmit={async (values, actions) => {
        const { username, password } = values

        try {
          await loginUser({
            variables: {
              input: {
                login: username,
                password,
              },
            },
          })
        } catch (err) {
          console.log(err.message)
          if (err.message === "incorrect_password") {
            actions.setFieldError("password", "Incorrect Password")
          } else {
            actions.setFieldError("password", err.message)
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InlineInputGroup>
            <InlineTextInput
              light
              name="username"
              placeholder="Email address"
              aria-label="Enter your email address to log in."
              disabled={isSubmitting}
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <InlinePasswordInput
              light
              name="password"
              placeholder="Password"
              aria-label="Enter your password"
              disabled={isSubmitting}
            />
            {isSubmitting && <Message>Logging in...</Message>}
          </InlineInputGroup>
          <InlineInputGroup
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <LinkAsButton
              light
              type="button"
              onClick={() => onForgotPassword()}
              disabled={isSubmitting}
            >
              Forgot password?
            </LinkAsButton>
          </InlineInputGroup>
        </Form>
      )}
    </Formik>
  )
}
