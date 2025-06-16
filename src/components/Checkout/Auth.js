import React, { useState, useEffect } from "react"
import { useFormikContext } from "formik"
import { useCustomer } from "../../hooks/useCustomer"
import { identifyUser } from "../../utils/analytics/segment"
import styled from "styled-components"
import Login from "./Login"
import {
  InlineInputGroup,
  CheckboxInput,
  InlineTextInput,
} from "../Forms/Inputs"
import { LinkAsButton } from "../Elements/Link"
import ArrowIcon from "../../images/icons/arrow.svg"

import { useMutation } from "@apollo/client"
import LoginUserMutation from "../Auth/Login.mutation.graphql"
import LogoutUserMutation from "../Auth/Logout.mutation.graphql"
import { v4 as uuidv4 } from "uuid"

const Container = styled.section`
  margin: 0 0 60px;
`

const Greeting = styled.span`
  color: var(--gray);
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  letter-spacing: 0.89px;
  margin: 0 0 20px;
`

const LogoutButton = styled(LinkAsButton)`
  color: var(--black);
  display: flex;
  align-items: center;
`

const Message = styled.span`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.88px;
`

export default function Auth({ setUserEmail }) {
  const {
    data,
    loading: customerLoading,
    error: customerError,
    resetCustomer,
    refetchViewer,
  } = useCustomer()
  const {
    values: {
      account: { createAccount, username },
    },
    getFieldMeta,
    setFieldValue,
  } = useFormikContext()

  const [loginUser] = useMutation(LoginUserMutation)
  const [logoutUser] = useMutation(LogoutUserMutation)

  const [userExists, setUserExists] = useState(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data?.customer?.username) {
      setFieldValue("account.createAccount", false)
      setFieldValue("account.username", data.customer.username)
    }
  }, [data])

  useEffect(() => {
    if (userExists) {
      setFieldValue("account.createAccount", false)
    }
  }, [userExists])

  const handleValidate = async () => {
    const { error } = getFieldMeta("account.username")

    if (!error) {
      setLoading(true)

      try {
        await loginUser({
          variables: {
            input: {
              login: username,
              password: "justchecking",
            },
          },
        })
      } catch (err) {
        if (err.message === "incorrect_password") {
          setUserExists(true)
          identifyUser({ email: username })
        } else if (err.message === "invalid_email") {
          setUserExists(false)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setUserExists(null)
    }
    setUserEmail(username)
  }

  if (customerLoading)
    return (
      <InlineInputGroup>
        <Message>Loading...</Message>
      </InlineInputGroup>
    )

  if (customerError)
    return (
      <InlineInputGroup>
        <Message>`Error: ${JSON.stringify(customerError, null, 2)}`</Message>
      </InlineInputGroup>
    )

  if (data && data.customer)
    return (
      <Container>
        <InlineInputGroup>
          <Greeting>{`Good evening, ${data.customer.firstName}`}</Greeting>
          <LogoutButton
            type="button"
            onClick={async () => {
              await resetCustomer()
              await logoutUser({
                variables: { input: { clientMutationId: uuidv4() } },
              })
            }}
          >
            {`Sign in with another email `}
            <ArrowIcon style={{ marginLeft: "1ch" }} />
          </LogoutButton>
        </InlineInputGroup>
      </Container>
    )

  return (
    <Container>
      <InlineInputGroup>
        <InlineTextInput
          light
          name="account.username"
          placeholder="Email address*"
          aria-label="Enter an email to get started."
          handleBlur={handleValidate}
        />
      </InlineInputGroup>
      {loading && (
        <InlineInputGroup>
          <Message style={{ fontWeight: "400" }}>
            Searching for member email...
          </Message>
        </InlineInputGroup>
      )}
      {!loading && userExists === null && (
        <InlineInputGroup>
          <Message>Please enter an email to get started</Message>
        </InlineInputGroup>
      )}
      {!loading && userExists === true && (
        <Login refetchViewer={refetchViewer} />
      )}
      {!loading && userExists === false && (
        <InlineInputGroup>
          <CheckboxInput
            label="Become a Member for express checkout"
            name="account.createAccount"
            id="account.createAccount"
          />
        </InlineInputGroup>
      )}
      {userExists === false && createAccount && (
        <>
          <InlineInputGroup>
            <InlineTextInput
              light
              name="account.password"
              type="password"
              placeholder="Create Password*"
              aria-label="Enter a password"
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <InlineTextInput
              light
              name="account.verifyPassword"
              type="password"
              placeholder="Confirm Password*"
              aria-label="Enter a password"
            />
          </InlineInputGroup>
        </>
      )}
    </Container>
  )
}
