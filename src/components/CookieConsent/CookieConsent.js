// src/components/CookieBanner.tsx
import React, { useEffect, useState } from "react"
import CookieConsent, { Cookies } from "react-cookie-consent"
import { Link } from "gatsby"

const CookieBanner = () => {

  useEffect(() => {
    loadTrackingScripts()
  }, [])

  const loadTrackingScripts = () => {
    const gaScript = document.createElement("script")
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=GTM-K6TF9CT"
    gaScript.async = true
    document.head.appendChild(gaScript)

    const gaInit = document.createElement("script")
    gaInit.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GTM-K6TF9CT');
    `
    document.head.appendChild(gaInit)
  }
  const buttonStyle = {
    opacity: 1,
    width: "170px",
    background: "#000000",
    borderRadius: "1px",
    padding: "10px 20px",
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "Lato",
    fontSize: "14px",
    fontWeight: 400,
    fontStyle: "Regular",
    letterSpacing: "0,47px",
    textAlign: "center",
    textTransform: "uppercase",
  }
  return (
    <CookieConsent
      location="bottom"
      buttonText="ACCEPT"
      cookieName="CookieConsent"
      style={{
        width: "94%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#4D4D4D",
        zIndex: 10000,
        fontFamily: "Lato",
        fontSize: "16px",
        alignItems: "center",
        padding: "20px 25px"
      }}
      buttonStyle={buttonStyle}
      customButtonWrapperAttributes={{ style: { marginLeft: "auto", marginRight: "auto" } }}
      overlay={false}
    >
      We use cookies to enhance your experience. By using our site, you accept our use of cookies.
      For more details, see our <Link to="/privacy/" style={{ textDecoration: "underline" }}>Privacy Policy.</Link>
    </CookieConsent>
  )
}

export default CookieBanner
