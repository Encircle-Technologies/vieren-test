import React from "react"
import { useProduct } from "../../hooks/useProductData"
import styled from "styled-components"
import { CheckmarkLabel, Checkbox, Error } from "../Forms/Inputs"
import SizeChart from "./SizeChart"

const Container = styled.form`
  /* margin: 0 0 30px; */
  padding: 15px 0 0;
`

const Title = styled.span`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--gray)")};
  display: block;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  line-height: 17px;
  margin: 0 20px 0 0;
  letter-spacing: 0.67px;
  text-transform: uppercase;
`

const Fieldset = styled.fieldset`
  border: none;
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
`

export default function Variations({ theme, showTitle = true, variations }) {
  const {
    state: { selectedVariation, error },
    setVariation,
  } = useProduct()

  return (
    <Container id="product-variations">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {showTitle && <Title theme={theme}>Strap Size</Title>}
        <Fieldset>
          {Array.isArray(variations) &&
            variations.map(variation => (
              <CheckmarkLabel key={variation.databaseId} theme={theme}>
                <Checkbox
                  theme={theme}
                  type="radio"
                  name="productVariations"
                  value={variation.databaseId}
                  checked={selectedVariation === variation.databaseId}
                  onChange={e =>
                    setVariation(
                      parseInt(e.target.value),
                      variation.description.toLowerCase()
                    )
                  }
                />
                <span className="checkmark" />
                {`${variation.description}${
                  process.env.NODE_ENV === "development"
                    ? ` ${variation.databaseId}`
                    : ``
                }`}
              </CheckmarkLabel>
            ))}
        </Fieldset>
        {showTitle && <SizeChart theme={theme} hasCustomizations={true} />}
      </div>

      {error && <Error>{error}</Error>}
    </Container>
  )
}
