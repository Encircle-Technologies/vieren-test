import React from "react"
import { regions } from "../../utils/maps/regions.js"
// Formik -> React Hook Forms Refactor
import { useFormContext } from "react-hook-form"
import styled from "styled-components"
import {
  InlineInputGroup,
  InlineSplitInputGroup,
} from "../Forms/RHF/InputGroup"
import { InlineTextInput } from "../Forms/RHF/TextInput"
import { InlineDropdownInput } from "../Forms/RHF/DropdownInput"

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
export default function Address({
  edit = true,
  type = null,
  handleValidate = () => {},
}) {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext()

  const values = watch(type)
  const selectedRegion = regions.find(region => region.value === values.country)

  if (edit === true) {
    return (
      <>
        <InlineSplitInputGroup>
          <InlineInputGroup>
            <InlineTextInput
              light
              name={`${type}.firstName`}
              placeholder="First name"
              aria-label="Required field: Enter your first name"
              disabled={isSubmitting}
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <InlineTextInput
              light
              name={`${type}.lastName`}
              placeholder="Last name"
              aria-label="Required field: Enter your last name"
              disabled={isSubmitting}
            />
          </InlineInputGroup>
        </InlineSplitInputGroup>
        {/* <InlineInputGroup>
          <InlineTextInput
            light
            name={`${type}.company`}
            placeholder="Company name"
            aria-label="Optional field: Enter your company name"
            disabled={isSubmitting}
          />
        </InlineInputGroup> */}
        <InlineInputGroup>
          <InlineTextInput
            light
            name={`${type}.address1`}
            placeholder="Street address"
            aria-label="Required field: Enter your street address"
            disabled={isSubmitting}
          />
        </InlineInputGroup>
        <InlineInputGroup>
          <InlineTextInput
            light
            name={`${type}.address2`}
            placeholder="Suite, unit, or apt number (optional)"
            aria-label="Optional field: Enter your suite, unit, or apt number"
            disabled={isSubmitting}
          />
        </InlineInputGroup>
        <InlineSplitInputGroup>
          <InlineInputGroup>
            <InlineTextInput
              light
              name={`${type}.city`}
              placeholder="City"
              aria-label="Required field: Enter your city name"
              disabled={isSubmitting}
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <InlineDropdownInput
              light
              name={`${type}.state`}
              label={
                selectedRegion === "CA"
                  ? "Province"
                  : selectedRegion === "US"
                  ? "State"
                  : "State / Province"
              }
              handleBlur={handleValidate}
              disabled={isSubmitting}
              optionPlaceholder={{
                name:
                  selectedRegion.value === "US"
                    ? "State"
                    : selectedRegion.value === "CA"
                    ? "Province"
                    : "State / Province",
                value: "",
              }}
              options={
                selectedRegion
                  ? selectedRegion.states
                  : regions
                      .reduce((acc, curr) => [...acc, ...curr.states], [])
                      .sort((a, b) => a.name.localeCompare(b.name))
              }
            />
          </InlineInputGroup>
        </InlineSplitInputGroup>
        <InlineSplitInputGroup>
          <InlineInputGroup>
            <InlineTextInput
              light
              name={`${type}.postcode`}
              placeholder={
                selectedRegion.value === "US"
                  ? "Zip code"
                  : selectedRegion.value === "CA"
                  ? "Postal code"
                  : "Zip / Postal code"
              }
              aria-label="Required field: Enter your zip or postal code"
              handleBlur={handleValidate}
              disabled={isSubmitting}
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <InlineDropdownInput
              light
              name={`${type}.country`}
              label="Country"
              handleBlur={handleValidate}
              disabled={isSubmitting}
              optionPlaceholder={{ name: "Country", value: "" }}
              options={regions}
            />
          </InlineInputGroup>
        </InlineSplitInputGroup>
        <InlineInputGroup>
          <InlineTextInput
            light
            name={`${type}.phone`}
            placeholder="Phone number"
            aria-label="Required field: Enter your phone number"
            disabled={isSubmitting}
          />
        </InlineInputGroup>
      </>
    )
  }

  const selectedCountry = regions.find(
    region => region.value === values.country
  )

  const selectedState = selectedCountry.states.find(
    state => state.value === values.state
  )

  return (
    <>
      <OutputText>{`${values.firstName} ${values.lastName}`}</OutputText>
      <OutputText>{values.address1}</OutputText>
      <OutputText>{values.address2}</OutputText>
      <OutputText>{`${values.city}, ${selectedState.name}`}</OutputText>
      <OutputText>{`${values.postcode}, ${selectedCountry.name}`}</OutputText>
    </>
  )
}

Address.types = {
  SHIPPING: "shipping",
  BILLING: "billing",
}
