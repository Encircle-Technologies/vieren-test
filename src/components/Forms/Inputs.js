import React from "react"
import styled from "styled-components"
import { useField } from "formik"
import ArrowSvg from "../../images/icons/arrow.svg"

const Label = styled.label`
  /* Label css goes here */
  display: none;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.5px;
`

export const CheckmarkLabel = styled(Label)`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--gray)")};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 300px;
  line-height: normal;
  letter-spacing: 0.88px;

  .checkmark {
    flex: 0 0 14px;
    position: relative;
    height: 14px;
    width: 14px;
    background-color: transparent;
    border: ${({ meta, theme }) =>
      meta?.touched && meta?.error
        ? "1px solid var(--red)"
        : theme === "dark"
        ? "1px solid var(--white)"
        : "1px solid #979797"};
    margin: 0 1ch 0 0;

    ::after {
      background: ${({ theme }) =>
        theme === "dark" ? "var(--white)" : "var(--black)"};
      content: "";
      display: none;
      position: absolute;
      height: 10px;
      width: 10px;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  input:checked + .checkmark {
    ::after {
      display: block;
    }
  }
`

const Input = styled.input`
  /* Formatting */
  background: #ffffff;
  border: ${({ meta }) =>
    meta.touched && meta.error ? "1px solid var(--red)" : "1px solid #bbbbbb"};
  box-sizing: border-box;
  padding: 0 0.5em;
  width: 100%;
  /* Typography */
  color: #3b3b3b;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.5px;
`
export const InlineInput = styled.input`
  background: transparent;
  border: none;
  border-radius: 0;
  border-bottom: ${({ light, meta }) =>
    meta.touched && meta.error
      ? "1px solid var(--red)"
      : light
      ? "1px solid #bbbbbb"
      : "1px solid var(--white)"};
  box-sizing: border-box;
  /* Typography */
  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  padding: 0 0 9px;
  width: 100%;

  &::placeholder {
    color: ${({ light }) => (light ? "#818181" : "var(--white)")};
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--black);
  }
`

const Dropdown = styled.div`
  border: ${({ $error }) => ($error ? "1px solid red" : "1px solid #767676")};
  display: block;
  margin: 0 0 15px;
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
    border: 1px solid black;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg) translateY(-50%);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 38%;
    bottom: 0;
    right: 15px;

    pointer-events: none;
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
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.4px;
  padding: 13px 11px 12px;
  /* text-transform: uppercase; */
  width: 100%;
  overflow: hidden;

  & option {
    border-radius: 0;
    width: 150px;
  }
`

const InlineDropdown = styled.div`
  border-bottom: ${({ light, meta }) =>
    meta.touched && meta.error
      ? "1px solid var(--red)"
      : light
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
    border: ${({ light }) => (light ? "solid #bbbbbb" : "solid var(--white)")};
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

const InlineSelect = styled.select`
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 0;
  width: 100%;

  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  padding: 0 0 9px;

  &::placeholder {
    color: ${({ light }) => (light ? "#818181" : "var(--white)")};
  }
`

const Arrow = styled(({ light, ...rest }) => <ArrowSvg {...rest} />)`
  color: ${({ light }) => (light ? "#818181" : "var(--white)")};
`

const Date = styled(Input)`
  position: relative;
  height: 30px;
  color: ${({ placeholderText }) =>
    placeholderText ? `${placeholderText}` : "Test"};

  ::before {
    /* content: "Birthday (YYYY-MM-DD)"; */
    content: ${props =>
      props.placeholder ? `'${props.placeholder}'` : "Test"};
    background: #ffffff;
    color: #3b3b3b;

    position: absolute;
    top: 0;
    left: 0;
    height: 28px;
    width: 80%;
    padding: 0 0.5em;
  }

  :focus,
  :not([value=""]) {
    ::before {
      content: "";
      background: transparent;
    }
  }
`

const TextArea = styled.textarea`
  /* Formatting */
  background: #ffffff;
  border: ${({ meta }) =>
    meta.touched && meta.error ? "1px solid var(--red)" : "1px solid #979797"};
  box-sizing: border-box;
  padding: 0 0.5em;
  width: 100%;
  /* Typography */
  color: #3b3b3b;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.5px;
`

export const Checkbox = styled.input`
  border: ${({ meta, theme }) =>
    meta?.touched && meta?.error
      ? "1px solid var(--red)"
      : theme === "dark"
      ? "1px solid var(--white)"
      : "1px solid #bbbbbb"};
  display: none;
`

export const Message = styled.div`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.61px;
  margin: 6px 0 0;
`

export const Error = styled.div`
  /* Typography*/
  /* color: ${({ light }) => (light ? "#818181" : "var(--white)")}; */
  color: var(--red);
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.61px;
  margin: 1px 0 0;
`

export const InputGroup = styled.div`
  min-height: 50px;
  margin-bottom: 10px;
  width: 100%;
`

export const InlineInputGroup = styled.div`
  min-height: 55px;
  margin-bottom: 10px;
  width: 100%;
`

export const InlineSplitInputGroup = styled(InlineInputGroup)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  place-content: start center;
`

export const InlineThirdsInputGroup = styled(InlineSplitInputGroup)`
  grid-template-columns: 1fr 1fr 1fr;
  gap: 21px;
`

export const Submit = styled.button`
  background-color: ${({ backgroundColour }) => backgroundColour || "#606469"};
  border: none;
  box-sizing: border-box;
  padding: 9px 0;
  width: 100%;

  color: ${({ color }) => color || "#ffffff"};
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 15px;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;

  :hover {
    background-color: var(--black);
  }
`

export const InlineSubmit = styled.button`
  background: none;
  border: none;
  border-radius: none;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  position: absolute;
  right: 0;
  top: 5px;
`

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <Input {...field} {...props} meta={meta} />
      {meta.touched && meta.error ? <Error>{meta.error}</Error> : null}
    </>
  )
}

export const TextInputWithSubmit = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <span
        css={`
          display: block;
          position: relative;
          height: 31px;
        `}
      >
        <Input {...field} {...props} meta={meta} />
        <InlineSubmit
          type="submit"
          aria-label="Submit"
          css={`
            height: 31px;
            top: 0;
            right: 10px;
          `}
        >
          <Arrow
            css={`
              color: var(--black);
            `}
          />
        </InlineSubmit>
      </span>
      <span>
        {meta.touched && meta.error ? (
          <Error
            css={`
              color: #f35858;
            `}
          >
            {meta.error}
          </Error>
        ) : null}
      </span>
    </>
  )
}

export const InlineTextInput = ({
  light,
  label,
  type,
  handleBlur,
  ...props
}) => {
  const [field, meta] = useField(props)

  const handleCustomBlur = (formikBlur, event, callback) => {
    formikBlur(event)

    if (callback) {
      callback()
    }
  }

  return (
    <>
      <Label light htmlFor={props.id || props.name}>
        {label}
      </Label>
      <InlineInput
        light={light}
        type={type || "text"}
        meta={meta}
        {...field}
        {...props}
        onBlur={e => handleCustomBlur(field.onBlur, e, handleBlur)}
      />
      {meta.touched && meta.error ? (
        <Error light={light}>{meta.error}</Error>
      ) : null}
    </>
  )
}

export const InlineTextInputWithSubmit = ({ light, label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Label light htmlFor={props.id || props.name}>
        {label}
      </Label>
      <span
        css={`
          position: relative;
        `}
      >
        <InlineInput light={light} {...field} {...props} meta={meta} />
        <InlineSubmit light={light} type="submit" aria-label="Submit">
          <Arrow light={light} />
        </InlineSubmit>
      </span>
      <span>
        {meta.touched && meta.error ? (
          <Error light={light}>{meta.error}</Error>
        ) : null}
      </span>
    </>
  )
}

export const InlinePasswordInput = ({ light, label, handleBlur, ...props }) => {
  const [field, meta] = useField(props)

  const handleCustomBlur = (formikBlur, event, callback) => {
    if (callback) {
      callback()
    }

    formikBlur(event)
  }

  return (
    <>
      <Label light htmlFor={props.id || props.name}>
        {label}
      </Label>
      <span
        css={`
          position: relative;
        `}
      >
        <InlineInput
          light={light}
          type="password"
          meta={meta}
          {...field}
          {...props}
          onBlur={e => handleCustomBlur(field.onBlur, e, handleBlur)}
        />
        <InlineSubmit light={light} type="submit">
          <Arrow light={light} />
        </InlineSubmit>
      </span>
      <span>
        {meta.touched && meta.error ? (
          <Error light={light}>{meta.error}</Error>
        ) : null}
      </span>
    </>
  )
}

export const DropdownInput = ({
  optionPlaceholder,
  options,
  label,
  ...props
}) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Dropdown>
        <Label htmlFor={props.id || props.name}>{label}</Label>
        <Select {...field} {...props} meta={meta}>
          {optionPlaceholder && (
            <option key="placeholder" value="" disabled>
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
      {meta.touched && meta.error ? <Error $inline>{meta.error}</Error> : null}
    </>
  )
}

export const InlineDropdownInput = ({
  light,
  label,
  handleBlur,
  children,
  ...props
}) => {
  const [field, meta] = useField(props)

  const handleCustomBlur = (formikBlur, event, callback) => {
    if (callback) {
      callback()
    }

    formikBlur(event)
  }

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <InlineDropdown light={light} meta={meta}>
        <InlineSelect
          light={light}
          aria-label={label}
          meta={meta}
          {...field}
          {...props}
          onBlur={e => handleCustomBlur(field.onBlur, e, handleBlur)}
        >
          {children}
        </InlineSelect>
      </InlineDropdown>
      {meta.touched && meta.error ? (
        <Error light={light}>{meta.error}</Error>
      ) : null}
    </>
  )
}

export const TextAreaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <TextArea {...field} {...props} meta={meta} />
      {meta.touched && meta.error ? (
        <Error className="error">{meta.error}</Error>
      ) : null}
    </>
  )
}

export const CheckboxInput = ({ light, type = "checkbox", ...props }) => {
  // console.log("[DEBUG] checkbox props: ", props)
  const [field, meta] = useField({ type, name: props.name })
  return (
    <>
      <CheckmarkLabel meta={meta}>
        <Checkbox {...field} {...props} meta={meta} />
        <span className="checkmark" />
        {props.label}
      </CheckmarkLabel>
      {props.showError && meta.touched && meta.error ? (
        <Error light={light} className="error">
          {meta.error}
        </Error>
      ) : null}
    </>
  )
}

export const DateInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <Date {...field} {...props} meta={meta} />
      {meta.touched && meta.error ? <Error>{meta.error}</Error> : null}
    </>
  )
}
