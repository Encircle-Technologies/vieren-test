import React from "react"
import styled from "styled-components"
import Grid from "./Grid"

const MessageWrapper = styled.section`
  background: #000000;

  .grid-content {
    height: 100vh;
    display: flex;
    align-items: center;

    h1 {
      color: #ffffff;
      font-family: "Lato", sans-serif;
      font-weight: 400;
    }
  }
`

const FormSuccess = () => {
  return (
    <MessageWrapper>
      <Grid>
        <div className="grid-content">
          <h1>Thank you for your submission.</h1>
        </div>
      </Grid>
    </MessageWrapper>
  )
}

export default FormSuccess
