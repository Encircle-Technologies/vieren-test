import React, { useState, useRef, useEffect, useCallback } from "react"
import ReactDOM from "react-dom"
import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import { useEmblaCarousel } from "embla-carousel/react"
import CloseIcon from "../../images/icons/menu-close.svg"

import { getCountdown } from "../Elements/Countdown"

const Container = styled.aside`
  background-color: var(--black);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 38px;
  position: relative;
  width: 100%;

  .viewport {
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    width: 100%;

    @media (min-width: 800px) {
      width: 375px;
    }
  }

  .viewport.is-draggable {
    cursor: move;
    cursor: grab;
  }

  .viewport.is-dragging {
    cursor: grabbing;
  }
`

const Track = styled.div`
  display: flex;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Message = styled.div`
  color: var(--white);
  /* display: block; */
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  min-width: 100%;
  position: relative;
  text-align: center;

  a {
    color: var(--white);
    text-decoration: underline;
  }
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  padding: 0;
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
`

const CountUnit = styled.span`
  margin: 0 0.75ch;

  &:last-child {
    margin: 0 0 0 0.75ch;
  }
`

const InlineCountdownMessage = ({ count }) => {
  if (count)
    return (
      <>
        {count.days >= 2 && (
          <>
            <span>{count.days}</span>
            <CountUnit>days</CountUnit>
          </>
        )}
        <span>
          {count.days < 2 ? count.days * 24 + count.hours : count.hours}
        </span>
        <CountUnit>hrs</CountUnit>
        <span>{count.minutes}</span>
        <CountUnit>min</CountUnit>
        {count.days < 2 && (
          <>
            <span>{count.seconds}</span>
            <CountUnit>sec</CountUnit>
          </>
        )}
      </>
    )

  return null
}

function MessageFn({ message }) {
  const contentRef = useRef(null)
  const [countdownEl, setCountdownEl] = useState(null)
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (contentRef.current) {
      const countdownRef = contentRef.current.querySelector(
        ".site-message-countdown"
      )

      if (countdownRef) setCountdownEl(countdownRef)
    }
  }, [])

  useEffect(() => {
    let timer
    if (countdownEl) {
      timer = setInterval(() => {
        const updatedCount = getCountdown(countdownEl.dataset.countdownEndDate)

        setCount(updatedCount)
      }, [1000])
    }

    return () => clearInterval(timer)
  }, [countdownEl, setCount])

  return (
    <>
      <Message
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: message.acf.content }}
      />
      {countdownEl &&
        ReactDOM.createPortal(
          <InlineCountdownMessage count={count} />,
          countdownEl
        )}
    </>
  )
}

export default function SiteMessage({ handleClose }) {
  const {
    allWpSiteMessage: { nodes: messages },
  } = useStaticQuery(graphql`
    query GET_SITE_MESSAGES {
      allWpSiteMessage(sort: { date: DESC }) {
        nodes {
          id
          title
          acf {
            content
          }
        }
      }
    }
  `)

  const [ref, inView] = useInView({
    threshold: 0,
  })

  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    containScroll: "trimSnaps",
    loop: true,
  })

  const autoplay = useCallback(() => {
    if (!embla) return
    if (embla.canScrollNext()) {
      embla.scrollNext()
    } else {
      embla.scrollTo(0)
    }
  }, [embla])

  const { play, stop } = useRecursiveTimeout(autoplay, 8000)

  useEffect(() => {
    if (!embla) return
    embla.on("pointerDown", stop)
  }, [embla, stop])

  useEffect(() => {
    if (inView) {
      play()
    } else {
      stop()
    }
  }, [play, stop, inView])

  const hasMessages = messages.length > 0

  if (hasMessages)
    return (
      <Container ref={ref}>
        <EmblaCarouselReact className="viewport">
          <Track>
            {messages.map((message, index) => (
              <MessageFn key={index} message={message} />
            ))}
          </Track>
        </EmblaCarouselReact>

        <Button onClick={() => handleClose()} aria-label="Close Site Message">
          <CloseIcon style={{ height: "13px", width: "auto" }} />
        </Button>
      </Container>
    )

  return null
}
