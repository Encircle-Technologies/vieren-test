import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  createClientProfile,
  createClientSubscription,
} from "../../utils/analytics/klaviyo"
import { trackLead, identifyUser } from "../../utils/analytics/segment"
import styled from "styled-components"
import Grid from "../../components/Layout/Grid"
import { H2 } from "../../components/Elements/H2"
import { P } from "../../components/Elements/P"
import { ButtonAsButton } from "../../components/Elements/Button"
import {
  InputGroup,
  InlineInputGroup,
  InlineThirdsInputGroup,
  InlineTextInput,
  InlineDropdownInput,
  Message,
  Error,
} from "../../components/Forms/Inputs"

const months = [
  { name: "January", value: 1, days: 31 },
  { name: "February", value: 2, days: 28 },
  { name: "March", value: 3, days: 31 },
  { name: "April", value: 4, days: 30 },
  { name: "May", value: 5, days: 31 },
  { name: "June", value: 6, days: 30 },
  { name: "July", value: 7, days: 31 },
  { name: "August", value: 8, days: 31 },
  { name: "September", value: 9, days: 30 },
  { name: "October", value: 10, days: 31 },
  { name: "November", value: 11, days: 30 },
  { name: "December", value: 12, days: 31 },
]

const datetime = new Date()
// get the current year
const currentYear = datetime.getFullYear()
// registration available for 18 and older
const startYear = currentYear - 17

const years = Array.from(Array(100)).map((_, i) => startYear - (i + 1))

const isLeapYear = year => {
  if (year) {
    const yearInt = parseInt(year)

    const conditionOne = yearInt % 4 === 0
    const conditionTwo = yearInt % 100 !== 0
    const conditionThree = yearInt % 400 === 0

    switch (true) {
      case conditionOne && conditionThree:
        return true
      case conditionOne && conditionTwo:
        return true
      default:
        return false
    }
  }
}

const getDaysInMonth = (month, isLeapYear) => {
  if (month) {
    const monthInt = parseInt(month)

    const { days } = months.find(month => month.value === monthInt)

    if (monthInt === 2 && isLeapYear) return 29
    else return days
  }
}

const Container = styled.section`
  padding: 110px 0;

  @media (min-width: 800px) {
    padding: 160px 0 180px;
  }
`

const Content = styled.div`
  @media (min-width: 800px) {
    max-width: 500px;
    margin: auto;
  }
`

const Headline = styled(H2)`
  color: var(--black);
  text-align: center;
`
const Description = styled(P)`
  color: var(--gray);
  margin: 0 0 20px;
  text-align: center;
`

const ImgContainer = styled.div`
  width: 215px;
  margin: 10px auto 36px;
`

export default function ICelebrateNYPage() {
  const [result, setResult] = useState()
  const [msg, setMsg] = useState()

  useEffect(() => {
    if (result === "success") {
      navigate("welcome")
    }
  }, [result])

  return (
    <Container>
      <Grid>
        <Content>
          <Headline>JOIN OUR FAMILY</Headline>
          <Description
            css={`
              max-width: 190px;
              margin: 0 auto 20px;

              @media (min-width: 800px) {
                max-width: unset;
                margin: 0 0 20px;
              }
            `}
          >
            And get our special edition I CELEBRATE NY Tote Bag
          </Description>
          <ImgContainer>
            <StaticImage
              src="../../images/mock/tote-bag.png"
              alt="I CELEBRATE NY Tote Bag"
            />
          </ImgContainer>

          <Formik
            initialValues={{
              email: "",
              firstName: "",
              lastName: "",
              birthday: {
                month: "",
                day: "",
                year: "",
              },
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              firstName: Yup.string().nullable(),
              lastName: Yup.string().nullable(),
              birthday: Yup.object({
                month: Yup.number().nullable(),
                day: Yup.number().nullable(),
                year: Yup.number().nullable(),
              }),
            })}
            onSubmit={async (values, actions) => {
              const createProfileResponse = await createClientProfile(
                values.email
              )

              if (createProfileResponse.status !== 202) {
                const createProfileResult = await createProfileResponse.json()

                if (createProfileResult.errors) {
                  const [error, ..._rest] = createProfileResult.errors

                  setResult("error")
                  actions.setFieldError(
                    "email",
                    `${error.title} ${error.detail}`
                  )

                  return
                }
              }

              const createSubscriptionResponse = await createClientSubscription(
                values.email,
                "NY Popup"
              )

              if (createSubscriptionResponse.status !== 202) {
                const createSubscriptionResult = await createSubscriptionResponse.json()

                if (createSubscriptionResult.errors) {
                  const [error, ..._rest] = createSubscriptionResult.errors

                  setResult("error")
                  actions.setFieldError(
                    "email",
                    `${error.title} ${error.detail}`
                  )

                  return
                }
              }

              identifyUser(
                "", // id
                { email: values.email } // properties
              )

              trackLead(values.email)
              setResult("success")
            }}
          >
            {({ values, isSubmitting }) => (
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <>
                  <InlineInputGroup>
                    <InlineTextInput
                      light
                      name="email"
                      label="Email"
                      type="text"
                      placeholder="Email"
                      disabled={isSubmitting}
                    />
                  </InlineInputGroup>
                  <InlineInputGroup>
                    <InlineTextInput
                      light
                      name="firstName"
                      placeholder="First name"
                      aria-label="Enter your first name"
                      disabled={isSubmitting}
                    />
                  </InlineInputGroup>
                  <InlineInputGroup>
                    <InlineTextInput
                      light
                      name="lastName"
                      placeholder="Last name"
                      aria-label="Enter your last name"
                      disabled={isSubmitting}
                    />
                  </InlineInputGroup>
                  <InlineInputGroup>
                    <Description style={{ textAlign: "left" }}>
                      Date of Birth - We celebrate birthdays!
                    </Description>
                  </InlineInputGroup>
                  <InlineThirdsInputGroup>
                    <InlineDropdownInput
                      light
                      name="birthday.month"
                      label="Month"
                      disabled={isSubmitting}
                    >
                      <option hidden value="">
                        Month
                      </option>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.name}
                        </option>
                      ))}
                    </InlineDropdownInput>
                    <InlineDropdownInput
                      light
                      name="birthday.day"
                      label="Day"
                      disabled={isSubmitting}
                    >
                      <option hidden value="">
                        Day
                      </option>
                      {Array.from(
                        Array(
                          getDaysInMonth(
                            values.birthday.month,
                            isLeapYear(values.birthday.year)
                          )
                        )
                      ).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </InlineDropdownInput>
                    <InlineDropdownInput
                      light
                      name="birthday.year"
                      label="Year"
                      disabled={isSubmitting}
                    >
                      <option hidden value="">
                        Year
                      </option>
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </InlineDropdownInput>
                  </InlineThirdsInputGroup>
                  <InputGroup>
                    <ButtonAsButton
                      flex
                      type="submit"
                      style={{ backgroundColor: "var(--gray)" }}
                    >
                      {isSubmitting ? `Signing up...` : `Sign Up`}
                    </ButtonAsButton>
                  </InputGroup>
                  <InputGroup>
                    <Message
                      style={{ color: "var(--gray)", lineHeight: "15px" }}
                    >
                      By joining the list you agree to receive emails from
                      VIEREN
                    </Message>
                    {result !== "success" && (
                      <Error dangerouslySetInnerHTML={{ __html: msg }} />
                    )}
                  </InputGroup>
                </>
              </Form>
            )}
          </Formik>
        </Content>
      </Grid>
    </Container>
  )
}
