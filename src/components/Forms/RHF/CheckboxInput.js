import React from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"
import { Error } from "./Elements"

const Label = styled.label`
  color: var(--gray);
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 1px;
`

const HiddenInput = styled.input``

const Checkbox = styled.div`
  flex: 0 0 14px;
  position: relative;
  height: 14px;
  width: 14px;
  background: white;
  border: 1px solid #979797;
  margin: 0 1ch 0 0;

  ::after {
    background: var(--black);
    content: "";
    display: none;
    position: absolute;
    height: 10px;
    width: 10px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  ${HiddenInput}:checked + &::after {
    display: block;
  }
`

export function CheckboxElement({ label, ...rest }) {
  return (
    <Label>
      <HiddenInput {...rest} />
      <Checkbox />
      {label}
    </Label>
  )
}

export function CheckboxInput({ showError = false, name, label, ...props }) {
  const { register, getFieldState } = useFormContext()
  const { isDirty, isTouched, error } = getFieldState(name)

  const { ref, ...rest } = register(name)
  return (
    <>
      <Label ref={ref}>
        <HiddenInput ref={ref} {...rest} {...props} />
        <Checkbox />
        {label}
      </Label>
      {showError && error && <Error $inline>{error.message}</Error>}
    </>
  )
}

// export function ControlledCheckboxInput({ showError }) {
//   const { register } = useFormContext()

//   return (
//     <>
//       <CheckmarkLabel meta={meta}>
//         <Checkbox {...register(name)} {...rest} />
//         <span className="checkmark" />
//         {props.label}
//       </CheckmarkLabel>
//       {showError && meta.touched && meta.error && <Error>{meta.error}</Error>}
//     </>
//   )
// }
