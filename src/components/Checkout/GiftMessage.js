import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"
import { CheckboxElement } from "../Forms/RHF/CheckboxInput"
import { TextArea } from "../Forms/RHF/Elements"
import { InputGroup } from "../Forms/RHF/InputGroup"

const Container = styled.div`
  margin: 20px 0 0;
`

const Message = styled.span`
  color: #4d4d4d;
  display: block;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  margin-top: 3px;
`

export default function GiftMessage() {
  const [hasGiftMessage, setHasGiftMessage] = useState(false)
  const [giftMessage, setGiftMessage] = useState("")
  const { setValue } = useFormContext()

  return (
    <Container>
      <InputGroup style={{ margin: "0", minHeight: "0" }}>
        <CheckboxElement
          type="checkbox"
          label="Add a gift message"
          value={hasGiftMessage}
          onChange={() => setHasGiftMessage(prevState => !prevState)}
          defaultChecked={hasGiftMessage === true}
        />
        {hasGiftMessage && (
          <>
            <TextArea
              style={{ marginTop: "30px" }}
              rows={3}
              maxLength={80}
              placeholder="E.g., Happy birthday!"
              value={giftMessage}
              onChange={e => setGiftMessage(e.target.value)}
              onBlur={e => setValue("giftMessage", e.target.value)}
              disabled={!hasGiftMessage}
            />
            <Message>Up to 150 characters (no emojis)</Message>
          </>
        )}
      </InputGroup>
    </Container>
  )
}
