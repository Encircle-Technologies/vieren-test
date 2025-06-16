import React, { useCallback, useEffect, useRef } from "react"
import { useFormContext, useController } from "react-hook-form"
import { Label, Input, InlineInput, Error } from "./Elements"

export function TextInput({ name, label, ...rest }) {
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  return (
    <>
      <Label htmlFor={rest.id || name}>{label}</Label>
      <Input {...register(name)} {...rest} />
      {error && <Error>{error.message}</Error>}
    </>
  )
}

export function InlineTextInput({ name, label, light, handleBlur, ...rest }) {
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
      <Label htmlFor={rest.id || registeredName}>{label}</Label>
      <InlineInput
        onChange={onChange}
        onBlur={handleCustomBlur}
        $light={light}
        $hasError={!!error}
        name={registeredName}
        ref={ref}
        {...rest}
      />
      {error && <Error $inline>{error.message}</Error>}
    </>
  )
}

export function ControlledInlineTextInput({
  name,
  label,
  light,
  handleBlur,
  ...rest
}) {
  const { control } = useFormContext()
  const {
    field: { onChange, onBlur, name: registeredName, value, ref },
    fieldState: { isDirty, isTouched, error },
  } = useController({ name, control })

  const handleCustomBlur = useCallback(
    async e => {
      await onBlur(e)

      if (handleBlur) handleBlur()
      process.env.NODE_ENV === "development" &&
        console.log(`[DEBUG] ${name} triggered custom blur`)
    },
    [handleBlur]
  )

  return (
    <>
      <Label htmlFor={rest.id || registeredName}>{label}</Label>
      <InlineInput
        onChange={onChange}
        onBlur={handleCustomBlur}
        $light={light}
        $hasError={!!error}
        name={registeredName}
        ref={ref}
        value={value}
        {...rest}
      />
      {error && <Error $inline>{error.message}</Error>}
    </>
  )
}
