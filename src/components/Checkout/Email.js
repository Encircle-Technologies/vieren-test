import React from "react"
import { useFormContext } from "react-hook-form"
import {
  InlineInputGroup,
  InlineSplitInputGroup,
} from "../Forms/RHF/InputGroup"

import { InlineTextInput } from "../Forms/RHF/TextInput"
import { CheckboxInput } from "../Forms/RHF/CheckboxInput"
import { SubsectionTitle } from "./Elements"

import styled from "styled-components"

const OutputText = styled.span`
  display: block;
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
`

const Container = styled.section``

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const EditButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  text-decoration: underline;
`

export default function Email({ checkoutStep, setCheckoutStep, setUserEmail }) {
  const { watch } = useFormContext()
  const [email, firstName, lastName] = watch(["email", "firstName", "lastName"])

  return (
    <Container>
      <Header>
        <SubsectionTitle>Contact</SubsectionTitle>
        {checkoutStep === 2 && (
          <EditButton onClick={() => setCheckoutStep(1)}>Edit</EditButton>
        )}
      </Header>
      {checkoutStep === 1 ? (
        <>
          <InlineInputGroup>
            <InlineTextInput
              light
              name="email"
              placeholder="Email address"
              aria-label="Required field: Please enter your email address"
              onBlur={e => setUserEmail(e.target.value)}
            />
          </InlineInputGroup>
          <InlineSplitInputGroup>
            <InlineInputGroup>
              <InlineTextInput
                light
                name="firstName"
                placeholder="First name"
                aria-label="Please enter your first name"
              />
            </InlineInputGroup>
            <InlineInputGroup>
              <InlineTextInput
                light
                name="lastName"
                placeholder="Last name"
                aria-label="Please enter your last name"
              />
            </InlineInputGroup>
          </InlineSplitInputGroup>
          <CheckboxInput
            type="checkbox"
            name="marketingOptIn"
            label="Sign up for emails and exclusives"
            value={true}
          />
        </>
      ) : (
        <>
          <OutputText>{`${firstName} ${lastName}`}</OutputText>
          <OutputText>{email}</OutputText>
        </>
      )}
    </Container>
  )
}
