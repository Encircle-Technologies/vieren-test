import React, {
  createContext,
  useContext,
  useRef,
  useReducer,
  useEffect,
} from "react"

const LayoutContext = createContext(null)

export const LayoutProvider = ({ children }) => (
  <LayoutContext.Provider value={useProvideLayout()}>
    {children}
  </LayoutContext.Provider>
)

export const useLayout = () => useContext(LayoutContext)

export const LAYOUT_STATE = {
  cart: "cartOpen",
  search: "searchOpen",
  modal: "modalOpen",
}

function contextStateReducer(state, action) {
  switch (action.type) {
    case "modalOpen": {
      if (typeof action.payload !== "boolean") {
        return {
          ...state,
          modalOpen: !state.modalOpen,
          modalType: state.modalOpen ? "" : action.payload,
        }
      } else {
        return {
          ...state,
          modalOpen: action.payload,
          modalType: "",
        }
      }
    }
    case "cartOpen":
    case "searchOpen":
      return {
        ...state,
        [action.type]:
          typeof action.payload === "boolean"
            ? action.payload
            : !state[action.type],
      }
    case "reset":
      return initialState
    default:
      throw new Error("[Error] Unhandled Layout context dispatch action")
  }
}

const initialState = {
  cartOpen: false,
  searchOpen: false,
  modalOpen: false,
  modalType: "",
}

const useProvideLayout = () => {
  const [layoutState, dispatchLayout] = useReducer(
    contextStateReducer,
    initialState
  )
  const modalCount = useRef(0)
  const scrollPosition = useRef(0)

  const isBrowser = typeof window !== "undefined"
  const hasDocument = typeof document !== "undefined"

  // const exitReady = useRef(false)

  // const exitCount = useRef(0)

  // useEffect(() => {
  //   setTimeout(() => (exitReady.current = true), 5000)
  // }, [])

  // useEffect(() => {
  //   const handleExitIntent = e => {
  //     if (
  //       !e.toElement &&
  //       !e.relatedTarget &&
  //       cartOpen === false &&
  //       exitReady.current === true
  //     ) {
  //       if (exitCount.current < 1) setModalOpen(true)
  //       exitCount.current++
  //     }
  //   }

  //   document.addEventListener("mouseout", handleExitIntent)

  //   return () => document.removeEventListener("mouseout", handleExitIntent)
  // }, [cartOpen])

  // useEffect(() => {
  //   const handleMobileExitIntent = e => {
  //     const current =
  //       document.body.scrollTop || document.documentElement.scrollTop
  //     const height =
  //       document.documentElement.scrollHeight -
  //       document.documentElement.clientHeight

  //     const scrollProgress = (current / height) * 100

  //     if (
  //       scrollProgress >= 69 &&
  //       cartOpen === false &&
  //       exitReady.current === true
  //     ) {
  //       if (exitCount.current < 1) setModalOpen(true)
  //       exitCount.current++
  //     }
  //   }

  //   if (!isDesktop) {
  //     document.addEventListener("scroll", handleMobileExitIntent)
  //   } else {
  //     document.removeEventListener("scroll", handleMobileExitIntent)
  //   }

  //   return () => document.removeEventListener("scroll", handleMobileExitIntent)
  // }, [isDesktop, cartOpen])

  useEffect(() => {
    if (layoutState.modalOpen === true) {
      // grabs the current scroll position
      scrollPosition.current = isBrowser && window.scrollY
      // removes the scroll bar when modal is open by setting position: fixed
      hasDocument &&
        document.body.setAttribute(
          "style",
          `position: fixed; top: -${scrollPosition.current}px; left: 0; right: 0;`
        )
    }

    if (layoutState.modalOpen === false) {
      // clears the fixed position
      hasDocument && document.body.setAttribute("style", "")
      // scrolls to the position
      isBrowser && window.scrollTo(0, scrollPosition.current)
      // resets the scroll position
      scrollPosition.current = 0
    }
  }, [layoutState, hasDocument, isBrowser])

  process.env.NODE_ENV === "development" &&
    console.log("[rerender] Layout Context")

  return { layoutState, dispatchLayout, modalCount }
}
