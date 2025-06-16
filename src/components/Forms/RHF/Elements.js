import styled from "styled-components"

export const Container = styled.div`
  margin: 0 0 15px;
`

export const Label = styled.label`
  /* Label css goes here */
  display: none;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.5px;
`

export const Input = styled.input`
  /* Formatting */
  background: #ffffff;
  border: 1px solid #bbbbbb;
  box-sizing: border-box;
  padding: 5px 10px;
  width: 100%;
  /* Typography */
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
`

export const TextArea = styled.textarea`
  /* Formatting */
  background: #ffffff;
  border: 1px solid #bbbbbb;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  /* Typography */
  color: #000000;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;

  &:disabled {
    color: #bbbbbb;
  }

  &:disabled &::placeholder {
    color: #bbbbbb;
  }

  &::placeholder {
    color: #4d4d4d;
  }
`

export const InlineInput = styled.input`
  background: transparent;
  border: none;
  border-radius: 0;
  border-bottom: ${({ $light, $hasError }) =>
    $hasError
      ? "1px solid var(--red)"
      : $light
      ? "1px solid #bbbbbb"
      : "1px solid var(--white)"};
  box-sizing: border-box;
  /* Typography */
  color: ${({ $light }) => ($light ? "var(--black)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  padding: 0 0 9px;
  width: 100%;

  &::placeholder {
    color: ${({ $light }) => ($light ? "#818181" : "var(--white)")};
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--black);
  }
`

export const Error = styled.span`
  /* Typography*/
  color: var(--red);
  display: block;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.61px;
  margin: 1px 0 0;
  padding: ${({ $inline }) => ($inline ? "0" : "0 0 0 11px")};
`
