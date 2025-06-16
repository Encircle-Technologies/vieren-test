import React, { useRef, useState, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { motion } from "framer-motion"
import LogoSmall from "../../images/logos/logo_modal_black.svg"
import CloseIcon from "../../images/icons/menu-close.svg"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import { useProduct } from "../../hooks/useProductData"
import { useCurrency } from "../../hooks/useCurrency"
import useAddToCart from "../../hooks/useAddToCart"
import { trackAddToCart } from "../../utils/analytics/gtag"
import { ButtonAsButton } from "../Elements/Button"
import Variations from "../Product/Variations"
import EngravingIdeasModal from "../Modal/EngravingIdeasModal"
import { SizeGuideContentModal } from "../Product/SizeChart"
import { useProductContent } from "../../hooks/useProductContent"

// Formik -> React Hook Form Refactor
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Container as InputContainer,
  Error,
  Input,
} from "../Forms/RHF/Elements"
import { CheckboxInput } from "../Forms/RHF/CheckboxInput"
import { DropdownInput } from "../Forms/RHF/DropdownInput"
import { TextInput } from "../Forms/RHF/TextInput"

const Container = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 50px 25px;
  position: relative;
  width: 100vw;

  @media (min-width: 800px) {
    padding: 40px 50px;
    width: 800px;
  }

  @media (min-width: 1024px) {
    width: 840px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 60px;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;

  position: absolute;
  top: 20px;
  right: 20px;

  svg {
    display: block;
    height: 20px;
    width: 20px;

    g {
      fill: var(--black);
    }
  }
`

const Heading = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 1.2px;
  margin: 0;

  @media (min-width: 800px) {
    font-size: 30px;
    line-height: 35px;
    letter-spacing: 1.5px;
  }
`

const Subheading = styled.p`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin: 0 0 60px;
  text-align: center;
  max-width: 530px; /* arbitrary line break on design */
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-bottom: 50px;

  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`

const Title = styled.h4`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.88px;
  margin: 15px 0 3px;
  text-transform: uppercase;
`

const Description = styled.p`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin: 0 0 30px;
`

const Fieldset = styled.fieldset`
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
  padding: 0;
`

const Legend = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: 0.91px;
  margin: 0 0 10px;
`

const Message = styled.span`
  color: var(--gray);
  display: block;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-style: normal;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  margin: 10px 0;
  padding: 0 0 0 7.5px;
`

const Divider = styled.hr`
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #ddd;
  border-left: none;
  height: 0;
  width: 100%;
  margin-bottom: 60px;
`

const Disclaimer = styled.span`
  display: block;
  color: var(--black);

  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-style: normal;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  margin: 20px auto 0;
  text-align: center;
  max-width: 281px;
`

const EngravingBox = styled.div`
  position: relative;
`

const EngravingMessage = styled.span`
  color: #767676;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.88px;
  text-align: center;

  position: absolute;
  top: 80px;
  left: 50%;
  transform: translate(-50%, 0);
`

const PromptBox = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 10px 0 0;
`

const Prompt = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: #4d4d4d;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  text-align: right;
  text-decoration: underline;
  margin: 0;
  padding: 0;
`

const container = {
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren", staggerDirection: -1 },
  },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

// Select size mm (expect new copy)
// mm go from 135 - 210 in increments of 5 135mm 140mm 145mm etc
// in go from 5 to 8 by .25 5.00" 5.25" 5.50" 5.75" 6.00" etc
// no equivalent between mm and inches, when user switches units, the dropdown resets
const SIZES = {
  in: [
    { in: '5.25"', mm: "133mm" },
    { in: '5.50"', mm: "140mm" },
    { in: '5.75"', mm: "146mm" },
    { in: '6.00"', mm: "152mm" },
    { in: '6.25"', mm: "159mm" },
    { in: '6.50"', mm: "165mm" },
    { in: '6.75"', mm: "171mm" },
    { in: '7.00"', mm: "178mm" },
    { in: '7.25"', mm: "184mm" },
    { in: '7.50"', mm: "190mm" },
    { in: '7.75"', mm: "197mm" },
    { in: '8.00"', mm: "203mm" },
    { in: '8.25"', mm: "210mm" },
  ],
  mm: [
    { mm: "135mm", in: '5.3"' },
    { mm: "140mm", in: '5.5"' },
    { mm: "145mm", in: '5.7"' },
    { mm: "150mm", in: '5.9"' },
    { mm: "155mm", in: '6.1"' },
    { mm: "160mm", in: '6.3"' },
    { mm: "165mm", in: '6.5"' },
    { mm: "170mm", in: '6.7"' },
    { mm: "175mm", in: '6.9"' },
    { mm: "180mm", in: '7.1"' },
    { mm: "185mm", in: '7.3"' },
    { mm: "190mm", in: '7.5"' },
    { mm: "195mm", in: '7.7"' },
    { mm: "200mm", in: '7.9"' },
    { mm: "205mm", in: '8.1"' },
    { mm: "210mm", in: '8.3"' },
  ],
}

function processError(message) {
  if (message.includes("You cannot add that amount to the cart")) {
    return "Not enough stock to perform this action"
  }

  if (message.includes("because the product is out of stock")) {
    return "Product appears to be out of stock"
  }

  return JSON.stringify(message, null, 2)
}

function CustomizeFit() {
  const [modalOpen, setModalOpen] = useState(false)
  // const initializedVariant = useRef(null)
  // const [variants, setVariants] = useState({
  //   regular: null,
  //   engraved: null,
  // })
  const {
    state: { selectedCustomization },
    setVariation,
  } = useProduct()
  // this kind is leather vs metal
  const { kind, regularVariations, engravedVariations } = useProductContent()
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const unit = watch("unit")
  const setUnit = value => setValue("unit", value)
  const resetSize = () => setValue("size", "")

  useEffect(() => {
    resetSize()
  }, [unit])

  return (
    <>
      <ModalBody>
        <div>
          <Legend>Get It Fitted</Legend>
          <Description>
            {kind === "leather"
              ? "Select the strap size for you"
              : "Complementary bracelet adjustment"}
          </Description>
          {kind === "leather" && (
            <>
              <Variations
                showTitle={false}
                variations={
                  selectedCustomization === "engraved"
                    ? engravedVariations
                    : regularVariations
                }
              />
              <Error $inline id="leather-size-error-message">
                {!!errors.leatherSize && errors.leatherSize.message}
              </Error>
            </>
          )}
          {kind === "metal" && (
            <>
              <InputContainer style={{ margin: "0 0 30px" }}>
                <Fieldset>
                  <CheckboxInput
                    type="radio"
                    label="Exact fit"
                    name="fit"
                    value="exact"
                  />
                  <CheckboxInput
                    type="radio"
                    label="Loose fit"
                    name="fit"
                    value="loose"
                  />
                </Fieldset>
                <Error style={{ padding: 0 }}>
                  {!!errors.fit && errors.fit.message}
                </Error>
              </InputContainer>
              <div>
                <DropdownInput
                  optionPlaceholder={{
                    name: `Select a size`,
                    value: "",
                  }}
                  options={SIZES[unit].map(size => ({
                    name: size[unit],
                    value: size[unit],
                  }))}
                  name="size"
                />
              </div>
            </>
          )}
        </div>
        <div>
          <StaticImage
            alt="How to measure"
            src="../../images/mock/how-to-measure.jpg"
          />
          <PromptBox>
            <Prompt
              type="button"
              onClick={() => setModalOpen(prevState => !prevState)}
            >
              Size Guide
            </Prompt>
          </PromptBox>
        </div>
      </ModalBody>
      {modalOpen && (
        <SizeGuideContentModal
          unit={unit}
          setUnit={setUnit}
          handleClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

function AddEngraving() {
  const [modalOpen, setModalOpen] = useState(false)
  const {
    state: { selectedSize },
    setCustomization,
  } = useProduct()
  const {
    colour,
    kind,
    regularVariations,
    engravedVariations,
  } = useProductContent()
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext()
  const addEngraving = watch("addEngraving")
  const engravingMessage = watch("engravingMessage")
  const { selected: selectedCurrency } = useCurrency()

  useEffect(() => {
    if (engravingMessage !== "" && addEngraving !== true) {
      console.log(
        "[DEBUG] engraving message has a value and add engraving is false"
      )
      setValue("addEngraving", true)
    }

    // CAREFUL: true is represented as both boolean and string here
    setCustomization(
      addEngraving ? "engraved" : "regular",
      addEngraving ? engravedVariations : regularVariations
    )

    // when modal closes, reset the variation to regular
    return () => setCustomization("regular", regularVariations)
  }, [addEngraving, engravingMessage, setValue])

  return (
    <>
      <ModalBody>
        <div>
          <Legend>Get It Engraved</Legend>
          <Description>Make it meaningful with personalization</Description>
          <Fieldset style={{ margin: "0 0 30px" }}>
            <CheckboxInput
              type="checkbox"
              name="addEngraving"
              label={`Add engraving (+$${
                selectedCurrency === "USD" ? `150` : `200`
              } ${selectedCurrency})`}
              value={true}
            />
          </Fieldset>
          <TextInput
            name="engravingMessage"
            label="Enter message"
            type="text"
            placeholder="Enter message"
            maxLength="8"
          />
          <Message>Up to 8 characters or numbers</Message>
        </div>
        <EngravingBox>
          {colour === "gold" && kind === "metal" ? (
            <StaticImage
              alt="Engraving preview"
              src="../../images/mock/engraved-watch-back-gold.jpg"
            />
          ) : colour === "white" && kind === "metal" ? (
            <StaticImage
              alt="Engraving preview"
              src="../../images/mock/engraved-watch-back-white.jpg"
            />
          ) : colour === "black" && kind === "metal" ? (
            <StaticImage
              alt="Engraving preview"
              src="../../images/mock/engraved-watch-back-black.jpg"
            />
          ) : colour === "black" && kind === "leather" ? (
            <StaticImage
              alt="Engraving preview"
              src="../../images/mock/engraved-watch-back-leather.jpg"
            />
          ) : colour === "white" && kind === "leather" ? (
            <StaticImage
              alt="Engraving preview"
              src="../../images/mock/engraved-watch-back-leather-white.jpg"
            />
          ) : null}
          <EngravingMessage
            dangerouslySetInnerHTML={{ __html: engravingMessage }}
          />
          <PromptBox>
            <Prompt
              type="button"
              onClick={() => setModalOpen(prevState => !prevState)}
            >
              Engraving Ideas
            </Prompt>
          </PromptBox>
        </EngravingBox>
      </ModalBody>
      {modalOpen && (
        <EngravingIdeasModal handleClose={() => setModalOpen(false)} />
      )}
    </>
  )
}

export default function CustomizeModal() {
  const containerRef = useRef(null)
  const { dispatchLayout } = useLayout()
  const { setVariation } = useProduct()
  const { product, kind, isPreOrder } = useProductContent()
  const {
    state: { selectedVariation },
  } = useProduct()
  const { selected: selectedCurrency } = useCurrency()
  const [addToCart, { loading, error }] = useAddToCart()
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      kind,
      size: "",
      unit: "mm",
      fit: "",
      addEngraving: false,
      engravingMessage: "",
    },
    resolver: yupResolver(
      Yup.object({
        kind: Yup.string()
          .required()
          .oneOf(["metal", "leather"]),
        size: Yup.string()
          .nullable()
          .when(["kind", "addEngraving"], {
            is: (kind, addEngraving) =>
              kind === "metal" && addEngraving === false,
            then: schema =>
              schema.required("Select a wrist size for custom fit"),
          }),
        unit: Yup.string(),
        fit: Yup.string().when(["kind", "addEngraving"], {
          is: (kind, addEngraving) =>
            kind === "metal" && addEngraving === false,
          then: schema =>
            schema.required("Select a sizing type for custom fit"),
        }),
        addEngraving: Yup.boolean(),
        engravingMessage: Yup.string()
          .matches(
            /^[ -~]*$/,
            "Engraving must be keyboard characters only (no emojis)"
          )
          .max(8, "Engraving cannot be more than 8 characters")
          .when("addEngraving", {
            is: true,
            then: schema =>
              schema.required(
                "A message is required when Add Engraving is checked"
              ),
            otherwise: schema => schema.notRequired(),
          }),
      })
    ),
  })

  const onSubmit = async formData => {
    // 1. Check all data is present
    if (selectedVariation === 0) {
      methods.setError("leatherSize", {
        type: "required",
        message: "Please select a size",
      })

      const scrollContainer = containerRef.current?.parentNode
      scrollContainer.scrollTop = 0

      return

      // throw new Error("[Error] No product variation selected")
    }

    const variables = {
      input: {
        productId: product.databaseId,
        ...(selectedVariation && {
          variationId: selectedVariation,
        }),
        quantity: 1,
        extraData: JSON.stringify({
          dateAdded: new Date(),
          ...(formData.size && { size: formData.size }),
          ...(formData.fit && { fit: formData.fit }),
          addEngraving: formData.addEngraving ? "true" : "false",
          ...(formData.engravingMessage && {
            engravingMessage: formData.engravingMessage,
          }),
        }),
      },
    }
    console.log("[DEBUG] submitting with variables", variables)

    try {
      const { data, errors } = await addToCart({
        variables,
      })

      if (errors) {
        console.error(errors)
        // @TODO - display the form's API response error for the user
      }

      if (data && !errors) {
        const {
          addToCart: {
            cartItem: {
              product: { node: product },
            },
          },
        } = data

        if (product) {
          trackAddToCart(
            { ...product, uri: window?.location?.pathname },
            1,
            selectedCurrency
          )
          setVariation(0, "") // Reset global state
          dispatchLayout({ type: LAYOUT_STATE.modal, payload: false })
          dispatchLayout({ type: LAYOUT_STATE.cart, payload: true })
          typeof window !== "undefined" &&
            setTimeout(() => window.scrollTo(0, 0), 100) // a bit of delay
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={container}
      ref={containerRef}
    >
      <CloseButton
        type="button"
        onClick={() =>
          dispatchLayout({ type: LAYOUT_STATE.modal, payload: false })
        }
      >
        <CloseIcon />
      </CloseButton>
      <Header>
        <LogoSmall style={{ height: "25px", marginBottom: "40px" }} />
        <Heading>Customize Your Watch</Heading>
      </Header>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CustomizeFit />
          <Divider />
          <AddEngraving />
          <div style={{ margin: "0 auto", maxWidth: "350px" }}>
            <ButtonAsButton flex type="submit">
              {methods.formState.isSubmitting
                ? `Adding...`
                : isPreOrder
                ? `Pre-Order`
                : `Add To Bag`}
            </ButtonAsButton>
            {error && <Error>{processError(error.message)}</Error>}
            <Disclaimer>
              Note: All customized items are final sale and expect ~2-3 weeks
              delivery time for personalized engraving
            </Disclaimer>
            {/* <Error>
              <pre>{JSON.stringify(methods.formState?.errors, null, 2)}</pre>
            </Error> */}
          </div>
        </form>
      </FormProvider>
    </Container>
  )
}
