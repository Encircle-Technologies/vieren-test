import React, { useCallback, useEffect, useRef } from "react"
import { useFormContext, useController } from "react-hook-form"
import styled from "styled-components"
import { Label, Error, Container } from "./Elements"

const Dropdown = styled.div`
  border: 1px solid #bbbbbb;
  display: block;
  position: relative;

  &::before {
    background: transparent;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;
  }

  &::after {
    content: "";
    display: block;
    border: 1px solid var(--gray);
    border-width: 0 1px 1px 0;
    transform: rotate(45deg) translateY(-50%);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 43%;
    right: 15px;

    pointer-events: none;
  }
`

const InlineDropdown = styled.div`
  border-bottom: ${({ $light, $hasError }) =>
    $hasError
      ? "1px solid var(--red)"
      : $light
      ? "1px solid #bbbbbb"
      : "1px solid var(--white)"};
  position: relative;
  display: block;
  ::before {
    background: transparent;
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;
    pointer-events: none;
    z-index: 10;
  }
  ::after {
    content: "";
    display: block;
    border: ${({ $light, $hasError }) =>
      $hasError
        ? "solid var(--red)"
        : $light
        ? "solid #bbbbbb"
        : "solid var(--white)"};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translateY(-50%);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 38%;
    bottom: 0;
    right: 15px;
    pointer-events: none;
    z-index: 10;
  }
`

const Select = styled.select`
  appearance: none;
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
  padding: 5px 10px;
  /* text-transform: uppercase; */
  width: 100%;
  overflow: hidden;

  & option {
    border-radius: 0;
    color: var(--gray);
    width: 150px;
  }
`

const InlineSelect = styled.select`
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 0;
  width: 100%;

  color: ${({ $light, value }) =>
    !!($light && value !== "")
      ? "var(--black)"
      : !!($light && value === "")
      ? "#818181"
      : "var(--white)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  padding: 0 0 9px;
`

export const DropdownInput = ({
  optionPlaceholder,
  options,
  name,
  label,
  ...rest
}) => {
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  return (
    <Container>
      <Dropdown>
        <Label htmlFor={rest.id || name}>{label}</Label>
        <Select {...register(name)} {...rest}>
          {optionPlaceholder && (
            <option key="placeholder" value="" hidden>
              {optionPlaceholder.name}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
      </Dropdown>
      {error && <Error $inline>{error.message}</Error>}
    </Container>
  )
}

export function InlineDropdownInput({
  light,
  optionPlaceholder,
  options,
  name,
  label,
  handleBlur,
  ...rest
}) {
  const { register, getFieldState, formState } = useFormContext()
  const { name: registeredName, ref, onChange, onBlur } = register(name)
  const { error } = getFieldState(registeredName, formState)

  const handleCustomBlur = useCallback(
    async e => {
      await onBlur(e)

      if (handleBlur) handleBlur()
    },
    [handleBlur]
  )

  return (
    <>
      <InlineDropdown $light={light} $hasError={!!error}>
        <Label htmlFor={rest.id || registeredName}>{label}</Label>
        <InlineSelect
          onChange={onChange}
          onBlur={handleCustomBlur}
          $light={light}
          name={registeredName}
          ref={ref}
          {...rest}
        >
          {optionPlaceholder && (
            <option key="placeholder" value="" hidden>
              {optionPlaceholder.name}
            </option>
          )}
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </InlineSelect>
      </InlineDropdown>
      {error && <Error $inline>{error.message}</Error>}
    </>
  )
}

export function ControlledInlineDropdownInput({
  light,
  optionPlaceholder,
  options,
  name,
  label,
  handleBlur,
  ...rest
}) {
  const validationCount = useRef(0)
  const { control, trigger } = useFormContext()
  const {
    field: { onChange, onBlur, name: registeredName, value, ref },
    fieldState: { isTouched, isDirty, error },
  } = useController({ name, control })

  const handleCustomBlur = useCallback(
    async e => {
      await onBlur(e)

      if (handleBlur) handleBlur()
    },
    [handleBlur]
  )

  useEffect(() => {
    // This side effect triggers validation for autocomplete fields
    if (value !== "" && !isTouched && validationCount.current === 0) {
      // Trigger validation then run any onBlur callbacks
      trigger(name).then(res => {
        process.env.NODE_ENV === "development" &&
          console.log(
            `[DEBUG] ${name} triggered autofill validation with result:`,
            res
          )
        if (res === true && handleBlur) handleBlur()
        validationCount.current++
      })
    }
  }, [value, isTouched, trigger, handleBlur])

  return (
    <>
      <InlineDropdown $light={light}>
        <Label htmlFor={rest.id || registeredName}>{label}</Label>
        <InlineSelect
          onChange={onChange}
          onBlur={handleCustomBlur}
          $light={light}
          $hasError={!!error}
          $isDirty={isDirty}
          name={registeredName}
          ref={ref}
          value={value}
          {...rest}
        >
          {optionPlaceholder && (
            <option key="placeholder" value="" hidden>
              {optionPlaceholder.name}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </InlineSelect>
      </InlineDropdown>
      {error && <Error $inline>{error.message}</Error>}
    </>
  )
}
