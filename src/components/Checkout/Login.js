import React, { useState, useEffect, useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useFormikContext } from "formik"
import { setAuthToken, setRefreshToken } from "../../utils/apollo/auth"
import styled from "styled-components"
import {
  InlineInputGroup,
  InlineTextInput,
  InlineSubmit,
} from "../Forms/Inputs"
import ArrowSvg from "../../images/icons/arrow.svg"

import LoginUserMutation from "../Auth/Login.mutation.graphql"
import GetViewerQuery from "../Auth/Viewer.query.graphql"

const Message = styled.span`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.88px;
`

const Arrow = styled(({ light, ...rest }) => <ArrowSvg {...rest} />)`
  color: ${({ light }) => (light ? "#818181" : "var(--white)")};
`

export default function Login({ refetchViewer }) {
  const [loginUser] = useMutation(LoginUserMutation)
  const [submitting, setSubmitting] = useState(false)

  const {
    values: {
      account: { username, password },
    },
    setFieldError,
  } = useFormikContext()

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)

    try {
      const { data } = await loginUser({
        variables: {
          input: {
            login: username,
            password,
          },
        },
      })

      if (data?.loginWithCookies?.status === "SUCCESS") {
        await refetchViewer()
      }
    } catch (err) {
      console.log(err.message)
      if (err.message === "incorrect_password") {
        setFieldError("account.password", "Incorrect Password")
      } else {
        setFieldError("account.password", err.message)
      }
    }
    setSubmitting(false)
  }, [loginUser, username, password, setFieldError, setSubmitting])

  useEffect(() => {
    const element = document && document.getElementById("account.password")

    const handleEnterKeyUp = async event => {
      if (event.keyCode === 13) {
        event.preventDefault()

        await handleSubmit()
      }
    }

    element && element.addEventListener("keyup", handleEnterKeyUp)

    return () =>
      element && element.removeEventListener("keyup", handleEnterKeyUp)
  }, [handleSubmit])

  return (
    <>
      <InlineInputGroup>
        <Message>Please enter your password to checkout as a Member</Message>
      </InlineInputGroup>
      <InlineInputGroup>
        <span style={{ position: "relative" }}>
          <InlineTextInput
            light
            type="password"
            id="account.password"
            name="account.password"
            placeholder="Password*"
            aria-label="Enter a password"
          />
          <InlineSubmit light type="button" onClick={handleSubmit}>
            <Arrow light />
          </InlineSubmit>
        </span>
        {submitting && <Message>Logging in....</Message>}
      </InlineInputGroup>
    </>
  )
}
