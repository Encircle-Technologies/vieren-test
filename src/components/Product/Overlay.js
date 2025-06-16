import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { useMember } from "../../hooks/useMember"
import * as Yup from "yup"
import styled from "styled-components"

import { ButtonAsButton } from "../Elements/Button"
import MemberOverlay from "../Auth/MemberOverlay"
import ArrowIcon from "../../images/icons/arrow.svg"

import Section from "../Layout/Section"
import Grid from "../Layout/Grid"
import { getElements } from "../../utils/layout/elements"

// Formik -> React Hook Forms Refactor
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { InputGroup } from "../Forms/RHF/InputGroup"
import { TextInput } from "../Forms/RHF/TextInput"

const Background = styled.div`
  background-color: var(--black);
  opacity: 1;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: Center;

  height: 100%;
  width: 100%;
`

const Elements = styled.div``

const Caption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50% auto 0;
  max-width: 343px;

  @media (min-width: 768px) {
    margin: 50% auto 0;
    max-width: 500px;
  }

  @media (min-width: 1280px) {
    margin: 20% auto 0;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 800px) {
    width: 430px;
  }
`

const EnterButton = styled(ButtonAsButton)`
  background-color: #767676;
  margin: 0 0 30px;
`

const Register = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: var(--white);
  cursor: pointer;
  justify-self: center;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin: 0;
  padding: 0;

  svg {
    height: 10px;
  }
`

export default function Overlay({ location, content }) {
  const { isMember, setMemberState } = useMember()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isMember) navigate(location?.state?.back)
  }, [isMember])

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      passCode: "",
    },
    resolver: yupResolver(
      Yup.object({
        passCode: Yup.string().required("Membership Code is required"),
      })
    ),
  })

  const onSubmit = async formData => {
    console.log("[DEBUG] submitting with data: ", formData)
    const res = await fetch("/.netlify/functions/preorder", {
      method: "POST",
      body: JSON.stringify({ passcode: formData.passCode }),
    })

    const { result, error } = await res.json()

    if (result === "success") {
      setMemberState(true)
    } else if (result === "failure") {
      methods.setError("passCode", { message: error.message })
      // actions.setFieldError("passCode", error.message)
    }
  }

  return (
    <>
      <Background>
        <Section background={content?.background} stacking="center">
          <Grid style={{ height: "100%", alignContent: "center" }}>
            <Content>
              <Elements>
                {getElements({
                  type: `WpPreorder_Content`,
                  elements: content.elements,
                })}
              </Elements>
              <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onSubmit)}>
                  {/* <OverlayForm /> */}
                  <InputGroup>
                    <TextInput
                      type="password"
                      name="passCode"
                      label="Pass Code"
                      placeholder="Access code"
                      aria-label="Required field: please enter your membership code"
                    />
                  </InputGroup>
                  <InputGroup>
                    <EnterButton
                      type="submit"
                      flex
                      disabled={methods?.formState?.isSubmitting}
                    >
                      {methods?.formState?.isSubmitting
                        ? "SUBMITTING..."
                        : "SUBMIT"}
                    </EnterButton>
                  </InputGroup>
                  <InputGroup
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Register type="button" onClick={() => setOpen(true)}>
                      <span>
                        Don't have a code? Become a Member <ArrowIcon />
                      </span>
                    </Register>
                  </InputGroup>
                </Form>
              </FormProvider>
            </Content>
          </Grid>
        </Section>
      </Background>
      {open && <MemberOverlay setOpen={setOpen} />}
    </>
  )
}
