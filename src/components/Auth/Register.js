import React from "react"
import { navigate } from "gatsby"
import { useMutation } from "@apollo/client"
import RegisterUserMutation from "./Register.mutation.graphql"
import LoginUserMutation from "./Login.mutation.graphql"
import UpdateCustomerMutation from "../Account/Customer.mutation.graphql"
import GetViewerQuery from "./Viewer.query.graphql"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  InlineInputGroup,
  InlineThirdsInputGroup,
  InlineTextInput,
  InlineDropdownInput,
  CheckboxInput,
} from "../Forms/Inputs"
import { ButtonAsButton } from "../Elements/Button"
import { P } from "../Elements/P"

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

export default function Register() {
  const [registerUser] = useMutation(RegisterUserMutation, {
    // The following doesn't currently work due to secure cookies not
    // being set by the default registerUser mutation, see:
    // https://github.com/funkhaus/wp-graphql-cors/issues/31
    //
    // fetchPolicy: "no-cache",
    // refetchQueries: [{ query: GetViewerQuery }],
    // awaitRefetchQueries: true,
    // onCompleted: data => {
    //   if (data?.registerUser?.user) {
    //     navigate("/members")
    //   }
    // },
  })
  const [loginUser] = useMutation(LoginUserMutation, {
    fetchPolicy: "no-cache",
    refetchQueries: [{ query: GetViewerQuery }],
    awaitRefetchQueries: true,
    onCompleted: data => {
      if (data?.loginWithCookies?.status === "SUCCESS") {
        navigate("/members")
      }
    },
  })
  const [updateCustomer] = useMutation(UpdateCustomerMutation)

  return (
    <>
      <P
        textAlign={{ mobile: "center", desktop: "center" }}
        style={{ margin: "0 0 30px" }}
        dangerouslySetInnerHTML={{
          __html: "<p>Become a Member for express checkout</p>",
        }}
      />
      <Formik
        initialValues={{
          username: "",
          password: "",
          verifyPassword: "",
          title: "",
          firstName: "",
          lastName: "",
          birthday: {
            month: "",
            day: "",
            year: "",
          },
          marketingOptIn: true,
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .email("Invalid email address")
            .required("Email is required to register"),
          password: Yup.string()
            .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              "Must contain at least 8 Characters, One Uppercase, one Lowercase, one Number and one Special Case Character"
            )
            .required("Password is required to register"),
          verifyPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required to register"),
          title: Yup.string().nullable(),
          firstName: Yup.string().nullable(),
          lastName: Yup.string().nullable(),
          birthday: Yup.object({
            month: Yup.number().nullable(),
            day: Yup.number().nullable(),
            year: Yup.number().nullable(),
          }),
          marketingOptIn: Yup.boolean().required(),
        })}
        onSubmit={async (values, actions) => {
          const {
            username,
            password,
            title,
            firstName,
            lastName,
            birthday,
            marketingOptIn,
          } = values

          try {
            const registerResult = await registerUser({
              variables: {
                input: {
                  username,
                  email: username,
                  password,
                  firstName,
                  lastName,
                  displayName: `${title}${title &&
                    firstName &&
                    " "}${firstName}${firstName && lastName && " "}${lastName}`, // e.g. "Mr. Ardie Wen"
                  nickname: `${title}${title && lastName && " "}${lastName}`, // e.g. "Mr. Wen"
                  description: JSON.stringify({ birthday, marketingOptIn }),
                },
              },
            })

            if (registerResult?.data?.registerUser?.user) {
              const loginResult = await loginUser({
                variables: {
                  input: {
                    login: username,
                    password,
                  },
                },
              })

              if (loginResult?.data?.loginWithCookies.status === "SUCCESS") {
                const updateCustomerResult = await updateCustomer({
                  variables: {
                    input: {
                      metaData: [
                        { key: "birthday", value: JSON.stringify(birthday) },
                        {
                          key: "marketingOptIn",
                          value: JSON.stringify(marketingOptIn),
                        },
                      ],
                    },
                  },
                })
              }
            }
          } catch (err) {
            console.log(err)
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <InlineInputGroup>
              <InlineTextInput
                light
                name="username"
                placeholder="Email address*"
                aria-label="Enter your email address to log in."
                disabled={isSubmitting}
              />
            </InlineInputGroup>
            <InlineInputGroup>
              <InlineTextInput
                light
                name="password"
                type="password"
                placeholder="Password*"
                aria-label="Create a password"
                disabled={isSubmitting}
              />
            </InlineInputGroup>
            <InlineInputGroup>
              <InlineTextInput
                light
                name="verifyPassword"
                type="password"
                placeholder="Confirm Password*"
                aria-label="Confirm your password"
                disabled={isSubmitting}
              />
            </InlineInputGroup>
            <InlineInputGroup>
              <InlineDropdownInput
                light
                name="title"
                label="Title"
                disabled={isSubmitting}
              >
                <option hidden value="">
                  Title
                </option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
              </InlineDropdownInput>
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
            <InlineInputGroup>
              <CheckboxInput
                label="Sign up for updates on the latest VIEREN news"
                name="marketingOptIn"
                id="marketingOptIn"
                disabled={isSubmitting}
              />
            </InlineInputGroup>
            <ButtonAsButton flex type="Submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join"}
            </ButtonAsButton>
          </Form>
        )}
      </Formik>
    </>
  )
}
